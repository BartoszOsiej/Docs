# 🎬 Video MoE

**A lightweight Mixture-of-Experts transformer (~60M params) for video
generation on resource-constrained hardware.**

Video MoE is optimized for environments where GPUs are unavailable or
expensive: compact architecture, PyTorch quantization, fast CPU inference,
and memory-efficient training.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Lightweight architecture** | ~60M parameters — trainable on a laptop |
| **Mixture-of-Experts** | Sparse expert routing keeps FLOPs low per token |
| **PyTorch quantization** | Int8 inference without quality collapse |
| **Fast CPU inference** | No GPU required |
| **Memory-efficient training** | Gradient checkpointing-friendly design |

## 🚀 Quick start

```bash
pip install -r requirements.txt
python main.py               # training entry point
python inference/           # generation / evaluation scripts
```

## 📦 Project layout

```
video-moe/
├── main.py           # Training entry point
├── model/            # MoE transformer definition
├── training/         # Training loop + configs
├── inference/        # Generation / evaluation
├── configs/          # Experiment configurations
├── self_ai.py        # Self-play / self-improvement experiment
├── tests/            # Unit tests
└── requirements.txt
```

## 🧠 Status

Research-stage project — a practical starting point for video generation and
sparse-transformers on constrained hardware.
