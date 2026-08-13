# QA i raporty testów

Automatyczny przegląd testów każdego projektu w rejestrze — komplety testów
całego projektu, podziały na moduły, benchmarki wydajności oraz kontrola
bezpieczeństwa/analiza statyczna. Wykonano: 2026-08-13 (Linux, Rust 1.97,
Node 22, Python 3).

Legenda: ✅ zaliczony · ⚠️ częściowo (patrz uwagi) · ❌ niezaliczony

## Przegląd

| # | Projekt | Zestaw | Razem | Zaliczone | Błędy | Zignorowane | Status |
|---|---------|--------|-------|-----------|-------|-------------|--------|
| 1 | [NV2 Engine](#nv2-engine-nv2_engine) | `cargo test` | 97 | 96 | 0 | 1 (benchmark release) | ✅ |
| 2 | [Cybersec Toolkit](#zestaw-narzędzi-cyberbezpieczeństwa-cybersec-tools) | `cargo test --workspace` | 13 | 13 | 0 | 0 | ✅ |
| 3 | [Halcyon Process Monitor](#halcyon-process-monitor-halcyon-process-monitor) | `cargo test` | 3 | 3 | 0 | 0 | ✅ |
| 4 | [Externum](#externum-externum) | `unittest discover` | 118 | 118 | 0 | 0 | ✅ |
| 5 | [AURORA OS](#aurora-os-aurora-os) | `npm test` + `tsc` | 34 | 34 | 0 | 0 | ✅ |
| 6 | [Novactorio](#novactorio--gra-factorio-web-factorio-web-game) | typecheck + build + lint | — | — | — | — | ✅ |
| 7 | [LinkShort](#linkshort--skracacz-url-fastapi-fastapi-url) | `pytest tests/` | 11 | 11 | 0 | 0 | ✅ |
| 8 | [N2 Mesh](#n2-mesh-n2-mesh) | `npm test` | 19 | 19 | 0 | 0 | ✅ |
| 9 | [Docs — ta witryna](#docs--ta-witryna) | `npm run build` | — | — | — | — | ✅ |

**Σ 295 automatycznych testów · 294 zaliczone · 0 błędów** (+ bramki
typecheck/build/lint w projektach webowych).

---

## NV2 Engine (`NV2_ENGINE`)

**97 testów** (96 zaliczonych, 1 zignorowany = benchmark release) · pełny
raport: [`TEST_REPORT.md`](https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md)

| Zestaw | Testy | Wynik |
|---|---|---|
| Cały projekt | 97 (96 + 1 zignorowany) | ✅ 96 zaliczone, 0 błędów |
| Moduły AI/ML (ai_generator, memplp, online_trainer, vegetation, biomes) | 32 | ✅ |
| Świat i teren (block, world) | 13 | ✅ |
| Rozgrywka (interaction, crafting, inventory) | 38 | ✅ |
| Renderer (camera, mesh, texture_registry) | 6 | ✅ |
| Powłoka / inne (commands, assets) | 7 | ✅ |

| Moduł | Testy | Wynik |
|---|---|---|
| `world::ai_generator` (AI system, bundle modeli, datasety, preferencje, checkpointy, tekstury) | 16 | ✅ |
| `world::memplp` (rdzeń MeMLP — trening/wprzód, odporność na NaN, migracja, JSON roundtrip) | 10 | ✅ |
| `interaction` (stawianie/usuwanie bloków z feedbackiem AI) | 19 | ✅ |
| `inventory` | 13 | ✅ |
| `world::block` (rejestr bloków) | 7 | ✅ |
| `commands` (locate/tp + `/ai_export`, `/ai_import`, `/ai_dataset`, `/ai_stats`) | 6 | ✅ |
| `world` (menedżer świata, spawn, raycast, zapisy) | 6 | ✅ |
| `crafting` | 6 | ✅ |
| `world::vegetation` (stawianie AI, korony, przebieg drzew) | 3 | ✅ |
| `renderer::camera` | 3 | ✅ |
| `world::online_trainer` (datasety internetowe + fallback offline) | 2 | ✅ |
| `renderer::mesh` (meshowanie chunków + woda) | 2 | ✅ |
| `world::biomes` | 1 | ✅ |
| `renderer::texture_registry` | 1 | ✅ |
| `assets` | 1 | ✅ |

| Kontrola | Wynik |
|---|---|
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

---

## Zestaw narzędzi cyberbezpieczeństwa (`cybersec-tools`)

**13 testów** w 4 crate'ach — wszystkie zaliczone.

| Crate | Testy | Zakres | Wynik |
|---|---|---|---|
| hashsleuth | 4 | identyfikacja + wektory skrótów | ✅ |
| netrecon | 4 | nazwy usług, parsowanie portów/CIDR | ✅ |
| packeteye | 3 | parsowanie Ethernet/IPv4/TCP | ✅ |
| shadowscan | 2 | normalizacja celów | ✅ |

Nowe testy ujawniły i naprawiły prawdziwy błąd: znaczniki phpass (`$P$`/`$H$`)
były porównywane z zahashowanym, małymi literami tekstem i nigdy nie mogły
pasować.

Odtworzenie: `cargo test --workspace`

---

## Halcyon Process Monitor (`halcyon-process-monitor`)

**3 testy** (crate userspace `process-monitor`).

| Kontrola | Wynik |
|---|---|
| Testy jednostkowe (`cargo test`) | ✅ 3 zaliczone, 0 błędów |
| Clippy | ✅ 0 ostrzeżeń |
| Bloki `unsafe` | ⚠️ 7 (warstwa syscall/interop — oczekiwana i sprawdzona) |

> Crate `process-monitor-ebpf` celuje w `bpfel-unknown-none` i nie da się go
> zbudować/przetestować na toolchainie hosta; `build.sh` obsługuje to jawnie.

Odtworzenie: `cargo test`

---

## Externum (`externum`)

**118 testów** — czysty Python, bez zależności.

| Klasa testowa | Etap | Testy | Wynik |
|---|---|---|---|
| `TestLexer` | Lekser | 10 | ✅ |
| `TestParser` | Parser | 28 | ✅ |
| `TestCompiler` | Kompilator | 6 | ✅ |
| `TestRuntime` | Konformancja runtime'u | 55 | ✅ |
| `TestMultilineLiterals` | Dodatkowe: literały wieloliniowe | 5 | ✅ |
| `TestClassesWithBlankLines` | Dodatkowe: klasy z pustymi liniami | 2 | ✅ |
| `TestMoreFeatures` | Dodatkowe: comprehensions, bitwise, `with`/`assert`, f-stringi… | 12 | ✅ |

Odtworzenie: `python3 -m unittest discover -s tests`

---

## AURORA OS (`AURORA-OS`)

**34/34 testy rdzenia** (EventBus, FileSystem, interpreter powłoki) ·
typecheck TypeScript czysty.

| Obszar | Testy | Wynik |
|---|---|---|
| Logika rdzenia (`npm test`, harness Node) | 34 | ✅ 34 zaliczone, 0 błędów |
| TypeScript (`tsc -p tsconfig.json`) | — | ✅ 0 błędów |

Odtworzenie: `npm test`

---

## Novactorio — gra Factorio Web (`Factorio-web-game`)

Brak harnessu testów jednostkowych; bramki jakości to typecheck, build i lint.

| Bramka | Wynik |
|---|---|
| Typecheck (`tsc --noEmit -p tsconfig.app.json`) | ✅ 0 błędów |
| Build produkcyjny (`vite build`) | ✅ zbudowane w ~4 s |
| Lint (`eslint .`) | ✅ 0 błędów (usunięto wszystkie 28 `no-explicit-any`; zostało 7 stylistycznych ostrzeżeń react-hooks) |

Poprawki w trakcie przeglądu:
- Przejścia pogody wywalały się (brak `lerped config.color`) — naprawione
- Alfa światła czytana poza zakresem (`cfg[5]` z krotki 5-elementowej) — naprawione
- Animacja chodu gracza zamrożona na stałe (`PlayerState.prevX/prevY` nigdy
  nie istniały) — teraz śledzona przez renderer
- Brakujący import `removeBuilding`, usunięte martwe cache'e pogody/glow
- **Zapis gry typowany** — krotki `SaveData` mają typy; wcześniej ładowane,
  ale nigdy niezapisywane `totalPollutionGenerated` / `worldSeed` są teraz
  utrwalane

Odtworzenie: `npm run typecheck && npm run build && npm run lint`

---

## LinkShort — skracacz URL FastAPI (`FastAPI-url`)

**11/11 testów API przechodzi** — `tests/test_api.py` (venv Python 3.9).

| Test | Endpoint(y) | Asercje | Wynik |
|---|---|---|---|
| `test_health` | `GET /health` | 200 | ✅ |
| `test_register_login` | `POST /auth/register`, `/auth/login` | wydanie JWT | ✅ |
| `test_shorten` | `POST /urls/shorten`, `GET /urls/{code}/stats`, `GET /urls/r/{code}` | 200 + przekierowanie 302 | ✅ |
| `test_login_and_me` | `/auth/login`, `/auth/me` | 200; złe hasło → 401; brak tokenu → 401/403 | ✅ |
| `test_duplicate_email_rejected` | `POST /auth/register` | duplikat → 400 | ✅ |
| `test_shorten_requires_auth` | `POST /urls/shorten` | brak tokenu → 401/403 | ✅ |
| `test_my_urls_lists_only_own_links` | `GET /urls/my` | izolacja per użytkownik | ✅ |
| `test_redirect_counts_clicks` | `GET /urls/r/{code}`, statystyki | 3 wejścia → `clicks == 3` | ✅ |
| `test_stats_404_for_unknown_code` | `GET /urls/zzzzzz/stats` | 404 | ✅ |
| `test_delete_removes_link` | `DELETE /urls/{code}`, przekierowanie | 204; po usunięciu → 404 | ✅ |
| `test_delete_enforces_ownership` | `DELETE /urls/{code}` (dwóch użytkowników) | inny użytkownik → 404 | ✅ |

Wszystkie 11 modułów Pythona kompiluje się czysto. Uruchomiono na
**Pythonie 3.9** (domyślny 3.14 w środowisku QA nie ma gotowych wheeli dla
przypiętych z 2024 `pydantic-core`/`bcrypt`; obraz Dockera używa 3.12, gdzie
przypięcia instalują się czysto).

Odtworzenie: `python3.9 -m venv venv && venv/bin/pip install -r requirements.txt && venv/bin/pytest tests/ -v`

---

## N2 Mesh (`n2-mesh`)

**19/19 testów jednostkowych przechodzi** (`npm test`, `node:test` na
`core.js`) — czysta logika wydzielona do `core.js` (bez przeglądarki, bez
sieci, bez zależności).

| Grupa | Testy | Zakres | Wynik |
|---|---|---|---|
| Bajty | 2 | round-trip utf8, zwykłe tablice | ✅ |
| Id i dedup | 5 | unikalność `newMid`; `isNewMid` pierwsze-dodanie/wygaśnięcie/limit; puste id | ✅ |
| Parsowanie pokoi | 2 | normalizacja hasha, limit 48 znaków, fallback `lobby` | ✅ |
| Kolory nicków | 1 | stabilne, deterministyczne | ✅ |
| Pakiety MQTT | 9 | długość 1/2-bajtowa, PINGREQ, round-trip PUBLISH, packet id QoS>0, nagłówek CONNECT, struktura SUB/UNSUB | ✅ |

Testy złapały prawdziwy błąd: `mqttParsePublish` sprawdzał flagę **DUP**
(`0x08`) zamiast poziomu **QoS** (`0x06`) przy pomijaniu identyfikatora
pakietu, przez co payloady PUBLISH QoS-1 były źle parsowane — naprawione.

Odtworzenie: `npm test && npm run check`

---

## Docs — ta witryna

| Kontrola | Wynik |
|---|---|
| Build produkcyjny (`npm run build`, EN + PL) | ✅ 0 zepsutych linków (build kończy się błędem przy zepsutych linkach) |
| Polskie trasy (`/Docs/pl/…`) | ✅ wszystkie zweryfikowane na 200 (`trailingSlash: true`) |
| Parytet języków | ✅ każda strona EN ma tłumaczenie PL |
| TypeScript | ✅ czysty |

Odtworzenie: `npm run build`
