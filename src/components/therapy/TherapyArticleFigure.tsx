import type { TherapyArticleFigure as FigureData } from '../../content/therapyContent.types'

export default function TherapyArticleFigure({ figure }: { figure: FigureData }) {
  return (
    <figure className="therapy-article-figure">
      <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" />
      <figcaption>
        {figure.caption}
        {figure.attribution && (
          <span className="therapy-article-figure__attribution">
            {' '}Foto oleh{' '}
            <a href={figure.attribution.href} target="_blank" rel="noreferrer noopener">
              {figure.attribution.label}
            </a>
          </span>
        )}
      </figcaption>
    </figure>
  )
}
