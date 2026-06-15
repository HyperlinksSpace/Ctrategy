(function () {
  'use strict';

  var visible = !document.hidden;
  var heroVisible = true;
  var scrolling = false;
  var scrollEndTimer = 0;
  var qualityCache = null;
  var adaptive = { boost: 0, samples: [] };

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    qualityCache = null;
    window.dispatchEvent(new Event('hls:visibility'));
    if (visible) scheduleRaf();
  });

  function observeHero() {
    var hero = document.getElementById('hero');
    if (!hero || !('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entries) {
      heroVisible = entries.some(function (e) {
        return e.isIntersecting && e.intersectionRatio > 0.06;
      });
      window.dispatchEvent(new Event('hls:hero-visibility'));
    }, { threshold: [0, 0.06, 0.15, 0.35] }).observe(hero);
  }

  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    var sections = document.querySelectorAll('main .section');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.setAttribute('data-cv', entry.isIntersecting ? 'visible' : 'hidden');
      });
    }, { rootMargin: '120px 0px', threshold: 0 });

    sections.forEach(function (section) {
      section.setAttribute('data-cv', 'pending');
      observer.observe(section);
    });
  }

  function computeQuality() {
    var mobile = window.innerWidth < 768;
    var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var lowMem = navigator.deviceMemory && navigator.deviceMemory <= 4;
    var lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    var saveData = navigator.connection && navigator.connection.saveData;
    var slowNet = navigator.connection &&
      (navigator.connection.effectiveType === 'slow-2g' ||
        navigator.connection.effectiveType === '2g');
    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lite = mobile || lowMem || lowCpu || saveData || slowNet || reduced || adaptive.boost > 0;

    return {
      mobile: mobile,
      coarse: coarse,
      lite: lite,
      reduced: reduced,
      dpr: lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.25),
      orbSteps: lite ? 24 : 36,
      orbMaxPx: lite ? 480 : 720,
      orbBlobs: lite ? 3 : 4,
      orbFrameSkip: (lite ? 2 : 1) + adaptive.boost,
      bgFrameSkip: lite ? 3 : 2,
      fbmOctaves: lite ? 2 : 3,
      lightning: !lite && !reduced,
      bgWebgl: false,
      blurBars: false,,
      threeSphereSeg: lite ? 48 : 96,
      threeInnerSeg: lite ? 32 : 48,
      threeChainCount: lite ? 0 : (mobile ? 16 : 32),
      threeTubeSeg: lite ? 16 : 32,
      threeRingSeg: lite ? 12 : 24,
      threeBolts: lite || reduced ? 0 : (mobile ? 3 : 5),
      threeBottomChains: !lite && !mobile
    };
  }

  function getQuality() {
    if (!qualityCache) qualityCache = computeQuality();
    return qualityCache;
  }

  function invalidateQuality() {
    qualityCache = null;
    applyDocClasses();
    window.dispatchEvent(new Event('hls:quality-change'));
  }

  function applyDocClasses() {
    var q = getQuality();
    var root = document.documentElement;
    root.classList.toggle('hls-lite', q.lite);
    root.classList.toggle('hls-reduced', q.reduced);
    root.classList.toggle('hls-scrolling', scrolling);
    root.classList.toggle('hls-struggling', adaptive.boost > 0);
  }

  function shouldAnimateHero() {
    return visible && heroVisible && !scrolling;
  }

  function shouldAnimateBg() {
    return visible && heroVisible && !scrolling;
  }

  function reportFrameTime(ms) {
    adaptive.samples.push(ms);
    if (adaptive.samples.length < 40) return;

    var sum = 0;
    for (var i = 0; i < adaptive.samples.length; i++) sum += adaptive.samples[i];
    var avg = sum / adaptive.samples.length;
    adaptive.samples = [];

    if (avg > 14 && adaptive.boost < 2) {
      adaptive.boost += 1;
      invalidateQuality();
    } else if (avg < 8 && adaptive.boost > 0) {
      adaptive.boost -= 1;
      invalidateQuality();
    }
  }

  /* Shared RAF bus — one loop for all lightweight animators */
  var jobs = Object.create(null);
  var rafId = 0;

  function flush(now) {
    rafId = 0;
    if (!visible) return;

    var t0 = performance.now();
    var ids = Object.keys(jobs);
    for (var i = 0; i < ids.length; i++) {
      var job = jobs[ids[i]];
      if (job.when && !job.when()) continue;
      job.frame = (job.frame || 0) + 1;
      if (job.skip > 1 && job.frame % job.skip !== 0) continue;
      job.fn(now);
    }

    if (Object.keys(jobs).length) {
      reportFrameTime(performance.now() - t0);
      scheduleRaf();
    }
  }

  function scheduleRaf() {
    if (rafId || !visible || !Object.keys(jobs).length) return;
    rafId = requestAnimationFrame(flush);
  }

  function addJob(id, fn, opts) {
    opts = opts || {};
    jobs[id] = {
      fn: fn,
      when: opts.when,
      skip: opts.skip || 1,
      frame: 0
    };
    scheduleRaf();
  }

  function removeJob(id) {
    delete jobs[id];
    if (!Object.keys(jobs).length && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function throttleRaf(fn) {
    var scheduled = false;
    var lastArgs;
    return function () {
      lastArgs = arguments;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        fn.apply(null, lastArgs);
      });
    };
  }

  var scrollCbs = [];
  function onScroll(cb) {
    scrollCbs.push(cb);
  }

  function handleScroll() {
    if (!scrolling) {
      scrolling = true;
      applyDocClasses();
    }
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(function () {
      scrolling = false;
      applyDocClasses();
      window.dispatchEvent(new Event('hls:scroll-idle'));
      scheduleRaf();
    }, 140);

    for (var i = 0; i < scrollCbs.length; i++) scrollCbs[i]();
  }

  var resizeCbs = [];
  function onResize(cb) {
    resizeCbs.push(cb);
  }

  var debouncedResize = debounce(function () {
    qualityCache = null;
    applyDocClasses();
    for (var i = 0; i < resizeCbs.length; i++) resizeCbs[i]();
    window.dispatchEvent(new Event('hls:resize'));
  }, 120);

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', debouncedResize, { passive: true });

  if (navigator.connection && navigator.connection.addEventListener) {
    navigator.connection.addEventListener('change', invalidateQuality);
  }

  function boot() {
    observeHero();
    observeSections();
    applyDocClasses();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.HLS = window.HLS || {};
  window.HLS.getQuality = getQuality;
  window.HLS.invalidateQuality = invalidateQuality;
  window.HLS.shouldAnimateHero = shouldAnimateHero;
  window.HLS.shouldAnimateBg = shouldAnimateBg;
  window.HLS.reportFrameTime = reportFrameTime;
  window.HLS.onScroll = onScroll;
  window.HLS.onResize = onResize;
  window.HLS.debounce = debounce;
  window.HLS.throttleRaf = throttleRaf;
  window.HLS.raf = {
    add: addJob,
    remove: removeJob,
    kick: scheduleRaf
  };
})();
