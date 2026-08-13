# AURORA OS — Architektura

Dogłębne spojrzenie na każdy podsystem ~4 500-liniowej bazy AURORA OS
(3 118 linii TypeScript w 16 modułach + 1 376 linii CSS).

## Przegląd systemu

```
┌───────────────────────────── Karta przeglądarki ─────────────────────────┐
│                                                                       │
│  boot() ──► ekran bootu (pierścień postępu) ──► powłoka desktopu      │
│                                                                       │
│  ┌──────────────┐   ┌────────────────┐   ┌────────────────────┐       │
│  │ WindowManager│   │ ProcessManager │   │   AppRegistry      │       │
│  │ drag · resize│   │ pid · ps · kill│   │ 8 apps zarejestro. │       │
│  │ focus · z    │   │ tick telemetrii│   │ single-instance    │       │
│  └──────┬───────┘   └───────┬────────┘   └────────┬───────────┘       │
│         └───────────────────┼─────────────────────┘                   │
│                      ┌──────▼───────┐                          ┌──────▼──────┐
│                      │   EventBus   │◄── każdy moduł mówi       │ FileSystem  │
│                      │ typowany pub/│     tylko przez zdarzenia │ POSIX-lite  │
│                      └──────┬───────┘                          │ +trwałość   │
│                             │                                  └─────────────┘
│                       ┌─────▼────────┐                              ▲
│                       │ warstwa shell│  Terminal ⇄ commands.ts ⇄ ───┘
│                       │ 35+ komend   │  (czysty interpreter, bez DOM)
│                       └──────────────┘
│                                                                       │
│  SoundSystem (WebAudio) · Ustawienia (motywy/tapety) · Ekran blokady │
└───────────────────────────────────────────────────────────────────────┘
```

## Mapa modułów (zmierzona)

| Moduł | Linie | Odpowiedzialność |
|---|---|---|
| `src/main.ts` | 486 | Wejście jądra — sekwencja bootu, powłoka desktopu, taskbar, menu start, menu kontekstowe, ekran blokady |
| `src/term/commands.ts` | 670 | Interpreter shella — 35+ komend, przekierowanie, cytowanie, wyjście ANSI (czysty) |
| `src/fs/FileSystem.ts` | 385 | Wirtualny system plików — ścieżki, CRUD, operacje rekurencyjne, kody błędów, trwałość |
| `src/core/WindowManager.ts` | 267 | Cykl życia okien — drag, zmiana rozmiaru w 8 kierunkach, focus, z-order, maximize/minimize |
| `src/term/Terminal.ts` | 195 | UI terminala — historia, uzupełnianie Tabulatorem, klik-to-focus, wklejanie |
| `src/apps/SettingsApp.ts` | 122 | Ustawienia motywu / tapety / dźwięku / zegara + trwałość |
| `src/apps/MonitorApp.ts` | 111 | Wykresy CPU + pamięci na żywo, tabela procesów, renderowanie canvas |
| `src/sound/SoundSystem.ts` | 110 | Proceduralne WebAudio — oscylatory + obwiednie wzmocnienia |
| `src/core/EventBus.ts` | 102 | Typowany kręgosłup pub/sub z historią i izolacją błędów |
| `src/apps/PaintApp.ts` | 102 | Rysowanie canvas z paletą, rozmiarem pędzla, gumką, eksportem PNG |
| `src/core/AppRegistry.ts` | 84 | Deklaratywny katalog aplikacji + launcher |
| `src/core/ProcessManager.ts` | 84 | Alokacja PID, tabela procesów, fałszywa telemetria |
| `src/apps/AboutApp.ts` | 82 | Okno informacji o systemie z uptime na żywo |
| `src/apps/CalculatorApp.ts` | 81 | Ewaluator wyrażeń z oczyszczonym wejściem |
| `src/apps/EditorApp.ts` | 75 | Edytor tekstu z otwieraniem/zapisywaniem + Ctrl+S |
| `src/apps/FilesApp.ts` | 128 | Graficzny menedżer plików z breadcrumbs |
| `src/apps/TerminalApp.ts` | 34 | Adapter terminala-jako-aplikacji |
| `src/style.css` | 1 376 | Cały stylesheet OS — szklane UI, tapety, animacje |

## Sekwencja bootu

1. `main.ts` renderuje ekran bootu z pierścieniem postępu (SVG
   `stroke-dashoffset` animowany od 326 → 0) i linią statusu.
2. Pięć etapów działa z losowym tempem: jądro → montowanie systemu plików →
   menedżer okien → aplikacje → usługi shella.
3. Konstruowane są podsystemy: `FileSystem` (nawodniony z localStorage lub
   zasiany), `ProcessManager`, `WindowManager` (związany z
   `#windows-layer`), `AppRegistry` (8 zarejestrowanych aplikacji).
4. Budowana jest powłoka desktopu (ikony, taskbar, menu start, menu
   kontekstowe, ekran blokady, zegar), ekran bootu znika, gra dźwięk
   logowania.

