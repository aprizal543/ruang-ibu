import { createContext, useContext } from 'react'
import type { AudioTrack } from '../../content/audioTracks'

export type RelaxationContextValue = {
  track: AudioTrack | null
  playing: boolean
  loading: boolean
  failed: boolean
  currentTime: number
  duration: number
  volume: number
  selectTrack: (track: AudioTrack) => void
  togglePlayback: (track?: AudioTrack) => void
  skip: (direction: -1 | 1) => void
  seek: (value: number) => void
  setVolume: (value: number) => void
}

export const RelaxationContext = createContext<RelaxationContextValue | null>(null)

export function useRelaxationPlayback() {
  const value = useContext(RelaxationContext)
  if (!value) throw new Error('useRelaxationPlayback must be used inside RelaxationExperience')
  return value
}
