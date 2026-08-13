/**
 * translator.ts
 * -------------
 * Keyless client-side translation for the PDF book viewer.
 *
 * The old "Microsoft Translator Web Widget" was retired by Microsoft in 2019,
 * and the modern Azure Translator REST API requires a subscription key, so by
 * default this module uses free, keyless providers that are CORS-enabled and
 * work from a static site:
 *
 *   1. Google's public gtx endpoint   — translate.googleapis.com (primary)
 *   2. MyMemory                       — api.mymemory.translated.net (fallback)
 *
 * A Microsoft Translator (Azure) provider is included behind the same
 * interface: pass a key/region in the `microsoftKey` options and it will be
 * used first. No key is required for the default providers.
 */

export type TranslateProvider = 'google' | 'mymemory' | 'microsoft'

export interface TranslateOptions {
  /** Optional Microsoft Translator (Azure) key — enables the paid provider. */
  microsoftKey?: string
  /** Azure region, e.g. 'westeurope'. Required with microsoftKey. */
  microsoftRegion?: string
  /** Abort signal for cancelling in-flight requests. */
  signal?: AbortSignal
  /** Force a specific provider (default: auto chain). */
  provider?: TranslateProvider
}

export interface TranslateResult {
  text: string
  provider: TranslateProvider
}

const LANG_LABELS: Record<string, string> = {
  auto: 'Detect / Auto',
  en: 'English',
  pl: 'Polski (Polish)',
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

export function langLabel(code: string): string {
  return LANG_LABELS[code] ?? code
}

/* ------------------------------------------------------------------ */
/* Chunking                                                            */
/* ------------------------------------------------------------------ */

const GOOGLE_MAX = 3800 // URL-length safe (encodeURIComponent inflates non-ASCII)
const MYMEMORY_MAX = 450 // 500 per their API, keep margin

/** Google clients Google actually accepts. `client=t` is blocked — never use it. */
const GOOGLE_CLIENTS = ['gtx', 'dict-chrome-ex']

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let lastErr: unknown = null
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(600 * attempt)
    try {
      const res = await fetch(url, { signal })
      if (res.ok) {
        const data: unknown = await res.json()
        return data as T
      }
      // 403/429/5xx are often transient on Google's public endpoint — retry.
      if ([403, 429, 500, 502, 503, 504].includes(res.status)) {
        lastErr = new Error(`HTTP ${res.status}`)
        continue
      }
      throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      if (signal?.aborted) throw err
      lastErr = err
    }
  }
  throw lastErr ?? new Error('fetch failed')
}

function chunk(text: string, size: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const paragraph of text.split(/(\n+)/)) {
    if (paragraph.trim() === '' && cur === '') continue
    if ((cur + paragraph).length <= size) {
      cur += paragraph
    } else {
      if (cur) out.push(cur)
      cur = paragraph
    }
  }
  if (cur) out.push(cur)
  return out
}

/* ------------------------------------------------------------------ */
/* Providers                                                           */
/* ------------------------------------------------------------------ */

async function googleTranslate(text: string, from: string, to: string, signal?: AbortSignal): Promise<string> {
  let lastErr: unknown = null
  for (const client of GOOGLE_CLIENTS) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
      const data = await fetchJson<unknown[]>(url, signal)
      // shape: [[[translated, original, ...], ...], ...]
      const rows = Array.isArray(data) ? (data[0] as unknown[]) : []
      const out = rows
        .map((row) => (Array.isArray(row) ? String(row[0] ?? '') : ''))
        .join('')
        .trim()
      if (!out) throw new Error(`Google (${client}) returned an empty translation`)
      return out
    } catch (err) {
      lastErr = err
      if (signal?.aborted) throw err
    }
  }
  throw lastErr ?? new Error('All Google clients failed')
}

async function myMemoryTranslate(text: string, from: string, to: string, signal?: AbortSignal): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`)
  const data: { responseData?: { translatedText?: string } } = await res.json()
  const t = data.responseData?.translatedText
  if (!t) throw new Error('MyMemory returned no translation')
  return t.trim()
}

async function microsoftTranslate(
  text: string,
  from: string,
  to: string,
  key: string,
  region: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`,
    {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
      },
      body: JSON.stringify([{ Text: text }]),
    },
  )
  if (!res.ok) throw new Error(`Microsoft Translator HTTP ${res.status}`)
  const data: Array<{ translations?: Array<{ text?: string }> }> = await res.json()
  return data[0]?.translations?.[0]?.text?.trim() ?? ''
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Translate a block of text using the keyless provider chain. */
export async function translateText(
  text: string,
  from: string,
  to: string,
  opts: TranslateOptions = {},
): Promise<TranslateResult> {
  const clean = text.trim()
  if (!clean) return { text: '', provider: 'google' }
  if (from === to) return { text: clean, provider: 'google' }

  const want = opts.provider ?? (opts.microsoftKey ? 'microsoft' : 'google')
  const providers: TranslateProvider[] =
    want === 'microsoft'
      ? ['microsoft', 'google', 'mymemory']
      : want === 'mymemory'
        ? ['mymemory', 'google']
        : ['google', 'mymemory']

  let lastErr: Error | null = null
  for (const provider of providers) {
    try {
      if (provider === 'microsoft') {
        if (!opts.microsoftKey || !opts.microsoftRegion) throw new Error('Microsoft key/region missing')
        const parts: string[] = []
        for (const part of chunk(clean, 5000)) {
          parts.push(await microsoftTranslate(part, from, to, opts.microsoftKey, opts.microsoftRegion, opts.signal))
        }
        return { text: parts.join(' '), provider }
      }
      if (provider === 'google') {
        const parts: string[] = []
        for (const part of chunk(clean, GOOGLE_MAX)) {
          parts.push(await googleTranslate(part, from, to, opts.signal))
        }
        return { text: parts.join(' '), provider }
      }
      // mymemory
      const parts: string[] = []
      for (const part of chunk(clean, MYMEMORY_MAX)) {
        parts.push(await myMemoryTranslate(part, from, to, opts.signal))
      }
      return { text: parts.join(' '), provider }
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err))
    }
  }
  throw lastErr ?? new Error('All translation providers failed')
}

/** Detect the language of a text using Google's gtx detector (sl=auto). */
export async function detectLanguage(text: string, signal?: AbortSignal): Promise<string> {
  const sample = text.slice(0, 2000)
  for (const client of GOOGLE_CLIENTS) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=auto&tl=en&dt=t&q=${encodeURIComponent(sample)}`
      const data = await fetchJson<unknown[]>(url, signal)
      // shape: [[[...]], null, 'en', ...]
      const detected = Array.isArray(data) ? data[2] : undefined
      if (typeof detected === 'string' && detected && detected !== 'auto') return detected
    } catch {
      if (signal?.aborted) throw signal.reason
    }
  }
  return 'auto'
}
