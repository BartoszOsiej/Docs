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

const GOOGLE_MAX = 4500 // URL-length safe
const MYMEMORY_MAX = 450 // 500 per their API, keep margin

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
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Google gtx HTTP ${res.status}`)
  const data: unknown = await res.json()
  // shape: [[[translated, original, ...], ...], ...]
  const rows = Array.isArray(data) ? (data[0] as unknown[]) : []
  return rows
    .map((row) => (Array.isArray(row) ? String(row[0] ?? '') : ''))
    .join('')
    .trim()
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
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(sample)}`
  try {
    const res = await fetch(url, { signal })
    if (!res.ok) return 'auto'
    const data: unknown = await res.json()
    // shape: [[[...]], null, 'en', ...]
    const detected = Array.isArray(data) ? data[2] : undefined
    return typeof detected === 'string' && detected ? detected : 'auto'
  } catch {
    return 'auto'
  }
}
