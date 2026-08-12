# 📜 Externum

**A programming language that fuses Python's readability, binary's
performance, and Bash's system control into one unified paradigm.**

> `Externum = Python_readability ⊕ Binary_performance ⊕ Bash_control`

Externum is a from-scratch language implementation (Python 3.10+, stdlib
only) with a full spec in `WIKI.md`. A single source program can target
Python, a native binary, and shell output.

---

## ✨ Unique features

| Feature | Description |
|---|---|
| **Transpilation layer** | One source compiles to Python, native binary, and shell simultaneously |
| **Hybrid type system** | Static types with dynamic fallback |
| **Shell-first integration** | Native shell command embedding (`$ cmd` inside code) |
| **Zero-cost abstractions** | Compiles to optimal target code |
| **No dependencies** | Pure Python standard library — nothing to install |

## 🚀 Quick start

```bash
pip install -e .        # install the compiler CLI
externum --help
```

Run the bundled examples:

```bash
ls examples/
```

## 📚 Learning resources

- [`WIKI.md`](https://github.com/externum/externum/blob/main/WIKI.md) — the
  comprehensive language specification (syntax reference, compiler CLI,
  architecture)
- `tests/` — conformance tests
- `examples/` — runnable sample programs

## 📦 Project layout

```
Externum/
├── externum/       # Compiler + runtime implementation
├── examples/       # Sample programs
├── tests/          # Conformance tests
├── bin/            # CLI entry points
├── setup.py        # pip-installable package
└── WIKI.md         # Full language specification
```

> Note: the reference spec is authored under the `externum/externum` GitHub
> namespace; this working copy is the primary development tree.
