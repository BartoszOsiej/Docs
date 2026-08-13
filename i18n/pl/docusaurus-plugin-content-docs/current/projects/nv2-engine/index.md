# NV2 Engine

> **Natywny silnik wokselowy w Rust z proceduralnymi światami sterowanymi przez AI — pełna desktopowa gra wokselowa zbudowana na wgpu, z wbudowaną siecią neuronową, która uczy się rozmieszczania roślinności podczas gry.**

NV2 Engine (repozytorium: `NV2_ENGINE`) to nie prototyp terenu — to
**kompletna, grywalna gra i silnik wokselowy** napisana w Rust (15 800+
linii kodu w 30+ modułach). Łączy proceduralną generację terenu, realistyczne
biomy sterowane klimatem, system roślinności oparty o sieć neuronową, która
trenuje w tle z obciążeniem &lt;1% CPU, animowaną symulację wody, pełną warstwę
interakcji niszczenia/stawiania bloków z poziomami narzędzi i trwałością,
inventory i hotbar, craftowanie oparte o przepisy (2×2 i 3×3),
zapis/wczytywanie, system komend w grze i kompletny stos GUI — wszystko
renderowane technikami wydajnymi dla GPU.

**Stos:** Rust 2021 · wgpu 0.20 · winit 0.30 · cgmath 0.18 · OpenSimplex2 ·
rayon · ndarray · serde/serde_json · fontdue · image 0.25 · bytemuck ·
env_logger · C#/.NET 8 (narzędzia treści) · Python/Pillow (narzędzia tekstur)

---

## Macierz funkcji

### Świat i teren
| Funkcja | Szczegóły |
|---|---|
| **Generacja proceduralna** | Heightmapy OpenSimplex2, jaskinie, rudy, próbkowanie kolumn świadome wody |
| **Wymiary chunków** | 16×512×16 — chunki podwójnej wysokości (podniesione z 256) dla wysokich gór i głębokich jaskiń |
| **Biomy** | 9 biomów sterowanych klimatem: Ocean, Wybrzeże, Równiny, Las, Ciemny Las, Bagno, Tajga, Pustynia, Góry |
| **Model klimatu** | Temperatura + wilgotność sterują rozkładem bloków, gęstością roślinności, mgłą i kolorem otoczenia |
| **Kanały generacji** | Dedykowane kanały OpenSimplex + seed'y dla kształtu kontynentów, temperatury, wilgotności, erozji, szczytów/rzeźby, wysokości/szczegółów, warpu, jaskiń, rud, wody |
| **Generacja asynchroniczna** | Ograniczona kolejka zadań, dedup w locie, równoległa generacja rayon, dostawa mpsc do głównego wątku |

### Roślinność sterowana AI
| Funkcja | Szczegóły |
|---|---|
| **Wbudowana sieć neuronowa** | MLP 8→16→4, 320 parametrów, ~1,2 KB pamięci |
| **Cechy wejściowe** | 8 cech terenu: wysokość, nachylenie, temperatura, wilgotność, odległość od wody, gęstość roślin, światło, seed szumu |
| **Klasy wyjściowe** | 4 klasy roślinności: kwiaty, paprocie/rośliny wodne, patyki/dekoracje, kamyki/skały |
| **Trening w tle** | Ciągły wątek, 100 próbek/epokę, ~5–10 ms/epokę, obciążenie &lt;1% CPU |
| **Metoda treningu** | Online stochastic gradient descent, loss cross-entropy, ReLU ukryte, Softmax wyjściowe, adaptacyjny spadek LR (0,95×/1000 epok) |
| **Bloki roślinności** | 22 nowe typy bloków: róże, tulipany (4 kolory), mlecze, chabry, czosnki, azalie, paprocie, grzybienie, trawy morskie, kelp, mech dywanowy, winorośle, patyki, kamyki |
| **Próg ufności** | 0,5 — tylko przewidywania o wysokiej ufności stawiają bloki |

### Renderowanie (wgpu 0.20)
| Funkcja | Szczegóły |
|---|---|
| **Bufory GPU per chunk** | Edycja bloku wgrywa tylko ten chunk (wcześniej ~81 chunków na zmianę) |
| **Frustum culling** | Ekstrakcja płaszczyzn Gribb–Hartmann z marginesem bezpieczeństwa + chroniony obszar 3×3 wokół gracza |
| **Zapakowane wierzchołki** | 72-bajtowe wierzchołki CPU → 36-bajtowy format GPU (Snorm8x4/Unorm8x4) |
| **Inkrementalne meshowanie wody** | Tylko zmienione chunki przebudowują meshe; symulacja interwałowa |
| **Osobne pipeline'y** | Świat stały, woda, płaskie panele UI, ikony sprite, renderowanie tekstu |
| **Atlas tekstur** | Dynamiczny atlas, przełączalne pakiety tekstur, warianty top/bottom/side |
| **Renderowanie tekstu** | Rasteryzacja fontdue, własne warstwy tekstu |

