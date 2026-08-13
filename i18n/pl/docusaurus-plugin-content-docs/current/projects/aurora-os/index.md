# ◈ AURORA OS

<a class="tests-cta" href="./testy">🧪 Zobacz animowane wyniki testów — 56/56 →</a>

**Kompletny system operacyjny działający w Twojej przeglądarce.**

AURORA OS to środowisko desktopowe pisane od zera — menedżer okien,
wirtualny system plików, shell i osiem aplikacji — napisane w całości
w TypeScript z **zerowymi zależnościami w runtime**. Bez frameworków, bez
serwera, bez artefaktów builda w runtime: jądro bootuje, renderuje i
utrwala się w całości w karcie Twojej przeglądarki.

> *„Twoja przeglądarka jest teraz Twoim komputerem."*

---

## 🎯 Czym jest AURORA OS?

Większość demo „web OS" to pojedyncze okno z przyciskami. AURORA OS to
prawdziwy system: bootuje przez animowaną sekwencję jądra, posiada tabelę
procesów, multipleksuje okna z pełną semantyką drag/resize/minimize/
maximize, hostuje wirtualny system plików w duchu POSIX z trwałością
i ma interaktywny shell z **35+ komendami** — wszystko zaimplementowane
od zera.

Cały projekt to **~4 500 linii** ręcznie pisanego TypeScript + CSS
(3 118 linii TS w 16 modułach, 1 376 linii CSS), z **zerowymi zewnętrznymi
zależnościami w runtime**.

## ✨ Macierz funkcji

| Warstwa | Możliwości |
|---|---|
| 🧠 **Jądro** | Animowana sekwencja bootu z pierścieniem postępu · typowany EventBus (pub/sub, once, historia, izolacja błędów) · tabela procesów PID z telemetrią · podsystem ustawień · trwałość w localStorage |
| 🪟 **Menedżer okien** | Przeciąganie za pasek tytułu · uchwyty zmiany rozmiaru w 8 kierunkach · minimize / maximize / focus · kaskadowe rozmieszczanie · zarządzanie z-order · szklane chrome · animacje otwierania/zamykania · integracja z taskbarem |
| 📂 **Wirtualny system plików** | Drzewo w duchu POSIX · ścieżki absolutne i względne z rozwiązywaniem `.` / `..` · `mkdir -p`, rekurencyjne `rm -r`, `cp`, `mv` · poprawne kody błędów (`ENOENT`, `EISDIR`, `EEXIST`, `EPERM`, `ENOTDIR`) · czytelne rozmiary · trwałość w localStorage |
| ⌨️ **Terminal i shell** | 35+ komend · historia komend (↑/↓) · uzupełnianie ścieżek Tabulatorem · przekierowanie wyjścia (`>` / `>>`) · renderowanie kolorów ANSI · `neofetch`, `fortune`, `sudo` (jesteś rootem) · czysty interpreter, w pełni unit-testowany |
| 📱 **Aplikacje** | Pliki · Terminal · Edytor (Ctrl+S) · Kalkulator · Paint (eksport PNG) · Monitor systemu (wykresy CPU/pamięci na żywo) · Ustawienia · O programie |
| 🎨 **Motywy** | 5 motywów: Aurora, Midnight, Ember, Forest, Daylight · 5 animowanych tapet: Aurora, Grid, Mountains, Waves, Dots |
| 🔊 **Audio** | W pełni proceduralne WebAudio — dźwięk bootu, kliknięcia UI, świsty okien, brzęczyki błędów, powiadomienie odblokowania. Zero plików audio |
| 🔒 **Teatr bezpieczeństwa** | Ekran blokady (Ctrl+Alt+L) · model jednoużytkownikowy · granice uprawnień systemu plików |

## 🚀 Szybki start

```bash
git clone https://github.com/BartoszOsiej/AURORA-OS.git
cd AURORA-OS
npm install
npm run build      # buduje do dist/ (esbuild, narzędzie tylko dev)
npm run serve      # http://localhost:8080
```

| Komenda | Cel |
|---|---|
| `npm run build` | bundle esbuild → `dist/main.js` + kopia `dist/style.css` |
| `npm run typecheck` | ścisła kontrola typów `tsc` |
| `npm test` | uruchamia 34 testy logiki rdzenia (EventBus, FileSystem, shell) |
| `npm run serve` | statyczny serwer plików dla OS |

## 🖱️ Pierwsze kroki wewnątrz OS

1. Kliknij dwukrotnie **Terminal** na pulpicie (lub otwórz menu Start ◈).
2. Wpisz `help`, aby wypisać wszystkie komendy, `neofetch` dla banera systemu.
3. Utwórz plik: `echo hello > hello.txt`, potem `cat hello.txt`.
4. Otwórz go graficznie: `open editor hello.txt`.
5. Kliknij prawym na pulpicie: nowy folder, nowy plik, tapeta, blokada ekranu.
6. `ps` + `kill 101`, aby zarządzać procesami.
7. Naciśnij **Ctrl+Alt+L**, aby zablokować system.

## 🔗 Linki

| Zasób | URL |
|---|---|
| Kod źródłowy | https://github.com/BartoszOsiej/AURORA-OS |
| Architektura | [Dogłębnie o każdym podsystemie](/projects/aurora-os/architecture) |
| Podręcznik użytkownika | [Referencja terminala, skróty, aplikacje](/projects/aurora-os/user-guide) |

---

*Powiązana dokumentacja: [NV2 Engine](/projects/nv2-engine/) · [Cybersec Toolkit](/projects/cybersec-tools/) · [LinkShort](/projects/fastapi-url/) · [Novactorio](/projects/factorio-web-game/)*
