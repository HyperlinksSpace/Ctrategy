/**
 * Localized copy for header dropdown menus (by item id).
 */
(function () {
  'use strict';

  window.HLS_NAVDD = {
    labels: {
      en: {
        products: 'Products',
        research: 'Research',
        tech: 'Technologies',
        inProduction: 'In production',
        buildingToward: 'Building toward',
        inDevelopment: 'In development',
        roadmap: 'Roadmap'
      },
      ru: {
        products: 'Продукты',
        research: 'Исследования',
        tech: 'Технологии',
        inProduction: 'В продакшене',
        buildingToward: 'В разработке',
        inDevelopment: 'В разработке',
        roadmap: 'Дорожная карта'
      },
      zh: {
        products: '产品',
        research: '研究',
        tech: '技术',
        inProduction: '已上线',
        buildingToward: '规划中',
        inDevelopment: '开发中',
        roadmap: '路线图'
      }
    },
    intros: {
      en: {
        products: 'Live platforms that fund Earth operations while the interplanetary protocol stack matures.',
        research: 'Research aligned with the long-term strategy — ledger integration, edge AI, agentic automation, and deep-space networking.',
        tech: 'Production systems in use today and hardened protocols under development for industrial and orbital scale.'
      },
      ru: {
        products: 'Рабочие платформы, которые финансируют земные операции, пока зреет межпланетный протокольный стек.',
        research: 'Исследования по долгосрочной стратегии: интеграция реестров, периферийный ИИ, автоматизация с агентами и сети глубокого космоса.',
        tech: 'Системы в продакшене сегодня и закалённые протоколы для промышленного и орбитального масштаба.'
      },
      zh: {
        products: '支撑地球业务的在运平台，同时完善星际协议栈。',
        research: '与长期战略一致的研发：账本集成、边缘智能、智能体自动化与深空网络。',
        tech: '今日在运系统，以及面向工业与轨道规模的在研加固协议。'
      }
    },
    items: {
      hsp: {
        en: { name: 'Hyperlinks Space Program', tagline: 'AI & multi-ledger platform', desc: 'Managing, investing, and earning on assets — recommendations, chats, swaps, trades, wallets, and deals. AI Transmitter reads ledger data in real time.' },
        ru: { name: 'Hyperlinks Space Program', tagline: 'Платформа ИИ и нескольких реестров', desc: 'Управление активами, инвестиции и заработок: рекомендации, чаты, обмены, сделки и кошельки. AI Transmitter читает данные реестров в реальном времени.' },
        zh: { name: 'Hyperlinks Space Program', tagline: 'AI 与多账本平台', desc: '管理、投资与获取资产收益——推荐、聊天、兑换、交易、钱包与交易室。AI Transmitter 实时读取账本数据。' }
      },
      aityuahn: {
        en: { name: 'AityUahn', tagline: 'Build with Agentic AI', desc: 'Agentic AI development platform for automated software creation and autonomous engineering pipelines.' },
        ru: { name: 'AityUahn', tagline: 'Разработка с агентным ИИ', desc: 'Платформа агентного ИИ для автоматизированной разработки ПО и автономных инженерных конвейеров.' },
        zh: { name: 'AityUahn', tagline: '智能体 AI 开发', desc: '用于自动化软件创建与自主工程流水线的智能体 AI 平台。' }
      },
      whatswap: {
        en: { name: 'WhatSwap', tagline: 'Best price swaps', desc: 'Multi-ledger swap aggregator with best-execution routing across integrated networks.' },
        ru: { name: 'WhatSwap', tagline: 'Лучшая цена обмена', desc: 'Агрегатор обменов по нескольким реестрам с маршрутизацией лучшего исполнения по подключённым сетям.' },
        zh: { name: 'WhatSwap', tagline: '最优兑换价格', desc: '跨集成网络、按最优执行路由的多账本兑换聚合器。' }
      },
      blockchain: {
        en: { name: 'Ledger Integration Layer', desc: 'Smart contracts, tokenized backends, stablecoins, NFT infrastructure, and on-chain deal history.' },
        ru: { name: 'Слой интеграции реестров', desc: 'Смарт-контракты, токенизированные серверы, стейблкоины, NFT и история сделок в блокчейне.' },
        zh: { name: '账本集成层', desc: '智能合约、代币化后端、稳定币、NFT 基础设施与链上交易记录。' }
      },
      'edge-ai': {
        en: { name: 'Edge AI & TinyModel', desc: 'Distributed inference, model sharding, and edge-native AI on consumer hardware.' },
        ru: { name: 'Периферийный ИИ и TinyModel', desc: 'Распределённый вывод моделей, разбиение моделей и ИИ на периферийном оборудовании.' },
        zh: { name: '边缘 AI 与 TinyModel', desc: '分布式推理、模型分片与消费者硬件上的边缘原生 AI。' }
      },
      'agentic-ai': {
        en: { name: 'Agentic AI Automation', desc: 'Fully automated software engineering with agentic AI pipelines.' },
        ru: { name: 'Автоматизация с агентным ИИ', desc: 'Полностью автоматизированная разработка ПО с конвейерами агентного ИИ.' },
        zh: { name: '智能体 AI 自动化', desc: '基于智能体 AI 流水线的全自动化软件工程。' }
      },
      'ai-blockchain': {
        en: { name: 'AI Ledger Networks', desc: 'Cognitive bridges synchronizing data across fragmented networks under stress and delay.' },
        ru: { name: 'ИИ-сети реестров', desc: 'Когнитивные мосты синхронизации данных через разрозненные сети при нагрузке и задержках.' },
        zh: { name: 'AI 账本网络', desc: '在压力与延迟下跨分散网络同步数据的认知桥梁。' }
      },
      'freelance-dao': {
        en: { name: 'Tokenized Freelance & DAO', desc: 'Smart-contract-secured deals and decentralized labor markets on integrated ledgers.' },
        ru: { name: 'Токенизированный фриланс и DAO', desc: 'Сделки под смарт-контрактами и децентрализованные рынки труда на интегрированных реестрах.' },
        zh: { name: '代币化自由职业与 DAO', desc: '集成账本上由智能合约保障的交易与去中心化劳务市场。' }
      },
      'space-infra': {
        en: { name: 'Interplanetary Infrastructure', desc: 'DTN bundle protocol, CRDT state graphs, and Earth–space coordination standards.' },
        ru: { name: 'Межпланетная инфраструктура', desc: 'Протокол DTN Bundle, графы состояний CRDT и стандарты координации Земля–космос.' },
        zh: { name: '星际基础设施', desc: 'DTN Bundle 协议、CRDT 状态图与地空协调标准。' }
      },
      'ledger-integration': {
        en: { name: 'Multi-Ledger Integration', desc: 'Smart contracts, wallet connectivity, and messenger mini-app integration.' },
        ru: { name: 'Интеграция нескольких реестров', desc: 'Смарт-контракты, подключение кошельков и мини-приложения в мессенджерах.' },
        zh: { name: '多账本集成', desc: '智能合约、钱包连接与 Messenger 迷你应用集成。' }
      },
      typescript: {
        en: { name: 'TypeScript / Web Stack', desc: 'Frontends, APIs, TMA templates, and multi-platform web clients.' },
        ru: { name: 'TypeScript / веб-стек', desc: 'Фронтенды, API, шаблоны TMA и веб-клиенты для нескольких платформ.' },
        zh: { name: 'TypeScript / Web 栈', desc: '前端、API、TMA 模板与多平台 Web 客户端。' }
      },
      'smart-contracts': {
        en: { name: 'Smart Contract Layer', desc: 'On-chain swaps, NFT minters, DAO contracts, and payment counters.' },
        ru: { name: 'Слой смарт-контрактов', desc: 'Обмены в блокчейне, выпуск NFT, контракты DAO и платёжные счётчики.' },
        zh: { name: '智能合约层', desc: '链上兑换、NFT 铸造、DAO 合约与支付计数器。' }
      },
      'ai-ml': {
        en: { name: 'AI / ML (Python & Edge)', desc: 'TinyModel edge runtime, research simulations, and AI transmitters.' },
        ru: { name: 'ИИ / ML (Python и периферия)', desc: 'Среда TinyModel на периферии, исследовательские симуляции и AI Transmitter.' },
        zh: { name: 'AI / ML（Python 与边缘）', desc: 'TinyModel 边缘运行时、研究仿真与 AI Transmitter。' }
      },
      telegram: {
        en: { name: 'Messenger Mini Apps & Bots', desc: 'Wallet, swap, and careers bots with in-chat commerce.' },
        ru: { name: 'Мини-приложения и боты в мессенджерах', desc: 'Кошельки, боты обмена и карьеры, торговля в чате.' },
        zh: { name: 'Messenger 迷你应用与机器人', desc: '钱包、兑换机器人、职业机器人与聊天内交易。' }
      },
      unity: {
        en: { name: 'Unity / Game Integration', desc: 'Wallet connectivity inside Unity web applications.' },
        ru: { name: 'Unity / игровая интеграция', desc: 'Подключение кошельков в веб-приложениях на Unity.' },
        zh: { name: 'Unity / 游戏集成', desc: 'Unity Web 应用中的钱包连接。' }
      },
      'rust-core': {
        en: { name: 'Rust / C++ / Zig Core Runtime', desc: 'Zero-dependency autonomous runtime with embedded CRDTs and protocol bridges.' },
        ru: { name: 'Ядро на Rust / C++ / Zig', desc: 'Автономная среда без лишних зависимостей со встроенными CRDT и протокольными мостами.' },
        zh: { name: 'Rust / C++ / Zig 核心运行时', desc: '零外部依赖的自主运行时，内嵌 CRDT 与协议桥。' }
      },
      mqtt: {
        en: { name: 'MQTT Broker', desc: 'Pub/sub telemetry for lossy satellite and industrial environments.' },
        ru: { name: 'MQTT Broker', desc: 'Телеметрия pub/sub для спутниковых и промышленных сред с потерями сигнала.' },
        zh: { name: 'MQTT Broker', desc: '面向高丢包卫星与工业环境的 pub/sub 遥测。' }
      },
      opcua: {
        en: { name: 'OPC UA Bridge', desc: 'Industrial semantics bridge for major automation vendors.' },
        ru: { name: 'Мост OPC UA', desc: 'Мост промышленной семантики для ведущих производителей автоматизации.' },
        zh: { name: 'OPC UA Bridge', desc: '面向主流自动化厂商的工业语义桥。' }
      },
      dtn: {
        en: { name: 'DTN Bundle Protocol', desc: 'Store-and-forward networking for Earth–Mars links and conjunction gaps.' },
        ru: { name: 'Протокол DTN Bundle', desc: 'Буферная пересылка для связи Земля–Марс и длительных радиомолчаний.' },
        zh: { name: 'DTN Bundle Protocol', desc: '地火链路与合日通信中断期的存储转发网络。' }
      },
      crdt: {
        en: { name: 'CRDT Engine', desc: 'Conflict-free replicated state for nodes millions of kilometers apart.' },
        ru: { name: 'Движок CRDT', desc: 'Бесконфликтное реплицируемое состояние для узлов на расстоянии миллионов километров.' },
        zh: { name: 'CRDT Engine', desc: '相距数百万公里节点的无冲突复制状态引擎。' }
      },
      neuromorphic: {
        en: { name: 'Neuromorphic Edge Firmware', desc: 'Reference silicon specs and firmware for protocol-native edge chips.' },
        ru: { name: 'Нейроморфная периферийная прошивка', desc: 'Эталонные спецификации кремния и прошивки для периферийных чипов с нативными протоколами.' },
        zh: { name: '神经形态边缘固件', desc: '协议原生边缘芯片的参考硅规格与固件。' }
      }
    }
  };
})();
