---
slug: /projects/talus-process-monitor/testy
sidebar_label: Testy
title: Testy
description: Pełne animowane wyniki testów Talus.
---

# Testy — Talus

Pełne automatyczne wyniki testów **Talus**, zebrane podczas przeglądu QA
2026-09-17 (Linux, Rust 1.97, Node 22, Python 3). Przewiń w dół — liczniki
rosną, paski się wypełniają, a każdy wiersz animuje się przy wejściu w
widok. Użyj **▶ Powtórz animację**, aby uruchomić ją ponownie.

Zestaw obejmuje rdzeń monitora, moduł licencji Ed25519, silnik MeMLP,
dziennik audytu i sandbox. Poza testami jednostkowymi przepływ
licencjonowania jest weryfikowany end-to-end na produkcyjnym serwerze
aktywacyjnym — 18/18 scenariuszy HTTP (aktywacja, idempotentna re-aktywacja,
limity stanowisk, wygasanie, cofnięcia, rate limiting, E2E prawdziwą binarką
`talus`); patrz
[TEST_REPORT_SECURE_LICENSING.md](https://github.com/BartoszOsiej/talus-process-monitor/blob/master/TEST_REPORT_SECURE_LICENSING.md).

<TestSuiteView project="talus-process-monitor" lang="pl" />

## Odtworzenie

```bash
cargo test
```
