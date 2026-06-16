(function () {
  'use strict';

  var openId = null;
  var mobileOpenId = null;
  var mobileMq = window.matchMedia('(max-width: 768px)');

  function getLang() {
    return (window.HLS && window.HLS.getLang) ? window.HLS.getLang() : 'en';
  }

  function isMobile() {
    return mobileMq.matches;
  }

  function getSettings() {
    return window.HLS_SETTINGS || {};
  }

  function getNavdd() {
    return window.HLS_NAVDD || { labels: {}, intros: {}, items: {} };
  }

  function label(key) {
    var lang = getLang();
    var labels = getNavdd().labels || {};
    return (labels[lang] && labels[lang][key]) ||
      (labels.en && labels.en[key]) ||
      key;
  }

  function intro(id) {
    var lang = getLang();
    var intros = getNavdd().intros || {};
    var s = getSettings().dropdownIntros || {};
    return (intros[lang] && intros[lang][id]) ||
      (intros.en && intros.en[id]) ||
      s[id] ||
      '';
  }

  function itemCopy(id, field, fallback) {
    var lang = getLang();
    var items = getNavdd().items || {};
    var entry = items[id];
    if (entry && entry[lang] && entry[lang][field]) return entry[lang][field];
    if (entry && entry.en && entry.en[field]) return entry.en[field];
    return fallback || '';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildLinks(links) {
    if (!links || !links.length) {
      return '<span class="nav-dd-no-link">' + escapeHtml(label('inDevelopment')) + '</span>';
    }
    return links.map(function (link) {
      return '<a class="nav-dd-link" href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(link.label) + ' <span aria-hidden="true">↗</span></a>';
    }).join('');
  }

  function buildProductsHtml() {
    return (getSettings().products || []).map(function (p) {
      return (
        '<article class="nav-dd-card">' +
          '<div class="nav-dd-card-head">' +
            '<h3>' + escapeHtml(itemCopy(p.id, 'name', p.name)) + '</h3>' +
            '<span class="nav-dd-tag">' + escapeHtml(itemCopy(p.id, 'tagline', p.tagline || '')) + '</span>' +
          '</div>' +
          '<p>' + escapeHtml(itemCopy(p.id, 'desc', p.description)) + '</p>' +
          '<div class="nav-dd-links">' + buildLinks(p.links) + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function buildResearchHtml() {
    return (getSettings().research || []).map(function (r) {
      return (
        '<article class="nav-dd-card">' +
          '<h3>' + escapeHtml(itemCopy(r.id, 'name', r.name)) + '</h3>' +
          '<p>' + escapeHtml(itemCopy(r.id, 'desc', r.description)) + '</p>' +
          '<div class="nav-dd-links">' + buildLinks(r.links) + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function buildTechHtml() {
    var s = getSettings();
    var techExisting = (s.tech && s.tech.existing || []).map(function (t) {
      return (
        '<article class="nav-dd-card">' +
          '<h3>' + escapeHtml(itemCopy(t.id, 'name', t.name)) + '</h3>' +
          '<p>' + escapeHtml(itemCopy(t.id, 'desc', t.description)) + '</p>' +
          '<div class="nav-dd-links">' + buildLinks(t.links) + '</div>' +
        '</article>'
      );
    }).join('');

    var techPlanned = (s.tech && s.tech.planned || []).map(function (t) {
      return (
        '<article class="nav-dd-card nav-dd-card--planned">' +
          '<div class="nav-dd-card-head">' +
            '<h3>' + escapeHtml(itemCopy(t.id, 'name', t.name)) + '</h3>' +
            '<span class="nav-dd-badge">' + escapeHtml(label('roadmap')) + '</span>' +
          '</div>' +
          '<p>' + escapeHtml(itemCopy(t.id, 'desc', t.description)) + '</p>' +
        '</article>'
      );
    }).join('');

    return (
      '<p class="nav-dd-section">' + escapeHtml(label('inProduction')) + '</p>' + techExisting +
      '<p class="nav-dd-section nav-dd-section--planned">' + escapeHtml(label('buildingToward')) + '</p>' + techPlanned
    );
  }

  function renderDropdown(id, title, subtitle, bodyHtml) {
    return (
      '<div class="nav-dropdown" id="dropdown-' + id + '" data-dropdown-panel="' + id + '" hidden>' +
        '<div class="nav-dropdown-panel glass liquid-glass-pillow">' +
          '<header class="nav-dropdown-head">' +
            '<h2>' + escapeHtml(title) + '</h2>' +
            '<p>' + escapeHtml(subtitle) + '</p>' +
          '</header>' +
          '<div class="nav-dropdown-scroll">' + bodyHtml + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderMobileBody(subtitle, bodyHtml) {
    return (
      '<div class="mobile-nav-body-inner">' +
        '<header class="mobile-nav-intro">' +
          '<p>' + escapeHtml(subtitle) + '</p>' +
        '</header>' +
        '<div class="mobile-nav-scroll">' + bodyHtml + '</div>' +
      '</div>'
    );
  }

  function setupMobileNav() {
    var navPanel = document.querySelector('.nav-panel');
    if (!navPanel || navPanel.dataset.mobileReady === '1') return;

    navPanel.querySelectorAll('.nav-panel-link[data-dropdown]').forEach(function (btn) {
      var id = btn.getAttribute('data-dropdown');
      var item = document.createElement('div');
      item.className = 'mobile-nav-item';
      item.setAttribute('data-mobile-nav', id);

      btn.classList.add('mobile-nav-trigger');
      btn.setAttribute('aria-expanded', 'false');
      btn.id = 'mobile-nav-trigger-' + id;

      if (!btn.querySelector('.mobile-nav-chevron')) {
        var chev = document.createElement('span');
        chev.className = 'mobile-nav-chevron';
        chev.setAttribute('aria-hidden', 'true');
        btn.appendChild(chev);
      }

      var body = document.createElement('div');
      body.className = 'mobile-nav-body';
      body.id = 'mobile-nav-body-' + id;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', btn.id);

      btn.parentNode.insertBefore(item, btn);
      item.appendChild(btn);
      item.appendChild(body);
    });

    navPanel.dataset.mobileReady = '1';
  }

  function buildMobileNavContent() {
    var sections = {
      products: { intro: intro('products'), body: buildProductsHtml() },
      research: { intro: intro('research'), body: buildResearchHtml() },
      tech: { intro: intro('tech'), body: buildTechHtml() }
    };

    Object.keys(sections).forEach(function (id) {
      var body = document.getElementById('mobile-nav-body-' + id);
      if (!body) return;
      body.innerHTML = renderMobileBody(sections[id].intro, sections[id].body);
    });
  }

  function positionDropdown(id) {
    var buttons = document.querySelectorAll('.header-nav-link[data-dropdown="' + id + '"]');
    var btn = buttons.length ? buttons[0] : null;
    var wrap = document.getElementById('dropdown-' + id);
    if (!btn || !wrap) return;

    var panelW = Math.min(440, window.innerWidth - 24);
    var rect = btn.getBoundingClientRect();
    var left = rect.left + rect.width / 2 - panelW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - panelW - 12));
    var top = rect.bottom + 10;

    wrap.style.top = Math.round(top) + 'px';
    wrap.style.left = Math.round(left) + 'px';
    wrap.style.width = panelW + 'px';

    if (window.HLS && window.HLS.refreshLiquidGlass) {
      window.HLS.refreshLiquidGlass();
    }
  }

  function buildDropdowns() {
    var root = document.getElementById('nav-dropdowns');
    if (!root) return;

    var productsHtml = buildProductsHtml();
    var researchHtml = buildResearchHtml();
    var techHtml = buildTechHtml();

    root.innerHTML =
      renderDropdown('products', label('products'), intro('products'), productsHtml) +
      renderDropdown('research', label('research'), intro('research'), researchHtml) +
      renderDropdown('tech', label('tech'), intro('tech'), techHtml);

    setupMobileNav();
    buildMobileNavContent();

    if (openId && !isMobile()) {
      var panel = document.getElementById('dropdown-' + openId);
      if (panel) {
        panel.hidden = false;
        positionDropdown(openId);
      }
    }
  }

  function collapseMobileAccordion() {
    mobileOpenId = null;
    document.querySelectorAll('.mobile-nav-item').forEach(function (item) {
      item.classList.remove('is-expanded');
      var btn = item.querySelector('.mobile-nav-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleMobileAccordion(id, btn) {
    if (mobileOpenId === id) {
      collapseMobileAccordion();
      return;
    }

    collapseMobileAccordion();
    var item = btn.closest('.mobile-nav-item');
    if (!item) return;

    item.classList.add('is-expanded');
    btn.setAttribute('aria-expanded', 'true');
    mobileOpenId = id;
  }

  function closeDropdowns() {
    openId = null;
    document.querySelectorAll('[data-dropdown-panel]').forEach(function (panel) {
      panel.hidden = true;
    });
    document.querySelectorAll('.header-nav-link[data-dropdown]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
    });
    document.body.classList.remove('nav-dropdown-open');
  }

  function openDropdown(id) {
    if (isMobile()) return;

    if (openId === id) {
      closeDropdowns();
      return;
    }
    closeDropdowns();
    collapseMobileAccordion();

    var panel = document.getElementById('dropdown-' + id);
    var btn = document.querySelector('.header-nav-link[data-dropdown="' + id + '"]');
    if (!panel || !btn) return;

    panel.hidden = false;
    positionDropdown(id);
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-open');
    openId = id;
    document.body.classList.add('nav-dropdown-open');
  }

  function initTriggers() {
    document.addEventListener('click', function (e) {
      var panelBtn = e.target.closest('.nav-panel-link[data-dropdown]');
      if (panelBtn && isMobile()) {
        e.preventDefault();
        toggleMobileAccordion(panelBtn.getAttribute('data-dropdown'), panelBtn);
        return;
      }

      var headerBtn = e.target.closest('.header-nav-link[data-dropdown]');
      if (headerBtn) {
        e.preventDefault();
        if (isMobile()) return;
        openDropdown(headerBtn.getAttribute('data-dropdown'));
        return;
      }

      if (openId && !e.target.closest('.nav-dropdown-panel') && !e.target.closest('.header-nav-link[data-dropdown]')) {
        closeDropdowns();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (openId) closeDropdowns();
      if (mobileOpenId) collapseMobileAccordion();
    });

    if (window.HLS && window.HLS.onResize) {
      window.HLS.onResize(function () {
        if (isMobile()) {
          closeDropdowns();
        } else {
          collapseMobileAccordion();
          if (openId) positionDropdown(openId);
        }
      });
    } else {
      window.addEventListener('resize', function () {
        if (isMobile()) {
          closeDropdowns();
        } else {
          collapseMobileAccordion();
          if (openId) positionDropdown(openId);
        }
      }, { passive: true });
    }

    var reposition = window.HLS && window.HLS.throttleRaf
      ? window.HLS.throttleRaf(function () {
        if (openId && !isMobile()) positionDropdown(openId);
      })
      : function () {
        if (openId && !isMobile()) positionDropdown(openId);
      };

    window.addEventListener('scroll', reposition, { passive: true });

    if (mobileMq.addEventListener) {
      mobileMq.addEventListener('change', function () {
        closeDropdowns();
        collapseMobileAccordion();
      });
    } else if (mobileMq.addListener) {
      mobileMq.addListener(function () {
        closeDropdowns();
        collapseMobileAccordion();
      });
    }
  }

  function applySettingsToDom() {
    var s = getSettings().promo;
    if (!s) return;

    document.querySelectorAll('[data-settings-href="promo.url"]').forEach(function (el) {
      if (s.url) el.href = s.url;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildDropdowns();
    applySettingsToDom();
    initTriggers();
  });

  window.addEventListener('hls:locale-change', function () {
    buildDropdowns();
    if (mobileOpenId) {
      var btn = document.getElementById('mobile-nav-trigger-' + mobileOpenId);
      if (btn) {
        btn.closest('.mobile-nav-item').classList.add('is-expanded');
        btn.setAttribute('aria-expanded', 'true');
      }
    }
  });

  window.HLS = window.HLS || {};
  window.HLS.closeNavDropdowns = closeDropdowns;
  window.HLS.closeMobileNavAccordion = collapseMobileAccordion;
  window.HLS.rebuildNavDropdowns = buildDropdowns;
})();
