import React from 'react'

interface Props {
  children: React.ReactNode
}

/** Shimmering gradient text. */
export default function AnimatedTitle({ children }: Props): React.JSX.Element {
  return <span className="animated-title">{children}</span>
}
