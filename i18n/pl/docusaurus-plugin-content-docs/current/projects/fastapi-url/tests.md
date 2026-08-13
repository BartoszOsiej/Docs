---
slug: /projects/fastapi-url/testy
sidebar_label: Testy
title: Testy
description: Full animated test results for LinkShort.
---

# Testy — LinkShort

Pełne automatyczne wyniki testów **LinkShort**, zebrane podczas przeglądu QA
2026-08-13 (Linux, Rust 1.97, Node 22, Python 3). Przewiń w dół — liczniki
rosną, paski się wypełniają, a każdy wiersz animuje się przy wejściu w
widok. Użyj **▶ Powtórz animację**, aby uruchomić ją ponownie.

<TestSuiteView project="fastapi-url" lang="pl" />

## Odtworzenie

```bash
python3.9 -m venv venv && venv/bin/pip install -r requirements.txt
venv/bin/python -m pytest tests/ -v
```
