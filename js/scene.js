(function () {
  'use strict';

  var THREE_PROMISE = null;
  var disposer = null;
  var loadGen = 0;

  function loadThree() {
    if (window.__THREE__) return Promise.resolve(window.__THREE__);
    if (!THREE_PROMISE) {
      THREE_PROMISE = import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')
        .then(function (mod) { window.__THREE__ = mod; return mod; })
        .catch(function (err) { THREE_PROMISE = null; throw err; });
    }
    return THREE_PROMISE;
  }

  var NOISE3D = 'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}';

  var SPHERE_VS = 'uniform float uTime,uNoiseScale,uDisplacement,uSpeed;'+NOISE3D+'varying vec3 vNormal,vPosition;varying float vNoise;void main(){vec3 pos=position;float n=snoise(pos*uNoiseScale+uTime*uSpeed);float n2=snoise(pos*(uNoiseScale*0.7)+uTime*uSpeed*0.5+10.0);float pulse=sin(uTime*0.4)*0.04+1.0;float combined=(n+n2*0.5)*0.5;vNoise=combined;pos+=normal*(combined*uDisplacement);pos*=pulse;vPosition=pos;vNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}';
  var SPHERE_FS = 'uniform float uTime,uEmission,uIsLight;'+NOISE3D+'varying vec3 vNormal,vPosition;varying float vNoise;void main(){float n=snoise(vPosition*2.0+uTime*0.2)*0.5+0.5;vec3 blue=mix(vec3(0.12,0.42,0.95),vec3(0.165,0.667,1.0),uIsLight);vec3 violet=mix(vec3(0.42,0.12,0.92),vec3(0.478,0.173,1.0),uIsLight);vec3 magenta=mix(vec3(0.85,0.12,0.72),vec3(1.0,0.165,0.831),uIsLight);vec3 baseColor=mix(blue,violet,n);baseColor=mix(baseColor,magenta,n*0.6);vec3 N=normalize(vNormal);vec3 V=normalize(-vPosition);vec3 L=normalize(vec3(0.5,0.9,0.3));vec3 H=normalize(L+V);float ndotl=max(dot(N,L),0.0);float spec=pow(max(dot(N,H),0.0),64.0)*mix(1.2,1.6,uIsLight);float fresnel=pow(1.0-max(dot(N,V),0.0),3.0);vec3 color=baseColor*(0.35+0.9*ndotl)+spec; color=mix(color,color*1.3,fresnel);float emission=(vNoise*0.5+0.5)*uEmission;gl_FragColor=vec4(color+color*emission*(sin(uTime*0.5)*0.15+0.85),mix(0.78,0.82,uIsLight));}';
  var CORE_VS = 'uniform float uTime,uNoiseScale,uDisplacement,uSpeed;'+NOISE3D+'varying vec3 vPosition;varying float vNoise;void main(){vec3 pos=position;float n=snoise(pos*uNoiseScale+uTime*uSpeed);vNoise=n;pos+=normal*(n*uDisplacement);vPosition=pos;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}';
  var CORE_FS = 'uniform float uTime,uIsLight;'+NOISE3D+'varying vec3 vPosition;varying float vNoise;void main(){float n=snoise(vPosition*3.0+uTime*0.25)*0.5+0.5;vec3 color=mix(vec3(0.45,0.18,0.85),vec3(0.6,0.3,1.0),uIsLight);float a=0.45*(0.5+0.5*n)*(1.0-length(vPosition)*0.4);gl_FragColor=vec4(color,a*(sin(uTime*0.6)*0.1+0.9));}';
  var LIGHTNING_FS = 'precision mediump float;uniform float uTime,uIsLight,uBoltCount;uniform vec2 uResolution,uOrigin;varying vec2 vUv;float ltHash(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}void addBolt(vec2 p,float ang,float ltTime,float k,float maxLen,float weight,inout float acc){float rp=length(p);if(rp<1e-5)return;float a=atan(p.y,p.x);float da0=a-ang;da0=da0-6.2831853*floor((da0+3.14159265)/6.2831853);float along=cos(da0)*rp;if(along<0.0)return;float bend=sin(along*35.0+ltTime*(2.05+fract(k*0.31)*2.15)+k*2.45)*0.36; bend+=sin(along*10.2-ltTime*1.22+k*1.58)*0.16;float angCur=ang+bend;float daB=a-angCur;daB=daB-6.2831853*floor((daB+3.14159265)/6.2831853);float perp=abs(sin(daB))*rp;float lenCap=clamp(maxLen*0.51,0.12,0.58);float lenChop=(1.0-smoothstep(lenCap*0.82,lenCap*1.06,along))*smoothstep(0.012,0.052,along);acc+=exp(-pow(perp*420.0,2.0))*1.35*lenChop*weight;}void main(){vec2 uv=(vUv-0.5)*vec2(uResolution.x/uResolution.y,1.0);vec2 pLt=uv-uOrigin;float ltTime=uTime*5.2;float seed=ltHash(vec3(0.42,2.71,0.18));pLt-=vec2(sin(ltTime*0.41+seed*5.7)*0.04,cos(ltTime*0.35+seed*4.2)*0.035);float acc=0.0;for(float fi=0.0;fi<6.0;fi+=1.0){if(fi>=max(uBoltCount,1.0))break;float hA=ltHash(vec3(seed,fi*1.618,0.413));float hB=ltHash(vec3(seed,fi*2.718,9.069));float ang=hA*6.2831853+sin(ltTime*(0.62+hB*1.4)+hB*6.2831853)*0.42;addBolt(pLt,ang,ltTime,fi*2.17+seed*8.3,mix(0.26,0.92,hB),step(0.12,ltHash(vec3(seed,fi*4.201,3.331)))*0.85,acc);}acc=clamp(acc,0.0,4.5);vec3 boltCol=mix(vec3(0.55,0.82,1.0),vec3(0.35,0.55,1.0),uIsLight);gl_FragColor=vec4(boltCol*acc*1.8,acc*mix(0.55,0.35,uIsLight));}';

  var BOUNDS = { cx: 0, cy: -0.5, cz: 0, r: 1.78 };
  var LINK_MAJOR = 0.22, LINK_MINOR = 0.055, ELONG = 1.5, FLAT = 0.92;

  function seed(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

  function buildGalaxy(count) {
    var layout = [], i, t, r, ang, pass, j, d, moved, pi, pj;
    for (i = 0; i < count; i++) {
      t = i / count;
      r = 0.3 + t * 2.1 + (seed(i * 31) - 0.5) * 0.5;
      ang = t * Math.PI * 2 * 2.5 + (seed(i * 37) - 0.5) * 2.2;
      layout.push({ x: r * Math.cos(ang), y: (seed(i * 43) - 0.5) * 0.36, z: r * Math.sin(ang), rx: (seed(i * 47) - 0.5) * Math.PI * 1.1, ry: (seed(i * 53) - 0.5) * Math.PI, rz: (seed(i * 59) - 0.5) * Math.PI * 2 });
    }
    for (pass = 0; pass < 8; pass++) {
      moved = false;
      for (i = 0; i < layout.length; i++) {
        pi = layout[i];
        for (j = 0; j < layout.length; j++) {
          if (i === j) continue;
          pj = layout[j];
          d = Math.hypot(pi.x - pj.x, pi.y - pj.y, pi.z - pj.z);
          if (d > 0 && d < 0.58) {
            var push = (0.58 - d) / d;
            pi.x += (pi.x - pj.x) * push; pi.y += (pi.y - pj.y) * push; pi.z += (pi.z - pj.z) * push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return layout;
  }

  function getQ() { return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : { dpr: 1, lite: false, orbFrameSkip: 1, threeSphereSeg: 96, threeInnerSeg: 48, threeChainCount: 32, threeTubeSeg: 32, threeRingSeg: 24, threeBolts: 5, threeBottomChains: true, lightning: true, orbMaxPx: 720 }; }
  function isLight() { return window.HLS && window.HLS.isLightTheme ? window.HLS.isLightTheme() : false; }
  function shouldRun() { return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden; }

  function createHeroScene(THREE, canvas) {
    var q = getQ(), light = isLight() ? 1 : 0, running = true, raf = 0, frame = 0, start = performance.now();
    var orbAnchor = new THREE.Vector3(0, -0.5, 0), proj = new THREE.Vector3();
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: q.lite ? 'low-power' : 'high-performance', desynchronized: true });
    renderer.setPixelRatio(1); renderer.setClearColor(0, 0);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    var center = new THREE.Vector3(BOUNDS.cx, BOUNDS.cy, BOUNDS.cz);
    var dir = new THREE.Vector3(4, -4, 3).normalize().multiplyScalar(BOUNDS.r * 0.82 / Math.tan((camera.fov * Math.PI) / 720));
    camera.position.copy(center).add(dir); camera.lookAt(center);
    scene.add(new THREE.AmbientLight(0xffffff, light ? 0.55 : 0.4));
    var dl = new THREE.DirectionalLight(0xffffff, light ? 1.4 : 1.8); dl.position.set(3, 4, 2); scene.add(dl);
    var pl = new THREE.PointLight(light ? 0x6b3fd4 : 0x7a2cff, light ? 1.8 : 2.5, 4); pl.position.set(0, 0, 0); scene.add(pl);
    var fitGroup = new THREE.Group(), content = new THREE.Group(); fitGroup.add(content); scene.add(fitGroup);
    var su = { uTime: { value: 0 }, uNoiseScale: { value: 3.2 }, uDisplacement: { value: q.lite ? 0.22 : 0.28 }, uSpeed: { value: 0.28 }, uEmission: { value: q.lite ? 2.2 : 3.0 }, uIsLight: { value: light } };
    var outer = new THREE.Mesh(new THREE.SphereGeometry(1.2, q.threeSphereSeg || 96, q.threeSphereSeg || 96), new THREE.ShaderMaterial({ vertexShader: SPHERE_VS, fragmentShader: SPHERE_FS, uniforms: su, transparent: true, side: THREE.DoubleSide }));
    content.add(outer);
    var iu = { uTime: { value: 0 }, uNoiseScale: { value: 2.5 }, uDisplacement: { value: 0.1 }, uSpeed: { value: 0.15 }, uIsLight: { value: light } };
    var inner = new THREE.Mesh(new THREE.SphereGeometry(1.0, q.threeInnerSeg || 48, q.threeInnerSeg || 48), new THREE.ShaderMaterial({ vertexShader: CORE_VS, fragmentShader: CORE_FS, uniforms: iu, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
    inner.scale.setScalar(0.75); content.add(inner);
    var layout = (q.threeChainCount || 0) > 0 ? buildGalaxy(q.threeChainCount) : [], chains = [];
    var linkGeo = new THREE.TorusGeometry(LINK_MAJOR, LINK_MINOR, q.threeTubeSeg || 24, q.threeRingSeg || 16);
    linkGeo.scale(ELONG, FLAT, 1);
    var linkMat = new THREE.MeshStandardMaterial({ color: light ? 0xb8c0c8 : 0x9ca4ac, metalness: 1, roughness: light ? 0.22 : 0.15 });
    var li, link, chainGroup = new THREE.Group();
    for (li = 0; li < layout.length; li++) { link = new THREE.Mesh(linkGeo, linkMat); link.position.set(layout[li].x, layout[li].y, layout[li].z); link.rotation.set(layout[li].rx, layout[li].ry, layout[li].rz); link.userData = layout[li]; link.userData.idx = li; chainGroup.add(link); chains.push(link); }
    content.add(chainGroup);
    if (q.threeBottomChains) {
      var bottom = new THREE.Group(); bottom.position.y = -2.2;
      for (li = 0; li < 3; li++) { link = new THREE.Mesh(linkGeo, linkMat); link.position.x = (li - 1) * 0.32; link.rotation.x = li % 2 ? Math.PI / 2 : 0; bottom.add(link); }
      content.add(bottom);
    }
    var lightning = null, bolts = q.threeBolts || 0;
    if (bolts > 0 && q.lightning !== false) {
      lightning = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
        vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}',
        fragmentShader: LIGHTNING_FS,
        uniforms: { uTime: { value: 0 }, uIsLight: { value: light }, uResolution: { value: new THREE.Vector2(1, 1) }, uOrigin: { value: new THREE.Vector2(0, 0) }, uBoltCount: { value: bolts } },
        transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending
      }));
      lightning.frustumCulled = false; lightning.renderOrder = 10; scene.add(lightning);
    }
    var corners = [], r = BOUNDS.r, ci;
    for (ci = 0; ci < 8; ci++) corners.push(new THREE.Vector3(center.x + (ci & 1 ? r : -r), center.y + (ci & 2 ? r : -r), center.z + (ci & 4 ? r : -r)));
    function fitScale() {
      var lo = 0.12, hi = 22, mid, ok, iter, s = new THREE.Vector3(), c;
      for (iter = 0; iter < 24; iter++) {
        mid = (lo + hi) * 0.5; ok = true;
        for (ci = 0; ci < corners.length; ci++) {
          c = corners[ci]; s.set(center.x + mid * (c.x - center.x), center.y + mid * (c.y - center.y), center.z + mid * (c.z - center.z)).project(camera);
          if (Math.abs(s.x) > 1 || Math.abs(s.y) > 1) { ok = false; break; }
        }
        if (ok) lo = mid; else hi = mid;
      }
      fitGroup.scale.setScalar(lo); fitGroup.position.copy(center); content.position.set(-center.x, -center.y, -center.z);
    }
    function boltOrigin() {
      if (!lightning) return;
      proj.copy(orbAnchor).project(camera);
      lightning.material.uniforms.uOrigin.value.set(proj.x * camera.aspect * 0.5, proj.y * 0.5);
    }
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight; if (w < 1 || h < 1) return;
      var qq = getQ(), dpr = Math.min(qq.dpr || 1, q.lite ? 1 : 1.5), maxPx = qq.orbMaxPx || 720;
      if (maxPx > 0) dpr = Math.min(dpr, maxPx / Math.max(w, h));
      renderer.setPixelRatio(dpr); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      dir.set(4, -4, 3).normalize().multiplyScalar(BOUNDS.r * 0.82 / Math.tan((camera.fov * Math.PI) / 720));
      camera.position.copy(center).add(dir); camera.lookAt(center); fitScale(); boltOrigin();
      if (lightning) lightning.material.uniforms.uResolution.value.set(w * dpr, h * dpr);
    }
    function tick(now) {
      raf = 0; if (!running || !shouldRun()) return;
      frame += 1; if (frame % (getQ().orbFrameSkip || 1) !== 0) { schedule(); return; }
      var t = (now - start) * 0.001; su.uTime.value = t; iu.uTime.value = t;
      for (li = 0; li < chains.length; li++) {
        link = chains[li]; var b = link.userData, s1 = seed(b.idx * 7), s2 = seed(b.idx * 11 + 100), amp = q.lite ? 0.04 : 0.06;
        link.position.set(b.x + amp * Math.sin(t * 0.25 + s1 * 20), b.y + amp * Math.sin(t * 0.175 + s2 * 20), b.z + amp * Math.sin(t * 0.125 + s1 * 20));
        link.rotation.set(b.rx + Math.sin(t * 0.12 + s1 * 10) * 0.08, b.ry + Math.sin(t * 0.096 + s2 * 10) * 0.06, b.rz + t * 0.02 * (s2 - 0.5));
      }
      fitScale(); boltOrigin(); if (lightning) lightning.material.uniforms.uTime.value = t;
      var t0 = performance.now(); renderer.render(scene, camera);
      if (window.HLS && window.HLS.reportFrameTime) window.HLS.reportFrameTime(performance.now() - t0);
      schedule();
    }
    function schedule() { if (!raf && running && shouldRun()) raf = requestAnimationFrame(tick); }
    function wake() { resize(); schedule(); }
    if (window.ResizeObserver) new ResizeObserver(wake).observe(canvas);
    ['hls:visibility', 'hls:hero-visibility', 'hls:scroll-idle', 'hls:quality-change'].forEach(function (ev) { window.addEventListener(ev, wake); });
    resize(); schedule();
    return function dispose() {
      running = false; if (raf) cancelAnimationFrame(raf);
      linkGeo.dispose(); linkMat.dispose(); outer.geometry.dispose(); outer.material.dispose(); inner.geometry.dispose(); inner.material.dispose();
      if (lightning) { lightning.geometry.dispose(); lightning.material.dispose(); }
      renderer.dispose(); window.HLS = window.HLS || {}; window.HLS.heroThreeActive = false;
    };
  }

  function init() {
    loadGen += 1;
    if (disposer) { disposer(); disposer = null; }
    var bg = document.getElementById('scene-bg'); if (bg) bg.classList.add('scene-bg--static');
    window.HLS = window.HLS || {}; window.HLS.heroThreeActive = false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('hero-orb'); if (!canvas) return;
    var gen = loadGen;
    loadThree().then(function (THREE) {
      if (gen !== loadGen) return;
      disposer = createHeroScene(THREE, canvas);
      window.HLS.heroThreeActive = true;
      window.dispatchEvent(new Event('hls:hero-scene-ready'));
    }).catch(function () { window.HLS.heroThreeActive = false; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('hls:theme-applied', init);
})();
