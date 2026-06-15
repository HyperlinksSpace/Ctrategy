(function () {
  'use strict';

  var SECTIONS = [
    {
      id: 'vision',
      nameKey: 'nav.vision',
      descKey: 'vision.desc',
      words: {
        en: ['vision', 'summary', 'paradigm', 'bootstrap', 'executive', 'shift'],
        ru: ['видение', 'резюме', 'парадигм', 'bootstrap', 'смен'],
        zh: ['愿景', '摘要', '范式', 'bootstrap', '转变']
      }
    },
    {
      id: 'pillars',
      nameKey: 'nav.pillars',
      descKey: 'pillars.desc',
      words: {
        en: ['pillar', 'protocol', 'mqtt', 'opc', 'dtn', 'crdt', 'tinymodel', 'stack'],
        ru: ['столп', 'протокол', 'mqtt', 'opc', 'dtn', 'crdt', 'tinymodel', 'стек'],
        zh: ['支柱', '协议', 'mqtt', 'opc', 'dtn', 'crdt', 'tinymodel', '栈']
      }
    },
    {
      id: 'earth-space',
      nameKey: 'nav.earthSpace',
      descKey: 'matrix.title',
      words: {
        en: ['earth', 'space', 'market', 'dual', 'cash', 'lunar', 'matrix'],
        ru: ['земл', 'космос', 'рынок', 'dual', 'cash', 'лун'],
        zh: ['地球', '太空', '市场', '双', '现金', '月球']
      }
    },
    {
      id: 'roadmap',
      nameKey: 'nav.roadmap',
      descKey: 'roadmap.desc',
      words: {
        en: ['roadmap', 'road map', 'phase', 'plan', 'timeline', 'trillion', 'bootstrap'],
        ru: ['дорож', 'карт', 'фаз', 'план', 'триллион', 'bootstrap'],
        zh: ['路线', '阶段', '计划', '万亿', 'bootstrap']
      }
    },
    {
      id: 'architecture',
      nameKey: 'nav.architecture',
      descKey: 'arch.desc',
      words: {
        en: ['architecture', 'arch', 'stack', 'tinymodel', 'transmitter', 'hsp', 'layer'],
        ru: ['архитект', 'стек', 'tinymodel', 'transmitter', 'hsp', 'слой'],
        zh: ['架构', '栈', 'tinymodel', 'transmitter', 'hsp', '层']
      }
    },
    {
      id: 'revenue',
      nameKey: 'nav.revenue',
      descKey: 'revenue.title',
      words: {
        en: ['revenue', 'money', 'monet', 'income', 'saas', 'freight'],
        ru: ['доход', 'выруч', 'монет', 'saas', 'фрахт'],
        zh: ['收入', '赚钱', '变现', 'saas', '货运']
      }
    },
    {
      id: 'moats',
      nameKey: 'nav.moats',
      descKey: 'moats.title',
      words: {
        en: ['moat', 'moats', 'advantage', 'lock-in', 'competitive', 'win'],
        ru: ['moat', 'moats', 'преимущ', 'lock-in', 'конкур'],
        zh: ['护城河', 'moat', '优势', 'lock-in', '竞争']
      }
    },
    {
      id: 'north-star',
      nameKey: 'nav.northStar',
      descKey: 'north.title',
      words: {
        en: ['north', 'star', 'future', 'mission', '2040', 'trillion', 'infrastructure'],
        ru: ['поляр', 'звезд', 'будущ', 'мисс', '2040', 'триллион'],
        zh: ['北极星', '未来', '使命', '2040', '万亿']
      }
    }
  ];

  var GREET_WORDS = {
    en: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good evening'],
    ru: ['привет', 'здрав', 'добрый', 'хай', 'йо'],
    zh: ['你好', '您好', '嗨', '早上好', '晚上好']
  };

  var HELP_WORDS = {
    en: ['help', 'guide', 'navigate', 'what can', 'sections', 'menu'],
    ru: ['помощ', 'помог', 'гид', 'навигац', 'раздел', 'меню'],
    zh: ['帮助', '导航', '章节', '菜单', '怎么用']
  };

  var TOUR_WORDS = {
    en: ['tour', 'walk me', 'show all', 'everything', 'quick tour'],
    ru: ['тур', 'покажи вс', 'обойди', 'все раздел'],
    zh: ['导览', ' tour', '全部', '所有章节', '快速']
  };

  var HERE_WORDS = {
    en: ['where am i', 'current section', 'where are we', 'this section'],
    ru: ['где я', 'текущ', 'какой раздел', 'где мы'],
    zh: ['我在哪', '当前', '哪个章节', '我们在哪']
  };

  var THANK_WORDS = {
    en: ['thanks', 'thank you', 'thx', 'cool', 'nice'],
    ru: ['спасиб', 'благодар', 'круто', 'класс'],
    zh: ['谢谢', '感谢', '棒', '好']
  };

  var state = {
    messagesEl: null,
    chipsEl: null,
    inputEl: null,
    formEl: null,
    voiceBtn: null,
    micBtn: null,
    typing: false,
    tourTimer: null,
    tourIndex: 0,
    reducedMotion: false,
    voiceEnabled: true,
    speechSupported: false,
    recognitionSupported: false,
    listening: false,
    recognition: null,
    lastLang: null,
    ready: false,
    speaking: false,
    speechResolve: null,
    micPermissionGranted: null,
    micAutoStart: false,
    micStream: null,
    micPausedForTour: false,
    aiPending: false,
    thinkingEl: null
  };

  var VOICE_KEY = 'hls-ai-voice';
  var SPEECH_LANG = { en: 'en-US', ru: 'ru-RU', zh: 'zh-CN' };
  var speechVoices = [];

  function getLang() {
    return (window.HLS && window.HLS.getLang) ? window.HLS.getLang() : 'en';
  }

  function t(key, vars) {
    if (window.HLS && window.HLS.t) return window.HLS.t(key, vars, getLang());
    return key;
  }

  function sectionMeta(id) {
    var sec = SECTIONS.filter(function (s) { return s.id === id; })[0];
    if (!sec) return { name: id, desc: '' };
    return { name: t(sec.nameKey), desc: t(sec.descKey) };
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function matchesAny(text, words) {
    for (var i = 0; i < words.length; i++) {
      if (text.indexOf(words[i]) !== -1) return true;
    }
    return false;
  }

  function detectSection(text) {
    var lang = getLang();
    var best = null;
    var bestScore = 0;

    SECTIONS.forEach(function (sec) {
      var words = sec.words[lang] || sec.words.en;
      var score = 0;
      words.forEach(function (w) {
        if (text.indexOf(w) !== -1) score += w.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = sec;
      }
    });

    return bestScore > 0 ? best : null;
  }

  function isGeneralQuestion(text) {
    return /\b(what|why|how|explain|tell me|describe|who|when|where|define|meaning|difference|compare|calculate|solve|write|summarize|translate|что|как|почему|расскаж|объясн|опиши|зачем|什么|怎么|为什么|介绍|解释|是什么)\b/i.test(text);
  }

  function isNavigationIntent(text) {
    if (/^(show|open|go to|take me|navigate|scroll to|jump to|перейди|покажи|открой|打开|去)\b/i.test(text)) {
      return true;
    }
    if (isGeneralQuestion(text)) return false;
    var sec = detectSection(text);
    if (!sec) return false;
    if (text.length <= 28) return true;
    return /\b(section|раздел|章节|chapter|page|страниц)\b/i.test(text);
  }

  function getVisibleSectionId() {
    var ids = SECTIONS.map(function (s) { return s.id; });
    var bestId = null;
    var bestRatio = 0;

    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var visible = Math.max(0, Math.min(rect.bottom, vh * 0.65) - Math.max(rect.top, vh * 0.15));
      var ratio = visible / Math.max(rect.height, 1);
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    return bestRatio > 0.12 ? bestId : null;
  }

  function showThinking() {
    if (!state.messagesEl || state.thinkingEl) return;
    state.thinkingEl = document.createElement('div');
    state.thinkingEl.className = 'ai-core-msg ai-core-msg--bot ai-core-msg--typing ai-core-msg--thinking';
    state.thinkingEl.setAttribute('aria-busy', 'true');
    state.thinkingEl.textContent = t('ai.thinking');
    state.messagesEl.appendChild(state.thinkingEl);
    state.messagesEl.scrollTop = state.messagesEl.scrollHeight;
  }

  function hideThinking() {
    if (state.thinkingEl) {
      state.thinkingEl.remove();
      state.thinkingEl = null;
    }
  }

  function askGeneral(raw) {
    if (state.aiPending || state.typing) return;

    if (!window.HLS || !window.HLS.aiChat || !window.HLS.aiChat.isEnabled()) {
      sayBot('ai.apiOffline');
      return;
    }

    state.aiPending = true;
    showThinking();

    window.HLS.aiChat.ask(raw, getLang()).then(function (result) {
      hideThinking();
      state.aiPending = false;

      if (result.ok && result.text) {
        showBotMessage(result.text, {
          speakText: result.text,
          onDone: maybeAutoStartMic
        });
        return;
      }

      if (result.error === 'network' || result.error === 'invalid_json') {
        sayBot('ai.apiError');
        return;
      }

      sayBot('ai.apiOffline');
    }).catch(function () {
      hideThinking();
      state.aiPending = false;
      sayBot('ai.apiError');
    });
  }

  function scrollToHero() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    window.scrollTo({
      top: 0,
      behavior: state.reducedMotion ? 'auto' : 'smooth'
    });

    document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: 'hero' } }));
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;

    var header = document.querySelector('.site-header');
    var offset = (header ? header.offsetHeight : 0) + 16;
    var y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: state.reducedMotion ? 'auto' : 'smooth'
    });

    document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: id } }));
  }

  function appendBubble(text, role) {
    if (!state.messagesEl) return;
    var bubble = document.createElement('div');
    bubble.className = 'ai-core-msg ai-core-msg--' + (role || 'bot');
    bubble.textContent = text;
    state.messagesEl.appendChild(bubble);
    state.messagesEl.scrollTop = state.messagesEl.scrollHeight;
    return bubble;
  }

  function tVoice(key, vars) {
    var lang = getLang();
    var dict = window.HLS_I18N[lang] || window.HLS_I18N.en;
    var voiceKey = key + 'Voice';
    if (dict[voiceKey]) return t(voiceKey, vars);
    return t(key, vars);
  }

  var RU_SPEECH_PHRASES = [
    ['Hyperlinks Space Program', 'Хайперлинкс Спейс Програм'],
    ['Hyperlinks Space', 'Хайперлинкс Спейс'],
    ['AI Transmitter', 'Эй-Ай Передатчик'],
    ['AI CORE', 'Эй-Ай Кор'],
    ['North Star', 'Полярная звезда'],
    ['Earth and Space', 'Земля и космос'],
    ['Earth & Space', 'Земля и космос'],
    ['cis-lunar', 'сис-лунар'],
    ['interplanetary', 'межпланетный'],
    ['infrastructure', 'инфраструктура'],
    ['trillion-dollar', 'триллионный'],
    ['trillion dollar', 'триллион долларов'],
    ['software as a service', 'сервис как программное обеспечение'],
    ['guided tour', 'гидированный тур'],
    ['protocol bootstrap', 'протокольный бутстрап'],
    ['lean bootstrap', 'лин бутстрап'],
    ['Task-Swapping Protocol', 'протокол Task-Swapping'],
    ['Asset Custody Graph', 'граф Asset Custody'],
    ['чужое железо', 'железо'],
    ['third-party hardware', 'hardware'],
    ['someone else\'s hardware', 'hardware']
  ];

  var RU_SPEECH_WORDS = {
    roadmap: 'дорожная карта',
    vision: 'видение',
    pillars: 'столпы',
    architecture: 'архитектура',
    revenue: 'доходы',
    moats: 'рвы',
    bootstrap: 'бутстрап',
    protocol: 'протокол',
    interplanetary: 'межпланетный',
    infrastructure: 'инфраструктура',
    trillion: 'триллион',
    guided: 'гидированный',
    tour: 'тур',
    online: 'онлайн',
    github: 'гитхаб',
    industry: 'индустрия',
    communication: 'коммуникация',
    processing: 'обработка',
    extraction: 'добыча',
    transport: 'транспорт',
    inhabitation: 'обитание',
    supply: 'снабжение',
    expansion: 'экспансия',
    layer: 'слой',
    sections: 'разделы',
    section: 'раздел',
    strategy: 'стратегия',
    lean: 'лин',
    dollar: 'доллар',
    dollars: 'долларов',
    software: 'софтвер',
    service: 'сервис',
    edge: 'эдж',
    compute: 'компьют',
    inference: 'инференс',
    metering: 'метеринг',
    deployment: 'деплоймент',
    rollout: 'роллаут',
    terrestrial: 'терrestrial',
    lunar: 'лунный',
    martian: 'марсианский',
    orbital: 'орбитальный',
    provenance: 'провенанс',
    escrow: 'эскроу',
    custody: 'кастоди',
    freight: 'фрахт',
    monopoly: 'монополия',
    ledger: 'леджер',
    dormant: 'дормант',
    venture: 'венчур',
    partnerships: 'партнёрства',
    partnership: 'партнёрство',
    industrial: 'промышленный',
    repositories: 'репозитории',
    organization: 'организация',
    transmitter: 'передатчик',
    tinymodel: 'тайни модел',
    hyperlinks: 'хайперлинкс',
    space: 'космос',
    program: 'программа',
    saas: 'эс аа эс',
    mqtt: 'эм кью ти ти',
    crdt: 'си ар ди ти',
    dtn: 'ди ти эн',
    isru: 'ай эс ар ю',
    hsp: 'аш эс пэ',
    ton: 'тон',
    b2b: 'би ту би',
    b2c: 'би ту си',
    esp32: 'эс пэ тридцать два',
    plc: 'пи эл си',
    plcs: 'пи эл си',
    api: 'эй пи ай',
    apis: 'эй пи ай',
    ui: 'ю ай',
    web: 'веб',
    desktop: 'десктоп',
    rust: 'раст',
    python: 'пайтон',
    typescript: 'тайпскрипт',
    blockchain: 'блокчейн',
    swap: 'своп',
    swaps: 'свопы',
    wallet: 'кошелёк',
    wallets: 'кошельки',
    promo: 'промо',
    live: 'лайв',
    mesh: 'меш-сеть',
    trigger: 'триггер',
    triggers: 'триггеры',
    rent: 'аренда',
    pilot: 'пилот',
    phase: 'фаза',
    phases: 'фазы',
    months: 'месяцы',
    years: 'годы',
    year: 'год',
    month: 'месяц'
  };

  function transliterateLatinWord(word) {
    var lower = word.toLowerCase();
    if (RU_SPEECH_WORDS[lower]) return RU_SPEECH_WORDS[lower];

    var out = lower
      .replace(/ough/g, 'о')
      .replace(/tion/g, 'шн')
      .replace(/sion/g, 'жн')
      .replace(/ight/g, 'айт')
      .replace(/sch/g, 'ш')
      .replace(/sh/g, 'ш')
      .replace(/ch/g, 'ч')
      .replace(/ph/g, 'ф')
      .replace(/wh/g, 'у')
      .replace(/oo/g, 'у')
      .replace(/ee/g, 'и')
      .replace(/ea/g, 'и')
      .replace(/th/g, 'т')
      .replace(/ck/g, 'к')
      .replace(/ng/g, 'нг');

    var map = {
      a: 'а', b: 'б', c: 'к', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'х',
      i: 'и', j: 'дж', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п',
      q: 'к', r: 'р', s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'кс',
      y: 'й', z: 'з'
    };

    var chars = out.split('');
    var i;
    var result = '';
    for (i = 0; i < chars.length; i++) {
      result += map[chars[i]] || chars[i];
    }
    return result || word;
  }

  function russianizeLatinTokens(text) {
    return text.replace(/[A-Za-z][A-Za-z0-9&+./'-]*/g, function (token) {
      if (/^\d/.test(token)) return token;
      if (token.length <= 1) return transliterateLatinWord(token);
      return transliterateLatinWord(token);
    });
  }

  function prepareSpeechText(text, lang) {
    lang = lang || getLang();
    var out = String(text);
    var i;

    if (lang === 'ru') {
      for (i = 0; i < RU_SPEECH_PHRASES.length; i++) {
        out = out.split(RU_SPEECH_PHRASES[i][0]).join(RU_SPEECH_PHRASES[i][1]);
      }

      out = out
        .replace(/\bAI\s*CORE\b/gi, 'Эй-Ай Кор')
        .replace(/\bHyperlinks Space Program\b/gi, 'Хайперлинкс Спейс Програм')
        .replace(/\bHyperlinks Space\b/gi, 'Хайперлинкс Спейс')
        .replace(/\bAI Transmitter\b/gi, 'Эй-Ай Передатчик')
        .replace(/\bTinyModel\b/g, 'Тайни Модел')
        .replace(/\bESP32s?\b/gi, 'ЭСП тридцать два')
        .replace(/\bMQTT\b/g, 'эм кью ти ти')
        .replace(/\bOPC UA\b/g, 'о пэ цэ ю эй')
        .replace(/\bCRDTs?\b/g, 'си ар ди ти')
        .replace(/\bDTN\b/g, 'ди ти эн')
        .replace(/\bISRU\b/g, 'ай эс ар ю')
        .replace(/\bSaaS\b/g, 'эс аа эс')
        .replace(/\bB2B\b/g, 'би ту би')
        .replace(/\bB2C\b/g, 'би ту си')
        .replace(/\bTON\b/g, 'тон')
        .replace(/\bHSP\b/g, 'аш эс пэ')
        .replace(/\bGitHub\b/g, 'ГитХаб')
        .replace(/\$1T\+?/gi, 'один триллион долларов')
        .replace(/\$1B/gi, 'один миллиард долларов')
        .replace(/\$10M/gi, 'десять миллионов долларов')
        .replace(/\$2\b/g, 'два доллара')
        .replace(/→/g, ', затем ')
        .replace(/·/g, ', ')
        .replace(/&/g, ' и ')
        .replace(/чужое железо/gi, 'железо');

      out = russianizeLatinTokens(out);
    } else if (lang === 'zh') {
      out = out
        .replace(/\bAI\s*CORE\b/gi, '人工智能核心')
        .replace(/\bHyperlinks Space Program\b/gi, 'Hyperlinks 太空计划')
        .replace(/\bHyperlinks Space\b/gi, 'Hyperlinks Space')
        .replace(/\bAI Transmitter\b/gi, 'AI 发射器')
        .replace(/\bTinyModel\b/g, 'TinyModel')
        .replace(/\$1T\+?/gi, '一万亿美元')
        .replace(/\$1B/gi, '十亿美元')
        .replace(/\$10M/gi, '一千万美元')
        .replace(/\$2\b/g, '两美元')
        .replace(/→/g, '，然后')
        .replace(/·/g, '、');
    } else {
      out = out
        .replace(/\bthird-party hardware\b/gi, 'hardware')
        .replace(/\bsomeone else['']s hardware\b/gi, 'hardware')
        .replace(/\bAI\s*CORE\b/gi, 'Artificial Intelligence Core')
        .replace(/\bESP32s?\b/gi, 'E S P thirty two')
        .replace(/\bMQTT\b/g, 'M Q T T')
        .replace(/\bOPC UA\b/g, 'O P C U A')
        .replace(/\bCRDTs?\b/g, 'C R D T')
        .replace(/\bDTN\b/g, 'D T N')
        .replace(/\bISRU\b/g, 'I S R U')
        .replace(/\bSaaS\b/g, 'software as a service')
        .replace(/\bB2B\b/g, 'B to B')
        .replace(/\bB2C\b/g, 'B to C')
        .replace(/\bTON\b/g, 'T O N')
        .replace(/\bHSP\b/g, 'H S P')
        .replace(/\bcis-lunar\b/gi, 'sis lunar')
        .replace(/\bTinyModel\b/g, 'Tiny Model')
        .replace(/\$1T\+?/gi, 'one trillion dollars')
        .replace(/\$1B/gi, 'one billion dollars')
        .replace(/\$10M/gi, 'ten million dollars')
        .replace(/\$2\b/g, 'two dollars')
        .replace(/→/g, ', then ')
        .replace(/·/g, ', ');
    }

    return out
      .replace(/…/g, '...')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isExcludedVoice(name) {
    return /comic|novelty|whisper|baby|junior|fun|jester|zira|helen|susan|kathy|linda|samantha|victoria|karen|jenny|aria|xiaoxiao|ting-?ting|huihui|yaoyao|meijia|sin-ji|yuna|flo|grandma|grandpa/i
      .test(normalizeVoiceName(name));
  }

  function normalizeVoiceName(name) {
    return String(name || '').toLowerCase();
  }

  function pickBestVoice(lang) {
    var code = SPEECH_LANG[lang] || SPEECH_LANG.en;
    var prefix = code.split('-')[0];
    var prefer = {
      en: [
        /microsoft (david|mark|guy|ryan|george|james)/i,
        /google.*english.*(male|united states)/i,
        /google uk english male/i,
        /daniel/i,
        /alex(?!a)/i,
        /fred/i,
        /tom/i,
        /rishi/i
      ],
      ru: [
        /google.*russian.*male/i,
        /dmitri/i,
        /pavel/i,
        /yuri/i,
        /maxim/i
      ],
      zh: [
        /yunxi/i,
        /yunjian/i,
        /kangkang/i,
        /google.*mandarin.*male/i,
        /zh-cn.*male/i
      ]
    };
    var patterns = prefer[lang] || prefer.en;
    var i;
    var p;
    var voice;

    refreshSpeechVoices();

    for (p = 0; p < patterns.length; p++) {
      for (i = 0; i < speechVoices.length; i++) {
        voice = speechVoices[i];
        if (voice.lang.indexOf(prefix) !== 0) continue;
        if (isExcludedVoice(voice.name)) continue;
        if (patterns[p].test(normalizeVoiceName(voice.name))) return voice;
      }
    }

    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (voice.lang === code && !isExcludedVoice(voice.name)) return voice;
    }
    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (voice.lang.indexOf(prefix) === 0 && voice.localService && !isExcludedVoice(voice.name)) {
        return voice;
      }
    }
    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (voice.lang.indexOf(prefix) === 0 && !isExcludedVoice(voice.name)) return voice;
    }
    return null;
  }

  function speechRate(lang) {
    if (lang === 'zh') return 0.88;
    if (lang === 'ru') return 0.9;
    return 0.92;
  }

  function speechPitch(lang) {
    if (lang === 'zh') return 0.96;
    if (lang === 'ru') return 0.98;
    return 0.98;
  }

  function typeBotMessage(text, done) {
    if (state.reducedMotion) {
      appendBubble(text, 'bot');
      if (done) done();
      return;
    }

    state.typing = true;
    var bubble = document.createElement('div');
    bubble.className = 'ai-core-msg ai-core-msg--bot ai-core-msg--typing';
    state.messagesEl.appendChild(bubble);

    var i = 0;
    var speed = 14;

    function tick() {
      bubble.textContent = text.slice(0, i);
      state.messagesEl.scrollTop = state.messagesEl.scrollHeight;
      i += 1;
      if (i <= text.length) {
        setTimeout(tick, speed);
      } else {
        bubble.classList.remove('ai-core-msg--typing');
        state.typing = false;
        if (done) done();
      }
    }

    tick();
  }

  function showBotMessage(displayText, opts) {
    opts = opts || {};
    var speakLine = opts.speak === false ? null : (opts.speakText || displayText);

    if (speakLine && opts.parallelSpeak) {
      speakAsync(speakLine);
      speakLine = null;
    }

    function finish() {
      if (speakLine) {
        speakAsync(speakLine).then(function () {
          if (opts.onDone) opts.onDone();
        });
        return;
      }
      if (opts.onDone) opts.onDone();
    }

    if (state.reducedMotion || opts.instant) {
      appendBubble(displayText, 'bot');
      finish();
      return;
    }

    typeBotMessage(displayText, finish);
  }

  function sayBot(key, vars, done) {
    showBotMessage(t(key, vars), {
      speakText: tVoice(key, vars),
      parallelSpeak: true,
      onDone: done
    });
  }

  function stopSpeech() {
    if (!state.speechSupported) return;
    window.speechSynthesis.cancel();
    if (state.speechResolve) {
      state.speechResolve();
      state.speechResolve = null;
    }
    state.speaking = false;
  }

  function refreshSpeechVoices() {
    if (!state.speechSupported) return;
    speechVoices = window.speechSynthesis.getVoices() || [];
  }

  function speakAsync(text) {
    return new Promise(function (resolve) {
      if (!state.voiceEnabled || !state.speechSupported || !text) {
        resolve();
        return;
      }

      stopSpeech();

      var lang = getLang();
      var prepared = prepareSpeechText(text, lang);
      var utterance = new SpeechSynthesisUtterance(prepared);

      utterance.lang = SPEECH_LANG[lang] || SPEECH_LANG.en;
      utterance.rate = speechRate(lang);
      utterance.pitch = speechPitch(lang);
      utterance.volume = 1;

      var voice = pickBestVoice(lang);
      if (voice) utterance.voice = voice;

      state.speechResolve = resolve;
      state.speaking = true;

      utterance.onend = function () {
        state.speaking = false;
        if (state.speechResolve === resolve) state.speechResolve = null;
        resolve();
      };
      utterance.onerror = function () {
        state.speaking = false;
        if (state.speechResolve === resolve) state.speechResolve = null;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  function setVoiceEnabled(enabled, persist) {
    state.voiceEnabled = !!enabled;
    if (persist !== false) {
      localStorage.setItem(VOICE_KEY, state.voiceEnabled ? '1' : '0');
    }
    if (!state.voiceEnabled) stopSpeech();
    updateVoiceButton();
  }

  function updateVoiceButton() {
    if (!state.voiceBtn) return;
    var on = state.voiceEnabled;
    state.voiceBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    state.voiceBtn.setAttribute('aria-label', t(on ? 'ai.voiceOnLabel' : 'ai.voiceOffLabel'));
    state.voiceBtn.title = t(on ? 'ai.voiceOnLabel' : 'ai.voiceOffLabel');
  }

  function initVoice() {
    state.speechSupported = typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window;

    var stored = localStorage.getItem(VOICE_KEY);
    state.voiceEnabled = stored === null ? true : stored === '1';

    state.voiceBtn = document.getElementById('ai-core-voice');
    if (!state.voiceBtn) return;

    if (!state.speechSupported) {
      state.voiceBtn.hidden = true;
      return;
    }

    updateVoiceButton();
    refreshSpeechVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = refreshSpeechVoices;
    }

    state.voiceBtn.addEventListener('click', function () {
      setVoiceEnabled(!state.voiceEnabled);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopSpeech();
        stopListening();
      }
    });
  }

  function updateMicButton() {
    if (!state.micBtn) return;
    var listening = state.listening;
    var denied = state.micPermissionGranted === false;
    state.micBtn.setAttribute('aria-pressed', listening ? 'true' : 'false');
    state.micBtn.classList.toggle('is-disabled', denied && !listening);
    state.micBtn.setAttribute('aria-label', t(listening ? 'ai.micOffLabel' : 'ai.micOnLabel'));
    state.micBtn.title = t(listening ? 'ai.micOffLabel' : 'ai.micOnLabel');
  }

  function stopMicStream() {
    if (!state.micStream) return;
    state.micStream.getTracks().forEach(function (track) {
      track.stop();
    });
    state.micStream = null;
  }

  function requestMicPermission() {
    if (!state.recognitionSupported) {
      return Promise.resolve(false);
    }

    if (state.micPermissionGranted === true) {
      return Promise.resolve(true);
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
          stopMicStream();
          state.micStream = stream;
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
          state.micStream = null;
          state.micPermissionGranted = true;
          state.micAutoStart = true;
          updateMicButton();
          if (state.ready) maybeAutoStartMic();
          return true;
        })
        .catch(function () {
          state.micPermissionGranted = false;
          state.micAutoStart = false;
          updateMicButton();
          return false;
        });
    }

    return Promise.resolve(null);
  }

  function startListening() {
    if (!state.recognitionSupported || !state.recognition) return;

    stopTour();
    stopSpeech();

    try {
      state.recognition.lang = SPEECH_LANG[getLang()] || SPEECH_LANG.en;
      state.recognition.start();
    } catch (err) {
      try {
        state.recognition.stop();
        state.recognition.lang = SPEECH_LANG[getLang()] || SPEECH_LANG.en;
        state.recognition.start();
      } catch (retryErr) {
        sayBot('ai.micError');
      }
    }
  }

  function maybeAutoStartMic() {
    if (!state.micAutoStart || state.micPermissionGranted !== true || state.listening) return;
    startListening();
  }

  function requestMicAccessOnLoad() {
    if (!state.recognitionSupported) return;

    requestMicPermission().then(function (granted) {
      if (granted === false) {
        state.micAutoStart = false;
      }
      updateMicButton();
    });
  }

  function stopListening() {
    if (!state.recognition || !state.listening) return;
    try {
      state.recognition.stop();
    } catch (err) {
      /* already stopped */
    }
    state.listening = false;
    updateMicButton();
  }

  function initSpeechRecognition() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognitionSupported = !!SR;
    state.micBtn = document.getElementById('ai-core-mic');
    if (!state.micBtn) return;

    if (!state.recognitionSupported) {
      state.micBtn.hidden = true;
      return;
    }

    state.recognition = new SR();
    state.recognition.continuous = false;
    state.recognition.interimResults = true;
    state.recognition.maxAlternatives = 1;

    state.recognition.onstart = function () {
      state.listening = true;
      updateMicButton();
    };

    state.recognition.onend = function () {
      state.listening = false;
      updateMicButton();
      if (!state.micAutoStart || state.micPermissionGranted !== true) return;
      if (state.tourTimer || state.typing || state.speaking) return;
      window.setTimeout(function () {
        if (state.micAutoStart && state.micPermissionGranted && !state.listening &&
            !state.typing && !state.tourTimer && !state.speaking) {
          startListening();
        }
      }, 600);
    };

    state.recognition.onerror = function (event) {
      state.listening = false;
      updateMicButton();
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        state.micPermissionGranted = false;
        state.micAutoStart = false;
        updateMicButton();
        sayBot('ai.micDenied');
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        sayBot('ai.micError');
      }
    };

    state.recognition.onresult = function (event) {
      var transcript = '';
      var isFinal = false;
      var i;

      for (i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }

      transcript = transcript.trim();
      if (state.inputEl) state.inputEl.value = transcript;

      if (isFinal && transcript) {
        stopListening();
        handleInput(transcript);
        if (state.inputEl) state.inputEl.value = '';
      }
    };

    updateMicButton();

    state.micBtn.addEventListener('click', function () {
      if (state.listening) {
        state.micAutoStart = false;
        stopListening();
        return;
      }

      state.micAutoStart = true;

      function beginListening() {
        if (state.micPermissionGranted === false) {
          sayBot('ai.micDenied');
          return;
        }
        startListening();
      }

      if (state.micPermissionGranted === true) {
        beginListening();
        return;
      }

      requestMicPermission().then(function (granted) {
        if (granted) {
          beginListening();
        } else if (granted === false) {
          sayBot('ai.micDenied');
        } else {
          beginListening();
        }
      });
    });

    window.addEventListener('hls:locale-change', function () {
      if (state.listening) stopListening();
      updateMicButton();
    });
  }

  function sayUser(text) {
    appendBubble(text, 'user');
  }

  function stopTour() {
    if (state.tourTimer) {
      clearTimeout(state.tourTimer);
      state.tourTimer = null;
    }
    state.tourIndex = 0;
    stopSpeech();
  }

  function presentSection(sec, opts) {
    opts = opts || {};
    stopTour();
    if (opts.userText) sayUser(opts.userText);

    var meta = sectionMeta(sec.id);
    var displayText = t('ai.sectionLead', meta);
    var voiceText = t('ai.navigatingVoice', { name: meta.name }) + ' ' + t('ai.sectionVoice', meta);

    scrollToSection(sec.id);

    showBotMessage(displayText, {
      speakText: voiceText,
      parallelSpeak: true,
      onDone: opts.onDone
    });
  }

  function openSection(sec, userText) {
    presentSection(sec, { userText: userText });
  }

  function tourStep() {
    if (state.tourIndex >= SECTIONS.length) {
      scrollToHero();
      showBotMessage(t('ai.tourDone'), {
        speakText: tVoice('ai.tourDone'),
        onDone: function () {
          if (state.micPausedForTour) {
            state.micAutoStart = true;
            maybeAutoStartMic();
          }
          state.micPausedForTour = false;
        }
      });
      state.tourIndex = 0;
      return;
    }

    var sec = SECTIONS[state.tourIndex];
    var meta = sectionMeta(sec.id);
    var displayText = t('ai.sectionLead', meta);
    var voiceText = t('ai.sectionVoice', meta);

    scrollToSection(sec.id);
    state.tourIndex += 1;

    showBotMessage(displayText, { speak: false });

    speakAsync(voiceText).then(function () {
      state.tourTimer = setTimeout(tourStep, state.reducedMotion ? 500 : 900);
    });
  }

  function startTour(userText) {
    stopTour();
    state.micPausedForTour = state.micAutoStart;
    state.micAutoStart = false;
    stopListening();
    if (userText) sayUser(userText);

    state.tourIndex = 0;
    showBotMessage(t('ai.tourStart'), { speak: false });

    speakAsync(tVoice('ai.tourStart')).then(tourStep);
  }

  function handleInput(raw) {
    var text = normalize(raw);
    if (!text || state.typing) return;

    stopTour();
    stopListening();
    sayUser(raw);

    var lang = getLang();

    if (matchesAny(text, GREET_WORDS[lang] || GREET_WORDS.en) && !isGeneralQuestion(text) && text.length < 32) {
      sayBot('ai.greeting');
      return;
    }
    if (matchesAny(text, THANK_WORDS[lang] || THANK_WORDS.en) && !isGeneralQuestion(text) && text.length < 40) {
      sayBot('ai.thanks');
      return;
    }
    if (matchesAny(text, HELP_WORDS[lang] || HELP_WORDS.en)) {
      sayBot('ai.help');
      return;
    }
    if (matchesAny(text, TOUR_WORDS[lang] || TOUR_WORDS.en)) {
      startTour();
      return;
    }
    if (matchesAny(text, HERE_WORDS[lang] || HERE_WORDS.en)) {
      var hereId = getVisibleSectionId();
      if (hereId) {
        var hereMeta = sectionMeta(hereId);
        showBotMessage(t('ai.here', hereMeta), {
          speakText: tVoice('ai.here', hereMeta),
          parallelSpeak: true
        });
      } else {
        sayBot('ai.hereUnknown');
      }
      return;
    }

    var sec = detectSection(text);
    if (sec && isNavigationIntent(text)) {
      openSection(sec);
      return;
    }

    if (text.indexOf('show') !== -1 || text.indexOf('open') !== -1 || text.indexOf('go') !== -1 ||
        text.indexOf('покаж') !== -1 || text.indexOf('откр') !== -1 || text.indexOf('перей') !== -1 ||
        text.indexOf('打开') !== -1 || text.indexOf('去') !== -1) {
      sec = detectSection(text.replace(/show|open|go to|go|покажи|открой|перейди|打开|去/g, '').trim());
      if (sec) {
        openSection(sec);
        return;
      }
    }

    askGeneral(raw);
  }

  function sectionFromId(id) {
    for (var i = 0; i < SECTIONS.length; i++) {
      if (SECTIONS[i].id === id) return SECTIONS[i];
    }
    return null;
  }

  function initSectionNavBridge() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.section-chip[data-section-id]');
      if (!link) return;

      var id = link.getAttribute('data-section-id');
      if (!id || id === 'hero') return;

      var sec = sectionFromId(id);
      if (!sec) return;

      e.preventDefault();
      presentSection(sec, { userText: t(sec.nameKey) });
    });
  }

  function buildChips() {
    if (!state.chipsEl) return;
    state.chipsEl.innerHTML = '';

    function addChip(label, action) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-core-chip';
      btn.textContent = label;
      btn.addEventListener('click', action);
      state.chipsEl.appendChild(btn);
    }

    addChip(t('ai.chipHelp'), function () { handleInput(t('ai.chipHelp')); });
    addChip(t('ai.chipTour'), function () { startTour(t('ai.chipTour')); });
    addChip(t('ai.chipHere'), function () { handleInput(t('ai.chipHere')); });

    SECTIONS.forEach(function (sec) {
      addChip(t(sec.nameKey), function () {
        presentSection(sec, { userText: t(sec.nameKey) });
      });
    });
  }

  function refreshChrome() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!el.closest('.ai-core-panel')) return;
      var key = el.getAttribute('data-i18n');
      if (window.HLS_I18N[getLang()][key]) {
        el.textContent = t(key);
      }
    });
    if (state.inputEl) {
      state.inputEl.placeholder = t('ai.placeholder');
    }
    updateVoiceButton();
    updateMicButton();
    buildChips();
  }

  function isLightTheme() {
    return window.HLS && window.HLS.isLightTheme ? window.HLS.isLightTheme() : false;
  }

  var LIGHTNING_DARK = [
    'rgba(26, 170, 17, 0.95)',
    'rgba(0, 220, 255, 0.9)',
    'rgba(255, 60, 220, 0.88)',
    'rgba(255, 220, 40, 0.92)',
    'rgba(120, 80, 255, 0.9)'
  ];

  var LIGHTNING_LIGHT = [
    'rgba(18, 138, 12, 0.95)',
    'rgba(30, 64, 175, 0.92)',
    'rgba(122, 44, 255, 0.88)',
    'rgba(180, 100, 0, 0.9)',
    'rgba(0, 140, 120, 0.92)'
  ];

  function lightningColors() {
    return isLightTheme() ? LIGHTNING_LIGHT : LIGHTNING_DARK;
  }

  var lightningDispose = null;

  function initLightning() {
    if (lightningDispose) {
      lightningDispose();
      lightningDispose = null;
    }
    if (state.reducedMotion) return;

    var quality = window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { lightning: true };
    if (!quality.lightning) return;

    var canvas = document.getElementById('hero-lightning');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var bolts = [];
    var raf = 0;
    var lastFlash = 0;
    var frame = 0;
    var COLORS = lightningColors();
    var dpr = quality.dpr || 1;
    var sizeDirty = true;

    function resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      var nextDpr = window.HLS && window.HLS.getQuality ? window.HLS.getQuality().dpr : dpr;
      canvas.width = Math.round(w * nextDpr);
      canvas.height = Math.round(h * nextDpr);
      ctx.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);
      dpr = nextDpr;
    }

    function shouldRun() {
      return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden;
    }

    function randomBolt() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      var cx = w * 0.5;
      var cy = h * 0.48;
      var sx = cx + (Math.random() - 0.5) * w * 0.22;
      var sy = cy + (Math.random() - 0.5) * h * 0.16;
      var points = [{ x: sx, y: sy }];
      var x = sx;
      var y = sy;
      var segments = 5 + Math.floor(Math.random() * 5);

      for (var i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * w * 0.16;
        y += h / segments + (Math.random() - 0.5) * 20;
        points.push({ x: x, y: y });
      }

      bolts.push({
        points: points,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        width: 1.2 + Math.random() * 1.8
      });
    }

    function drawBolt(bolt) {
      if (bolt.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = bolt.color;
      ctx.lineWidth = bolt.width;
      ctx.globalAlpha = bolt.life * 0.85;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (var i = 1; i < bolt.points.length; i++) {
        ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function draw(now) {
      raf = requestAnimationFrame(draw);
      if (!shouldRun()) return;

      frame += 1;
      if (frame % 2 !== 0) return;

      if (sizeDirty) {
        resize();
        sizeDirty = false;
      }

      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (now - lastFlash > 700 + Math.random() * 1200) {
        randomBolt();
        lastFlash = now;
      }

      bolts = bolts.filter(function (b) {
        b.life -= 0.06;
        if (b.life > 0) drawBolt(b);
        return b.life > 0;
      });
    }

    function onResize() {
      sizeDirty = true;
    }

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('hls:hero-visibility', onResize);
    document.addEventListener('ai-core:navigate', function () {
      if (shouldRun()) randomBolt();
    });

    raf = requestAnimationFrame(draw);

    lightningDispose = function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hls:hero-visibility', onResize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }

  function initChat() {
    state.messagesEl = document.getElementById('ai-core-messages');
    state.chipsEl = document.getElementById('ai-core-chips');
    state.inputEl = document.getElementById('ai-core-input');
    state.formEl = document.getElementById('ai-core-form');

    if (!state.messagesEl || !state.formEl) return;

    buildChips();

    state.formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = state.inputEl.value;
      state.inputEl.value = '';
      handleInput(val);
    });

    setTimeout(function () {
      showBotMessage(t('ai.greeting'), {
        speakText: tVoice('ai.greeting'),
        onDone: maybeAutoStartMic
      });
      state.ready = true;
    }, state.reducedMotion ? 100 : 600);

    window.addEventListener('hls:locale-change', function () {
      refreshChrome();
      var now = getLang();
      if (state.recognition) {
        state.recognition.lang = SPEECH_LANG[now] || SPEECH_LANG.en;
      }
      if (state.ready && state.lastLang && now !== state.lastLang) {
        stopSpeech();
        stopTour();
        if (window.HLS.aiChat && window.HLS.aiChat.clearHistory) {
          window.HLS.aiChat.clearHistory();
        }
        if (state.messagesEl) state.messagesEl.innerHTML = '';
        showBotMessage(t('ai.greeting'), {
          speakText: tVoice('ai.greeting'),
          onDone: maybeAutoStartMic
        });
      }
      state.lastLang = now;
    });
  }

  function init() {
    state.reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.lastLang = getLang();

    window.HLS = window.HLS || {};
    window.HLS.presentSection = function (sectionId) {
      var sec = sectionFromId(sectionId);
      if (sec) presentSection(sec);
    };

    initVoice();
    initSpeechRecognition();
    requestMicAccessOnLoad();
    initLightning();
    initSectionNavBridge();
    initChat();
    window.addEventListener('hls:theme-applied', initLightning);
    window.addEventListener('hls:hero-scene-ready', initLightning);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
