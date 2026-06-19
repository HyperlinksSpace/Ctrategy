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
      id: 'genesis-links',
      nameKey: 'nav.genesisLinks',
      descKey: 'genesis.title',
      words: {
        en: ['genesis', 'links space', 'links', 'anriltine', 'founder', 'peer', 'replica', 'merge', 'intellectual', 'semantic'],
        ru: ['genesis', 'links space', 'links', 'anriltine', 'основат', 'peer', 'replica', 'merge', 'интеллект', 'семант'],
        zh: ['genesis', 'links space', 'links', 'anriltine', '创始人', '对等', '合并', '智力', '语义']
      }
    },
    {
      id: 'scale-links',
      nameKey: 'nav.scaleLinks',
      descKey: 'scale.title',
      words: {
        en: ['scale', 'trillion', '1t', 'federation', 'planetary', 'links space', 'intellectual'],
        ru: ['масштаб', 'триллион', '1t', 'федерац', 'планет', 'links space', 'интеллект'],
        zh: ['规模', '万亿', '1t', '联邦', '行星', 'links space', '智力']
      }
    },
    {
      id: 'intellectual-links',
      nameKey: 'nav.intellectualLinks',
      descKey: 'intellectual.title',
      words: {
        en: ['intellectual', 'nervous', 'neural', 'synapse', 'brain', 'mind', 'links', 'development', 'accelerate', 'product'],
        ru: ['интеллект', 'нервн', 'нейрон', 'синапс', 'мозг', 'разработ', 'ускор', 'продукт'],
        zh: ['智力', '神经', '神经网', '突触', '大脑', '开发', '加速', '产品']
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
    stopBtn: null,
    voiceBtn: null,
    micBtn: null,
    typing: false,
    typingTimer: null,
    typingBubble: null,
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
    micStarting: false,
    aiPending: false,
    thinkingEl: null,
    tourActive: false
  };

  var VOICE_KEY = 'hls-ai-voice';
  var MIC_AUTO_KEY = 'hls-ai-mic-auto';
  var SPEECH_LANG = { en: 'en-US', ru: 'ru-RU', zh: 'zh-CN' };
  var SPEECH_LANGS = ['en', 'ru', 'zh'];
  var speechVoices = [];
  var speechVoiceBundle = null;
  var speechVoiceBundleMode = 'per-lang';
  var speechQueueGen = 0;
  var speechKeepalive = 0;
  var speechVoicesReady = false;
  var micRestartTimer = 0;
  var micAutoStartTimer = 0;
  var micInterimTimer = 0;
  var micLastInterim = '';
  var pendingVoiceInput = '';
  var aiRequestGen = 0;
  var micWatchdog = 0;
  var micStartTimeout = 0;
  var micStartDelayTimer = 0;
  var micRecEndedAt = 0;
  var micAbortStreak = 0;
  var micRecGen = 0;
  var micRecEnding = false;
  var micPausedByFailure = false;
  var micFailureRebuilds = 0;
  var MIC_RESTART_MIN_MS = 1000;
  var MIC_MAX_FAILURE_REBUILDS = 2;
  var MIC_POST_SPEECH_MS = 1400;
  var recognitionFailCount = 0;
  var micNoSpeechCount = 0;
  var micStopReason = '';
  var micSessionAudio = false;
  var micSessionSound = false;
  var micNoVoiceHintShown = false;
  var micVisLastPulseAt = 0;
  var micVis = {
    bars: null,
    ctx: null,
    analyser: null,
    source: null,
    data: null,
    raf: 0,
    active: false,
    soundActive: false,
    energy: 0,
    lastSignalAt: 0,
    useAnalyser: false,
    monitorAttempted: false
  };

  var MIC_BUILD = '20250616e';
  var MIC_DEBUG_KEY = 'hls-mic-debug';
  var MIC_LOG_MAX = 200;
  var MIC_LOG_ALWAYS = {
    'debug.init': true,
    'init.unsupported': true,
    'init.hideButton': true,
    'env.iosNoSpeechRecognition': true,
    'env.insecureContext': true,
    'permission.denied': true,
    'permission.request': true,
    'permission.granted': true,
    'start.call': true,
    'start.skip': true,
    'start.timeout': true,
    'start.exception': true,
    'start.force': true,
    'recognition.onstart': true,
    'recognition.onend': true,
    'recognition.onerror': true,
    'recognition.onaudiostart': true,
    'recognition.onsoundstart': true,
    'recognition.result': true,
    'recognition.audioButNoVoice': true,
    'transcript.final': true,
    'stop': true
  };
  var micLogBuffer = [];
  var micDebugOn = false;
  var micDebugPanel = null;
  var micDebugListEl = null;
  var micDebugCopyBtn = null;
  var micDebugCopyTimer = 0;

  function micDebugEnabled() {
    try {
      if (localStorage.getItem(MIC_DEBUG_KEY) === '0') return false;
    } catch (e) { /* noop */ }
    try {
      if (/(?:^|[?&])micDebug=0(?:&|$)/.test(window.location.search || '')) return false;
    } catch (e) { /* noop */ }
    return true;
  }

  function micBusyReasons() {
    var reasons = [];
    if (state.typing) reasons.push('typing');
    if (state.aiPending) reasons.push('aiPending');
    if (speechActive()) reasons.push('speaking');
    if (state.tourActive && (state.speaking || state.tourTimer)) reasons.push('tour');
    return reasons;
  }

  function micEnvInfo() {
    var ua = navigator.userAgent || '';
    var ios = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return {
      secureContext: !!window.isSecureContext,
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      permissionsApi: !!(navigator.permissions && navigator.permissions.query),
      ios: ios,
      mobile: !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches),
      lang: getLang(),
      ua: ua.slice(0, 160)
    };
  }

  function micSnapshot() {
    return {
      ts: Date.now(),
      supported: state.recognitionSupported,
      autoStart: state.micAutoStart,
      permission: state.micPermissionGranted,
      enabled: !!(state.micAutoStart && state.micPermissionGranted !== false),
      listening: state.listening,
      starting: state.micStarting,
      busy: !!(state.typing || state.aiPending || speechActive() ||
        (state.tourActive && (state.speaking || state.tourTimer))),
      busyReasons: micBusyReasons(),
      speaking: state.speaking,
      typing: state.typing,
      aiPending: state.aiPending,
      tourActive: state.tourActive,
      recLang: state.recognition ? state.recognition.lang : null,
      failCount: recognitionFailCount,
      noSpeechCount: micNoSpeechCount,
      sessionAudio: micSessionAudio,
      sessionSound: micSessionSound,
      interim: micLastInterim,
      pendingVoice: pendingVoiceInput,
      vis: {
        active: micVis.active,
        bars: micVis.bars ? micVis.bars.length : 0,
        energy: Math.round(micVis.energy * 100) / 100,
        soundActive: micVis.soundActive,
        useAnalyser: micVis.useAnalyser
      }
    };
  }

  function micDebugFormatLine(entry) {
    var line = document.createElement('div');
    var level = entry.level || 'info';
    line.className = 'stratviz-mic-debug-line stratviz-mic-debug-line--' + level;
    line.textContent = entry.t.slice(11, 19) + ' ' + entry.event +
      (entry.detail ? ' ' + JSON.stringify(entry.detail).slice(0, 180) : '');
    return line;
  }

  function micDebugRenderPanel(entry) {
    if (!micDebugOn || !micDebugListEl) return;
    micDebugListEl.appendChild(micDebugFormatLine(entry));
    while (micDebugListEl.childNodes.length > 22) {
      micDebugListEl.removeChild(micDebugListEl.firstChild);
    }
    micDebugListEl.scrollTop = micDebugListEl.scrollHeight;
  }

  function micDebugCopyLogs() {
    var text = micLogExport();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (!micDebugCopyBtn) return;
        micDebugCopyBtn.classList.add('is-copied');
        if (micDebugCopyTimer) clearTimeout(micDebugCopyTimer);
        micDebugCopyTimer = window.setTimeout(function () {
          micDebugCopyTimer = 0;
          if (micDebugCopyBtn) micDebugCopyBtn.classList.remove('is-copied');
        }, 1400);
      }).catch(function () { /* noop */ });
    }
  }

  function micDebugSetVisible(show) {
    if (!micDebugPanel) {
      micDebugPanel = document.getElementById('stratviz-mic-debug');
      micDebugListEl = document.getElementById('stratviz-mic-debug-list');
      micDebugCopyBtn = document.getElementById('stratviz-mic-debug-copy');
      if (micDebugCopyBtn && !micDebugCopyBtn.dataset.bound) {
        micDebugCopyBtn.dataset.bound = '1';
        micDebugCopyBtn.addEventListener('click', micDebugCopyLogs);
      }
    }
    if (!micDebugPanel) return;
    if (show) {
      micDebugPanel.hidden = false;
      micDebugPanel.classList.add('is-active');
      micDebugPanel.setAttribute('aria-hidden', 'false');
    } else {
      micDebugPanel.classList.remove('is-active');
      micDebugPanel.hidden = true;
      micDebugPanel.setAttribute('aria-hidden', 'true');
    }
  }

  function micDebugEnsurePanel() {
    if (!micDebugOn) return;
    micDebugSetVisible(true);
  }

  function micLogExport() {
    return JSON.stringify({
      env: micEnvInfo(),
      snapshot: micSnapshot(),
      events: micLogBuffer
    }, null, 2);
  }

  function micLog(level, event, detail) {
    var entry = {
      t: new Date().toISOString(),
      level: level || 'info',
      event: event,
      detail: detail == null ? null : detail
    };
    micLogBuffer.push(entry);
    if (micLogBuffer.length > MIC_LOG_MAX) micLogBuffer.shift();

    var toConsole = micDebugOn || level === 'error' || level === 'warn' || !!MIC_LOG_ALWAYS[event];
    if (toConsole) {
      if (micDebugOn) micDebugEnsurePanel();
      if (micDebugOn) micDebugRenderPanel(entry);
      var msg = '[HLS mic] ' + event;
      var payload = micDebugOn ? { detail: detail, snap: micSnapshot() } : (detail == null ? micSnapshot() : detail);
      if (level === 'error') console.error(msg, payload);
      else if (level === 'warn') console.warn(msg, payload);
      else console.log(msg, payload);
    }
  }

  function micLogTranscript(kind, text) {
    var sample = String(text || '').trim();
    if (sample.length > 120) sample = sample.slice(0, 117) + '...';
    micLog('info', 'transcript.' + kind, { text: sample, len: String(text || '').length });
  }

  function initMicDebug() {
    micDebugOn = micDebugEnabled();
    window.HLS = window.HLS || {};
    window.HLS.micDebug = {
      enabled: function () { return micDebugOn; },
      enable: function () {
        try { localStorage.setItem(MIC_DEBUG_KEY, '1'); } catch (e) { /* noop */ }
        micDebugOn = true;
        micDebugSetVisible(true);
        if (micDebugListEl) micDebugListEl.innerHTML = '';
        micLogBuffer.slice(-18).forEach(micDebugRenderPanel);
        micLog('info', 'debug.enabled', { via: 'api' });
        return micSnapshot();
      },
      disable: function () {
        try { localStorage.setItem(MIC_DEBUG_KEY, '0'); } catch (e) { /* noop */ }
        micDebugOn = false;
        micDebugSetVisible(false);
        return micSnapshot();
      },
      status: micSnapshot,
      env: micEnvInfo,
      dump: function () { return micLogExport(); },
      log: micLog,
      copy: micDebugCopyLogs
    };
    if (micDebugOn) {
      micDebugSetVisible(true);
      micLogBuffer.slice(-18).forEach(micDebugRenderPanel);
    }
    micLog('info', 'debug.init', Object.assign({ build: MIC_BUILD }, micEnvInfo()));
    if (micEnvInfo().ios && !micEnvInfo().speechRecognition) {
      micLog('warn', 'env.iosNoSpeechRecognition', {
        hint: 'iOS Safari does not expose Web Speech Recognition; use Chrome on Android or desktop.'
      });
    }
    if (!window.isSecureContext) {
      micLog('warn', 'env.insecureContext', {
        hint: 'Microphone and speech recognition require HTTPS or localhost.'
      });
    }
  }

  micDebugOn = micDebugEnabled();

  function emitOrb(mode, detail) {
    if (window.HLS && window.HLS.setOrbReactive) {
      window.HLS.setOrbReactive(mode, detail || {});
    } else {
      document.dispatchEvent(new CustomEvent('ai-core:orb', {
        detail: Object.assign({ mode: mode }, detail || {})
      }));
    }
  }

  function releaseOrbIdle(delay) {
    emitOrb('idle', { delay: delay == null ? 500 : delay });
  }

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
    emitOrb('thinking');
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
    if (!state.typing && !state.speaking) releaseOrbIdle(350);
  }

  function isGenerating() {
    return state.aiPending || state.typing;
  }

  function setGeneratingUI(active) {
    if (!state.formEl) return;
    if (active == null) active = isGenerating();
    state.formEl.classList.toggle('is-generating', active);
    if (state.stopBtn) {
      state.stopBtn.setAttribute('aria-label', t('ai.stop'));
      state.stopBtn.title = t('ai.stop');
    }
  }

  function cancelTyping() {
    if (state.typingTimer) {
      clearTimeout(state.typingTimer);
      state.typingTimer = null;
    }
    if (state.typingBubble) {
      state.typingBubble.classList.remove('ai-core-msg--typing');
      if (!state.typingBubble.textContent) {
        state.typingBubble.remove();
      }
      state.typingBubble = null;
    }
    state.typing = false;
  }

  function cancelGeneration() {
    var wasActive = isGenerating();
    aiRequestGen += 1;
    if (state.aiPending) {
      if (window.HLS.aiChat && window.HLS.aiChat.cancel) {
        window.HLS.aiChat.cancel();
      }
      hideThinking();
      state.aiPending = false;
    }
    if (state.typing) {
      cancelTyping();
    }
    setGeneratingUI(false);
    if (wasActive) releaseOrbIdle(350);
  }

  function askGeneral(raw) {
    if (state.aiPending || state.typing) return;

    if (!window.HLS || !window.HLS.aiChat || !window.HLS.aiChat.isEnabled()) {
      sayBot('ai.apiOffline');
      return;
    }

    state.aiPending = true;
    showThinking();
    setGeneratingUI(true);
    var requestGen = ++aiRequestGen;

    window.HLS.aiChat.ask(raw, getLang()).then(function (result) {
      if (requestGen !== aiRequestGen) return;

      hideThinking();
      state.aiPending = false;
      setGeneratingUI(false);

      if (result.error === 'aborted') {
        return;
      }

      if (result.ok && result.text) {
        showBotMessage(result.text, {
          speakText: result.text,
          onDone: micAutoStartAfterSpeech
        });
        return;
      }

      if (result.error === 'network' || result.error === 'invalid_json') {
        sayBot('ai.apiError');
        return;
      }

      sayBot('ai.apiOffline');
    }).catch(function () {
      if (requestGen !== aiRequestGen) return;

      hideThinking();
      state.aiPending = false;
      setGeneratingUI(false);
      sayBot('ai.apiError');
    });
  }

  function scrollToHero() {
    scrollToSectionWhenReady('hero').then(function () {
      document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: 'hero' } }));
      emitOrb('navigate', { sectionId: 'hero', impulse: 0.55 });
    });
  }

  function scrollTargetY(id) {
    if (id === 'hero') return 0;
    var el = document.getElementById(id);
    if (!el) return null;
    var header = document.querySelector('.site-header');
    var offset = (header ? header.offsetHeight : 0) + 16;
    return Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - offset);
  }

  function scrollToSectionWhenReady(id) {
    return new Promise(function (resolve) {
      var y = scrollTargetY(id);
      if (y == null) {
        resolve();
        return;
      }

      if (Math.abs(window.pageYOffset - y) < 6) {
        resolve();
        return;
      }

      var settled = false;
      function finish() {
        if (settled) return;
        settled = true;
        window.removeEventListener('scrollend', onScrollEnd);
        clearTimeout(fallbackTimer);
        resolve();
      }
      function onScrollEnd() {
        finish();
      }

      window.scrollTo({
        top: y,
        behavior: state.reducedMotion ? 'auto' : 'smooth'
      });

      if (state.reducedMotion) {
        finish();
        return;
      }

      if ('onscrollend' in window) {
        window.addEventListener('scrollend', onScrollEnd, { once: true });
      }
      var fallbackTimer = setTimeout(finish, 1100);
    });
  }

  function scrollToSection(id) {
    scrollToSectionWhenReady(id).then(function () {
      document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: id } }));
      emitOrb('navigate', { sectionId: id, impulse: 0.6 });
    });
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
    'links space': 'links space',
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

  function prepareSpeechText(text, lang, opts) {
    opts = opts || {};
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
        .replace(/\$1T\+?/gi, 'один триллион долларов')
        .replace(/\$1B/gi, 'один миллиард долларов')
        .replace(/\$10M/gi, 'десять миллионов долларов')
        .replace(/\$2\b/g, 'два доллара')
        .replace(/→/g, ', затем ')
        .replace(/·/g, ', ')
        .replace(/&/g, ' и ')
        .replace(/чужое железо/gi, 'железо');
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
    } else if (lang === 'en') {
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
    var n = normalizeVoiceName(name);
    if (/multilingual|multi-lingual|multi language|polyglot/i.test(n)) return false;
    if (/microsoft (ryan|jenny|aria)/i.test(n) && /natural|online/i.test(n)) return false;
    return /comic|novelty|whisper|baby|junior|fun|jester|zira|helen|susan|kathy|linda|samantha|victoria|karen|jenny|aria|xiaoxiao|ting-?ting|huihui|yaoyao|meijia|sin-ji|yuna|flo|grandma|grandpa/i
      .test(n);
  }

  function charSpeechLang(ch) {
    if (/[\u0400-\u04FF]/.test(ch)) return 'ru';
    if (/[\u4e00-\u9fff]/.test(ch)) return 'zh';
    if (/[A-Za-z]/.test(ch)) return 'en';
    return null;
  }

  function textHasMixedSpeechScripts(text) {
    var seen = {};
    var i;
    var lang;
    for (i = 0; i < text.length; i++) {
      lang = charSpeechLang(text[i]);
      if (!lang) continue;
      seen[lang] = true;
      if (seen.en && seen.ru) return true;
      if (seen.en && seen.zh) return true;
      if (seen.ru && seen.zh) return true;
    }
    return false;
  }

  function splitSpeechSegments(text, uiLang) {
    var segments = [];
    var current = { lang: null, text: '' };
    var i;
    var ch;
    var lang;

    function flush() {
      if (!current.text) return;
      segments.push({ lang: current.lang || uiLang, text: current.text });
      current = { lang: null, text: '' };
    }

    for (i = 0; i < text.length; i++) {
      ch = text[i];
      lang = charSpeechLang(ch);
      if (!lang) {
        current.text += ch;
        continue;
      }
      if (current.lang === null) {
        current.lang = lang;
        current.text += ch;
      } else if (current.lang === lang) {
        current.text += ch;
      } else {
        flush();
        current.lang = lang;
        current.text = ch;
      }
    }
    flush();

    var merged = [];
    for (i = 0; i < segments.length; i++) {
      if (!segments[i].text.trim()) continue;
      if (merged.length && merged[merged.length - 1].lang === segments[i].lang) {
        merged[merged.length - 1].text += segments[i].text;
      } else {
        merged.push(segments[i]);
      }
    }
    return merged;
  }

  function getSharedSpeechVoice() {
    if (!speechVoiceBundle) rebuildSpeechVoiceBundle();
    return speechVoiceBundle && speechVoiceBundle.shared ? speechVoiceBundle.shared : null;
  }

  function resolveSpeechVoiceForLang(lang) {
    var shared = getSharedSpeechVoice();
    if (shared) return shared;
    return getSpeechVoice(lang);
  }

  function normalizeVoiceName(name) {
    return String(name || '').toLowerCase();
  }

  function voiceLangBucket(voice) {
    var lang = String(voice.lang || '').toLowerCase().replace('_', '-');
    if (lang.indexOf('en') === 0) return 'en';
    if (lang.indexOf('ru') === 0) return 'ru';
    if (lang.indexOf('zh') === 0) return 'zh';
    return null;
  }

  function isMultilingualCandidate(voice) {
    var name = normalizeVoiceName(voice.name);
    if (/multilingual|multi-lingual|multi language|polyglot/i.test(name)) return true;
    if (/microsoft (ryan|jenny|aria)/i.test(name) && /natural|online/i.test(name)) return true;
    if (/google.*multilingual/i.test(name)) return true;
    return false;
  }

  function voiceQualityScore(voice) {
    var name = normalizeVoiceName(voice.name);
    var score = 0;
    if (/multilingual|multi-lingual/i.test(name)) score += 120;
    if (/microsoft.*online.*natural/i.test(name)) score += 100;
    if (/microsoft.*natural/i.test(name)) score += 85;
    if (/google/i.test(name)) score += 70;
    if (/microsoft/i.test(name)) score += 55;
    if (voice.localService) score += 8;
    if (voice.default) score += 4;
    return score;
  }

  function voicePreferenceScore(voice, lang) {
    var prefer = {
      en: [
        /microsoft ryan/i, /microsoft david/i, /microsoft mark/i, /microsoft guy/i,
        /google.*english.*(male|united states)/i, /google uk english male/i,
        /daniel/i, /alex(?!a)/i, /fred/i, /tom/i, /rishi/i
      ],
      ru: [
        /microsoft dmitri/i, /microsoft pavel/i, /google.*russian.*male/i,
        /dmitri/i, /pavel/i, /yuri/i, /maxim/i
      ],
      zh: [
        /microsoft yunxi/i, /microsoft yunjian/i, /yunxi/i, /yunjian/i,
        /kangkang/i, /google.*mandarin.*male/i, /zh-cn.*male/i
      ]
    };
    var patterns = prefer[lang] || prefer.en;
    var name = normalizeVoiceName(voice.name);
    var i;
    for (i = 0; i < patterns.length; i++) {
      if (patterns[i].test(name)) return 100 - i;
    }
    return 0;
  }

  function rankVoiceForLang(voice, lang) {
    return voiceQualityScore(voice) + voicePreferenceScore(voice, lang);
  }

  function findMultilingualVoice() {
    var best = null;
    var bestScore = -1;
    var i;
    var voice;
    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (isExcludedVoice(voice.name)) continue;
      if (!isMultilingualCandidate(voice)) continue;
      var score = voiceQualityScore(voice);
      if (/multilingual|multi-lingual/i.test(normalizeVoiceName(voice.name))) score += 40;
      if (score > bestScore) {
        bestScore = score;
        best = voice;
      }
    }
    return best;
  }

  function findBestVoiceForLang(lang) {
    var code = SPEECH_LANG[lang] || SPEECH_LANG.en;
    var prefix = code.split('-')[0];
    var best = null;
    var bestScore = -1;
    var i;
    var voice;
    var score;

    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (isExcludedVoice(voice.name)) continue;
      if (voice.lang !== code && voice.lang.indexOf(prefix) !== 0) continue;
      score = rankVoiceForLang(voice, lang);
      if (score > bestScore) {
        bestScore = score;
        best = voice;
      }
    }
    return best;
  }

  function providerFamily(name) {
    name = normalizeVoiceName(name);
    if (/microsoft.*online.*natural/i.test(name)) return 'ms-natural';
    if (/microsoft/i.test(name)) return 'microsoft';
    if (/google/i.test(name)) return 'google';
    return 'other';
  }

  function buildMatchedTriplet() {
    var buckets = { en: [], ru: [], zh: [] };
    var i;
    var voice;
    var bucket;

    for (i = 0; i < speechVoices.length; i++) {
      voice = speechVoices[i];
      if (isExcludedVoice(voice.name)) continue;
      bucket = voiceLangBucket(voice);
      if (bucket) buckets[bucket].push(voice);
    }

    SPEECH_LANGS.forEach(function (lang) {
      buckets[lang].sort(function (a, b) {
        return rankVoiceForLang(b, lang) - rankVoiceForLang(a, lang);
      });
    });

    var families = ['ms-natural', 'microsoft', 'google', 'other'];
    var fi;
    var li;
    var candidate;
    var bundle;
    var familyMatch;

    for (fi = 0; fi < families.length; fi++) {
      familyMatch = families[fi];
      bundle = {};
      for (li = 0; li < SPEECH_LANGS.length; li++) {
        candidate = null;
        for (i = 0; i < buckets[SPEECH_LANGS[li]].length; i++) {
          if (providerFamily(buckets[SPEECH_LANGS[li]][i].name) === familyMatch) {
            candidate = buckets[SPEECH_LANGS[li]][i];
            break;
          }
        }
        if (!candidate && familyMatch === 'other') {
          candidate = buckets[SPEECH_LANGS[li]][0] || null;
        }
        if (!candidate) {
          bundle = null;
          break;
        }
        bundle[SPEECH_LANGS[li]] = candidate;
      }
      if (bundle) return bundle;
    }

    bundle = {};
    for (li = 0; li < SPEECH_LANGS.length; li++) {
      bundle[SPEECH_LANGS[li]] = buckets[SPEECH_LANGS[li]][0] || findBestVoiceForLang(SPEECH_LANGS[li]);
    }
    return bundle;
  }

  function rebuildSpeechVoiceBundle() {
    var multi = findMultilingualVoice();
    if (multi) {
      speechVoiceBundle = {
        mode: 'multilingual',
        shared: multi,
        en: multi,
        ru: multi,
        zh: multi
      };
      speechVoiceBundleMode = 'multilingual';
      return speechVoiceBundle;
    }

    var triplet = buildMatchedTriplet();
    speechVoiceBundle = {
      mode: 'matched',
      shared: null,
      en: triplet.en || null,
      ru: triplet.ru || null,
      zh: triplet.zh || null
    };
    speechVoiceBundleMode = 'matched';
    return speechVoiceBundle;
  }

  function getSpeechVoice(lang) {
    lang = lang || getLang();
    if (!speechVoiceBundle) rebuildSpeechVoiceBundle();
    var voice = speechVoiceBundle[lang];
    if (voice) return voice;
    return findBestVoiceForLang(lang);
  }

  function pickBestVoice(lang) {
    return getSpeechVoice(lang);
  }

  function getSpeechVoiceInfo() {
    if (!speechVoiceBundle) rebuildSpeechVoiceBundle();
    return {
      mode: speechVoiceBundleMode,
      multilingual: speechVoiceBundleMode === 'multilingual',
      sharedVoice: speechVoiceBundle && speechVoiceBundle.shared ? speechVoiceBundle.shared.name : null,
      voices: {
        en: speechVoiceBundle.en ? speechVoiceBundle.en.name : null,
        ru: speechVoiceBundle.ru ? speechVoiceBundle.ru.name : null,
        zh: speechVoiceBundle.zh ? speechVoiceBundle.zh.name : null
      }
    };
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
    setGeneratingUI(true);
    emitOrb('typing');
    var bubble = document.createElement('div');
    bubble.className = 'ai-core-msg ai-core-msg--bot ai-core-msg--typing';
    state.messagesEl.appendChild(bubble);
    state.typingBubble = bubble;

    var i = 0;
    var speed = 14;

    function tick() {
      if (!state.typing || state.typingBubble !== bubble) return;
      bubble.textContent = text.slice(0, i);
      state.messagesEl.scrollTop = state.messagesEl.scrollHeight;
      i += 1;
      if (i <= text.length) {
        state.typingTimer = setTimeout(tick, speed);
      } else {
        state.typingTimer = null;
        state.typingBubble = null;
        bubble.classList.remove('ai-core-msg--typing');
        state.typing = false;
        setGeneratingUI(false);
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

    function afterSpeech() {
      if (opts.onDone) opts.onDone();
      else micAutoStartAfterSpeech();
    }

    function finish() {
      if (speakLine) {
        speakAsync(speakLine).then(function () {
          afterSpeech();
        });
        return;
      }
      if (!state.speaking) releaseOrbIdle(450);
      afterSpeech();
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
      onDone: done
    });
  }

  function sayBotSilent(key, vars, done) {
    showBotMessage(t(key, vars), {
      speak: false,
      instant: true,
      onDone: done
    });
  }

  function micAutoStartAfterSpeech() {
    if (!micIsEnabled()) return;
    var attempts = 0;
    (function wait() {
      var syn = window.speechSynthesis;
      if (syn && (syn.speaking || syn.pending) && attempts < 50) {
        attempts += 1;
        window.setTimeout(wait, 50);
        return;
      }
      scheduleMicAutoStart(MIC_POST_SPEECH_MS);
    })();
  }

  function isSpeechInterruptError(event) {
    var err = event && event.error;
    return err === 'interrupted' || err === 'canceled' || err === 'cancelled';
  }

  function startSpeechKeepalive() {
    if (speechKeepalive) return;
    speechKeepalive = window.setInterval(function () {
      if (!state.speaking || !window.speechSynthesis) return;
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        try { window.speechSynthesis.resume(); } catch (e) { /* noop */ }
      }
    }, 7000);
  }

  function stopSpeechKeepalive() {
    if (!speechKeepalive) return;
    clearInterval(speechKeepalive);
    speechKeepalive = 0;
  }

  function stopSpeech() {
    if (!state.speechSupported) return;
    speechQueueGen += 1;
    stopSpeechKeepalive();
    window.speechSynthesis.cancel();
    if (state.speechResolve) {
      state.speechResolve(false);
      state.speechResolve = null;
    }
    state.speaking = false;
  }

  function buildUtterance(text, lang) {
    var prepared = prepareSpeechText(text, lang);
    if (!prepared) return null;
    var utterance = new SpeechSynthesisUtterance(prepared);
    utterance.lang = SPEECH_LANG[lang] || SPEECH_LANG.en;
    utterance.rate = speechRate(lang);
    utterance.pitch = speechPitch(lang);
    utterance.volume = 1;
    var voice = resolveSpeechVoiceForLang(lang);
    if (voice) utterance.voice = voice;
    return utterance;
  }

  function speakSegmentQueue(segments, resolve, gen) {
    var index = 0;

    function finish(ok) {
      state.speaking = false;
      stopSpeechKeepalive();
      if (state.speechResolve === resolve) state.speechResolve = null;
      if (!state.typing) releaseOrbIdle(650);
      resolve(!!ok);
    }

    function speakCurrent(retrying) {
      if (gen !== speechQueueGen) return;

      while (index < segments.length && !segments[index].text.trim()) index += 1;
      if (index >= segments.length) {
        finish(true);
        return;
      }

      var seg = segments[index];
      var utterance = buildUtterance(seg.text, seg.lang);
      if (!utterance) {
        index += 1;
        speakCurrent(false);
        return;
      }

      utterance.onend = function () {
        if (gen !== speechQueueGen) return;
        index += 1;
        speakCurrent(false);
      };
      utterance.onerror = function (event) {
        if (gen !== speechQueueGen) return;
        if (!retrying && isSpeechInterruptError(event)) {
          window.setTimeout(function () { speakCurrent(true); }, 160);
          return;
        }
        index += 1;
        speakCurrent(false);
      };
      window.speechSynthesis.speak(utterance);
    }

    speakCurrent(false);
  }

  function refreshSpeechVoices() {
    if (!state.speechSupported) return;
    speechVoices = window.speechSynthesis.getVoices() || [];
    if (speechVoices.length) speechVoicesReady = true;
    rebuildSpeechVoiceBundle();
  }

  function ensureSpeechVoices() {
    if (speechVoicesReady && speechVoices.length) return;
    refreshSpeechVoices();
  }

  function speakAsync(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!state.voiceEnabled || !state.speechSupported || !text) {
        resolve(true);
        return;
      }

      stopSpeech();
      if (state.listening || state.micStarting) stopListening(true);
      ensureSpeechVoices();

      var uiLang = opts.lang || getLang();
      var segments = textHasMixedSpeechScripts(text)
        ? splitSpeechSegments(text, uiLang)
        : [{ lang: uiLang, text: text }];
      var gen = speechQueueGen;

      state.speechResolve = resolve;
      state.speaking = true;
      startSpeechKeepalive();
      emitOrb('speaking');

      if (segments.length <= 1) {
        var singleLang = segments[0] ? segments[0].lang : uiLang;
        var line = segments[0] ? segments[0].text : text;
        var retried = false;

        function speakSingle(retrying) {
          if (gen !== speechQueueGen) return;
          var utterance = buildUtterance(line, singleLang);
          if (!utterance) {
            state.speaking = false;
            stopSpeechKeepalive();
            state.speechResolve = null;
            resolve(true);
            return;
          }
          utterance.onend = function () {
            if (gen !== speechQueueGen) return;
            state.speaking = false;
            stopSpeechKeepalive();
            if (state.speechResolve === resolve) state.speechResolve = null;
            if (!state.typing) releaseOrbIdle(650);
            resolve(true);
          };
          utterance.onerror = function (event) {
            if (gen !== speechQueueGen) return;
            if (!retrying && !retried && isSpeechInterruptError(event)) {
              retried = true;
              window.setTimeout(function () { speakSingle(true); }, 160);
              return;
            }
            state.speaking = false;
            stopSpeechKeepalive();
            if (state.speechResolve === resolve) state.speechResolve = null;
            if (!state.typing) releaseOrbIdle(400);
            resolve(false);
          };
          window.speechSynthesis.speak(utterance);
        }

        speakSingle(false);
        return;
      }

      speakSegmentQueue(segments, resolve, gen);
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

    window.addEventListener('hls:locale-change', function () {
      refreshSpeechVoices();
    });

    state.voiceBtn.addEventListener('click', function () {
      setVoiceEnabled(!state.voiceEnabled);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopSpeech();
        stopListening(true);
        return;
      }
      if (micIsEnabled()) scheduleMicAutoStart(500);
    });
  }

  function clearMicInterimTimer() {
    if (!micInterimTimer) return;
    clearTimeout(micInterimTimer);
    micInterimTimer = 0;
  }

  function waitForAudioIdle(done) {
    stopSpeech();
    var attempts = 0;
    (function poll() {
      var syn = window.speechSynthesis;
      if (!syn || (!syn.speaking && !syn.pending) || attempts > 30) {
        window.setTimeout(done, attempts > 0 ? 350 : 200);
        return;
      }
      attempts += 1;
      window.setTimeout(poll, 50);
    })();
  }

  function recognitionIsCurrent(recognition, gen) {
    return recognition === state.recognition && gen === micRecGen;
  }

  function resetMicFailureState() {
    micAbortStreak = 0;
    micFailureRebuilds = 0;
    micPausedByFailure = false;
    micRecEnding = false;
  }

  function teardownRecognitionInstance() {
    var rec = state.recognition;
    state.recognition = null;
    state.listening = false;
    state.micStarting = false;
    if (!rec) return;
    rec.onstart = null;
    rec.onend = null;
    rec.onerror = null;
    rec.onresult = null;
    rec.onaudiostart = null;
    rec.onaudioend = null;
    rec.onsoundstart = null;
    rec.onsoundend = null;
    rec.onspeechstart = null;
    rec.onspeechend = null;
    rec.onnomatch = null;
    try {
      rec.abort();
    } catch (e) {
      try { rec.stop(); } catch (e2) { /* noop */ }
    }
  }

  function pauseMicAfterFailure() {
    micPausedByFailure = true;
    clearMicRestartTimer();
    clearMicAutoStartTimer();
    clearMicStartDelayTimer();
    clearMicStartTimeout();
    teardownRecognitionInstance();
    state.recognition = createRecognitionInstance();
    stopMicVisualizer();
    updateMicButton();
    sayBot('ai.micError');
    micLog('warn', 'mic.pausedByFailure', {
      rebuilds: micFailureRebuilds,
      abortStreak: micAbortStreak
    });
  }

  function clearMicStartDelayTimer() {
    if (!micStartDelayTimer) return;
    clearTimeout(micStartDelayTimer);
    micStartDelayTimer = 0;
  }

  function clearMicRestartTimer() {
    if (!micRestartTimer) return;
    clearTimeout(micRestartTimer);
    micRestartTimer = 0;
  }

  function clearMicAutoStartTimer() {
    if (!micAutoStartTimer) return;
    clearTimeout(micAutoStartTimer);
    micAutoStartTimer = 0;
  }

  function micRestartCooldownMs() {
    var elapsed = Date.now() - (micRecEndedAt || 0);
    var minGap = MIC_RESTART_MIN_MS;
    if (/Windows/i.test(navigator.userAgent || '')) minGap = 1500;
    if (micRecEnding) minGap = Math.max(minGap, 400);
    return Math.max(0, minGap - elapsed);
  }

  function micRestartDelayFor(reason) {
    if (reason === 'aborted') {
      return Math.min(3600, 950 + micAbortStreak * 450);
    }
    if (reason === 'no-speech') return 700;
    return 900;
  }

  function scheduleMicRestart(delay, reason) {
    clearMicRestartTimer();
    clearMicAutoStartTimer();
    if (!micIsEnabled() || micPausedByFailure) return;
    var wait = delay == null ? micRestartDelayFor(reason) : delay;
    micLog('debug', 'restart.scheduled', { delay: wait, reason: reason || '' });
    micRestartTimer = window.setTimeout(function () {
      micRestartTimer = 0;
      maybeAutoStartMic();
    }, wait);
  }

  function scheduleMicAutoStart(delay) {
    if (micAutoStartTimer) return;
    if (!micIsEnabled() || micPausedByFailure || micRecEnding) return;
    if (micRestartTimer || micStartDelayTimer) return;
    var wait = delay == null ? 500 : delay;
    micLog('debug', 'autoStart.scheduled', { delay: wait });
    micAutoStartTimer = window.setTimeout(function () {
      micAutoStartTimer = 0;
      maybeAutoStartMic();
    }, wait);
  }

  function setMicAutoStart(enabled, persist) {
    var prev = state.micAutoStart;
    state.micAutoStart = !!enabled;
    micLog('info', 'autoStart.set', { enabled: state.micAutoStart, persist: persist !== false, prev: prev });
    if (state.micAutoStart) resetMicFailureState();
    if (persist !== false) {
      localStorage.setItem(MIC_AUTO_KEY, state.micAutoStart ? '1' : '0');
    }
    if (!state.micAutoStart) {
      clearMicRestartTimer();
      clearMicAutoStartTimer();
      clearMicInterimTimer();
      micLastInterim = '';
      pendingVoiceInput = '';
      stopListening(true);
      releaseMicCapture();
    }
    if (!state.micAutoStart) micVisLastPulseAt = 0;
    updateMicButton();
  }

  function initMicVisualizer() {
    if (!state.micBtn) return;
    micVis.bars = state.micBtn.querySelectorAll('.ai-core-mic-eq-bar');
  }

  function resetMicEqBars() {
    if (!micVis.bars) return;
    micVis.bars.forEach(function (bar) {
      bar.style.setProperty('--eq-level', '12%');
    });
  }

  function releaseMicCapture() {
    var hadStream = !!state.micStream;
    micVis.useAnalyser = false;
    micVis.monitorAttempted = false;
    if (state.micStream) {
      state.micStream.getTracks().forEach(function (track) {
        track.stop();
      });
      state.micStream = null;
    }
    if (micVis.source) {
      try { micVis.source.disconnect(); } catch (e) { /* noop */ }
      micVis.source = null;
    }
    if (micVis.ctx) {
      var ctx = micVis.ctx;
      micVis.ctx = null;
      micVis.analyser = null;
      micVis.data = null;
      if (ctx.close) ctx.close().catch(function () { /* noop */ });
    }
    if (hadStream) micLog('debug', 'capture.released', null);
  }

  function setupMicAudioGraph(stream) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || !stream) return false;
    try {
      if (micVis.ctx) {
        try { micVis.source.disconnect(); } catch (e) { /* noop */ }
      } else {
        micVis.ctx = new AC();
      }
      micVis.analyser = micVis.ctx.createAnalyser();
      micVis.analyser.fftSize = 256;
      micVis.analyser.smoothingTimeConstant = 0.72;
      micVis.analyser.minDecibels = -85;
      micVis.analyser.maxDecibels = -8;
      micVis.data = new Uint8Array(micVis.analyser.frequencyBinCount);
      micVis.source = micVis.ctx.createMediaStreamSource(stream);
      micVis.source.connect(micVis.analyser);
      if (micVis.ctx.state === 'suspended') {
        micVis.ctx.resume().catch(function () { /* noop */ });
      }
      micVis.useAnalyser = true;
      return true;
    } catch (e) {
      micVis.useAnalyser = false;
      return false;
    }
  }

  function canUseAudioMonitor() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
    if (!window.AudioContext && !window.webkitAudioContext) return false;
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return false;
    return true;
  }

  function tryAttachAudioMonitor() {
    if (!state.listening || micVis.monitorAttempted || !canUseAudioMonitor()) return;
    micVis.monitorAttempted = true;

    navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    }).then(function (stream) {
      if (!state.listening) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        return;
      }
      state.micStream = stream;
      setupMicAudioGraph(stream);
    }).catch(function () {
      micVis.useAnalyser = false;
    });
  }

  function paintMicEqFromAnalyser() {
    if (!micVis.analyser || !micVis.data || !micVis.bars) return false;
    micVis.analyser.getByteFrequencyData(micVis.data);
    var bands = micVis.bars.length;
    var slice = Math.max(1, Math.floor(micVis.data.length / (bands * 3)));
    var barWeights = [0.85, 1.0, 0.92, 1.05];
    var peak = 0;
    micVis.bars.forEach(function (bar, i) {
      var sum = 0;
      var offset = i * slice;
      var j;
      for (j = 0; j < slice; j++) sum += micVis.data[offset + j] || 0;
      var avg = sum / slice;
      if (avg > peak) peak = avg;
      var weight = barWeights[i] || 1;
      var pct = 8 + Math.pow(avg / 255, 1.15) * 52 * weight;
      bar.style.setProperty('--eq-level', Math.round(Math.min(78, pct)) + '%');
    });
    if (peak > 18) micVisPulse(Math.min(0.72, 0.2 + peak / 255));
    return true;
  }

  function micVisPulse(strength) {
    var now = Date.now();
    if (now - micVisLastPulseAt < 180) return;
    micVisLastPulseAt = now;
    var s = strength == null ? 0.42 : strength;
    micVis.energy = Math.min(0.72, Math.max(micVis.energy * 0.5, s));
    micVis.lastSignalAt = now;
    micVis.soundActive = true;
  }

  function bumpMicEqEnergy(amount) {
    micVisPulse(amount == null ? 0.38 : Math.min(0.75, amount));
  }

  function paintMicEqBars() {
    if (!micVis.bars || !micVis.bars.length) return;
    var now = Date.now();
    var barWeights = [0.82, 1.0, 0.86, 1.04];
    micVis.bars.forEach(function (bar, i) {
      var wave = (Math.sin(now / 110 + i * 1.65) + 1) * 0.5;
      var weight = barWeights[i] || 1;
      var pct = 8 + micVis.energy * (28 + wave * 16) * weight;
      bar.style.setProperty('--eq-level', Math.round(Math.min(72, pct)) + '%');
    });
  }
  function tickMicVisualizer() {
    if (!micVis.active || !micVis.bars || !micVis.bars.length) return;
    if (!state.listening && !state.micStarting) {
      stopMicVisualizer();
      return;
    }

    var now = Date.now();
    var idleMs = now - (micVis.lastSignalAt || 0);
    if (idleMs > 120) {
      micVis.soundActive = false;
      micVis.energy = Math.max(0.04, micVis.energy - 0.055);
    }

    if (micVis.useAnalyser && paintMicEqFromAnalyser()) {
      micVis.raf = requestAnimationFrame(tickMicVisualizer);
      return;
    }

    paintMicEqBars();
    micVis.raf = requestAnimationFrame(tickMicVisualizer);
  }

  function startMicVisualizer() {
    if (!micVis.bars || !micVis.bars.length) {
      micLog('warn', 'vis.start.skip', { reason: 'noBars', bars: micVis.bars ? micVis.bars.length : 0 });
      return;
    }
    micVis.active = true;
    micVis.soundActive = false;
    micVis.energy = 0.1;
    micVis.lastSignalAt = Date.now();
    if (micVis.raf) cancelAnimationFrame(micVis.raf);
    micVis.raf = requestAnimationFrame(tickMicVisualizer);
    micLog('debug', 'vis.start', { bars: micVis.bars.length });
  }

  function stopMicVisualizer() {
    if (micVis.active) micLog('debug', 'vis.stop', { energy: micVis.energy });
    micVis.active = false;
    micVis.soundActive = false;
    micVis.energy = 0;
    if (micVis.raf) {
      cancelAnimationFrame(micVis.raf);
      micVis.raf = 0;
    }
    resetMicEqBars();
  }

  function micIsEnabled() {
    return !!(state.micAutoStart && state.micPermissionGranted !== false);
  }

  function speechActive() {
    return !!state.speaking;
  }

  function prepareForVoiceInput() {
    cancelGeneration();
    stopSpeech();
    if (state.tourActive) stopTour();
  }

  function syncMicWatchdog() {
    if (micIsEnabled() && state.recognitionSupported) {
      if (!micWatchdog) {
        micWatchdog = window.setInterval(function () {
          if (!micIsEnabled() || state.listening || state.micStarting || micBusy()) return;
          if (micPausedByFailure || micRecEnding) return;
          if (micRestartTimer || micStartDelayTimer || micAutoStartTimer) return;
          micLog('debug', 'watchdog.startListening', micSnapshot());
          startListening(false);
        }, 4000);
        micLog('info', 'watchdog.on', null);
      }
      return;
    }
    if (micWatchdog) {
      clearInterval(micWatchdog);
      micWatchdog = 0;
      micLog('info', 'watchdog.off', null);
    }
  }

  function clearMicStartTimeout() {
    if (!micStartTimeout) return;
    clearTimeout(micStartTimeout);
    micStartTimeout = 0;
  }

  function parseRecognitionEvent(event) {
    var finalText = '';
    var interimText = '';
    var i;

    for (i = event.resultIndex; i < event.results.length; i++) {
      var chunk = event.results[i] && event.results[i][0]
        ? event.results[i][0].transcript
        : '';
      if (event.results[i].isFinal) {
        finalText += chunk;
      } else {
        interimText += chunk;
      }
    }

    if (!finalText && !interimText && event.results.length) {
      var last = event.results[event.results.length - 1];
      var lastChunk = last && last[0] ? last[0].transcript : '';
      if (last && last.isFinal) finalText = lastChunk;
      else interimText = lastChunk;
    }

    return {
      final: String(finalText || '').trim(),
      interim: String(interimText || '').trim()
    };
  }

  function handleRecognitionResult(event) {
    var parsed = parseRecognitionEvent(event);
    micLog('info', 'recognition.result', {
      resultIndex: event.resultIndex,
      resultsLen: event.results ? event.results.length : 0,
      final: parsed.final,
      interim: parsed.interim
    });
    if (parsed.final) micLogTranscript('final', parsed.final);
    else if (parsed.interim) micLogTranscript('interim', parsed.interim);
    if (parsed.final || parsed.interim) {
      micNoSpeechCount = 0;
      micNoVoiceHintShown = false;
      micAbortStreak = 0;
      resetMicFailureState();
      micSessionSound = true;
      micVisPulse(parsed.final ? 0.62 : 0.46);
    }
    if (parsed.final) {
      processVoiceTranscript(parsed.final, true);
      return;
    }
    if (parsed.interim) {
      micLastInterim = parsed.interim;
      if (state.inputEl) state.inputEl.value = parsed.interim;
      scheduleInterimCommit(1600);
    }
  }

  function attachRecognitionHandlers(recognition, gen) {
    recognition.onstart = function () {
      if (!recognitionIsCurrent(recognition, gen)) return;
      micRecEnding = false;
      clearMicStartTimeout();
      recognitionFailCount = 0;
      micStopReason = '';
      micSessionAudio = false;
      micSessionSound = false;
      state.micStarting = false;
      state.listening = true;
      state.micPermissionGranted = true;
      micLog('info', 'recognition.onstart', { lang: recognition.lang });
      emitOrb('listening');
      startMicVisualizer();
      updateMicButton();
    };

    recognition.onend = function () {
      if (!recognitionIsCurrent(recognition, gen)) {
        micLog('debug', 'recognition.onend.stale', { gen: gen, current: micRecGen });
        return;
      }
      micRecEnding = false;
      clearMicStartTimeout();
      micVis.soundActive = false;
      var reason = micStopReason || 'end';
      micStopReason = '';
      micRecEndedAt = Date.now();
      micLog('info', 'recognition.onend', {
        reason: reason,
        sessionAudio: micSessionAudio,
        sessionSound: micSessionSound,
        enabled: micIsEnabled(),
        busy: micBusy(),
        busyReasons: micBusyReasons()
      });
      releaseMicCapture();
      state.listening = false;
      state.micStarting = false;
      updateMicButton();
      if (!micBusy()) releaseOrbIdle(700);
      if (!micIsEnabled()) return;
      if (micBusy()) {
        scheduleMicAutoStart(500);
        return;
      }

      if (reason === 'no-speech') {
        micNoSpeechCount += 1;
        if (micSessionAudio && !micSessionSound) {
          micLog('warn', 'recognition.audioButNoVoice', {
            count: micNoSpeechCount,
            hint: 'Mic captures audio but speech VAD never triggered — check default input device and input volume.'
          });
          if (micNoSpeechCount >= 2 && !micNoVoiceHintShown) {
            micNoVoiceHintShown = true;
            sayBotSilent('ai.micNoVoice', null, function () {
              scheduleMicRestart(1200, 'no-speech');
            });
            return;
          }
        } else if (micNoSpeechCount >= 5) {
          micLog('warn', 'recognition.noSpeechHint', {
            hint: 'Repeated silence timeouts — speak right after the listening indicator appears.'
          });
        }
        scheduleMicRestart(null, 'no-speech');
        return;
      }

      if (reason === 'not-allowed' || reason === 'service-not-allowed') return;

      if (reason === 'aborted') {
        micAbortStreak += 1;
        micLog('warn', 'recognition.aborted', { streak: micAbortStreak });
        if (micAbortStreak >= 5) {
          micAbortStreak = 0;
          micFailureRebuilds += 1;
          teardownRecognitionInstance();
          state.recognition = createRecognitionInstance();
          if (micFailureRebuilds > MIC_MAX_FAILURE_REBUILDS) {
            pauseMicAfterFailure();
            return;
          }
          scheduleMicRestart(3200, 'aborted');
          return;
        }
        scheduleMicRestart(null, 'aborted');
        return;
      }

      micAbortStreak = 0;
      scheduleMicRestart(null, reason);
    };

    recognition.onerror = function (event) {
      if (!recognitionIsCurrent(recognition, gen)) return;
      micRecEnding = true;
      clearMicStartTimeout();
      micVis.soundActive = false;
      micStopReason = event.error || 'unknown';
      var benign = event.error === 'no-speech' || event.error === 'aborted';
      micLog(benign ? 'info' : 'error', 'recognition.onerror', {
        error: event.error,
        message: event.message || '',
        failCount: recognitionFailCount,
        sessionAudio: micSessionAudio,
        sessionSound: micSessionSound
      });
      releaseMicCapture();
      state.listening = false;
      state.micStarting = false;
      updateMicButton();

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        state.micPermissionGranted = false;
        clearMicRestartTimer();
        clearMicAutoStartTimer();
        clearMicInterimTimer();
        updateMicButton();
        sayBot('ai.micDenied');
        return;
      }

      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }

      recognitionFailCount += 1;
      if (recognitionFailCount >= 3) {
        recognitionFailCount = 0;
        rebuildRecognitionInstance();
      }
    };

    recognition.onnomatch = function () {
      micLog('info', 'recognition.onnomatch', null);
    };

    recognition.onresult = function (event) {
      if (!recognitionIsCurrent(recognition, gen)) return;
      handleRecognitionResult(event);
    };

    recognition.onaudiostart = function () {
      if (!recognitionIsCurrent(recognition, gen)) return;
      micSessionAudio = true;
      micLog('info', 'recognition.onaudiostart', null);
    };

    recognition.onaudioend = function () {
      micLog('debug', 'recognition.onaudioend', null);
    };

    recognition.onsoundstart = function () {
      if (!recognitionIsCurrent(recognition, gen)) return;
      micSessionSound = true;
      micNoSpeechCount = 0;
      micNoVoiceHintShown = false;
      micLog('info', 'recognition.onsoundstart', null);
      micVisPulse(0.34);
    };

    recognition.onsoundend = function () {
      micLog('debug', 'recognition.onsoundend', null);
    };

    recognition.onspeechstart = function () {
      if (!recognitionIsCurrent(recognition, gen)) return;
      micSessionSound = true;
      micNoSpeechCount = 0;
      micLog('info', 'recognition.onspeechstart', null);
      micVisPulse(0.44);
    };

    recognition.onspeechend = function () {
      micLog('debug', 'recognition.onspeechend', null);
      micVis.soundActive = false;
    };
  }

  function createRecognitionInstance() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      micLog('error', 'recognition.unavailable', null);
      return null;
    }
    micRecGen += 1;
    var gen = micRecGen;
    var recognition = new SR();
    var winDesktop = /Windows/i.test(navigator.userAgent || '') &&
      !/Windows Phone/i.test(navigator.userAgent || '');
    recognition.continuous = !winDesktop;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    attachRecognitionHandlers(recognition, gen);
    micLog('info', 'recognition.created', {
      gen: gen,
      continuous: recognition.continuous,
      interimResults: recognition.interimResults
    });
    return recognition;
  }

  function rebuildRecognitionInstance() {
    micLog('warn', 'recognition.rebuild', { failCount: recognitionFailCount });
    teardownRecognitionInstance();
    stopMicVisualizer();
    updateMicButton();
    state.recognition = createRecognitionInstance();
  }

  function micBusy() {
    return !!(state.typing || state.aiPending || speechActive() ||
      (state.tourActive && (state.speaking || state.tourTimer)));
  }

  function queueVoiceInput(raw) {
    var text = String(raw || '').trim();
    if (!text) return;
    pendingVoiceInput = text;
    if (state.inputEl) state.inputEl.value = text;
  }

  function flushPendingVoiceInput() {
    if (!pendingVoiceInput) return;
    if (micBusy()) {
      scheduleMicAutoStart(speechActive() ? 900 : 500);
      return;
    }
    var raw = pendingVoiceInput;
    pendingVoiceInput = '';
    handleInput(raw, { fromQueue: true });
  }

  function commitInterimTranscript() {
    micInterimTimer = 0;
    var text = micLastInterim.trim();
    micLastInterim = '';
    if (!text) {
      micLog('debug', 'interim.commit.empty', null);
      return;
    }
    micLog('info', 'interim.commit', { text: text.slice(0, 120) });

    stopListening(true);
    var handled = handleInput(text, { fromVoice: true });
    if (handled) {
      if (state.inputEl) state.inputEl.value = '';
    } else if (state.inputEl) {
      state.inputEl.value = text;
    }
  }

  function scheduleInterimCommit(delay) {
    clearMicInterimTimer();
    micInterimTimer = window.setTimeout(commitInterimTranscript, delay == null ? 1500 : delay);
  }

  function processVoiceTranscript(text, isFinal) {
    text = String(text || '').trim();
    if (!text) {
      micLog('debug', 'transcript.empty', { isFinal: !!isFinal });
      return;
    }
    micLog('info', 'transcript.process', { isFinal: !!isFinal, len: text.length });

    clearMicInterimTimer();
    micLastInterim = '';

    if (state.inputEl) state.inputEl.value = text;

    if (isFinal) {
      stopListening(true);
      var handled = handleInput(text, { fromVoice: true });
      if (handled) {
        if (state.inputEl) state.inputEl.value = '';
      }
      return;
    }

    micLastInterim = text;
    scheduleInterimCommit(1600);
  }

  function bootstrapMic() {
    if (!state.recognitionSupported || !state.micAutoStart || !state.ready) {
      micLog('debug', 'bootstrap.skip', {
        supported: state.recognitionSupported,
        autoStart: state.micAutoStart,
        ready: state.ready
      });
      return;
    }

    micLog('info', 'bootstrap.start', null);
    requestMicPermission().then(function (granted) {
      micLog('info', 'bootstrap.permission', { granted: granted });
      updateMicButton();
    });
  }

  function updateMicButton() {
    if (!state.micBtn) return;
    var denied = state.micPermissionGranted === false;
    var enabled = micIsEnabled();
    var listening = state.listening;

    state.micBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    state.micBtn.classList.toggle('is-listening', listening || state.micStarting);
    state.micBtn.classList.toggle('is-enabled', enabled && !listening && !state.micStarting);
    state.micBtn.classList.toggle('is-off', !enabled && !denied);
    state.micBtn.classList.toggle('is-denied', denied);
    state.micBtn.classList.toggle('is-disabled', denied);

    var labelKey = 'ai.micDisabledLabel';
    if (denied) labelKey = 'ai.micBlockedLabel';
    else if (listening) labelKey = 'ai.micListeningLabel';
    else if (enabled) labelKey = 'ai.micEnabledLabel';

    state.micBtn.setAttribute('aria-label', t(labelKey));
    state.micBtn.title = t(labelKey);
    syncMicWatchdog();
  }

  function probeMicPermission() {
    if (!navigator.permissions || !navigator.permissions.query) {
      return Promise.resolve(null);
    }
    return navigator.permissions.query({ name: 'microphone' }).then(function (status) {
      micLog('debug', 'permission.probe', { state: status.state });
      if (status.state === 'granted') {
        state.micPermissionGranted = true;
        return true;
      }
      if (status.state === 'denied') {
        state.micPermissionGranted = false;
        return false;
      }
      return null;
    }).catch(function () {
      return null;
    });
  }

  function requestMicPermission() {
    if (!state.recognitionSupported) {
      micLog('warn', 'permission.skip', { reason: 'unsupported' });
      return Promise.resolve(false);
    }

    if (state.micPermissionGranted === true) {
      micLog('debug', 'permission.cached', { granted: true });
      return Promise.resolve(true);
    }

    return probeMicPermission().then(function (known) {
      if (known === true) return true;
      if (known === false) return false;

      micLog('info', 'permission.deferToRecognition', {
        reason: 'Skip getUserMedia probe; SpeechRecognition will request mic directly'
      });
      return true;
    });
  }

  function invokeRecognitionStart(force) {
    if (!state.recognitionSupported || !state.recognition) return;
    if (!micIsEnabled()) {
      state.micStarting = false;
      updateMicButton();
      return;
    }

    clearMicStartDelayTimer();
    releaseMicCapture();

    function callStart() {
      micStartDelayTimer = 0;
      if (!micIsEnabled() || micPausedByFailure) {
        state.micStarting = false;
        updateMicButton();
        return;
      }
      if (micRecEnding) {
        micLog('debug', 'start.waitEnding', null);
        micStartDelayTimer = window.setTimeout(callStart, 250);
        return;
      }
      if (state.listening) {
        micLog('debug', 'start.skip', { reason: 'alreadyListening' });
        state.micStarting = false;
        updateMicButton();
        return;
      }
      try {
        state.recognition.lang = SPEECH_LANG[getLang()] || SPEECH_LANG.en;
        micLog('info', 'start.call', { force: !!force, lang: state.recognition.lang });
        state.recognition.start();
        micStartTimeout = window.setTimeout(function () {
          micStartTimeout = 0;
          if (!state.listening && state.micStarting) {
            micLog('error', 'start.timeout', {
              hint: 'recognition.start() did not fire onstart within 4.5s',
              lang: state.recognition.lang
            });
            state.micStarting = false;
            releaseMicCapture();
            updateMicButton();
            rebuildRecognitionInstance();
            if (micIsEnabled()) scheduleMicRestart(1200, 'timeout');
          }
        }, 4500);
      } catch (err) {
        micLog('error', 'start.exception', {
          name: err && err.name,
          message: err && err.message
        });
        state.micStarting = false;
        releaseMicCapture();
        updateMicButton();
        recognitionFailCount += 1;
        if (recognitionFailCount >= 2) {
          recognitionFailCount = 0;
          rebuildRecognitionInstance();
        }
        scheduleMicRestart(1200, 'exception');
      }
    }

    var waitMs = micRestartCooldownMs();
    if (waitMs > 0) {
      micLog('debug', 'start.cooldown', { waitMs: waitMs, abortStreak: micAbortStreak });
      micStartDelayTimer = window.setTimeout(callStart, waitMs);
      return;
    }
    callStart();
  }

  function beginRecognitionAfterIdle(force) {
    if (!micIsEnabled()) {
      state.micStarting = false;
      updateMicButton();
      return;
    }
    if (state.listening) return;
    invokeRecognitionStart(force);
  }

  function startListening(force) {
    if (!state.recognitionSupported || !state.recognition) {
      micLog('warn', 'start.skip', { reason: 'unsupported' });
      return;
    }
    if (!micIsEnabled()) {
      micLog('debug', 'start.skip', { reason: 'disabled', autoStart: state.micAutoStart, permission: state.micPermissionGranted });
      return;
    }
    if (state.listening || state.micStarting) {
      micLog('debug', 'start.skip', { reason: 'alreadyActive', listening: state.listening, starting: state.micStarting });
      return;
    }

    if (micBusy()) {
      if (!force) {
        micLog('debug', 'start.defer', { reason: 'busy', busyReasons: micBusyReasons() });
        scheduleMicAutoStart(500);
        return;
      }
      micLog('info', 'start.force', { busyReasons: micBusyReasons() });
      prepareForVoiceInput();
    }

    clearMicRestartTimer();
    clearMicAutoStartTimer();
    clearMicStartTimeout();
    clearMicStartDelayTimer();
    state.micStarting = true;
    updateMicButton();

    waitForAudioIdle(function () {
      beginRecognitionAfterIdle(force);
    });
  }

  function maybeAutoStartMic() {
    if (!micIsEnabled()) {
      micLog('debug', 'auto.skip', { reason: 'disabled' });
      return;
    }
    if (micPausedByFailure) {
      micLog('debug', 'auto.skip', { reason: 'pausedByFailure' });
      return;
    }
    if (micRecEnding) {
      micLog('debug', 'auto.skip', { reason: 'recEnding' });
      scheduleMicAutoStart(300);
      return;
    }
    if (state.listening || state.micStarting) {
      micLog('debug', 'auto.skip', { reason: 'active' });
      return;
    }
    flushPendingVoiceInput();
    if (pendingVoiceInput) {
      micLog('debug', 'auto.skip', { reason: 'pendingVoice', pending: pendingVoiceInput.slice(0, 80) });
      return;
    }
    if (micBusy()) {
      micLog('debug', 'auto.defer', { busyReasons: micBusyReasons() });
      if (!micAutoStartTimer) {
        scheduleMicAutoStart(speechActive() ? MIC_POST_SPEECH_MS : 700);
      }
      return;
    }
    micLog('debug', 'auto.startListening', null);
    startListening();
  }

  function requestMicAccessOnLoad() {
    if (!state.recognitionSupported) {
      micLog('warn', 'init.unsupported', micEnvInfo());
      return;
    }

    var storedMic = localStorage.getItem(MIC_AUTO_KEY);
    state.micAutoStart = storedMic === null ? true : storedMic === '1';
    micLog('info', 'init.load', { autoStart: state.micAutoStart, storedMic: storedMic });
    updateMicButton();

    requestMicPermission().then(function (granted) {
      micLog('info', 'init.permission', { granted: granted });
      updateMicButton();
      bootstrapMic();
    });
  }

  function stopListening(silent) {
    micLog('info', 'stop', { silent: !!silent, wasListening: state.listening });
    clearMicRestartTimer();
    clearMicInterimTimer();
    clearMicStartTimeout();
    clearMicStartDelayTimer();
    state.micStarting = false;
    micRecEnding = false;
    if (!state.recognition) return;

    if (state.listening) {
      try {
        state.recognition.stop();
      } catch (err) {
        micLog('warn', 'stop.exception', { message: err && err.message });
      }
    }

    state.listening = false;
    releaseMicCapture();
    stopMicVisualizer();
    updateMicButton();
    if (!silent && !micBusy()) {
      releaseOrbIdle(700);
    }
  }

  function initSpeechRecognition() {
    initMicDebug();
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognitionSupported = !!SR;
    state.micBtn = document.getElementById('ai-core-mic');
    if (!state.micBtn) {
      micLog('warn', 'init.noButton', null);
      return;
    }

    initMicVisualizer();
    micLog('info', 'init.visualizer', { bars: micVis.bars ? micVis.bars.length : 0 });

    if (!state.recognitionSupported) {
      state.micBtn.hidden = true;
      micLog('warn', 'init.hideButton', micEnvInfo());
      return;
    }

    state.recognition = createRecognitionInstance();
    if (!state.recognition) {
      state.micBtn.hidden = true;
      return;
    }

    updateMicButton();

    state.micBtn.addEventListener('click', function () {
      if (micIsEnabled()) {
        micLog('info', 'button.off', null);
        setMicAutoStart(false);
        return;
      }

      micLog('info', 'button.on', null);
      setMicAutoStart(true);

      requestMicPermission().then(function (granted) {
        if (granted !== false) {
          startListening(true);
          return;
        }
        sayBot('ai.micDenied');
        updateMicButton();
      });
    });

    window.addEventListener('hls:locale-change', function () {
      if (state.listening) stopListening(true);
      updateMicButton();
    });
  }

  function sayUser(text) {
    appendBubble(text, 'user');
    emitOrb('user', { impulse: 0.48 });
  }

  function stopTour() {
    state.tourActive = false;
    if (state.tourTimer) {
      clearTimeout(state.tourTimer);
      state.tourTimer = null;
    }
    state.tourIndex = 0;
    stopSpeech();
    releaseOrbIdle(400);
  }

  function pauseMicForTour() {
    state.micPausedForTour = micIsEnabled() || state.micAutoStart;
    clearMicRestartTimer();
    clearMicAutoStartTimer();
    stopListening(true);
    state.micAutoStart = false;
    updateMicButton();
  }

  function resumeMicAfterTour() {
    if (!state.micPausedForTour) {
      state.micPausedForTour = false;
      return;
    }
    state.micPausedForTour = false;
    var storedMic = localStorage.getItem(MIC_AUTO_KEY);
    if (storedMic === '0') return;
    setMicAutoStart(true, false);
    maybeAutoStartMic();
  }

  function presentSection(sec, opts) {
    opts = opts || {};
    stopTour();
    if (opts.userText) sayUser(opts.userText);

    var meta = sectionMeta(sec.id);
    var displayText = t('ai.sectionLead', meta);
    var voiceText = t('ai.navigatingVoice', { name: meta.name }) + ' ' + t('ai.sectionVoice', meta);

    scrollToSectionWhenReady(sec.id).then(function () {
      document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: sec.id } }));
      emitOrb('navigate', { sectionId: sec.id, impulse: 0.6 });

      showBotMessage(displayText, {
        speakText: voiceText,
        onDone: opts.onDone
      });
    });
  }

  function openSection(sec, userText) {
    presentSection(sec, { userText: userText });
  }

  function scheduleTourStep(delay) {
    state.tourTimer = window.setTimeout(tourStep, delay == null ? 1200 : delay);
  }

  function tourStep() {
    state.tourTimer = null;
    if (!state.tourActive) return;

    if (state.tourIndex >= SECTIONS.length) {
      scrollToSectionWhenReady('hero').then(function () {
        if (!state.tourActive) return;
        document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: 'hero' } }));
        emitOrb('navigate', { sectionId: 'hero', impulse: 0.55 });
        showBotMessage(t('ai.tourDone'), {
          speakText: tVoice('ai.tourDone'),
          onDone: function () {
            state.tourActive = false;
            resumeMicAfterTour();
          }
        });
      });
      state.tourIndex = 0;
      return;
    }

    var sec = SECTIONS[state.tourIndex];
    var meta = sectionMeta(sec.id);
    var displayText = t('ai.sectionLead', meta);
    var voiceText = t('ai.sectionVoice', meta);
    var stepIndex = state.tourIndex;
    state.tourIndex += 1;

    scrollToSectionWhenReady(sec.id).then(function () {
      if (!state.tourActive) return;

      document.dispatchEvent(new CustomEvent('ai-core:navigate', { detail: { sectionId: sec.id } }));
      emitOrb('navigate', { sectionId: sec.id, impulse: 0.6 });

      showBotMessage(displayText, {
        speak: false,
        onDone: function () {
          speakAsync(voiceText).then(function (ok) {
            if (!state.tourActive) return;
            if (!ok) {
              state.tourIndex = stepIndex;
              scheduleTourStep(600);
              return;
            }
            scheduleTourStep(state.reducedMotion ? 700 : 1200);
          });
        }
      });
    });
  }

  function startTour(userText) {
    stopTour();
    state.tourActive = true;
    emitOrb('tour');
    pauseMicForTour();
    if (userText) sayUser(userText);

    state.tourIndex = 0;
    showBotMessage(t('ai.tourStart'), {
      speakText: tVoice('ai.tourStart'),
      onDone: function () {
        if (!state.tourActive) return;
        tourStep();
      }
    });
  }

  function handleInput(raw, opts) {
    opts = opts || {};
    var text = normalize(raw);
    if (!text) return false;

    if (opts.fromVoice) {
      prepareForVoiceInput();
    } else if (micBusy() || (state.tourActive && state.speaking)) {
      if (!opts.fromQueue) queueVoiceInput(raw);
      return false;
    }

    pendingVoiceInput = '';
    stopTour();
    stopListening(true);
    sayUser(raw);

    var lang = getLang();

    if (matchesAny(text, GREET_WORDS[lang] || GREET_WORDS.en) && !isGeneralQuestion(text) && text.length < 32) {
      sayBot('ai.greeting');
      return true;
    }
    if (matchesAny(text, THANK_WORDS[lang] || THANK_WORDS.en) && !isGeneralQuestion(text) && text.length < 40) {
      sayBot('ai.thanks');
      return true;
    }
    if (matchesAny(text, HELP_WORDS[lang] || HELP_WORDS.en)) {
      sayBot('ai.help');
      return true;
    }
    if (matchesAny(text, TOUR_WORDS[lang] || TOUR_WORDS.en)) {
      startTour();
      return true;
    }
    if (matchesAny(text, HERE_WORDS[lang] || HERE_WORDS.en)) {
      var hereId = getVisibleSectionId();
      if (hereId) {
        var hereMeta = sectionMeta(hereId);
        showBotMessage(t('ai.here', hereMeta), {
          speakText: tVoice('ai.here', hereMeta)
        });
      } else {
        sayBot('ai.hereUnknown');
      }
      return true;
    }

    var sec = detectSection(text);
    if (sec && isNavigationIntent(text)) {
      openSection(sec);
      return true;
    }

    if (text.indexOf('show') !== -1 || text.indexOf('open') !== -1 || text.indexOf('go') !== -1 ||
        text.indexOf('покаж') !== -1 || text.indexOf('откр') !== -1 || text.indexOf('перей') !== -1 ||
        text.indexOf('打开') !== -1 || text.indexOf('去') !== -1) {
      sec = detectSection(text.replace(/show|open|go to|go|покажи|открой|перейди|打开|去/g, '').trim());
      if (sec) {
        openSection(sec);
        return true;
      }
    }

    askGeneral(raw);
    return true;
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
      var sx = cx + (Math.random() - 0.5) * w * 0.28;
      var sy = cy - h * 0.12 + (Math.random() - 0.5) * h * 0.1;
      var points = [{ x: sx, y: sy }];
      var x = sx;
      var y = sy;
      var segments = 6 + Math.floor(Math.random() * 6);
      var branchAt = segments > 7 ? 3 + Math.floor(Math.random() * 3) : -1;
      var branches = [];

      for (var i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * w * 0.14;
        y += h / segments + (Math.random() - 0.5) * 18;
        points.push({ x: x, y: y });
        if (i === branchAt) {
          var bx = x;
          var by = y;
          var bpts = [{ x: bx, y: by }];
          var j;
          for (j = 0; j < 3; j++) {
            bx += (Math.random() - 0.5) * w * 0.12;
            by += h * 0.06 + (Math.random() - 0.5) * 12;
            bpts.push({ x: bx, y: by });
          }
          branches.push(bpts);
        }
      }

      var color = COLORS[Math.floor(Math.random() * COLORS.length)];
      bolts.push({
        points: points,
        branches: branches,
        color: color,
        life: 1,
        width: 1.4 + Math.random() * 2.4
      });

      if (Math.random() < 0.45) {
        var sx2 = cx + (Math.random() - 0.5) * w * 0.34;
        var sy2 = cy - h * 0.08;
        var pts2 = [{ x: sx2, y: sy2 }];
        var x2 = sx2;
        var y2 = sy2;
        for (var k = 0; k < 4 + Math.floor(Math.random() * 4); k++) {
          x2 += (Math.random() - 0.5) * w * 0.1;
          y2 += h * 0.08;
          pts2.push({ x: x2, y: y2 });
        }
        bolts.push({
          points: pts2,
          branches: [],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0.85,
          width: 0.9 + Math.random() * 1.2
        });
      }
    }

    function strokePath(points, width, color, alpha, blur) {
      if (points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawBolt(bolt) {
      if (bolt.points.length < 2) return;
      strokePath(bolt.points, bolt.width * 3.2, bolt.color, bolt.life * 0.22, 18);
      strokePath(bolt.points, bolt.width * 1.6, '#ffffff', bolt.life * 0.35, 10);
      strokePath(bolt.points, bolt.width, bolt.color, bolt.life * 0.92, 6);
      var bi;
      for (bi = 0; bi < bolt.branches.length; bi++) {
        strokePath(bolt.branches[bi], bolt.width * 0.7, bolt.color, bolt.life * 0.55, 4);
      }
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

      if (now - lastFlash > 420 + Math.random() * 900) {
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

    document.addEventListener('ai-core:orb', function (e) {
      if (!shouldRun()) return;
      var mode = e.detail && e.detail.mode;
      var i;
      if (mode === 'navigate') {
        for (i = 0; i < 3; i++) randomBolt();
      } else if (mode === 'user' || mode === 'speaking') {
        randomBolt();
      } else if (mode === 'thinking') {
        if (Math.random() < 0.6) randomBolt();
      }
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
    state.stopBtn = document.getElementById('ai-core-stop');

    if (!state.messagesEl || !state.formEl) return;

    buildChips();

    if (state.stopBtn) {
      state.stopBtn.addEventListener('click', function () {
        cancelGeneration();
      });
    }

    state.formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = state.inputEl.value;
      state.inputEl.value = '';
      handleInput(val);
    });

    setTimeout(function () {
      state.ready = true;
      showBotMessage(t('ai.greeting'), {
        speakText: tVoice('ai.greeting'),
        onDone: micAutoStartAfterSpeech
      });
      bootstrapMic();
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
          onDone: micAutoStartAfterSpeech
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
    window.HLS.getSpeechVoiceInfo = getSpeechVoiceInfo;
    window.HLS.refreshSpeechVoices = refreshSpeechVoices;

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
