# Kompilator i CLI

## Użycie

```bash
externum <komenda> [opcje]

Komendy:
  run       Wykonaj program .ext
  compile   Skompiluj program .ext (domyślna)
```

## Kompilacja

```bash
externum program.ext                      # --target all (domyślnie)
externum program.ext --target python      # tylko Python
externum program.ext --target bash        # tylko Bash
externum program.ext --target binary      # tylko wariant binarny
externum program.ext -o output.py         # zapisz do pliku
```

### Targety

| Target | Opis |
|---|---|
| `python` | Wykonywalny kod Pythona — instrukcje, funkcje, pętle, `subprocess.run` dla bash |
| `bash` | Wyodrębnione polecenia i bloki powłoki |
| `binary` | Literały binarne (`0b...`) jako ciągi bitów |
| `all` | Wszystkie trzy, sklejone w jeden raport |

## Wykonanie

```bash
externum run program.ext
```

Runtime transpiluje źródło do Pythona i wykonuje je w procesie — bez
pośrednich plików.

## Pozostałe opcje

| Opcja | Opis |
|---|---|
| `--version` | `Externum 2.0.0` |
| `-h, --help` | Pomoc |
| `-o, --output <plik>` | Zapis wyniku do pliku |

## Przykłady

```bash
# Uruchom
externum run examples/hello.ext

# Kompilacja do Pythona
externum examples/hello.ext --target python -o hello.py && python3 hello.py

# Kompilacja wszystkich targetów do pliku
externum examples/calc.ext --target all -o calc.out

# Wersja
externum --version
```

## Kody błędów

| Kod | Znaczenie |
|---|---|
| `1` | Plik nie istnieje / błąd wejścia-wyjścia |
| `1` | Błąd składni (`Syntax Error`) |
| `1` | Błąd wykonania (`Runtime Error`) |
