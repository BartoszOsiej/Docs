# Architektura

## Pipeline

```
source (.ext) → Lexer → tokens → Parser → AST → Compiler → python/bash/binary
                                                  ↘ Runtime (exec) / REPL
                                                     ↘ .ext module loader
```

## Etapy

1. **Lexer** (`lexer.py`) — tokenizacja: INDENT/DEDENT **świadoma nawiasów**
   (wcięcia wewnątrz `()[]{}` są ignorowane, puste linie nie łamią bloków),
   literały `0b`/`0x`, stringi + f-stringi + triple-quoted, pełny zestaw
   operatorów, bash inline (`` `...` ``) i bloki (`%% ... %%`).
2. **Parser** (`parser.py`) — rekurencyjne zejście z priorytetem operatorów
   (zgodnym z Pythonem), unarne operatory, ternary, lambdy, literały
   (listy/słowniki/krotki/zbiory — także wielolinijkowe), indeksowanie i
   slice'y, dostęp do atrybutów, wywołania z kwargs/`*args`/`**args`,
   comprehensions, rozpakowywanie krotek oraz pełna gramatyka instrukcji:
   funkcje, klasy z dziedziczeniem, `if/elif/else`, `while`, `for-in`,
   `try/except/else/finally`, `with`, `import`, `raise`, `assert`, `del`,
   `yield`, `global`, `nonlocal`.
3. **Kompilator** (`compiler.py`) — generacja kodu: do `python` (z
   `subprocess.run` dla bash), `bash` (wyodrębnione polecenia) i `binary`
   (literały bitowe).
4. **Runtime** (`runtime/`) — wykonanie w procesie przez `exec` wygenerowanego
   Pythona; **meta-path finder** kompiluje moduły `.ext` przy `import`;
   REPL z wykrywaniem kompletności bloków.

## System modułów

`externum/runtime/__init__.py` rejestruje `_ExtFinder` w `sys.meta_path`.
`import mod` znajduje `mod.ext` (lub `pkg.mod.ext`) w ścieżce wyszukiwania,
kompiluje do Pythona i ładuje jako moduł — biblioteka standardowa w `lib/`
jest napisana w samym Externum.

## Struktura projektu

```
Externum/
├── externum/
│   ├── lexer.py          # Tokenizacja
│   ├── parser.py         # Pełna gramatyka → AST
│   ├── compiler.py       # Codegen (python/bash/binary)
│   ├── runtime/          # Runtime, import .ext, REPL
│   │   ├── llm/          # (roadmap)
│   │   ├── neural/       # (roadmap)
│   │   └── distributed/  # (roadmap)
│   └── __main__.py       # CLI (run / repl / compile)
├── lib/                  # Biblioteka standardowa (.ext)
│   ├── structs.ext       # Stack, Queue, Counter
│   ├── strings.ext       # reverse, slugify, is_palindrome, ...
│   ├── mathx.ext         # gcd, factorial, fib, ...
│   └── fs.ext            # read_file, write_file, ...
├── examples/             # hello.ext, calc.ext, pokedex.ext
├── tests/                # 118 testów jednostkowych
├── bin/externum          # Entry point CLI
├── setup.py              # pip install -e .
└── WIKI.md               # Specyfikacja języka
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

- [x] Pełny język: klasy, wyjątki, moduły, lambdy, comprehensions, generatory
- [x] REPL, system modułów, biblioteka standardowa, 118 testów
- [ ] Moduł `neural` — tensory, autograd, warstwy (kontrakt w API)
- [ ] Moduł `llm` — integracja z modelami (function calling)
- [ ] Moduł `distributed` — aktory i strumienie między procesami
- [ ] Pełny target `binary` (assembler)
