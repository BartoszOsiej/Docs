#!/usr/bin/env python3
"""Regenerate static/llms-full.txt — a single-file snapshot of the whole site.

Docusaurus layout: English docs live in docs/, Polish in
i18n/pl/docusaurus-plugin-content-docs/current/.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://bartoszosiej.github.io/Docs"
EN_DOCS = os.path.join(ROOT, "docs")
PL_DOCS = os.path.join(ROOT, "i18n", "pl", "docusaurus-plugin-content-docs", "current")

ORDER = [
    "index.md",
    "translator.md",
    "update-flow.md",
    "projects/index.md",
    "projects/fastapi-url/index.md",
    "projects/fastapi-url/getting-started.md",
    "projects/fastapi-url/api-reference.md",
    "projects/fastapi-url/deployment.md",
    "projects/factorio-web-game/index.md",
    "projects/factorio-web-game/architecture.md",
    "projects/factorio-web-game/gameplay.md",
    "projects/factorio-web-game/backend.md",
    "projects/nv2-engine/index.md",
    "projects/nv2-engine/architecture.md",
    "projects/nv2-engine/gameplay.md",
    "projects/nv2-engine/blocks.md",
    "projects/nv2-engine/crafting.md",
    "projects/nv2-engine/water.md",
    "projects/nv2-engine/ai.md",
    "projects/nv2-engine/performance.md",
    "projects/nv2-engine/development.md",
    "projects/nv2-engine/roadmap.md",
    "projects/cybersec-tools/index.md",
    "projects/cybersec-tools/netrecon.md",
    "projects/cybersec-tools/shadowscan.md",
    "projects/cybersec-tools/hashsleuth.md",
    "projects/cybersec-tools/packeteye.md",
    "projects/aurora-os/index.md",
    "projects/aurora-os/architecture.md",
    "projects/aurora-os/user-guide.md",
    "projects/halcyon-process-monitor/index.md",
    "projects/halcyon-process-monitor/architecture.md",
    "projects/externum/index.md",
    "projects/externum/syntax.md",
    "projects/externum/examples.md",
    "projects/externum/compiler.md",
    "projects/externum/architecture.md",
    "projects/n2-mesh/index.md",
    "projects/n2-mesh/architecture.md",
]

out = []
out.append("Bartosz Osiej - Docs - Full Content Snapshot")
out.append(f"Source: {BASE}/")
out.append("Bilingual site: English (root) + Polish (/pl/).")
out.append("Generated for AI agents and crawlers. All content below is the complete documentation.")
out.append("=" * 72)

# Polish locale pages follow the English ones (deterministic, sorted).
known = set(ORDER)
for dirpath, dirnames, filenames in os.walk(PL_DOCS):
    dirnames.sort()
    for f in sorted(filenames):
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(dirpath, f), PL_DOCS).replace(os.sep, "/")
            if rel not in known:
                ORDER.append(rel)

# Append any other EN md files not in the explicit order (keeps future pages included).
for dirpath, dirnames, filenames in os.walk(EN_DOCS):
    dirnames.sort()
    for f in sorted(filenames):
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(dirpath, f), EN_DOCS).replace(os.sep, "/")
            if rel not in known:
                ORDER.append(rel)

for rel in ORDER:
    path = os.path.join(EN_DOCS, rel)
    if not os.path.exists(path):
        # Try the Polish tree for this page
        path = os.path.join(PL_DOCS, rel)
    if not os.path.exists(path):
        print(f"  skip missing: {rel}")
        continue
    slug = rel[:-3]
    if slug.endswith("/index"):
        slug = slug[:-6] + "/"
    out.append("")
    out.append(f"## {slug}")
    out.append(f"Source: {BASE}/{slug}")
    out.append("-" * 72)
    with open(path, encoding="utf-8") as fh:
        out.append(fh.read().rstrip())
    out.append("")

out_path = os.path.join(ROOT, "static", "llms-full.txt")
with open(out_path, "w", encoding="utf-8") as fh:
    fh.write("\n".join(out))
print(f"Wrote {out_path} ({len(out)} lines, {len(ORDER)} pages)")
