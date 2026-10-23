import { useEffect, useState } from 'react'
import { ArrowLeftIcon, MusicNotesIcon, WaveformIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import AudioPlayer from '../components/audio/AudioPlayer'
import BottomTabBar from '../components/layout/BottomTabBar'
import { audioTracks, type AudioTrack } from '../content/audioTracks'
import '../styles/relaxation-page.css'

export default function RelaxationPage() {
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null)

  useEffect(() => { document.title = 'Ruang Tenang untuk Ibu · Ruang Ibu' }, [])

  return (
    <div className="relaxation-page">
      <header className="relaxation-page__header">
        <Link to="/" aria-label="Kembali ke Beranda"><ArrowLeftIcon size={22} weight="regular" aria-hidden="true" /></Link>
        <span>Relaksasi</span>
        <span aria-hidden="true" />
      </header>
      <main className="relaxation-page__main">
        <section className="relaxation-page__intro" aria-labelledby="relaxation-title">
          <img src="/therapy-botanical.svg" alt="" aria-hidden="true" />
          <p className="relaxation-page__eyebrow">RUANG IBU</p>
          <h1 id="relaxation-title">Ruang Tenang untuk Ibu</h1>
          <p>Pilih suara alam atau musik instrumental yang ingin Ibu dengarkan. Audio ini untuk menemani suasana, bukan panduan atau terapi klinis.</p>
        </section>

        <section className="relaxation-page__collection" aria-labelledby="audio-collection-title">
          <h2 id="audio-collection-title">Pilihan audio</h2>
          <ul>
            {audioTracks.map((track) => {
              const Icon = track.category === 'nature' ? WaveformIcon : MusicNotesIcon
              const selected = selectedTrack?.id === track.id
              return (
                <li key={track.id}>
                  <button
                    type="button"
                    className={`relaxation-page__track${selected ? ' is-selected' : ''}`}
                    onClick={() => setSelectedTrack(track)}
                    aria-pressed={selected}
                    data-audio-track={track.id}
                  >
                    <span className="relaxation-page__track-icon"><Icon size={22} weight="light" aria-hidden="true" /></span>
                    <span className="relaxation-page__track-copy"><strong>{track.title}</strong><span>{track.description}</span></span>
                    <span className="relaxation-page__track-duration">{Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2, '0')}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {selectedTrack && <AudioPlayer key={selectedTrack.id} track={selectedTrack} />}
          <p className="relaxation-page__note">Pemutaran tidak dimulai otomatis. Ibu dapat menjeda atau berhenti kapan saja.</p>
        </section>
        <div className="relaxation-page__credit" aria-label="Kredit, sumber, dan lisensi audio">
          <p>Sumber dan lisensi audio:</p>
          <ul>
            {audioTracks.map((track) => (
              <li key={track.id}>
                <a href={track.sourceUrl} target="_blank" rel="noreferrer">{track.sourceTitle}</a> — {track.credit}. {track.modification} Lisensi <a href={track.licenseUrl} target="_blank" rel="noreferrer">{track.license}</a>.
              </li>
            ))}
          </ul>
          <p>Audio Hujan Lembut dibagikan sebagai berkas turunan berlisensi CC BY-SA 4.0. Ketentuan lisensi ini dicatat untuk berkas audio tersebut.</p>
        </div>
      </main>
      <BottomTabBar />
    </div>
  )
}
