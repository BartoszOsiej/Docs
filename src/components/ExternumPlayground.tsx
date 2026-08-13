import React, { useEffect, useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
const INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

const EXAMPLES: Record<string, string> = {
  hello: `# Hello world — the classic, Externum style
name = "world"
print("Hello from Externum!")
print("1 + 1 =", 1 + 1)

# binary literal + f-string
bits = 0b1010
print(f"0b1010 = {bits}")`,
  oop: `# Classes and inheritance
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

animals = [Dog("Rex"), Cat("Mruczek")]
for a in animals:
    print(f"{a.name} says: {a.speak()}")`,
  comprehensions: `# Comprehensions, lambdas and generators
numbers = [1, 2, 3, 4, 5, 6]

squares = [n * n for n in numbers if n % 2 == 0]
print("even squares:", squares)

double = lambda x: x * 2
print("doubled:", [double(n) for n in numbers])

def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

g = fib()
first10 = [next(g) for _ in range(10)]
print("fib:", first10)`,
  fstrings: `# F-strings, dicts and formatting
user = {"name": "Bartosz", "lang": "Externum", "score": 99}

print(f"{user['name']} writes {user['lang']}")
print(f"score: {user['score']}%")
print(f"pi ~= {3.1415926535:.2f}")

# dict comprehension
squares = {n: n * n for n in range(1, 6)}
print(squares)`,
  modules: `# Import a module from the stdlib (written in Externum!)
import mathx

print("factorial(5) =", mathx.factorial(5))
print("gcd(48, 36)  =", mathx.gcd(48, 36))
print("fib(10)      =", mathx.fib(10))

import strings
print("reversed:", strings.reverse("externum"))
print("palindrome:", strings.is_palindrome("kajak"))`,
  pokedex: `# A mini Pokédex — the full demo
class Pokemon:
    def __init__(self, name, ptype, power):
        self.name = name
        self.ptype = ptype
        self.power = power

    def describe(self):
        return f"{self.name} ({self.ptype}) power {self.power}"

pokedex = [
    Pokemon("Pikachu", "electric", 55),
    Pokemon("Charizard", "fire", 84),
    Pokemon("Blastoise", "water", 79),
    Pokemon("Venusaur", "grass", 82),
]

print("=== Pokedex ===")
for p in pokedex:
    print(" -", p.describe())

strongest = max(pokedex, key=lambda p: p.power)
print("Strongest:", strongest.describe())

fire = [p.name for p in pokedex if p.ptype == "fire"]
print("Fire types:", fire)`,
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>
  }
}

