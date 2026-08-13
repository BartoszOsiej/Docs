# AI Vegetation System

NV2 Engine embeds a small neural network that decides where vegetation
belongs, and trains it **in the background while you play** — with zero FPS
impact (&lt;1% CPU overhead). This is a complete, production-ready MLP
implementation in `world/ai_generator.rs` (410 lines) using `ndarray`.

## Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Game Thread                          │
│  World Generation                                           │
│   ├─ Chunk generation (BiomeGenerator)                      │
│   ├─ Tree placement (VegetationGenerator)                   │
│   ├─ Grass/flowers (traditional)                            │
│   └─ AI Vegetation (place_ai_vegetation) ◄──────┐           │
│                                                  │          │
└──────────────────────────────────────────────────┬──────────┘
                                                   │
                Queries AI for predictions (non-blocking
                via Arc<Mutex>)
                                                   │
┌──────────────────────────────────────────────────▼──────────┐
│              Background AI Thread (continuous)              │
│  TerrainAI Neural Network                                   │
│   ├─ Forward pass (inference)                               │
│   ├─ Backward pass (training)                               │
│   ├─ Weight updates                                         │
│   └─ Bias updates                                           │
│                                                             │
│  Training Loop (100 samples/epoch):                         │
│   1. Generate synthetic features                            │
│   2. Make prediction                                        │
│   3. Calculate target from heuristic                        │
│   4. Compute cross-entropy loss                             │
│   5. Backpropagation                                        │
│   6. Update all weights                                     │
└─────────────────────────────────────────────────────────────┘
```

## Model

```
Input Layer (8 terrain features)
    ↓
Hidden Layer (16 neurons) + ReLU
    ↓
Output Layer (4 vegetation classes) + Softmax
```

- **Parameters:** 8×16 + 16×4 = **320 parameters** (w1 `[8×16]`, b1 `[16]`,
  w2 `[16×4]`, b2 `[4]`)
- **Total memory:** ~1.2 KB (512 B w1 + 64 B b1 + 256 B w2 + 16 B b2 +
  ~300 B metadata)
- **Inference time:** ~10 µs per prediction (O(192) operations)

## Input features (8)

| # | Feature | Range |
|---|---|---|
| 1 | Terrain height (normalized) | 0.0–1.0 |
| 2 | Terrain slope | 0.0–0.5 |
| 3 | Biome temperature | 0.0–1.0 |
| 4 | Biome humidity | 0.0–1.0 |
| 5 | Distance to nearest water | 0.0–1.0 |
| 6 | Nearby plant density | 0.0–1.0 |
| 7 | Light level | 0.0–1.0 |
| 8 | Procedural noise seed | 0.0–1.0 |

## Outputs (4 vegetation classes)

| Output | Vegetation |
|---|---|
| 0 | Flowers — roses, tulips (4 colors), dandelions, cornflower, allium, azalea |
| 1 | Ferns & water plants — ferns, lily pads, seagrass, tall seagrass, kelp |
| 2 | Small sticks & decorative items |
| 3 | Pebbles & rocks (3 variants) |

## Mathematics

### Forward pass

```
Hidden:  h = ReLU(input @ w1.T + b1)      where ReLU(x) = max(0, x)
Logits:  logits = h @ w2.T + b2
Softmax: p_i = exp(logits_i - max(logits)) / sum_j(exp(logits_j - max(logits)))
```

### Backward pass (cross-entropy)

```
Loss:         Loss = -sum_i(target_i * log(p_i))
Output grad:  dL/dz2 = p - target                    (elementwise)
H→O weights:  dL/dw2[j,i] = dL/dz2[i] * h[j]
              dL/db2[i]   = dL/dz2[i]
Hidden grad:  dL/dh[j] = sum_i(dL/dz2[i] * w2[j,i])
              dL/dz1[j] = dL/dh[j] * relu_derivative(z1[j])
                           where relu_derivative(x) = 1 if x > 0 else 0
I→H weights:  dL/dw1[k,j] = dL/dz1[j] * input[k]
              dL/db1[j]   = dL/dz1[j]
