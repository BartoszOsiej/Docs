---
slug: /projects/aurora-os/testy
sidebar_label: Testy
title: Testy
description: Full animated test results for AURORA OS.
---

# Testy — AURORA OS

Pełne automatyczne wyniki testów **AURORA OS**, zebrane podczas przeglądu QA
2026-08-13 (Linux, Rust 1.97, Node 22, Python 3). Przewiń w dół — liczniki
rosną, paski się wypełniają, a każdy wiersz animuje się przy wejściu w
widok. Użyj **▶ Powtórz animację**, aby uruchomić ją ponownie.

<TestSuiteView project="aurora-os" lang="pl" />

## Odtworzenie

```bash
npm test
npx tsc -p tsconfig.json --noEmit
```
