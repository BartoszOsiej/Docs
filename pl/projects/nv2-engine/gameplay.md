# Rozgrywka

NV2 Engine to pętla survival-sandbox: wygeneruj proceduralny świat, niszcz
i stawiaj bloki z bramkowanym narzędziami zbiorem, zbieraj surowce, twórz
narzędzia i meble oraz eksploruj biomy sterowane klimatem, w których AI
stawia roślinność.

## Sterowanie

| Wejście | Akcja |
|---|---|
| `W` `A` `S` `D` | Ruch |
| `Spacja` | Skok (lub wznoszenie w trybie lotu) |
| `Shift` | Sprint (z FOV kick) |
| `F` | Przełącz tryb lotu |
| `E` | Otwórz / zamknij inventory |
| `Esc` | Menu pauzy (lub zamknij inventory) |
| `/` | Otwórz wiersz komend |
| Lewy przycisk myszy | Niszcz blok (przytrzymaj, aby kopać dalej; bramkowany narzędziem) |
| Prawy przycisk myszy | Stawiaj blok / użyj przedmiotu |
| Kółko myszy | Zmień slot hotbara |
| Mysz | Rozglądanie się (przechwycona podczas gry) |

**W menu:** `↑` / `↓` (lub `W` / `S`) nawigują, `Enter` / `Spacja`
potwierdza, `N` zaczyna nową grę, `L` wczytuje z menu głównego.

---

## Interakcja z blokami (`interaction.rs`)

### Celowanie
Wokselowy raycasting DDA (Digital Differential Analyzer) przez
`world/raycast.rs` rzutuje z kamery przez krzyżyk, aby znaleźć celowany blok.

### Wydobycie
- **Lewy przycisk myszy** zaczyna niszczenie; **przytrzymanie** kontynuuje
  z utrzymywanym stanem postępu.
- Zbiór jest **bramkowany narzędziami**: każdy blok ma twardość i wymagany
  poziom narzędzia; moc trzymanego narzędzia musi spełniać wymóg.
- Udane zbiory zużywają **trwałość narzędzia**.

### Stawianie
- **Prawy przycisk myszy** stawia blok z aktywnego stosu inventory.
- Stawianie jest zablokowane **wewnątrz AABB gracza** (nie można budować
  w sobie).

### Specjalna logika zrzutów
| Przypadek | Zachowanie |
|---|---|
| Żwir | Może upuścić **krzemień** przez deterministyczną logikę seeded |
| Pień drzewa | Zniszczenie pnia zbiera **połączony klaster pień/liście**, nie tylko jeden blok |
| Liście | Mogą dodatkowo upuścić **sadzonki i patyki** z deterministycznymi szansami |
| NVCrafter | Rozbicie **wypłukuje przechowywaną zawartość** do zrzutów świata przed usunięciem |

---

## Poziomy narzędzi i trwałość

| Poziom | Moc | Narzędzia |
|---|---|---|
| Ręka | 1 | Gołe ręce |
| Krzemień | 2 | Krzemienny kilof |
| Kamień | 3 | Kamienny kilof |
| Żelazo | 5 | Żelazny kilof |
| Diament | 7 | Diamentowy kilof |
| Netherite | 8 | Kilof z netherite |

Każde narzędzie śledzi `max_durability`; wydobywanie poprawnych celów
zużywa trwałość. Moc narzędzia bramkuje, które bloki można zniszczyć —
drewniany poziom nie wydobędzie bloków poziomu kamiennego.

---

## Inventory i hotbar (`inventory.rs`)

- **36-slotowe inventory gracza**
- **9-slotowy hotbar** odwzorowany na koniec inventory
- Aktywny wybór hotbara kółkiem myszy
- **Łączenie stosów i obsługa przepełnienia**
- Śledzenie trwałości narzędzi
- Rozdzielenie przedmiotów stawialnych i tylko-inventory
- Wbudowana **siatka craftingu gracza 2×2** ze slotem wyjścia

Drag-and-drop działa na wszystkich typach slotów GUI (inventory, wejścia/
wyjście craftingu, NVCrafter).

---

## Crafting (`crafting.rs`)

Dwie powierzchnie craftingu:

| Powierzchnia | Siatka | Gdzie |
|---|---|---|
| Crafting gracza | 2×2 | Zawsze dostępny na ekranie inventory |
| NVCrafter | 3×3 | Stacja craftingu stawiana w świecie (z trwałym stanem) |

`RecipeRegistry` wspiera **przepisy kształtowe** (dopasowanie wzorca
z obsługą offsetu) i **przepisy bezkształtowe** (dopasowanie multizbioru).
Przepisy można też wczytywać z JSON (`assets.rs`). Zobacz
[Referencję craftingu](crafting), aby poznać każdy przepis z dokładnymi
wzorami.

---

## Ruch i fizyka (`renderer/camera.rs`)

- Chodzenie, **sprint z FOV kick**, skakanie
- Grawitacja z ograniczeniem prędkości spadania
- **Tryb lotu** (`F`) — wyłącza grawitację, `Spacja` wznosi
- **Fizyka wody** — grawitacja i zatapianie specyficzne dla wody
- Kolizja AABB z blokami stałymi
- **Ośrodki ruchu** — przebywanie w roślinności stosuje mnożnik prędkości
  ruchu 0,55× (sprint 0,65×, upadek 0,35×), z tłumieniem dźwięku śledzonym
  dla przyszłego audio

---

## Komendy (`commands.rs`)

Otwórz wiersz `/`:

| Komenda | Opis |
|---|---|
| `/locate <biome> [--tp]` | Znajdź najbliższy biom, próbkując pierścienie chunków na zewnątrz od gracza; `--tp` teleportuje tam |
| `/tp <x> <y> <z>` | Teleportuj do współrzędnych bezwzględnych (bezpiecznie rozwiązanych) |

Odpowiedzi i błędy pojawiają się na stdout i w silniku jako komunikaty
napisy/wiersz komend. Teleportacje używają
`World::safe_teleport_position(...)`, aby nie umieszczać gracza wewnątrz
bloków stałych.

---

## Trwałość

Świat serializuje się do **JSON** w `saves/world.json` (obok pliku
wykonywalnego). Zapisane dane:

- Seed świata
- Spłaszczone dane bloków chunków
- Metadane wody chunków
- Zapisane stany NVCrafter

Menu pauzy oferuje **Zapisz** i **Zapisz i wyjdź**; menu główne oferuje
**Wczytaj/Zapisz**. Stare zapisy pozostają w pełni kompatybilne —
roślinność AI włącza się tylko dla nowo wygenerowanych chunków.

---

## Dzień/noc i atmosfera

Renderer napędza progresję fazy dnia/nocy przez `elapsed_time`, timing
animacji wody oraz uniformy mgły i koloru otoczenia sterowane klimatem/
biomem — każdy biom barwi scenę (np. las `[0.50, 0.86, 0.42]`, ciemny las
`[0.38, 0.72, 0.34]`).
