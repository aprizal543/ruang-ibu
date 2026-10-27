import type { TherapyArticleFigure as FigureData } from '../../content/therapyContent.types'

export default function TherapyArticleFigure({ figure }: { figure: FigureData }) {
  return (
    <figure className="therapy-article-figure">
      <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" decoding="async" />
      <figcaption>{figure.caption}</figcaption>
    </figure>
  )
}
