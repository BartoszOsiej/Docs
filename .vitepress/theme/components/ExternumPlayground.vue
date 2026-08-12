<template>
  <div class="ext-playground">
    <div class="ep-header">
      <div class="ep-title">
        <span class="ep-logo">⬢</span>
        <div>
          <strong>Live Externum Playground</strong>
          <p>Externum v3.0 executes <em>in your browser</em> — Python via WebAssembly (Pyodide). No server.</p>
        </div>
      </div>
      <div class="ep-actions">
        <select v-model="activeExample" @change="loadExample" aria-label="Load example" :disabled="!ready">
          <option value="hello">👋 Hello</option>
          <option value="oop">🏛️ OOP — classes &amp; inheritance</option>
          <option value="comprehensions">🧩 Comprehensions &amp; lambdas</option>
          <option value="fstrings">🔤 F-strings &amp; format</option>
          <option value="modules">📦 Imports &amp; stdlib</option>
          <option value="pokedex">🐉 Pokedex demo</option>
        </select>
        <button class="ep-run" :disabled="running" @click="run">
          {{ running ? 'Running…' : ready ? '▶ Run' : 'Loading runtime…' }}
        </button>
      </div>
    </div>

    <div class="ep-body">
      <div class="ep-col">
        <div class="ep-label">program.ext</div>
        <textarea v-model="code" class="ep-code" spellcheck="false" aria-label="Externum source code"></textarea>
      </div>
      <div class="ep-col">
        <div class="ep-label">output</div>
        <pre class="ep-output" :class="{ error: isError }">{{ output || '— output appears here —' }}</pre>
      </div>
    </div>

    <div class="ep-foot">
      <span class="ep-status" :class="statusKind">{{ statusText }}</span>
      <span class="ep-hint">The compiler runs entirely client-side. Compiled target: <code>python</code></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
const INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/Docs/'

const code = ref('')
const output = ref('')
const isError = ref(false)
const running = ref(false)
const ready = ref(false)
const activeExample = ref('hello')
const statusText = ref('Runtime not loaded yet.')
const statusKind = ref('idle')

let pyodide = null

const EXAMPLES = {
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

function loadExample() {
  code.value = EXAMPLES[activeExample.value] || ''
}

onMounted(() => {
  loadExample()
})

async function loadPyodideRuntime() {
  statusText.value = 'Loading Python runtime (Pyodide, ~10 MB)…'
  statusKind.value = 'busy'
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = PYODIDE_URL
      s.onload = resolve
      s.onerror = () => reject(new Error('Failed to load Pyodide from CDN'))
      document.head.appendChild(s)
    })
  }
  pyodide = await window.loadPyodide({ indexURL: INDEX_URL })

  // Load the Externum language source (transpiler is pure Python) into the
  // Pyodide virtual filesystem, then expose a run() entry point.
  pyodide.FS.mkdirTree('/lib/externum/runtime')
  pyodide.FS.mkdirTree('/lib/lib')
  const files = [
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
    const res = await fetch(BASE + 'externum-live/' + src)
    if (!res.ok) throw new Error('Failed to fetch ' + src)
    const text = await res.text()
    pyodide.FS.writeFile('/lib/' + dst, text)
  }

  pyodide.runPython(`
import sys, os
sys.path.insert(0, '/lib')
# The runtime resolves .ext imports relative to search roots; point it at
# the virtual filesystem dir that holds both externum/ and lib/.
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
`
)
  ready.value = true
  statusText.value = 'Runtime ready — Externum runs 100% in your browser.'
  statusKind.value = 'ok'
}

async function run() {
  if (!code.value.trim()) return
  if (!pyodide) {
    running.value = true
    statusText.value = 'Booting Python (WebAssembly)…'
    try {
      await loadPyodideRuntime()
    } catch (err) {
      running.value = false
      statusText.value = 'Runtime failed to load: ' + err.message
      statusKind.value = 'err'
      return
    }
  }
  running.value = true
  statusText.value = 'Compiling + running…'
  statusKind.value = 'busy'
  try {
    const result = pyodide.globals.get('externum_run')(code.value)
    const [kind, text] = result.toJs()
    output.value = String(text)
    isError.value = kind === 'err'
    statusText.value = kind === 'ok' ? 'Finished — exit 0' : 'Program raised an error'
    statusKind.value = kind === 'ok' ? 'ok' : 'err'
  } catch (err) {
    output.value = String(err)
    isError.value = true
    statusText.value = 'Runtime error'
    statusKind.value = 'err'
  } finally {
    running.value = false
  }
}
</script>

<style scoped>
.ext-playground {
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.9));
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  margin: 1.6rem 0;
  font-family: inherit;
}
.ep-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  flex-wrap: wrap;
}
.ep-title { display: flex; align-items: center; gap: 0.7rem; }
.ep-title strong { font-size: 0.95rem; color: #e2e8f0; }
.ep-title p { margin: 0.1rem 0 0; font-size: 0.75rem; color: #94a3b8; }
.ep-logo {
  width: 34px; height: 34px; border-radius: 9px;
  display: grid; place-items: center;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #0f172a; font-weight: 800; font-size: 1rem;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}
.ep-actions { display: flex; gap: 0.5rem; align-items: center; }
.ep-actions select {
  background: #0f172a; color: #e2e8f0; border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px; padding: 0.42rem 0.6rem; font-size: 0.8rem; cursor: pointer;
}
.ep-run {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #052e16; border: none; border-radius: 8px;
  padding: 0.45rem 1rem; font-weight: 700; font-size: 0.82rem;
  cursor: pointer; transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.ep-run:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(34, 197, 94, 0.35); }
.ep-run:disabled { opacity: 0.55; cursor: not-allowed; }
.ep-body {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0;
}
@media (max-width: 820px) { .ep-body { grid-template-columns: 1fr; } }
.ep-col { min-width: 0; }
.ep-col + .ep-col { border-left: 1px solid rgba(148, 163, 184, 0.18); }
@media (max-width: 820px) { .ep-col + .ep-col { border-left: none; border-top: 1px solid rgba(148,163,184,0.18); } }
.ep-label {
  padding: 0.4rem 0.8rem; font-size: 0.68rem; text-transform: uppercase;
  letter-spacing: 0.08em; color: #64748b; background: rgba(148, 163, 184, 0.08);
}
.ep-code {
  width: 100%; min-height: 260px; resize: vertical;
  background: #020617; color: #d1fae5; border: none; outline: none;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem; line-height: 1.55; padding: 0.8rem; tab-size: 4;
}
.ep-output {
  width: 100%; min-height: 260px; max-height: 420px; overflow: auto;
  margin: 0; padding: 0.8rem; background: #0b1120; color: #bbf7d0;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8rem; line-height: 1.55; white-space: pre-wrap; word-break: break-word;
}
.ep-output.error { color: #fca5a5; }
.ep-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 0.8rem;
  padding: 0.6rem 1.1rem; border-top: 1px solid rgba(148, 163, 184, 0.18);
  flex-wrap: wrap;
}
.ep-status { font-size: 0.75rem; font-weight: 600; }
.ep-status.idle { color: #64748b; }
.ep-status.busy { color: #fbbf24; }
.ep-status.ok { color: #4ade80; }
.ep-status.err { color: #f87171; }
.ep-hint { font-size: 0.7rem; color: #64748b; }
.ep-hint code { color: #94a3b8; }
</style>
