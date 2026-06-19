/**
 * Hyperlinks Space — site settings
 * Edit texts and links here. Loaded before app.js.
 */
(function () {
  'use strict';

  window.HLS_SETTINGS = {
    promo: {
      headerLabel: 'The Main',
      badge: 'Live · Production',
      title: 'Hyperlinks Space Program',
      url: 'https://www.hyperlinks.space/',
      urlLabel: 'hyperlinks.space',
      description:
        'Shipped multi-ledger platform: non-custodial wallets, settlement and swap routing across integrated networks, escrow deal rooms, and AI Transmitter streaming on-chain events into operator-grade alerts. Revenue funds the industrial protocol stack.',
      features: ['Settlement & swaps', 'AI Transmitter', 'Escrow deal rooms'],
      cta: 'Open hyperlinks.space'
    },

    headerNav: [
      { id: 'tech', label: 'Tech' },
      { id: 'research', label: 'Research' },
      { id: 'products', label: 'Products' }
    ],

    products: [
      {
        id: 'hsp',
        name: 'Hyperlinks Space Program',
        tagline: 'Live multi-ledger operating platform',
        description:
          'Shipped product: wallets, portfolio tools, swap routing, messenger-native deal flows, and AI Transmitter streaming ledger events into actionable alerts. The commercial engine that funds protocol R&D.',
        links: [
          { label: 'Live product', url: 'https://www.hyperlinks.space/' },
          { label: 'GitHub', url: 'https://github.com/HyperlinksSpace/HyperlinksSpaceProgram' }
        ]
      },
      {
        id: 'aityuahn',
        name: 'AityUahn',
        tagline: 'Agentic engineering pipelines',
        description:
          'Research platform for autonomous software delivery—spec-to-binary pipelines with human-in-the-loop gates. Target: cut integration cycles from weeks to hours on the Hyperlinks runtime.',
        links: [
          { label: 'GitHub', url: 'https://github.com/HyperlinksSpace/AityUahn' }
        ]
      },
      {
        id: 'whatswap',
        name: 'WhatSwap',
        tagline: 'Best-execution swap routing',
        description:
          'Multi-ledger swap aggregator with pathfinding and best-execution routing across integrated networks. Production frontends and routing logic reused inside HSP settlement flows.',
        links: [
          { label: 'GitHub', url: 'https://github.com/HyperlinksSpace/whatswap' },
          { label: 'Swap front', url: 'https://github.com/HyperlinksSpace/swap-front' }
        ]
      }
    ],

    research: [
      {
        id: 'blockchain',
        name: 'Ledger Integration Layer',
        description: 'Tokenized backends, stablecoin rails, NFT provenance, and on-chain audit trails for industrial custody and B2B settlement.',
        links: [
          { label: 'BlockchainProgram', url: 'https://github.com/HyperlinksSpace/BlockchainProgram' },
          { label: 'stablecoin-blueprint', url: 'https://github.com/HyperlinksSpace/stablecoin-blueprint' },
          { label: 'ton-nft-dapp', url: 'https://github.com/HyperlinksSpace/ton-nft-dapp' }
        ]
      },
      {
        id: 'edge-ai',
        name: 'Edge AI & TinyModel',
        description: 'Model partitioning, federated inference, and sub-watt anomaly detection on ESP32-class and industrial ARM gateways.',
        links: [
          { label: 'TinyModel', url: 'https://github.com/HyperlinksSpace/TinyModel' }
        ]
      },
      {
        id: 'agentic-ai',
        name: 'Agentic AI Automation',
        description: 'Autonomous build, test, and deploy agents wired into the Hyperlinks protocol repo—reducing manual release overhead.',
        links: [
          { label: 'AityUahn', url: 'https://github.com/HyperlinksSpace/AityUahn' }
        ]
      },
      {
        id: 'ai-blockchain',
        name: 'AI Ledger Networks',
        description: 'Cognitive bridges: reconcile fragmented ledger and off-chain telemetry under latency, reordering, and partial outage.',
        links: [
          { label: 'STUN', url: 'https://github.com/HyperlinksSpace/STUN' }
        ]
      },
      {
        id: 'freelance-dao',
        name: 'Tokenized Labor & DAO',
        description: 'Escrowed milestone contracts, portable reputation, and DAO governance for distributed engineering and field ops on integrated ledgers.',
        links: [
          { label: 'freelance-exchange-tdb', url: 'https://github.com/HyperlinksSpace/freelance-exchange-tdb' },
          { label: 'a-tokenized-freelance-exchange', url: 'https://github.com/HyperlinksSpace/a-tokenized-freelance-exchange' },
          { label: 'freelancer-dao-contract', url: 'https://github.com/HyperlinksSpace/freelancer-dao-contract' }
        ]
      },
      {
        id: 'space-infra',
        name: 'Interplanetary Infrastructure',
        description: 'DTN bundle routing, CRDT state for light-lag partitions, and reference architectures for cis-lunar logistics (world2040, Strategy).',
        links: [
          { label: 'Strategy (this site)', url: 'https://github.com/HyperlinksSpace/Strategy' },
          { label: 'world2040', url: 'https://github.com/HyperlinksSpace/world2040' }
        ]
      }
    ],

    tech: {
      existing: [
        {
          id: 'ledger-integration',
          name: 'Multi-Ledger Integration',
          description: 'Smart contracts, wallet connectivity, and messenger mini-app integration across integrated networks.',
          links: [
            { label: 'hello-frontend', url: 'https://github.com/HyperlinksSpace/hello-frontend' },
            { label: 'ton-router', url: 'https://github.com/HyperlinksSpace/ton-router' }
          ]
        },
        {
          id: 'typescript',
          name: 'TypeScript / Web Stack',
          description: 'Customer-facing surfaces, TMA shells, and API gateways—observation layer only, not safety-critical control.',
          links: [
            { label: 'HyperlinksSpaceProgram', url: 'https://github.com/HyperlinksSpace/HyperlinksSpaceProgram' },
            { label: 'some-tma-template', url: 'https://github.com/HyperlinksSpace/some-tma-template' }
          ]
        },
        {
          id: 'smart-contracts',
          name: 'Smart Contract Layer',
          description: 'Swaps, multisend, NFT minters, and DAO contracts on audited paths for production deployment.',
          links: [
            { label: 'UniversalMultiSender', url: 'https://github.com/HyperlinksSpace/UniversalMultiSender' },
            { label: 'a-wallet-swap-smart-contract', url: 'https://github.com/HyperlinksSpace/a-wallet-swap-smart-contract' }
          ]
        },
        {
          id: 'ai-ml',
          name: 'AI / ML (Python & Edge)',
          description: 'TinyModel prototypes, STUN reconciliation models, and AI Transmitter services feeding live products.',
          links: [
            { label: 'TinyModel', url: 'https://github.com/HyperlinksSpace/TinyModel' },
            { label: 'STUN', url: 'https://github.com/HyperlinksSpace/STUN' }
          ]
        },
        {
          id: 'telegram',
          name: 'Messenger Mini Apps & Bots',
          description: 'Wallet, swap, and careers bots—distribution channel for messenger users without app-store friction.',
          links: [
            { label: 'aWallet', url: 'https://github.com/HyperlinksSpace/aWallet' },
            { label: 'swap-bot', url: 'https://github.com/HyperlinksSpace/swap-bot' }
          ]
        },
        {
          id: 'unity',
          name: 'Unity / Game Integration',
          description: 'Wallet connectivity inside Unity WebGL for gaming economies and virtual asset custody experiments.',
          links: [
            { label: 'Veittech-UnitonConnect', url: 'https://github.com/HyperlinksSpace/Veittech-UnitonConnect' }
          ]
        }
      ],
      planned: [
        {
          id: 'rust-core',
          name: 'Rust / C++ / Zig Core Runtime',
          description: 'Single static binary: embedded CRDT engine, MQTT broker, and OPC UA client with no runtime dependency chain.',
          links: []
        },
        {
          id: 'mqtt',
          name: 'MQTT Broker',
          description: 'Deterministic pub/sub for M2M telemetry—2-byte headers, QoS guarantees, built for lossy RF and plant EMI.',
          links: []
        },
        {
          id: 'opcua',
          name: 'OPC UA Bridge',
          description: 'Semantic ingestion from Siemens, ABB, and Schneider controllers into the Hyperlinks state graph.',
          links: []
        },
        {
          id: 'dtn',
          name: 'DTN Bundle Protocol',
          description: 'Store-and-forward routing for Earth–Mars links, conjunction gaps, and maritime dead zones.',
          links: []
        },
        {
          id: 'crdt',
          name: 'CRDT Engine',
          description: 'Partition-tolerant merge for nodes separated by kilometers—or millions of kilometers—without a central coordinator.',
          links: []
        },
        {
          id: 'neuromorphic',
          name: 'Neuromorphic Edge Firmware',
          description: 'Reference silicon and firmware specs for protocol-native inference at milliwatt budgets.',
          links: []
        }
      ]
    },

    heroActions: [
      { label: 'Explore Roadmap', href: '#roadmap', style: 'primary', i18n: 'hero.cta1' },
      { label: 'Open hyperlinks.space', href: 'https://www.hyperlinks.space/', style: 'promo', external: true, i18n: 'promo.cta' },
      { label: 'GitHub Organization', href: 'https://github.com/HyperlinksSpace', style: 'ghost', external: true, i18n: 'hero.cta2' }
    ],

    aiChat: {
      enabled: true,
      endpoint: 'https://www.hyperlinks.space/api/ai',
      preferSameOrigin: true,
      format: 'hsp',
      mode: 'chat',
      maxHistory: 12,
      model: 'gpt-4o-mini',
      apiKey: '',
      instructions: {
        en:
          'You are AI CORE, executive briefing assistant for Hyperlinks Space. Answer with precision: lead with the decision or outcome, cite concrete protocols (MQTT, OPC UA, DTN, CRDT, TinyModel) and products (HSP, WhatSwap, AI Transmitter) when relevant. For navigation, accept section names (Vision, Pillars, Roadmap, etc.) or a guided tour. Voice replies: two to four sentences unless the user asks for depth.',
        ru:
          'Вы — AI CORE, брифинг-ассистент Hyperlinks Space. Отвечайте точно: сначала решение или результат, при необходимости называйте протоколы (MQTT, OPC UA, DTN, CRDT, TinyModel) и продукты (HSP, WhatSwap, AI Transmitter). Для навигации — названия разделов или тур. Голос: 2–4 предложения, если не просят подробнее.',
        zh:
          '你是 AI CORE，Hyperlinks Space 的执行简报助手。回答要精确：先给出结论或成果，必要时点明协议（MQTT、OPC UA、DTN、CRDT、TinyModel）与产品（HSP、WhatSwap、AI Transmitter）。导航可接受章节名或导览。语音回复 2–4 句，除非用户要求展开。'
      }
    },

    dropdownIntros: {
      products: 'Revenue-generating platforms in production today—each funds the industrial protocol roadmap.',
      research: 'Peer-reviewed engineering bets aligned to the $1T plan: ledger integration, edge AI, agentic delivery, and deep-space networking.',
      tech: 'What ships in GitHub now—and the hardened runtime, bridges, and silicon references entering the roadmap next.'
    }
  };
})();
