---
title: N2 Mesh — Architecture
---

# 🧱 N2 Mesh — Architektura

## Warstwy

| Warstwa | Technologia | Rola |
|---|---|---|
| **Transport P2P** | WebTorrent (WebRTC) | Swarm peer-to-peer, połączenia WebRTC |
| **Sygnalizacja** | Publiczne WebSocket trackery | Znajdowanie peerów (jak w torrentach) |
| **Kanał wiadomości** | Protokół rozszerzony BitTorrenta (`N2` ext) | Wysyłka wiadomości po połączeniu torrentowym |
| **Relay fallback** | Własny klient MQTT 3.1.1 (WSS) | Dostarczanie wiadomości, gdy WebRTC nie może się połączyć (CGNAT / sieci komórkowe) |
| **Local bridge** | `BroadcastChannel` | Karty tej samej przeglądarki (WebRTC loopback zablokowany) |

## Kluczowe decyzje techniczne

### 1. Pokój = infohash torrencika

```js
const content = new Blob([ROOM_PREFIX + state.room]);
state.client.seed(content, { name: `n2mesh-${state.room}.txt`, announce: TRACKERS }, ...);
```

Każdy peer seeduje blob o identycznej treści → SHA-1 infohash identyczny →
wszyscy w tym samym swarmie. Zmiana pokoju = nowy infohash = nowy swarm.

### 2. Extended protocol z poprawną rejestracją

Wiadomości jadą jako rozszerzenie `N2` protokołu rozszerzonego BitTorrenta.
**Krytyczne:** rozszerzenie MUSI być zarejestrowane na każdym wire przez
`wire.use()` PRZED wymianą extended handshake:

```js
function N2MeshExtension(wire) { this._wire = wire; }
N2MeshExtension.prototype.name = 'N2';
// ...
torrent.on('wire', (wire) => {
  wire.use(N2MeshExtension); // <- bez tego wire.extended('N2', ...) rzuca błąd
});
```

Mapa `m` extended handshake budowana jest **z zarejestrowanych rozszerzeń**.
Bez `wire.use()` wysyłka rzuca `Unrecognized extension: N2` i żadna
wiadomość nigdy nie opuszcza karty — to był główny bug, naprawiony
i zweryfikowany testem wire-to-wire.

### 3. Kolejka do extended handshake

```js
function trySend(wire, payload) {
  try { wire.extended(EXT, payload); return true; }
  catch (_) { return false; }
}
```

Jeśli peer nie ukończył jeszcze extended handshake, payload trafia do
kolejki (`__n2pending`) i jest wysyłany ponownie co 600 ms — żadna
wiadomość się nie gubi.

### 4. Relay fallback (MQTT) — dlaczego istnieje

Czysty P2P w przeglądarce **nie łączy się na sieciach komórkowych**:
operatorzy używają CGNAT i odrzucają hole-punching, a darmowe publiczne
serwery TURN, które kiedyś to mostkowały, są w 2026 martwe lub
wymagają konta (Cloudflare TURN potrzebuje credencjałów z API).

Rozwiązanie: każda wiadomość jest **równolegle publikowana** do topicu
`n2mesh/{pokój}` na publicznym brokcie MQTT przez WSS. Klient MQTT to
**własna, zero-zależnościowa implementacja MQTT 3.1.1** (~100 linii):

```js
function mqttConnectPkt(clientId) { /* CONNECT: MQTT, v4, clean, keepalive 60 */ }
function mqttSubPkt(topic)        { /* SUBSCRIBE qos 0 */ }
function mqttPubPkt(topic, p)     { /* PUBLISH qos 0 */ }
function mqttUnsubPkt(topic)      { /* UNSUBSCRIBE przy zmianie pokoju */ }
```

- **Izolacja pokoi:** każda karta subskrybuje **dokładny topic swojego
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
a różne przeglądarki/urządzenia — przez swarm WebTorrent i/lub relay.

### 6. WebTorrent vendored + ESM load

`webtorrent.min.js` (220 KB) jest **wgrany do repo** — zero zależności od
CDN. Jest to moduł ES (`export default`), więc ładowany jest przez
dynamiczny `import()` — zwykły `<script src>` nigdy nie tworzy
`window.WebTorrent`, co było przyczyną „Could not load the WebTorrent
library”.

## Pliki

| Plik | Zawartość |
|---|---|
| `index.html` | Powłoka single-page |
| `app.js` | Networking: swarm + extended protocol + relay MQTT + local bridge |
| `style.css` | Ciemny motyw aurora |
| `webtorrent.min.js` | Vendored WebTorrent (ESM) |
| `.github/workflows/deploy.yml` | Deploy na GitHub Pages |

## Przepływ danych

```
sender:  JSON({u, t, ts, mid}) ──► wire.extended('N2', bytes)   (P2P)
                              ──► mqttPubPkt('n2mesh/room', p)  (relay)
                                              │
                peer odbiera przez wire 'extended' LUB przez broker MQTT
                                              ▼
receiver:  handlePayload(bytes) ── dedup po mid ──► addMessage(nick, text)
```

## Ograniczenia

- **Brak historii** — po wyjściu z pokoju swarm znika (cena braku serwera).
- **Oba peery muszą być online jednocześnie** — relay nie przechowuje
  wiadomości (QoS 0, bez retencji).
- **Tryb relay = wiadomości przechodzą przez publiczny broker** — to
  świadomy kompromis, żeby chat działał w sieciach, gdzie P2P jest
  niemożliwy (CGNAT). Tryb P2P pozostaje w pełni peer-to-peer.

## Repo

[BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) ·
[Live](https://bartoszosiej.github.io/n2-mesh/)
