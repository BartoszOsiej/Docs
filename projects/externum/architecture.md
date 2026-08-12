# Architektura

## Pipeline kompilacji

```
┌─────────────────────────────────────────────────────────┐
│                    Externum Compiler                     │
├─────────────────────────────────────────────────────────┤
│  Source (.ext)  →  Tokens  →  AST  →  Target Code       │
└────────┬───────────────────┬──────────────────┬─────────┘
         │                   │                  │
         ▼                   ▼                  ▼
    ┌─────────┐        ┌──────────┐       ┌──────────┐
    │ Lexer   │  →     │ Parser   │  →    │ Compiler │
    │ lexer.py│        │ parser.py│       │compiler. │
    └─────────┘        └──────────┘       │py        │
                                          └─────┬────┘
                                       ┌────────┼────────┐
                                       ▼        ▼        ▼
                                 ┌────────┐ ┌────────┐ ┌────────┐
                                 │ Python │ │  Bash  │ │ Binary │
                                 └────────┘ └────────┘ └────────┘
```

## Etapy

1. **Lexer** (`lexer.py`) — tokenizacja: wcięcia (INDENT/DEDENT), literały
   (`0b...`, liczby, stringi + f-stringi), operatory, słowa kluczowe,
   bash inline (`` `...` ``) i bloki (`%% ... %%`).
2. **Parser** (`parser.py`) — rekurencyjne zejście z priorytetem
   operatorów: wyrażenia `or` → `and` → porównania → `+ -` → `* / %` →
   `**`, plus `if/elif/else`, `while`, `for ... in`, funkcje z parametrami,
   przypisania i `x += 1`.
3. **Kompilator** (`compiler.py`) — generacja kodu: do `python` (z
   `subprocess.run` dla bash), `bash` (wyodrębnione polecenia) i `binary`
   (literały bitowe).
4. **Runtime** (`runtime/`) — transpilacja do Pythona i wykonanie
   w procesie (`externum run`).

## Struktura projektu

```
Externum/
├── externum/
│   ├── lexer.py          # Tokenizacja
│   ├── parser.py         # AST + wyrażenia
│   ├── compiler.py       # Generacja kodu (python/bash/binary)
│   ├── runtime/          # Runtime — wykonanie .ext
│   │   ├── llm/          # (roadmap) LLM-native
│   │   ├── neural/       # (roadmap) tensory, autodiff
│   │   └── distributed/  # (roadmap) aktory, strumienie
│   └── __main__.py       # CLI (run / compile)
├── examples/             # hello.ext, calc.ext
├── tests/                # 25 testów jednostkowych
├── bin/externum          # Entry point CLI
├── setup.py              # pip install -e .
└── WIKI.md               # Specyfikacja języka (wizja)
```

## Kontrakt API

`externum/__init__.py` eksponuje core (`Lexer`, `Parser`, `Compiler`,
`Runtime`) oraz **zarezerwowane** moduły przyszłości: `llm` (LLMClient,
PromptTemplate, FunctionSchema), `neural` (Tensor, Module, Linear, Conv2d,
Attention, Autograd), `distributed` (Actor, Cluster, Stream, Channel),
`types` (DependentType, RefinementType, EffectType), `spec` (Spec, Theorem,
Proof, Verify) i `debug` (TimeTravelDebugger, HotReloader). Importy są
zabezpieczone — pakiet działa bez tych modułów.

## Roadmapa

- [ ] Moduł `neural` — tensory, autograd, warstwy (kontrakt już w API)
- [ ] Moduł `llm` — integracja z modelami (function calling)
- [ ] Moduł `distributed` — aktory i strumienie między procesami
- [ ] `match`-statementy i klasy
- [ ] Pełny target `binary` (assembler)
