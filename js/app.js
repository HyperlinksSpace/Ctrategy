(function () {
  'use strict';

  var LANG_KEY = 'hls-lang';
  var THEME_KEY = 'hls-theme';
  var SUPPORTED_LANGS = { en: true, ru: true, zh: true };
  var MOBILE_BP = 768;

  function detectSystemLang() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];

    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().split('-')[0];
      if (SUPPORTED_LANGS[code]) return code;
    }
    return 'en';
  }

  function getLang() {
    return localStorage.getItem(LANG_KEY) || detectSystemLang();
  }

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'system';
  }

  function applyLang(lang, persist) {
    var dict = window.HLS_I18N[lang] || window.HLS_I18N.en;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (persist) localStorage.setItem(LANG_KEY, lang);
    window.dispatchEvent(new Event('hls:locale-change'));
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });

    if (persist) localStorage.setItem(THEME_KEY, theme);
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'), true);
      });
    });
  }

  function initThemeSwitch() {
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme'), true);
      });
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (getTheme() === 'system') applyTheme('system', false);
      });
    }
  }

  function closeHeaderPanel() {
    var panel = document.getElementById('header-panel');
    var toggle = document.querySelector('.menu-toggle');
    if (panel) panel.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function initHeaderMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.getElementById('header-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    panel.querySelectorAll('a, .theme-btn, .lang-btn').forEach(function (el) {
      el.addEventListener('click', function () {
        if (el.tagName === 'A' || el.classList.contains('theme-btn')) {
          closeHeaderPanel();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeHeaderPanel();
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      var header = document.querySelector('.site-header');
      if (header && !header.contains(e.target)) closeHeaderPanel();
    });
  }

  function initResponsiveNav() {
    var header = document.querySelector('.site-header');
    var primary = document.getElementById('nav-primary');
    var panelNav = document.getElementById('nav-panel');
    var toggle = document.querySelector('.menu-toggle');
    if (!header || !primary || !panelNav || !toggle) return;

    var mobileMq = window.matchMedia('(max-width: ' + MOBILE_BP + 'px)');
    var layoutTimer;

    function moveAllToPrimary() {
      while (panelNav.firstChild) {
        primary.appendChild(panelNav.firstChild);
      }
    }

    function moveAllToPanel() {
      while (primary.firstChild) {
        panelNav.appendChild(primary.firstChild);
      }
    }

    function layoutNav() {
      closeHeaderPanel();

      if (mobileMq.matches) {
        moveAllToPanel();
        toggle.hidden = false;
        return;
      }

      moveAllToPrimary();
      toggle.hidden = true;

      var guard = primary.children.length + 1;
      while (guard-- > 0 && primary.scrollWidth > primary.clientWidth && primary.lastElementChild) {
        panelNav.appendChild(primary.lastElementChild);
        toggle.hidden = false;
      }
    }

    function scheduleLayout() {
      clearTimeout(layoutTimer);
      layoutTimer = setTimeout(layoutNav, 60);
    }

    window.addEventListener('resize', scheduleLayout);
    if (mobileMq.addEventListener) {
      mobileMq.addEventListener('change', scheduleLayout);
    } else if (mobileMq.addListener) {
      mobileMq.addListener(scheduleLayout);
    }

    if (window.ResizeObserver) {
      new ResizeObserver(scheduleLayout).observe(header);
      new ResizeObserver(scheduleLayout).observe(primary);
    }

    window.addEventListener('hls:locale-change', scheduleLayout);

    scheduleLayout();
  }

  function initScrollReveal() {
    var sections = document.querySelectorAll('.section, .hero-content, .hero-visual');
    sections.forEach(function (el) { el.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(function (el) { observer.observe(el); });
  }

  function initHeaderShadow() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 20 ? 'var(--shadow)' : 'none';
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang(), false);
    applyTheme(getTheme(), false);
    initLangSwitch();
    initThemeSwitch();
    initResponsiveNav();
    initHeaderMenu();
    initScrollReveal();
    initHeaderShadow();
  });
})();
