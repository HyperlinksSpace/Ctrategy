(function () {
  'use strict';

  var canvas;
  var ctx;
  var w = 0;
  var h = 0;
  var raf = 0;
  var running = false;
  var start = 0;
  var dpr = 1;

  var ripples = [];
  var sparks = [];
  var arcs = [];
  var packets = [];
  var flowParticles = [];
  var sonarRings = [];
  var shockwaves = [];
  var cursorTrail = [];
  var glyphs = [];
  var voronoiSeeds = [];
  var neuralNodes = [];
  var lastRipple = 0;
  var lastTrail = 0;
  var cursor = { x: 0.5, y: 0.44, px: 0, py: 0, active: false, vx: 0, vy: 0 };

  function getReactive() {
    return window.HLS && window.HLS.getOrbReactive ? window.HLS.getOrbReactive() : {
      mode: 'idle', intensity: 0.14, hue: 248, pulse: 0.32, speed: 1,
      speakingPhase: 0, cursorX: 0, cursorY: 0, cursorActive: 0
    };
  }

  function getQuality() {
    return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { lite: false, dpr: 1 };
  }

  function shouldRun() {
    return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden;
  }

  function isLight() {
    return window.HLS && window.HLS.isLightTheme ? window.HLS.isLightTheme() : false;
  }

  function safeR(r) {
    return r > 0.05 ? r : 0.05;
  }

  function hsla(h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }

  function resize() {
    if (!canvas) return;
    var cw = canvas.clientWidth;
    var ch = canvas.clientHeight;
    if (cw < 1 || ch < 1) return;
    var q = window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { dpr: 1 };
    dpr = Math.min(q.dpr || 1, window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = cw;
    h = ch;
    initVoronoi();
    initNeural();
  }

  function initFlow() {
    flowParticles = [];
    var q = getQuality();
    var count = q.lite ? (w < 400 ? 28 : 48) : (w < 400 ? 56 : (w < 700 ? 110 : 180));
    var i;
    for (i = 0; i < count; i++) {
      flowParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        life: 0.4 + Math.random() * 0.6,
        speed: 0.4 + Math.random() * 1.2,
        hueOff: (Math.random() - 0.5) * 40,
        size: 0.6 + Math.random() * 1.4
      });
    }
  }

  function initVoronoi() {
    voronoiSeeds = [];
    var i;
    var q = getQuality();
    var n = q.lite ? (w < 400 ? 6 : 8) : (w < 400 ? 10 : 16);
    for (i = 0; i < n; i++) {
      voronoiSeeds.push({
        x: 0.12 + Math.random() * 0.76,
        y: 0.18 + Math.random() * 0.58,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function initNeural() {
    neuralNodes = [];
    var i;
    for (i = 0; i < 14; i++) {
      neuralNodes.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.2 + Math.random() * 0.5,
        r: 2 + Math.random() * 3
      });
    }
  }

  function noise2(x, y, t) {
    return Math.sin(x * 0.012 + t * 0.7) * Math.cos(y * 0.009 - t * 0.5) +
      Math.sin((x + y) * 0.006 + t * 0.35) * 0.6;
  }

  function addRipple(x, y, strength, hue) {
    ripples.push({ x: x, y: y, r: 6, life: 1, strength: strength == null ? 0.6 : strength, hue: hue });
  }

  function addShockwave(x, y, hue, power) {
    shockwaves.push({ x: x, y: y, r: 8, life: 1, hue: hue, power: power || 1 });
  }

  function addSonar(x, y, hue) {
    sonarRings.push({ x: x, y: y, r: 10, life: 1, hue: hue });
  }

  function addSpark(x, y, hue, power) {
    var i;
    var n = 6 + Math.floor(Math.random() * 8);
    for (i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = (2 + Math.random() * 5) * (power || 1);
      sparks.push({
        x: x, y: y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 0.65 + Math.random() * 0.45,
        hue: hue + (Math.random() - 0.5) * 30,
        size: 1 + Math.random() * 2.2
      });
    }
  }

  function addArc(hue, intensity) {
    var cx = w * 0.5;
    var cy = h * 0.44;
    var sx = cx + (Math.random() - 0.5) * w * 0.5;
    var sy = cy + (Math.random() - 0.5) * h * 0.25;
    arcs.push({
      x1: sx, y1: sy,
      cx: cx + (Math.random() - 0.5) * 80,
      cy: cy + (Math.random() - 0.5) * 40,
      x2: cx, y2: cy,
      life: 1,
      hue: hue,
      width: 1 + (intensity || 0.5) * 2
    });
  }

  function addPacket(hue, fromEdge) {
    var cx = w * 0.5;
    var cy = h * 0.44;
    var x = fromEdge ? (Math.random() < 0.5 ? -8 : w + 8) : cx + (Math.random() - 0.5) * w * 0.4;
    var y = fromEdge ? Math.random() * h : cy + (Math.random() - 0.5) * h * 0.3;
    packets.push({
      x: x, y: y,
      tx: cx + (Math.random() - 0.5) * 40,
      ty: cy + (Math.random() - 0.5) * 30,
      life: 1,
      hue: hue,
      size: 2 + Math.random() * 2
    });
  }

  function spawnGlyph(hue) {
    var chars = '01$%TR∞∆Σ';
    glyphs.push({
      x: w * 0.5 + (Math.random() - 0.5) * w * 0.35,
      y: h * 0.44 + (Math.random() - 0.5) * h * 0.2,
      vy: -0.4 - Math.random() * 0.8,
      life: 1,
      char: chars.charAt(Math.floor(Math.random() * chars.length)),
      hue: hue + (Math.random() - 0.5) * 20
    });
  }

  function drawIsoGrid(t, rx, light) {
    var hue = rx.hue || 248;
    var energy = rx.intensity || 0.14;
    var cx = w * 0.5;
    var baseY = h * 0.72;
    var step = 28;
    var row;
    var col;
    ctx.lineWidth = 0.6;
    for (row = -4; row <= 4; row++) {
      for (col = -6; col <= 6; col++) {
        var ix = cx + (col - row) * step * 0.5;
        var iy = baseY + (col + row) * step * 0.22;
        iy += Math.sin(t * 0.4 + col * 0.3 + row * 0.2) * 2 * energy;
        if (cursor.active) {
          var dx = cursor.px - ix;
          var dy = cursor.py - iy;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          iy -= Math.max(0, 1 - dist / 120) * 12;
        }
        ctx.strokeStyle = hsla(hue + row * 2, light ? 22 : 38, light ? 48 : 38,
          0.04 + energy * 0.08);
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix + step * 0.5, iy + step * 0.22);
        ctx.lineTo(ix, iy + step * 0.44);
        ctx.lineTo(ix - step * 0.5, iy + step * 0.22);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  function drawVoronoi(t, rx, light) {
    if (w < 280) return;
    var hue = rx.hue || 248;
    var energy = rx.intensity || 0.14;
    var gx = 14;
    var gy = 14;
    var cellW = w / gx;
    var cellH = h / gy;
    var x;
    var y;
    for (y = 0; y < gy; y++) {
      for (x = 0; x < gx; x++) {
        var px = (x + 0.5) * cellW;
        var py = (y + 0.5) * cellH;
        var best = 999;
        var second = 999;
        var si;
        for (si = 0; si < voronoiSeeds.length; si++) {
          var seed = voronoiSeeds[si];
          var sx = seed.x * w + Math.sin(t * 0.3 + seed.phase) * 8 * energy;
          var sy = seed.y * h + Math.cos(t * 0.25 + seed.phase) * 6 * energy;
          if (cursor.active) {
            sx += (cursor.px - sx) * 0.02 * (1 - Math.min(1, Math.hypot(px - cursor.px, py - cursor.py) / 200));
          }
          var d = Math.hypot(px - sx, py - sy);
          if (d < best) { second = best; best = d; }
          else if (d < second) second = d;
        }
        var edge = second - best;
        if (edge < 3.5) {
          ctx.fillStyle = hsla(hue + x * 2, 55, light ? 50 : 42, 0.06 + energy * 0.12);
          ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
        }
      }
    }
  }

  function drawContours(t, rx, light) {
    var q = getQuality();
    if (q.lite && (rx.mode === 'idle' || document.documentElement.classList.contains('hls-scrolling'))) {
      return;
    }
    var hue = rx.hue || 248;
    var energy = rx.intensity || 0.14;
    var rowStep = q.lite ? 20 : 12;
    var xStep = q.lite ? 10 : 5;
    var rows = Math.floor(h / rowStep);
    var row;
    var x;
    ctx.lineWidth = 0.85;
    for (row = 0; row < rows; row++) {
      var baseY = row * rowStep;
      var alpha = (light ? 0.05 : 0.08) + energy * 0.08;
      ctx.strokeStyle = hsla(hue + row * 0.5, light ? 32 : 48, light ? 50 : 44, alpha);
      ctx.beginPath();
      for (x = 0; x <= w; x += xStep) {
        var wave = Math.sin(x * 0.016 + t * 0.55 + row * 0.4) * (10 + energy * 18);
        wave += noise2(x, baseY, t) * 8 * energy;
        if (cursor.active) {
          var dx = cursor.px - x;
          var dy = cursor.py - baseY;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          wave += Math.max(0, 1 - dist / 130) * 22;
          wave += (cursor.vx + cursor.vy) * 0.015 * Math.max(0, 1 - dist / 100);
        }
        var y = baseY + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function drawNeuralWeb(t, rx, light) {
    if (rx.mode !== 'thinking' && rx.mode !== 'typing') return;
    var hue = rx.hue || 278;
    var energy = rx.intensity || 0.14;
    var i;
    var j;
    ctx.lineWidth = 0.8;
    for (i = 0; i < neuralNodes.length; i++) {
      for (j = i + 1; j < neuralNodes.length; j++) {
        if (Math.random() > 0.12 + energy * 0.15) continue;
        var a = neuralNodes[i];
        var b = neuralNodes[j];
        var ax = a.x * w + Math.sin(t + i) * 4;
        var ay = a.y * h + Math.cos(t + j) * 3;
        var bx = b.x * w + Math.sin(t + j) * 4;
        var by = b.y * h + Math.cos(t + i) * 3;
        ctx.strokeStyle = hsla(hue + i * 3, 70, light ? 46 : 56, 0.08 + energy * 0.2);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      var n = neuralNodes[i];
      var nx = n.x * w + Math.sin(t * 1.2 + i) * 5;
      var ny = n.y * h + Math.cos(t * 0.9 + i) * 4;
      ctx.fillStyle = hsla(hue + 40, 82, 62, 0.25 + energy * 0.45);
      ctx.beginPath();
      ctx.arc(nx, ny, safeR(n.r * (0.8 + energy * 0.4)), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSpeakingWave(t, rx, light) {
    if (rx.mode !== 'speaking') return;
    var hue = rx.hue || 318;
    var cx = w * 0.5;
    var cy = h * 0.44;
    var phase = rx.speakingPhase || t * 3;
    var bars = 24;
    var i;
    for (i = 0; i < bars; i++) {
      var ang = (i / bars) * Math.PI * 2;
      var amp = 8 + Math.abs(Math.sin(phase * 2 + i * 0.7)) * 28 * (rx.pulse || 0.5);
      var x1 = cx + Math.cos(ang) * 42;
      var y1 = cy + Math.sin(ang) * 42;
      var x2 = cx + Math.cos(ang) * (42 + amp);
      var y2 = cy + Math.sin(ang) * (42 + amp);
      ctx.strokeStyle = hsla(hue + i * 2, 78, light ? 48 : 58, 0.35 + (rx.intensity || 0.2) * 0.4);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function drawCursorBeam(rx, light) {
    if (!cursor.active) return;
    var cx = w * 0.5;
    var cy = h * 0.44;
    var hue = rx.hue || 248;
    ctx.strokeStyle = hsla(hue, 80, 62, 0.12 + (rx.intensity || 0.14) * 0.2);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(cursor.px, cursor.py);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function tickFlow(t, rx) {
    var hue = rx.hue || 248;
    var energy = rx.intensity || 0.14;
    var mode = rx.mode || 'idle';
    var light = isLight();
    var i;

    for (i = 0; i < flowParticles.length; i++) {
      var p = flowParticles[i];
      var angle = noise2(p.x, p.y, t) * Math.PI * 2;
      var spd = p.speed * (0.35 + energy * 0.65) * (mode === 'thinking' ? 1.5 : 1);
      p.x += Math.cos(angle) * spd;
      p.y += Math.sin(angle) * spd * 0.85;

      if (cursor.active) {
        var dx = cursor.px - p.x;
        var dy = cursor.py - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 170) {
          var pull = (1 - dist / 170) * 0.42;
          p.x += dx * pull * 0.06;
          p.y += dy * pull * 0.06;
        }
      }

      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      if (p.y < -4) p.y = h + 4;
      if (p.y > h + 4) p.y = -4;

      ctx.fillStyle = hsla(hue + p.hueOff, 72, light ? 46 : 58, 0.12 + energy * p.life * 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, safeR(p.size * p.life), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function tick(now) {
    raf = 0;
    if (!running || !shouldRun()) return;
    var t = (now - start) * 0.001;
    var rx = getReactive();
    var light = isLight();
    var cx = w * 0.5;
    var cy = h * 0.44;
    var energy = rx.intensity || 0.14;
    var hue = rx.hue || 248;
    var mode = rx.mode || 'idle';

    if (rx.cursorActive) {
      cursor.active = true;
    } else {
      cursor.active = false;
      cursor.px += (cx - cursor.px) * 0.035;
      cursor.py += (cy - cursor.py) * 0.035;
    }

    ctx.clearRect(0, 0, w, h);
    var q = getQuality();
    if (!q.lite || rx.mode !== 'idle') drawVoronoi(t, rx, light);
    drawIsoGrid(t, rx, light);
    drawContours(t, rx, light);
    if (!q.lite || rx.mode === 'thinking' || rx.mode === 'typing') drawNeuralWeb(t, rx, light);
    tickFlow(t, rx);

    if (mode === 'listening' && Math.random() < 0.1) addSonar(cx, cy, hue + 95);
    if (mode === 'thinking' && Math.random() < 0.06) {
      addArc(hue + 120, energy);
      addPacket(hue + 80, true);
    }
    if (mode === 'speaking' && Math.random() < 0.16) {
      addRipple(cx, cy, 0.15 + Math.sin(t * 5) * 0.08, hue + 60);
    }
    if (mode === 'typing' && Math.random() < 0.14) {
      addPacket(hue + 20, false);
      spawnGlyph(hue);
    }

    shockwaves = shockwaves.filter(function (sw) {
      sw.r += 3.5 + sw.power * 3 + energy * 2;
      sw.life -= 0.014;
      if (sw.life <= 0) return false;
      ctx.strokeStyle = hsla(sw.hue, 75, light ? 50 : 58, sw.life * sw.power * 0.45);
      ctx.lineWidth = 2 * sw.life;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, safeR(sw.r), 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });

    sonarRings = sonarRings.filter(function (s) {
      s.r += 2.8 + energy * 2;
      s.life -= 0.016;
      if (s.life <= 0) return false;
      ctx.strokeStyle = hsla(s.hue, 70, light ? 48 : 55, s.life * 0.5);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, safeR(s.r), 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });

    ripples = ripples.filter(function (r) {
      r.r += 2.4 + energy * 2.8;
      r.life -= 0.017;
      if (r.life <= 0) return false;
      ctx.strokeStyle = hsla(r.hue != null ? r.hue : hue, 68, light ? 50 : 56, r.life * r.strength * 0.42);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(r.x, r.y, safeR(r.r), 0, Math.PI * 2);
      ctx.stroke();
      return true;
    });

    sparks = sparks.filter(function (s) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.95;
      s.vy *= 0.95;
      s.life -= 0.026;
      if (s.life <= 0) return false;
      ctx.fillStyle = hsla(s.hue, 88, 68, s.life * 0.8);
      ctx.beginPath();
      ctx.arc(s.x, s.y, safeR(s.size * s.life), 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    arcs = arcs.filter(function (a) {
      a.life -= 0.028;
      if (a.life <= 0) return false;
      ctx.strokeStyle = hsla(a.hue, 75, light ? 44 : 56, a.life * 0.55);
      ctx.lineWidth = a.width * a.life;
      ctx.beginPath();
      ctx.moveTo(a.x1, a.y1);
      ctx.quadraticCurveTo(a.cx, a.cy, a.x2, a.y2);
      ctx.stroke();
      return true;
    });

    packets = packets.filter(function (p) {
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      p.life -= 0.012;
      if (p.life <= 0) return false;
      ctx.fillStyle = hsla(p.hue, 80, 62, p.life * 0.7);
      ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      return true;
    });

    glyphs = glyphs.filter(function (g) {
      g.y += g.vy;
      g.life -= 0.012;
      if (g.life <= 0) return false;
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.fillStyle = hsla(g.hue, 82, 62, g.life * 0.75);
      ctx.fillText(g.char, g.x, g.y);
      return true;
    });

    drawSpeakingWave(t, rx, light);
    if (!getQuality().lite) drawCursorBeam(rx, light);

    if (cursor.active) {
      if (now - lastRipple > 120) {
        addRipple(cursor.px, cursor.py, 0.28, hue);
        lastRipple = now;
      }
      var grd = ctx.createRadialGradient(cursor.px, cursor.py, 0, cursor.px, cursor.py, 48 + energy * 28);
      grd.addColorStop(0, hsla(hue, 88, 72, 0.14));
      grd.addColorStop(0.5, hsla(hue + 50, 72, 55, 0.05));
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cursor.px, cursor.py, 48 + energy * 28, 0, Math.PI * 2);
      ctx.fill();
    }

    var bloomR = Math.min(w, h) * (0.34 + energy * 0.12);
    var bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
    bloom.addColorStop(0, hsla(hue, 68, light ? 70 : 56, (light ? 0.04 : 0.08) + energy * 0.14));
    bloom.addColorStop(0.55, hsla(hue + 55, 62, 48, 0.04 + energy * 0.06));
    bloom.addColorStop(1, 'transparent');
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    schedule();
  }

  function schedule() {
    if (!running || !shouldRun()) return;
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    resize();
    if (flowParticles.length === 0) initFlow();
    schedule();
  }

  function onOrbEvent(e) {
    var d = e.detail || {};
    var rx = getReactive();
    var hue = d.hue || rx.hue || 248;
    var cx = w * 0.5;
    var cy = h * 0.44;
    if (d.mode === 'user') {
      addSpark(cx, cy, hue, 2);
      addRipple(cx, cy, 1, hue);
      addShockwave(cx, cy, hue, 1.2);
      addArc(hue, 1);
      addArc(hue + 40, 0.8);
      if (window.HLS && window.HLS.orbImpulse) window.HLS.orbImpulse(0.55);
    } else if (d.mode === 'navigate') {
      addArc(hue + 30, 1);
      addArc(hue + 70, 0.9);
      addRipple(cx, cy, 0.85, hue + 40);
      addShockwave(cx, cy, hue + 50, 0.9);
      addSonar(cx, cy, hue + 50);
    } else if (d.mode === 'speaking') {
      addRipple(cx, cy, 0.65, hue + 55);
      addShockwave(cx, cy, hue + 40, 0.5);
    } else if (d.mode === 'thinking') {
      addPacket(hue + 100, true);
      addPacket(hue + 120, true);
      addArc(hue + 90, 0.9);
    } else if (d.mode === 'typing') {
      var gi;
      for (gi = 0; gi < 4; gi++) spawnGlyph(hue);
    } else if (d.mode === 'listening') {
      addSonar(cx, cy, hue + 90);
      addShockwave(cx, cy, hue + 80, 0.45);
    } else if (d.impulse) {
      addSpark(cx, cy, hue, d.impulse * 2.5);
    }
  }

  function bindCursor(zone) {
    var syncCursor = window.HLS && window.HLS.throttleRaf
      ? window.HLS.throttleRaf(function (nx, ny) {
          if (window.HLS.setStratvizCursor) {
            window.HLS.setStratvizCursor(nx, ny, true);
          }
        })
      : function (nx, ny) {
          if (window.HLS && window.HLS.setStratvizCursor) {
            window.HLS.setStratvizCursor(nx, ny, true);
          }
        };

    zone.addEventListener('pointermove', function (e) {
      var rect = zone.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      var ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      syncCursor(nx, ny);
      cursor.px = e.clientX - rect.left;
      cursor.py = e.clientY - rect.top;
      cursor.vx = e.movementX || 0;
      cursor.vy = e.movementY || 0;
      cursor.active = true;
    }, { passive: true });

    zone.addEventListener('pointerleave', function () {
      cursor.active = false;
      if (window.HLS && window.HLS.setStratvizCursor) {
        window.HLS.setStratvizCursor(0, 0, false);
      }
    });

    zone.addEventListener('pointerdown', function (e) {
      var rx = getReactive();
      addRipple(e.offsetX, e.offsetY, 1, rx.hue || 248);
      addSpark(e.offsetX, e.offsetY, rx.hue || 248, 1.8);
      addShockwave(e.offsetX, e.offsetY, (rx.hue || 248) + 30, 0.85);
      addSonar(e.offsetX, e.offsetY, (rx.hue || 248) + 30);
    });
  }

  function init() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    canvas = document.getElementById('stratviz-fx');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ctx = canvas.getContext('2d');
    if (!ctx) return;

    running = true;
    start = performance.now();
    var zone = canvas.closest('.stratviz-stage') || canvas.closest('.ai-orb-zone');
    if (zone) bindCursor(zone);

    document.addEventListener('ai-core:orb', onOrbEvent);

    resize();
    initFlow();
    wake();

    if (window.ResizeObserver) {
      new ResizeObserver(wake).observe(canvas.parentElement || canvas);
    }
    window.addEventListener('hls:hero-visibility', wake);
    window.addEventListener('hls:quality-change', wake);
  }

  function scheduleInit() {
    var run = function () { init(); };
    if (window.requestIdleCallback) {
      requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(run, 16);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleInit);
  else scheduleInit();
  window.addEventListener('hls:theme-applied', init);
})();
