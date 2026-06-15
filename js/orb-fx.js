(function () {
  'use strict';

  var canvas = null;
  var ctx = null;
  var stars = [];
  var sparks = [];
  var w = 0;
  var h = 0;
  var dpr = 1;
  var running = false;
  var raf = 0;
  var start = performance.now();

  function shouldRun() {
    return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden;
  }

  function getQ() {
    return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { lite: false, dpr: 2 };
  }

  function buildStars(count) {
    stars = [];
    var i;
    for (i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        hue: 200 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resize() {
    if (!canvas) return;
    var cw = canvas.clientWidth;
    var ch = canvas.clientHeight;
    if (cw < 1 || ch < 1) return;
    dpr = Math.min(getQ().dpr || 1, window.devicePixelRatio || 1, 2);
    w = cw;
    h = ch;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars(getQ().lite ? 55 : 110);
  }

  function addSpark() {
    var cx = w * 0.5;
    var cy = h * 0.46;
    sparks.push({
      x: cx + (Math.random() - 0.5) * w * 0.35,
      y: cy + (Math.random() - 0.5) * h * 0.3,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      life: 1,
      hue: 180 + Math.random() * 100
    });
  }

  function getReactive() {
    return window.HLS && window.HLS.getOrbReactive ? window.HLS.getOrbReactive() : {
      intensity: 0.14, pulse: 0.32, speed: 1, hue: 220, mode: 'idle'
    };
  }

  function tick(now) {
    raf = 0;
    if (!running || !shouldRun()) return;
    var rx = getReactive();
    var energy = rx.intensity || 0.14;
    var speedMul = rx.speed || 1;
    var t = (now - start) * 0.001 * speedMul;
    var i;
    var s;
    var cx = w * 0.5;
    var cy = h * 0.46;

    ctx.clearRect(0, 0, w, h);

    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      var tw = 0.45 + 0.55 * Math.sin(t * (1.2 + s.z * 2) + s.phase);
      var sx = s.x * w + Math.sin(t * 0.15 + s.phase) * 4 * s.z;
      var sy = s.y * h + Math.cos(t * 0.12 + s.phase) * 3 * s.z;
      ctx.fillStyle = 'hsla(' + s.hue + ',85%,72%,' + (tw * 0.55 * s.z) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, (0.6 + s.z * 1.4) * tw, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < 0.08 + energy * 0.22) addSpark();
    if (rx.mode === 'listening' && Math.random() < 0.18) addSpark();
    if (rx.mode === 'speaking' && Math.random() < 0.14) addSpark();
    sparks = sparks.filter(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.028;
      if (p.life <= 0) return false;
      ctx.fillStyle = 'hsla(' + p.hue + ',100%,78%,' + (p.life * 0.7) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    var pulse = 0.5 + 0.5 * Math.sin(t * 0.9);
    var bloom = 0.14 + energy * 0.18;
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * (0.38 + energy * 0.08));
    grd.addColorStop(0, 'hsla(' + (rx.hue || 220) + ',72%,58%,' + (bloom * pulse) + ')');
    grd.addColorStop(0.35, 'hsla(' + ((rx.hue || 220) + 24) + ',68%,52%,' + (bloom * 0.55 * pulse) + ')');
    grd.addColorStop(0.7, 'hsla(132,70%,48%,' + (bloom * 0.28 * pulse) + ')');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    schedule();
  }

  function schedule() {
    if (!running || !shouldRun()) return;
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    resize();
    schedule();
  }

  function init() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    canvas = document.getElementById('orb-stars');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    running = true;
    resize();
    if (window.ResizeObserver) new ResizeObserver(wake).observe(canvas.parentElement || canvas);
    window.addEventListener('hls:visibility', wake);
    window.addEventListener('hls:hero-visibility', wake);
    window.addEventListener('hls:quality-change', wake);
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
