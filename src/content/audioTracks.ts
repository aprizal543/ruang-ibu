export interface AudioTrack {
  id: 'rain' | 'waves' | 'ambient'
  title: string
  description: string
  category: 'nature' | 'music'
  src: string
  durationSeconds: number
  sourceTitle: string
  credit: string
  modification: string
  sourceUrl: string
  license: string
  licenseUrl: string
}

export const audioTracks: AudioTrack[] = [
  {
    id: 'rain',
    title: 'Hujan Lembut',
    description: 'Suara hujan yang tenang',
    category: 'nature',
    src: '/audio/soft-rain.mp3',
    durationSeconds: 60,
    sourceTitle: 'Sound of light rainfall',
    credit: 'Mijesty',
    modification: 'Konversi format Ogg Vorbis ke MP3; tanpa remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sound_of_light_rainfall.ogg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 'waves',
    title: 'Air di Bebatuan',
    description: 'Suara alam dari tepi danau',
    category: 'nature',
    src: '/audio/water-on-rocks.mp3',
    durationSeconds: 155,
    sourceTitle: 'Water on Rocks',
    credit: 'Dsw4',
    modification: 'Konversi format Ogg Vorbis ke MP3; tanpa remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Water_on_Rocks.ogg',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    id: 'ambient',
    title: 'Musik Instrumental',
    description: 'Ambient instrumental lembut',
    category: 'music',
    src: '/audio/ambient-instrumental.mp3',
    durationSeconds: 198,
    sourceTitle: 'Ambient music test, Yamaha CK61',
    credit: 'Wilfredor',
    modification: 'Konversi format FLAC ke MP3; tanpa remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ambient_music_test,_Yamaha_CK61.flac',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
]

export function getAudioTrack(id: string) {
  return audioTracks.find((track) => track.id === id)
}
