# 📜 Externum

**Externum v2.0 "Sentient"** — własny język programowania, który łączy
czytelność Pythona, wydajność kodu binarnego i kontrolę systemu Basha w
jednym paradygmacie.

> `Externum = Python_readability ⊕ Binary_performance ⊕ Bash_control`

Jedno źródło (`.ext`) kompiluje się **jednocześnie do trzech targetów**:
Python, Bash i reprezentacja binarna — a tryb `run` wykonuje program
wprost.

## ✨ Filozofia

- **Jeden zapis, trzy światy** — kod wygląda jak Python, operuje na
  liczbach binarnych jak assembler i wykonuje polecenia powłoki jak skrypt.
- **Zero zależności** — czysty standardowy Python (3.10+), bez jednej
  biblioteki zewnętrznej.
- **Transpilacja zamiast interpretacji** — kompilator produkuje czytelny,
  wykonywalny kod docelowy; runtime to cienka warstwa nad tym kodem.

## ✨ Funkcje (działające, pokryte testami)

| Funkcja | Opis |
|---|---|
| **3 targety** | `python`, `bash`, `binary` (lub `all`) z jednego źródła |
| **Tryb wykonania** | `externum run program.ext` — natychmiastowe uruchomienie |
| **Liczby binarne** | literały `0b1010`, operacje `&`-style, wariant binarny w target `binary` |
| **Wyrażenia z priorytetem** | `**`, `* / %`, `+ -`, porównania `== != < > <= >=`, logika `and or not` |
| **Pełny przepływ sterowania** | `if / elif / else`, `while`, `for ... in`, `break`, `continue` |
| **Funkcje** | parametry (adnotacje typów opcjonalne), `return`, rekurencja |
| **Hybrydowa składnia przypisań** | `x = ...` oraz `x += 1` |
| **Shell-first** | bash inline `` `ls -la` `` i bloki `%% ... %%` |
| **f-stringi** | `` print(f"value: {x}") `` |

## 🚀 Szybki start

```bash
git clone https://github.com/externum/externum.git
cd externum
pip install -e .            # Python 3.10+

externum --version          # Externum 2.0.0

# Uruchom program
externum run examples/hello.ext

# Skompiluj do wszystkich targetów
externum examples/hello.ext
```

## 🗺️ Dokumentacja

- [Składnia](/projects/externum/syntax) — pełny przewodnik po języku
- [Przykłady](/projects/externum/examples) — działające programy z wyjściem
- [Kompilator i CLI](/projects/externum/compiler) — targety i opcje
- [Architektura](/projects/externum/architecture) — pipeline i roadmapa
