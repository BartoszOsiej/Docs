# Referencja składni

Składnia Externum jest oparta na wcięciach (jak Python). Program to ciąg
instrukcji; komentarze zaczynają się od `#`. Puste linie i linie z
komentarzami nie wpływają na wcięcia; wcięcia wewnątrz nawiasów są
ignorowane (jak w Pythonie).

## Typy i literały

```python
name = "Externum"        # string
count = 42               # int
ratio = 3.14             # float
flag = True              # bool (True / False / None)

mask = 0b1010            # binarny (= 10)
header = 0xFF            # hex (= 255)

s = """wielolinijkowy
string"""

data = [1, 2, 3]                     # lista
d = {"a": 1, "b": 2}                 # słownik
t = (1, 2)                           # krotka
st = {1, 2, 3}                       # zbiór
matrix = [                           # wielolinijkowe literały działają
    [1, 2],
    [3, 4],
]
```

## Przypisania

```python
x = 42
x += 1
x *= 2
a, b = 1, 2              # rozpakowywanie krotek
d["k"] = "v"             # przypisanie przez indeks
obj.attr = 5             # przypisanie atrybutu
```

## Operatory

| Kategoria | Operatory |
|---|---|
| Arytmetyka | `+ - * / % // **` |
| Porównania | `== != < > <= >=` oraz `is`, `in` |
| Logiczne | `and or not` (działają też `&& ||`) |
| Bitowe | `& \| ^ ~ << >>` |
| Przypisania | `= += -= *= /= //= **= &= \|= ^= <<= >>=` |
| Inne | ternary `a if cond else b` |

Priorytet zgodny z Pythonem. Porównania łańcuchowe działają:
`0 < x < 10`.

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
i = 0
while i < 10:
    print(i)
    i += 1

for i in range(3):
    print(i)

for i, v in enumerate(["a", "b"]):   # wiele zmiennych
    print(i, v)
```

## Funkcje

```python
def add(a, b):
    return a + b

def greet(name, greeting="hi", *args, **kwargs):
    print(greeting, name)

def factorial(n: Int) -> Int:        # adnotacje typów są opcjonalne
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# lambdy
square = lambda x: x * x

# domknięcia
def make_adder(n):
    def adder(x):
        return x + n
    return adder

# generatory
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```

## Klasy

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print("... from " + self.name)

class Dog(Animal):                   # dziedziczenie
    def speak(self):
        print("woof " + self.name)
```

## Wyjątki

```python
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print("caught", e)
except:
    print("other")
else:
    print("no error")
finally:
    print("done")

raise ValueError("boom")
assert x > 0
```

## Moduły i biblioteka standardowa

```python
import mathx
import strings
from structs import Stack

import os                            # stdlib Pythona też działa
```

## Comprehensions

```python
evens = [i for i in range(10) if i % 2 == 0]
caps = {n: n.upper() for n in names}
```

## Stringi i f-stringi

```python
msg = "Hello, " + "world!"
print(f"value: {msg}")
print("ab" * 3)
print(s.strip().replace("a", "x").split(","))   # łańcuch metod
```

## Integracja z Bashem

### Bash inline (backticks)

```python
`ls -la | grep ".py"`
```

### Bloki bash (`%% ... %%`)

```python
%%
#!/bin/bash
for file in *.py; do
    echo "Processing $file"
done
%%
```

## Wywołania wbudowane

`print`, `input`, `len`, `str`, `int`, `float`, `bool`, `list`, `dict`,
`tuple`, `set`, `range`, `open`, `type`, `sum`, `min`, `max`, `abs`,
`round`, `enumerate`, `zip`, `sorted`, `reversed`, `chr`, `ord`, `hex`,
`oct`, `bin`, `isinstance`, `repr`, `format`.
