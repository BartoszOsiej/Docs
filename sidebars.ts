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
      label: 'Meshcore (P2P Chat)',
      collapsed: true,
      items: ['projects/n2-mesh/index', 'projects/n2-mesh/architecture', 'projects/n2-mesh/tests'],
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
        'projects/fastapi-url/tests',
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
        'projects/factorio-web-game/tests',
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
        'projects/nv2-engine/tests',
      ],
    },
    {
      type: 'category',
      label: 'CyberForge',
      collapsed: true,
      items: [
        'projects/cybersec-tools/index',
        'projects/cybersec-tools/netrecon',
        'projects/cybersec-tools/shadowscan',
        'projects/cybersec-tools/hashsleuth',
        'projects/cybersec-tools/packeteye',
        'projects/cybersec-tools/tests',
      ],
    },
    {
      type: 'category',
      label: 'Aurora',
      collapsed: true,
      items: [
        'projects/aurora-os/index',
        'projects/aurora-os/architecture',
        'projects/aurora-os/user-guide',
        'projects/aurora-os/tests',
      ],
    },
    {
      type: 'category',
      label: 'Talus',
      collapsed: true,
      items: [
        'projects/talus-process-monitor/index',
        'projects/talus-process-monitor/architecture',
        'projects/talus-process-monitor/tests',
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
        'projects/externum/tests',
      ],
    },
    {
      type: 'category',
      label: 'QuantumShield',
      collapsed: true,
      items: [
        'projects/pqguard/index',
        'projects/pqguard/tests',
      ],
    },
    {
      type: 'category',
      label: 'TrustNode',
      collapsed: true,
      items: [
        'projects/solana-validator/index',
        'projects/solana-validator/tests',
      ],
    },
    {
      type: 'category',
      label: 'Promptbox',
      collapsed: true,
      items: [
        'projects/prompt-inbox/index',
        'projects/prompt-inbox/tests',
      ],
    },
    {
      type: 'doc',
      id: 'translator',
      label: 'PDF Book & Translator',
    },
    {
      type: 'doc',
      id: 'energy',
      label: '⚡ Energy Research',
    },
    {
      type: 'doc',
      id: 'rd',
      label: 'R&D',
    },
    {
      type: 'doc',
      id: 'qa',
      label: 'QA & Test Reports',
    },
    {
      type: 'doc',
      id: 'tests',
      label: 'Tests — this site',
    },
    {
      type: 'doc',
      id: 'update-flow',
      label: 'Update Flow',
    },
  ],
}

export default sidebars
