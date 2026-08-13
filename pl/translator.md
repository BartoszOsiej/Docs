---
title: Książka PDF i Tłumacz — Bartosz Osiej
---

# 📖 Książka PDF i Tłumacz

> **Czytaj dowolny PDF jak prawdziwą książkę — strona po stronie, z wizualnym
> przewracaniem kartek — i tłumacz go na bieżąco, prosto z przeglądarki.
> Bez klucza, bez konta, bez serwera.**

Ta strona to live demo modułu tłumacza wbudowanego w to centrum
dokumentacji. Wybierz próbkę poniżej i naciśnij **Tłumacz stronę** (albo
**Tłumacz wszystko**), aby zobaczyć, jak strona zostaje przetłumaczona na
polski — renderowana bezpośrednio na stronie książki.

<PdfBookViewer
  src="/pdfs/sample-english.pdf"
  title="Sample — English Manual"
/>

<PdfBookViewer
  src="/pdfs/sample-polish.pdf"
  title="Przykład — Polski Dokument"
/>

---

## ✨ Co to robi

| Możliwość | Szczegóły |
|---|---|
| 📚 **Wizualne czytanie książki** | Strony PDF są renderowane jako otwarta książka — dwie strony na rozkładówkę, grzbiet, cienie stron i trójwymiarowe przewracanie kartek |
| 🔎 **Ekstrakcja tekstu na żywo** | Tekst strony jest pobierany przez pdf.js (`getTextContent`) — działa dla każdego PDF-a z tekstem |
| 🌐 **Tłumaczenie bez klucza** | Tekst strony jest tłumaczony w przeglądarce przez darmowe providery z CORS (najpierw publiczny endpoint Google, fallback MyMemory) |
| 🔤 **Auto-wykrywanie języka** | Wybierz *Auto-detect*, a moduł sam odgadnie język źródłowy z treści strony |
| 📑 **Strona lub cała książka** | *Tłumacz stronę* obsługuje bieżącą stronę; *Tłumacz wszystko* kolejno tłumaczy wszystkie strony z paskiem postępu |
| 🖼️ **Nakładka na stronie** | Przetłumaczony tekst można pokazać na samej stronie albo czytać w panelu pod książką |
| ⌨️ **Przyjazny klawiaturze** | Strzałki `←` / `→` przewracają strony |

## 🧪 Wypróbuj

1. Przewracaj kartki w przykładowych PDF-ach strzałkami (albo `←` / `→`).
2. Ustaw język docelowy (domyślnie: **Polski**).
3. Naciśnij **Tłumacz stronę** — tłumaczenie pojawia się w panelu i na stronie.
4. Naciśnij **Tłumacz wszystko**, aby przetłumaczyć całą książkę.
5. Wczytaj własny PDF, osadzając komponent z innym `src`.

## 🔌 Osadzanie w dokumentacji

Komponent jest zarejestrowany globalnie, więc każda strona Markdown może go
osadzić:

```md
<PdfBookViewer src="/pdfs/sample-english.pdf" title="Moja Książka" />
```

| Prop | Typ | Domyślnie | Opis |
|---|---|---|---|
| `src` | string | — | URL PDF-a. Ścieżki absolutne są rozwiązywane względem bazy witryny; URL-e http(s) ładują się bezpośrednio |
| `title` | string | `PDF Book` | Tytuł książki (pokazywany w pasku narzędzi i na okładce) |
| `initialPage` | number | `1` | Strona, na której książka się otwiera |

## 🛠️ Jak to działa pod maską

```
PDF (URL) ──► pdf.js ──► strony canvas ──► układ książki (rozkładówka + flip)
                  │
                  └── getTextContent() ──► chunkowanie po długości
                                                │
                                                ▼
                       translate.googleapis.com (Google, główny)
                                    │  w razie błędu
                       api.mymemory.translated.net (MyMemory, fallback)
                                                │
                                                ▼
                       tłumaczenia per strona ──► panel + nakładka na stronie
```

- **Renderowanie:** [pdf.js](https://mozilla.github.io/pdf.js/) renderuje
  każdą stronę do `<canvas>`. Worker i dane fontów standardowych są
  wgranе w `public/pdfjs/`, więc czytnik działa offline — bez CDN.
- **Ekstrakcja tekstu:** `page.getTextContent()` zwraca pozycjonowane spany
  tekstu; są one składane w akapity i chunkowane (Google: ~4 500 znaków,
  MyMemory: ~450 znaków), aby zmieścić się w limitach każdego API.
- **Tłumaczenie:** mały łańcuch providerów próbuje najpierw darmowego
  endpointu Google, a w razie błędu przełącza się na MyMemory.
  Auto-wykrywanie języka źródłowego również używa endpointu Google.
- **Układ książki:** strony są układane w rozkładówki (okładka sama po
  prawej, potem 2+3, 4+5, …). Przewracanie kartek to transformacje CSS 3D
  (`rotateY`) z `perspective`, więc przewracana strona obraca się jak
  prawdziwa kartka.

## 🔑 A co z Microsoft Translator?

Ta witryna pierwotnie miała używać **wbudowanego API Microsoft
Translator**. Dwie rzeczy warto wiedzieć:

1. Darmowy **Web Widget Translatora** Microsoft (klasyczny embed) został
   **wycofany w 2019** — już nie istnieje.
2. Nowoczesne **Azure Translator REST API** działa świetnie, ale wymaga
   **klucza subskrypcji + regionu**, których nie można udostępnić na
   publicznej statycznej stronie.

Dlatego ten moduł domyślnie działa **bez klucza** (Google + MyMemory —
obie darmowe, z CORS, bez konta). **Provider Microsoft Translator** jest
zawarty za tym samym interfejsem w `.vitepress/theme/translator.ts` — jeśli
masz klucz Azure, przekaż `microsoftKey` / `microsoftRegion` do
`translateText()`, a będzie używany w pierwszej kolejności. Dokumentacja
pozostaje darmowa i bez klucza dla wszystkich innych.

## 📄 Pliki przykładowe

Oba demo PDF-y są generowane z
[`scripts/gen-sample-pdfs.mjs`](https://github.com/BartoszOsiej/Docs/blob/main/scripts/gen-sample-pdfs.mjs)
(generator PDF bez zależności) i żyją w `public/pdfs/`:

- `sample-english.pdf` — 3 strony tekstu angielskiego
- `sample-polish.pdf` — 2 strony tekstu polskiego

## 📚 Powiązane

- [Centrum dokumentacji](/)
- [Katalog projektów](/projects/)