## EventBus — kręgosłup komunikacji

Każdy podsystem komunikuje się wyłącznie przez nazwane zdarzenia; moduły
nigdy nie importują się bezpośrednio. Bus zapewnia:

- **Typowane `on` / `once`** z uchwytami wypisania
- **Izolację błędów** — rzucający handler nigdy nie psuje innych słuchaczy
- **Historię** — ostatnie 200 emisji trzymane dla telemetrii/debugowania
- **`emitAsync`** — emisja kolejkowana mikro-zadaniami

Znane zdarzenia: `boot:*`, `window:*`, `process:*`, `fs:changed`,
`theme:changed`, `audio:volume`, `app:*`.

## ProcessManager

Każde okno jest wspierane przez rekord `Process` (PID, nazwa, ikona, stan,
start, telemetria CPU/mem). PID-y zaczynają się od 100. `ps` i `kill`
operują na tej tabeli; Monitor Systemu i taskbar czytają z niej. `tick()`
z losowym chodzeniem aktualizuje telemetrię, więc monitor wygląda na żywy.

## WindowManager

Okna to elementy DOM z chrome zbudowanym przez menedżera — aplikacje nigdy
nie dotykają paska tytułu ani kontrolek. Funkcje:

- Przeciąganie za pasek tytułu (`mousedown` + `mousemove`/`mouseup` na poziomie okna)
- 8 uchwytów zmiany rozmiaru (`n`, `s`, `e`, `w` + rogi), minimalny rozmiar 320×220
- Focus podnosi z-index; focusowane okno dostaje poświatę akcentu
- Maximize przełącza do pełnowarstwowej geometrii; minimize animuje wyjście
- Kaskadowe domyślne rozmieszczanie; aplikacje `singleInstance` ponownie używają okna

## FileSystem — POSIX-lite

- Rozwiązywanie ścieżek wspiera ścieżki absolutne i względne z `.` i `..`
  (odrzucając ucieczki powyżej roota z `EPERM`).
- `resolve(path, cwd)` normalizuje; każda operacja rzuca typowane `FSError`:
  `ENOENT`, `EISDIR`, `ENOTDIR`, `EEXIST`, `EPERM`, `EINVAL`.
- Operacje rekurencyjne: `mkdirp`, `removeRecursive`, `copy`, `move`, `tree`.
- Trwałość: drzewo serializuje się do `localStorage` (`aurora.fs.v1`) przy
  każdej mutacji i rehydratuje przy bootcie; `wipe()` przywraca obraz zasiewu.
- Domyślny obraz zawiera `/home/user` z Pulpitem, Dokumentami, Zdjęciami,
  Mediami i Projektami plus katalogi systemowe (`/bin`, `/etc`, `/tmp`, `/var`).

## Interpreter shella (czysty)

`commands.ts` jest w pełni bez-DOM: `runCommand(line, shell, fs, ctx)`
przyjmuje `Shell` (callbacki print + cwd) i działa w Node. Najważniejsze:

- **Przekierowanie** — `>` i `>>` przechwytywane przez proxy shella
- **Cytowanie** — `tokenize()` honoruje cudzysłowy podwójne
- **Kontekst komend** — `ps`/`kill`/`open`/`apps`/`history`/`shutdown`
  wiążą się z żywą tabelą procesów i rejestrem aplikacji
- **35+ komend** — pełna referencja w [podręczniku użytkownika](user-guide)

## Audio — bez plików, cała synteza

`SoundSystem.ts` leniwie tworzy pojedynczy `AudioContext` przy pierwszym
geście użytkownika (polityka autoplay). Każdy efekt to oscylator +
obwiednia wzmocnienia: dźwięk bootu (trzy wznoszące się nuty), kliknięcia
UI, przeloty otwierania/zamykania okien, brzęczyk błędu, powiadomienie
odblokowania. Aplikacja Ustawienia może go całkowicie wyłączyć.

## Motywy i trwałość

- Ustawienia żyją w `localStorage` (`aurora.settings.v1`).
- Motywy mapują się na właściwości CSS (`--acc`, `--acc2`, `--bg`)
  aplikowane na `&lt;html&gt;data-theme>`; jasny motyw odwraca tokeny tekstu/
  obramowań.
- Pięć tapet to czysty CSS — domyślna „Aurora" animuje dwa rozmyte bloby
  gradientowe z pętlą dryfu 18s/22s (szanuje `prefers-reduced-motion`).

## Strategia testowania

Rdzeń jest bez-DOM i unit-testowany: `npm test` buduje czyste moduły
esbuildem i uruchamia **34 asercje** obejmujące EventBus (emit, once,
unsubscribe, izolacja błędów), FileSystem (ścieżki, CRUD, kody błędów,
operacje rekurencyjne) i shell (echo, cd/pwd, ls, przekierowanie, cat,
mkdir, touch, wc, obsługa nieznanych komend).

---

*Dalej: [Podręcznik użytkownika — komendy, skróty, aplikacje](user-guide) · [Przegląd](/projects/aurora-os/)*
