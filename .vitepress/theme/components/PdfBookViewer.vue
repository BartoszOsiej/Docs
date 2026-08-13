<template>
  <div class="pbv" :class="{ ready: ready }">
    <!-- toolbar -->
    <div class="pbv-toolbar">
      <div class="pbv-title">
        <span class="pbv-book-icon">📖</span>
        <span>{{ title || 'PDF Book' }}</span>
      </div>
      <div class="pbv-controls">
        <div class="pbv-nav">
          <button class="pbv-btn" :disabled="!canPrev" aria-label="Previous page" @click="turn(-1)">‹</button>
          <span class="pbv-page-indicator">{{ numPages ? `${currentPage} / ${numPages}` : '—' }}</span>
          <button class="pbv-btn" :disabled="!canNext" aria-label="Next page" @click="turn(1)">›</button>
        </div>
        <label class="pbv-zoom">
          🔍
          <input type="range" min="0.6" max="1.6" step="0.05" v-model.number="zoom" />
          <span>{{ Math.round(zoom * 100) }}%</span>
        </label>
        <select v-model="fromLang" class="pbv-lang" :disabled="!ready" aria-label="Source language">
          <option value="auto">Auto-detect</option>
          <option v-for="(label, code) in LANGS" :key="code" :value="code">{{ label }}</option>
        </select>
        <span class="pbv-arrow">→</span>
        <select v-model="toLang" class="pbv-lang" :disabled="!ready" aria-label="Target language">
          <option v-for="(label, code) in LANGS" :key="code" :value="code">{{ label }}</option>
        </select>
        <button class="pbv-btn pbv-primary" :disabled="!ready || translating" @click="translateCurrent">
          {{ translating ? 'Translating…' : 'Translate page' }}
        </button>
        <button class="pbv-btn pbv-ghost" :disabled="!ready || translatingAll" @click="translateAll">
          {{ translatingAll ? `Translating ${translateProgress}%` : 'Translate all' }}
        </button>
      </div>
    </div>

    <!-- status / errors -->
    <div v-if="error" class="pbv-error">⚠️ {{ error }}</div>
    <div v-else-if="!ready" class="pbv-loading">
      <span class="pbv-spinner"></span> Loading PDF…
    </div>

    <!-- book stage -->
    <div v-show="ready" class="pbv-stage" :style="{ perspective: '1600px' }">
      <div class="pbv-book" :class="flipClass" :style="bookStyle">
        <!-- left page -->
        <div class="pbv-page pbv-page-left" :class="{ 'is-cover': leftPage === null }">
          <canvas ref="leftCanvas" class="pbv-canvas"></canvas>
          <div v-if="leftPage === null" class="pbv-cover">
            <div class="pbv-cover-inner">
              <div class="pbv-cover-icon">📖</div>
              <div class="pbv-cover-title">{{ title || 'PDF Book' }}</div>
              <div class="pbv-cover-sub">{{ numPages }} pages</div>
            </div>
          </div>
          <div v-if="leftPage !== null && overlayFor(leftPage)" class="pbv-overlay" :class="{ compact: !showOverlay }">
            <button class="pbv-overlay-close" aria-label="Close overlay" @click="showOverlay = false">✕</button>
            <div class="pbv-overlay-lang">{{ langLabelFor(leftPage) }}</div>
            <p>{{ overlayFor(leftPage) }}</p>
          </div>
        </div>

        <!-- spine -->
        <div class="pbv-spine" aria-hidden="true"></div>

        <!-- right page -->
        <div class="pbv-page pbv-page-right">
          <canvas ref="rightCanvas" class="pbv-canvas"></canvas>
          <div v-if="overlayFor(rightPage)" class="pbv-overlay" :class="{ compact: !showOverlay }">
            <button class="pbv-overlay-close" aria-label="Close overlay" @click="showOverlay = false">✕</button>
            <div class="pbv-overlay-lang">{{ langLabelFor(rightPage) }}</div>
            <p>{{ overlayFor(rightPage) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- translation panel -->
    <div v-if="ready && (translationPanelOpen || translatingAll)" class="pbv-panel">
      <div class="pbv-panel-head">
        <strong>🌐 Translation</strong>
        <span class="pbv-panel-meta">{{ panelMeta }}</span>
        <button class="pbv-btn pbv-ghost pbv-panel-close" @click="translationPanelOpen = false">Hide</button>
      </div>
      <div v-if="translatingAll" class="pbv-progress">
        <div class="pbv-progress-bar" :style="{ width: translateProgress + '%' }"></div>
      </div>
      <p class="pbv-panel-text">{{ panelText || 'Select “Translate page” to see the translation here.' }}</p>
    </div>

    <div v-if="ready" class="pbv-foot">
      <label class="pbv-toggle">
        <input type="checkbox" v-model="showOverlay" />
        Show translation on the page
      </label>
      <span class="pbv-hint">
        Translation runs in your browser via keyless providers (Google · MyMemory). No key, no account, no server.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { detectLanguage, langLabel, translateText } from '../translator'

const props = withDefaults(
  defineProps<{
    src: string
    title?: string
    initialPage?: number
  }>(),
  { title: 'PDF Book', initialPage: 1 },
)

const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/'
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

const ready = ref(false)
const error = ref('')
const numPages = ref(0)
const currentPage = ref(props.initialPage)
const zoom = ref(1)
const fromLang = ref('auto')
const toLang = ref('pl')
const translating = ref(false)
const translatingAll = ref(false)
const translateProgress = ref(0)
const translationPanelOpen = ref(false)
const showOverlay = ref(true)
const flipClass = ref('')
const stageWidth = ref(900)

const leftCanvas = ref<HTMLCanvasElement | null>(null)
const rightCanvas = ref<HTMLCanvasElement | null>(null)

let pdfDoc: any = null
let pdfjs: any = null
let renderTask: { left: any; right: any } | null = null
let detectedLang = 'auto'
const translations = new Map<number, { text: string; from: string; to: string; provider: string }>()
let destroyed = false
let flipTimer: number | undefined

/* ------------------------------------------------------------------ */
/* Page layout                                                         */
/* ------------------------------------------------------------------ */

const leftPage = computed(() => {
  if (currentPage.value === 1) return null
  return currentPage.value % 2 === 0 ? currentPage.value : currentPage.value - 1
})
const rightPage = computed(() => {
  if (currentPage.value === 1) return 1
  const start = currentPage.value % 2 === 0 ? currentPage.value : currentPage.value - 1
  return Math.min(start + 1, numPages.value)
})
const canPrev = computed(() => currentPage.value > 1)
const canNext = computed(() => currentPage.value < numPages.value)

const bookStyle = computed(() => ({
  width: `${stageWidth.value}px`,
  height: `${Math.round(stageWidth.value * 0.68)}px`,
}))

/* ------------------------------------------------------------------ */
/* Loading + rendering                                                 */
/* ------------------------------------------------------------------ */

function resolveSrc(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/')) return BASE + src.slice(1)
  return src
}

async function loadPdf() {
  try {
    pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = BASE + 'pdfjs/pdf.worker.min.mjs'
    const loadingTask = pdfjs.getDocument({
      url: resolveSrc(props.src),
      standardFontDataUrl: BASE + 'pdfjs/standard_fonts/',
      cMapUrl: BASE + 'pdfjs/cmaps/',
      cMapPacked: true,
    })
    pdfDoc = await loadingTask.promise
    numPages.value = pdfDoc.numPages
    currentPage.value = Math.min(props.initialPage, numPages.value)
    ready.value = true
    await renderSpread()
  } catch (err: any) {
    error.value = `Could not load the PDF: ${err?.message || String(err)}`
  }
}

async function renderPageToCanvas(pageNum: number, canvas: HTMLCanvasElement | null) {
  if (!canvas || !pdfDoc || pageNum < 1 || pageNum > numPages.value) return
  const page = await pdfDoc.getPage(pageNum)
  const base = pdfjs.getViewport ? pdfjs.getViewport({ viewport: page.getViewport({ scale: 1 }) }) : null
  const pageW = base ? base.width : 612
  const pageH = base ? base.height : 792
  const targetW = (stageWidth.value - 26) / 2
  const scale = (targetW / pageW) * zoom.value
  const viewport = page.getViewport({ scale })
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  await page.render({ canvasContext: ctx, viewport }).promise
}

async function renderSpread() {
  if (renderTask) {
    try {
      await Promise.allSettled(Object.values(renderTask))
    } catch {
      /* ignore stale renders */
    }
  }
  renderTask = {
    left: leftPage.value !== null ? renderPageToCanvas(leftPage.value, leftCanvas.value) : Promise.resolve(),
    right: renderPageToCanvas(rightPage.value, rightCanvas.value),
  }
  await Promise.allSettled(Object.values(renderTask))
}

/* ------------------------------------------------------------------ */
/* Page turning                                                        */
/* ------------------------------------------------------------------ */

function turn(dir: 1 | -1) {
  if (!ready.value || translating.value || translatingAll.value) return
  if (dir === 1 && !canNext.value) return
  if (dir === -1 && !canPrev.value) return

  const target = currentPage.value + dir
  flipClass.value = dir === 1 ? 'flip-next' : 'flip-prev'
  window.clearTimeout(flipTimer)
  flipTimer = window.setTimeout(async () => {
    currentPage.value = target
    flipClass.value = ''
    await renderSpread()
  }, 420)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') turn(1)
  else if (e.key === 'ArrowLeft') turn(-1)
}

/* ------------------------------------------------------------------ */
/* Text extraction + translation                                       */
/* ------------------------------------------------------------------ */

async function extractPageText(pageNum: number): Promise<string> {
  const page = await pdfDoc.getPage(pageNum)
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

async function translatePage(pageNum: number): Promise<void> {
  const raw = await extractPageText(pageNum)
  if (!raw.trim()) {
    translations.set(pageNum, { text: '(no extractable text on this page)', from: '?', to: toLang.value, provider: '—' })
    return
  }
  const from = fromLang.value === 'auto' ? detectedLang || (await detectLanguage(raw)) : fromLang.value
  if (detectedLang === 'auto' && from !== 'auto') detectedLang = from
  const res = await translateText(raw, from, toLang.value)
  translations.set(pageNum, { text: res.text, from, to: toLang.value, provider: res.provider })
}

async function translateCurrent() {
  if (!ready.value || translating.value) return
  translating.value = true
  translationPanelOpen.value = true
  try {
    await translatePage(currentPage.value)
  } catch (err: any) {
    translations.set(currentPage.value, {
      text: `Translation failed: ${err?.message || err}`,
      from: '?',
      to: toLang.value,
      provider: '—',
    })
  } finally {
    translating.value = false
  }
}

async function translateAll() {
  if (!ready.value || translatingAll.value) return
  translatingAll.value = true
  translationPanelOpen.value = true
  translateProgress.value = 0
  try {
    for (let p = 1; p <= numPages.value; p++) {
      try {
        await translatePage(p)
      } catch {
        /* keep going on per-page errors */
      }
      translateProgress.value = Math.round((p / numPages.value) * 100)
    }
  } finally {
    translatingAll.value = false
  }
}

/* ------------------------------------------------------------------ */
/* Panel helpers                                                       */
/* ------------------------------------------------------------------ */

function overlayFor(pageNum: number | null): string {
  if (pageNum === null) return ''
  const t = translations.get(pageNum)
  return showOverlay.value && t ? t.text : ''
}

function langLabelFor(pageNum: number | null): string {
  if (pageNum === null) return ''
  const t = translations.get(pageNum)
  if (!t) return ''
  return `${langLabel(t.from)} → ${langLabel(t.to)} · ${t.provider}`
}

const panelText = computed(() => {
  const t = translations.get(currentPage.value)
  return t ? t.text : ''
})

const panelMeta = computed(() => {
  const t = translations.get(currentPage.value)
  return t && t.from !== '?' ? `${langLabel(t.from)} → ${langLabel(t.to)} via ${t.provider} · page ${currentPage.value}` : ''
})

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

function measure() {
  if (typeof window === 'undefined') return
  const w = Math.min(window.innerWidth - 48, 1080)
  stageWidth.value = Math.max(320, w)
}

onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  window.addEventListener('keydown', onKey)
  loadPdf()
})

onBeforeUnmount(() => {
  destroyed = true
  window.clearTimeout(flipTimer)
  window.removeEventListener('resize', measure)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.pbv {
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, #0f172a, #060b18);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  margin: 1.6rem 0;
}

/* toolbar */
.pbv-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  flex-wrap: wrap;
}
.pbv-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #e2e8f0; font-size: 0.92rem; }
.pbv-book-icon { font-size: 1.1rem; }
.pbv-controls { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.pbv-nav { display: flex; align-items: center; gap: 0.35rem; }
.pbv-page-indicator { font-size: 0.78rem; color: #94a3b8; min-width: 58px; text-align: center; font-variant-numeric: tabular-nums; }

.pbv-btn {
  background: rgba(148, 163, 184, 0.12);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 8px;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
}
.pbv-btn:hover:not(:disabled) { background: rgba(148, 163, 184, 0.22); }
.pbv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pbv-primary {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border: none;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
}
.pbv-primary:hover:not(:disabled) { background: linear-gradient(135deg, #818cf8, #c084fc); }
.pbv-ghost { background: transparent; }
.pbv-ghost:hover:not(:disabled) { background: rgba(148, 163, 184, 0.14); }

.pbv-zoom { display: flex; align-items: center; gap: 0.4rem; color: #94a3b8; font-size: 0.78rem; }
.pbv-zoom input { width: 84px; accent-color: #818cf8; }
.pbv-lang {
  background: #0f172a;
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  padding: 0.34rem 0.45rem;
  font-size: 0.78rem;
  cursor: pointer;
  max-width: 118px;
}
.pbv-arrow { color: #64748b; font-size: 0.8rem; }

/* loading / error */
.pbv-loading, .pbv-error {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 3rem 1rem; justify-content: center;
  color: #94a3b8; font-size: 0.9rem;
}
.pbv-error { color: #f87171; }
.pbv-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(129, 140, 248, 0.3);
  border-top-color: #818cf8;
  animation: pbv-spin 0.8s linear infinite;
}
@keyframes pbv-spin { to { transform: rotate(360deg); } }

/* book stage */
.pbv-stage {
  display: flex; justify-content: center;
  padding: 2rem 0.5rem 1.2rem;
  background:
    radial-gradient(900px 320px at 50% 0%, rgba(99, 102, 241, 0.12), transparent 70%),
    repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.035) 0 2px, transparent 2px 34px);
  overflow-x: auto;
}
.pbv-book {
  display: flex;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.2s ease;
  flex: none;
}
.pbv-book.flip-next { transform: translateX(-14px) rotateY(2deg); }
.pbv-book.flip-prev { transform: translateX(14px) rotateY(-2deg); }

.pbv-page {
  position: relative;
  background: #f7f3ea;
  border-radius: 4px 10px 10px 4px;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.55), inset 0 0 24px rgba(120, 100, 60, 0.16);
  transform-style: preserve-3d;
  transition: transform 0.42s cubic-bezier(0.3, 0.7, 0.3, 1);
  overflow: hidden;
  flex: none;
}
.pbv-page-right {
  border-radius: 10px 4px 4px 10px;
  transform-origin: left center;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.55), inset 0 0 24px rgba(120, 100, 60, 0.16);
}
.pbv-page-left { transform-origin: right center; }
.pbv-book.flip-next .pbv-page-right { transform: perspective(1400px) rotateY(-168deg); }
.pbv-book.flip-prev .pbv-page-left { transform: perspective(1400px) rotateY(168deg); }

.pbv-canvas { display: block; width: 100%; height: 100%; background: #fff; }

/* cover */
.pbv-cover {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(360px 240px at 30% 20%, rgba(129, 140, 248, 0.35), transparent 70%),
    linear-gradient(150deg, #1e1b4b, #312e81 55%, #0f172a);
  color: #e0e7ff;
}
.pbv-cover-inner { text-align: center; padding: 1.4rem; }
.pbv-cover-icon { font-size: 2.6rem; margin-bottom: 0.8rem; }
.pbv-cover-title { font-size: 1.05rem; font-weight: 800; letter-spacing: 0.01em; }
.pbv-cover-sub { font-size: 0.75rem; color: #a5b4fc; margin-top: 0.4rem; }

/* spine */
.pbv-spine {
  width: 20px; flex: none; position: relative;
  background: linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.16));
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.4);
}
.pbv-spine::before, .pbv-spine::after {
  content: ''; position: absolute; left: 8px; width: 4px; top: 6%; bottom: 6%;
  border-radius: 3px;
  background: repeating-linear-gradient(0deg, rgba(129, 140, 248, 0.5) 0 10px, transparent 10px 18px);
}

/* overlay translation on page */
.pbv-overlay {
  position: absolute; inset: 0;
  background: rgba(13, 18, 36, 0.86);
  backdrop-filter: blur(3px);
  color: #e6e9f5;
  padding: 1.1rem 1.2rem;
  overflow: auto;
  font-size: 0.82rem;
  line-height: 1.5;
  animation: pbv-fade 0.25s ease;
}
.pbv-overlay.compact { padding: 0.9rem 1rem; }
.pbv-overlay-close {
  position: absolute; top: 6px; right: 8px;
  background: rgba(255, 255, 255, 0.12); color: #e6e9f5;
  border: none; border-radius: 6px; width: 22px; height: 22px;
  cursor: pointer; font-size: 0.7rem; line-height: 1;
}
.pbv-overlay-lang { font-size: 0.62rem; color: #a5b4fc; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }
.pbv-overlay p { margin: 0; white-space: pre-line; }
@keyframes pbv-fade { from { opacity: 0; } to { opacity: 1; } }

/* translation panel */
.pbv-panel {
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  padding: 0.9rem 1.1rem;
  background: rgba(13, 18, 36, 0.7);
}
.pbv-panel-head { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.pbv-panel-head strong { color: #e2e8f0; font-size: 0.85rem; }
.pbv-panel-meta { color: #64748b; font-size: 0.72rem; flex: 1; }
.pbv-panel-close { padding: 0.2rem 0.6rem; font-size: 0.72rem; }
.pbv-panel-text {
  margin: 0; color: #cbd5e1; font-size: 0.85rem; line-height: 1.6;
  white-space: pre-line; max-height: 260px; overflow: auto;
}
.pbv-progress { height: 5px; border-radius: 3px; background: rgba(148, 163, 184, 0.15); margin-bottom: 0.6rem; overflow: hidden; }
.pbv-progress-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 0.2s ease; }

/* foot */
.pbv-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;
  padding: 0.6rem 1.1rem; border-top: 1px solid rgba(148, 163, 184, 0.18);
  flex-wrap: wrap;
}
.pbv-toggle { display: flex; align-items: center; gap: 0.4rem; color: #94a3b8; font-size: 0.75rem; cursor: pointer; }
.pbv-toggle input { accent-color: #818cf8; }
.pbv-hint { color: #475569; font-size: 0.68rem; }

@media (max-width: 640px) {
  .pbv-stage { padding: 1rem 0.25rem 0.8rem; }
}
</style>
