(function () {
  'use strict';

  var canvas = null;
  var ctx = null;
  var stars = [];
  var sparks = [];
  var satellites = [];
  var pings = [];
  var w = 0;
  var h = 0;
  var dpr = 1;
  var running = false;
  var raf = 0;
  var start = performance.now();

  function shouldRun() {
    return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden;
  }

  function isLightOrbViewport() {
    return window.HLS && window.HLS.isLightTheme && window.HLS.isLightTheme();
  }

  function getQ() {
    return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { lite: false, dpr: 2 };
  }

  function isStrip() {
    return h > 0 && (h < 150 || w / h > 2.1);
  }

  function buildStars(count) {
    stars = [];
    var i;
    for (i = 0; i < count; i++) {
      stars.push({
        x: 0.12 + Math.random() * 0.76,
        y: 0.1 + Math.random() * 0.72,
        z: 0.2 + Math.random() * 0.8,
        hue: 200 + Math.random() * 80,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function buildSatellites() {
    satellites = [
      { angle: 0.4, dist: 0.24, speed: 0.95, hue: 220, size: 2.2 },
      { angle: 2.35, dist: 0.31, speed: -0.72, hue: 278, size: 1.8 },
      { angle: 4.5, dist: 0.19, speed: 1.15, hue: 132, size: 2.4 }
    ];
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
    buildStars(getQ().lite ? (isStrip() ? 42 : 55) : (isStrip() ? 72 : 110));
    buildSatellites();
  }

  function addSpark() {
    var cx = w * 0.5;
    var cy = h * 0.46;
    var spreadX = isStrip() ? 0.22 : 0.35;
    var spreadY = isStrip() ? 0.18 : 0.3;
    sparks.push({
      x: cx + (Math.random() - 0.5) * w * spreadX,
      y: cy + (Math.random() - 0.5) * h * spreadY,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      life: 1,
      hue: 180 + Math.random() * 100
    });
  }

  function addPing(hue) {
    pings.push({ r: 4, life: 1, hue: hue || 220 });
  }

  function safeR(r) {
    return r > 0.05 ? r : 0.05;
  }

  function getReactive() {
    return window.HLS && window.HLS.getOrbReactive ? window.HLS.getOrbReactive() : {
      intensity: 0.14, pulse: 0.32, speed: 1, hue: 220, mode: 'idle'
    };
  }

  function drawSatellites(t, rx, cx, cy, orbitR) {
    var i;
    var sat;
    var energy = rx.intensity || 0.14;
    var speedMul = rx.speed || 1;
    var lightOrb = isLightOrbViewport();

    for (i = 0; i < satellites.length; i++) {
      sat = satellites[i];
      var ang = sat.angle + t * sat.speed * speedMul;
      var sx = cx + Math.cos(ang) * orbitR * sat.dist;
      var sy = cy + Math.sin(ang) * orbitR * sat.dist * (isStrip() ? 0.55 : 0.82);

      ctx.strokeStyle = 'hsla(' + sat.hue + ',88%,' + (lightOrb ? 58 : 68) + '%,' + (0.12 + energy * 0.18) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.fillStyle = 'hsla(' + sat.hue + ',92%,' + (lightOrb ? 62 : 74) + '%,' + (0.55 + energy * 0.35) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, safeR(sat.size * (0.85 + energy * 0.25)), 0, Math.PI * 2);
      ctx.fill();
    }
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
    var strip = isStrip();
    var orbitR = Math.min(w, h) * (strip ? 0.92 : 0.72);
    var lightOrb = isLightOrbViewport();

    ctx.clearRect(0, 0, w, h);

    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      var tw = Math.max(0.08, 0.45 + 0.55 * Math.sin(t * (1.2 + s.z * 2) + s.phase));
      var sx = s.x * w + Math.sin(t * 0.15 + s.phase) * 4 * s.z;
      var sy = s.y * h + Math.cos(t * 0.12 + s.phase) * 3 * s.z;
      var starLight = lightOrb ? 48 : 72;
      var starAlpha = lightOrb ? 0.82 : 0.55;
      ctx.fillStyle = 'hsla(' + s.hue + ',88%,' + starLight + '%,' + (tw * starAlpha * s.z) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, safeR((0.6 + s.z * 1.4) * tw), 0, Math.PI * 2);
      ctx.fill();
    }

    drawSatellites(t, rx, cx, cy, orbitR);

    if (Math.random() < 0.08 + energy * 0.22) addSpark();
    if (rx.mode === 'listening' && Math.random() < 0.18) addSpark();
    if (rx.mode === 'speaking' && Math.random() < 0.14) addSpark();
    if (rx.mode === 'thinking' && Math.random() < 0.06) addPing(rx.hue || 220);

    sparks = sparks.filter(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.028;
      if (p.life <= 0) return false;
      ctx.fillStyle = 'hsla(' + p.hue + ',100%,78%,' + (p.life * 0.7) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, safeR(2 * p.life), 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    pings = pings.filter(function (p) {
      p.r += 1.6 + energy * 1.2;
      p.life -= 0.022;
      if (p.life <= 0) return false;
      ctx.strokeStyle = 'hsla(' + p.hue + ',88%,68%,' + (p.life * 0.35) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, safeR(p.r), 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });

    var pulse = 0.5 + 0.5 * Math.sin(t * 0.9);
    var bloom = (lightOrb ? 0.28 : 0.18) + energy * 0.22;
    if (strip) bloom += 0.12;
    var bloomR = Math.min(w, h) * (strip ? 0.52 : (0.38 + energy * 0.08));
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
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
    window.addEventListener('hls:theme-applied', wake);
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
