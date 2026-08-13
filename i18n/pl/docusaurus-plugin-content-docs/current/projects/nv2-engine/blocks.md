# Bloki i biomy

Kompletny rejestr bloków i model biomów, wyodrębniony z `world/block.rs`
i `world/biomes.rs`.

## Rejestr bloków (97 typów)

ID bloków to wartości `u8` w enumie `BlockType`; `BLOCK_REGISTRY` mapuje
numeryczne ID na nazwy i tekstury.

### Teren i powierzchnie (0–8)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 0 | Powietrze | 5 | Żwir |
| 1 | Trawa | 6 | Śnieg |
| 2 | Ziemia | 7 | Bruk |
| 3 | Kamień | 8 | Bedrock |
| 4 | Piasek | | |

### Ciecze i formacje naturalne (9–24)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 9 | Woda | 17 | Ruda Redstone |
| 10 | Pień drzewa | 18 | Skała łupkowa |
| 11 | Liście drzewa | 19 | Ruda węgla w łupku |
| 12 | Ruda węgla | 20 | Ruda diamentu w łupku |
| 13 | Ruda żelaza | 21 | Tuff |
| 14 | Ruda złota | 22 | Skała żarowa |
| 15 | Ruda diamentu | 23 | Skała świecąca |
| 16 | Ruda szmaragdu | 24 | Obsydian |

### Bloki budowlane (25–44)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 25 | Cegły kamienne | 35 | Ubite błoto |
| 26 | Andezyt | 36 | Zakorzeniona gleba |
| 27 | Krzew | 37 | Szorstka gleba |
| 28 | Wysoka trawa | 38 | Leśne dno |
| 29 | Kwiat | 39 | Kwitnące dno |
| 30 | Uschnięty krzew | 40 | Sieć korzeni |
| 31 | Kaktus | 41 | Drewno iglaste |
| 32 | Glina | 42 | Ciepłe drewno |
| 33 | Mata mchu | 43 | Mokre drewno |
| 34 | Błoto | 44 | Blade drewno |

### Korony (45–51)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 45 | Korona iglasta | 49 | Korona kwitnąca |
| 46 | Ciepła korona | 50 | Ciemne drewno |
| 47 | Mokra korona | 51 | Ciemna korona |
| 48 | Blada korona | | |

### Przedmioty i narzędzia (52–74)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 52 | Sadzonka | 64 | Drewniany kilof |
| 53 | Patyk | 65 | Drewniana siekiera |
| 54 | Krzemień | 66 | Drewniana łopata |
| 55 | Krzemienny kilof | 67 | Drewniana motyka |
| 56 | Kamienny kilof | 68 | Pochodnia |
| 57 | Żelazny kilof | 69 | Drzwi |
| 58 | Diamentowy kilof | 70 | Zapadnia |
| 59 | Kilof z netherite | 71 | Drabina |
| 60 | Deski | 72 | Płot |
| 61 | Sztabka żelaza | 73 | Furtka |
| 62 | Skrzynia | 74 | Ulepszenie stołu warsztatowego |
| 63 | NVCrafter | | |

### Kwiaty — klasa wyjściowa AI 0 (75–83)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 75 | Róża | 80 | Tulipan (pomarańczowy) |
| 76 | Mlecz | 81 | Chaber |
| 77 | Tulipan (czerwony) | 82 | Czosnek |
| 78 | Tulipan (różowy) | 83 | Kwiat azalii |
| 79 | Tulipan (biały) | | |

### Paprocie i rośliny wodne — klasa wyjściowa AI 1 (84–89)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 84 | Grzybienie | 87 | Trawa morska |
| 85 | Paproć | 88 | Wysoka trawa morska |
| 86 | Roślina paprociowa | 89 | Kelp |

### Patyki, kamyki i dekoracje — klasy wyjściowe AI 2–3 (90–96)
| ID | Blok | ID | Blok |
|---|---|---|---|
| 90 | Mały patyk | 94 | Porośnięty mchem bruk |
| 91 | Kamyk 1 | 95 | Winorośl |
| 92 | Kamyk 2 | 96 | Dywan mchu |
| 93 | Kamyk 3 | | |

