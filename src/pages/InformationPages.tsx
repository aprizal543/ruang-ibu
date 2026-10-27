import { useEffect, type ReactNode } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import BottomTabBar from '../components/layout/BottomTabBar'
import SourceDisclosure from '../components/ui/SourceDisclosure'
import { maternityGuides } from '../content/maternityGuides'
import { therapyReferences } from '../content/therapyReferences'
import { getTherapySourceTypeLabel } from '../content/therapySourceLabels'
import type { MaternityGuideSection } from '../content/maternityGuides'

interface InformationLayoutProps {
  headerTitle: string
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}

function InformationFooter() {
  return (
    <footer className="information-footer">
      <p className="information-footer__brand">Ruang Ibu</p>
      <nav aria-label="Tautan informasi lainnya">
        <Link to="/tentang">Tentang</Link>
        <Link to="/sumber">Sumber Informasi</Link>
        <Link to="/faq">Tanya Jawab</Link>
        <Link to="/tanda-bahaya">Tanda Bahaya</Link>
      </nav>
    </footer>
  )
}

function InformationLayout({ headerTitle, eyebrow, title, intro, children }: InformationLayoutProps) {
  useEffect(() => {
    document.title = `${headerTitle} · Ruang Ibu`
  }, [headerTitle])

  return (
    <div className="information-page">
      <a className="information-page__skip" href="#information-main">Lewati ke isi halaman</a>
      <header className="information-page__header">
        <Link to="/" aria-label="Kembali ke Beranda"><ArrowLeftIcon size={22} weight="regular" aria-hidden="true" /></Link>
        <span>{headerTitle}</span>
        <span aria-hidden="true" />
      </header>
      <main id="information-main" className="information-page__main">
        <div className="information-page__intro">
          <p className="information-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        <div className="information-page__content">{children}</div>
        <InformationFooter />
      </main>
      <BottomTabBar />
    </div>
  )
}

function EditorialSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="information-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function AboutPage() {
  return (
    <InformationLayout
      headerTitle="Tentang Ruang Ibu"
      eyebrow="TENTANG KAMI"
      title="Ruang untuk mengenal pilihan dengan lebih tenang."
      intro="Ruang Ibu adalah website edukasi bagi ibu hamil trimester III, ibu yang mempersiapkan persalinan, dan pendampingnya."
    >
      <EditorialSection title="Apa yang dapat Ibu temukan?">
        <p>Ruang Ibu memuat pengenalan terapi komplementer, panduan untuk masa kehamilan dan persalinan, serta pilihan audio alam dan musik instrumental.</p>
        <p>Materi disajikan dengan bahasa sederhana agar Ibu dapat mengenal topik dan menyiapkan hal yang ingin ditanyakan kepada bidan atau dokter.</p>
        <div className="information-actions">
          <Link to="/terapi">Jelajahi Jenis Terapi <ArrowRightIcon size={17} aria-hidden="true" /></Link>
          <Link to="/hamil">Buka Panduan Ibu Hamil <ArrowRightIcon size={17} aria-hidden="true" /></Link>
        </div>
      </EditorialSection>

      <EditorialSection title="Informasi yang dapat ditelusuri">
        <p>Halaman edukasi menyediakan sumber informasi yang berkaitan dengan materinya. Daftar sumber juga dapat Ibu buka dari menu atau bagian bawah halaman.</p>
        <p>Informasi Ruang Ibu bersifat edukasi. Isi website tidak menggantikan pemeriksaan, diagnosis, atau arahan tenaga kesehatan, dan tidak semua pilihan sesuai untuk setiap kondisi.</p>
        <Link className="information-inline-link" to="/sumber">Lihat daftar sumber informasi <ArrowUpRightIcon size={17} aria-hidden="true" /></Link>
      </EditorialSection>

      <EditorialSection title="Evaluasi untuk refleksi pribadi">
        <p>Halaman Evaluasi membantu Ibu mencatat kenyamanan dan rasa cemas yang dirasakan saat itu. Angka tidak digunakan untuk membuat diagnosis atau menilai keberhasilan terapi.</p>
        <p>Jawaban hanya berada sementara di halaman. Jawaban tidak dikirim ke server maupun disimpan secara permanen.</p>
        <Link className="information-inline-link" to="/evaluasi">Buka Evaluasi Kenyamanan <ArrowRightIcon size={17} aria-hidden="true" /></Link>
      </EditorialSection>
    </InformationLayout>
  )
}

