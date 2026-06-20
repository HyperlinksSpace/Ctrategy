(function () {
  'use strict';

  var AI_BUILD = '20250619l';
  var loading = false;
  var loaded = false;
  var queue = [];

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function flushQueue() {
    while (queue.length) {
      var cb = queue.shift();
      try { cb(); } catch (e) { console.warn('[ai-loader]', e); }
    }
  }

  function loadAiStack() {
    if (loaded) return Promise.resolve();
    if (loading) {
      return new Promise(function (resolve) {
        queue.push(resolve);
      });
    }

    loading = true;
    window.HLS = window.HLS || {};
    window.HLS.aiLoading = true;

    return loadScript('js/ai-chat.js?v=' + AI_BUILD)
      .then(function () { return loadScript('js/ai-core.js?v=' + AI_BUILD); })
      .then(function () {
        loaded = true;
        loading = false;
        window.HLS.aiLoading = false;
        window.HLS.aiReady = true;
        window.dispatchEvent(new Event('hls:ai-ready'));
        flushQueue();
      })
      .catch(function (err) {
        loading = false;
        window.HLS.aiLoading = false;
        console.warn('[ai-loader]', err);
        throw err;
      });
  }

  function onIntent() {
    loadAiStack();
  }

  function bindTriggers() {
    var selectors = [
      '#ai-core-input',
      '#ai-core-mic',
      '#ai-core-voice',
      '#ai-core-form',
      '#ai-core-chips',
      '#ai-core-messages'
    ];
    var nodes = document.querySelectorAll(selectors.join(','));
    var i;
    for (i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener('pointerdown', onIntent, { once: true, passive: true });
      nodes[i].addEventListener('focusin', onIntent, { once: true, passive: true });
    }
  }

  function scheduleIdleLoad() {
    var run = function () { loadAiStack(); };
    if (window.requestIdleCallback) {
      requestIdleCallback(run, { timeout: 6000 });
    } else {
      setTimeout(run, 4000);
    }
  }

  function boot() {
    bindTriggers();
    scheduleIdleLoad();
  }

  window.HLS = window.HLS || {};
  window.HLS.loadAi = loadAiStack;
  window.HLS.whenAiReady = function (cb) {
    if (loaded) { cb(); return; }
    queue.push(cb);
    loadAiStack();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
