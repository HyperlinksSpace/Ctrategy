(function () {
  'use strict';

  var VS = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FS = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D uSnap;',
    'uniform vec2 uSnapSize;',
    'uniform vec4 uPageRect;',
    'uniform vec2 uElSize;',
    'uniform float uTime;',
    'uniform float uCorner;',
    'uniform float uIsLight;',
    '',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    '',
    'float sdRoundBox(vec2 p, vec2 h, float r){',
    '  vec2 q = abs(p) - h + vec2(r);',
    '  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;',
    '}',
    '',
    '/* Hypercomplex-inspired domain warp: swirl + pulse zoom + wobble */',
    'vec2 hyperLensFn(vec2 uv, float t){',
    '  vec2 p = uv - 0.5;',
    '  float r = length(p) + 1e-5;',
    '  float a = atan(p.y, p.x);',
    '  float edge = smoothstep(0.52, 0.08, r);',
    '  a += sin(a * 5.0 + t * 1.65) * 0.22 * edge;',
    '  a += cos(r * 14.0 - t * 2.1) * 0.14 * edge;',
    '  float zoomPulse = 0.55 + 0.18 * sin(t * 0.55);',
    '  float magnify = 1.0 + (1.0 - smoothstep(0.0, 0.42, r)) * (zoomPulse + 0.4);',
    '  r = pow(r / magnify, 0.72);',
    '  a += r * 3.8 + sin(t * 0.45 + r * 11.0) * 0.35;',
    '  vec2 q = vec2(cos(a), sin(a)) * r;',
    '  q += vec2(sin(r * 24.0 + t * 3.0), cos(r * 20.0 - t * 2.4)) * 0.018 * edge;',
    '  return 0.5 + q;',
    '}',
    '',
    'vec2 pageUvFromLocal(vec2 localUv){',
    '  return uPageRect.xy + localUv * uPageRect.zw;',
    '}',
    '',
    'void main(){',
    '  vec2 p = vUv - 0.5;',
    '  vec2 halfSize = uElSize * 0.5;',
    '  float cr = min(uCorner, min(halfSize.x, halfSize.y));',
    '  float d = sdRoundBox(p * uElSize, halfSize, cr);',
    '  float mask = 1.0 - smoothstep(-1.0, 1.5, d);',
    '  if (mask < 0.01) discard;',
    '',
    '  vec2 warped = hyperLensFn(vUv, uTime);',
    '  vec2 base = pageUvFromLocal(vUv);',
    '  vec2 ref = pageUvFromLocal(warped);',
    '  vec2 mixUv = mix(base, ref, 0.9);',
    '',
    '  float lumC = dot(texture2D(uSnap, mixUv).rgb, vec3(0.299, 0.587, 0.114));',
    '  float aber = 0.003 + smoothstep(0.35, 1.0, lumC) * 0.012;',
    '',
    '  vec3 col;',
    '  col.r = texture2D(uSnap, mixUv + vec2(aber, 0.0)).r;',
    '  col.g = texture2D(uSnap, mixUv).g;',
    '  col.b = texture2D(uSnap, mixUv - vec2(aber, 0.0)).b;',
    '',
    '  float lum = dot(col, vec3(0.299, 0.587, 0.114));',
    '  float bright = smoothstep(0.28, 0.95, lum);',
    '  col *= 1.0 + bright * 0.72;',
    '  col = mix(col, col.bgr, bright * 0.16);',
    '  col = mix(col, vec3(col.g, col.b, col.r), bright * 0.08);',
    '',
    '  float fresnel = pow(1.0 - mask, 2.2);',
    '  vec3 tint = uIsLight > 0.5 ? vec3(0.95, 0.98, 1.0) : vec3(0.04, 0.12, 0.06);',
    '  col = mix(col, col * 0.75 + tint * 0.25, fresnel * 0.35);',
    '  col += vec3(0.10, 0.67, 0.07) * fresnel * 0.22;',
    '  col += vec3(0.45, 0.18, 1.0) * fresnel * 0.09 * sin(uTime + vUv.x * 8.0);',
    '',
    '  float rim = smoothstep(0.0, -2.0, d);',
    '  col += vec3(1.0) * rim * 0.12;',
    '',
    '  gl_FragColor = vec4(col, mask * 0.97);',
    '}'
  ].join('\n');

  function createShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[liquid-glass]', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl) {
    var vs = createShader(gl, gl.VERTEX_SHADER, VS);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn('[liquid-glass]', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  function isLightTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function LiquidLens(el) {
    this.el = el;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'liquid-glass-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.uniforms = {};
    this.active = true;
    this.corner = parseFloat(el.getAttribute('data-lg-radius')) || 12;

    el.classList.add('liquid-glass-host');
    el.insertBefore(this.canvas, el.firstChild);
    this.initGl();
  }

  LiquidLens.prototype.initGl = function () {
    var gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) {
      this.active = false;
      return;
    }
    this.gl = gl;
    this.program = createProgram(gl);
    if (!this.program) {
      this.active = false;
      return;
    }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.uniforms = {
      uSnap: gl.getUniformLocation(this.program, 'uSnap'),
      uSnapSize: gl.getUniformLocation(this.program, 'uSnapSize'),
      uPageRect: gl.getUniformLocation(this.program, 'uPageRect'),
      uElSize: gl.getUniformLocation(this.program, 'uElSize'),
      uTime: gl.getUniformLocation(this.program, 'uTime'),
      uCorner: gl.getUniformLocation(this.program, 'uCorner'),
      uIsLight: gl.getUniformLocation(this.program, 'uIsLight')
    };
  };

  LiquidLens.prototype.isVisible = function () {
    if (!this.el.offsetParent && !this.el.classList.contains('site-header')) return false;
    if (this.el.id === 'header-panel' && !this.el.classList.contains('open')) return false;
    var r = this.el.getBoundingClientRect();
    return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < window.innerHeight;
  };

  LiquidLens.prototype.uploadSnapshot = function (snapCanvas, snapW, snapH) {
    if (!this.active || !this.gl) return;
    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapCanvas);
    this.snapW = snapW;
    this.snapH = snapH;
  };

  LiquidLens.prototype.draw = function (time) {
    if (!this.active || !this.gl || !this.snapW) return;
    if (!this.isVisible()) return;

    var rect = this.el.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.floor(rect.width * dpr));
    var h = Math.max(1, Math.floor(rect.height * dpr));

    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }

    var gl = this.gl;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uniforms.uSnap, 0);
    gl.uniform2f(this.uniforms.uSnapSize, this.snapW, this.snapH);

    var metrics = getDocMetrics();
    var docW = metrics.docW;
    var docH = metrics.docH;
    gl.uniform4f(
      this.uniforms.uPageRect,
      (window.scrollX + rect.left) / docW,
      (window.scrollY + rect.top) / docH,
      rect.width / docW,
      rect.height / docH
    );
    gl.uniform2f(this.uniforms.uElSize, rect.width, rect.height);
    gl.uniform1f(this.uniforms.uTime, time * 0.001);
    gl.uniform1f(this.uniforms.uCorner, this.corner);
    gl.uniform1f(this.uniforms.uIsLight, isLightTheme() ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  var engine = {
    lenses: [],
    raf: 0,
    start: 0,
    snapCanvas: null,
    snapW: 0,
    snapH: 0,
    capturing: false,
    dirty: true,
    captureTimer: null,
    enabled: true
  };

  function getDocMetrics() {
    var docW = Math.max(document.documentElement.clientWidth, window.innerWidth || 1);
    var rawH = Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement.scrollHeight
    );
    var docH = Math.min(Math.max(rawH, window.innerHeight || 1), 16000);
    return { docW: docW, docH: docH };
  }

  function buildCompositeSnapshot() {
    var metrics = getDocMetrics();
    var docW = metrics.docW;
    var docH = metrics.docH;
    var scale = Math.min(0.5, 1 / (window.devicePixelRatio || 1));
    var w = Math.max(1, Math.floor(docW * scale));
    var h = Math.max(1, Math.floor(docH * scale));

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#000';
    ctx.fillRect(0, 0, w, h);

    var sceneBg = document.getElementById('scene-bg');
    if (sceneBg) {
      try {
        ctx.drawImage(sceneBg, 0, 0, w, h);
      } catch (e) { /* ignore */ }
    }

    return canvas;
  }

  function captureSnapshot() {
    if (!engine.enabled || engine.capturing) return Promise.resolve();
    engine.capturing = true;

    var composite = buildCompositeSnapshot();

    function finish(canvas, w, h) {
      engine.snapCanvas = canvas;
      engine.snapW = w;
      engine.snapH = h;
      engine.dirty = false;
      engine.lenses.forEach(function (l) { l.uploadSnapshot(canvas, w, h); });
      engine.capturing = false;
    }

    if (typeof html2canvas === 'undefined') {
      if (composite) finish(composite, composite.width, composite.height);
      else engine.capturing = false;
      return Promise.resolve();
    }

    var scale = Math.min(0.42, 1 / (window.devicePixelRatio || 1));

    var metrics = getDocMetrics();

    return html2canvas(document.documentElement, {
      scale: scale,
      backgroundColor: null,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: metrics.docW,
      height: metrics.docH,
      windowWidth: metrics.docW,
      windowHeight: metrics.docH,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      ignoreElements: function (node) {
        if (!node.classList) return false;
        return node.classList.contains('liquid-glass-canvas');
      }
    }).then(function (domSnap) {
      if (composite && domSnap) {
        var ctx = composite.getContext('2d');
        ctx.globalAlpha = 1;
        ctx.drawImage(domSnap, 0, 0, composite.width, composite.height);
        finish(composite, composite.width, composite.height);
      } else if (domSnap) {
        finish(domSnap, domSnap.width, domSnap.height);
      } else if (composite) {
        finish(composite, composite.width, composite.height);
      } else {
        engine.capturing = false;
      }
    }).catch(function () {
      if (composite) finish(composite, composite.width, composite.height);
      else engine.capturing = false;
    });
  }

  function scheduleCapture() {
    engine.dirty = true;
    clearTimeout(engine.captureTimer);
    engine.captureTimer = setTimeout(function () {
      captureSnapshot();
    }, 180);
  }

  function tick(now) {
    if (!engine.start) engine.start = now;
    engine.lenses.forEach(function (l) { l.draw(now); });
    engine.raf = requestAnimationFrame(tick);
  }

  function init() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      engine.enabled = false;
      return;
    }

    var selectors = [
      '.glass',
      '.glass-bar',
      '.card',
      '#header-panel',
      '.section-strip',
      '.section-rail',
      '.btn-primary',
      '.jump-tile',
      '.milestone',
      '.product-card',
      '.moat-card',
      '.promo-block'
    ];

    var seen = new Set();
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.classList.contains('glass-bar') || el.classList.contains('section-strip')) {
          el.setAttribute('data-lg-radius', '0');
        } else if (el.id === 'header-panel') {
          el.setAttribute('data-lg-radius', '14');
        } else if (el.classList.contains('btn-primary')) {
          el.setAttribute('data-lg-radius', '12');
        } else if (el.classList.contains('jump-tile')) {
          el.setAttribute('data-lg-radius', '10');
        } else if (el.classList.contains('promo-block')) {
          el.setAttribute('data-lg-radius', '16');
        }
        engine.lenses.push(new LiquidLens(el));
      });
    });

    var panel = document.getElementById('header-panel');
    if (panel) {
      var obs = new MutationObserver(scheduleCapture);
      obs.observe(panel, { attributes: true, attributeFilter: ['class'] });
    }

    captureSnapshot().then(function () {
      engine.raf = requestAnimationFrame(tick);
    });

    window.addEventListener('scroll', scheduleCapture, { passive: true });
    window.addEventListener('resize', scheduleCapture);
    window.addEventListener('hls:locale-change', scheduleCapture);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) scheduleCapture();
    });

    setInterval(scheduleCapture, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
