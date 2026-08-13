# Rozwój

Jak budować, testować i rozszerzać NV2 Engine.

## Wymagania

- **Toolchain Rust** (stabilny wystarczy dla gry)
- **GPU** z obsługą Vulkan / Metal / DX12 / GL (backendy wgpu)
- Dla narzędzi treści: **.NET 8 SDK** (`Bridge/Tools`) i **Python 3 +
  Pillow** (`generate_textures.py`)

## Build i uruchomienie

```bash
cd Core
cargo run --release        # zoptymalizowany build
cargo run                  # build dev (crate'y zewnętrzne i tak na opt-level 3)
cargo check --release      # szybka kontrola kompilacji
cargo test                 # testy jednostkowe (commands, crafting, AI)
```

## VS Code

`.vscode/tasks.json` ma już skonfigurowane zadanie uruchamiające plik
wykonywalny silnika z workspace. Własną warstwę Vulkan (`VkLayer_NV20.json` /
`VkLayer_NV20.dll`) można dołączyć z konfiguracji uruchomieniowej.

## Testowanie

Testy jednostkowe istnieją w kluczowych modułach:

| Moduł | Testy obejmują |
|---|---|
| `crafting.rs` | Dopasowanie przepisów kształtowych z wyrównaniem offsetu, bezkształtowe dopasowanie multizbioru |
| `commands.rs` | Przepływy wykonywania komend (locate forest/highland) |
| `world/ai_generator.rs` | Poprawność rozkładu prawdopodobieństwa wprzód, spadek lossu treningu |

## Rozszerzanie: dodaj typ bloku

1. Dodaj wariant do enuma `BlockType` (`world/block.rs`).
2. Zarejestruj w `BLOCK_REGISTRY`: `(id, "name", "texture_name")`.
3. Dodaj twardość w matchu `hardness()`.
4. Odwzoruj teksturę w matchu rejestru tekstur.
5. Dodaj nazwę wyświetlaną w `name()`.
6. (Opcjonalnie) Naucz AI stawiać go w `place_ai_vegetation()`.

## Rozszerzanie: dodaj przepis

Kształtowy (w `crafting.rs` `default_recipes()`):

```rust
recipes.register_shaped(ShapedRecipe {
    pattern: vec![Some(BlockType::Planks), Some(BlockType::Planks)],
    output:  stack_of(BlockType::Stick, 4),
    // ...
});
```

Bezkształtowy:

```rust
recipes.register_shapeless(ShapelessRecipe {
    ingredients: vec![/* ... */],
    output:      stack_of(BlockType::FlintPickaxe, 1),
});
```

Przepisy można też wczytywać z JSON przez narzędzia `assets.rs`.

## Rozszerzanie: wyłącz AI (testowanie)

W `vegetation.rs` `populate_world_trees_for_chunk()`:

```rust
pub fn populate_world_trees_for_chunk(...) {
    self.place_trees(world, generator, cx, cz);
    // self.place_ai_vegetation(world, generator, cx, cz);  // zakomentuj
}
```

## Pipeline treści

| Narzędzie | Cel |
|---|---|
| `Bridge/Tools/Slicer` | Krajarka atlasu .NET 8 — skanuje PNG atlasów, wyodrębnia tekstury bloków przez predefiniowane lub analizowane prostokąty kafelków |
| `generate_textures.py` | Transformacje tekstur Pillow — obracanie, odbicia, grayscale, inwersja, przyciemnianie, rozjaśnianie |
| `Assets/Blocks/` | Wykrywanie tekstur w runtime dla dynamicznego atlasu |

## Format zapisu

Światy trwają w `saves/world.json` (obok pliku wykonywalnego):

```json
{
  "seed": "...",
  "chunks": { "...": "spłaszczone dane bloków" },
  "water_meta": "...",
  "crafters": { "...": "NVCrafterState" }
}
```

Ustawienia trwają w `settings.json` (pretty JSON przez serde).

## Migracja / wsteczna kompatybilność

- **Stare światy ładują się dobrze** — AI wpływa tylko na nowo
  wygenerowane chunki.
- **Publiczne API są stabilne** — `ai_system` jest `pub`, ale nieblokujące
  dla istniejących systemów; nowe typy bloków nie kolidują.
