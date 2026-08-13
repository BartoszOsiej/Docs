---
slug: /projects/nv2-engine/testy
sidebar_label: Testy
title: Testy
description: Full animated test results for NV2 Engine.
---

# Testy — NV2 Engine

Pełne automatyczne wyniki testów **NV2 Engine**, zebrane podczas przeglądu QA
2026-08-13 (Linux, Rust 1.97, Node 22, Python 3). Przewiń w dół — liczniki
rosną, paski się wypełniają, a każdy wiersz animuje się przy wejściu w
widok. Użyj **▶ Powtórz animację**, aby uruchomić ją ponownie.

<TestSuiteView project="nv2-engine" lang="pl" />

## Odtworzenie

```bash
cd Core
cargo test
cargo test --release qa_benchmark_report -- --ignored --nocapture
```
