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

    // No IntersectionObserver (very old browsers): show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('visible')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('visible')
            io.unobserve(node)
          }
        })
      },
      // threshold 0 + negative bottom margin: fires as soon as ANY pixel
      // enters the viewport — critical for tall sections on small screens.
      { threshold: 0, rootMargin: '0px 0px -4% 0px' },
    )

    // Safety: if the element is already fully above/below or IO never fires
    // within 1.5 s (edge cases, bugged mobile observers), reveal anyway.
    const failSafe = window.setTimeout(() => node.classList.add('visible'), 1500)

    io.observe(node)
    return () => {
      window.clearTimeout(failSafe)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="scroll-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
