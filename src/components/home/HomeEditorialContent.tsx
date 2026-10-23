import { ArrowRightIcon, WarningCircleIcon, WaveSineIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EditorialSection from './EditorialSection'

const guides = [
  {
    stage: 'Menjelang Persalinan',
    title: 'Panduan Ibu Hamil Trimester III',
    description: 'Mengenal pilihan relaksasi dan informasi pendukung kenyamanan menjelang persalinan.',
    href: '/panduan/hamil',
  },
  {
    stage: 'Saat Persalinan',
    title: 'Panduan Ibu Bersalin',
    description: 'Informasi dukungan kenyamanan yang tetap mengikuti arahan bidan dan tim kesehatan.',
    href: '/panduan/bersalin',
  },
]

const therapies = [
  { title: 'Teknik Pernapasan', description: 'Mengenal pilihan napas untuk persiapan dan persalinan.', href: '/terapi/teknik-pernapasan' },
  { title: 'Musik untuk Relaksasi', description: 'Mengenal musik pilihan Ibu sebagai teman suasana.', href: '/terapi/terapi-musik' },
  { title: 'Relaksasi Tubuh', description: 'Mengenal perhatian lembut pada rasa nyaman tubuh.', href: '/terapi/relaksasi-otot-ringan' },
  { title: 'Pijat Pendamping', description: 'Mengenal sentuhan dengan persetujuan dan kenyamanan Ibu.', href: '/terapi/pijat-pendamping' },
]

function EditorialLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`editorial-link ${className}`} to={to}>
      <span>{children}</span>
      <ArrowRightIcon size={18} weight="regular" aria-hidden="true" />
    </Link>
  )
}

export default function HomeEditorialContent() {
  return (
    <div className="home-editorial-content">
      <EditorialSection
        id="tentang-ruang-ibu"
        className="home-about"
        eyebrow="TENTANG RUANG IBU"
        title="Tempat belajar, memahami, dan menemukan ketenangan."
      >
        <p>
          Ruang Ibu menghadirkan informasi seputar pilihan terapi komplementer, panduan edukasi untuk trimester III dan persalinan, serta koleksi audio relaksasi. Temukan topik yang sesuai kebutuhan Ibu, dengan bahasa yang sederhana dan sumber yang dapat ditelusuri.
        </p>
        <p className="home-about__note">
          Informasi di Ruang Ibu bersifat edukasi dan tidak menggantikan pemeriksaan atau arahan bidan dan dokter.
        </p>
        <EditorialLink to="/tentang">Tentang Ruang Ibu</EditorialLink>
      </EditorialSection>

      <EditorialSection
        id="panduan-perjalanan"
        className="home-guides"
        title="Setiap tahap, punya cerita dan kebutuhan sendiri."
      >
        <p className="home-section-intro">Pilih informasi sesuai fase yang sedang Ibu jalani.</p>
        <div className="guide-list">
          {guides.map((guide, index) => (
            <article className={`guide-entry${index === 1 ? ' guide-entry--offset' : ''}`} key={guide.href}>
              <p className="guide-entry__stage">{guide.stage}</p>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <EditorialLink to={guide.href}>Baca pengantar</EditorialLink>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection
        id="pilihan-terapi"
        className="home-therapies"
        eyebrow="JELAJAHI TOPIK"
        title="Kenali pilihan yang terasa sesuai untuk Ibu."
      >
        <p className="home-section-intro">
          Empat topik edukasi yang sedang disiapkan untuk membantu Ibu memahami berbagai pendekatan pendukung kenyamanan.
        </p>
        <p className="review-status">Materi dalam peninjauan</p>
        <ol className="therapy-list">
          {therapies.map((therapy) => (
            <li className="therapy-entry" key={therapy.href}>
              <EditorialLink to={therapy.href} className="therapy-entry__link">
                <span className="therapy-entry__copy">
                  <span className="therapy-entry__title">{therapy.title}</span>
                  <span className="therapy-entry__description">{therapy.description}</span>
                </span>
              </EditorialLink>
            </li>
          ))}
        </ol>
        <EditorialLink to="/terapi" className="home-therapies__all">Lihat semua terapi</EditorialLink>
      </EditorialSection>

      <section className="home-audio-band" id="ruang-tenang" aria-labelledby="ruang-tenang-title">
        <WaveSineIcon className="home-audio-band__icon" size={30} weight="light" aria-hidden="true" />
        <div className="home-audio-band__content">
          <h2 id="ruang-tenang-title">Saat ingin berhenti sejenak.</h2>
          <p>
            Ruang Ibu menghadirkan pilihan suara alam dan musik instrumental. Ibu dapat memilih audio yang disukai lalu menjeda atau menghentikannya kapan saja.
          </p>
          <p className="home-audio-band__status">Pilihan audio tersedia</p>
          <EditorialLink to="/relaksasi">Jelajahi Relaksasi</EditorialLink>
        </div>
      </section>

      <EditorialSection
        id="evaluasi-kenyamanan"
        className="home-evaluation"
        title="Bagaimana perasaan Ibu saat ini?"
      >
        <p>
          Di halaman Evaluasi, Ibu dapat mencatat tingkat kenyamanan dan rasa cemas secara sederhana. Hasilnya untuk refleksi pribadi, bukan diagnosis atau pengukuran efektivitas terapi.
        </p>
        <EditorialLink to="/evaluasi" className="home-evaluation__action">Mulai Evaluasi</EditorialLink>
      </EditorialSection>

      <footer className="home-safety-footer" id="keselamatan" aria-labelledby="keselamatan-title">
        <div className="home-safety-footer__notice">
          <WarningCircleIcon size={24} weight="regular" aria-hidden="true" />
          <div>
            <h2 id="keselamatan-title">Kenyamanan penting. Keselamatan tetap utama.</h2>
            <p>
              Terapi komplementer merupakan informasi pendamping dan tidak menggantikan pemeriksaan ataupun perawatan medis. Bila Ibu mengalami gejala yang mengkhawatirkan, segera hubungi bidan, dokter, atau fasilitas kesehatan terdekat.
            </p>
          </div>
        </div>
        <p className="home-safety-footer__review">Materi panduan klinis sedang melalui proses peninjauan.</p>
        <nav className="home-safety-footer__links" aria-label="Informasi keselamatan dan sumber">
          <Link to="/tanda-bahaya">Kenali tanda bahaya</Link>
          <Link to="/sumber">Lihat sumber informasi</Link>
          <Link to="/tentang">Tentang</Link>
        </nav>
        <p className="home-safety-footer__brand">© Ruang Ibu</p>
      </footer>
    </div>
  )
}
