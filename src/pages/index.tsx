import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import AuroraBackground from '@site/src/components/AuroraBackground'
import ScrollReveal from '@site/src/components/ScrollReveal'
import GlowCard from '@site/src/components/GlowCard'
import Layout from '@theme/Layout'

interface Copy {
  heroName: string
  heroText: string
  tagline: string
  browseCta: string
  chatCta: string
  whatTitle: string
  whatIntro: string
  card1Title: string
  card1Body: string
  card2Title: string
  card2Body: string
  card3Title: string
  card3Body: string
  card4Title: string
  card4Body: string
  startTitle: string
  cta1Title: string
  cta1Body: string
  cta2Title: string
  cta2Body: string
  cta3Title: string
  cta3Body: string
  stackTitle: string
  stackRows: Array<[string, string]>
  tip: string
  tipLinkText: string
  tipLink: string
}

const EN: Copy = {
  heroName: 'Bartosz Osiej',
  heroText: 'Engineering Docs Hub',
  tagline:
    'One home for everything I build — real documentation written from the actual source code: a production URL shortener, browser games, a native Rust voxel engine, a cybersecurity toolkit, a browser OS, an eBPF security monitor, a programming language of our own and a serverless P2P chat.',
  browseCta: 'Browse the Catalog',
  chatCta: 'N2 Mesh (P2P chat)',
  whatTitle: 'What is this site?',
  whatIntro:
    'This is the living documentation hub for every project I build and maintain. It is not a résumé and not a portfolio of screenshots — every page here is written from the actual source: real endpoints, real modules, real architecture decisions, real numbers.',
  card1Title: 'Deep, code-accurate docs',
  card1Body:
    'Every project has its own docs section with overview, architecture, user guides and references — generated from the code that actually ships.',
  card2Title: 'A complete project catalog',
  card2Body:
    'The project registry maps every repo to what it is, what stack it uses and where its docs live. One page, always current.',
  card3Title: 'AI-readable',
  card3Body:
    'llms.txt and llms-full.txt expose the entire site to AI agents, so models can read our documentation as easily as humans do.',
  card4Title: 'Live update flow',
  card4Body:
    'A single GitHub Actions pipeline rebuilds and deploys this site on every push — the docs are always in sync with the repositories.',
  startTitle: 'Where to start',
  cta1Title: 'Browse the full catalog',
  cta1Body: 'Every project, every repo, every doc — in one place.',
  cta2Title: 'N2 Mesh — the P2P chat',
  cta2Body: 'A serverless WebRTC messenger that runs on static hosting.',
  cta3Title: 'How this site updates',
  cta3Body: 'Which repositories publish here, and how the pipeline works.',
  stackTitle: 'The stack behind this hub',
  stackRows: [
    ['Static site', 'Docusaurus, hosted on GitHub Pages'],
    ['Deployment', 'GitHub Actions — auto-rebuild on every push to main'],
    ['AI access', 'llms.txt + llms-full.txt for agents'],
    ['Content', 'One PROJECTS.md registry as the single source of truth'],
    ['Live demos', 'N2 Mesh chat and the Externum playground run right in the docs'],
  ],
  tip: 'Looking for something specific? Head straight to the',
  tipLinkText: 'project catalog',
  tipLink: '/projects/',
}

const PL: Copy = {
  heroName: 'Bartosz Osiej',
  heroText: 'Centrum Dokumentacji Inżynierskiej',
  tagline:
    'Jedno miejsce dla wszystkiego, co buduję — prawdziwa dokumentacja pisana na podstawie kodu źródłowego: produkcyjny skracacz URL, gry przeglądarkowe, natywny silnik wokselowy w Rust, zestaw narzędzi cyberbezpieczeństwa, system operacyjny w przeglądarce, monitor bezpieczeństwa eBPF, własny język programowania oraz serwerless czat P2P.',
  browseCta: 'Przeglądaj katalog',
  chatCta: 'N2 Mesh (czat P2P)',
  whatTitle: 'Co to za witryna?',
  whatIntro:
    'To żywe centrum dokumentacji każdego projektu, który buduję i utrzymuję. To nie CV i nie portfolio zrzutów ekranu — każda strona jest napisana na podstawie prawdziwego kodu: prawdziwe endpointy, prawdziwe moduły, prawdziwe decyzje architektoniczne, prawdziwe liczby.',
  card1Title: 'Głęboka, zgodna z kodem dokumentacja',
  card1Body:
    'Każdy projekt ma własną sekcję z przeglądem, architekturą, poradnikami i referencjami — generowaną z kodu, który faktycznie działa.',
  card2Title: 'Kompletny katalog projektów',
  card2Body:
    'Rejestr projektów mapuje każde repo na to, czym jest, jakiego używa stosu i gdzie żyje jego dokumentacja. Jedna strona, zawsze aktualna.',
  card3Title: 'Czytelne dla AI',
  card3Body:
    'llms.txt i llms-full.txt udostępniają całą witrynę agentom AI, więc modele czytają naszą dokumentację równie łatwo jak ludzie.',
  card4Title: 'Żywy przepływ aktualizacji',
  card4Body:
    'Jeden pipeline GitHub Actions przebudowuje i wdraża tę witrynę przy każdym pushu — dokumentacja zawsze pozostaje w zgodzie z repozytoriami.',
  startTitle: 'Od czego zacząć',
  cta1Title: 'Przeglądaj pełny katalog',
  cta1Body: 'Każdy projekt, każde repo, każda dokumentacja — w jednym miejscu.',
  cta2Title: 'N2 Mesh — czat P2P',
  cta2Body: 'Bezserwerowy komunikator WebRTC działający na statycznym hostingu.',
  cta3Title: 'Jak ta witryna się aktualizuje',
  cta3Body: 'Które repozytoria publikują tu zmiany i jak działa pipeline.',
  stackTitle: 'Stos technologiczny tego centrum',
  stackRows: [
    ['Statyczna witryna', 'Docusaurus, hostowana na GitHub Pages'],
    ['Wdrożenie', 'GitHub Actions — automatyczna przebudowa przy każdym pushu na main'],
    ['Dostęp dla AI', 'llms.txt + llms-full.txt dla agentów'],
    ['Treść', 'Jeden rejestr PROJECTS.md jako źródło prawdy'],
    ['Demo na żywo', 'Czat N2 Mesh i playground Externum działają bezpośrednio w dokumentacji'],
  ],
  tip: 'Szukasz czegoś konkretnego? Przejdź od razu do',
  tipLinkText: 'katalogu projektów',
  tipLink: '/projects/',
}

