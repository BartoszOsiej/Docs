# 💬 N2 Mesh — czat P2P

**Bezserwerowy czat peer-to-peer z automatycznym fallbackiem relay.** Działa
na statycznym hostingu (GitHub Pages) — zero własnego serwera, zero bazy
danych, zero kont.

> **Wypróbuj teraz:** [🚀 Otwórz N2 Mesh](https://bartoszosiej.github.io/n2-mesh/)
> (otwiera się w nowej karcie)

## Zasada działania

```
  ┌─────────────┐   kanał danych WebRTC   ┌─────────────┐
  │  Peer A     │◄───────────────────────►│  Peer B     │
  │ (twoja karta)│     (bezpośrednio)      │ (ich karta) │
  └──────┬──────┘                         └──────┬──────┘
         │   SDP offer/answer/ICE przez         │
         │   publiczny temat MQTT (tylko sygnał) │
         ▼                                       ▼
   ┌─────────────────────────────────────────────────┐
   │   Publiczny broker MQTT (temat per pokój)       │
   │   obecność + sygnalizacja + fallback wiadomości │
   └─────────────────────────────────────────────────┘
```

### Warstwa 1 — P2P (WebRTC)

1. **Peerowie ogłaszają swoją obecność** na temacie MQTT per pokój (publiczny
   broker, bez konta — tak samo, jak komunikatory odnajdują się nawzajem).
2. Gdy dwóch peerów się zobaczy, wymieniają **oferty/odpowiedzi/ICE WebRTC**
   przez ten temat (klasyczny wzorzec serwera sygnalizacji, jak w PeerJS).
   Broker tylko *przedstawia* peerów — nigdy nie widzi treści wiadomości.
3. Po połączeniu wiadomości czatu podróżują po **kanale danych WebRTC**
   bezpośrednio między przeglądarkami — prawdziwe peer-to-peer.

### Warstwa 2 — Relay (automatyczny fallback)

Czysty P2P w przeglądarce **nie może się połączyć na sieciach komórkowych**:
operatorzy używają CGNAT i blokują przebijanie się przez NAT, a darmowe
publiczne serwery TURN, które kiedyś to mostkowały, są martwe lub płatne
(2026). Dlatego każda wiadomość jest **równolegle publikowana** do
per-roomowego tematu na publicznym brokcie MQTT (WSS, bez konta). Każdy
odbiorca **deduplikuje po ID wiadomości** — więc:

- peery, które mogą się połączyć P2P → wiadomości lecą bezpośrednio po
  kanale danych WebRTC,
- urządzenia, które nie mogą (telefon na LTE/5G) → wymieniają wiadomości
  przez relay.

**P2P pierwszy, relay jako fallback** — ten sam wzorzec, którego używają
prawdziwe komunikatory.

> **Dlaczego nie trackery WebTorrent?** Oryginalna wersja znajdowała peerów
> przez publiczne trackery WebSocket WebTorrent (`tracker.webtorrent.dev`,
> `tracker.openwebtorrent.com`). Te trackery przyjmują announce i widzą rój,
> ale **przestały przekazywać oferty WebRTC** między peerami (zweryfikowane
> na żywo: dwóch peerów w tym samym roju, zero ofert w obie strony). Ponieważ
> przeglądarkowa wersja WebTorrent może używać tylko trackerów WebSocket
> (w przeglądarce nie ma UDP/DHT), peerowie nigdy nie mogli się odnaleźć —
> więc sygnalizacja przeniosła się na relay MQTT.

## Funkcje

- 🔗 **Pokoje** — ta sama nazwa pokoju = ten sam temat sygnalizacji = ta sama
  grupa peerów
- 📡 **Relay fallback** — własny, zero-zależnościowy klient MQTT 3.1.1 (ok.
  100 linii, bez bibliotek), publikacja do `n2mesh/{pokój}`, izolacja pokoi
  po dokładnym temacie
- 🔀 **Dedup po ID** — wiadomość odebrana przez P2P *i* relay *i* most
  lokalny wyświetla się raz
- 💬 **Prawdziwe wiadomości P2P** — przez kanały danych WebRTC, z fallbackiem
  przez MQTT
- 🏷️ Nicki, licznik peerów, status połączenia (P2P / P2P+relay / relay)
- 🔗 Linki do pokojów (`#/nazwa-pokoju`)
- 🌙 Ciemny, dostępny z klawiatury interfejs, zero zależności (bez CDN,
  bez buildu)
- 🖥️ **Local bridge** — karty tej samej przeglądarki nie mogą łączyć się
  przez WebRTC (przeglądarka blokuje loopback WebRTC), więc most
  `BroadcastChannel` łączy je lokalnie.

## Jak używać

1. Otwórz [N2 Mesh](https://bartoszosiej.github.io/n2-mesh/) na dwóch
   urządzeniach (albo w dwóch kartach jednej przeglądarki).
2. Ustaw **ten sam pokój** po obu stronach (domyślnie `lobby`).
3. Napisz nick i wysyłaj wiadomości — na komputerze polecą P2P, na telefonie
   automatycznie przez relay. Oba przypadki działają z tego samego linku.

> ⚠️ To jest mesh demo-grade: nie ma historii — po wyjściu pokój znika.
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

- **Tryb P2P:** wiadomości podróżują wyłącznie peer-to-peer; broker MQTT
  wykonuje tylko sygnalizację i nigdy nie odbiera treści.
- **Tryb relay:** wiadomości przechodzą przez publiczny broker MQTT — to
  fallback dla sieci, w których P2P jest niemożliwy. Pokoje są izolowane
  (każdy subskrybuje tylko swój temat).
- Całość to czysty JavaScript (zero zależności — bez CDN), bez śledzenia,
  bez zapisu danych.

## Więcej

- [Architektura i szczegóły techniczne](/projects/n2-mesh/architecture)
- [Repo: BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh)
