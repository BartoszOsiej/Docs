import React from 'react'

interface Props {
  children: React.ReactNode
  interactive?: boolean
}

/** Glassy card with a cursor-following glow. */
export default function GlowCard({ children, interactive = true }: Props): React.JSX.Element {
  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className={`glow-card${interactive ? ' interactive' : ''}`} onMouseMove={onMove}>
      <div className="glow" aria-hidden="true" />
      <div className="content">{children}</div>
    </div>
  )
}
