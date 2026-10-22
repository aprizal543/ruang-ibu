import { useEffect } from 'react'
import {
  ArrowLeftIcon,
  BookOpenTextIcon,
  HeadphonesIcon,
  LockKeyIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import BottomTabBar from '../layout/BottomTabBar'
import type { TherapyArticle, TherapyParagraph, TherapyReference } from '../../content/therapyContent.types'
import '../../styles/therapy-detail.css'

interface TherapyDetailPageProps {
  article: TherapyArticle
  references: Record<string, TherapyReference>
}

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function ArticleParagraph({ paragraph }: { paragraph: TherapyParagraph }) {
  return <p>{paragraph.text}</p>
}

function ClinicalReviewStatus({ article }: { article: TherapyArticle }) {
  const statusText = article.clinicalReview.status === 'approved'
    ? 'Materi disetujui secara klinis'
    : article.clinicalReview.status === 'in_review'
      ? 'Materi sedang ditinjau'
      : 'Materi masih berupa draf'

  return (
    <aside className="therapy-detail__review-status" aria-label="Status peninjauan materi" role="status">
      <span className="therapy-detail__status-mark" aria-hidden="true" />
      <div>
        <strong>{statusText}</strong>
        {article.clinicalReview.status === 'approved' && (
          <span>Ditelaah oleh {article.clinicalReview.reviewerName}, {article.clinicalReview.reviewerRole} pada {dateLabel(article.clinicalReview.reviewedAt)}.</span>
        )}
        {article.clinicalReview.status === 'in_review' && (
          <span>Peninjauan klinis belum selesai.</span>
        )}
        {article.clinicalReview.status === 'draft' && (
          <span>Belum ditinjau oleh tenaga kesehatan.</span>
        )}
      </div>
    </aside>
  )
}

function ArticleSection({
  section,
}: { section: TherapyArticle['sections'][number] }) {
  return (
    <section className="therapy-detail__section" aria-labelledby={`section-${section.id}`}>
      <h2 id={`section-${section.id}`}>{section.heading}</h2>
      {section.paragraphs.map((paragraph, index) => (
        <ArticleParagraph key={`${section.id}-${index}`} paragraph={paragraph} />
      ))}
    </section>
  )
}

function SafetyNotice({ paragraph }: { paragraph: TherapyParagraph }) {
  return (
    <aside className="therapy-detail__safety" aria-labelledby="section-keselamatan">
      <div className="therapy-detail__safety-title">
        <WarningCircleIcon size={22} weight="regular" aria-hidden="true" />
      <h2 id="section-keselamatan">Hal yang perlu Ibu perhatikan</h2>
      </div>
      <ArticleParagraph paragraph={paragraph} />
    </aside>
  )
}

function PracticeGuide({ article }: { article: TherapyArticle }) {
  const guide = article.practiceGuide
  if (guide.status === 'approved' && article.clinicalReview.status === 'approved') {
    return (
      <ol className="therapy-detail__practice-steps">
        {guide.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
      </ol>
    )
  }

  const lockedMessage = guide.status === 'locked_pending_review'
    ? guide.message
    : 'Panduan praktik ditahan sampai materi ditelaah dan disetujui secara klinis.'

  return (
    <div className="therapy-detail__locked" data-locked-guide role="note">
      <LockKeyIcon size={20} weight="regular" aria-hidden="true" />
      <p>{lockedMessage}</p>
    </div>
  )
}

function AudioCompanion({ audio }: { audio: TherapyArticle['audio'] }) {
  return (
    <section className="therapy-detail__audio" aria-labelledby="audio-heading">
      <div className="therapy-detail__audio-title">
        <HeadphonesIcon size={23} weight="regular" aria-hidden="true" />
        <h2 id="audio-heading">Audio Pendamping</h2>
      </div>
      {audio.status === 'available' ? (
        <audio controls preload="none" aria-label={audio.title}>
          <source src={audio.src} />
          Browser ini tidak mendukung audio.
        </audio>
      ) : (
        <p>{audio.message}</p>
      )}
    </section>
  )
}

function ReferenceList({
  ids,
  references,
}: {
  ids: string[]
  references: Record<string, TherapyReference>
}) {
  const availableReferences = ids.map((id) => references[id]).filter((reference): reference is TherapyReference => Boolean(reference))

  return (
    <section id="section-referensi" className="therapy-detail__section therapy-detail__sources" aria-labelledby="sources-heading">
      <div className="therapy-detail__section-title">
        <BookOpenTextIcon size={21} weight="regular" aria-hidden="true" />
        <h2 id="sources-heading">Sumber Informasi</h2>
      </div>
      <details className="therapy-detail__source-disclosure" data-source-details>
        <summary>Lihat sumber yang digunakan</summary>
        <ul>
          {availableReferences.map((reference) => (
            <li className="therapy-detail__source" id={`source-${reference.id}`} key={reference.id}>
              <a href={reference.url} target="_blank" rel="noreferrer">{reference.displayTitle ?? reference.publisher}</a>
              <span>
                {reference.publisher}
                {reference.publicationYear ? ` · ${reference.publicationYear}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export default function TherapyDetailPage({ article, references }: TherapyDetailPageProps) {
  useEffect(() => {
    document.title = `${article.title} · Ruang Ibu`
  }, [article.title])

  return (
    <div className="therapy-detail-page">
      <a className="skip-link sr-only focus:not-sr-only" href="#therapy-detail-main">Lewati ke konten</a>
      <header className="therapy-detail-header">
        <Link className="therapy-detail-header__back" to="/terapi" aria-label="Kembali ke katalog terapi">
          <ArrowLeftIcon size={22} weight="regular" aria-hidden="true" />
        </Link>
        <span>Detail Terapi</span>
        <span aria-hidden="true" />
      </header>

      <main className="therapy-detail-main" id="therapy-detail-main">
        <article className="therapy-article" aria-labelledby="therapy-detail-title">
          <header className="therapy-article__lead">
            <h1 id="therapy-detail-title">{article.title}</h1>
            <ul className="therapy-article__categories" aria-label="Kategori materi">
              {article.categories.map((category) => <li key={category}>{category}</li>)}
            </ul>
            <ClinicalReviewStatus article={article} />
            <section className="therapy-article__summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading">Mengenal Teknik Pernapasan</h2>
              <ArticleParagraph paragraph={article.introduction} />
            </section>
            <nav className="therapy-article__contents" aria-label="Navigasi artikel">
              <a href="#section-pengertian">Apa itu?</a>
              <a href="#section-tujuan">Apa tujuannya?</a>
              <a href="#section-kapan-dipertimbangkan">Kapan dipertimbangkan?</a>
              <a href="#section-keselamatan">Perhatian</a>
              <a href="#section-referensi">Sumber</a>
            </nav>
          </header>

          {article.sections.map((section) => <ArticleSection key={section.id} section={section} />)}

          <SafetyNotice paragraph={article.safetyNotice} />

          <section className="therapy-detail__section" aria-labelledby="practice-heading">
            <h2 id="practice-heading">Panduan untuk Ibu</h2>
            <PracticeGuide article={article} />
          </section>

          <AudioCompanion audio={article.audio} />
          <ReferenceList ids={article.referenceIds} references={references} />

          <Link className="therapy-detail__catalog-link" to="/terapi">Kembali ke Jenis Terapi</Link>
        </article>
      </main>
      <BottomTabBar />
    </div>
  )
}
