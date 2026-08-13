# Wydajność

NV2 Engine jest zaprojektowany tak, aby przepustowość GPU, wywołania
draw i meshowanie CPU pozostały proporcjonalne do tego, co faktycznie się
zmieniło — a nie do całego świata.

## Przepustowość GPU: zapakowane wierzchołki

- Wierzchołki po stronie CPU mają **72 bajty**; rezydentny na GPU
  `PackedVertex` (zdefiniowany w `renderer/vertices.rs`) pakuje je do
  **36 bajtów** (Snorm8x4 / Unorm8x4).
- Przepustowość wierzchołków jest **zmniejszona o połowę** przy każdym
  uploadzie chunku.

## Bufory GPU per chunk

Edycja bloku wgrywa ponownie tylko dotknięty chunk zamiast całego
załadowanego obszaru (wcześniej ~81 chunków na zmianę). Uploady GPU są
dodatkowo **debounced**, a nie wgrywane przy każdej zmianie pojedynczego
chunku.

## Frustum culling

Ekstrakcja płaszczyzn Gribb–Hartmann odrzuca chunki poza widokiem,
z marginesem bezpieczeństwa i **chronionym obszarem 3×3 wokół gracza**,
aby zapobiec nadmiernemu odrzucaniu. Zmniejsza to widoczne chunki
mniej więcej o połowę w typowych scenach, utrzymując zawsze renderowane
otoczenie gracza.

## Inkrementalna symulacja wody

- Tylko **zmienione chunki** przebudowują meshe wody — statyczna woda
  nigdy nie wyzwala przebudowy.
- Symulacja i meshowanie są interwałowe (`water_sim_interval`,
  `water_rebuild_interval`).
- Rekombinacja meshów wody jest oddzielona od pełnych przebudów meshów wody.

## Budżet meshowania CPU

- Tworzenie meshów jest **ograniczane** — tylko kilka chunków jest
  budowanych na klatkę (`mesh_build_budget`).
- **Naprawa szwów** przebudowuje tylko granice sąsiednich chunków, gdy
  pojawiają się nowe chunki.
- Meshe chunków i meshe wody są cache'owane osobno wg współrzędnej chunku.

## Asynchroniczna generacja chunków

- Ograniczona kolejka zadań z deduplikacją in-flight
- Równoległa generacja przez `rayon` (`into_par_iter()`)
- Wyniki dostarczane przez `mpsc` — wstawianie do świata i koordynacja
  meshów pozostają na głównym wątku

## Trening AI w tle

Trener roślinności oparty o sieć neuronową działa na wątku w tle:

| Metryka | Wartość |
|---|---|
| Narzut na rozgrywkę | ~0,8% |
| Czas epoki | ~5–10 ms (100 próbek) |
| Pamięć | ~1,2 KB model + 256 KB stos wątku |

## Profile wydajności (`settings.rs`)

Wszystkie poniższe wartości są scentralizowane w `settings.rs` i
przełączane trybem **Low-End-PC** (jeden klawisz w menu, trwały między
uruchomieniami przez `settings.json` obok pliku wykonywalnego).

| Ustawienie | Efekt |
|---|---|
| `load_radius` | Jak daleko generuje się świat |
| `render_radius` | Jak daleko renderuje się świat |
| `cleanup_radius` | Kiedy odległe chunki są wyładowywane |
| `mesh_build_budget` | Chunki przebudowywane na klatkę |
| `water_sim_interval` | Częstotliwość symulacji wody |
| `water_rebuild_interval` | Częstotliwość meshowania wody |
| Gęstość roślinności | Gęstość stawiania roślinności |
| Gęstość mgły | Odległość rysowania atmosfery |
| Vsync | Synchronizacja klatek |

`AppSettings` jest serializowany serde (pretty JSON), ładowany
z łagodnymi fallbackami przy błędach parsowania/odczytu i udostępniany
przez `SharedSettings` (an `Arc<RwLock<AppSettings>>`) dla bezpiecznego
dostępu współbieżnego.

## Wpływ implementacji AI (zmierzony)

| Scenariusz | Przed | Po |
|---|---|---|
| Kompilacja | 45 s | 52 s (+ndarray/tokio) |
| Start | ~100 ms | ~105 ms (+spawn wątku AI) |
| CPU rozgrywki | 0% narzutu AI | 0,8% |
| Pamięć | baseline | +1,2 KB model + 256 KB stos |
