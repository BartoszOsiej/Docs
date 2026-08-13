import React, { useEffect, useRef, useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { detectLanguage, langLabel, translateText } from '../lib/translator'

interface Props {
  src: string
  title?: string
  initialPage?: number
}

const LANGS: Record<string, string> = {
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
  uk: 'Українська',
  cs: 'Čeština',
  sk: 'Slovenčina',
  sv: 'Svenska',
  da: 'Dansk',
  no: 'Norsk',
  fi: 'Suomi',
  tr: 'Türkçe',
  ro: 'Română',
  hu: 'Magyar',
  bg: 'Български',
  el: 'Ελληνικά',
  he: 'עברית',
  ar: 'العربية',
  hi: 'हिन्दी',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
}

type TranslationEntry = { text: string; from: string; to: string; provider: string }

/** Visual PDF book reader with keyless in-browser page translation. */
export default function PdfBookViewer({ src, title = 'PDF Book', initialPage = 1 }: Props): React.JSX.Element {
  const base = useBaseUrl('/')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [zoom, setZoom] = useState(1)
  const [fromLang, setFromLang] = useState('auto')
  const [toLang, setToLang] = useState('pl')
  const [translating, setTranslating] = useState(false)
  const [translatingAll, setTranslatingAll] = useState(false)
  const [translateProgress, setTranslateProgress] = useState(0)
  const [translationPanelOpen, setTranslationPanelOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [flipClass, setFlipClass] = useState('')
  const [stageWidth, setStageWidth] = useState(900)

  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const pdfDocRef = useRef<any>(null)
  const pdfjsRef = useRef<any>(null)
  const translationsRef = useRef<Map<number, TranslationEntry>>(new Map())
  const detectedLangRef = useRef('auto')
  const flipTimerRef = useRef<number | undefined>(undefined)

  const leftPage = currentPage === 1 ? null : currentPage % 2 === 0 ? currentPage : currentPage - 1
  const rightPage =
    currentPage === 1 ? 1 : Math.min((currentPage % 2 === 0 ? currentPage : currentPage - 1) + 1, numPages)
  const canPrev = currentPage > 1
  const canNext = currentPage < numPages

  const resolveSrc = (s: string): string => {
    if (s.startsWith('http://') || s.startsWith('https://')) return s
    if (s.startsWith('/')) return base + s.slice(1)
    return s
  }

  /* ---------------------------------------------------------------- */
  /* Loading + rendering                                               */
  /* ---------------------------------------------------------------- */

  const renderPageToCanvas = async (
    pageNum: number,
    canvas: HTMLCanvasElement | null,
  ): Promise<void> => {
    if (!canvas || !pdfDocRef.current || pageNum < 1 || pageNum > numPages) return
    const page = await pdfDocRef.current.getPage(pageNum)
    const pdfjs = pdfjsRef.current
    const baseViewport = pdfjs.getViewport({ viewport: page.getViewport({ scale: 1 }) })
    const pageW = baseViewport.width
    const pageH = baseViewport.height
    const targetW = (stageWidth - 26) / 2
    const scale = (targetW / pageW) * zoom
    const viewport = page.getViewport({ scale })
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    await page.render({ canvasContext: ctx, viewport }).promise
  }

  const renderSpread = async (): Promise<void> => {
    const jobs: Promise<void>[] = []
    if (leftPage !== null) jobs.push(renderPageToCanvas(leftPage, leftCanvasRef.current))
    jobs.push(renderPageToCanvas(rightPage, rightCanvasRef.current))
    await Promise.allSettled(jobs)
  }

  const loadPdf = async (): Promise<void> => {
    try {
      const pdfjs = await import('pdfjs-dist')
      pdfjsRef.current = pdfjs
      pdfjs.GlobalWorkerOptions.workerSrc = base + 'pdfjs/pdf.worker.min.mjs'
      const loadingTask = pdfjs.getDocument({
        url: resolveSrc(src),
        standardFontDataUrl: base + 'pdfjs/standard_fonts/',
        cMapUrl: base + 'pdfjs/cmaps/',
        cMapPacked: true,
      })
      pdfDocRef.current = await loadingTask.promise
      setNumPages(pdfDocRef.current.numPages)
      setCurrentPage(Math.min(initialPage, pdfDocRef.current.numPages))
      setReady(true)
      await renderSpread()
    } catch (err: any) {
      setError(`Could not load the PDF: ${err?.message || String(err)}`)
    }
  }

  useEffect(() => {
    void loadPdf()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  /* ---------------------------------------------------------------- */
  /* Page turning                                                      */
  /* ---------------------------------------------------------------- */

  const turn = (dir: 1 | -1): void => {
    if (!ready || translating || translatingAll) return
    if (dir === 1 && !canNext) return
    if (dir === -1 && !canPrev) return
    const target = currentPage + dir
    setFlipClass(dir === 1 ? 'flip-next' : 'flip-prev')
    window.clearTimeout(flipTimerRef.current)
    flipTimerRef.current = window.setTimeout(() => {
      setCurrentPage(target)
      setFlipClass('')
      void renderSpread()
    }, 420)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') turn(1)
      else if (e.key === 'ArrowLeft') turn(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(flipTimerRef.current)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, translating, translatingAll, canNext, canPrev, currentPage])

  const measure = (): void => {
    if (typeof window === 'undefined') return
    const w = Math.min(window.innerWidth - 48, 1080)
    setStageWidth(Math.max(320, w))
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /* ---------------------------------------------------------------- */
  /* Text extraction + translation                                     */
  /* ---------------------------------------------------------------- */

  const extractPageText = async (pageNum: number): Promise<string> => {
    const page = await pdfDocRef.current.getPage(pageNum)
    const content = await page.getTextContent()
    let out = ''
    let lastY: number | null = null
    for (const item of content.items as any[]) {
      const y = item.transform?.[5] ?? 0
      if (lastY !== null && Math.abs(y - lastY) > 2) out += '\n'
      out += item.str ?? ''
      lastY = y
    }
    return out
  }

  const translatePage = async (pageNum: number): Promise<void> => {
    const raw = await extractPageText(pageNum)
    if (!raw.trim()) {
      translationsRef.current.set(pageNum, {
        text: '(no extractable text on this page)',
        from: '?',
        to: toLang,
        provider: '—',
      })
      return
    }
    const from =
      fromLang === 'auto'
        ? detectedLangRef.current || (await detectLanguage(raw))
        : fromLang
    if (detectedLangRef.current === 'auto' && from !== 'auto') detectedLangRef.current = from
    const res = await translateText(raw, from, toLang)
    translationsRef.current.set(pageNum, { text: res.text, from, to: toLang, provider: res.provider })
  }

  const translateCurrent = async (): Promise<void> => {
    if (!ready || translating) return
    setTranslating(true)
    setTranslationPanelOpen(true)
    try {
      await translatePage(currentPage)
    } catch (err: any) {
      translationsRef.current.set(currentPage, {
        text: `Translation failed: ${err?.message || err}`,
        from: '?',
        to: toLang,
        provider: '—',
      })
    } finally {
      setTranslating(false)
    }
  }

  const translateAll = async (): Promise<void> => {
    if (!ready || translatingAll) return
    setTranslatingAll(true)
    setTranslationPanelOpen(true)
    setTranslateProgress(0)
    try {
      for (let p = 1; p <= numPages; p++) {
        try {
          await translatePage(p)
        } catch {
          /* keep going on per-page errors */
        }
        setTranslateProgress(Math.round((p / numPages) * 100))
      }
    } finally {
      setTranslatingAll(false)
    }
  }

  /* ---------------------------------------------------------------- */
  /* Panel helpers                                                     */
  /* ---------------------------------------------------------------- */

  const overlayFor = (pageNum: number | null): string => {
    if (pageNum === null) return ''
    const t = translationsRef.current.get(pageNum)
    return showOverlay && t ? t.text : ''
  }

  const langLabelFor = (pageNum: number | null): string => {
    if (pageNum === null) return ''
    const t = translationsRef.current.get(pageNum)
    if (!t) return ''
    return `${langLabel(t.from)} → ${langLabel(t.to)} · ${t.provider}`
  }

  const currentTranslation = translationsRef.current.get(currentPage)
  const panelText = currentTranslation ? currentTranslation.text : ''
  const panelMeta =
    currentTranslation && currentTranslation.from !== '?'
      ? `${langLabel(currentTranslation.from)} → ${langLabel(currentTranslation.to)} via ${currentTranslation.provider} · page ${currentPage}`
      : ''

  const bookStyle: React.CSSProperties = {
    width: `${stageWidth}px`,
    height: `${Math.round(stageWidth * 0.68)}px`,
  }

  return (
    <div className={`pbv${ready ? ' ready' : ''}`}>
      {/* toolbar */}
      <div className="pbv-toolbar">
        <div className="pbv-title">
          <span className="pbv-book-icon">📖</span>
          <span>{title}</span>
        </div>
        <div className="pbv-controls">
          <div className="pbv-nav">
            <button className="pbv-btn" disabled={!canPrev} aria-label="Previous page" onClick={() => turn(-1)}>
              ‹
            </button>
            <span className="pbv-page-indicator">{numPages ? `${currentPage} / ${numPages}` : '—'}</span>
            <button className="pbv-btn" disabled={!canNext} aria-label="Next page" onClick={() => turn(1)}>
              ›
            </button>
          </div>
          <label className="pbv-zoom">
            🔍
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span>{Math.round(zoom * 100)}%</span>
          </label>
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="pbv-lang"
            disabled={!ready}
            aria-label="Source language"
          >
            <option value="auto">Auto-detect</option>
            {Object.entries(LANGS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <span className="pbv-arrow">→</span>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="pbv-lang"
            disabled={!ready}
            aria-label="Target language"
          >
            {Object.entries(LANGS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <button
            className="pbv-btn pbv-primary"
            disabled={!ready || translating}
            onClick={() => void translateCurrent()}
          >
            {translating ? 'Translating…' : 'Translate page'}
          </button>
          <button
            className="pbv-btn pbv-ghost"
            disabled={!ready || translatingAll}
            onClick={() => void translateAll()}
          >
            {translatingAll ? `Translating ${translateProgress}%` : 'Translate all'}
          </button>
        </div>
      </div>

      {/* status / errors */}
      {error && <div className="pbv-error">⚠️ {error}</div>}
      {!error && !ready && (
        <div className="pbv-loading">
          <span className="pbv-spinner" /> Loading PDF…
        </div>
      )}

      {/* book stage */}
      {ready && (
        <div className="pbv-stage" style={{ perspective: '1600px' }}>
          <div className={`pbv-book ${flipClass}`} style={bookStyle}>
            {/* left page */}
            <div className={`pbv-page pbv-page-left${leftPage === null ? ' is-cover' : ''}`}>
              <canvas ref={leftCanvasRef} className="pbv-canvas" />
              {leftPage === null && (
                <div className="pbv-cover">
                  <div className="pbv-cover-inner">
                    <div className="pbv-cover-icon">📖</div>
                    <div className="pbv-cover-title">{title}</div>
                    <div className="pbv-cover-sub">{numPages} pages</div>
                  </div>
                </div>
              )}
              {leftPage !== null && overlayFor(leftPage) && (
                <div className={`pbv-overlay${!showOverlay ? ' compact' : ''}`}>
                  <button
                    className="pbv-overlay-close"
                    aria-label="Close overlay"
                    onClick={() => setShowOverlay(false)}
                  >
                    ✕
                  </button>
                  <div className="pbv-overlay-lang">{langLabelFor(leftPage)}</div>
                  <p>{overlayFor(leftPage)}</p>
                </div>
              )}
            </div>

            {/* spine */}
            <div className="pbv-spine" aria-hidden="true" />

            {/* right page */}
            <div className="pbv-page pbv-page-right">
              <canvas ref={rightCanvasRef} className="pbv-canvas" />
              {overlayFor(rightPage) && (
                <div className={`pbv-overlay${!showOverlay ? ' compact' : ''}`}>
                  <button
                    className="pbv-overlay-close"
                    aria-label="Close overlay"
                    onClick={() => setShowOverlay(false)}
                  >
                    ✕
                  </button>
                  <div className="pbv-overlay-lang">{langLabelFor(rightPage)}</div>
                  <p>{overlayFor(rightPage)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* translation panel */}
      {ready && (translationPanelOpen || translatingAll) && (
        <div className="pbv-panel">
          <div className="pbv-panel-head">
            <strong>🌐 Translation</strong>
            <span className="pbv-panel-meta">{panelMeta}</span>
            <button className="pbv-btn pbv-ghost pbv-panel-close" onClick={() => setTranslationPanelOpen(false)}>
              Hide
            </button>
          </div>
          {translatingAll && (
            <div className="pbv-progress">
              <div className="pbv-progress-bar" style={{ width: `${translateProgress}%` }} />
            </div>
          )}
          <p className="pbv-panel-text">
            {panelText || 'Select “Translate page” to see the translation here.'}
          </p>
        </div>
      )}

      {ready && (
        <div className="pbv-foot">
          <label className="pbv-toggle">
            <input type="checkbox" checked={showOverlay} onChange={(e) => setShowOverlay(e.target.checked)} />
            Show translation on the page
          </label>
          <span className="pbv-hint">
            Translation runs in your browser via keyless providers (Google · MyMemory). No key, no account, no
            server.
          </span>
        </div>
      )}
    </div>
  )
}
