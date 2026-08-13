# Architektura

NV2 Engine to warstwowa aplikacja w Rust: powłoka sterowana zdarzeniami
`winit`, renderer `wgpu`, proceduralna symulacja świata i stos GUI — plus
pomocnicze narzędzia pipeline'u treści w .NET i Pythonie. Ta strona
dokumentuje każdą warstwę szczegółowo, moduł po module, na podstawie
rzeczywistego kodu.

## Mapa źródła (Core/Src, 15 800+ linii)

| Moduł | Linie | Odpowiedzialność |
|---|---|---|
| `main.rs` | 674 | Powłoka aplikacji, pętla zdarzeń winit, 3 tryby runtime, zapis/wczytanie, menu |
| `renderer/mod.rs` | 2 223 | Stan renderera, wszystkie pipeline'y, culling, dzień/noc, UI |
| `interaction.rs` | 1 566 | Raycast DDA, wydobycie, stawianie, bramkowanie narzędziami, zrzuty, warstwa GUI |
| `world/block.rs` | 1 294 | Rejestr bloków (97 typów), poziomy narzędzi, twardość, ośrodki ruchu |
| `world/biomes.rs` | 999 | 9 definicji biomów, model klimatu, generacja terenu |
| `world/mod.rs` | 961 | Kontener świata, streaming chunków, zapis/wczytanie, propagacja drzew |
| `crafting.rs` | 899 | Rejestr przepisów, dopasowanie kształtowe/bezkształtowe, stany NVCrafter |
| `world/vegetation.rs` | 868 | Drzewa, trawa, rozmieszczanie roślinności AI |
| `renderer/camera.rs` | 645 | Kamera pierwszoosobowa, ruch, kolizje, latanie, woda |
| `renderer/text.rs` | 631 | Rasteryzacja fontdue, pomiar tekstu, warstwy |
| `inventory.rs` | 597 | Inventory 36-slotowe, hotbar, stosy, trwałość |
| `renderer/mesh.rs` | 551 | Meshowanie chunków stałych i wody |
| `renderer/texture_atlas.rs` | 530 | Dynamiczny atlas, pakiety tekstur, wyszukiwanie UV |
| `assets.rs` | 519 | Modele bloków, przepisy JSON, wykrywanie tekstur |
| `world/ai_generator.rs` | 410 | Sieć neuronowa, przejście wprzód/wstecz, wątek treningu |
| `commands.rs` | 375 | `/locate`, `/tp` z testami |
| `world/liquid.rs` | 286 | Symulacja wody (solver grawitacja-pierwsza, kodowanie przepływu) |
| `renderer/texture_registry.rs` | 177 | Normalizacja nazw tekstur, funkcje kafelków |
| `renderer/vertices.rs` | 160 | Definicje Vertex i PackedVertex (36 B) |
| `settings.rs` | 144 | AppSettings, profil Low-End-PC, trwałość settings.json |
| `world/generator.rs` | 139 | Asynchroniczna kolejka generacji chunków |
| `world/chunk.rs` | 131 | Magazyn chunków 16×512×16, water_meta |
| `world/raycast.rs` | 91 | Wokselowy raycasting DDA |
| `input.rs` | 84 | Stan klawiatury/myszy |
| `world/worldgen.rs` | 80 | Abstrakcja WorldGenWriter |
| `renderer/instance.rs` | 78 | Pomocnicze funkcje renderowania instancji |
| `world/decorations.rs` | 52 | Stawianie bloków dekoracyjnych |
| `world/decoration_ai.rs` | 44 | Dekoracje sterowane AI |
| `renderer/menu.rs` | 148 | Renderowanie menu głównego/pauzy |
| `renderer/texture.rs` | 28 | Ładowanie tekstur |
| `world/palette.rs` | 24 | Pomocnicze funkcje palety bloków |
| `world/online_trainer.rs` | 14 | Stub opcjonalnego treningu wspomaganego chmurą |

## Przegląd warstw

```
┌──────────────────────────────────────────────────────────────┐
│  Powłoka aplikacji (main.rs)                                  │
│  winit::application::ApplicationHandler                       │
│  Tryby: MainMenu · Playing · PauseMenu                        │
│  routing wejścia · zapis/wczytanie · komunikaty statusu · komendy │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
┌──────────────▼───────────────┐  ┌────▼───────────────────────┐
│  Renderer (renderer/)       │  │  Świat (world/)            │
│  wgpu surface/device/queue  │  │  (cx,cz) -> mapa Chunk      │
│  5 kategorii pipeline'ów    │  │  BiomeGenerator            │
│  frustum culling            │  │  ChunkGenerator (async)    │
│  bufory GPU per chunk       │  │  symulacja wody            │
│  atlas tekstur + pakiety    │  │  system AI + trening        │
│  UI menu/tekst/inventory    │  │  stany NVCrafter           │
└──────────────┬───────────────┘  └────┬───────────────────────┘
               │                       │
               └───────────┬───────────┘
                           ▼
          InteractionController (interaction.rs)
          most transakcji gameplay <-> GUI
```

