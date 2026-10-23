import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon, SpeakerHighIcon } from '@phosphor-icons/react'
import type { AudioTrack } from '../../content/audioTracks'
import '../../styles/audio-player.css'

let currentAudio: HTMLAudioElement | null = null

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const wholeSeconds = Math.floor(seconds)
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`
}

export default function AudioPlayer({ track }: { track: AudioTrack }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.75)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateTime = () => setCurrentTime(audio.currentTime || 0)
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : track.durationSeconds)
    const markLoading = () => setLoading(true)
    const markReady = () => { setLoading(false); setFailed(false) }
    const markError = () => { setLoading(false); setFailed(true); setPlaying(false) }
    const markEnded = () => setPlaying(false)
    const markPaused = () => setPlaying(false)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('waiting', markLoading)
    audio.addEventListener('canplay', markReady)
    audio.addEventListener('error', markError)
    audio.addEventListener('ended', markEnded)
    audio.addEventListener('pause', markPaused)
    audio.volume = volume
    return () => {
      audio.pause()
      if (currentAudio === audio) currentAudio = null
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('waiting', markLoading)
      audio.removeEventListener('canplay', markReady)
      audio.removeEventListener('error', markError)
      audio.removeEventListener('ended', markEnded)
      audio.removeEventListener('pause', markPaused)
    }
  }, [track.durationSeconds])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      setPlaying(false)
      return
    }
    if (currentAudio && currentAudio !== audio) currentAudio.pause()
    currentAudio = audio
    setFailed(false)
    setLoading(true)
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
      setLoading(false)
      setFailed(true)
    }
  }

  function seek(value: string) {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = (Number(value) / 100) * audio.duration
    setCurrentTime(audio.currentTime)
  }

  function changeVolume(value: string) {
    const nextVolume = Number(value) / 100
    setVolume(nextVolume)
    if (audioRef.current) audioRef.current.volume = nextVolume
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player" data-audio-player>
      <audio ref={audioRef} src={track.src} preload="none" autoPlay={false} />
      <button
        className="audio-player__play"
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? `Jeda ${track.title}` : `Putar ${track.title}`}
        aria-pressed={playing}
        data-audio-play
      >
        {playing ? <PauseIcon size={20} weight="fill" aria-hidden="true" /> : <PlayIcon size={20} weight="fill" aria-hidden="true" />}
      </button>
      <div className="audio-player__main">
        <div className="audio-player__meta">
          <strong>{track.title}</strong>
          <span aria-live="polite">{failed ? 'Audio tidak dapat diputar' : loading ? 'Memuat audio…' : playing ? 'Sedang diputar' : 'Siap diputar'}</span>
        </div>
        {failed && <p className="audio-player__error" role="alert">Audio tidak dapat dimuat. Jika Ibu sedang offline, sambungkan kembali ke internet, lalu coba lagi.</p>}
        <div className="audio-player__timeline">
          <label className="sr-only" htmlFor={`seek-${track.id}`}>Posisi audio {track.title}</label>
          <input
            id={`seek-${track.id}`}
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => seek(event.currentTarget.value)}
            aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration || track.durationSeconds)}`}
            data-audio-seek
          />
          <span>{formatTime(currentTime)} / {formatTime(duration || track.durationSeconds)}</span>
        </div>
        <div className="audio-player__volume">
          <SpeakerHighIcon size={17} weight="regular" aria-hidden="true" />
          <label className="sr-only" htmlFor={`volume-${track.id}`}>Volume audio {track.title}</label>
          <input id={`volume-${track.id}`} type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={(event) => changeVolume(event.currentTarget.value)} data-audio-volume />
        </div>
      </div>
    </div>
  )
}
