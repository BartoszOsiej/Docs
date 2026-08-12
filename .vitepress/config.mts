import { defineConfig } from 'vitepress'

// Base path for GitHub Pages: https://BartoszOsiej.github.io/Docs/
export default defineConfig({
  title: 'Bartosz Osiej — Docs',
  description: 'Central documentation hub for FastAPI-url (LinkShort), Factorio-web-game (Novactorio) and NV2 Engine.',
  lang: 'en-US',
  base: '/Docs/',
  cleanUrls: true,
  ignoreDeadLinks: [/^http:\/\/localhost/],
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Docs/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:title', content: 'Bartosz Osiej — Docs' }],
    ['meta', { property: 'og:description', content: 'Central documentation hub for FastAPI-url, Factorio-web-game and NV2 Engine.' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'LinkShort', link: '/projects/fastapi-url/' },
      { text: 'Novactorio', link: '/projects/factorio-web-game/' },
      { text: 'NV2 Engine', link: '/projects/nv2-engine/' },
      { text: 'Update Flow', link: '/update-flow' },
    ],
    sidebar: {
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