export function SourcesPage() {
  const sources = Object.values(therapyReferences).filter((source) => source.sourceType !== 'historical_source')

  return (
    <InformationLayout
      headerTitle="Sumber Informasi"
      eyebrow="RUJUKAN MATERI"
      title="Sumber yang digunakan dalam materi Ruang Ibu."
      intro="Di sini Ibu dapat menemukan sumber yang digunakan dalam artikel dan panduan. Setiap halaman materi juga menampilkan rujukan yang berkaitan dengan isinya."
    >
      <EditorialSection title="Daftar sumber">
        <ol className="information-source-list">
          {sources.map((source) => (
            <li key={source.id}>
              <h3>{source.displayTitle ?? source.title}</h3>
              <p className="information-source__category">{getTherapySourceTypeLabel(source.sourceType)}</p>
              <p>{source.publisher}{source.publicationYear ? ` · ${source.publicationYear}` : ''}{source.sourceDateLabel ? ` · ${source.sourceDateLabel}` : ''}</p>
              {source.authors?.length ? <p>Penulis: {source.authors.join(', ')}</p> : null}
              {source.studyDesign || source.population || source.evidenceLimitations?.length ? (
                <details className="information-source-details">
                  <summary>Ringkasan sumber</summary>
                  {source.studyDesign ? <p>Cara penelitian dilakukan: {source.studyDesign}</p> : null}
                  {source.population ? <p>Siapa yang ikut: {source.population}</p> : null}
                  {source.evidenceLimitations?.length ? (
                    <>
                      <p>Yang perlu diingat:</p>
                      <ul>{source.evidenceLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
                    </>
                  ) : null}
                </details>
              ) : null}
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.doi ? `Buka sumber asli · DOI ${source.doi}` : 'Buka sumber'} <ArrowUpRightIcon size={16} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
        <p className="information-page__note">Sumber membantu Ibu menelusuri informasi. Setiap penelitian memiliki peserta dan cara yang berbeda, sehingga hasilnya mungkin tidak sama dengan pengalaman Ibu.</p>
      </EditorialSection>
    </InformationLayout>
  )
}

const faqs = [
  {
    question: 'Apakah informasi di website ini menggantikan arahan bidan atau dokter?',
    answer: 'Tidak. Informasi di Ruang Ibu bersifat edukasi dan tidak menggantikan pemeriksaan, diagnosis, atau arahan tenaga kesehatan.',
  },
  {
    question: 'Apakah semua pilihan terapi sesuai untuk setiap ibu?',
    answer: 'Tidak selalu. Kesesuaian dapat berbeda menurut kebutuhan dan keadaan Ibu. Bicarakan pertanyaan atau keluhan dengan bidan atau dokter yang mendampingi.',
  },
  {
    question: 'Apakah audio akan langsung diputar?',
    answer: 'Tidak. Audio hanya mulai setelah Ibu memilih dan menekan tombol putar. Ibu dapat menjeda atau menghentikannya kapan saja.',
  },
  {
    question: 'Apakah angka pada Evaluasi merupakan diagnosis?',
    answer: 'Bukan. Angka hanya mencatat perasaan yang Ibu pilih saat itu dan tidak digunakan untuk menentukan kondisi kesehatan.',
  },
  {
    question: 'Di mana saya dapat melihat sumber materi?',
    answer: 'Buka bagian Sumber Informasi pada halaman materi atau kunjungi daftar sumber melalui menu Ruang Ibu.',
  },
]

export function FaqPage() {
  return (
    <InformationLayout
      headerTitle="Tanya Jawab"
      eyebrow="BANTUAN"
      title="Pertanyaan yang sering diajukan."
      intro="Jawaban singkat tentang informasi, audio, dan fitur yang tersedia di Ruang Ibu."
    >
      <EditorialSection title="Tentang penggunaan Ruang Ibu">
        <div className="information-faq-list">
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
              {question.startsWith('Di mana') ? <Link to="/sumber">Buka daftar sumber</Link> : null}
            </details>
          ))}
        </div>
      </EditorialSection>
      <p className="information-page__note">Jika Ibu mengalami keluhan atau tanda yang mengkhawatirkan, hubungi tenaga kesehatan yang mendampingi.</p>
      <Link className="information-inline-link" to="/tanda-bahaya">Lihat kapan perlu meminta bantuan <ArrowRightIcon size={17} aria-hidden="true" /></Link>
    </InformationLayout>
  )
}

