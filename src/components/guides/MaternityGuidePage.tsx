import { useEffect } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, HeadphonesIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import BottomTabBar from '../layout/BottomTabBar'
import SourceDisclosure from '../ui/SourceDisclosure'
import { therapyReferences } from '../../content/therapyReferences'
import { getTherapySourceTypeLabel } from '../../content/therapySourceLabels'
import type { GuideLinkItem, MaternityGuideContent, MaternityGuideSection } from '../../content/maternityGuides'
import '../../styles/maternity-guides.css'

function RelatedTherapies({ items }: { items: GuideLinkItem[] }) {
  return (
    <ul className="maternity-guide__related-list">
      {items.map((item) => (
        <li className="maternity-guide__related-item" key={item.href}>
          <Link className="maternity-guide__related-link" to={item.href}>
            {item.image ? <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" /> : null}
            <span className="maternity-guide__related-copy">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </span>
            <ArrowRightIcon size={19} weight="regular" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

function AudioCallout() {
  return (
    <Link className="maternity-guide__audio-callout" to="/relaksasi">
      <span className="maternity-guide__audio-icon" aria-hidden="true"><HeadphonesIcon size={22} weight="regular" /></span>
      <span className="maternity-guide__audio-copy">
        <strong>Buka pilihan audio</strong>
        <span>Suara alam dan musik instrumental. Audio tidak diputar otomatis dan bukan panduan kesehatan.</span>
      </span>
      <ArrowRightIcon size={19} weight="regular" aria-hidden="true" />
    </Link>
  )
}

function SafetyNotice({ section, headingId }: { section: MaternityGuideSection; headingId: string }) {
  return (
    <aside className="maternity-guide__safety" aria-labelledby={headingId}>
      <div className="maternity-guide__safety-heading">
        <WarningCircleIcon size={22} weight="regular" aria-hidden="true" />
        <h2 id={headingId}>{section.heading}</h2>
      </div>
      {section.paragraphs.map((paragraph, index) => (
        <div className="maternity-guide__safety-copy" key={`${section.id}-p-${index}`}>
          <p>{paragraph.text}</p>
        </div>
      ))}
      {section.safetyItems && section.safetyItems.length > 0 ? (
        <ul>
          {section.safetyItems.map((item, index) => (
            <li key={`${section.id}-item-${index}`}>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      ) : null}
      {section.safetyClosing ? (
        <div className="maternity-guide__safety-copy">
          <p>{section.safetyClosing.text}</p>
        </div>
      ) : null}
    </aside>
  )
}

function GuideSection({ section }: { section: MaternityGuideSection }) {
  const sectionId = `guide-${section.id}`
  const isSafetySection = section.safetyItems !== undefined || section.safetyClosing !== undefined

  return (
    <section id={sectionId} className={`maternity-guide__section${isSafetySection ? ' maternity-guide__section--safety' : ''}`} aria-labelledby={`${sectionId}-heading`}>
      {isSafetySection ? (
          <SafetyNotice section={section} headingId={`${sectionId}-heading`} />
      ) : (
        <>
          <h2 id={`${sectionId}-heading`}>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <div className="maternity-guide__paragraph" key={`${sectionId}-p-${index}`}>
              <p>{paragraph.text}</p>
            </div>
          ))}
          {section.relatedItems ? <RelatedTherapies items={section.relatedItems} /> : null}
          {section.audioCta ? <AudioCallout /> : null}
        </>
      )}
    </section>
  )
}

export default function MaternityGuidePage({ guide }: { guide: MaternityGuideContent }) {
  const sourceIds = [...new Set(guide.sourceIds)]
  const sources = sourceIds.map((id) => therapyReferences[id]).filter((source) => source !== undefined)

  useEffect(() => {
    document.title = `${guide.headerTitle} · Ruang Ibu`
  }, [guide.headerTitle])

  return (
    <div className="maternity-guide" data-clinical-review={guide.clinicalReview}>
      <a className="sr-only focus:not-sr-only maternity-guide__skip" href="#guide-main">Lewati ke isi panduan</a>
      <header className="maternity-guide__header">
        <Link to="/" aria-label="Kembali ke Beranda">
          <ArrowLeftIcon size={22} weight="regular" aria-hidden="true" />
        </Link>
        <span>{guide.headerTitle}</span>
        <span aria-hidden="true" />
      </header>
      <main id="guide-main" className="maternity-guide__main">
        <figure className={`maternity-guide__hero maternity-guide__hero--${guide.id}`}>
          <img src={guide.heroImage} alt={guide.heroImageAlt} fetchPriority="high" />
          <div className="maternity-guide__hero-wash" aria-hidden="true" />
          <figcaption className="maternity-guide__hero-copy">
            <span className="maternity-guide__eyebrow">{guide.heroEyebrow}</span>
            <h1>{guide.heroTitle}</h1>
          </figcaption>
        </figure>
        <div className="maternity-guide__content">
          <p className="maternity-guide__lead">{guide.heroDescription}</p>
          <a className="maternity-guide__safety-shortcut" href="#guide-bantuan">Lihat kapan perlu meminta bantuan</a>
          {guide.sections.map((section) => <GuideSection key={section.id} section={section} />)}
          <SourceDisclosure
            id="guide-sources"
            className="maternity-guide__sources"
            sources={sources.map((source) => ({
              id: source.id,
              title: source.displayTitle ?? source.title,
              publisher: source.publisher,
              url: source.url,
              metadata: source.sourceDateLabel ?? (source.publicationYear ? String(source.publicationYear) : undefined),
              category: getTherapySourceTypeLabel(source.sourceType),
            }))}
            note="Informasi ini bersifat edukasi dan tidak menggantikan arahan bidan atau dokter. Sebagian sumber berasal dari NHS Inggris; jalur layanan dapat berbeda di Indonesia."
          />
        </div>
      </main>
      <BottomTabBar />
    </div>
  )
}
