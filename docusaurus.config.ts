import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { themes as prismThemes } from 'prism-react-renderer'

// Base path for GitHub Pages: https://BartoszOsiej.github.io/Docs/
const config: Config = {
  title: 'Bartosz Osiej — Docs',
  tagline:
    'Central documentation hub for all Bartosz Osiej projects — LinkShort, Novactorio, NV2 Engine, AURORA OS, the Cybersec Toolkit, Halcyon Process Monitor and the Externum programming language.',
  favicon: 'favicon.svg',
  url: 'https://bartoszosiej.github.io',
  baseUrl: '/Docs/',
  organizationName: 'BartoszOsiej',
  projectName: 'Docs',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    localeConfigs: {
      en: { label: 'English' },
      pl: { label: 'Polski' },
    },
  },
  headTags: [
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap',
      },
    },
    { tagName: 'meta', attributes: { name: 'theme-color', content: '#0f172a' } },
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/search/**'],
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'logo.svg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Bartosz Osiej',
      logo: { alt: 'Bartosz Osiej — Docs', src: 'logo.svg' },
      hideOnScroll: true,
      items: [
        { type: 'doc', docId: 'projects/index', position: 'left', label: 'Projects' },
        {
          type: 'dropdown',
          position: 'left',
          label: 'Docs',
          items: [
            { type: 'doc', docId: 'projects/fastapi-url/index', label: 'LinkShort' },
            { type: 'doc', docId: 'projects/factorio-web-game/index', label: 'Novactorio' },
            { type: 'doc', docId: 'projects/nv2-engine/index', label: 'NV2 Engine' },
            { type: 'doc', docId: 'projects/cybersec-tools/index', label: 'Cybersec Toolkit' },
            { type: 'doc', docId: 'projects/aurora-os/index', label: 'AURORA OS' },
            { type: 'doc', docId: 'projects/externum/index', label: 'Externum' },
            { type: 'doc', docId: 'projects/halcyon-process-monitor/index', label: 'Halcyon Monitor' },
            { type: 'doc', docId: 'projects/n2-mesh/index', label: 'N2 Mesh' },
          ],
        },
        { to: 'translator', position: 'left', label: 'PDF Translator' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/BartoszOsiej',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Projects',
          items: [
            { label: 'LinkShort', to: '/projects/fastapi-url/' },
            { label: 'Novactorio', to: '/projects/factorio-web-game/' },
            { label: 'NV2 Engine', to: '/projects/nv2-engine/' },
            { label: 'Cybersec Toolkit', to: '/projects/cybersec-tools/' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'AURORA OS', to: '/projects/aurora-os/' },
            { label: 'Externum', to: '/projects/externum/' },
            { label: 'N2 Mesh (P2P Chat)', to: '/projects/n2-mesh/' },
            { label: 'PDF Book & Translator', to: '/translator' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/BartoszOsiej' },
            { label: 'Halcyon Process Monitor', to: '/projects/halcyon-process-monitor/' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Bartosz Osiej · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
