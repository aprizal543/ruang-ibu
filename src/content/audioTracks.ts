export interface AudioTrack {
  id: 'rain' | 'waves' | 'ambient' | 'gymnopedie' | 'years-grow-quiet' | 'wholesome' | 'avec-soin' | 'friday-morning'
  title: string
  description: string
  category: 'nature' | 'music'
  src: string
  thumbnailSrc: string
  backgroundSrc: string
  durationSeconds: number
  originalFileName: string
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
    thumbnailSrc: '/images/relaxation/rain-thumb.webp',
    backgroundSrc: '/images/relaxation/rain-background.webp',
    durationSeconds: 60,
    originalFileName: 'sound-of-light-rainfall.ogg',
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
    thumbnailSrc: '/images/relaxation/water-thumb.webp',
    backgroundSrc: '/images/relaxation/water-background.webp',
    durationSeconds: 155,
    originalFileName: 'water-on-rocks.ogg',
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
    thumbnailSrc: '/images/relaxation/music-thumb.webp',
    backgroundSrc: '/images/relaxation/music-background.webp',
    durationSeconds: 198,
    originalFileName: 'ambient-music-test-yamaha-ck61.flac',
    sourceTitle: 'Ambient music test, Yamaha CK61',
    credit: 'Wilfredor',
    modification: 'Konversi format FLAC ke MP3; tanpa remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ambient_music_test,_Yamaha_CK61.flac',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    id: 'gymnopedie',
    title: 'Gymnopédie No. 1',
    description: 'Piano solo dengan alunan yang tenang',
    category: 'music',
    src: '/audio/gymnopedie-no-1.mp3',
    thumbnailSrc: '/images/relaxation/music-thumb.webp',
    backgroundSrc: '/images/relaxation/music-background.webp',
    durationSeconds: 187.08898,
    originalFileName: 'Gymnopedie_No._1_(ISRC_USUAN1100787).mp3',
    sourceTitle: 'Gymnopédie No. 1',
    credit: 'Kevin MacLeod (aransemen dan rekaman; komposisi Erik Satie)',
    modification: 'Konversi MP3 320 kbps ke 192 kbps dan penurunan gain 1 dB untuk headroom; tanpa pemotongan atau remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1_(ISRC_USUAN1100787).mp3',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  {
    id: 'years-grow-quiet',
    title: 'The Years Grow Quiet',
    description: 'Instrumental piano yang lembut',
    category: 'music',
    src: '/audio/the-years-grow-quiet.mp3',
    thumbnailSrc: '/images/relaxation/music-thumb.webp',
    backgroundSrc: '/images/relaxation/music-background.webp',
    durationSeconds: 253.75,
    originalFileName: 'Relaxing_Piano_Instrumental_-_"The_Years_Grow_Quiet".flac',
    sourceTitle: 'The Years Grow Quiet',
    credit: 'Mcwpiano',
    modification: 'Menggunakan transkode MP3 170 kbps yang disediakan Wikimedia Commons dari berkas FLAC; tidak di-encode ulang, dipotong, atau di-remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Relaxing_Piano_Instrumental_-_%22The_Years_Grow_Quiet%22.flac',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 'wholesome',
    title: 'Wholesome',
    description: 'Instrumental sinematik dengan suasana stabil',
    category: 'music',
    src: '/audio/wholesome.mp3',
    thumbnailSrc: '/images/relaxation/water-thumb.webp',
    backgroundSrc: '/images/relaxation/water-background.webp',
    durationSeconds: 363.807347,
    originalFileName: 'Wholesome_by_Kevin_MacLeod.ogg',
    sourceTitle: 'Wholesome by Kevin MacLeod',
    credit: 'Kevin MacLeod (incompetech.com)',
    modification: 'Konversi Ogg Vorbis ke MP3 192 kbps; tanpa pemotongan atau remix.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wholesome_by_Kevin_MacLeod.ogg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 'avec-soin',
    title: 'Avec Soin',
    description: 'Piano solo dengan alunan perlahan',
    category: 'music',
    src: '/audio/avec-soin.mp3',
    thumbnailSrc: '/images/relaxation/music-thumb.webp',
    backgroundSrc: '/images/relaxation/music-background.webp',
    durationSeconds: 145.0841,
    originalFileName: 'Avec Soin.mp3',
    sourceTitle: 'Avec Soin',
    credit: 'Kevin MacLeod (incompetech.com)',
    modification: 'Konversi MP3 320 kbps ke 192 kbps; tanpa pemotongan atau perubahan gain.',
    sourceUrl: 'https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100860',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 'friday-morning',
    title: 'Friday Morning',
    description: 'Piano solo dengan suasana ringan dan tenang',
    category: 'music',
    src: '/audio/friday-morning.mp3',
    thumbnailSrc: '/images/relaxation/rain-thumb.webp',
    backgroundSrc: '/images/relaxation/rain-background.webp',
    durationSeconds: 210.337959,
    originalFileName: 'Friday Morning.mp3',
    sourceTitle: 'Friday Morning',
    credit: 'Kevin MacLeod',
    modification: 'Konversi MP3 sekitar 259 kbps ke 192 kbps; embedded cover art dihilangkan dari turunan; tanpa pemotongan atau perubahan gain.',
    sourceUrl: 'https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1100224',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
]

export function getAudioTrack(id: string) {
  return audioTracks.find((track) => track.id === id)
}
