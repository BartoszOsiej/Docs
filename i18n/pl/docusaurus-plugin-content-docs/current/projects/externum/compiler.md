# Kompilator i CLI

## Komendy

```bash
externum run <plik.ext> [args...]   # wykonaj program
externum repl                       # interaktywna powłoka
externum compile <plik.ext>         # skompiluj (domyślna komenda)
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
| `python` | Wykonywalny kod Pythona — instrukcje, klasy, funkcje, `subprocess.run` dla bash |
| `bash` | Wyodrębnione polecenia i bloki powłoki |
| `binary` | Literały binarne (`0b...`) jako ciągi bitów |
| `all` | Wszystkie trzy, sklejone w jeden raport |

## Wykonanie

```bash
externum run program.ext arg1 arg2
```

Runtime transpiluje źródło do Pythona i wykonuje je w procesie. Argumenty
trafiają do `sys.argv` programu (`argv[0]` = ścieżka skryptu).

## REPL

```bash
externum repl
```

- Interaktywna powłoka z auto-printem wyników wyrażeń
- Wielolinijkowe bloki (po `:` kontynuujesz, pusta linia kończy)
- Dostępne `import` i cała biblioteka standardowa
- Wyjście: `exit()` lub `Ctrl+D`

## Pozostałe opcje

| Opcja | Opis |
|---|---|
| `--version` | `Externum 3.0.0` |
| `-h, --help` | Pomoc |
| `-o, --output &lt;plik&gt;` | Zapis wyniku do pliku |

## Ścieżka wyszukiwania modułów

`import module` szuka `module.ext` kolejno w:

1. katalogu skryptu,
2. bieżącym katalogu,
3. `lib/` repozytorium Externum,
4. ścieżkach z `EXTERNUM_PATH` (rozdzielonych `:`).

## Kody błędów

| Kod | Znaczenie |
|---|---|
| `1` | Plik nie istnieje / błąd wejścia-wyjścia |
| `1` | Błąd składni (`Syntax Error`) |
| `1` | Błąd wykonania (`Runtime Error`) |
