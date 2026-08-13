/**
 * Central, always-current test data for every project — consumed by the
 * animated `TestSuiteView` component on each project's tests page
 * (EN: `/projects/<project>/tests`, PL: `/pl/projects/<project>/testy`).
 *
 * Refresh this file after every QA sweep; the pages update automatically.
 */

export type TestStatus = 'pass' | 'warn' | 'fail'

export interface TestGroup {
  title: string
  count: number
  status: TestStatus
  coverage: string
}

export interface TestCheck {
  label: string
  result: string
  status: TestStatus
}

export interface ProjectTests {
  id: string
  name: string
  suite: string
  total: number
  passed: number
  failed: number
  ignored: number
  duration: string
  status: TestStatus
  summary: string
  groups: TestGroup[]
  checks: TestCheck[]
  notes: string[]
  reportUrl: string
}

const pass: TestStatus = 'pass'
const warn: TestStatus = 'warn'

export const projectTests: ProjectTests[] = [
  {
    id: 'nv2-engine',
    name: 'NV2 Engine',
    suite: 'cargo test (+ release benchmark)',
    total: 99,
    passed: 98,
    failed: 0,
    ignored: 1,
    duration: '~16 s',
    status: pass,
    summary: 'Rust voxel engine — 98/98 unit tests green, NaN-hardened AI, Phase-2 features (model sharing, datasets, player preferences).',
    groups: [
      { title: 'AI / ML modules', count: 34, status: pass, coverage: 'ai_generator (18), memplp (10), online_trainer (2), vegetation (3), biomes (1)' },
      { title: 'Gameplay', count: 38, status: pass, coverage: 'interaction (19), crafting (6), inventory (13)' },
      { title: 'World & terrain', count: 13, status: pass, coverage: 'block (7), world (6)' },
      { title: 'Shell / misc', count: 7, status: pass, coverage: 'commands incl. /ai_* (6), assets (1)' },
      { title: 'Renderer', count: 6, status: pass, coverage: 'camera (3), mesh (2), texture_registry (1)' },
    ],
    checks: [
      { label: 'Performance benchmark (release)', result: 'vegetation head ~1.44 M pred/s · training ~0.96 M samples/s', status: pass },
      { label: '`unsafe` blocks in the whole codebase', result: '0', status: pass },
      { label: 'Clippy (--all-targets)', result: '43 warnings, 0 errors (pre-existing style nits)', status: warn },
    ],
    notes: [
      'NaN checkpoint corruption fixed this sweep: gradient clipping, sanitise-on-save, tolerant load (null → 0.0).',
      'Phase-2 features: /ai_export, /ai_import (nv2-model-bundle), /ai_dataset, /ai_stats (player preferences).',
    ],
    reportUrl: 'https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md',
  },
  {
    id: 'cybersec-tools',
    name: 'Cybersec Toolkit',
    suite: 'cargo test --workspace',
    total: 29,
    passed: 29,
    failed: 0,
    ignored: 0,
    duration: '~0.1 s',
    status: pass,
    summary: 'Four Rust security tools — 29/29 tests green across all crates.',
    groups: [
      { title: 'hashsleuth', count: 8, status: pass, coverage: 'hash identification (hex lengths, crypt/Django/LDAP/phpass prefixes), known-answer vectors' },
      { title: 'netrecon', count: 8, status: pass, coverage: 'service names, ports/ranges, CIDR expansion + rejection, invalid forms' },
      { title: 'packeteye', count: 8, status: pass, coverage: 'TCP SYN/SYNACK/FIN, UDP ports, ICMP, ARP, IPv6 skip, garbage safety' },
      { title: 'shadowscan', count: 5, status: pass, coverage: 'target normalization incl. ports, queries, schemes, whitespace' },
    ],
    checks: [],
    notes: [
      'Suite grew 13 → 29 in the latest sweep.',
      'Earlier tests exposed a real phpass-detection bug ($P$/$H$ markers) — fixed.',
    ],
    reportUrl: 'https://github.com/BartoszOsiej/cybersec-tools/blob/main/TEST_REPORT.md',
  },
  {
    id: 'halcyon-process-monitor',
    name: 'Halcyon Process Monitor',
    suite: 'cargo test',
    total: 9,
    passed: 9,
    failed: 0,
    ignored: 0,
    duration: '~0.02 s',
    status: pass,
    summary: 'eBPF process telemetry — 9/9 tests green on the userspace crate.',
    groups: [
      { title: 'Monitor core', count: 6, status: pass, coverage: 'C-string decoding, exec/open stats, ransomware heuristic, window expiry, stats sorting' },
      { title: 'TUI', count: 3, status: pass, coverage: 'rendering with events/alerts, key handling, alert tracking' },
    ],
    checks: [
      { label: 'Clippy', result: '0 warnings, 0 errors', status: pass },
      { label: '`unsafe` blocks', result: '7 (syscall/interop layer — expected, reviewed)', status: warn },
    ],
    notes: ['The eBPF crate targets bpfel-unknown-none and is built via build.sh, not on the host toolchain.'],
    reportUrl: 'https://github.com/BartoszOsiej/halcyon-process-monitor/blob/main/TEST_REPORT.md',
  },
  {
    id: 'externum',
    name: 'Externum',
    suite: 'python3 -m unittest discover -s tests',
    total: 120,
    passed: 120,
    failed: 0,
    ignored: 0,
    duration: '~0.06 s',
    status: pass,
    summary: 'Own programming language — 120/120 conformance tests green, zero dependencies.',
    groups: [
      { title: 'Runtime', count: 55, status: pass, coverage: 'runtime conformance' },
      { title: 'Parser', count: 28, status: pass, coverage: 'syntax and structure' },
      { title: 'Extra features', count: 21, status: pass, coverage: 'multiline literals, classes, comprehensions, ternary, unpacking' },
      { title: 'Lexer', count: 10, status: pass, coverage: 'tokenization' },
      { title: 'Compiler', count: 6, status: pass, coverage: 'code generation' },
    ],
    checks: [],
    notes: ['Ternary expressions and tuple-unpacking swaps added to the suite in the latest sweep.'],
    reportUrl: 'https://github.com/BartoszOsiej/externum/blob/main/TEST_REPORT.md',
  },
  {
    id: 'aurora-os',
    name: 'AURORA OS',
    suite: 'npm test + tsc',
    total: 56,
    passed: 56,
    failed: 0,
    ignored: 0,
    duration: '~0.3 s',
    status: pass,
    summary: 'Browser OS — 56/56 core assertions green (31 test cases) + clean typecheck.',
    groups: [
      { title: 'Shell interpreter', count: 19, status: pass, coverage: 'echo, cd/pwd, ls, rm, cp/mv, grep, head, redirection, help/man, errors' },
      { title: 'FileSystem', count: 7, status: pass, coverage: 'seed layout, read/write/append, mkdir + error codes, paths, copy/move, recursion, tree' },
      { title: 'EventBus', count: 5, status: pass, coverage: 'emit/on, once, unsubscribe, listenerCount, handler errors' },
    ],
    checks: [
      { label: 'TypeScript (tsc -p tsconfig.json)', result: '0 errors', status: pass },
    ],
    notes: ['Suite grew 34 → 56 assertions in the latest sweep (10 new shell/FS test cases).'],
    reportUrl: 'https://github.com/BartoszOsiej/AURORA-OS/blob/main/TEST_REPORT.md',
  },
  {
    id: 'factorio-web-game',
    name: 'Novactorio',
    suite: 'typecheck + build + lint',
    total: 0,
    passed: 0,
    failed: 0,
    ignored: 0,
    duration: '~8 s',
    status: pass,
    summary: 'Factory game — no unit-test harness; quality gates (typecheck, build, lint) are all green.',
    groups: [],
    checks: [
      { label: 'Typecheck (tsc --noEmit)', result: '0 errors', status: pass },
      { label: 'Production build (vite build)', result: 'built in ~4 s', status: pass },
      { label: 'Lint (eslint .)', result: '0 errors (7 react-hooks style warnings)', status: warn },
    ],
    notes: [
      'All 28 no-explicit-any lint errors removed in a previous sweep.',
      'Save format typed; totalPollutionGenerated / worldSeed now persisted.',
    ],
    reportUrl: 'https://github.com/BartoszOsiej/Factorio-web-game/blob/main/TEST_REPORT.md',
  },
  {
    id: 'fastapi-url',
    name: 'LinkShort',
    suite: 'pytest tests/ (Python 3.9)',
    total: 15,
    passed: 15,
    failed: 0,
    ignored: 0,
    duration: '~31 s',
    status: pass,
    summary: 'URL shortener — 15/15 API tests green covering auth, ownership, clicks and delete.',
    groups: [
      { title: 'URLs', count: 10, status: pass, coverage: 'shorten, stats, redirect + click counting, /urls/my isolation, delete + ownership, 404s, active-link resolution' },
      { title: 'Auth', count: 5, status: pass, coverage: 'health, register/login, /auth/me, duplicate-email rejection, wrong-password 401' },
    ],
    checks: [],
    notes: [
      'Suite grew 3 → 15 in the latest sweeps.',
      'Runs on Python 3.9 (the pinned 2024 pydantic-core/bcrypt have no 3.14 wheels).',
    ],
    reportUrl: 'https://github.com/BartoszOsiej/FastAPI-url/blob/main/TEST_REPORT.md',
  },
  {
    id: 'n2-mesh',
    name: 'N2 Mesh',
    suite: 'npm test (node:test)',
    total: 22,
    passed: 22,
    failed: 0,
    ignored: 0,
    duration: '~0.1 s',
    status: pass,
    summary: 'P2P chat — 22/22 unit tests green on core.js (MQTT packet layer, dedup, rooms).',
    groups: [
      { title: 'MQTT packets', count: 11, status: pass, coverage: 'remaining-length encoding, PUBLISH round-trip, QoS>0 packet id, CONNECT/SUB/UNSUB' },
      { title: 'Ids & dedup', count: 5, status: pass, coverage: 'newMid uniqueness, isNewMid first-sight/expiry/cap, empty ids' },
      { title: 'Rooms', count: 3, status: pass, coverage: 'hash normalisation, 48-char cap, lobby fallback' },
      { title: 'Bytes', count: 2, status: pass, coverage: 'utf8 round-trips, plain arrays' },
      { title: 'Nick colors', count: 1, status: pass, coverage: 'stable deterministic hsl' },
    ],
    checks: [],
    notes: ['Tests caught a real bug: mqttParsePublish checked the DUP flag (0x08) instead of QoS level (0x06) — fixed.'],
    reportUrl: 'https://github.com/BartoszOsiej/n2-mesh/blob/main/TEST_REPORT.md',
  },
  {
    id: 'docs',
    name: 'Docs — this site',
    suite: 'npm run build (EN + PL)',
    total: 0,
    passed: 0,
    failed: 0,
    ignored: 0,
    duration: '~30 s',
    status: pass,
    summary: 'Documentation hub — production build green in both locales with 0 broken links.',
    groups: [],
    checks: [
      { label: 'Production build (EN + PL)', result: '0 broken links (fails on broken links)', status: pass },
      { label: 'Polish routes (/Docs/pl/…)', result: 'all verified 200', status: pass },
      { label: 'Locale parity', result: 'every EN page has a PL translation', status: pass },
      { label: 'TypeScript', result: 'clean', status: pass },
    ],
    notes: [],
    reportUrl: 'https://github.com/BartoszOsiej/Docs/blob/main/docs/qa.md',
  },
]

export function findProject(id: string): ProjectTests {
  const found = projectTests.find((p) => p.id === id)
  if (!found) throw new Error(`no test data for project "${id}"`)
  return found
}
