import { useMemo, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, MusicNotesIcon, PauseIcon, PlayIcon, WaveformIcon, XIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import Disclosure from '../components/ui/Disclosure'
import { audioTracks, type AudioTrack } from '../content/audioTracks'
import { useRelaxationPlayback } from '../features/relaxation/RelaxationPlaybackContext'

type FilterKey = 'all' | AudioTrack['category']
const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'music', label: 'Musik' },
  { key: 'nature', label: 'Suara Alam' },
]

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

function TrackActivity() {
  return <span className="relaxation-track__activity" aria-hidden="true"><i /><i /><i /></span>
}

function RelaxationTrackRow({ audioTrack }: { audioTrack: AudioTrack }) {
  const { track, playing, loading, failed, togglePlayback, selectTrack } = useRelaxationPlayback()
  const isCurrent = track?.id === audioTrack.id
  const isPlaying = isCurrent && playing
  const Icon = audioTrack.category === 'nature' ? WaveformIcon : MusicNotesIcon

  return (
    <li className={`relaxation-track${isCurrent ? ' is-current' : ''}${isPlaying ? ' is-playing' : ''}`}>
      <Link
        className="relaxation-track__open"
        to={`/relaksasi/${audioTrack.id}`}
        onClick={() => selectTrack(audioTrack)}
        aria-label={`Buka pemutar ${audioTrack.title}`}
      >
        <span className="relaxation-track__cover">
          <img src={audioTrack.thumbnailSrc} alt="" width="60" height="60" loading="lazy" />
          <span className="relaxation-track__cover-icon" aria-hidden="true"><Icon size={17} weight="regular" /></span>
        </span>
        <span className="relaxation-track__copy">
          <strong>{audioTrack.title}</strong>
          <span>{audioTrack.description}</span>
          {isCurrent && loading && <span className="relaxation-track__status" role="status">Memuat audio…</span>}
          {isPlaying && <span className="relaxation-track__status"><TrackActivity /> Sedang diputar</span>}
          {isCurrent && failed && <span className="relaxation-track__error" role="alert">Audio tidak dapat dimuat. Tekan putar untuk mencoba lagi.</span>}
        </span>
        <span className="relaxation-track__meta">
          <span>{formatTime(audioTrack.durationSeconds)}</span>
          <ArrowRightIcon size={17} weight="regular" aria-hidden="true" />
        </span>
      </Link>
      <button
        className="relaxation-track__play"
        type="button"
        aria-label={isPlaying ? `Jeda ${audioTrack.title}` : `Putar ${audioTrack.title}`}
        aria-pressed={isPlaying}
        disabled={loading && isCurrent}
        onClick={() => togglePlayback(audioTrack)}
      >
        {isPlaying ? <PauseIcon size={19} weight="fill" aria-hidden="true" /> : <PlayIcon size={19} weight="fill" aria-hidden="true" />}
      </button>
    </li>
  )
}

export default function RelaxationPage() {
  const [filter, setFilter] = useState<FilterKey>('all')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const tracks = useMemo(() => audioTracks.filter((audioTrack) => {
    const matchesFilter = filter === 'all' || audioTrack.category === filter
    const normalizedQuery = query.trim().toLocaleLowerCase('id-ID')
    const matchesSearch = !normalizedQuery || `${audioTrack.title} ${audioTrack.description} ${audioTrack.credit}`.toLocaleLowerCase('id-ID').includes(normalizedQuery)
    return matchesFilter && matchesSearch
  }), [filter, query])

  return (
    <div className="relaxation-catalog">
      <header className="relaxation-catalog__header">
        <Link to="/" aria-label="Kembali ke Beranda" className="relaxation-catalog__back"><ArrowLeftIcon size={22} weight="regular" aria-hidden="true" /></Link>
        <span>Relaksasi</span>
        <button
          className="relaxation-catalog__search-toggle"
          type="button"
          aria-label={searchOpen ? 'Tutup pencarian' : 'Cari audio'}
          aria-expanded={searchOpen}
          aria-controls="relaxation-search"
          onClick={() => { setSearchOpen((open) => !open); setQuery('') }}
        >
          {searchOpen ? <XIcon size={21} weight="regular" aria-hidden="true" /> : <MagnifyingGlassIcon size={21} weight="regular" aria-hidden="true" />}
        </button>
      </header>
      {searchOpen && (
        <div className="relaxation-catalog__search" id="relaxation-search">
          <label className="sr-only" htmlFor="relaxation-search-input">Cari pilihan audio</label>
          <MagnifyingGlassIcon size={18} aria-hidden="true" />
          <input id="relaxation-search-input" autoFocus value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Cari audio" />
        </div>
      )}
      <main className="relaxation-catalog__main">
        <section className="relaxation-catalog__hero" aria-labelledby="relaxation-title">
          <img src="/therapy-botanical.svg" alt="" aria-hidden="true" width="176" height="184" />
          <p className="relaxation-catalog__eyebrow">WAKTU UNTUK IBU</p>
          <h1 id="relaxation-title">Ruang Tenang<br />untuk Ibu</h1>
          <p>Pilih suara alam atau musik yang ingin Ibu dengarkan untuk menemani waktu beristirahat.</p>
        </section>

        <section className="relaxation-catalog__collection" aria-labelledby="audio-collection-title">
          <div className="relaxation-catalog__filters" role="group" aria-label="Filter koleksi audio">
            {filters.map((item) => (
              <button key={item.key} type="button" aria-pressed={filter === item.key} className={`filter-${item.key}${filter === item.key ? ' is-active' : ''}`} onClick={() => setFilter(item.key)}>{item.label}</button>
            ))}
          </div>
          <h2 id="audio-collection-title" className="sr-only">Pilihan audio</h2>
          {tracks.length > 0 ? (
            <ul className="relaxation-catalog__tracks">
              {tracks.map((audioTrack) => <RelaxationTrackRow key={audioTrack.id} audioTrack={audioTrack} />)}
            </ul>
          ) : (
            <p className="relaxation-catalog__empty" role="status">Belum ada audio yang cocok. Coba kata lain atau pilih koleksi berbeda.</p>
          )}
          <p className="relaxation-catalog__note">Pemutaran dimulai hanya saat Ibu menekan tombol putar.</p>
        </section>

        <Disclosure id="audio-credits" title="Kredit dan lisensi audio" className="relaxation-catalog__credit">
          <ul>
            {audioTracks.map((audioTrack) => (
              <li key={audioTrack.id}>
                <strong>{audioTrack.title}</strong>
                <p>Judul berkas asli: <span className="relaxation-catalog__filename">{audioTrack.originalFileName}</span></p>
                <p>Pencipta: {audioTrack.credit}. Sumber: <a href={audioTrack.sourceUrl} target="_blank" rel="noreferrer">{audioTrack.sourceTitle}</a>.</p>
                <p>Lisensi: <a href={audioTrack.licenseUrl} target="_blank" rel="noreferrer">{audioTrack.license}</a>. {audioTrack.modification}</p>
                {audioTrack.id === 'rain' && <p>Berkas MP3 turunan ini dibagikan dengan CC BY-SA 4.0. Ketentuan ShareAlike dicatat untuk audio ini saja, bukan seluruh aplikasi.</p>}
              </li>
            ))}
          </ul>
        </Disclosure>
      </main>
    </div>
  )
}
