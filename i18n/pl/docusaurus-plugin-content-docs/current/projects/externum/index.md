# 📜 Externum

<a class="tests-cta" href="./testy">🧪 Zobacz animowane wyniki testów — 120/120 →</a>

**Externum v3.0 "Sentient"** — własny, w pełni funkcjonalny język
programowania, który łączy czytelność Pythona, wydajność kodu binarnego i
kontrolę systemu Basha w jednym paradygmacie.

> `Externum = Python_readability ⊕ Binary_performance ⊕ Bash_control`

Jedno źródło (`.ext`) kompiluje się **jednocześnie do trzech targetów**:
Python, Bash i reprezentacja binarna — a tryb `run` wykonuje program
wprost. Dostępny jest też **REPL**, **system modułów** z własną
**biblioteką standardową** napisaną w Externum.

## ✨ Co potrafi

| Obszar | Wsparcie |
|---|---|
| **Typy danych** | listy, słowniki, krotki, zbiory (w tym wielolinijkowe), f-stringi, `0b`/`0x` |
| **Przepływ** | `if/elif/else`, `while`, `for ... in` (wielozmienne), `break/continue`, `try/except/else/finally`, `with`, `assert` |
| **Funkcje** | domyślne parametry, `*args`/`**kwargs`, rekurencja, **lambdy**, domknięcia, **generatory** (`yield`) |
| **OOP** | klasy, **dziedziczenie**, metody, `self` |
| **Moduły** | `import`, własne moduły `.ext`, biblioteka standardowa |
| **Wyrażenia** | pełny priorytet operatorów, bitowe `& \| ^ ~ << >>`, **ternary**, **comprehensions** |
| **Shell** | bash inline `` `cmd` `` i bloki `%% ... %%` |
| **Narzędzia** | REPL, 3 targety kompilacji, `argv` |

## 🚀 Szybki start

```bash
git clone https://github.com/BartoszOsiej/externum.git
cd Externum
pip install -e .            # Python 3.10+

externum --version          # Externum 3.0.0

# Uruchom program
externum run examples/pokedex.ext

# Interaktywna powłoka
externum repl
```

## 🕹️ Wypróbuj na żywo

Poniższy playground wykonuje Externum **w całości w Twojej przeglądarce** —
transpilator (napisany w Pythonie) działa przez WebAssembly (Pyodide),
bez żadnego serwera. Kliknij **▶ Run** i patrz, jak program się wykonuje:

<ExternumPlayground />

## 📚 Standardowa biblioteka (w Externum)

| Moduł | Zawartość |
|---|---|
| `structs` | `Stack`, `Queue`, `Counter` |
| `strings` | `reverse`, `is_palindrome`, `slugify`, `word_count`, `capitalize`, `truncate` |
| `mathx` | `clamp`, `is_even`, `gcd`, `fib`, `factorial`, `sum_of_digits` |
| `fs` | `read_file`, `write_file`, `append_file`, `file_exists`, `list_dir` |

## 🗺️ Dokumentacja

- [Składnia](/projects/externum/syntax) — pełny przewodnik po języku
- [Przykłady](/projects/externum/examples) — działające programy z wyjściem
- [Kompilator i CLI](/projects/externum/compiler) — targety i opcje
- [Architektura](/projects/externum/architecture) — pipeline, moduły, roadmapa
