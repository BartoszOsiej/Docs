# Przykłady

Wszystkie przykłady działają na aktualnej wersji — pokryte są 118 testami
(`python3 -m unittest discover -s tests`).

## Pokedex — pełne demo języka

`examples/pokedex.ext` pokazuje klasy z dziedziczeniem, comprehensions,
lambdy, wyjątki, generatory, f-stringi i bibliotekę standardową:

```python
import mathx
import strings

class Fire(Pokemon):
    def __init__(self, name, hp=50):
        Pokemon.__init__(self, name, ["fire"], hp)

# comprehensions
fire_team = [p.name for p in squad if p.is_type("fire")]

# lambda + kwargs
weakest = min(squad, key=lambda p: p.hp)

# try/except/finally
try:
    raise ValueError("psyduck is confused")
except ValueError as e:
    print("caught:", e)

# generator
nums = [f for f in fibonacci(10) if f % 2 == 0]

# stdlib
print(mathx.gcd(48, 36))        # 12
print(strings.slugify("Hello World!"))   # hello-world
```

Uruchomienie i fragment wyjścia:

```bash
externum run examples/pokedex.ext
```

```
=== Squad ===
Charmander (fire) — 39 HP
...
=== Fire types (comprehension) ===
['Charmander', 'Vulpix']
=== Weakest member (lambda) ===
Vulpix has only 38 HP!
=== Fib numbers (generator + ternary) ===
[0, 2, 8, 34]
=== Standard library ===
gcd(48, 36) = 12
slug: hello-world
palindrome: True
=== Counter (structs lib) ===
most common: ('a', 3)
```

## Hello world z liczbami binarnymi

`examples/hello.ext`:

```python
x = 0b1010
y = 42
print("Hello from Externum!")
print(x + y)      # 52
`ls -la`
%%
echo "Bash block"
%%
```

## Kalkulator

`examples/calc.ext`:

```python
running = 1
print("Calculator")

while running:
    a = int(input("a: "))
    b = int(input("b: "))
    print(a + b)
    print(a * b)
```

## Silnia — rekurencja

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(10))      # 3628800
```

## Klasy z dziedziczeniem

```python
class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def speak(self):
        print("woof " + self.name)

Dog("Burek").speak()      # woof Burek
```

## Wyjątki i `with`

```python
try:
    with open("/tmp/demo.txt", "w") as f:
        f.write("hello")
    data = open("/tmp/demo.txt", "r").read()
    print(data)
except IOError as e:
    print("io error", e)
```

## Moduły

```python
import structs
import mathx

s = structs.Stack()
s.push(10)
s.push(20)
print(s.pop())            # 20
print(mathx.factorial(5)) # 120
```

## Kompilacja do Pythona

```bash
externum examples/hello.ext --target python -o hello.py
python3 hello.py
```
