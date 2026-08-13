import { defineConfig } from 'vitepress'

// Base path for GitHub Pages: https://BartoszOsiej.github.io/Docs/
export default defineConfig({
  title: 'Bartosz Osiej — Docs',
  description:
    'Central documentation hub for all Bartosz Osiej projects — LinkShort, Novactorio, NV2 Engine, AURORA OS, the Cybersec Toolkit, Halcyon Process Monitor and the Externum programming language.',
  lang: 'en-US',
  base: '/Docs/',
  cleanUrls: true,
  ignoreDeadLinks: [/^http:\/\/localhost/],
  lastUpdated: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Docs/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:title', content: 'Bartosz Osiej — Docs' }],
    ['meta', { property: 'og:description', content: 'Central documentation hub for all Bartosz Osiej projects.' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/BartoszOsiej' }],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'Central documentation hub for all Bartosz Osiej projects — LinkShort, Novactorio, NV2 Engine, AURORA OS, the Cybersec Toolkit, Halcyon Process Monitor and the Externum programming language.',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Projects', link: '/projects/' },
          { text: 'LinkShort', link: '/projects/fastapi-url/' },
          { text: 'Novactorio', link: '/projects/factorio-web-game/' },
          { text: 'NV2 Engine', link: '/projects/nv2-engine/' },
          { text: 'Cybersec', link: '/projects/cybersec-tools/' },
          { text: 'AURORA OS', link: '/projects/aurora-os/' },
          { text: 'Externum', link: '/projects/externum/' },
          { text: 'N2 Mesh', link: '/projects/n2-mesh/' },
          {
            text: 'More',
            items: [
              { text: 'Halcyon Process Monitor', link: '/projects/halcyon-process-monitor/' },
              { text: '📖 PDF Book & Translator', link: '/translator' },
              { text: 'Update Flow', link: '/update-flow' },
            ],
          },
        ],
        sidebar: {
          '/projects/': [
            {
              text: 'All Projects',
              items: [
                { text: '📁 Projects', link: '/projects/' },
                { text: '💬 N2 Mesh (P2P Chat)', link: '/projects/n2-mesh/' },
                { text: '🔗 LinkShort', link: '/projects/fastapi-url/' },
                { text: '🏭 Novactorio', link: '/projects/factorio-web-game/' },
                { text: '⛏️ NV2 Engine', link: '/projects/nv2-engine/' },
                { text: '◈ AURORA OS', link: '/projects/aurora-os/' },
                { text: '🛡️ Cybersec Toolkit', link: '/projects/cybersec-tools/' },
                { text: '🛰️ Halcyon Monitor', link: '/projects/halcyon-process-monitor/' },
                { text: '📜 Externum', link: '/projects/externum/' },
                { text: '📖 PDF Book & Translator', link: '/translator' },
              ],
            },
          ],
          '/projects/fastapi-url/': [
            {
              text: 'LinkShort (FastAPI-url)',
              items: [
                { text: 'Overview', link: '/projects/fastapi-url/' },
                { text: 'Getting Started', link: '/projects/fastapi-url/getting-started' },
                { text: 'API Reference', link: '/projects/fastapi-url/api-reference' },
                { text: 'Deployment', link: '/projects/fastapi-url/deployment' },
              ],
            },
          ],
          '/projects/factorio-web-game/': [
            {
              text: 'Novactorio (Factorio-web-game)',
              items: [
                { text: 'Overview', link: '/projects/factorio-web-game/' },
                { text: 'Architecture', link: '/projects/factorio-web-game/architecture' },
                { text: 'Gameplay Systems', link: '/projects/factorio-web-game/gameplay' },
                { text: 'Backend & Monetization', link: '/projects/factorio-web-game/backend' },
              ],
            },
          ],
          '/projects/cybersec-tools/': [
            {
              text: 'Cybersec Toolkit',
              items: [
                { text: 'Overview', link: '/projects/cybersec-tools/' },
                { text: 'NetRecon', link: '/projects/cybersec-tools/netrecon' },
                { text: 'ShadowScan', link: '/projects/cybersec-tools/shadowscan' },
                { text: 'HashSleuth', link: '/projects/cybersec-tools/hashsleuth' },
                { text: 'PacketEye', link: '/projects/cybersec-tools/packeteye' },
              ],
            },
          ],
          '/projects/aurora-os/': [
            {
              text: 'AURORA OS',
              items: [
                { text: 'Overview', link: '/projects/aurora-os/' },
                { text: 'Architecture', link: '/projects/aurora-os/architecture' },
                { text: 'User Guide', link: '/projects/aurora-os/user-guide' },
              ],
            },
          ],
          '/projects/nv2-engine/': [
            {
              text: 'NV2 Engine',
              items: [
                { text: 'Overview', link: '/projects/nv2-engine/' },
                { text: 'Architecture', link: '/projects/nv2-engine/architecture' },
                { text: 'Gameplay', link: '/projects/nv2-engine/gameplay' },
                { text: 'Blocks & Biomes', link: '/projects/nv2-engine/blocks' },
                { text: 'Crafting Reference', link: '/projects/nv2-engine/crafting' },
                { text: 'Water Simulation', link: '/projects/nv2-engine/water' },
                { text: 'AI Vegetation System', link: '/projects/nv2-engine/ai' },
                { text: 'Performance', link: '/projects/nv2-engine/performance' },
                { text: 'Development', link: '/projects/nv2-engine/development' },
                { text: 'Roadmap & Changelog', link: '/projects/nv2-engine/roadmap' },
              ],
            },
          ],
          '/projects/halcyon-process-monitor/': [
            {
              text: 'Halcyon Process Monitor',
              items: [
                { text: 'Overview', link: '/projects/halcyon-process-monitor/' },
                { text: 'Architecture', link: '/projects/halcyon-process-monitor/architecture' },
              ],
            },
          ],
          '/projects/externum/': [
            {
              text: 'Externum Language',
              items: [
                { text: 'Overview', link: '/projects/externum/' },
                { text: 'Syntax Reference', link: '/projects/externum/syntax' },
                { text: 'Examples', link: '/projects/externum/examples' },
                { text: 'Compiler & CLI', link: '/projects/externum/compiler' },
                { text: 'Architecture', link: '/projects/externum/architecture' },
              ],
            },
          ],
          '/projects/n2-mesh/': [
            {
              text: 'N2 Mesh (P2P Chat)',
              items: [
                { text: 'Overview', link: '/projects/n2-mesh/' },
                { text: 'Architecture', link: '/projects/n2-mesh/architecture' },
                { text: '🚀 Open Live Chat', link: 'https://bartoszosiej.github.io/n2-mesh/' },
              ],
            },
          ],
        },
        outline: { level: [2, 3], label: 'On this page' },
        lastUpdated: { text: 'Updated', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search docs', buttonAriaLabel: 'Search docs' },
              modal: { noResultsText: 'No results found', resetButtonTitle: 'Clear', footer: {} },
            },
          },
        },
        footer: {
          message: 'Built with VitePress · Published on GitHub Pages',
          copyright: '© 2026 Bartosz Osiej',
        },
      },
    },
    pl: {
      label: 'Polski',
      lang: 'pl',
      link: '/pl/',
      description: 'Centralne centrum dokumentacji wszystkich projektów Bartosza Osieja — LinkShort, Novactorio, NV2 Engine, AURORA OS, zestaw narzędzi cyberbezpieczeństwa, monitor procesów Halcyon oraz język programowania Externum.',
      themeConfig: {
        nav: [
          { text: 'Start', link: '/' },
          { text: 'Projekty', link: '/projects/' },
          { text: 'LinkShort', link: '/projects/fastapi-url/' },
          { text: 'Novactorio', link: '/projects/factorio-web-game/' },
          { text: 'NV2 Engine', link: '/projects/nv2-engine/' },
          { text: 'Cybersec', link: '/projects/cybersec-tools/' },
          { text: 'AURORA OS', link: '/projects/aurora-os/' },
          { text: 'Externum', link: '/projects/externum/' },
          { text: 'N2 Mesh', link: '/projects/n2-mesh/' },
          {
            text: 'Więcej',
            items: [
              { text: 'Monitor Procesów Halcyon', link: '/projects/halcyon-process-monitor/' },
              { text: '📖 Książka PDF i Tłumacz', link: '/translator' },
              { text: 'Przepływ aktualizacji', link: '/update-flow' },
            ],
          },
        ],
        sidebar: {
          '/projects/': [
            {
              text: 'Wszystkie projekty',
              items: [
                { text: '📁 Projekty', link: '/projects/' },
                { text: '💬 N2 Mesh (czat P2P)', link: '/projects/n2-mesh/' },
                { text: '🔗 LinkShort', link: '/projects/fastapi-url/' },
                { text: '🏭 Novactorio', link: '/projects/factorio-web-game/' },
                { text: '⛏️ NV2 Engine', link: '/projects/nv2-engine/' },
                { text: '◈ AURORA OS', link: '/projects/aurora-os/' },
                { text: '🛡️ Cybersec Toolkit', link: '/projects/cybersec-tools/' },
                { text: '🛰️ Monitor Halcyon', link: '/projects/halcyon-process-monitor/' },
                { text: '📜 Externum', link: '/projects/externum/' },
                { text: '📖 Książka PDF i Tłumacz', link: '/translator' },
              ],
            },
          ],
          '/projects/fastapi-url/': [
            {
              text: 'LinkShort (FastAPI-url)',
              items: [
                { text: 'Przegląd', link: '/projects/fastapi-url/' },
                { text: 'Pierwsze kroki', link: '/projects/fastapi-url/getting-started' },
                { text: 'Referencja API', link: '/projects/fastapi-url/api-reference' },
                { text: 'Wdrożenie', link: '/projects/fastapi-url/deployment' },
              ],
            },
          ],
          '/projects/factorio-web-game/': [
            {
              text: 'Novactorio (Factorio-web-game)',
              items: [
                { text: 'Przegląd', link: '/projects/factorio-web-game/' },
                { text: 'Architektura', link: '/projects/factorio-web-game/architecture' },
                { text: 'Systemy gry', link: '/projects/factorio-web-game/gameplay' },
                { text: 'Backend i monetyzacja', link: '/projects/factorio-web-game/backend' },
              ],
            },
          ],
          '/projects/cybersec-tools/': [
            {
              text: 'Cybersec Toolkit',
              items: [
                { text: 'Przegląd', link: '/projects/cybersec-tools/' },
                { text: 'NetRecon', link: '/projects/cybersec-tools/netrecon' },
                { text: 'ShadowScan', link: '/projects/cybersec-tools/shadowscan' },
                { text: 'HashSleuth', link: '/projects/cybersec-tools/hashsleuth' },
                { text: 'PacketEye', link: '/projects/cybersec-tools/packeteye' },
              ],
            },
          ],
          '/projects/aurora-os/': [
            {
              text: 'AURORA OS',
              items: [
                { text: 'Przegląd', link: '/projects/aurora-os/' },
                { text: 'Architektura', link: '/projects/aurora-os/architecture' },
                { text: 'Podręcznik użytkownika', link: '/projects/aurora-os/user-guide' },
              ],
            },
          ],
          '/projects/nv2-engine/': [
            {
              text: 'NV2 Engine',
              items: [
                { text: 'Przegląd', link: '/projects/nv2-engine/' },
                { text: 'Architektura', link: '/projects/nv2-engine/architecture' },
                { text: 'Rozgrywka', link: '/projects/nv2-engine/gameplay' },
                { text: 'Bloki i biomy', link: '/projects/nv2-engine/blocks' },
                { text: 'Referencja craftingu', link: '/projects/nv2-engine/crafting' },
                { text: 'Symulacja wody', link: '/projects/nv2-engine/water' },
                { text: 'System roślinności AI', link: '/projects/nv2-engine/ai' },
                { text: 'Wydajność', link: '/projects/nv2-engine/performance' },
                { text: 'Rozwój', link: '/projects/nv2-engine/development' },
                { text: 'Plan i zmiany', link: '/projects/nv2-engine/roadmap' },
              ],
            },
          ],
          '/projects/halcyon-process-monitor/': [
            {
              text: 'Monitor Procesów Halcyon',
              items: [
                { text: 'Przegląd', link: '/projects/halcyon-process-monitor/' },
                { text: 'Architektura', link: '/projects/halcyon-process-monitor/architecture' },
              ],
            },
          ],
          '/projects/externum/': [
            {
              text: 'Język Externum',
              items: [
                { text: 'Przegląd', link: '/projects/externum/' },
                { text: 'Referencja składni', link: '/projects/externum/syntax' },
                { text: 'Przykłady', link: '/projects/externum/examples' },
                { text: 'Kompilator i CLI', link: '/projects/externum/compiler' },
                { text: 'Architektura', link: '/projects/externum/architecture' },
              ],
            },
          ],
          '/projects/n2-mesh/': [
            {
              text: 'N2 Mesh (czat P2P)',
              items: [
                { text: 'Przegląd', link: '/projects/n2-mesh/' },
                { text: 'Architektura', link: '/projects/n2-mesh/architecture' },
                { text: '🚀 Otwórz czat', link: 'https://bartoszosiej.github.io/n2-mesh/' },
              ],
            },
          ],
        },
        outline: { level: [2, 3], label: 'Na tej stronie' },
        lastUpdated: { text: 'Zaktualizowano', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Szukaj w dokumentacji', buttonAriaLabel: 'Szukaj w dokumentacji' },
              modal: {
                noResultsText: 'Brak wyników',
                resetButtonTitle: 'Wyczyść',
                footer: { selectText: 'aby wybrać', navigateText: 'aby nawigować', closeText: 'aby zamknąć' },
              },
            },
          },
        },
        footer: {
          message: 'Zbudowano z VitePress · Opublikowano na GitHub Pages',
          copyright: '© 2026 Bartosz Osiej',
        },
      },
      markdown: {
        codeCopyButton: { tooltipText: 'Kopiuj kod', copiedText: 'Skopiowano' },
      },
    },
  },
})
