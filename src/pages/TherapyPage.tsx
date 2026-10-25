import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  ArrowLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import BottomTabBar from '../components/layout/BottomTabBar'
import '../styles/therapy-page.css'

type Category = 'Hamil' | 'Bersalin' | 'Relaksasi'
type Therapy = {
  title: string
  description: string
  href: string
  categories: Category[]
  image: string
}

const categories = ['Semua', 'Hamil', 'Bersalin', 'Relaksasi'] as const
type Filter = (typeof categories)[number]

const therapies: Therapy[] = [
  {
    title: 'Nyeri Punggung saat Kehamilan',
    description: 'Penyebab dan pilihan untuk merasa nyaman.',
    href: '/terapi/nyeri-punggung-kehamilan',
    categories: ['Hamil'],
    image: 'back-comfort-thumb.webp',
  },
  {
    title: 'Musik untuk Relaksasi',
    description: 'Musik pilihan Ibu untuk waktu tenang.',
    href: '/terapi/terapi-musik',
    categories: ['Hamil', 'Bersalin', 'Relaksasi'],
    image: 'music.webp',
  },
  {
    title: 'Teknik Pernapasan',
    description: 'Pilihan bernapas untuk persiapan persalinan.',
    href: '/terapi/teknik-pernapasan',
    categories: ['Hamil', 'Bersalin', 'Relaksasi'],
    image: 'breathing.webp',
  },
  {
    title: 'Kompres Hangat Saat Hamil',
    description: 'Pilihan hangat untuk otot punggung yang pegal.',
    href: '/terapi/kompres-hangat-kehamilan',
    categories: ['Hamil'],
    image: 'warm-compress-pregnancy-thumb.webp',
  },
  {
    title: 'Pijat untuk Ibu Hamil',
    description: 'Hal penting sebelum memilih pijat kehamilan.',
    href: '/terapi/pijat-kehamilan',
    categories: ['Hamil'],
    image: 'prenatal-massage-thumb.webp',
  },
  {
    title: 'Kekhawatiran Menjelang Persalinan',
    description: 'Dukungan saat khawatir menjelang persalinan.',
    href: '/terapi/kecemasan-menjelang-persalinan',
    categories: ['Hamil', 'Relaksasi'],
    image: 'pregnancy-support-thumb.webp',
  },
  {
    title: 'Nyeri Persalinan',
    description: 'Kenali pilihan dukungan dan pereda nyeri.',
    href: '/terapi/nyeri-persalinan',
    categories: ['Bersalin'],
    image: 'labor-support-thumb.webp',
  },
  {
    title: 'Kompres Hangat Saat Persalinan',
    description: 'Perawatan hangat oleh tenaga kesehatan.',
    href: '/terapi/kompres-hangat-persalinan',
    categories: ['Bersalin'],
    image: 'warm-compress-labor-thumb.webp',
  },
  {
    title: 'Kekhawatiran Selama Persalinan',
    description: 'Dukungan dan komunikasi selama persalinan.',
    href: '/terapi/kecemasan-persalinan',
    categories: ['Bersalin', 'Relaksasi'],
    image: 'labor-companion-thumb.webp',
  },
  {
    title: 'Pijat Pendamping',
    description: 'Sentuhan pendamping sesuai pilihan Ibu.',
    href: '/terapi/pijat-pendamping',
    categories: ['Bersalin'],
    image: 'labor-touch-thumb.svg',
  },
  {
    title: 'Relaksasi Tubuh',
    description: 'Mengenal grounding saat Ibu merasa kewalahan.',
    href: '/terapi/relaksasi-otot-ringan',
    categories: ['Relaksasi'],
    image: 'relaxation.webp',
  },
]

