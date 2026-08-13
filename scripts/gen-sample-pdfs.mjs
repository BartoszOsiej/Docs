#!/usr/bin/env node
/**
 * gen-sample-pdfs.mjs
 * -------------------
 * Generates the two sample PDFs used by the Docs translator demo
 * (the "PDF as a visual book" module):
 *
 *   public/pdfs/sample-english.pdf  — 3 pages of English text about the Docs Hub
 *   public/pdfs/sample-polish.pdf   — 2 pages of Polish text about the Docs Hub
 *
 * The writer is deliberately minimal and dependency-free (plain PDF 1.4 with
 * the built-in Helvetica font), so the script runs anywhere with Node:
 *
 *   node scripts/gen-sample-pdfs.mjs
 *
 * Note: Helvetica (WinAnsi) cannot encode Polish diacritics, so the Polish
 * sample uses ASCII-safe Polish (no ą/ę/ś…). The translated, diacritic-aware
 * text is generated live by the translator module itself.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'pdfs')

/* ------------------------------------------------------------------ */
/* Tiny PDF writer                                                     */
/* ------------------------------------------------------------------ */

function escText(s) {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildContentStream(blocks) {
  // blocks: { type: 'title'|'heading'|'text'|'code', text }
  const lines = []
  const W = 612
  let y = 720

  const lineHeight = (size) => size * 1.55
  const wrap = (text, size) => {
    const maxChars = Math.floor((W - 144) / (size * 0.52))
    const words = text.split(/\s+/)
    const out = []
    let cur = ''
    for (const w of words) {
      const next = cur ? cur + ' ' + w : w
      if (next.length <= maxChars) {
        cur = next
      } else {
        if (cur) out.push(cur)
        cur = w
      }
    }
    if (cur) out.push(cur)
    return out
  }

  for (const b of blocks) {
    const size = b.type === 'title' ? 26 : b.type === 'heading' ? 16 : 11.5
    const rows = b.type === 'text' || b.type === 'code' ? wrap(b.text, size) : [b.text]
    for (const row of rows) {
      if (y < 72) break
      lines.push(`BT /F1 ${size} Tf ${b.type === 'code' ? 90 : 72} ${Math.round(y * 1000) / 1000} Td (${escText(row)}) Tj ET`)
      y -= lineHeight(size)
    }
    y -= b.type === 'title' ? 12 : b.type === 'heading' ? 8 : 4
  }
  return lines.join('\n')
}

function buildPdf(pages) {
  // Object layout: 1 Catalog, 2 Pages tree, 3 Font, then 4+2i Page, 5+2i Stream.
  const objects = []
  objects.push({ n: 1, body: '<< /Type /Catalog /Pages 2 0 R >>' })

  const kids = pages.map((_, i) => `${4 + i * 2} 0 R`).join(' ')
  objects.push({ n: 2, body: `<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>` })
  objects.push({ n: 3, body: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>' })

  pages.forEach((blocks, i) => {
    const pageNum = 4 + i * 2
    const streamNum = pageNum + 1
    const content = buildContentStream(blocks)
    objects.push(
      {
        n: pageNum,
        body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamNum} 0 R >>`,
      },
      { n: streamNum, body: `<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream` },
    )
  })

  let pdf = '%PDF-1.4\n'
  const offsets = []
  for (const obj of objects) {
    offsets[obj.n] = Buffer.byteLength(pdf, 'utf8')
    pdf += `${obj.n} 0 obj\n${obj.body}\nendobj\n`
  }
  const xrefStart = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let n = 1; n <= objects.length; n++) {
    pdf += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return pdf
}

/* ------------------------------------------------------------------ */
/* Sample content                                                      */
/* ------------------------------------------------------------------ */

const englishPdf = buildPdf([
  [
    { type: 'title', text: 'Bartosz Osiej - Docs Hub' },
    { type: 'text', text: 'Central documentation for nine projects: a URL shortener, browser games, a native Rust voxel engine, a cybersecurity toolkit, a browser operating system, an eBPF security monitor, a programming language and a serverless P2P chat.' },
    { type: 'text', text: 'Every page on this site is written from the actual source code - real endpoints, real modules, real architecture decisions.' },
  ],
  [
    { type: 'heading', text: 'Getting started' },
    { type: 'text', text: 'Open the project catalog to browse every repository and its documentation. Use the search box to find a specific endpoint, module or feature.' },
    { type: 'text', text: 'The site is built with VitePress, deployed to GitHub Pages by GitHub Actions, and exposes llms.txt plus llms-full.txt for AI agents.' },
  ],
  [
    { type: 'heading', text: 'Features' },
    { type: 'code', text: '- Bilingual docs: English + Polish' },
    { type: 'code', text: '- AI-readable llms.txt / llms-full.txt' },
    { type: 'code', text: '- PDF book viewer with keyless translation' },
    { type: 'text', text: 'This sample PDF demonstrates the translator module: open it in the book viewer and press Translate to convert a page into another language.' },
  ],
])

const polishPdf = buildPdf([
  [
    { type: 'title', text: 'Bartosz Osiej - Centrum Dokumentacji' },
    { type: 'text', text: 'Centralna dokumentacja dziewieciu projektow: skracacz URL, gry przegladarkowe, natywny silnik wokselowy w Rust, zestaw narzedzi cyberbezpieczenstwa, system operacyjny w przegladarce, monitor eBPF, jezyk programowania oraz czat P2P bez serwera.' },
    { type: 'text', text: 'Kazda strona tej witryny jest pisana na podstawie prawdziwego kodu zrodlowego - prawdziwe endpointy, prawdziwe moduly, prawdziwe decyzje architektoniczne.' },
  ],
  [
    { type: 'heading', text: 'Jak zaczac' },
    { type: 'text', text: 'Otworz katalog projektow, aby przegladac wszystkie repozytoria i ich dokumentacje. Uzyj wyszukiwarki, aby znalezc konkretny endpoint, modul lub funkcje.' },
    { type: 'text', text: 'Witryna jest zbudowana w VitePress, wdrazana na GitHub Pages przez GitHub Actions i udostepnia llms.txt oraz llms-full.txt dla agentow AI.' },
  ],
])

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'sample-english.pdf'), englishPdf)
writeFileSync(join(OUT_DIR, 'sample-polish.pdf'), polishPdf)
console.log('Wrote sample PDFs to', OUT_DIR)
