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
        en: ['north', 'star', 'future', 'founder', 'yacht', '2040', 'outcome'],
        ru: ['поляр', 'звезд', 'будущ', 'основат', '2040', 'yacht'],
        zh: ['北极星', '未来', '创始人', '2040', '游艇']
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
    typing: false,
    tourTimer: null,
    tourIndex: 0,
    reducedMotion: false,
    voiceEnabled: true,
    speechSupported: false,
    lastLang: null,
    ready: false
  };

  var VOICE_KEY = 'hls-ai-voice';
  var SPEECH_LANG = { en: 'en-US', ru: 'ru-RU', zh: 'zh-CN' };
  var speechVoices = [];

  function getLang() {
    var stored = localStorage.getItem('hls-lang');
    if (stored && window.HLS_I18N[stored]) return stored;
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().split('-')[0];
      if (window.HLS_I18N[code]) return code;
    }
    return 'en';
  }

  function t(key, vars) {
    var lang = getLang();
    var dict = window.HLS_I18N[lang] || window.HLS_I18N.en;
    var text = dict[key] || window.HLS_I18N.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.split('{' + k + '}').join(vars[k]);
      });
    }
    return text;
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

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;

    var header = document.querySelector('.site-header');
    var strip = document.querySelector('.section-strip');
    var offset = (header ? header.offsetHeight : 0) + (strip ? strip.offsetHeight : 0) + 16;
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

  function typeBotMessage(text, done) {
    stopSpeech();

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

  function sayBot(key, vars, done) {
    var text = t(key, vars);
    typeBotMessage(text, function () {
      speak(text);
      if (done) done();
    });
  }

  function stopSpeech() {
    if (!state.speechSupported) return;
    window.speechSynthesis.cancel();
  }

  function refreshSpeechVoices() {
    if (!state.speechSupported) return;
    speechVoices = window.speechSynthesis.getVoices() || [];
  }

  function pickSpeechVoice(lang) {
    var code = SPEECH_LANG[lang] || SPEECH_LANG.en;
    var prefix = code.split('-')[0];
    var i;

    for (i = 0; i < speechVoices.length; i++) {
      if (speechVoices[i].lang === code) return speechVoices[i];
    }
    for (i = 0; i < speechVoices.length; i++) {
      if (speechVoices[i].lang.indexOf(prefix) === 0 && speechVoices[i].localService) {
        return speechVoices[i];
      }
    }
    for (i = 0; i < speechVoices.length; i++) {
      if (speechVoices[i].lang.indexOf(prefix) === 0) return speechVoices[i];
    }
    return null;
  }

  function speak(text) {
    if (!state.voiceEnabled || !state.speechSupported || !text) return;

    stopSpeech();

    var utterance = new SpeechSynthesisUtterance(text);
    var lang = getLang();
    utterance.lang = SPEECH_LANG[lang] || SPEECH_LANG.en;
    utterance.rate = 0.98;
    utterance.pitch = 1;

    var voice = pickSpeechVoice(lang);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
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
      if (document.hidden) stopSpeech();
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

  function openSection(sec, userText) {
    if (userText) sayUser(userText);
    var meta = sectionMeta(sec.id);
    sayBot('ai.navigating', { name: meta.name }, function () {
      scrollToSection(sec.id);
      setTimeout(function () {
        sayBot('ai.sectionLead', { name: meta.name, desc: meta.desc });
      }, state.reducedMotion ? 80 : 520);
    });
  }

  function startTour(userText) {
    stopTour();
    if (userText) sayUser(userText);
    sayBot('ai.tourStart', null, function () {
      state.tourIndex = 0;

      function step() {
        if (state.tourIndex >= SECTIONS.length) {
          sayBot('ai.tourDone');
          return;
        }
        var sec = SECTIONS[state.tourIndex];
        var meta = sectionMeta(sec.id);
        scrollToSection(sec.id);
        sayBot('ai.sectionLead', { name: meta.name, desc: meta.desc });
        state.tourIndex += 1;
        state.tourTimer = setTimeout(step, state.reducedMotion ? 1200 : 3400);
      }

      step();
    });
  }

  function handleInput(raw) {
    var text = normalize(raw);
    if (!text || state.typing) return;

    stopTour();
    sayUser(raw);

    var lang = getLang();

    if (matchesAny(text, GREET_WORDS[lang] || GREET_WORDS.en)) {
      sayBot('ai.greeting');
      return;
    }
    if (matchesAny(text, THANK_WORDS[lang] || THANK_WORDS.en)) {
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
        var meta = sectionMeta(hereId);
        sayBot('ai.here', { name: meta.name, desc: meta.desc });
      } else {
        sayBot('ai.hereUnknown');
      }
      return;
    }

    var sec = detectSection(text);
    if (sec) {
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

    sayBot('ai.unknown');
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
        stopTour();
        openSection(sec, t(sec.nameKey));
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
    'rgba(18, 138, 12, 0.82)',
    'rgba(30, 64, 175, 0.78)',
    'rgba(122, 44, 255, 0.72)',
    'rgba(180, 120, 0, 0.75)',
    'rgba(0, 140, 120, 0.78)'
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
    var canvas = document.getElementById('hero-lightning');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var bolts = [];
    var sparks = [];
    var raf = 0;
    var lastFlash = 0;
    var COLORS = lightningColors();

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function randomBolt() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      var sx = Math.random() * w;
      var sy = Math.random() * h * 0.35;
      var points = [{ x: sx, y: sy }];
      var x = sx;
      var y = sy;
      var segments = 6 + Math.floor(Math.random() * 8);

      for (var i = 0; i < segments; i++) {
        x += (Math.random() - 0.5) * w * 0.18;
        y += h / segments + (Math.random() - 0.5) * 24;
        points.push({ x: x, y: y });
      }

      bolts.push({
        points: points,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        width: 1.5 + Math.random() * 2.5
      });

      for (var s = 0; s < 12; s++) {
        sparks.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 0.6 + Math.random() * 0.4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }

    function drawBolt(bolt) {
      if (bolt.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = bolt.color;
      ctx.lineWidth = bolt.width;
      ctx.shadowColor = bolt.color;
      ctx.shadowBlur = 16;
      ctx.globalAlpha = bolt.life;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (var i = 1; i < bolt.points.length; i++) {
        var p = bolt.points[i];
        var prev = bolt.points[i - 1];
        var mx = (prev.x + p.x) * 0.5 + (Math.random() - 0.5) * 8;
        var my = (prev.y + p.y) * 0.5 + (Math.random() - 0.5) * 8;
        ctx.lineTo(mx, my);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function draw(now) {
      resize();
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      if (!state.reducedMotion && now - lastFlash > 400 + Math.random() * 900) {
        randomBolt();
        if (Math.random() > 0.5) randomBolt();
        lastFlash = now;
      }

      bolts = bolts.filter(function (b) {
        b.life -= 0.045;
        if (b.life > 0) drawBolt(b);
        return b.life > 0;
      });

      sparks.forEach(function (sp) {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.03;
        if (sp.life <= 0) return;
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      sparks = sparks.filter(function (s) { return s.life > 0; });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    document.addEventListener('ai-core:navigate', function () {
      if (!state.reducedMotion) randomBolt();
    });
    raf = requestAnimationFrame(draw);

    lightningDispose = function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
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
      sayBot('ai.greeting');
      state.ready = true;
    }, state.reducedMotion ? 100 : 600);

    window.addEventListener('hls:locale-change', function () {
      refreshChrome();
      var now = getLang();
      if (state.ready && state.lastLang && now !== state.lastLang) {
        sayBot('ai.langSwitch');
      }
      state.lastLang = now;
    });
  }

  function init() {
    state.reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.lastLang = getLang();

    initVoice();
    initLightning();
    initChat();
    window.addEventListener('hls:theme-applied', initLightning);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