function TherapyHeader({ onSearch, searchOpen }: { onSearch: () => void; searchOpen: boolean }) {
  const navigate = useNavigate()

  function goBack() {
    if (typeof window !== 'undefined' && window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <header className="therapy-header">
      <button className="therapy-header__control" type="button" onClick={goBack} aria-label="Kembali ke halaman sebelumnya">
        <ArrowLeftIcon size={22} weight="regular" aria-hidden="true" />
      </button>
      <h1 className="therapy-header__title">Jenis Terapi</h1>
      <button
        className="therapy-header__control"
        type="button"
        onClick={onSearch}
        aria-label={searchOpen ? 'Tutup pencarian' : 'Cari terapi'}
        aria-expanded={searchOpen}
        aria-controls={searchOpen ? 'therapy-search' : undefined}
      >
        {searchOpen ? <XIcon size={22} weight="regular" aria-hidden="true" /> : <MagnifyingGlassIcon size={22} weight="regular" aria-hidden="true" />}
      </button>
    </header>
  )
}

function TherapyRow({ therapy }: { therapy: Therapy }) {
  return (
    <Link className="therapy-row" to={therapy.href}>
      <img
        className="therapy-row__thumbnail"
        src={`/images/therapy/${therapy.image}`}
        alt=""
        width={72}
        height={68}
        loading="lazy"
        decoding="async"
      />
      <span className="therapy-row__copy">
        <span className="therapy-row__title">{therapy.title}</span>
        <span className="therapy-row__description">{therapy.description}</span>
      </span>
      <CaretRightIcon className="therapy-row__chevron" size={20} weight="regular" aria-hidden="true" />
    </Link>
  )
}

export default function TherapyPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Semua')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.title = 'Jenis Terapi · Ruang Ibu'
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const visibleTherapies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('id')
    return therapies.filter((therapy) => {
      const matchesCategory = activeFilter === 'Semua' || therapy.categories.includes(activeFilter)
      const matchesQuery = !normalizedQuery || `${therapy.title} ${therapy.description}`.toLocaleLowerCase('id').includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [activeFilter, query])

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <div className="therapy-page">
      <a className="skip-link sr-only focus:not-sr-only" href="#therapy-main">Lewati ke konten</a>
      <TherapyHeader onSearch={() => setSearchOpen((open) => !open)} searchOpen={searchOpen} />
      <main className="therapy-page__main" id="therapy-main">
        <section className="therapy-intro" aria-labelledby="therapy-heading">
          <img className="therapy-intro__botanical" src="/therapy-botanical.svg" alt="" aria-hidden="true" />
          <div className="therapy-intro__content">
            <h2 id="therapy-heading">Kenali Pilihan untuk Ibu</h2>
            <p>Pilih materi sesuai kebutuhan Ibu. Setiap artikel menyertakan sumber informasi dan pilihan yang dapat dibicarakan dengan bidan atau dokter.</p>
          </div>
        </section>

        {searchOpen && (
          <div className="therapy-search" id="therapy-search">
            <MagnifyingGlassIcon size={19} weight="regular" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Cari nama atau topik terapi"
              aria-label="Cari berdasarkan nama atau deskripsi terapi"
            />
            {query && (
              <button className="therapy-search__clear" type="button" onClick={() => setQuery('')} aria-label="Hapus kata pencarian">
                <XIcon size={18} weight="regular" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="therapy-filters" role="group" aria-label="Filter kategori terapi">
          {categories.map((category) => (
            <button
              className={`therapy-filter${activeFilter === category ? ' is-active' : ''}`}
              key={category}
              type="button"
              aria-pressed={activeFilter === category}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="therapy-category-note">Pilih kategori sesuai kebutuhan Ibu untuk melihat materi yang berkaitan dengan kehamilan atau persalinan.</p>

        <section className="therapy-results" aria-label="Daftar terapi" aria-live="polite">
          {visibleTherapies.length > 0 ? (
            visibleTherapies.map((therapy) => <TherapyRow key={therapy.href} therapy={therapy} />)
          ) : (
            <div className="therapy-empty" role="status">
              <MagnifyingGlassIcon size={25} weight="light" aria-hidden="true" />
              <p>Tidak ada topik yang cocok.</p>
              <span>Coba kata kunci atau kategori lain.</span>
            </div>
          )}
        </section>
      </main>
      <BottomTabBar />
    </div>
  )
}
