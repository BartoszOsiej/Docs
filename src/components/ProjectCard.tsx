import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

interface Props {
  link: string
  icon?: string
  title: string
  description: string
  tags?: string[]
  tint?: string
}

/** Project catalog card with cursor glow, tags and arrow. */
export default function ProjectCard({
  link,
  icon = '🚀',
  title,
  description,
  tags = [],
  tint = '#818cf8',
}: Props): React.JSX.Element {
  const href = useBaseUrl(link)

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <a href={href} className="project-card" onMouseMove={onMove}>
      <div className="glow" aria-hidden="true" />
      <div className="icon" style={{ backgroundColor: `${tint}22` }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {tags.length > 0 && (
        <div className="tags">
          {tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      )}
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </a>
  )
}