## 1. Powłoka aplikacji (`main.rs`)

Punkt wejścia używa `winit::application::ApplicationHandler` i zarządza
trzema jawnymi trybami runtime:

```rust
enum AppMode { MainMenu, Playing, PauseMenu }
```

Struktura `App` posiada:

- stan renderera
- instancję `World`
- stan akumulacji wejścia
- obsługę ścieżek zapisu/wczytania (`exe_dir/saves/world.json`)
- komunikaty statusu/napisy
- stan wejścia komend
- stan wyboru menu głównego i menu pauzy

**Przepływy runtime zaimplementowane w powłoce:**

- Przepływ nowej gry → `start_new_game()` ustawia `AppMode::Playing`
- Zapis → `save_game()` wywołuje `world.save_to_file()` i pokazuje status
- Wczytanie → `load_game()` wywołuje `World::load_from_file_with_settings()`,
  w razie błędu wraca do `MainMenu`
- Przejścia pauza/wznowienie z przełączaniem przechwytywania kursora
- Wiersz komend otwierany `/`, routowany przez `commands::execute(...)`
- Przełącznik Low-End-PC z feedbackiem na ekranie i zapisanymi ustawieniami

## 2. Architektura renderowania (`renderer/mod.rs`)

`renderer::State` posiada powierzchnię/urządzenie/kolejkę/konfigurację
WGPU, uniformy kamery, uniformy materiałów/biomów, teksturę głębi, atlas
tekstur i grupy bind — oraz **pięć kategorii pipeline'ów**:

| Pipeline | Geometria |
|---|---|
| Świat stały | Nieprzezroczyste meshe chunków |
| Woda | Przezroczyste meshe wody (osobna ścieżka) |
| Płaskie panele UI | Proceduralne quady paneli |
| Ikony sprite UI | Ikony przedmiotów z atlasu |
| Tekst | Warstwy glifów rasteryzowane fontdue |

**Kluczowe szczegóły po stronie renderera:**

- Meshe chunków i meshe wody cache'owane osobno wg współrzędnych chunku
- Tworzenie meshów ograniczane: tylko kilka chunków na klatkę
- Uploady GPU debounced (nie wgrywane przy każdej zmianie pojedynczego chunku)
- Rekombinacja meshów wody oddzielona od pełnych przebudów meshów wody
- Naprawa szwów przebudowuje granice sąsiednich chunków przy nowych chunkach
- Konserwatywna submisja w pobliżu gracza

**Systemy widoczne w rozgrywce sterowane przez renderer:**

- Progresja fazy dnia/nocy przez `elapsed_time`
- Timing animacji wody
- Uniformy mgły i koloru otoczenia sterowane klimatem/biomem
- Krzyżyk, nakładki napisów, nakładki wiersza komend
- Renderowanie menu głównego, menu pauzy, inventory i panelu craftera

## 3. Świat i streaming chunków (`world/mod.rs`)

`World` przechowuje:

- Załadowane chunki w mapie `(cx, cz) -> Chunk`
- Współdzielony `BiomeGenerator`
- `ChunkGenerator` do generacji w tle + odbiornik ukończonych chunków
- Śledzenie oczekujących chunków i oczekujących zapisów między chunkami
- Śledzenie populacji drzew dla już przetworzonych chunków
- Wpisy `NVCrafterState` per blok
- Buforowane encje `WorldItemDrop`

**Funkcje świata:**

- Synchroniczna materializacja chunków w pobliżu gracza
- Generacja odległych chunków w tle
- Wyładowywanie odległych chunków z buforowym promieniem
- Buforowanie zapisów między chunkami
- Leniwa generacja chunków, gdy mutacje transgraniczne wymagają chunku docelowego
- Odczyt/zapis bloków wg współrzędnych świata + pomocnicze identyfikatory bloków
- Pomocnicze funkcje stawiania/niszczenia bloków
- Buforowanie i opróżnianie zrzutów przedmiotów w runtime
- Wsparcie zapisu/wczytania (seed, spłaszczone bloki chunków, metadane wody, stany crafterów)
- Bezpieczne rozwiązywanie pozycji teleportacji
- Wyszukiwanie spawna oparte o realną zajętość bloków i prześwit w runtime

### Generacja asynchroniczna (`world/generator.rs`)

- Ograniczona kolejka współrzędnych chunków
- Zbiór in-flight do deduplikacji wysyłki
- Grupowe opróżnianie z głównego wątku co klatkę
- Równoległa generacja przez `rayon::spawn(...)` + `into_par_iter()`
- Wyniki dostarczane przez `mpsc`

