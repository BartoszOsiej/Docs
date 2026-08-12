# Syntax Reference

Składnia Externum jest oparta na wcięciach (jak Python). Program to ciąg
instrukcji; komentarze zaczynają się od `#`.

## Zmienne i typy

```python
name = "Externum"        # string
count = 42               # int
ratio = 3.14             # float
flag = True              # bool (True / False / None)

# Literały binarne (prefix 0b)
mask = 0b1010            # = 10
header = 0b11110000
```

Typowanie jest dynamiczne (jak w Pythonie); deklaracje typów w
parametrach funkcji są opcjonalne i ignorowane przez kompilator.

## Operatory

| Kategoria | Operatory |
|---|---|
| Arytmetyka | `+` `-` `*` `/` `%` `**` |
| Porównania | `==` `!=` `<` `>` `<=` `>=` |
| Logiczne | `and` `or` `not` (działają też `&&` `||`) |
| Przypisania | `=` `+=` `-=` `*=` `/=` |

Priorytet jest standardowy: `**` > `* / %` > `+ -` > porównania >
`and` > `or`. Nawiasy `( )` działają normalnie.

```python
x = 10 + 5 * 2            # 20
y = (10 + 5) * 2          # 30
z = 2 ** 8                # 256
ok = x > 5 and y < 100    # True
```

## Instrukcje warunkowe

```python
if x > 100:
    print("large")
elif x > 0:
    print("small positive")
else:
    print("non-positive")
```

## Pętle

```python
# while
i = 0
while i < 10:
    print(i)
    i += 1

# for ... in
for i in range(3):
    print(i)

# break / continue działają standardowo
```

## Funkcje

```python
def add(a, b):
    return a + b

# Adnotacje typów są opcjonalne i usuwane przy kompilacji:
def factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))       # 120
```

## Wywołania wbudowane

Dostępne jak w Pythonie: `print`, `input`, `len`, `str`, `int`, `float`,
`bool`, `list`, `dict`, `range`, `open`, `type`, `sum`, `min`, `max`.

```python
a = int(input("a: "))     # konwersja wejścia
b = len("Externum")       # 8
```

## Stringi i f-stringi

```python
msg = "Hello, " + "world!"
print(f"value: {msg}")
```

## Integracja z Bashi

### Bash inline (backticks)

Wykonuje polecenie i (przy kompilacji) trafia też do targetu `bash`:

```python
output = `ls -la | grep ".py"`
print(output)
```

### Bloki bash (`%% ... %%`)

Wielolinijkowe fragmenty powłoki:

```python
%%
#!/bin/bash
for file in *.py; do
    echo "Processing $file"
done
%%
```

## Ograniczenia (aktualna wersja)

- Brak klas i `match`-statementów (na roadmapie).
- Binarne wyjście `--target binary` gromadzi literały binarne
  (`0b...`) — nie jest jeszcze pełnym assemblerem.
