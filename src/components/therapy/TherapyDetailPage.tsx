import { useEffect } from 'react'
import {
  ArrowLeftIcon,
  HeadphonesIcon,
  LockKeyIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import BottomTabBar from '../layout/BottomTabBar'
import AudioPlayer from '../audio/AudioPlayer'
import { getAudioTrack } from '../../content/audioTracks'
import type { TherapyArticle, TherapyParagraph, TherapyReference } from '../../content/therapyContent.types'
import SourceDisclosure from '../ui/SourceDisclosure'
import '../../styles/therapy-detail.css'

interface TherapyDetailPageProps {
  article: TherapyArticle
  references: Record<string, TherapyReference>
}

function ArticleParagraph({ paragraph }: { paragraph: TherapyParagraph }) {
  return <p>{paragraph.text}</p>
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

  if (guide.status === 'source_based') {
    return (
      <div className="therapy-detail__source-guide" data-source-guide>
        <p>{guide.note}</p>
        <ol className="therapy-detail__source-guide-list">
          {guide.instructions.map((instruction, index) => (
            <li key={`${article.id}-guide-${index}`}>
              <span>{instruction.text}</span>
            </li>
          ))}
        </ol>
      </div>
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
  if (audio.status === 'not_applicable') return null

  return (
    <section className="therapy-detail__audio" aria-labelledby="audio-heading">
      <div className="therapy-detail__audio-title">
        <HeadphonesIcon size={23} weight="regular" aria-hidden="true" />
        <h2 id="audio-heading">Audio Pendamping</h2>
      </div>
      {audio.status === 'available' ? (
        <>
          {getAudioTrack(audio.trackId) && <AudioPlayer track={getAudioTrack(audio.trackId)!} />}
          <Link className="therapy-detail__audio-link" to="/relaksasi">Lihat pilihan audio lainnya</Link>
        </>
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
    <SourceDisclosure
      id="section-referensi"
      className="therapy-detail__sources"
      sources={availableReferences.map((reference) => ({
        id: reference.id,
        title: reference.displayTitle ?? reference.title,
        publisher: reference.publisher,
        url: reference.url,
        metadata: reference.publicationYear ? String(reference.publicationYear) : reference.sourceDateLabel,
      }))}
      note="Informasi ini bersifat edukasi dan tidak menggantikan arahan bidan atau dokter."
    />
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
            <section className="therapy-article__summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading">Mengenal {article.title}</h2>
              <ArticleParagraph paragraph={article.introduction} />
            </section>
            <nav className="therapy-article__contents" aria-label="Navigasi artikel">
              <a href="#section-pengertian">Apa itu?</a>
              <a href="#section-tujuan">Apa tujuannya?</a>
              <a href="#section-kapan-dipertimbangkan">Kapan dipertimbangkan?</a>
              <a href="#section-keselamatan">Perhatian</a>
              <a
                href="#section-referensi"
                onClick={() => {
                  const disclosure = document.querySelector<HTMLDetailsElement>('#section-referensi details')
                  if (disclosure) disclosure.open = true
                }}
              >Sumber</a>
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
