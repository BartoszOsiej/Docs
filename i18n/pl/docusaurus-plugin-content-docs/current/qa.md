# QA i raporty testów

Automatyczny przegląd testów każdego projektu w rejestrze — komplety testów
całego projektu, podziały na moduły i kategorie, benchmarki wydajności oraz
kontrola bezpieczeństwa/analiza statyczna. Wykonano: 2026-08-13 (Linux,
Rust 1.97, Node 22, Python 3).

Legenda: ✅ zaliczony · ⚠️ częściowo (patrz uwagi) · ❌ niezaliczony

## NV2 Engine (`NV2_ENGINE`)

**97 testów** (96 zaliczonych, 1 zignorowany = benchmark release) · pełny
raport: [`TEST_REPORT.md`](https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md)

| Zestaw | Wynik |
|---|---|
| Cały projekt | ✅ 96 zaliczone, 0 błędów |
| Moduły AI/ML (ai_generator, memplp, online_trainer, vegetation, biomes) | ✅ 32 testy |
| Świat i teren (block, world) | ✅ 13 testów |
| Rozgrywka (interaction, crafting, inventory) | ✅ 38 testów |
| Renderer (camera, mesh, texture_registry) | ✅ 6 testów |
| Powłoka / inne (commands, assets) | ✅ 7 testów |
| Benchmark wydajności (release) | ✅ głowa roślinności ~1,44 M pred/s · trening do ~0,96 M próbek/s (ta maszyna) |
| Bezpieczeństwo: bloki `unsafe` | ✅ 0 w całym kodzie |
| Clippy (`--all-targets`) | ⚠️ 43 ostrzeżenia, 0 błędów (stylistyczne, istniejące wcześniej; nowy kod bez ostrzeżeń) |

**Bug znaleziony i naprawiony podczas tego przeglądu — uszkodzenie
checkpointu przez NaN:** trening w tle mógł wysadzić wagi do NaN
(nieograniczone aktualizacje gradientu), a serde_json zapisuje NaN jako JSON
`null`, przez co cały checkpoint przestawał się ładować. Naprawa w trzech
warstwach: klipowanie gradientu + ograniczone aktualizacje w `Mlp::train`,
sanityzacja NaN/Inf przy zapisie oraz tolerancyjne ładowanie (wagi `null`
wczytywane jako `0.0`). Dodano 4 testy regresji — patrz `Src/world/memplp.rs`
i `Src/world/ai_generator.rs`.

**Funkcje Fazy 2 wdrożone w tym samym przeglądzie** (każda z testami):
**współdzielenie modeli** (`/ai_export`, `/ai_import` — przenośny format
`nv2-model-bundle`), **import datasetów treningowych** (`/ai_dataset`) oraz
**uczenie preferencji gracza** (liczniki klas w checkpointcie, wmieszane w
cele treningowe). Razem 9 nowych testów.

Odtworzenie: `cd Core && cargo test && cargo test --release qa_benchmark_report -- --ignored --nocapture`

## Zestaw narzędzi cyberbezpieczeństwa (`cybersec-tools`)

**13 testów** w 4 crate'ach — wszystkie zaliczone.

| Crate | Testy |
|---|---|
| hashsleuth | ✅ 4 (identyfikacja + wektory skrótów) |
| netrecon | ✅ 4 (nazwy usług, parsowanie portów/CIDR) |
| packeteye | ✅ 3 (parsowanie Ethernet/IPv4/TCP) |
| shadowscan | ✅ 2 (normalizacja celów) |

Nowe testy ujawniły i naprawiły prawdziwy błąd: znaczniki phpass (`$P$`/`$H$`)
były porównywane z zahashowanym, małymi literami tekstem i nigdy nie mogły
pasować.

Odtworzenie: `cargo test --workspace`

## Halcyon Process Monitor (`halcyon-process-monitor`)

✅ **3 testy zaliczone** (crate userspace `process-monitor`) · 0 ostrzeżeń
clippy · 7 bloków `unsafe` (warstwa syscall/interop — oczekiwana i sprawdzona).

> Crate `process-monitor-ebpf` celuje w `bpfel-unknown-none` i nie da się go
> zbudować/przetestować na toolchainie hosta; `build.sh` obsługuje to jawnie.

Odtworzenie: `cargo test`

## Externum (`externum`)

✅ **118 testów zaliczonych** (`python3 -m unittest discover -s tests`) —
konformancja leksera, parsera, kompilatora i runtime'u; czysty Python, bez
zależności.

## AURORA OS (`AURORA-OS`)

✅ **34/34 testy rdzenia zaliczone** · typecheck TypeScript czysty
(`tsc -p tsconfig.json`).

Odtworzenie: `npm test`

## Novactorio — gra Factorio Web (`Factorio-web-game`)

✅ Typecheck — teraz **0 błędów** · ✅ build produkcyjny OK · lint: 0 błędów
nieużywanych zmiennych (pozostały 28 stylistycznych `no-explicit-any`).

Poprawki w trakcie przeglądu:
- Przejścia pogody wywalały się (brak `lerped config.color`) — naprawione
- Alfa światła czytana poza zakresem (`cfg[5]` z krotki 5-elementowej) — naprawione
- Animacja chodu gracza zamrożona na stałe (`PlayerState.prevX/prevY` nigdy
  nie istniały) — teraz śledzona przez renderer
- Brakujący import `removeBuilding`, usunięte martwe cache'e pogody/glow

Odtworzenie: `npm run typecheck && npm run build && npm run lint`

## LinkShort — skracacz URL FastAPI (`FastAPI-url`)

✅ **3/3 testy API przechodzą** — `tests/test_api.py`: health,
rejestracja/logowanie, skracanie + statystyki + przekierowanie (`302`).
Wszystkie 11 modułów Pythona kompiluje się czysto. Uruchomiono na
**Pythonie 3.9** (domyślny 3.14 w środowisku QA nie ma gotowych wheeli dla
przypiętych z 2024 `pydantic-core`/`bcrypt`; obraz Dockera używa 3.12, gdzie
przypięcia instalują się czysto).

Odtworzenie: `python3.9 -m venv venv && venv/bin/pip install -r requirements.txt && venv/bin/pytest tests/ -v`

## N2 Mesh (`n2-mesh`)

✅ Kontrola składni JavaScript przechodzi (`node --check` na wszystkich
skryptach). Czysta statyczna aplikacja P2P — bez kroku builda, bez
zdefiniowanego harnessu testów.

## Docs — ta witryna

✅ **Błąd 404 w /pl/ naprawiony** — `trailingSlash: true`, więc każda trasa
ma swój `index.html` (wymóg GitHub Pages) · wszystkie polskie trasy
zweryfikowane na 200 · **0 zepsutych linków** w buildzie (EN + PL) · parytet
języków: każda strona EN ma tłumaczenie PL · TypeScript czysty.

Odtworzenie: `npm run build` (przy zepsutych linkach build kończy się błędem).
