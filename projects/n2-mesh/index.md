---
title: N2 Mesh — P2P Chat
---

# 💬 N2 Mesh — P2P Chat

**Serverless chat na zasadzie torrentów z automatycznym fallbackiem relay.**
Działa na statycznym hostingu (GitHub Pages) — zero własnego serwera, zero
bazy danych, zero kont.

> **Wypróbuj teraz:** [🚀 Otwórz N2 Mesh](https://bartoszosiej.github.io/n2-mesh/)
> (otwiera się w nowej karcie)

## Zasada działania (torrent principle)

```
  ┌─────────────┐   room = infohash   ┌─────────────┐
  │  Peer A     │◄───────────────────►│  Peer B     │
  │ (twoja karta)│   WebTorrent swarm  │ (ich karta) │
  └──────┬──────┘  (WebRTC, P2P)      └──────┬──────┘
         │   WebRTC signaling via public     │
         │   WebSocket tracker (tylko)       │
         ▼                                   ▼
   ┌────────────────────────────────────────────┐
   │   Public WebSocket trackers (announce)     │
   └────────────────────────────────────────────┘

   ══ Fallback, gdy WebRTC nie może się połączyć ══
   (sieci komórkowe / CGNAT)

   ┌─────────────┐     MQTT over WSS     ┌─────────────┐
   │  Peer A     │◄──────────────────────►│  Peer B     │
   └──────┬──────┘  per-room topic       └──────┬──────┘
          ▼                                    ▼
   ┌────────────────────────────────────────────┐
   │   Public MQTT broker (wss, bez konta)      │
   └────────────────────────────────────────────┘
```

### Warstwa 1 — P2P (torrent principle)

1. **Każdy peer w pokoju seeduje TEN SAM mały blob.** Identyczna treść →
   identyczny **infohash** → wszyscy trafiają do tego samego swarmu
   WebTorrent (dokładnie jak w torrentach).
2. Publiczny WebSocket tracker wykonuje **sygnalizację WebRTC** między
   członkami swarmu — tracker jest tylko *punktem spotkań*, nigdy nie widzi
   wiadomości.
3. Gdy dwóch peerów się połączy, wiadomości czatu jadą po ustanowionym
   połączeniu jako **wiadomości protokołu rozszerzonego BitTorrenta** — czyli
   wiadomości dosłownie podróżują po połączeniach peer-to-peer torrentów.

### Warstwa 2 — Relay (automatyczny fallback)

Czysty P2P w przeglądarce **nie może się połączyć na sieciach komórkowych**:
operatorzy używają CGNAT i blokują przebijanie się przez NAT, a darmowe
publiczne serwery TURN, które kiedyś to mostkowały, są martwe lub płatne
(2026). Dlatego każda wiadomość jest **równolegle publikowana** do
per-roomowego topicu na publicznym brokcie MQTT (WSS, bez konta). Każdy
odbiorca **deduplikuje po ID wiadomości** — więc:

- peery, które mogą się połączyć P2P → wiadomości lecą bezpośrednio po
  połączeniach torrentowych,
- urządzenia, które nie mogą (telefon na LTE/5G) → wymieniają wiadomości
  przez relay.

**P2P pierwszy, relay jako fallback** — ten sam wzorzec, którego używają
prawdziwe komunikatory.

## Funkcje

- 🔗 **Pokoje jako torrenciki** — ta sama nazwa pokoju = ten sam infohash =
  ten sam swarm
- 📡 **Relay fallback** — własny, zero-zależnościowy klient MQTT 3.1.1 (ok.
  100 linii, bez bibliotek), publikacja do `n2mesh/{pokój}`, izolacja pokoi
  po dokładnym topicu
- 🔀 **Dedup po ID** — wiadomość odebrana przez P2P *i* relay *i* most
  lokalny wyświetla się raz
- 💬 **Prawdziwe wiadomości P2P** — protokół rozszerzony BitTorrenta,
  z kolejką do momentu extended handshake (nic nie ginie)
- 🏷️ Nicki, licznik peerów, status połączenia (P2P / P2P+relay / relay)
- 🔗 Linki do pokojów (`#/nazwa-pokoju`)
- 🌙 Ciemny, dostępny z klawiatury interfejs
- 🖥️ **Local bridge** — karty tej samej przeglądarki nie mogą łączyć się
  przez WebRTC (browser blokuje loopback WebRTC), więc most `BroadcastChannel`
  łączy je lokalnie.

## Jak używać

1. Otwórz [N2 Mesh](https://bartoszosiej.github.io/n2-mesh/) na dwóch
   urządzeniach (albo w dwóch kartach jednej przeglądarki).
2. Ustaw **ten sam pokój** po obu stronach (domyślnie `lobby`).
3. Napisz nick i wysyłaj wiadomości — na komputerze polecą P2P, na telefonie
   automatycznie przez relay. Oba przypadki działają z tego samego linku.

> ⚠️ To jest mesh demo-grade: nie ma historii — po wyjściu swarm znika.
> Wiadomości wysłane, gdy druga strona jest offline, są tracone (brak
> kolejkowania po stronie brokera).

## Uruchom lokalnie

```bash
git clone https://github.com/BartoszOsiej/n2-mesh.git
cd n2-mesh
python3 -m http.server 8080
# otwórz http://localhost:8080
```

## Bezpieczeństwo

- **Tryb P2P:** wiadomości podróżują wyłącznie peer-to-peer; tracker
  wykonuje tylko sygnalizację i nigdy nie odbiera treści.
- **Tryb relay:** wiadomości przechodzą przez publiczny broker MQTT — to
  fallback dla sieci, w których P2P jest niemożliwy. Pokoje są izolowane
  (każdy subskrybuje tylko swój topic).
- Całość to czysty JavaScript (WebTorrent vendored lokalnie — bez CDN),
  bez śledzenia, bez zapisu danych.

## Więcej

- [Architektura i szczegóły techniczne](/projects/n2-mesh/architecture)
- [Repo: BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh)