> **Uwaga:** klasy wyjściowe AI opisują kategorie decyzyjne sieci
> neuronowej (kwiaty / paprocie i rośliny wodne / patyki / kamyki). Zakresy
> ID w tabelach są tylko poglądowe.

## Poziomy narzędzi

```rust
pub enum ToolTier { Hand = 1, Flint = 2, Stone = 3, Iron = 4, Diamond = 5, Netherite = 6 }
```

| Poziom | Moc | | Poziom | Moc |
|---|---|---|---|---|
| Ręka | 1 | | Żelazo | 5 |
| Krzemień | 2 | | Diament | 7 |
| Kamień | 3 | | Netherite | 8 |

`ToolStats` niesie poziom, `speed_multiplier` i `max_durability`.

## Ośrodki ruchu

Metadane `MovementMedium` pozwalają silnikowi stosować modyfikatory fizyki
per ośrodek:

```rust
MovementMedium::FOLIAGE {
    movement_speed_multiplier: 0.55,
    sprint_speed_multiplier:  0.65,
    fall_speed_multiplier:    0.35,
    sound_dampening:          0.6,
}
```

Kamera śledzi `in_foliage_medium` i `footstep_volume` w runtime dla tych
hooków (konsumpcja audio to przyszła funkcja).

---

# Biomy

Dziewięć biomów sterowanych klimatem. Poziom morza to `46`. Wszystkie
wartości są dokładne z `world/biomes.rs`.

| Biom | Temp | Wilgot. | Gęst. drzew | Gęst. trawy | Blok powierzchni | Odcień roślinności |
|---|---|---|---|---|---|---|
| Ocean | 0.48 | 0.88 | 0.00 | 0.00 | Piasek | `[0.58, 0.82, 0.74]` |
| Wybrzeże | 0.62 | 0.54 | 0.02 | 0.10 | Piasek | `[0.78, 0.82, 0.48]` |
| Równiny | 0.58 | 0.46 | 0.05 | 0.72 | Trawa | `[0.72, 0.92, 0.54]` |
| Las | 0.54 | 0.62 | 0.46 | 0.46 | Trawa | `[0.50, 0.86, 0.42]` |
| Ciemny Las | 0.50 | 0.74 | 0.74 | 0.18 | Leśne dno | `[0.38, 0.72, 0.34]` |
| Bagno | 0.66 | 0.90 | 0.28 | 0.26 | Błoto | — |
| Tajga | 0.24 | 0.52 | 0.58 | 0.18 | Trawa | — |
| Pustynia | 0.92 | 0.10 | 0.00 | 0.00 | Piasek | — |
| Góry | 0.28 | 0.34 | 0.12 | 0.10 | Trawa | — |

### Obserwacje o biomach

- **Pustynia** to najgorętszy (0.92) i najsuchszy (0.10) biom — bez drzew, bez trawy.
- **Bagno** jest najbardziej wilgotne (0.90) z powierzchnią **Błoto**.
- **Tajga** i **Góry** są najzimniejsze (0.24 / 0.28); tajga ma największą
  gęstość drzew po ciemnym lesie (0.58).
- **Ciemny Las** ma największą gęstość drzew ogółem (0.74) na powierzchni
  Leśne dno.

## Rodzaje drzew

```rust
pub enum TreeKind { Oak, Birch, Pine, DarkOak, DeadTree }
```

Biomy wybierają typy drzew ze stałych (np. `PLAINS_TREES`,
`FOREST_TREES`, `DARK_FOREST_TREES`, `NO_TREES`).

## Kanały generacji

Teren łączy wiele kanałów OpenSimplex2, każdy z dedykowanym seed'em:

| Kanał | Steruje |
|---|---|
| Kształt kontynentu | Rozmieszczeniem biomów |
| Temperatura | Klimatem |
| Wilgotność | Klimatem |
| Erozja | Rzeźbą |
| Szczyty / rzeźba | Kształtami gór |
| Wysokość / szczegóły | Wysokością terenu |
| Warp | Zmiennością powierzchni |
| Jaskinie | Drążeniem jaskiń |
| Rudy | Rozmieszczeniem rud |
| Woda | Próbkowaniem kolumn świadomym wody |

Generator udostępnia **dane klimatu** rendererowi: kolor otoczenia, kolor
mgły, gęstość mgły, gradację sceny, odcień roślinności, ciepło, wilgoć
i bujność.
