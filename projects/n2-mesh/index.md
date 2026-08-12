---
title: N2 Mesh — P2P Chat
---

# 💬 N2 Mesh — P2P Chat

**Serverless peer-to-peer chat na zasadzie torrentów.** Działa na statycznym
hostingu (GitHub Pages) — zero serwera, zero bazy danych, zero kont.

> **Wypróbuj teraz:** [🚀 Otwórz N2 Mesh](https://bartoszosiej.github.io/N2-Mesh/)
> (otwiera się w nowej karcie)

## Zasada działania (torrent principle)

```
  ┌─────────────┐   room = infohash   ┌─────────────┐
  │  Peer A     │◄───────────────────►│  Peer B     │
  │ (twoja karta)│   WebTorrent swarm  │ (ich karta) │
  └──────┬──────┘                     └──────┬──────┘
         │   WebRTC signaling via public     │
         │   WebSocket tracker (tylko)       │
         ▼                                   ▼
   ┌────────────────────────────────────────────┐
   │   Public WebSocket trackers (announce)     │
   └────────────────────────────────────────────┘
```

1. **Każdy peer w pokoju seeduje TEN SAM mały blob.** Identyczna treść →
   identyczny **infohash** → wszyscy trafiają do tego samego swarmu
   WebTorrent (dokładnie jak w torrentach).
2. Publiczny WebSocket tracker wykonuje **sygnalizację WebRTC** między
   członkami swarmu — tracker jest tylko *punktem spotkań*, nigdy nie widzi
   wiadomości.
3. Gdy dwóch peerów się połączy, wiadomości czatu jadą po ustanowionym
   połączeniu jako **wiadomości protokołu rozszerzonego BitTorrenta** — czyli
   wiadomości dosłownie podróżują po połączeniach peer-to-peer torrentów.

Przez tracker przechodzi **tylko sygnalizacja**; payload wiadomości nigdy.

## Funkcje

- 🔗 **Pokoje jako torrenciki** — ta sama nazwa pokoju = ten sam infohash =
  ten sam swarm
- 💬 **Prawdziwe wiadomości P2P** — protokół rozszerzony BitTorrenta,
  z kolejką do momentu extended handshake (nic nie ginie)
- 🏷️ Nicki, licznik peerów, status połączenia
- 🔗 Linki do pokojów (`#/nazwa-pokoju`)
- 🌙 Ciemny, dostępny z klawiatury interfejs
- 🖥️ **Local bridge** — karty tej samej przeglądarki nie mogą łączyć się
  przez WebRTC (browser blokuje loopback WebRTC), więc most `BroadcastChannel`
  łączy je lokalnie. Różne przeglądarki/urządzenia rozmawiają przez swarm.

## Jak używać

1. Otwórz [N2 Mesh](https://bartoszosiej.github.io/N2-Mesh/) w dwóch
   przeglądarkach / na dwóch urządzeniach (albo w dwóch kartach jednej).
2. Ustaw **ten sam pokój** po obu stronach (domyślnie `lobby`).
3. Napisz nick i wysyłaj wiadomości — lecą peer-to-peer.

> ⚠️ To jest mesh demo-grade: peery muszą być online jednocześnie. Nie ma
> historii — po wyjściu swarm znika. To cena braku serwera.

## Uruchom lokalnie

```bash
git clone https://github.com/BartoszOsiej/N2-Mesh.git
cd N2-Mesh
python3 -m http.server 8080
# otwórz http://localhost:8080
```

## Bezpieczeństwo

- Wiadomości podróżują **wyłącznie peer-to-peer**; tracker wykonuje
  sygnalizację i nigdy nie odbiera treści wiadomości.
- Całość to czysty JavaScript (WebTorrent vendored lokalnie — bez CDN),
  bez śledzenia, bez zapisu danych.

## Więcej

- [Architektura i szczegóły techniczne](/projects/n2-mesh/architecture)
- [Repo: BartoszOsiej/N2-Mesh](https://github.com/BartoszOsiej/N2-Mesh)
