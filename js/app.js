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

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.placeholder = dict[key];
    });

    document.querySelectorAll('[data-i18n-svg]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-svg');
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
    window.dispatchEvent(new Event('hls:theme-applied'));
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
      var onSystemSchemeChange = function () {
        if (getTheme() === 'system') applyTheme('system', false);
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onSystemSchemeChange);
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', onSystemSchemeChange);
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

  function initSectionSpy() {
    var sectionIds = [
      'vision', 'pillars', 'earth-space', 'roadmap',
      'architecture', 'revenue', 'moats', 'north-star'
    ];
    var links = document.querySelectorAll('[data-section-id]');
    var strip = document.querySelector('.section-strip');
    var sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrollTimer;

    function scrollStripToActive(id) {
      if (!strip || !id) return;
      if (strip.scrollWidth <= strip.clientWidth) return;

      var chip = strip.querySelector('.section-chip[data-section-id="' + id + '"]');
      if (!chip) return;

      var target = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
      target = Math.max(0, Math.min(target, strip.scrollWidth - strip.clientWidth));

      strip.scrollTo({
        left: target,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    }

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('data-section-id') === id);
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        scrollStripToActive(id);
      }, 50);
    }

    if ('IntersectionObserver' in window) {
      var visible = {};
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var bestId = sectionIds[0];
        var bestRatio = 0;
        sectionIds.forEach(function (id) {
          if ((visible[id] || 0) > bestRatio) {
            bestRatio = visible[id];
            bestId = id;
          }
        });
        setActive(bestId);
      }, { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5] });

      sections.forEach(function (section) { observer.observe(section); });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        closeHeaderPanel();
        if (link.classList.contains('section-chip')) {
          scrollStripToActive(link.getAttribute('data-section-id'));
        }
      });
    });

    window.addEventListener('resize', function () {
      var active = strip && strip.querySelector('.section-chip.is-active');
      if (active) scrollStripToActive(active.getAttribute('data-section-id'));
    });

    window.addEventListener('hls:locale-change', function () {
      var active = strip && strip.querySelector('.section-chip.is-active');
      if (active) {
        setTimeout(function () {
          scrollStripToActive(active.getAttribute('data-section-id'));
        }, 80);
      }
    });
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
    initSectionSpy();
    initHeaderShadow();
  });
})();
