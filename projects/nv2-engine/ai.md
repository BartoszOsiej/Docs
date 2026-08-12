# AI Vegetation System

NV2 Engine embeds a small neural network that decides where vegetation
belongs, and trains it **in the background while you play** — with zero FPS
impact (<1% overhead).

## Model

A lightweight Multi-Layer Perceptron:

```
Input Layer (8 terrain features)
    ↓
Hidden Layer (16 neurons) + ReLU
    ↓
Output Layer (4 vegetation classes) + Softmax
```

The whole model is ~1.2 KB, running in-engine with no external AI runtime.

## Input features

| # | Feature | Range |
|---|---|---|
| 1 | Terrain height (normalized elevation) | 0.0–1.0 |
| 2 | Terrain slope steepness | 0.0–0.5 |
| 3 | Biome temperature | 0.0–1.0 |
| 4 | Biome humidity | 0.0–1.0 |
| 5 | Distance to nearest water | 0.0–1.0 |
| 6 | Nearby plant density | 0.0–1.0 |
| 7 | Light level | 0.0–1.0 |
| 8 | Procedural noise seed | 0.0–1.0 |

## Outputs (vegetation classes)

| Output | Vegetation |
|---|---|
| 0 | Flowers — roses, tulips (4 colors), dandelions, cornflower, allium, azalea |
| 1 | Ferns & water plants — ferns, lily pads, seagrass, tall seagrass, kelp |
| 2 | Small sticks & decorative items |
| 3 | Pebbles & rocks (3 variants) |

22 new vegetation block types in total, plus moss carpet and vines.

## Training loop

A background thread runs continuously during gameplay:

```
Loop (background thread):
  For each of 100 synthetic samples:
    - Generate synthetic terrain features
    - Make AI prediction
    - Compute target vegetation from heuristics
    - Backpropagation gradient descent
    - Update weights & biases

  Every 1000 epochs:
    - Decay learning rate (0.95x) to prevent overfitting
    - Optionally save a model checkpoint
```

- **~5–10 ms per epoch**, 100 samples/epoch, cross-entropy loss
- Adaptive learning-rate decay; training is asynchronous and non-blocking

## Integration with world generation

- The AI system is initialized in `World::new()` together with its background
  thread.
- `VegetationGenerator::place_ai_vegetation()` consults the network for each
  terrain cell.
- Cells are 3×3 blocks for procedural variety.
- A confidence threshold of **0.5** — only high-confidence predictions place
  vegetation.

## Optional online training

`online_trainer.rs` provides an optional cloud-assisted training mode that
can refine the model further beyond the in-game background loop.

## Roadmap (Phase 2)

Planned next steps for the AI system include model persistence across
sessions, GPU-accelerated training, and a modding API exposing the network.
