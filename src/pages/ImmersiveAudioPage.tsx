import { ArrowLeftIcon, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import { audioTracks, getAudioTrack } from '../content/audioTracks'
import { useRelaxationPlayback } from '../features/relaxation/RelaxationPlaybackContext'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export default function ImmersiveAudioPage() {
  const { trackId = '' } = useParams()
  const requestedTrack = getAudioTrack(trackId)
  const { track, playing, loading, failed, currentTime, duration, volume, togglePlayback, skip, seek, setVolume } = useRelaxationPlayback()
  const displayedTrack = requestedTrack && track?.id === requestedTrack.id ? track : requestedTrack

  if (!displayedTrack) {
    return (
      <main className="immersive-player immersive-player--missing">
        <Link to="/relaksasi" className="immersive-player__back"><ArrowLeftIcon size={22} aria-hidden="true" /> Kembali ke Relaksasi</Link>
        <h1>Audio tidak ditemukan</h1>
        <p>Pilihan audio ini tidak tersedia. Ibu dapat kembali ke koleksi Relaksasi.</p>
      </main>
    )
  }

  const isCurrent = track?.id === displayedTrack.id
  const actualDuration = isCurrent && duration > 0 ? duration : displayedTrack.durationSeconds
  const actualTime = isCurrent ? currentTime : 0
  const isPlaying = isCurrent && playing
  const isLoading = isCurrent && loading
  const hasFailed = isCurrent && failed

  return (
    <main className={`immersive-player${isPlaying ? ' is-playing' : ''}`} style={{ '--player-image': `url("${displayedTrack.backgroundSrc}")` } as React.CSSProperties}>
      <div className="immersive-player__photo" aria-hidden="true"><img src={displayedTrack.backgroundSrc} alt="" width="1080" height="1920" fetchPriority="high" /></div>
      <div className="immersive-player__shade" aria-hidden="true" />
      <header className="immersive-player__header">
        <Link to="/relaksasi" className="immersive-player__back" aria-label="Kembali ke koleksi Relaksasi"><ArrowLeftIcon size={22} weight="regular" aria-hidden="true" /></Link>
        <span>SEDANG DIDENGARKAN</span>
      </header>

      <section className="immersive-player__content" aria-label="Pemutar audio">
        <div className="immersive-player__track-copy">
          <p className="immersive-player__eyebrow">RUANG TENANG UNTUK IBU</p>
          <h1>{displayedTrack.title}</h1>
          <p>{displayedTrack.description}</p>
        </div>

        <div className="immersive-player__timeline">
          <label className="sr-only" htmlFor="immersive-seek">Posisi audio {displayedTrack.title}</label>
          <input
            id="immersive-seek"
            type="range"
            min="0"
            max={Math.max(actualDuration, 0.1)}
            step="0.1"
            value={Math.min(actualTime, actualDuration)}
            onChange={(event) => seek(Number(event.currentTarget.value))}
            aria-valuetext={`${formatTime(actualTime)} dari ${formatTime(actualDuration)}`}
            disabled={!isCurrent || actualDuration <= 0}
          />
          <div><span>{formatTime(actualTime)}</span><span>{formatTime(actualDuration)}</span></div>
        </div>

        <div className="immersive-player__controls" aria-label="Kontrol pemutar">
          <button type="button" className="immersive-player__skip immersive-player__previous" onClick={() => skip(-1)} disabled={audioTrackIndex(displayedTrack.id) === 0} aria-label="Audio sebelumnya"><SkipBackIcon size={25} weight="regular" aria-hidden="true" /></button>
          <button type="button" className="immersive-player__play" onClick={() => togglePlayback(displayedTrack)} aria-label={isPlaying ? 'Jeda audio' : 'Putar audio'} aria-pressed={isPlaying} disabled={!isCurrent && isLoading}>
            {isLoading ? <span className="immersive-player__spinner" aria-hidden="true" /> : isPlaying ? <PauseIcon size={28} weight="fill" aria-hidden="true" /> : <PlayIcon size={28} weight="fill" aria-hidden="true" />}
          </button>
          <button type="button" className="immersive-player__skip immersive-player__next" onClick={() => skip(1)} disabled={audioTrackIndex(displayedTrack.id) === audioTracks.length - 1} aria-label="Audio berikutnya"><SkipForwardIcon size={25} weight="regular" aria-hidden="true" /></button>
        </div>

        <div className="immersive-player__volume">
          <SpeakerHighIcon size={18} aria-hidden="true" />
          <label className="sr-only" htmlFor="immersive-volume">Volume audio</label>
          <input id="immersive-volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.currentTarget.value))} aria-valuetext={`${Math.round(volume * 100)} persen`} />
          <span className="immersive-player__status" aria-live="polite">{hasFailed ? 'Audio tidak dapat dimuat' : isLoading ? 'Memuat audio…' : isPlaying ? 'Sedang diputar' : 'Dijeda'}</span>
        </div>
        {hasFailed && <p className="immersive-player__error" role="alert">Audio tidak dapat dimuat. Periksa koneksi Ibu, lalu coba putar kembali.</p>}
      </section>
    </main>
  )
}

function audioTrackIndex(id: string) {
  return audioTracks.findIndex((track) => track.id === id)
}
