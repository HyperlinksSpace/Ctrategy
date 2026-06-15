(function () {
  'use strict';

  var hosts = [];
  var reducedMotion = false;
  var pointerBound = false;
  var pendingPointer = null;

  function getQuality() {
    return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { lite: true };
  }

  function ensureLayers(el) {
    if (el.querySelector('.liquid-glass-lens')) return;
    var isHeader = el.classList.contains('site-header');
    var chroma = null;
    var dispersion = null;

    if (isHeader) {
      chroma = document.createElement('div');
      chroma.className = 'liquid-glass-chroma';
      chroma.setAttribute('aria-hidden', 'true');
      var chromaCanvas = document.createElement('canvas');
      chromaCanvas.setAttribute('aria-hidden', 'true');
      chroma.appendChild(chromaCanvas);

      dispersion = document.createElement('div');
      dispersion.className = 'liquid-glass-dispersion';
      dispersion.setAttribute('aria-hidden', 'true');
    }

    var lens = document.createElement('div');
    lens.className = 'liquid-glass-lens';
    lens.setAttribute('aria-hidden', 'true');
    var sheen = document.createElement('div');
    sheen.className = 'liquid-glass-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    var rim = document.createElement('div');
    rim.className = 'liquid-glass-rim';
    rim.setAttribute('aria-hidden', 'true');
    el.classList.add('liquid-glass-host');

    if (chroma) el.insertBefore(chroma, el.firstChild);
    if (dispersion) el.insertBefore(dispersion, el.firstChild);
    el.insertBefore(rim, el.firstChild);
    el.insertBefore(sheen, el.firstChild);
    el.insertBefore(lens, el.firstChild);
  }

  function initHost(el) {
    if (!el || el.dataset.lgInit === '1') return;
    el.dataset.lgInit = '1';
    ensureLayers(el);
    if (hosts.indexOf(el) === -1) hosts.push(el);
  }

  function initAllHosts() {
    document.querySelectorAll('.site-header.glass-pillow, .nav-dropdown-panel.liquid-glass-pillow, .liquid-glass-pill').forEach(initHost);
    syncPointerBinding();
    syncHeaderChromaJob();
  }

  function headerOverHero() {
    var hero = document.getElementById('hero');
    if (!hero) return false;
    var rect = hero.getBoundingClientRect();
    return rect.top < 96 && rect.bottom > 48;
  }

  function syncHeaderChroma() {
    var header = document.querySelector('.site-header.liquid-glass-host');
    if (!header) return;
    header.classList.toggle('header-over-hero', headerOverHero());
  }

  function syncHeaderChromaJob() {
    if (!window.HLS || !window.HLS.raf) return;
    window.HLS.raf.remove('header-chroma');
    var header = document.querySelector('.site-header.glass-pillow');
    if (!header) return;
    window.HLS.raf.add('header-chroma', syncHeaderChroma, {
      when: function () {
        return window.HLS.shouldAnimateHero && window.HLS.shouldAnimateHero();
      },
      skip: getQuality().lite ? 4 : 2
    });
  }

  function applyPointer(clientX, clientY) {
    hosts.forEach(function (host) {
      if (!host.offsetParent && !host.classList.contains('is-open')) return;
      var rect = host.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        return;
      }
      var x = ((clientX - rect.left) / rect.width) * 100;
      var y = ((clientY - rect.top) / rect.height) * 100;
      host.style.setProperty('--lg-x', x.toFixed(1) + '%');
      host.style.setProperty('--lg-y', y.toFixed(1) + '%');
      host.style.setProperty('--lg-intensity', '1');
    });
  }

  function flushPointer() {
    if (!pendingPointer) return;
    applyPointer(pendingPointer.x, pendingPointer.y);
    pendingPointer = null;
  }

  function onPointerMove(e) {
    pendingPointer = { x: e.clientX, y: e.clientY };
    if (window.HLS && window.HLS.throttleRaf) {
      if (!onPointerMove._scheduled) {
        onPointerMove._scheduled = true;
        requestAnimationFrame(function () {
          onPointerMove._scheduled = false;
          flushPointer();
        });
      }
    } else {
      flushPointer();
    }
  }

  function onPointerLeave() {
    pendingPointer = null;
    hosts.forEach(function (host) {
      host.style.setProperty('--lg-intensity', '0.35');
      host.style.setProperty('--lg-x', '50%');
      host.style.setProperty('--lg-y', '28%');
    });
  }

  function syncPointerBinding() {
    var enable = hosts.length && !getQuality().lite && !reducedMotion;
    if (enable && !pointerBound) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      pointerBound = true;
    }
  }

  function initStripCenter() {
    var strip = document.querySelector('.section-strip');
    if (!strip) return;

    function sync() {
      if (strip.scrollWidth <= strip.clientWidth + 2) {
        strip.classList.add('is-centered');
      } else {
        strip.classList.remove('is-centered');
      }
    }

    sync();
    if (window.HLS && window.HLS.onResize) {
      window.HLS.onResize(sync);
    } else {
      window.addEventListener('resize', sync, { passive: true });
    }
    window.addEventListener('hls:locale-change', function () {
      setTimeout(sync, 80);
    });
  }

  function init() {
    reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initAllHosts();
    initStripCenter();

    var header = document.querySelector('.site-header.liquid-glass-host');
    if (header) header.classList.toggle('header-over-hero', headerOverHero());

    window.addEventListener('hls:theme-applied', initAllHosts);
    window.addEventListener('hls:hero-scene-ready', syncHeaderChromaJob);
    window.addEventListener('hls:quality-change', syncHeaderChromaJob);
    window.addEventListener('hls:locale-change', function () {
      setTimeout(initAllHosts, 50);
    });

    if (window.HLS && window.HLS.onScroll) {
      window.HLS.onScroll(function () {
        var header = document.querySelector('.site-header.liquid-glass-host');
        if (header) header.classList.toggle('header-over-hero', headerOverHero());
      });
    }

    window.HLS = window.HLS || {};
    window.HLS.refreshLiquidGlass = initAllHosts;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