### Rozgrywka
| Funkcja | Szczegóły |
|---|---|
| **Interakcja z blokami** | Celowanie raycastem DDA, wydobycie z przytrzymaniem, stawianie prawym przyciskiem |
| **Poziomy narzędzi** | Ręka → Krzemień → Kamień → Żelazo → Diament → Netherite, z wartościami mocy i trwałością |
| **Inventory** | 36 slotów + 9-slotowy hotbar, łączenie stosów, drag-and-drop |
| **Crafting** | Siatka gracza 2×2 + stacja NVCrafter 3×3, przepisy kształtowe i bezkształtowe |
| **Przepisy** | 18 przepisów: deski, patyki, NVCrafter, drewniane kilof/siekiera/łopata/motyka, pochodnie, skrzynia, drzwi, zapadnia, drabina, płot, furtka, ulepszenie stołu warsztatowego, kilofy krzemienny/kamienny/żelazny |
| **Ruch** | Chód, sprint (FOV kick), skok, latanie, grawitacja/zatapianie w wodzie, kolizja AABB, modyfikatory ruchu od roślinności |
| **Komendy** | `/locate &lt;biome&gt; [--tp]`, `/tp &lt;x&gt; &lt;y&gt; &lt;z&gt;` |
| **Trwałość** | Zapis świata JSON (seed, bloki chunków, metadane wody, stany NVCrafter) |

### Specjalna logika rozgrywki
| Funkcja | Szczegóły |
|---|---|
| **Zrzuty krzemienia** | Żwir może upuszczać krzemień przez deterministyczną logikę seeded |
| **Zbiórka drzew** | Zniszczenie pnia zbiera połączony klaster pień/liście |
| **Zrzuty liści** | Liście upuszczają sadzonki i patyki z deterministycznymi szansami |
| **Opróżnianie craftera** | Rozbicie NVCrafter wypłukuje przechowywaną zawartość do zrzutów świata |
| **Ochrona stawiania** | Bloków nie można stawiać wewnątrz AABB gracza |

---

## Szybki start

Wymaga toolchainu Rust (stabilny wystarczy) i GPU z obsługą
Vulkan/Metal/DX12/GL.

```bash
cd Core
cargo run --release
```

Gra otwiera okno z menu głównym:

| Pozycja menu | Akcja |
|---|---|
| **Nowa gra** | Start nowego proceduralnie wygenerowanego świata |
| **Wczytaj/Zapisz** | Wczytaj zapisany świat |
| **Low-End-PC** | Przełącz profil wydajności dla słabszych komputerów |
| **Wyjdź** | Zakończ |

> **Uwaga:** `cargo run` w trybie dev i tak buduje crate'y zewnętrzne na
> `opt-level 3`, więc nawet build debug gra płynnie.

**Pierwsze minuty w grze:** spawn w pobliżu lasu → zbieraj drzewa gołymi
rękami → zbierz drewno → otwórz siatkę craftingu 2×2 (`E`) → zrób drewniane
deski → patyki → drewniany kilof → wydobywaj kamień → zrób kamienny kilof →
wydobywaj żelazo → w końcu zrób NVCrafter dla przepisów 3×3.

---

## Indeks dokumentacji

| Strona | Zawartość |
|---|---|
| [Architektura](/projects/nv2-engine/architecture) | Pełny runtime, renderer, świat, warstwy UI — moduł po module |
| [Rozgrywka](/projects/nv2-engine/gameplay) | Sterowanie, interakcja, inventory, crafting, komendy, trwałość |
| [Bloki i biomy](/projects/nv2-engine/blocks) | Kompletny rejestr 97 bloków, poziomy narzędzi, 9 definicji biomów, rudy |
| [Referencja craftingu](/projects/nv2-engine/crafting) | Każdy przepis z dokładnymi wzorami |
| [Symulacja wody](/projects/nv2-engine/water) | Kodowanie cieczy, solver i wewnętrzne renderowania |
| [System roślinności AI](/projects/nv2-engine/ai) | Matematyka sieci, pętla treningu, hiperparametry, integracja |
| [Wydajność](/projects/nv2-engine/performance) | Przepustowość GPU, culling, budżety meshowania, profile |
| [Rozwój](/projects/nv2-engine/development) | Build, mapa modułów, testowanie, rozszerzanie silnika |
| [Plan i zmiany](/projects/nv2-engine/roadmap) | Historia, plany Faz 2, znane ograniczenia |