/** In-browser Externum playground: Pyodide (WASM Python) + the .ext transpiler. */
export default function ExternumPlayground(): React.JSX.Element {
  const base = useBaseUrl('/')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isError, setIsError] = useState(false)
  const [running, setRunning] = useState(false)
  const [ready, setReady] = useState(false)
  const [activeExample, setActiveExample] = useState('hello')
  const [statusText, setStatusText] = useState('Runtime not loaded yet.')
  const [statusKind, setStatusKind] = useState<'idle' | 'busy' | 'ok' | 'err'>('idle')

  let pyodideRef: {
    FS: {
      mkdirTree: (p: string) => void
      writeFile: (p: string, content: string) => void
    }
    runPython: (code: string) => unknown
    globals: {
      get: (name: string) => { (arg: string): { toJs: () => [string, string] } }
    }
  } | null = null

  useEffect(() => {
    setCode(EXAMPLES.hello)
  }, [])

  const loadExample = (name: string): void => {
    setActiveExample(name)
    setCode(EXAMPLES[name] ?? '')
  }

  const loadPyodideRuntime = async (): Promise<void> => {
    setStatusText('Loading Python runtime (Pyodide, ~10 MB)…')
    setStatusKind('busy')
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = PYODIDE_URL
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
        document.head.appendChild(s)
      })
    }
    const pyodide = await window.loadPyodide!({ indexURL: INDEX_URL }) as {
      FS: {
        mkdirTree: (p: string) => void
        writeFile: (p: string, content: string) => void
      }
      runPython: (code: string) => unknown
      globals: {
        get: (name: string) => { (arg: string): { toJs: () => [string, string] } }
      }
    }
    pyodideRef = pyodide

    // Load the Externum language source (transpiler is pure Python) into the
    // Pyodide virtual filesystem, then expose a run() entry point.
    pyodide.FS.mkdirTree('/lib/externum/runtime')
    pyodide.FS.mkdirTree('/lib/lib')
    const files: Array<[string, string]> = [
      ['externum/__init__.py', 'externum/__init__.py'],
      ['externum/lexer.py', 'externum/lexer.py'],
      ['externum/parser.py', 'externum/parser.py'],
      ['externum/compiler.py', 'externum/compiler.py'],
      ['externum/runtime/__init__.py', 'externum/runtime/__init__.py'],
      ['lib/mathx.ext', 'lib/mathx.ext'],
      ['lib/strings.ext', 'lib/strings.ext'],
      ['lib/structs.ext', 'lib/structs.ext'],
      ['lib/fs.ext', 'lib/fs.ext'],
    ]
    for (const [src, dst] of files) {
      const res = await fetch(base + 'externum-live/' + src)
      if (!res.ok) throw new Error('Failed to fetch ' + src)
      const text = await res.text()
      pyodide.FS.writeFile('/lib/' + dst, text)
    }

    pyodide.runPython(`
import sys, os
sys.path.insert(0, '/lib')
os.chdir('/lib')

def externum_run(source):
    import io
    from externum import Runtime
    buf = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = buf, buf
    try:
        Runtime(search_roots=['/lib']).run(source)
        return ('ok', buf.getvalue())
    except Exception as e:
        return ('err', f'{type(e).__name__}: {e}\\n{buf.getvalue()}')
    finally:
        sys.stdout, sys.stderr = old_out, old_err
`)
    setReady(true)
    setStatusText('Runtime ready — Externum runs 100% in your browser.')
    setStatusKind('ok')
  }

  const run = async (): Promise<void> => {
    if (!code.trim()) return
    if (!pyodideRef) {
      setRunning(true)
      setStatusText('Booting Python (WebAssembly)…')
      try {
        await loadPyodideRuntime()
      } catch (err) {
        setRunning(false)
        setStatusText(`Runtime failed to load: ${(err as Error).message}`)
        setStatusKind('err')
        return
      }
    }
    setRunning(true)
    setStatusText('Compiling + running…')
    setStatusKind('busy')
    try {
      const result = pyodideRef!.globals.get('externum_run')(code)
      const [kind, text] = result.toJs()
      setOutput(String(text))
      setIsError(kind === 'err')
      setStatusText(kind === 'ok' ? 'Finished — exit 0' : 'Program raised an error')
      setStatusKind(kind === 'ok' ? 'ok' : 'err')
    } catch (err) {
      setOutput(String(err))
      setIsError(true)
      setStatusText('Runtime error')
      setStatusKind('err')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="ext-playground">
      <div className="ep-header">
        <div className="ep-title">
          <span className="ep-logo">⬢</span>
          <div>
            <strong>Live Externum Playground</strong>
            <p>
              Externum v3.0 executes <em>in your browser</em> — Python via WebAssembly (Pyodide). No
              server.
            </p>
          </div>
        </div>
        <div className="ep-actions">
          <select
            value={activeExample}
            onChange={(e) => loadExample(e.target.value)}
            aria-label="Load example"
            disabled={!ready}
          >
            <option value="hello">👋 Hello</option>
            <option value="oop">🏛️ OOP — classes &amp; inheritance</option>
            <option value="comprehensions">🧩 Comprehensions &amp; lambdas</option>
            <option value="fstrings">🔤 F-strings &amp; format</option>
            <option value="modules">📦 Imports &amp; stdlib</option>
            <option value="pokedex">🐉 Pokedex demo</option>
          </select>
          <button className="ep-run" disabled={running} onClick={() => void run()}>
            {running ? 'Running…' : ready ? '▶ Run' : 'Loading runtime…'}
          </button>
        </div>
      </div>

      <div className="ep-body">
        <div className="ep-col">
          <div className="ep-label">program.ext</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="ep-code"
            spellCheck={false}
            aria-label="Externum source code"
          />
        </div>
        <div className="ep-col">
          <div className="ep-label">output</div>
          <pre className={`ep-output${isError ? ' error' : ''}`}>
            {output || '— output appears here —'}
          </pre>
        </div>
      </div>

      <div className="ep-foot">
        <span className={`ep-status ${statusKind}`}>{statusText}</span>
        <span className="ep-hint">
          The compiler runs entirely client-side. Compiled target: <code>python</code>
        </span>
      </div>
    </div>
  )
}
