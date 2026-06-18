(function () {
  'use strict';

  var LANG_KEY = 'hls-lang';
  var THEME_KEY = 'hls-theme';
  var SUPPORTED_LANGS = { en: true, ru: true, zh: true };

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
    if (window.HLS && window.HLS.getLang) return window.HLS.getLang();
    return localStorage.getItem(LANG_KEY) || detectSystemLang();
  }

  function getTheme() {
    if (window.HLS && window.HLS.getThemePreference) {
      return window.HLS.getThemePreference();
    }
    return localStorage.getItem(THEME_KEY) || 'system';
  }

  function applyLang(lang, persist) {
    function run() {
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

      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-aria');
        if (dict[key]) el.setAttribute('aria-label', dict[key]);
      });

      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      if (persist) localStorage.setItem(LANG_KEY, lang);
      window.dispatchEvent(new Event('hls:locale-change'));
    }

    if (window.HLS && window.HLS.loadLocalePack) {
      window.HLS.loadLocalePack(lang).then(run);
    } else {
      run();
    }
  }

  function applyTheme(theme, persist) {
    if (window.HLS && window.HLS.applyThemePreference) {
      window.HLS.applyThemePreference(theme);
    } else {
      document.documentElement.setAttribute('data-theme-pref', theme);
      document.documentElement.setAttribute('data-theme', theme === 'system' ? 'dark' : theme);
    }

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
    if (panel) {
      panel.classList.remove('open');
      panel.hidden = true;
      panel.style.top = '';
      panel.style.bottom = '';
      panel.style.left = '';
      panel.style.right = '';
      panel.style.width = '';
      panel.style.maxHeight = '';
    }
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('header-menu-open');
    if (window.HLS && window.HLS.closeMobileNavAccordion) {
      window.HLS.closeMobileNavAccordion();
    }
  }

  function initHeaderMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.getElementById('header-panel');
    if (!toggle || !panel) return;

    var mobileMq = window.matchMedia('(max-width: 768px)');

    function syncMobilePanelLayout() {
      if (!mobileMq.matches) {
        panel.style.top = '';
        panel.style.bottom = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.width = '';
        panel.style.maxHeight = '';
        return;
      }
      if (!panel.classList.contains('open')) return;
      var header = document.querySelector('.site-header');
      if (!header) return;
      var gap = 8;
      var styles = getComputedStyle(document.documentElement);
      var barGap = parseFloat(styles.getPropertyValue('--bar-float-gap')) || 10;
      var stripStack = parseFloat(styles.getPropertyValue('--strip-stack')) || 80;
      var headerBottom = header.getBoundingClientRect().bottom;
      var sideGap = Math.max(barGap, 8);
      panel.style.left = sideGap + 'px';
      panel.style.right = sideGap + 'px';
      panel.style.width = 'auto';
      panel.style.top = Math.round(headerBottom + gap) + 'px';
      panel.style.bottom = Math.round(stripStack + barGap) + 'px';
      panel.style.maxHeight = '';
    }

    function syncMenuVisibility() {
      toggle.hidden = !mobileMq.matches;
      if (!mobileMq.matches) closeHeaderPanel();
    }

    syncMenuVisibility();
    if (mobileMq.addEventListener) {
      mobileMq.addEventListener('change', syncMenuVisibility);
    } else if (mobileMq.addListener) {
      mobileMq.addListener(syncMenuVisibility);
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('header-menu-open', open);
      if (open) {
        panel.scrollTop = 0;
        syncMobilePanelLayout();
        if (window.HLS && window.HLS.closeNavDropdowns) {
          window.HLS.closeNavDropdowns();
        }
      } else {
        panel.style.top = '';
        panel.style.bottom = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.width = '';
        panel.style.maxHeight = '';
      }
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('.nav-dd-link, .theme-btn, .lang-btn, .panel-promo-link')) {
        closeHeaderPanel();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeHeaderPanel();
    });

    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('open')) return;
      var header = document.querySelector('.site-header');
      if (header && header.contains(e.target)) return;
      if (panel.contains(e.target)) return;
      closeHeaderPanel();
    });

    window.addEventListener('resize', syncMobilePanelLayout, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', syncMobilePanelLayout, { passive: true });
    }
  }

  function initSectionSpy() {
    var sectionIds = [
      'vision', 'pillars', 'earth-space', 'roadmap',
      'architecture', 'revenue', 'moats', 'genesis-links', 'scale-links', 'intellectual-links', 'north-star'
    ];
    var links = document.querySelectorAll('.section-chip[data-section-id]');
    var strip = document.querySelector('.section-strip');
    var inner = strip && strip.querySelector('.section-strip-inner');
    var undercover = inner && inner.querySelector('.section-strip-undercover');
    var sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length || !strip || !inner || !undercover) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrollTimer;
    var layoutTimer;
    var activeId = sectionIds[0];

    function stripOverflows() {
      return inner.scrollWidth > strip.clientWidth + 1;
    }

    function syncStripLayout() {
      var overflow = stripOverflows();
      strip.classList.toggle('is-overflow', overflow);
      strip.classList.toggle('is-centered', !overflow);
      if (!overflow) strip.scrollLeft = 0;
    }

    function syncUndercover(chip) {
      if (!chip) {
        undercover.classList.remove('is-visible');
        return;
      }
      var left = chip.offsetLeft;
      undercover.style.width = chip.offsetWidth + 'px';
      undercover.style.height = chip.offsetHeight + 'px';
      undercover.style.transform = 'translate3d(' + left + 'px, -50%, 0)';
      undercover.classList.add('is-visible');
    }

    function ensureChipVisible(chip) {
      if (!chip || !stripOverflows()) {
        if (!stripOverflows()) strip.scrollLeft = 0;
        return;
      }

      var pad = 6;
      var chipLeft = chip.offsetLeft;
      var chipRight = chipLeft + chip.offsetWidth;
      var viewLeft = strip.scrollLeft;
      var viewRight = viewLeft + strip.clientWidth;

      if (chipLeft < viewLeft + pad) {
        strip.scrollLeft = Math.max(0, chipLeft - pad);
      } else if (chipRight > viewRight - pad) {
        strip.scrollLeft = chipRight - strip.clientWidth + pad;
      }
    }

    function scrollStripToActive(id, immediate) {
      if (!id) return;
      var chip = inner.querySelector('.section-chip[data-section-id="' + id + '"]');
      if (!chip) return;

      syncStripLayout();

      if (stripOverflows()) {
        ensureChipVisible(chip);
      } else {
        strip.scrollLeft = 0;
      }

      if (immediate) {
        syncUndercover(chip);
        return;
      }

      requestAnimationFrame(function () {
        syncUndercover(chip);
      });
    }

    function setActive(id) {
      activeId = id;
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('data-section-id') === id);
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        scrollStripToActive(id, false);
      }, 50);
    }

    function scheduleLayoutSync() {
      clearTimeout(layoutTimer);
      layoutTimer = setTimeout(function () {
        syncStripLayout();
        scrollStripToActive(activeId, false);
      }, 80);
    }

    if ('IntersectionObserver' in window) {
      var visible = {};
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var bestId = sectionIds[0];
        var bestRatio = 0;
        sectionIds.forEach(function (sid) {
          if ((visible[sid] || 0) > bestRatio) {
            bestRatio = visible[sid];
            bestId = sid;
          }
        });
        setActive(bestId);
      }, { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5] });

      sections.forEach(function (section) { observer.observe(section); });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        closeHeaderPanel();
        activeId = link.getAttribute('data-section-id');
        scrollStripToActive(activeId, reducedMotion);
      });
    });

    strip.addEventListener('scroll', function () {
      var chip = inner.querySelector('.section-chip.is-active');
      if (chip) syncUndercover(chip);
    }, { passive: true });

    function onResize() {
      scheduleLayoutSync();
    }

    if (window.HLS && window.HLS.onResize) {
      window.HLS.onResize(onResize);
    } else {
      window.addEventListener('resize', onResize, { passive: true });
    }

    window.addEventListener('hls:locale-change', scheduleLayoutSync);

    syncStripLayout();
    var initial = inner.querySelector('.section-chip.is-active') ||
      inner.querySelector('.section-chip[data-section-id="' + sectionIds[0] + '"]');
    if (initial) {
      initial.classList.add('is-active');
      syncUndercover(initial);
    }
  }

  function initHeaderShadow() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var scrolled = false;
    function sync() {
      var next = window.scrollY > 16;
      if (next === scrolled) return;
      scrolled = next;
      header.classList.toggle('is-scrolled', next);
    }

    if (window.HLS && window.HLS.onScroll) {
      window.HLS.onScroll(sync);
    } else {
      window.addEventListener('scroll', sync, { passive: true });
    }
    sync();
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang(), false);
    applyTheme(getTheme(), false);
    initLangSwitch();
    initThemeSwitch();
    initHeaderMenu();
    initSectionSpy();
    initHeaderShadow();
  });
})();