export default function Home(): React.JSX.Element {
  const { i18n } = useDocusaurusContext()
  const copy = i18n.currentLocale === 'pl' ? PL : EN
  const projectsUrl = useBaseUrl(copy.tipLink)
  const catalogUrl = useBaseUrl('/projects/')
  const chatUrl = useBaseUrl('/projects/n2-mesh/')
  const updateUrl = useBaseUrl('/update-flow')

  return (
    <Layout
      title="Home"
      description="Central documentation hub for all Bartosz Osiej projects."
    >
      <AuroraBackground />
      <main className="home-main">
        {/* hero */}
        <section className="home-hero">
          <h1 className="hero-name">
            {copy.heroName} <span className="hero-text">{copy.heroText}</span>
          </h1>
          <p className="hero-tagline">{copy.tagline}</p>
          <div className="hero-actions">
            <a className="btn-brand" href={catalogUrl}>
              📁 {copy.browseCta}
            </a>
            <a className="btn-alt" href={chatUrl}>
              💬 {copy.chatCta}
            </a>
          </div>
        </section>

        {/* what is this site */}
        <ScrollReveal>
          <section className="home-section">
            <h2>🏠 {copy.whatTitle}</h2>
            <p className="section-intro">{copy.whatIntro}</p>
            <div className="grid-3">
              <GlowCard>
                <h3>📚 {copy.card1Title}</h3>
                <p>{copy.card1Body}</p>
              </GlowCard>
              <GlowCard>
                <h3>📁 {copy.card2Title}</h3>
                <p>{copy.card2Body}</p>
              </GlowCard>
              <GlowCard>
                <h3>🤖 {copy.card3Title}</h3>
                <p>{copy.card3Body}</p>
              </GlowCard>
              <GlowCard>
                <h3>🔄 {copy.card4Title}</h3>
                <p>
                  {copy.card4Body} <a href={updateUrl}>update flow</a>.
                </p>
              </GlowCard>
            </div>
          </section>
        </ScrollReveal>

        {/* where to start */}
        <ScrollReveal delay={120}>
          <section className="home-section">
            <h2>🚀 {copy.startTitle}</h2>
            <div className="cta-grid">
              <a className="cta-card" href={catalogUrl}>
                <span className="cta-icon">📁</span>
                <span>
                  <strong>{copy.cta1Title}</strong>
                  <em>{copy.cta1Body}</em>
                </span>
              </a>
              <a className="cta-card" href={chatUrl}>
                <span className="cta-icon">💬</span>
                <span>
                  <strong>{copy.cta2Title}</strong>
                  <em>{copy.cta2Body}</em>
                </span>
              </a>
              <a className="cta-card" href={updateUrl}>
                <span className="cta-icon">🔄</span>
                <span>
                  <strong>{copy.cta3Title}</strong>
                  <em>{copy.cta3Body}</em>
                </span>
              </a>
            </div>
          </section>
        </ScrollReveal>

        {/* stack */}
        <ScrollReveal delay={200}>
          <section className="home-section">
            <h2>✨ {copy.stackTitle}</h2>
            <table className="stack-table">
              <tbody>
                {copy.stackRows.map(([k, v]) => (
                  <tr key={k}>
                    <td>
                      <strong>{k}</strong>
                    </td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <blockquote>
              💡 {copy.tip}{' '}
              <a href={projectsUrl}>📁 {copy.tipLinkText}</a> — everything is one click away.
            </blockquote>
          </section>
        </ScrollReveal>
      </main>
    </Layout>
  )
}