function SafetyGroup({ title, section, guideHref }: { title: string; section: MaternityGuideSection; guideHref: string }) {
  return (
    <EditorialSection title={title}>
      {section.paragraphs.map((paragraph) => <p key={paragraph.text}>{paragraph.text}</p>)}
      {section.safetyItems?.length ? (
        <ul className="information-safety-list">
          {section.safetyItems.map((item) => <li key={item.text}>{item.text}</li>)}
        </ul>
      ) : null}
      {section.safetyClosing ? <p>{section.safetyClosing.text}</p> : null}
      <Link className="information-inline-link" to={guideHref}>Buka {title.toLocaleLowerCase('id-ID')} <ArrowRightIcon size={17} aria-hidden="true" /></Link>
    </EditorialSection>
  )
}

function getSafetySection(kind: 'pregnancy' | 'birth') {
  const guide = maternityGuides[kind]
  const section = guide.sections.find((item) => item.id === 'bantuan')
  if (!section) throw new Error(`Safety content missing for ${kind}`)
  return { guide, section }
}

export function SafetyPage() {
  const pregnancy = getSafetySection('pregnancy')
  const birth = getSafetySection('birth')
  const sourceIds = [
    ...pregnancy.section.paragraphs.flatMap((item) => item.sourceIds),
    ...(pregnancy.section.safetyItems ?? []).flatMap((item) => item.sourceIds),
    ...(pregnancy.section.safetyClosing?.sourceIds ?? []),
    ...birth.section.paragraphs.flatMap((item) => item.sourceIds),
    ...(birth.section.safetyItems ?? []).flatMap((item) => item.sourceIds),
    ...(birth.section.safetyClosing?.sourceIds ?? []),
  ]
  const sources = [...new Set(sourceIds)].map((id) => therapyReferences[id]).filter((source) => source !== undefined)

  return (
    <InformationLayout
      headerTitle="Tanda Bahaya"
      eyebrow="KESELAMATAN IBU"
      title="Kapan Perlu Meminta Bantuan?"
      intro="Informasi berikut merangkum bagian keselamatan pada panduan Ruang Ibu. Halaman ini tidak dapat menilai kondisi Ibu secara pribadi."
    >
      <SafetyGroup title="Selama kehamilan" section={pregnancy.section} guideHref="/hamil" />
      <SafetyGroup title="Selama persalinan" section={birth.section} guideHref="/bersalin" />
      <SourceDisclosure
        id="safety-page-sources"
        className="information-page__source-disclosure"
        sources={sources.map((source) => ({
          id: source.id,
          title: source.displayTitle ?? source.title,
          publisher: source.publisher,
          url: source.url,
          metadata: source.sourceDateLabel ?? (source.publicationYear ? String(source.publicationYear) : undefined),
        }))}
        note="Bila Ibu merasa keadaan mengancam nyawa, cari bantuan darurat setempat."
      />
    </InformationLayout>
  )
}

export function NotFoundPage() {
  return (
    <InformationLayout
      headerTitle="Halaman Tidak Ditemukan"
      eyebrow="RUANG IBU"
      title="Halaman ini tidak tersedia."
      intro="Alamat yang Ibu buka tidak cocok dengan halaman Ruang Ibu."
    >
      <EditorialSection title="Kembali menjelajah">
        <p>Ibu dapat kembali ke Beranda atau memilih salah satu bagian utama melalui navigasi di bawah.</p>
        <Link className="information-inline-link" to="/">Kembali ke Beranda <ArrowRightIcon size={17} aria-hidden="true" /></Link>
      </EditorialSection>
    </InformationLayout>
  )
}
