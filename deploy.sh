#!/usr/bin/env bash
# Deploy the Docs site to BartoszOsiej/Docs + enable GitHub Pages.
set -euo pipefail

ACCOUNT="$(gh api user --jq .login 2>/dev/null || true)"
if [ "$ACCOUNT" != "BartoszOsiej" ]; then
  echo "ERROR: gh is logged in as '$ACCOUNT', not 'BartoszOsiej'."
  echo "Run: gh auth login   (GitHub.com -> HTTPS -> web browser -> BartoszOsiej)"
  exit 1
fi

echo "==> Account OK: BartoszOsiej"
cd "$(dirname "$0")"
git remote set-url origin https://github.com/BartoszOsiej/Docs.git 2>/dev/null || true
git remote -v | head -1

echo "==> Building..."
npm run docs:build

echo "==> Pushing to BartoszOsiej/Docs..."
git push -u origin main

echo "==> Enabling GitHub Pages (Actions)..."
gh api -X POST repos/BartoszOsiej/Docs/pages -f "source[branch]=main" -f "source[path]=/" --jq '.html_url' 2>/dev/null || echo "Pages may need manual enable: Settings -> Pages -> Deploy from a branch -> main"

echo "==> Done. Site will appear at https://bartoszosiej.github.io/Docs/"
