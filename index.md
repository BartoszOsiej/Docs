---
layout: home
title: Bartosz Osiej — Engineering Docs Hub

hero:
  name: "Bartosz Osiej"
  text: "Engineering Docs Hub"
  tagline: >
    One home for everything I build — real documentation written from the
    actual source code: a production URL shortener, browser games, a native
    Rust voxel engine, a cybersecurity toolkit, a browser OS, an eBPF
    security monitor, a programming language of our own and a serverless
    P2P chat.
  image:
    src: /hero.svg
    alt: Projects
  actions:
    - theme: brand
      text: 📁 Browse the Catalog
      link: /projects/
    - theme: alt
      text: 💬 N2 Mesh (P2P chat)
      link: /projects/n2-mesh/
---

<AuroraBackground />

<ScrollReveal>
## 🏠 What is this site?

This is the **living documentation hub** for every project I build and
maintain. It is not a résumé and not a portfolio of screenshots — every page
here is written from the actual source: real endpoints, real modules, real
architecture decisions, real numbers.

Four things make this hub what it is:

<div class="grid-3">
  <GlowCard>
    <h3>📚 Deep, code-accurate docs</h3>
    <p>Every project has its own docs section with overview, architecture, user guides and references — generated from the code that actually ships.</p>
  </GlowCard>
  <GlowCard>
    <h3>📁 A complete project catalog</h3>
    <p>The <a href="/projects/">project registry</a> maps every repo to what it is, what stack it uses and where its docs live. One page, always current.</p>
  </GlowCard>
  <GlowCard>
    <h3>🤖 AI-readable</h3>
    <p><code>llms.txt</code> and <code>llms-full.txt</code> expose the entire site to AI agents, so models can read our documentation as easily as humans do.</p>
  </GlowCard>
  <GlowCard>
    <h3>🔄 Live update flow</h3>
    <p>A single GitHub Actions pipeline rebuilds and deploys this site on every push — the docs are always in sync with the repositories. See the <a href="/update-flow">update flow</a>.</p>
  </GlowCard>
</div>
</ScrollReveal>

<ScrollReveal :delay="120">
## 🚀 Where to start

<div class="cta-grid">
  <a class="cta-card" href="/projects/">
    <span class="cta-icon">📁</span>
    <span>
      <strong>Browse the full catalog</strong>
      <em>Every project, every repo, every doc — in one place.</em>
    </span>
  </a>
  <a class="cta-card" href="/projects/n2-mesh/">
    <span class="cta-icon">💬</span>
    <span>
      <strong>N2 Mesh — the P2P chat</strong>
      <em>A serverless, torrent-principle messenger that runs on static hosting.</em>
    </span>
  </a>
  <a class="cta-card" href="/update-flow">
    <span class="cta-icon">🔄</span>
    <span>
      <strong>How this site updates</strong>
      <em>Which repositories publish here, and how the pipeline works.</em>
    </span>
  </a>
</div>
</ScrollReveal>

<ScrollReveal :delay="200">
## ✨ The stack behind this hub

<table class="stack-table">
  <tbody>
    <tr><td><strong>Static site</strong></td><td>VitePress, hosted on GitHub Pages</td></tr>
    <tr><td><strong>Deployment</strong></td><td>GitHub Actions — auto-rebuild on every push to <code>main</code></td></tr>
    <tr><td><strong>AI access</strong></td><td><code>llms.txt</code> + <code>llms-full.txt</code> for agents</td></tr>
    <tr><td><strong>Content</strong></td><td>One <code>PROJECTS.md</code> registry as the single source of truth</td></tr>
    <tr><td><strong>Live demos</strong></td><td>N2 Mesh chat and the Externum playground run right in the docs</td></tr>
  </tbody>
</table>

> 💡 Looking for something specific? Head straight to the
> [📁 project catalog](/projects/) — everything is one click away.
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
