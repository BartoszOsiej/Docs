# 🇵🇱 PolishAI

**A self-developing transformer that speaks Polish — with dynamic qint8
quantization and AVX2 acceleration.**

PolishAI is a research project for Polish-language AI that runs on modest
hardware: a transformer model with dynamic int8 quantization, AVX2-optimized
inference, and a training loop that improves from dialogue.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Self-developing transformer** | Continually retrains from conversation |
| **Dynamic quantization** | `qint8` weights keep the model small and fast |
| **AVX2 support** | SIMD-accelerated inference on modern x86 CPUs |
| **Dialogue learning** | Improves from user interaction |
| **Lightweight runtime** | `torch` + `numpy` only |

## 🚀 Quick start

```bash
pip install torch numpy
python main.py
```

## 📦 Project layout

```
polish_ai/
├── main.py           # Entry point (training + inference)
├── model/            # Model definitions + quantization
├── training/         # Training loop
├── AI/               # Data / checkpoints
├── data/             # Training data
├── outputs/          # Generated outputs
└── requirements.txt
```

## 🧠 Status

An experimental research project — useful as a reference for compact,
CPU-friendly Polish NLP and as a foundation for quantized transformer work.
