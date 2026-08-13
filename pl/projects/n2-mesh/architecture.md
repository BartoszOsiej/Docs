---
title: N2 Mesh — Architektura
---

# 🧱 N2 Mesh — Architektura

## Warstwy

| Warstwa | Technologia | Rola |
|---|---|---|
| **Transport P2P** | Kanały danych WebRTC (natywne) | Bezpośrednie dostarczanie wiadomości peer-to-peer |
| **Sygnalizacja** | Publiczny broker MQTT (temat per pokój) | Obecność + wymiana SDP offer/answer/ICE |
| **Kanał wiadomości** | Kanał danych WebRTC (`n2`) | Wysyłka wiadomości bezpośrednio między przeglądarkami |
| **Relay fallback** | Własny klient MQTT 3.1.1 (WSS) | Dostarczanie wiadomości, gdy WebRTC nie może się połączyć (CGNAT / sieci komórkowe) |
| **Local bridge** | `BroadcastChannel` | Karty tej samej przeglądarki (WebRTC loopback zablokowany) |

## Kluczowe decyzje techniczne

### 1. Pokój = temat sygnalizacji

Każdy peer subskrybuje `n2mesh/{pokój}` na publicznym brokcie MQTT i
ogłasza tam swoją obecność. Peery, które zobaczą swoją obecność, nawiązują
połączenie WebRTC. Zmiana pokoju = nowy temat = nowa grupa peerów.

### 2. Wybór oferenta bez „glare"

Dwaj peerowie mogą zobaczyć swoją obecność w tej samej chwili i obaj nie
mogą wysyłać ofert (wyścig „glare" w WebRTC). Peer z **leksykograficznie
mniejszym id** wysyła ofertę; druga strona czeka na nią:

```js
if (state.pid < p.pid) {
  dial(p.pid); // my jesteśmy oferentem
}
```

Każde id peera jest losowe na sesję, więc zawsze wybierany jest dokładnie
jeden oferent.

### 3. Wiadomości sygnalizacyjne przez MQTT

Sygnalizacja jedzie tym samym tematem per pokój, co wszystko inne. Rodzaje
wiadomości:

```js
{ type: 'presence', pid, nick }                    // odkrywanie peerów
{ type: 'signal', from, to, data: { sdp } }        // offer / answer
{ type: 'signal', from, to, data: { candidate } }  // kandydat ICE
{ u, t, ts, mid }                                  // wiadomość czatu
```

Pole `to` adresuje konkretnego peera; pozostali je ignorują. Kandydaci ICE
przychodzący przed zdalnym opisem są buforowani per połączenie.

### 4. Relay fallback (MQTT) — dlaczego istnieje

Czysty P2P w przeglądarce **nie łączy się na sieciach komórkowych**:
operatorzy używają CGNAT i odrzucają hole-punching, a darmowe publiczne
serwery TURN, które kiedyś to mostkowały, są w 2026 martwe lub wymagają
konta (Cloudflare TURN potrzebuje credencjałów z API).

Rozwiązanie: każda wiadomość jest **równolegle publikowana** do tematu
`n2mesh/{pokój}` na publicznym brokcie MQTT przez WSS. Klient MQTT to
**własna, zero-zależnościowa implementacja MQTT 3.1.1** (~100 linii):

```js
function mqttConnectPkt(clientId) { /* CONNECT: MQTT, v4, clean, keepalive 60 */ }
function mqttSubPkt(topic)        { /* SUBSCRIBE qos 0 */ }
function mqttPubPkt(topic, p)     { /* PUBLISH qos 0 */ }
function mqttUnsubPkt(topic)      { /* UNSUBSCRIBE przy zmianie pokoju */ }
```

- **Izolacja pokoi:** każda karta subskrybuje **dokładny temat swojego
  pokoju** (nie wildcard) — ruch innych pokoi nigdy do niej nie dociera.
- **Dedup po ID:** każda wiadomość ma unikalny `mid`; `Map` zapamiętuje
  ostatnie ID na 30 s, więc wiadomość odebrana przez P2P *i* relay *i* most
  lokalny wyświetla się **raz**.
- **Kolejkowanie offline:** wiadomości wysłane przed połączeniem z brokerem
  lądują w `relay.queue` (z zapamiętanym pokojem) i są flushowane po
  CONNACK→SUBACK.
- **Brokery:** `wss://broker.hivemq.com:8884` (zweryfikowany end-to-end),
  zapasowy `wss://broker.emqx.io:8084`, failover co 3 próby.
- **Keepalive:** PINGREQ co 30 s, reconnect z backoffem (1 s → 15 s).

Status pokazuje, którą ścieżką działa połączenie: `P2P`, `P2P + relay`,
`relay mode` (telefon na CGNAT), `connecting…`.

### 5. Local bridge (BroadcastChannel)

Dwie karty **tej samej przeglądarki** nie mogą połączyć się przez WebRTC
(przeglądarki blokują loopback WebRTC). Most `BroadcastChannel` łączy je
lokalnie: karty tej samej przeglądarki wymieniają `hello`/`msg` bezpośrednio,
a różne przeglądarki/urządzenia — przez kanały danych WebRTC i/lub relay.

### 6. Dlaczego WebTorrent został usunięty

Oryginalna wersja znajdowała peerów przez publiczne trackery WebSocket
WebTorrent (`tracker.webtorrent.dev`, `tracker.openwebtorrent.com`) i
przesyłała wiadomości po rozszerzonym protokole BitTorrenta. Testy na żywo
(sierpień 2026) pokazały, że trackery **przyjmują announce i rejestrują
peerów, ale nigdy nie przekazują ofert WebRTC** między nimi — dwóch klientów
w tym samym roju (`complete=2`) otrzymało zero ofert. Przeglądarkowa wersja
WebTorrent może używać tylko trackerów WebSocket (w przeglądarce nie ma
UDP/DHT), więc peerowie nigdy nie mogli się odnaleźć i P2P nie działało.
Zastąpienie go natywnym WebRTC + sygnalizacją przez MQTT utrzymuje aplikację
w pełni bezserwerową, zero-zależnościową i działającą dziś.

## Pliki

| Plik | Zawartość |
|---|---|
| `index.html` | Powłoka single-page |
| `app.js` | Networking: WebRTC P2P + sygnalizacja/relay MQTT + local bridge |
| `style.css` | Ciemny motyw aurora |
| `.github/workflows/deploy.yml` | Deploy na GitHub Pages |

## Przepływ danych

```
sender:  JSON({u, t, ts, mid}) ──► dc.send(payload)            (P2P data channel)
                              ──► mqttPubPkt('n2mesh/room', p)  (relay)
                                              │
      peer odbiera przez kanał danych LUB przez broker MQTT
                                              ▼
receiver:  handlePayload(bytes) ── dedup po mid ──► addMessage(nick, text)

odkrywanie: presence na 'n2mesh/room' ──► dial() ──► SDP/ICE przez relay ──► otwarty kanał danych
```

## Ograniczenia

- **Brak historii** — po wyjściu z pokoju grupa peerów znika (cena braku
  serwera).
- **Oba peery muszą być online jednocześnie** — relay nie przechowuje
  wiadomości (QoS 0, bez retencji).
- **Tryb relay = wiadomości przechodzą przez publiczny broker** — to
  świadomy kompromis, żeby chat działał w sieciach, gdzie P2P jest
  niemożliwy (CGNAT). Tryb P2P pozostaje w pełni peer-to-peer.

## Repo

[BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) ·
[Live](https://bartoszosiej.github.io/n2-mesh/)
