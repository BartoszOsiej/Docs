# Examples

Wszystkie przykłady poniżej działają na aktualnej wersji — są pokryte
testami (`python3 -m unittest discover -s tests`).

## Hello world z liczbami binarnymi

`examples/hello.ext` (z repozytorium):

```python
# Externum example

x = 0b1010
y = 42
print("Hello from Externum!")
print(x + y)
`ls -la`
%%
echo "Bash block"
%%
```

Uruchomienie:

```bash
externum run examples/hello.ext
```

Wyjście:

```
Hello from Externum!
52
<wynik ls -la>
Bash block
```

## Kalkulator

`examples/calc.ext`:

```python
# Simple calculator in Externum

running = 1
print("Calculator")

while running:
    a = int(input("a: "))
    b = int(input("b: "))
    print(a + b)
    print(a * b)
```

```bash
externum run examples/calc.ext
# Calculator
# a: 6
# b: 7
# 13
# 42
```

## Silnia — rekurencja

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(10))      # 3628800
```

## Przepływ sterowania

```python
x = 42
if x > 100:
    print("large")
elif x > 0:
    print("small")
else:
    print("zero")

i = 0
while i < 3:
    print(i)
    i += 1

for i in range(3):
    print(i)
```

Wyjście: `small`, `0 1 2`, `0 1 2`.

## Skrypt powłoki

```python
def main():
    `echo "Hello from shell"`
    %%
    ls -la
    df -h
    %%

main()
```

## Kompilacja do Pythona

```bash
externum examples/hello.ext --target python -o hello.py
python3 hello.py
```

Wygenerowany Python dla `hello.ext` (uproszczony):

```python
import subprocess
x = int("1010", 2)
y = 42
print('Hello from Externum!')
print(x + y)
subprocess.run("ls -la", shell=True)
subprocess.run("echo \"Bash block\"", shell=True)
```