## 4. Proceduralny teren i biomy (`world/biomes.rs`)

Dziewięć biomów, każdy z temperaturą, wilgotnością, gęstością drzew/trawy,
typami drzew, blokiem powierzchni i odcieniem roślinności:

| Biom | Temp | Wilgot. | Drzewa | Trawa | Powierzchnia |
|---|---|---|---|---|---|
| Ocean | 0.48 | 0.88 | 0.00 | 0.00 | Piasek |
| Wybrzeże | 0.62 | 0.54 | 0.02 | 0.10 | Piasek |
| Równiny | 0.58 | 0.46 | 0.05 | 0.72 | Trawa |
| Las | 0.54 | 0.62 | 0.46 | 0.46 | Trawa |
| Ciemny Las | 0.50 | 0.74 | 0.74 | 0.18 | Leśne Dno |
| Bagno | — | — | — | — | — |
| Tajga | — | — | — | — | — |
| Pustynia | — | — | — | — | — |
| Góry | — | — | — | — | — |

Generacja łączy wiele kanałów OpenSimplex z dedykowanymi seed'ami: kształt
kontynentu, temperatura, wilgotność, erozja, szczyty/rzeźba,
wysokość/szczegóły, warp/zmienność powierzchni, jaskinie, rudy, woda.
Generator udostępnia dane klimatu z powrotem rendererowi (kolor otoczenia,
kolor/gęstość mgły, gradacja sceny, odcień roślinności, ciepło, wilgoć,
bujność).

## 5. Roślinność i propagacja drzew (`world/vegetation.rs`)

- Teren może emitować **odroczone zapisy świata**
- Gdy chunk istnieje, uruchamiany jest jawny przebieg drzew w przestrzeni świata
- `populate_world_trees_for_chunk(...)` stosuje roślinność post-insert tylko
  raz na jawnie wstawiony chunk
- Wsparcie zapisów koron między chunkami; chunki docelowe przepełnienia
  pozostają tylko-terenowe, dopóki nie zostaną jawnie załadowane
- Planowanie pni przed stawianiem koron, kształty koron zależne od biomu,
  sprawdzenia podłoża (teren/trawa/kwiat/krzew), deterministyczna zmienność
  seeded, jawna walidacja w przestrzeni świata

## 6. Kamera, ruch i kolizje (`renderer/camera.rs`)

Autorytatywna ścieżka ruchu: przechwytywanie wejścia w `main.rs` →
`renderer::State::update(...)` → `Camera::tick_movement(...)`.

- Rotacja kamery pierwszoosobowej, chodzenie, sprint, skok
- Przełącznik latania (F) i grawitacja z ograniczeniem prędkości spadania
- Grawitacja i zatapianie specyficzne dla wody
- Kolizja AABB z blokami stałymi
- Przechwytywanie intencji wejścia oddzielone od integracji ruchu
- Modyfikatory ruchu w runtime od nakładających się ośrodków bloków
  (`BlockType::movement_medium(...)`, śledzenie `in_foliage_medium`
  i `footstep_volume` dla przyszłych hooków audio)

## 7. GUI i warstwa interakcji (`interaction.rs`)

`InteractionController` działa jako **warstwa transakcji GUI** między
inventory gracza a światem:

- Otwieranie/zamykanie GUI inventory
- Otwieranie GUI NVCrafter, gdy celowany blok to wspiera
- Wykrywanie najechania na slot
- Drag-and-drop między typami slotów
- Obsługa kliknięcia w slot wyjścia
- Zwracanie wejść craftingu przy zamknięciu GUI
- Przenoszenie wejść NVCrafter z powrotem do inventory lub zrzucanie ich do świata

`UiSlotId` jawnie rozróżnia: sloty inventory gracza, wejścia craftingu
gracza, wyjście craftingu gracza, wejścia NVCrafter, wyjście NVCrafter.

## 8. Narzędzia pipeline'u treści

| Narzędzie | Tech | Cel |
|---|---|---|
| `Bridge/Tools/Slicer/Program.cs` | .NET 8 | Krajanie atlasu — skanuje PNG atlasów, wyodrębnia tekstury bloków |
| `generate_textures.py` | Python/Pillow | Obracanie, odbicia, grayscale, inwersja, przyciemnianie, rozjaśnianie tekstur |
| `.vscode/tasks.json` | — | Uruchamianie pliku wykonywalnego silnika z workspace |
| `VulkanLayers/VkLayer_NV20.json` + `.dll` | — | Pakowanie własnej warstwy Vulkan |

## 9. Co celowo jeszcze nie jest zaimplementowane

- Dedykowany system audio rozgrywki (sygnały ośrodków ruchu już śledzone)
- Sieciowanie / multiplayer
- Edytor treści w silniku
- Formalna architektura rozgrywki w stylu ECS
