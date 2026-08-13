#!/usr/bin/env node
/**
 * copy-pdfjs.mjs
 * --------------
 * Copies the pdf.js worker and the standard-14 font data out of node_modules
 * and into public/pdfjs/, so the PDF book viewer works offline (no CDN).
 *
 *   node scripts/copy-pdfjs.mjs
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PDFJS = join(ROOT, 'node_modules', 'pdfjs-dist')
const DEST = join(ROOT, 'public', 'pdfjs')

if (!existsSync(PDFJS)) {
  console.error('pdfjs-dist not found — run `npm install` first.')
  process.exit(1)
}

mkdirSync(DEST, { recursive: true })
rmSync(join(DEST, 'standard_fonts'), { recursive: true, force: true })

cpSync(join(PDFJS, 'build', 'pdf.worker.min.mjs'), join(DEST, 'pdf.worker.min.mjs'))
cpSync(join(PDFJS, 'standard_fonts'), join(DEST, 'standard_fonts'), { recursive: true })
cpSync(join(PDFJS, 'cmaps'), join(DEST, 'cmaps'), { recursive: true })

console.log('Copied pdf.js worker + standard fonts to public/pdfjs/')