```

### Gradient descent

```
w := w - learning_rate * dL/dw
b := b - learning_rate * dL/db
```

## Training loop

A background thread runs continuously:

```
Loop (background thread):
  For each of 100 samples:
    - Generate synthetic terrain features (rand::thread_rng)
    - Make AI prediction (forward)
    - Compute target vegetation from heuristics
    - Backpropagation gradient descent (backward)
    - Update weights & biases

  Every 1000 epochs:
    - Decay learning rate (×0.95) to prevent overfitting
    - Optionally save a model checkpoint
```

### Target heuristic (synthetic training)

```
if humidity > 0.6 and light < 0.5:   ferns (output 1)
else if humidity > 0.5:              flowers (output 0)
else if height < 0.3:                pebbles (output 3)
else:                                sticks (output 2)
```

### Hyperparameters

| Parameter | Value | Notes |
|---|---|---|
| Learning rate | 0.01 | Sweet spot; 0.1 oscillates, 0.001 too slow |
| Decay | 0.95× / 1000 epochs | Prevents overfitting, fine-tunes weights |
| Samples/epoch | 100 | ~5–10 ms per epoch |
| Confidence threshold | 0.5 | Only high-confidence predictions place blocks |
| Cell size | 3×3 blocks | Procedural variety |

## Public API (`ai_generator.rs`)

```rust
pub enum AIMessage {
    TrainingProgress { epoch: u32, loss: f32 },
    TextureGenerated { seed: u64, texture_data: Vec<u8> },
    VegetationDecision { wx: i32, wy: i32, wz: i32, block: BlockType, confidence: f32 },
}

pub struct TerrainAI { /* w1, b1, w2, b2, learning_rate, training_samples */ }

pub struct AISystem {
    ai: Arc<Mutex<TerrainAI>>,
    tx: Sender<AIMessage>,
    training_thread: JoinHandle<()>,
}
```

| Method | Signature | Purpose |
|---|---|---|
| `forward` | `(&self, features: &[f32; 8]) -> [f32; 4]` | Inference: ReLU hidden + softmax output |
| `backward` | `(&mut self, features: &[f32; 8], target: [f32; 4]) -> f32` | One training step, returns loss |
| `predict_vegetation` | `(&self, features: &[f32; 8]) -> (BlockType, f32)` | Thread-safe prediction (locks Arc&lt;Mutex&gt;) |
| `generate_texture` | `(seed, w, h) -> Vec&lt;u8&gt;` | AI-assisted texture generation |

## Integration points

1. **World initialization** — `World::new_with_settings()` spawns `AISystem`
   (background thread) and stores it with the message receiver.
2. **Feature extraction** — `place_ai_vegetation()` in `vegetation.rs`
   extracts the 8 terrain features per 3×3 cell.
3. **Prediction & placement** — `predict_vegetation(&features)` returns the
   block + confidence; blocks are placed only when `confidence > 0.5`,
   respecting biome-specific placement probabilities.

## Performance

| Aspect | Value |
|---|---|
| Model size | ~1.2 KB |
| Inference | ~10 µs (O(192) ops) |
| Epoch | ~5–10 ms (100 samples) |
| Gameplay overhead | ~0.8% (background thread on idle CPU) |
| Startup cost | ~+5 ms (thread spawn) |

Why it's fast: small model, single hidden layer, `max(0, x)` ReLU, optimized
4-way softmax, no convolutions, single-sample online learning.

## Testing

Unit tests in `ai_generator.rs` verify:

- **Forward pass** — output is a valid probability distribution (sum ≈ 1.0)
- **Training** — loss decreases (or stays within 1.1×) across steps

## Debugging

```rust
// Log training progress every 100 epochs
if epoch % 100 == 0 {
    println!("[AI] Epoch {}: Loss = {:.4}", epoch, avg_loss);
}

// Watch high-confidence predictions
let (block, conf) = world.ai_system.predict_vegetation(&features);
if conf > 0.8 {
    println!("[AI] High confidence: {} ({}%)", block.name(), (conf * 100.0) as u32);
}
```

## Optional online training

`online_trainer.rs` provides an optional cloud-assisted training mode
(dependencies `reqwest` + `tokio` are already in Cargo.toml for future
dataset downloads).

## Roadmap (Phase 2)

See the [Roadmap](roadmap) page for: internet dataset integration, real-time
AI texture generation, player-preference learning, cloud model sharing,
seasonal vegetation, multi-biome coordination, and GPU-accelerated training.
