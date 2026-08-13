---
slug: /projects/externum/testy
sidebar_label: Testy
title: Testy
description: Full animated test results for Externum.
---

# Testy — Externum

Pełne automatyczne wyniki testów **Externum**, zebrane podczas przeglądu QA
2026-08-13 (Linux, Rust 1.97, Node 22, Python 3). Przewiń w dół — liczniki
rosną, paski się wypełniają, a każdy wiersz animuje się przy wejściu w
widok. Użyj **▶ Powtórz animację**, aby uruchomić ją ponownie.

<TestSuiteView project="externum" lang="pl" />

## Odtworzenie

```bash
python3 -m unittest discover -s tests
```
