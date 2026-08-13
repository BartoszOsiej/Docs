import React, { useEffect, useMemo, useRef, useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

interface MapNode {
  id: string
  label: string
  sub: string
  url?: string
  group: 'docs' | 'research' | 'project' | 'tech'
  color: string
  tech?: string[]
}

interface MapEdge {
  s: string
  t: string
  kind: 'docs' | 'tech'
}

type Copy = {
  hint: string
  legendTitle: string
  legend: Array<{ label: string; color: string }>
  open: string
  n: Record<string, { label: string; sub: string }>
  tech: Record<string, string>
}

const EN: Copy = {
  hint: 'Drag nodes · scroll to zoom · click a node to open its docs',
  legendTitle: 'Legend',
  legend: [
    { label: 'Docs Hub', color: '#38bdf8' },
    { label: 'R&D', color: '#2dd4bf' },
    { label: 'Projects', color: '#818cf8' },
    { label: 'Technologies', color: '#ffd166' },
  ],
  open: 'Open docs →',
  n: {
    hub: { label: 'Docs Hub', sub: 'Docusaurus · GitHub Pages' },
    rnd: { label: 'R&D', sub: 'Quantum Flash Tomograph · Zenodo' },
    n2mesh: { label: 'N2 Mesh', sub: 'WebRTC · MQTT · serverless' },
    link: { label: 'LinkShort', sub: 'FastAPI · React 19 · SQLite' },
    nova: { label: 'Novactorio', sub: 'TypeScript · Canvas 2D · Supabase' },
    nv2: { label: 'NV2 Engine', sub: 'Rust · wgpu · MLP' },
    aurora: { label: 'AURORA OS', sub: 'TypeScript · zero deps' },
    cyber: { label: 'Cybersec Toolkit', sub: 'Rust · pcap · OpenSSL' },
    halcyon: { label: 'Halcyon Monitor', sub: 'Rust · eBPF · Aya' },
    externum: { label: 'Externum', sub: 'Python · own compiler' },
  },
  tech: {
    rust: 'Rust',
    ts: 'TypeScript',
    py: 'Python',
    web: 'Web · JS',
    sys: 'Systems · Linux',
  },
}

const PL: Copy = {
  hint: 'Przeciągaj węzły · scroll = zoom · klik = otwórz dokumentację',
  legendTitle: 'Legenda',
  legend: [
    { label: 'Docs Hub', color: '#38bdf8' },
    { label: 'R&D', color: '#2dd4bf' },
    { label: 'Projekty', color: '#818cf8' },
    { label: 'Technologie', color: '#ffd166' },
  ],
  open: 'Otwórz dokumentację →',
  n: {
    hub: { label: 'Docs Hub', sub: 'Docusaurus · GitHub Pages' },
    rnd: { label: 'R&D', sub: 'Quantum Flash Tomograph · Zenodo' },
    n2mesh: { label: 'N2 Mesh', sub: 'WebRTC · MQTT · bez serwera' },
    link: { label: 'LinkShort', sub: 'FastAPI · React 19 · SQLite' },
    nova: { label: 'Novactorio', sub: 'TypeScript · Canvas 2D · Supabase' },
    nv2: { label: 'NV2 Engine', sub: 'Rust · wgpu · MLP' },
    aurora: { label: 'AURORA OS', sub: 'TypeScript · zero zależności' },
    cyber: { label: 'Cybersec Toolkit', sub: 'Rust · pcap · OpenSSL' },
    halcyon: { label: 'Halcyon Monitor', sub: 'Rust · eBPF · Aya' },
    externum: { label: 'Externum', sub: 'Python · własny kompilator' },
  },
  tech: {
    rust: 'Rust',
    ts: 'TypeScript',
    py: 'Python',
    web: 'Web · JS',
    sys: 'Systemy · Linux',
  },
}

const WORLD_W = 900
const WORLD_H = 560
const CENTER_X = WORLD_W / 2
const CENTER_Y = WORLD_H / 2

const PROJECT_IDS = ['rnd', 'n2mesh', 'link', 'nova', 'nv2', 'aurora', 'cyber', 'halcyon', 'externum']
const TECH_IDS = ['rust', 'ts', 'py', 'web', 'sys']

const PROJECT_COLORS: Record<string, string> = {
  hub: '#38bdf8',
  rnd: '#2dd4bf',
  n2mesh: '#a78bfa',
  link: '#34d399',
  nova: '#fbbf24',
  nv2: '#818cf8',
  aurora: '#f472b6',
  cyber: '#fb7185',
  halcyon: '#a3e635',
  externum: '#f59e0b',
}
const TECH_COLORS: Record<string, string> = {
  rust: '#b48cff',
  ts: '#7cc4ff',
  py: '#58d6a9',
  web: '#ffd166',
  sys: '#8be04e',
}
const TECH_TAGS: Record<string, string[]> = {
  nv2: ['rust'],
  cyber: ['rust', 'sys'],
  halcyon: ['rust', 'sys'],
  externum: ['py'],
  link: ['py', 'web'],
  nova: ['ts', 'web'],
  aurora: ['ts', 'web', 'sys'],
  n2mesh: ['web'],
  hub: ['web', 'sys'],
}

function buildGraph(copy: Copy): { nodes: MapNode[]; edges: MapEdge[]; neighbors: Map<string, Set<string>> } {
  const nodes: MapNode[] = []
  for (const id of ['hub', ...PROJECT_IDS]) {
    const n = copy.n[id]
    nodes.push({
      id,
      label: n.label,
      sub: n.sub,
      url: id === 'hub' ? '/' : id === 'rnd' ? '/rd/' : `/projects/${id}/`,
      group: id === 'hub' ? 'docs' : id === 'rnd' ? 'research' : 'project',
      color: PROJECT_COLORS[id],
      tech: TECH_TAGS[id],
    })
  }
  for (const id of TECH_IDS) {
    nodes.push({ id, label: copy.tech[id], sub: '', group: 'tech', color: TECH_COLORS[id] })
  }

  const edges: MapEdge[] = []
  const neighbors = new Map<string, Set<string>>()
  const touch = (a: string, b: string): void => {
    if (!neighbors.has(a)) neighbors.set(a, new Set())
    if (!neighbors.has(b)) neighbors.set(b, new Set())
    neighbors.get(a)!.add(b)
    neighbors.get(b)!.add(a)
  }
  for (const id of PROJECT_IDS) {
    edges.push({ s: id, t: 'hub', kind: 'docs' })
    touch(id, 'hub')
    for (const t of TECH_TAGS[id] ?? []) {
      edges.push({ s: t, t: id, kind: 'tech' })
      touch(t, id)
    }
  }
  return { nodes, edges, neighbors }
}

interface SimNode {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

function initialSim(nodes: MapNode[]): SimNode[] {
  return nodes.map((nd, i) => {
    if (nd.id === 'hub') return { x: CENTER_X, y: CENTER_Y, vx: 0, vy: 0, r: 30 }
    if (nd.group === 'tech') {
      const pos: Record<string, [number, number]> = {
        rust: [160, 120],
        sys: [740, 120],
        web: [450, 70],
        ts: [150, 430],
        py: [750, 430],
      }
      const [x, y] = pos[nd.id] ?? [CENTER_X, CENTER_Y]
      return { x, y, vx: 0, vy: 0, r: 12 }
    }
    const ringIdx = PROJECT_IDS.indexOf(nd.id)
    const ang = -Math.PI / 2 + (ringIdx * 2 * Math.PI) / PROJECT_IDS.length
    return {
      x: CENTER_X + Math.cos(ang) * 185,
      y: CENTER_Y + Math.sin(ang) * 185,
      vx: 0,
      vy: 0,
      r: 20,
    }
  })
}

export default function RepoMap(): React.JSX.Element {
  const { i18n } = useDocusaurusContext()
  const copy = i18n.currentLocale === 'pl' ? PL : EN
  const base = useBaseUrl('/')

  const { nodes, edges, neighbors } = useMemo(() => buildGraph(copy), [copy])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ w: 900, h: 560 })
  const [sim, setSim] = useState<SimNode[]>(() => initialSim(nodes))
  const simRef = useRef<SimNode[]>(sim)
  simRef.current = sim

  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 })
  const viewRef = useRef(view)
  viewRef.current = view

  const [hover, setHover] = useState<string | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null)

  const dragRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null)
  const panRef = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null)
  const runningRef = useRef(false)
  const calmRef = useRef(0)

  /* Fit world into container */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = (): void => {
      const w = el.clientWidth || 900
      const h = Math.max(380, Math.min(560, w * 0.62))
      setSize({ w, h })
      const k = Math.min(w / WORLD_W, h / WORLD_H) * 0.98
      setView({ k, tx: (w - WORLD_W * k) / 2, ty: (h - WORLD_H * k) / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Physics */
  const stepPhysics = (): void => {
    const s = simRef.current
    const n = s.length
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = s[j].x - s[i].x
        const dy = s[j].y - s[i].y
        let d2 = dx * dx + dy * dy
        if (d2 < 1) d2 = 1
        const d = Math.sqrt(d2)
        const f = (2600 / d2) * Math.min(1, d / 60)
        const fx = (dx / d) * f
        const fy = (dy / d) * f
        s[i].vx -= fx
        s[i].vy -= fy
        s[j].vx += fx
        s[j].vy += fy
      }
    }
    for (const e of edges) {
      const si = nodeIndex.get(e.s)
      const ti = nodeIndex.get(e.t)
      if (si === undefined || ti === undefined) continue
      const src = s[si]
      const tgt = s[ti]
      const dx = tgt.x - src.x
      const dy = tgt.y - src.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const rest = e.kind === 'docs' ? 165 : 120
      const f = (d - rest) * 0.05
      const fx = (dx / d) * f
      const fy = (dy / d) * f
      const hubFactor = e.s === 'hub' || e.t === 'hub' ? 0.6 : 1
      src.vx += fx * hubFactor
      src.vy += fy * hubFactor
      tgt.vx -= fx * hubFactor
      tgt.vy -= fy * hubFactor
    }
    for (let i = 0; i < n; i++) {
      const p = s[i]
      p.vx += (CENTER_X - p.x) * 0.012
      p.vy += (CENTER_Y - p.y) * 0.012
      p.vx *= 0.86
      p.vy *= 0.86
      const speed = Math.hypot(p.vx, p.vy)
      const maxV = 14
      if (speed > maxV) {
        p.vx = (p.vx / speed) * maxV
        p.vy = (p.vy / speed) * maxV
      }
      p.x += p.vx
      p.y += p.vy
    }
  }

  const startLoop = (): void => {
    if (runningRef.current) return
    runningRef.current = true
    calmRef.current = 0
    const loop = (): void => {
      if (!runningRef.current) return
      stepPhysics()
      setSim([...simRef.current])
      const energy = simRef.current.reduce((acc, p) => acc + Math.abs(p.vx) + Math.abs(p.vy), 0)
      if (energy < 0.6) {
        calmRef.current++
        if (calmRef.current > 15) {
          runningRef.current = false
          return
        }
      } else {
        calmRef.current = 0
      }
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    startLoop()
    return () => {
      runningRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toWorld = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = containerRef.current?.getBoundingClientRect()
    const { k, tx, ty } = viewRef.current
    const x = (clientX - (rect?.left ?? 0) - tx) / k
    const y = (clientY - (rect?.top ?? 0) - ty) / k
    return { x, y }
  }

  const nodeIndex = useMemo(() => {
    const m = new Map<string, number>()
    nodes.forEach((nd, i) => m.set(nd.id, i))
    return m
  }, [nodes])

  const onNodeDown = (e: React.PointerEvent<SVGGElement>, id: string): void => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const w = toWorld(e.clientX, e.clientY)
    dragRef.current = { id, startX: w.x, startY: w.y, moved: false }
    setHover(id)
    startLoop()
  }

  const onNodeMove = (e: React.PointerEvent<SVGSVGElement>): void => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (dragRef.current) {
      const w = toWorld(e.clientX, e.clientY)
      const d = dragRef.current
      const simArr = simRef.current
      const idx = nodeIndex.get(d.id)
      if (idx !== undefined) {
        simArr[idx].x = w.x
        simArr[idx].y = w.y
        simArr[idx].vx = 0
        simArr[idx].vy = 0
      }
      if (Math.abs(w.x - d.startX) + Math.abs(w.y - d.startY) > 6) d.moved = true
      setSim([...simArr])
      return
    }
    const target = (e.target as Element | null)?.closest?.('g[data-node]') as SVGGElement | null
    const id = target?.dataset.node
    if (id) {
      setHover(id)
      if (rect) setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, id })
    }
  }

  const endDrag = (): void => {
    const d = dragRef.current
    if (d && !d.moved) {
      const nd = nodes.find((x) => x.id === d.id)
      if (nd?.url) window.location.href = base + nd.url.replace(/^\//, '')
    }
    dragRef.current = null
    startLoop()
  }

  const onBgDown = (e: React.PointerEvent<SVGSVGElement>): void => {
    if ((e.target as Element)?.closest?.('[data-node]')) return
    panRef.current = { px: e.clientX, py: e.clientY, tx: viewRef.current.tx, ty: viewRef.current.ty }
  }
  const onBgMove = (e: React.PointerEvent<SVGSVGElement>): void => {
    if (panRef.current) {
      const p = panRef.current
      setView({ ...viewRef.current, tx: p.tx + (e.clientX - p.px), ty: p.ty + (e.clientY - p.py) })
    }
  }
  const endPan = (): void => {
    panRef.current = null
  }

  const onWheel = (e: React.WheelEvent<SVGSVGElement>): void => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const { k, tx, ty } = viewRef.current
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
    const nk = Math.min(3, Math.max(0.25, k * factor))
    const ntx = mx - ((mx - tx) / k) * nk
    const nty = my - ((my - ty) / k) * nk
    setView({ k: nk, tx: ntx, ty: nty })
  }

  const onLeave = (): void => {
    setHover(null)
    setTip(null)
  }

  const related = (id: string): Set<string> | null => (id ? neighbors.get(id) ?? new Set() : null)

  const nodeScreen = (p: SimNode): { x: number; y: number } => ({
    x: p.x * view.k + view.tx,
    y: p.y * view.k + view.ty,
  })

  const colorFor = (id: string): string => nodes[nodeIndex.get(id) ?? 0]?.color ?? '#888'

  return (
    <div className="repo-map">
      <div ref={containerRef} className="repo-map-stage">
        <svg
          className="repo-map-svg"
          width={size.w}
          height={size.h}
          onPointerMove={onNodeMove}
          onPointerDown={onBgDown}
          onPointerUp={() => {
            endDrag()
            endPan()
          }}
          onPointerLeave={onLeave}
          onWheel={onWheel}
          style={{ touchAction: 'none', cursor: panRef.current ? 'grabbing' : 'grab' }}
        >
          <defs>
            <pattern id="rm-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="var(--ifm-color-emphasis-300)" />
            </pattern>
          </defs>
          <rect x={0} y={0} width={size.w} height={size.h} fill="url(#rm-dots)" rx={14} />
          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}>
            {edges.map((e, i) => {
              const s = sim[nodeIndex.get(e.s) ?? 0]
              const t = sim[nodeIndex.get(e.t) ?? 0]
              if (!s || !t) return null
              const active = hover ? (related(hover)?.has(e.s) && related(hover)?.has(e.t)) || e.s === hover || e.t === hover : false
              const dim = hover ? !active : false
              const col = e.kind === 'docs' ? 'var(--ifm-color-emphasis-500)' : colorFor(e.s)
              return (
                <line
                  key={i}
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={col}
                  strokeWidth={e.kind === 'docs' ? 1.4 : 1}
                  strokeDasharray={e.kind === 'docs' ? '4 4' : undefined}
                  opacity={dim ? 0.08 : active ? 0.9 : 0.35}
                />
              )
            })}
            {nodes.map((nd, i) => {
              const p = sim[i]
              const isHub = nd.id === 'hub'
              const isTech = nd.group === 'tech'
              const active = hover === nd.id || (hover ? related(hover)?.has(nd.id) : false)
              const dim = hover ? !active && nd.id !== hover : false
              const sp = nodeScreen(p)
              return (
                <g
                  key={nd.id}
                  data-node={nd.id}
                  onPointerDown={(e) => onNodeDown(e, nd.id)}
                  style={{ cursor: nd.url ? 'pointer' : 'grab', opacity: dim ? 0.2 : 1 }}
                >
                  {isTech ? (
                    <rect
                      x={p.x - p.r - 4}
                      y={p.y - 9}
                      width={(p.r + 4) * 2}
                      height={18}
                      rx={9}
                      fill={nd.color}
                      opacity={0.9}
                    />
                  ) : (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.r}
                      fill={nd.color}
                      fillOpacity={active ? 0.32 : 0.16}
                      stroke={nd.color}
                      strokeWidth={isHub ? 3 : 2}
                    />
                  )}
                  <text
                    x={isTech ? p.x : p.x}
                    y={isTech ? p.y + 4 : p.y + p.r + 15}
                    textAnchor="middle"
                    fontSize={isTech ? 11 : 12}
                    fontWeight={isHub ? 700 : 600}
                    fill="var(--ifm-font-color-secondary)"
                  >
                    {nd.label}
                  </text>
                  {!isTech && hover === nd.id && sp.y > 70 && (
                    <text x={p.x} y={p.y + p.r + 28} textAnchor="middle" fontSize={9.5} fill="var(--ifm-color-emphasis-500)">
                      {nd.sub}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {tip && (
          <div className="repo-map-tip" style={{ left: tip.x + 14, top: tip.y - 8 }}>
            <strong>{nodes[nodeIndex.get(tip.id) ?? 0]?.label}</strong>
            <span>{nodes[nodeIndex.get(tip.id) ?? 0]?.sub}</span>
            <em>{copy.open}</em>
          </div>
        )}

        <div className="repo-map-legend">
          <strong>{copy.legendTitle}</strong>
          {copy.legend.map((l) => (
            <span key={l.label} className="repo-map-legend-item">
              <i style={{ background: l.color }} /> {l.label}
            </span>
          ))}
        </div>
      </div>
      <p className="repo-map-hint">{copy.hint}</p>
    </div>
  )
}
