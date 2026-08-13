import React, { useEffect, useRef, useState } from 'react'
import { findProject, type ProjectTests, type TestGroup, type TestCheck } from '../data/tests'

interface Props {
  project: string
  lang?: 'en' | 'pl'
}

const T: { en: { [k: string]: string }; pl: { [k: string]: string } } = {
  en: {
    allPass: 'All tests pass',
    warn: 'Partial',
    fail: 'Failed',
    passed: 'passed',
    failed: 'failed',
    ignored: 'ignored',
    total: 'total',
    suite: 'Suite',
    duration: 'Duration',
    command: 'Re-run',
    replay: 'Replay animation',
    coverage: 'Coverage',
    checks: 'Quality gates',
    notes: 'Notes',
    report: 'Full report on GitHub',
  },
  pl: {
    allPass: 'Wszystkie testy zaliczone',
    warn: 'Częściowo',
    fail: 'Niepowodzenie',
    passed: 'zaliczone',
    failed: 'błędy',
    ignored: 'zignorowane',
    total: 'razem',
    suite: 'Zestaw',
    duration: 'Czas',
    command: 'Odtworzenie',
    replay: 'Powtórz animację',
    coverage: 'Zakres',
    checks: 'Bramki jakości',
    notes: 'Uwagi',
    report: 'Pełny raport na GitHubie',
  },
}

interface CountUpProps {
  value: number
  started: boolean
  duration?: number
}

function CountUp({ value, started, duration = 900 }: CountUpProps): React.JSX.Element {
  const [display, setDisplay] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    if (!started) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from.current + (value - from.current) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, value, duration])
  return <span>{display.toLocaleString()}</span>
}

function statusOf(s: string): string {
  if (s === 'pass') return '✅'
  if (s === 'warn') return '⚠️'
  return '❌'
}

function GroupRow({ group, started, index, t }: { group: TestGroup; started: boolean; index: number; t: { [k: string]: string } }): React.JSX.Element {
  const pct = group.status === 'pass' ? 100 : group.status === 'warn' ? 66 : 0
  return (
    <div
      className="ts-group"
      style={{ animationDelay: `${120 + index * 90}ms` }}
      data-visible={started}
    >
      <div className="ts-group-head">
        <span className={`ts-badge ts-${group.status}`}>{statusOf(group.status)}</span>
        <span className="ts-group-title">{group.title}</span>
        <span className="ts-group-count">
          <CountUp value={group.count} started={started} />
        </span>
      </div>
      <div className="ts-bar">
        <div className={`ts-bar-fill ts-${group.status}`} style={{ width: started ? `${pct}%` : '0%' }} />
      </div>
      <div className="ts-group-cov">{group.coverage}</div>
    </div>
  )
}

function CheckRow({ check, started, index, t }: { check: TestCheck; started: boolean; index: number; t: { [k: string]: string } }): React.JSX.Element {
  return (
    <div className="ts-check" style={{ animationDelay: `${120 + index * 80}ms` }} data-visible={started}>
      <span className={`ts-badge ts-${check.status}`}>{statusOf(check.status)}</span>
      <span className="ts-check-label">{check.label}</span>
      <span className="ts-check-result">{check.result}</span>
    </div>
  )
}

/**
 * Animated, highlighted test results for one project.
 * Count-up numbers, progress bars and staggered rows animate when the
 * block scrolls into view; a replay button restarts them.
 */
export default function TestSuiteView({ project, lang = 'en' }: Props): React.JSX.Element {
  const data: ProjectTests = findProject(project)
  const t = T[lang]
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    setStarted(false)
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.12 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [run])

  const passPct = data.total > 0 ? (data.passed / data.total) * 100 : 100

  return (
    <div className="ts-root" ref={ref}>
      {/* ── summary hero ─────────────────────────────────────── */}
      <div className={`ts-hero ts-${data.status}`}>
        <div className="ts-hero-status">
          <span className="ts-hero-badge">{statusOf(data.status)}</span>
          <div>
            <div className="ts-hero-title">
              {data.status === 'pass' ? t.allPass : data.status === 'warn' ? t.warn : t.fail}
            </div>
            <div className="ts-hero-sub">{data.summary}</div>
          </div>
        </div>

        <div className="ts-hero-stats">
          {data.total > 0 ? (
            <>
              <div className="ts-stat">
                <div className="ts-stat-num">
                  <CountUp value={data.passed} started={started} />
                </div>
                <div className="ts-stat-label">{t.passed}</div>
              </div>
              <div className="ts-stat">
                <div className="ts-stat-num ts-stat-fail">
                  <CountUp value={data.failed} started={started} />
                </div>
                <div className="ts-stat-label">{t.failed}</div>
              </div>
              <div className="ts-stat">
                <div className="ts-stat-num ts-stat-muted">
                  <CountUp value={data.total} started={started} />
                </div>
                <div className="ts-stat-label">{t.total}</div>
              </div>
            </>
          ) : (
            <div className="ts-stat">
              <div className="ts-stat-num ts-stat-ok">✓</div>
              <div className="ts-stat-label">{t.allPass}</div>
            </div>
          )}
        </div>

        <div className="ts-hero-bar">
          <div className="ts-bar ts-bar-hero">
            <div
              className="ts-bar-fill ts-pass"
              style={{ width: started ? `${passPct}%` : '0%', transitionDelay: '200ms' }}
            />
          </div>
        </div>

        <div className="ts-hero-meta">
          <span>
            <strong>{t.suite}:</strong> <code>{data.suite}</code>
          </span>
          <span>
            <strong>{t.duration}:</strong> {data.duration}
          </span>
          {data.ignored > 0 && (
            <span>
              <strong>{t.ignored}:</strong> {data.ignored}
            </span>
          )}
          <button type="button" className="ts-replay" onClick={() => setRun((r) => r + 1)}>
            ▶ {t.replay}
          </button>
        </div>
      </div>

      {/* ── groups ───────────────────────────────────────────── */}
      {data.groups.length > 0 && (
        <div className="ts-groups">
          {data.groups.map((g, i) => (
            <GroupRow key={g.title} group={g} started={started} index={i} t={t} />
          ))}
        </div>
      )}

      {/* ── checks ───────────────────────────────────────────── */}
      {data.checks.length > 0 && (
        <div className="ts-section">
          <h3 className="ts-section-title">🔎 {t.checks}</h3>
          {data.checks.map((c, i) => (
            <CheckRow key={c.label} check={c} started={started} index={i} t={t} />
          ))}
        </div>
      )}

      {/* ── notes ────────────────────────────────────────────── */}
      {data.notes.length > 0 && (
        <div className="ts-section">
          <h3 className="ts-section-title">📝 {t.notes}</h3>
          <ul className="ts-notes">
            {data.notes.map((n, i) => (
              <li key={i} style={{ animationDelay: `${i * 120}ms` }} data-visible={started}>
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      <a className="ts-report-link" href={data.reportUrl} target="_blank" rel="noreferrer">
        {t.report} → {data.name} · TEST_REPORT.md
      </a>
    </div>
  )
}
