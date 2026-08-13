---
layout: home
title: Bartosz Osiej — Centrum Dokumentacji Inżynierskiej

hero:
  name: "Bartosz Osiej"
  text: "Centrum Dokumentacji Inżynierskiej"
  tagline: >
    Jedno miejsce dla wszystkiego, co buduję — prawdziwa dokumentacja pisana
    na podstawie kodu źródłowego: produkcyjny skracacz URL, gry przeglądarkowe,
    natywny silnik wokselowy w Rust, zestaw narzędzi cyberbezpieczeństwa,
    system operacyjny w przeglądarce, monitor bezpieczeństwa eBPF, własny język
    programowania oraz serwerless czat P2P.
  image:
    src: /hero.svg
    alt: Projekty
  actions:
    - theme: brand
      text: 📁 Przeglądaj katalog
      link: /projects/
    - theme: alt
      text: 💬 N2 Mesh (czat P2P)
      link: /projects/n2-mesh/
---

<AuroraBackground />

<ScrollReveal>
## 🏠 Co to za witryna?

To **żywe centrum dokumentacji** każdego projektu, który buduję i utrzymuję.
To nie CV i nie portfolio zrzutów ekranu — każda strona jest napisana na
podstawie prawdziwego kodu: prawdziwe endpointy, prawdziwe moduły, prawdziwe
decyzje architektoniczne, prawdziwe liczby.

Cztery rzeczy czynią to centrum tym, czym jest:

<div class="grid-3">
  <GlowCard>
    <h3>📚 Głęboka, zgodna z kodem dokumentacja</h3>
    <p>Każdy projekt ma własną sekcję z przeglądem, architekturą, poradnikami i referencjami — generowaną z kodu, który faktycznie działa.</p>
  </GlowCard>
  <GlowCard>
    <h3>📁 Kompletny katalog projektów</h3>
    <p><a href="/projects/">Rejestr projektów</a> mapuje każde repo na to, czym jest, jakiego używa stosu i gdzie żyje jego dokumentacja. Jedna strona, zawsze aktualna.</p>
  </GlowCard>
  <GlowCard>
    <h3>🤖 Czytelne dla AI</h3>
    <p><code>llms.txt</code> i <code>llms-full.txt</code> udostępniają całą witrynę agentom AI, więc modele czytają naszą dokumentację równie łatwo jak ludzie.</p>
  </GlowCard>
  <GlowCard>
    <h3>🔄 Żywy przepływ aktualizacji</h3>
    <p>Jeden pipeline GitHub Actions przebudowuje i wdraża tę witrynę przy każdym pushu — dokumentacja zawsze pozostaje w zgodzie z repozytoriami. Zobacz <a href="/update-flow">przepływ aktualizacji</a>.</p>
  </GlowCard>
</div>
</ScrollReveal>

<ScrollReveal :delay="120">
## 🚀 Od czego zacząć

<div class="cta-grid">
  <a class="cta-card" href="/projects/">
    <span class="cta-icon">📁</span>
    <span>
      <strong>Przeglądaj pełny katalog</strong>
      <em>Każdy projekt, każde repo, każda dokumentacja — w jednym miejscu.</em>
    </span>
  </a>
  <a class="cta-card" href="/projects/n2-mesh/">
    <span class="cta-icon">💬</span>
    <span>
      <strong>N2 Mesh — czat P2P</strong>
      <em>Bezserwerowy komunikator WebRTC działający na statycznym hostingu.</em>
    </span>
  </a>
  <a class="cta-card" href="/translator">
    <span class="cta-icon">📖</span>
    <span>
      <strong>Książka PDF i tłumacz</strong>
      <em>Czytaj PDF-y jak książki i tłumacz strony bez klucza — prosto w przeglądarce.</em>
    </span>
  </a>
  <a class="cta-card" href="/update-flow">
    <span class="cta-icon">🔄</span>
    <span>
      <strong>Jak ta witryna się aktualizuje</strong>
      <em>Które repozytoria publikują tu zmiany i jak działa pipeline.</em>
    </span>
  </a>
</div>
</ScrollReveal>

<ScrollReveal :delay="200">
## ✨ Stos technologiczny tego centrum

<table class="stack-table">
  <tbody>
    <tr><td><strong>Statyczna witryna</strong></td><td>VitePress, hostowana na GitHub Pages</td></tr>
    <tr><td><strong>Wdrożenie</strong></td><td>GitHub Actions — automatyczna przebudowa przy każdym pushu na <code>main</code></td></tr>
    <tr><td><strong>Dostęp dla AI</strong></td><td><code>llms.txt</code> + <code>llms-full.txt</code> dla agentów</td></tr>
    <tr><td><strong>Treść</strong></td><td>Jeden rejestr <code>PROJECTS.md</code> jako źródło prawdy</td></tr>
    <tr><td><strong>Demo na żywo</strong></td><td>Czat N2 Mesh i playground Externum działają bezpośrednio w dokumentacji</td></tr>
    <tr><td><strong>Tłumacz PDF</strong></td><td>Czytnik książkowy z darmowym tłumaczeniem bez klucza</td></tr>
  </tbody>
</table>

> 💡 Szukasz czegoś konkretnego? Przejdź od razu do
> [📁 katalogu projektów](/projects/) — wszystko jest jedno kliknięcie stąd.
</ScrollReveal>

<style scoped>
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin: 1.4rem 0 2rem;
}
.grid-3 h3 { margin-top: 0; }
.grid-3 p { opacity: 0.8; line-height: 1.6; }

.cta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1.4rem 0 2rem;
}
.cta-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
  text-decoration: none !important;
}
.cta-card:hover {
  border-color: rgba(125, 211, 252, 0.45);
  background: rgba(125, 211, 252, 0.06);
  transform: translateY(-2px);
}
.cta-icon {
  font-size: 1.7rem;
  flex-shrink: 0;
}
.cta-card strong {
  display: block;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}
.cta-card em {
  display: block;
  font-style: normal;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
  margin-top: 0.2rem;
}

.stack-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.4rem 0 2rem;
  font-size: 0.95rem;
}
.stack-table td {
  padding: 0.55rem 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.stack-table td:first-child {
  width: 38%;
  color: var(--vp-c-text-1);
}
.stack-table tr:last-child td { border-bottom: none; }
</style>
