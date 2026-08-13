# Referencja craftingu

Każdy przepis zarejestrowany w `crafting.rs`, z **dokładnymi wzorami
z kodu źródłowego**. Silnik wspiera **przepisy kształtowe** (stałe wzory
z dopasowaniem offsetu) i **przepisy bezkształtowe** (dopasowanie
multizbioru).

Legenda: `P` = Deski · `S` = Patyk · `L` = pień (wczesne drewno) ·
`ST` = Kamień · `I` = Sztabka żelaza · `F` = Krzemień

## Powierzchnie

| Powierzchnia | Siatka | Uwagi |
|---|---|---|
| Crafting gracza | 2×2 | Zawsze dostępny przez `E` |
| NVCrafter | 3×3 | Stacja stawiana w świecie; stan trwa w zapisach |

## Przepisy bezkształtowe

| Wynik | Ilość | Wejście |
|---|---|---|
| Deski | ×4 | 1 pień (dowolne drewno `EARLY_GAME_LOGS`) |
| Krzemienny kilof | ×1 | Krzemień + Patyk |

## Przepisy kształtowe

### Obróbka drewna
**Patyki ×4** — siatka 1×2
```
[P]
[P]
```

### NVCrafter ×1 — siatka 3×3 (pierścień desek, pień w środku)
```
[P][P][P]
[P][L][P]
[P][P][P]
```

### Drewniane narzędzia (×1 każde)

**Drewniany kilof** — 3×3
```
[P][P][P]
[ ][S][ ]
[ ][S][ ]
```

**Drewniana siekiera** — 2×3
```
[P][P]
[P][S]
[ ][S]
```

**Drewniana łopata** — 1×3
```
[P]
[S]
[S]
```

**Drewniana motyka** — 2×3
```
[P][P]
[ ][S]
[ ][S]
```

### Pochodnie ×4 — siatka 1×2 (patyk nad pniem)
```
[S]
[L]
```

### Przechowywanie i meble

**Skrzynia ×1** — 3×3 (pierścień desek, pusty środek)
```
[P][P][P]
[P][ ][P]
[P][P][P]
```

**Drzwi ×3** — 2×3 (6 desek)
```
[P][P]
[P][P]
[P][P]
```

**Zapadnia ×2** — 3×2 (6 desek)
```
[P][P][P]
[P][P][P]
```

**Drabina ×3** — 3×3 (kolumny patyk/deska)
```
[S][P][S]
[S][P][S]
[S][P][S]
```

**Płot ×3** — 3×2
```
[S][P][S]
[S][P][S]
```

**Furtka ×1** — 3×2
```
[P][S][P]
[P][S][P]
```

**Ulepszenie stołu warsztatowego ×1** — 3×3 (krzyż z pni, deski w rogach)
```
[P][L][P]
[L][L][L]
[P][L][P]
```

### Progresja kilofów

**Kamienny kilof ×1** — 3×3
```
[ST][ST][ST]
[ ][S][ ]
[ ][S][ ]
```

**Żelazny kilof ×1** — 3×3
```
[I][I][I]
[ ][S][ ]
[ ][S][ ]
```

> Kilofy diamentowe i z netherite istnieją jako typy bloków; ich przepisy
> ulepszeń to kolejny poziom tego samego kształtu głowy.

## Logika dopasowania

- **Kształtowe:** `shaped_recipe_matches(grid, recipe)` — wzorzec
  dopasowywany z obsługą offsetu względem siatki.
- **Bezkształtowe:** `shapeless_recipe_matches(grid, recipe)` —
  dopasowanie multizbioru (kolejność nie ma znaczenia).
- `RecipeRegistry::match_grid()` zwraca pierwszy pasujący przepis
  kształtowy, potem wraca do bezkształtowych.
- Wynik to `ItemStack` (`stack_of(block, count)`).

## Stan NVCrafter

`NVCrafterState` jest przechowywany per blok w świecie (`world/mod.rs`)
i trwa w zapisach. Gdy GUI się zamyka, wejścia wracają do inventory gracza
(lub spadają do świata, gdy brak miejsca). Rozbicie NVCrafter wypłukuje
jego zawartość do zrzutów świata.

## Przepisy JSON

`assets.rs` wczytuje i waliduje również przepisy z JSON, z narzędziami do
parsowania przepisów kształtowych/bezkształtowych obok ładowania modeli
bloków.
