#!/usr/bin/env python3
"""Regenerate public/sitemap.xml from the markdown pages of the Docs site."""
import os
import sys
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://bartoszosiej.github.io/Docs"
SKIP_DIRS = {".vitepress", "node_modules", ".git", "scripts"}

# (relative page path without extension, changefreq, priority)
PRIORITY = {
    "index": ("weekly", "1.0"),
    "translator": ("weekly", "0.7"),
    "update-flow": ("monthly", "0.6"),
    "pl/index": ("weekly", "0.9"),
    "pl/translator": ("weekly", "0.7"),
}
SECTION_PRIORITY = {  # index page of each section
    "projects/fastapi-url": ("weekly", "0.9"),
    "projects/factorio-web-game": ("weekly", "0.9"),
    "projects/nv2-engine": ("weekly", "0.9"),
    "projects/cybersec-tools": ("weekly", "0.9"),
    "projects/aurora-os": ("weekly", "0.9"),
}

pages = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for f in filenames:
        if not f.endswith(".md"):
            continue
        rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace(os.sep, "/")[:-3]
        pages.append(rel)

pages.sort()
urls = []
for rel in pages:
    if rel.endswith("/index"):
        rel = rel[:-6] + "/"
    if rel in PRIORITY:
        freq, prio = PRIORITY[rel]
    elif rel in SECTION_PRIORITY:
        freq, prio = SECTION_PRIORITY[rel]
    else:
        depth = rel.count("/")
        freq = "weekly" if depth <= 2 else "monthly"
        prio = str(max(0.5, 0.9 - 0.1 * depth))
    urls.append(f"  <url><loc>{BASE}/{escape(rel)}</loc><changefreq>{freq}</changefreq><priority>{prio}</priority></url>")

# Static files that should also be discoverable.
for static in ("llms.txt", "llms-full.txt"):
    urls.append(f'  <url><loc>{BASE}/{static}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>')

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml += "\n".join(urls)
xml += "\n</urlset>\n"

out = os.path.join(ROOT, "public", "sitemap.xml")
with open(out, "w", encoding="utf-8") as fh:
    fh.write(xml)
print(f"Wrote {out} with {len(urls)} URLs")
