import Disclosure from './Disclosure'

export interface SourceDisclosureItem {
  id: string
  title: string
  publisher: string
  url: string
  metadata?: string
}

interface SourceDisclosureProps {
  id: string
  sources: SourceDisclosureItem[]
  note?: string
  className?: string
}

export default function SourceDisclosure({ id, sources, note, className = '' }: SourceDisclosureProps) {
  const uniqueSources = [...new Map(sources.map((source) => [source.id, source])).values()]

  return (
    <div className={className}>
      <Disclosure id={id} title="Sumber Informasi">
        <ul className="content-disclosure__sources">
          {uniqueSources.map((source) => (
            <li id={`${id}-${source.id}`} key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
              <span>{source.publisher}{source.metadata ? ` · ${source.metadata}` : ''}</span>
            </li>
          ))}
        </ul>
      </Disclosure>
      {note ? <p className="content-disclosure__note">{note}</p> : null}
    </div>
  )
}
