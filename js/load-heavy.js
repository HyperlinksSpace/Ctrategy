(function () {
  'use strict';

  var loaded = false;
  var loading = false;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error(src)); };
      document.head.appendChild(s);
    });
  }

  function shouldLoadVisuals() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return true;
  }

  function loadHeavy() {
    if (loaded || loading || !shouldLoadVisuals()) return;
    loading = true;
    loadScript('js/orb-fx.js')
      .then(function () { return loadScript('js/scene.js'); })
      .then(function () { return loadScript('js/liquid-glass.js'); })
      .then(function () {
        loaded = true;
        loading = false;
        window.dispatchEvent(new Event('hls:heavy-ready'));
      })
      .catch(function (err) {
        loading = false;
        console.warn('[load-heavy]', err);
      });
  }

  function schedule() {
    if (window.HLS && window.HLS.shouldAnimateHero && !window.HLS.shouldAnimateHero()) {
      window.addEventListener('hls:hero-visibility', function onVis() {
        if (window.HLS.shouldAnimateHero()) {
          window.removeEventListener('hls:hero-visibility', onVis);
          loadHeavy();
        }
      });
    }
    if (window.requestIdleCallback) {
      requestIdleCallback(loadHeavy, { timeout: 5000 });
    } else {
      setTimeout(loadHeavy, 2000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
