(function () {
  'use strict';

  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    var vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  var BG_VS = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var BG_FS = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform float uTime;',
    'uniform vec2 uResolution;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;',
    '}',
    'float fbm(vec2 p){',
    '  float v = 0.0; float a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }',
    '  return v;',
    '}',
    'void main(){',
    '  vec2 uv = vUv;',
    '  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);',
    '  float t = uTime * 0.08;',
    '  float n = fbm(p * 2.5 + vec2(t, -t * 0.7));',
    '  float orb = length(p - vec2(0.28, -0.05));',
    '  float sphere = smoothstep(0.55, 0.0, orb);',
    '  float glow = sphere * (0.35 + 0.25 * sin(uTime * 0.6 + n * 6.0));',
    '  vec3 col = vec3(0.0);',
    '  col += vec3(0.04, 0.05, 0.12) * n;',
    '  col += vec3(0.10, 0.18, 1.0) * glow * 0.35;',
    '  col += vec3(0.48, 0.17, 1.0) * glow * sphere * 0.25;',
    '  col += vec3(1.0, 0.16, 0.83) * glow * sphere * 0.12;',
    '  col += vec3(0.10, 0.67, 0.07) * glow * sphere * 0.08;',
    '  float stars = step(0.992, hash(floor(uv * uResolution * 0.5)));',
    '  col += vec3(1.0) * stars * 0.15;',
    '  float vig = smoothstep(1.2, 0.2, length(p));',
    '  col *= vig;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var ORB_VS = BG_VS;

  var ORB_FS = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform float uTime;',
    'uniform vec2 uResolution;',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0, 289.0))) * 1031.0); }',
    'float hash3(vec3 p){ return fract(sin(dot(p, vec3(41.0, 289.0, 157.0))) * 1031.0); }',
    'float noise(vec3 p){',
    '  vec3 i = floor(p); vec3 f = fract(p);',
    '  float n = dot(i, vec3(1.0, 57.0, 113.0));',
    '  vec3 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(mix(hash(vec2(n)), hash(vec2(n + 1.0)), u.x),',
    '    mix(hash(vec2(n + 57.0)), hash(vec2(n + 58.0)), u.x), u.y),',
    '    mix(mix(hash(vec2(n + 113.0)), hash(vec2(n + 114.0)), u.x),',
    '    mix(hash(vec2(n + 170.0)), hash(vec2(n + 171.0)), u.x), u.y), u.z);',
    '}',
    'float map(vec3 p){',
    '  float d = length(p) - 0.68;',
    '  float n = noise(p * 3.2 + uTime * 0.22) * 0.14;',
    '  n += noise(p * 6.0 - uTime * 0.35) * 0.06;',
    '  return d + n;',
    '}',
    'vec3 calcNormal(vec3 p){',
    '  vec2 e = vec2(0.001, 0.0);',
    '  return normalize(vec3(',
    '    map(p + e.xyy) - map(p - e.xyy),',
    '    map(p + e.yxy) - map(p - e.yxy),',
    '    map(p + e.yyx) - map(p - e.yyx)));',
    '}',
    'float lightning(vec3 p, float t){',
    '  float arc = sin(p.x * 18.0 + t * 6.0) * sin(p.y * 14.0 - t * 5.0) * sin(p.z * 16.0 + t * 4.5);',
    '  arc = pow(abs(arc), 0.22);',
    '  float bolt = smoothstep(0.55, 0.95, arc) * smoothstep(0.85, 0.2, length(p));',
    '  bolt += pow(max(0.0, sin(length(p) * 12.0 - t * 8.0)), 8.0) * 0.35;',
    '  return bolt;',
    '}',
    'void main(){',
    '  vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);',
    '  vec3 ro = vec3(0.0, 0.0, 2.8);',
    '  vec3 rd = normalize(vec3(uv, -1.6));',
    '  float t = 0.0; float hit = 0.0; vec3 p;',
    '  for (int i = 0; i < 72; i++) {',
    '    p = ro + rd * t;',
    '    float d = map(p);',
    '    if (d < 0.001) { hit = 1.0; break; }',
    '    t += d;',
    '    if (t > 6.0) break;',
    '  }',
    '  vec3 col = vec3(0.0);',
    '  float alpha = 0.0;',
    '  if (hit > 0.5) {',
    '    vec3 n = calcNormal(p);',
    '    vec3 light = normalize(vec3(0.5, 0.9, 1.0));',
    '    float diff = max(dot(n, light), 0.0);',
    '    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);',
    '    float bolt = lightning(p, uTime);',
    '    float band = sin(atan(p.y, p.x) * 5.0 + uTime * 1.2 + length(p) * 6.0);',
    '    col = vec3(0.05, 0.08, 0.18) + vec3(0.12, 0.35, 1.0) * diff * 0.6;',
    '    col += vec3(0.10, 0.67, 0.07) * rim * 0.55;',
    '    col += vec3(0.55, 0.18, 1.0) * rim * 0.75;',
    '    col += vec3(1.0, 0.25, 0.85) * rim * 0.45;',
    '    col += vec3(0.0, 0.95, 1.0) * bolt * 0.95;',
    '    col += vec3(1.0, 0.88, 0.15) * bolt * rim * 0.65;',
    '    col += vec3(1.0, 0.35, 0.2) * max(band, 0.0) * 0.22;',
    '    col += vec3(0.15, 1.0, 0.45) * max(-band, 0.0) * 0.18;',
    '    alpha = 0.88 + rim * 0.12;',
    '  }',
    '  float halo = smoothstep(0.95, 0.15, length(uv));',
    '  col += vec3(0.10, 0.67, 0.07) * halo * 0.08;',
    '  col += vec3(0.45, 0.2, 1.0) * halo * 0.06 * sin(uTime + uv.x * 10.0);',
    '  alpha = max(alpha, halo * 0.35);',
    '  gl_FragColor = vec4(col, alpha);',
    '}'
  ].join('\n');

  function initGlCanvas(canvas, fragmentSource, alpha) {
    var gl = canvas.getContext('webgl', { alpha: alpha, antialias: true, premultipliedAlpha: false });
    if (!gl) return null;

    var program = createProgram(gl, BG_VS, fragmentSource);
    if (!program) return null;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    var uTime = gl.getUniformLocation(program, 'uTime');
    var uResolution = gl.getUniformLocation(program, 'uResolution');

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    var raf = 0;
    var start = performance.now();

    function draw(now) {
      resize();
      gl.clearColor(0, 0, 0, alpha ? 0 : 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);

    return function dispose() {
      cancelAnimationFrame(raf);
    };
  }

  function init() {
    var bg = document.getElementById('scene-bg');
    var orb = document.getElementById('hero-orb');

    if (bg) initGlCanvas(bg, BG_FS, false);

    if (orb) {
      var gl = orb.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
      if (gl) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }
      initGlCanvas(orb, ORB_FS, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
