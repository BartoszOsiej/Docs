import React, { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  delay?: number
}

/** Wraps children and fades them in when scrolled into view. */
export default function ScrollReveal({ children, delay = 0 }: Props): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('visible')
            io.unobserve(node)
          }
        })
      },
      { threshold: 0.1 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="scroll-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
