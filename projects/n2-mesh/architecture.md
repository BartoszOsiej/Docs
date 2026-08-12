---
title: N2 Mesh — Architecture
---

# 🧱 N2 Mesh — Architektura

## Warstwy

| Warstwa | Technologia | Rola |
|---|---|---|
| **Transport** | WebTorrent (WebRTC) | Swarm peer-to-peer, połączenia WebRTC |
| **Sygnalizacja** | Publiczne WebSocket trackery | Znajdowanie peerów (jak w torrentach) |
| **Kanał wiadomości** | Protokół rozszerzony BitTorrenta (`N2` ext) | Wysyłka wiadomości po połączeniu torrentowym |
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

### 4. Local bridge (BroadcastChannel)

Dwie karty **tej samej przeglądarki** nie mogą połączyć się przez WebRTC
(przeglądarki blokują loopback WebRTC). Most `BroadcastChannel` łączy je
lokalnie: karty tej samej przeglądarki wymieniają `hello`/`msg` bezpośrednio,
a różne przeglądarki/urządzenia — przez swarm WebTorrent.

### 5. WebTorrent vendored

`webtorrent.min.js` (220 KB) jest **wgrany do repo** — zero zależności od
CDN (wcześniej zła ścieżka CDN zwracała 404 i chat nie działał wcale).

## Pliki

| Plik | Zawartość |
|---|---|
| `index.html` | Powłoka single-page |
| `app.js` | Networking: swarm + extended protocol + local bridge |
| `style.css` | Ciemny motyw aurora |
| `webtorrent.min.js` | Vendored WebTorrent |
| `.github/workflows/deploy.yml` | Deploy na GitHub Pages |

## Przepływ danych

```
sender:  JSON({u: nick, t: text, ts}) ──► wire.extended('N2', bytes)
                                              │
                       peer's wire 'extended' event
                                              ▼
receiver:  handlePayload(bytes) ──► addMessage(nick, text)
```

## Ograniczenia

- **Brak historii** — po wyjściu z pokoju swarm znika (cena braku serwera).
- **Oba peery muszą być online jednocześnie**.
- WebRTC może nie przejść przy symetrycznym NAT (brak TURN serwera) —
  wtedy przydaje się local bridge lub sieć lokalna.

## Repo

[BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) ·
[Live](https://bartoszosiej.github.io/n2-mesh/)
