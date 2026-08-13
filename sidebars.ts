import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

// Clean sidebar: one category per project, no emoji overload.
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Projects',
      collapsed: false,
      items: ['projects/index'],
    },
    {
      type: 'category',
      label: 'N2 Mesh (P2P Chat)',
      collapsed: true,
      items: ['projects/n2-mesh/index', 'projects/n2-mesh/architecture'],
    },
    {
      type: 'category',
      label: 'LinkShort',
      collapsed: true,
      items: [
        'projects/fastapi-url/index',
        'projects/fastapi-url/getting-started',
        'projects/fastapi-url/api-reference',
        'projects/fastapi-url/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Novactorio',
      collapsed: true,
      items: [
        'projects/factorio-web-game/index',
        'projects/factorio-web-game/architecture',
        'projects/factorio-web-game/gameplay',
        'projects/factorio-web-game/backend',
      ],
    },
    {
      type: 'category',
      label: 'NV2 Engine',
      collapsed: true,
      items: [
        'projects/nv2-engine/index',
        'projects/nv2-engine/architecture',
        'projects/nv2-engine/gameplay',
        'projects/nv2-engine/blocks',
        'projects/nv2-engine/crafting',
        'projects/nv2-engine/water',
        'projects/nv2-engine/ai',
        'projects/nv2-engine/performance',
        'projects/nv2-engine/development',
        'projects/nv2-engine/roadmap',
      ],
    },
    {
      type: 'category',
      label: 'Cybersec Toolkit',
      collapsed: true,
      items: [
        'projects/cybersec-tools/index',
        'projects/cybersec-tools/netrecon',
        'projects/cybersec-tools/shadowscan',
        'projects/cybersec-tools/hashsleuth',
        'projects/cybersec-tools/packeteye',
      ],
    },
    {
      type: 'category',
      label: 'AURORA OS',
      collapsed: true,
      items: [
        'projects/aurora-os/index',
        'projects/aurora-os/architecture',
        'projects/aurora-os/user-guide',
      ],
    },
    {
      type: 'category',
      label: 'Halcyon Process Monitor',
      collapsed: true,
      items: [
        'projects/halcyon-process-monitor/index',
        'projects/halcyon-process-monitor/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Externum',
      collapsed: true,
      items: [
        'projects/externum/index',
        'projects/externum/syntax',
        'projects/externum/examples',
        'projects/externum/compiler',
        'projects/externum/architecture',
      ],
    },
    {
      type: 'doc',
      id: 'translator',
      label: 'PDF Book & Translator',
    },
    {
      type: 'doc',
      id: 'qa',
      label: 'QA & Test Reports',
    },
    {
      type: 'doc',
      id: 'update-flow',
      label: 'Update Flow',
    },
  ],
}

export default sidebars
