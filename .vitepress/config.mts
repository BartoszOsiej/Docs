import { defineConfig } from 'vitepress'

// Base path for GitHub Pages: https://BartoszOsiej.github.io/Docs/
export default defineConfig({
  title: 'Bartosz Osiej — Docs',
  description: 'Central documentation hub for all Bartosz Osiej projects — LinkShort, Novactorio, NV2 Engine, AURORA OS, the Cybersec Toolkit, Halcyon Process Monitor and the Externum programming language.',
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
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Projects', link: '/projects/' },
      { text: 'LinkShort', link: '/projects/fastapi-url/' },
      { text: 'Novactorio', link: '/projects/factorio-web-game/' },
      { text: 'NV2 Engine', link: '/projects/nv2-engine/' },
      { text: 'Cybersec', link: '/projects/cybersec-tools/' },
      { text: 'AURORA OS', link: '/projects/aurora-os/' },
      { text: 'Externum', link: '/projects/externum/' },
      { text: 'P2P Chat', link: '/chat/' },
      {
        text: 'More',
        items: [
          { text: 'Halcyon Process Monitor', link: '/projects/halcyon-process-monitor/' },
          { text: 'Factory Defense', link: '/projects/factory-defense/' },
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
            { text: '💬 P2P Chat', link: '/chat/' },
            { text: '🔗 LinkShort', link: '/projects/fastapi-url/' },
            { text: '🏭 Novactorio', link: '/projects/factorio-web-game/' },
            { text: '⛏️ NV2 Engine', link: '/projects/nv2-engine/' },
            { text: '◈ AURORA OS', link: '/projects/aurora-os/' },
            { text: '🛡️ Cybersec Toolkit', link: '/projects/cybersec-tools/' },
            { text: '🛰️ Halcyon Monitor', link: '/projects/halcyon-process-monitor/' },
            { text: '📜 Externum', link: '/projects/externum/' },
            { text: '🏭 Factory Defense', link: '/projects/factory-defense/' },
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
      '/projects/factory-defense/': [
        {
          text: 'Factory Defense',
          items: [{ text: 'Overview', link: '/projects/factory-defense/' }],
        },
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BartoszOsiej' },
    ],
  },
})
