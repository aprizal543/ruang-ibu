import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BottomTabBar from '../../components/layout/BottomTabBar'
import { audioTracks, getAudioTrack, type AudioTrack } from '../../content/audioTracks'
import { RelaxationContext, type RelaxationContextValue } from './RelaxationPlaybackContext'
import './relaxation-experience.css'

function routeTrackId(pathname: string) {
  const match = pathname.match(/^\/relaksasi\/([^/]+)\/?$/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export default function RelaxationExperience() {
  const location = useLocation()
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)
  const pendingContinueRef = useRef(false)
  const activeTrackRef = useRef<AudioTrack | null>(null)
  const routeTrack = useMemo(() => {
    const id = routeTrackId(location.pathname)
    return id ? getAudioTrack(id) ?? null : null
  }, [location.pathname])
  const [selectedTrack, setSelectedTrack] = useState<AudioTrack | null>(null)
  const track = routeTrack ?? selectedTrack
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeValue] = useState(0.72)
  const isImmersive = Boolean(routeTrackId(location.pathname))

  useEffect(() => {
    activeTrackRef.current = track
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const onDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onPlay = () => { setPlaying(true); setFailed(false); setLoading(false) }
    const onPause = () => setPlaying(false)
    const onWaiting = () => setLoading(true)
    const onCanPlay = () => {
      setLoading(false)
      setFailed(false)
      if (pendingContinueRef.current) {
        pendingContinueRef.current = false
        void audio.play().catch(() => { setPlaying(false); setFailed(true); setLoading(false) })
      }
    }
    const onError = () => { setLoading(false); setFailed(true); setPlaying(false); pendingContinueRef.current = false }
    const onEnded = () => { setPlaying(false); setCurrentTime(Number.isFinite(audio.duration) ? audio.duration : currentTime) }
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    audio.addEventListener('ended', onEnded)
    audio.volume = volume
    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('ended', onEnded)
    }
    // The listener set is tied to this persistent audio element, not changing playback state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    if (activeTrackRef.current?.id === track.id && audio.getAttribute('src') === track.src) return
    setCurrentTime(0)
    setDuration(track.durationSeconds)
    setFailed(false)
    setLoading(false)
    if (audio.getAttribute('src') !== track.src) {
      audio.pause()
      audio.src = track.src
      audio.load()
    }
    // When a user switches tracks while listening, continue the explicit playback session.
    if (pendingContinueRef.current && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      pendingContinueRef.current = false
      void audio.play().catch(() => { setPlaying(false); setFailed(true); setLoading(false) })
    }
  }, [track?.id, track?.src, track?.durationSeconds])

  useEffect(() => {
    if (routeTrack && selectedTrack?.id !== routeTrack.id) setSelectedTrack(routeTrack)
  }, [routeTrack, selectedTrack?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  useEffect(() => {
    document.title = isImmersive && track ? `${track.title} · Relaksasi · Ruang Ibu` : 'Relaksasi · Ruang Ibu'
  }, [isImmersive, track?.title])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  const selectTrack = useCallback((nextTrack: AudioTrack) => {
    pendingContinueRef.current = false
    setSelectedTrack(nextTrack)
  }, [])

  const togglePlayback = useCallback((requestedTrack?: AudioTrack) => {
    const audio = audioRef.current
    const nextTrack = requestedTrack ?? activeTrackRef.current
    if (!audio || !nextTrack) return
    if (activeTrackRef.current?.id !== nextTrack.id) {
      pendingContinueRef.current = false
      setSelectedTrack(nextTrack)
      audio.pause()
      audio.src = nextTrack.src
      audio.load()
    } else if (failed) {
      audio.load()
    }
    if (!audio.paused && activeTrackRef.current?.id === nextTrack.id) {
      audio.pause()
      return
    }
    setFailed(false)
    setLoading(true)
    audio.volume = volume
    void audio.play().catch(() => { setPlaying(false); setLoading(false); setFailed(true) })
  }, [failed, volume])

  const skip = useCallback((direction: -1 | 1) => {
    const current = activeTrackRef.current
    if (!current) return
    const currentIndex = audioTracks.findIndex((item) => item.id === current.id)
    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= audioTracks.length) return
    const nextTrack = audioTracks[nextIndex]
    const audio = audioRef.current
    pendingContinueRef.current = Boolean(audio && !audio.paused)
    setSelectedTrack(nextTrack)
    navigate(`/relaksasi/${nextTrack.id}`)
  }, [navigate])

  const seek = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    audio.currentTime = Math.min(Math.max(value, 0), audio.duration)
    setCurrentTime(audio.currentTime)
  }, [])

  const setVolume = useCallback((value: number) => setVolumeValue(Math.min(1, Math.max(0, value))), [])

  const context = useMemo<RelaxationContextValue>(() => ({
    track, playing, loading, failed, currentTime, duration, volume,
    selectTrack, togglePlayback, skip, seek, setVolume,
  }), [track, playing, loading, failed, currentTime, duration, volume, selectTrack, togglePlayback, skip, seek, setVolume])

  return (
    <RelaxationContext.Provider value={context}>
      <div className={`relaxation-experience${isImmersive ? ' is-immersive' : ''}`}>
        <audio ref={audioRef} preload="none" aria-hidden="true" />
        <Outlet context={context} />
        {!isImmersive && <BottomTabBar />}
      </div>
    </RelaxationContext.Provider>
  )
}
