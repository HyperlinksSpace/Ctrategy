(function () {
  'use strict';

  var THREE_VER = '0.170.0';
  var depsPromise = null;
  var disposer = null;
  var loadGen = 0;

  function loadDeps() {
    if (window.__THREE__ && window.__RoomEnvironment__) {
      return Promise.resolve({ THREE: window.__THREE__, RoomEnvironment: window.__RoomEnvironment__ });
    }
    if (!depsPromise) {
      depsPromise = Promise.all([
        import('https://cdn.jsdelivr.net/npm/three@' + THREE_VER + '/build/three.module.js'),
        import('https://cdn.jsdelivr.net/npm/three@' + THREE_VER + '/examples/jsm/environments/RoomEnvironment.js')
      ]).then(function (mods) {
        window.__THREE__ = mods[0];
        window.__RoomEnvironment__ = mods[1].RoomEnvironment;
        return { THREE: mods[0], RoomEnvironment: mods[1].RoomEnvironment };
      }).catch(function (err) {
        depsPromise = null;
        throw err;
      });
    }
    return depsPromise;
  }

  var NOISE3D = [
    'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}',
    'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
    'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}',
    'float snoise(vec3 v){',
    '  const vec2 C=vec2(1.0/6.0,1.0/3.0);',
    '  const vec4 D=vec4(0.0,0.5,1.0,2.0);',
    '  vec3 i=floor(v+dot(v,C.yyy));',
    '  vec3 x0=v-i+dot(i,C.xxx);',
    '  vec3 g=step(x0.yzx,x0.xyz);',
    '  vec3 l=1.0-g;',
    '  vec3 i1=min(g.xyz,l.zxy);',
    '  vec3 i2=max(g.xyz,l.zxy);',
    '  vec3 x1=x0-i1+C.xxx;',
    '  vec3 x2=x0-i2+C.yyy;',
    '  vec3 x3=x0-D.yyy;',
    '  i=mod289(i);',
    '  vec4 p=permute(permute(permute(',
    '    i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));',
    '  float n_=0.142857142857;',
    '  vec3 ns=n_*D.wyz-D.xzx;',
    '  vec4 j=p-49.0*floor(p*ns.z*ns.z);',
    '  vec4 x_=floor(j*ns.z);',
    '  vec4 y_=floor(j-7.0*x_);',
    '  vec4 x=x_*ns.x+ns.yyyy;',
    '  vec4 y=y_*ns.x+ns.yyyy;',
    '  vec4 h=1.0-abs(x)-abs(y);',
    '  vec4 b0=vec4(x.xy,y.xy);',
    '  vec4 b1=vec4(x.zw,y.zw);',
    '  vec4 s0=floor(b0)*2.0+1.0;',
    '  vec4 s1=floor(b1)*2.0+1.0;',
    '  vec4 sh=-step(h,vec4(0.0));',
    '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;',
    '  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
    '  vec3 p0=vec3(a0.xy,h.x);',
    '  vec3 p1=vec3(a0.zw,h.y);',
    '  vec3 p2=vec3(a1.xy,h.z);',
    '  vec3 p3=vec3(a1.zw,h.w);',
    '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
    '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
    '  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);',
    '  m=m*m;',
    '  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
    '}'
  ].join('\n');

  var SPHERE_VS = [
    'uniform float uTime;',
    'uniform float uNoiseScale;',
    'uniform float uDisplacement;',
    'uniform float uSpeed;',
    NOISE3D,
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'varying float vNoise;',
    'void main(){',
    '  vec3 pos=position;',
    '  float n=snoise(pos*uNoiseScale+uTime*uSpeed);',
    '  float n2=snoise(pos*(uNoiseScale*0.7)+uTime*uSpeed*0.5+10.0);',
    '  float pulse=sin(uTime*0.4)*0.04+1.0;',
    '  float combined=(n+n2*0.5)*0.5;',
    '  vNoise=combined;',
    '  pos+=normal*(combined*uDisplacement);',
    '  pos*=pulse;',
    '  vPosition=pos;',
    '  vNormal=normal;',
    '  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);',
    '}'
  ].join('\n');

  var SPHERE_FS = [
    'uniform float uTime;',
    'uniform float uEmission;',
    NOISE3D,
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'varying float vNoise;',
    'void main(){',
    '  float n=snoise(vPosition*2.0+uTime*0.2)*0.5+0.5;',
    '  vec3 blue=vec3(0.165,0.667,1.0);',
    '  vec3 violet=vec3(0.478,0.173,1.0);',
    '  vec3 magenta=vec3(1.0,0.165,0.831);',
    '  vec3 baseColor=mix(blue,violet,n);',
    '  baseColor=mix(baseColor,magenta,n*0.6);',
    '  vec3 N=normalize(vNormal);',
    '  vec3 V=normalize(-vPosition);',
    '  vec3 L=normalize(vec3(0.5,0.9,0.3));',
    '  vec3 H=normalize(L+V);',
    '  float ndotl=max(dot(N,L),0.0);',
    '  float ndoth=max(dot(N,H),0.0);',
    '  float spec=pow(ndoth,64.0)*1.6;',
    '  float fresnel=pow(1.0-max(dot(N,V),0.0),3.0);',
    '  vec3 color=baseColor*(0.35+0.9*ndotl);',
    '  color+=spec;',
    '  color=mix(color,color*1.3,fresnel);',
    '  float emission=(vNoise*0.5+0.5)*uEmission;',
    '  float pulseGlow=sin(uTime*0.5)*0.15+0.85;',
    '  gl_FragColor=vec4(color+color*emission*pulseGlow,0.82);',
    '}'
  ].join('\n');

  var CORE_VS = [
    'uniform float uTime;',
    'uniform float uNoiseScale;',
    'uniform float uDisplacement;',
    'uniform float uSpeed;',
    NOISE3D,
    'varying vec3 vPosition;',
    'varying float vNoise;',
    'void main(){',
    '  vec3 pos=position;',
    '  float n=snoise(pos*uNoiseScale+uTime*uSpeed);',
    '  vNoise=n;',
    '  pos+=normal*(n*uDisplacement);',
    '  vPosition=pos;',
    '  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);',
    '}'
  ].join('\n');

  var CORE_FS = [
    'uniform float uTime;',
    NOISE3D,
    'varying vec3 vPosition;',
    'varying float vNoise;',
    'void main(){',
    '  float n=snoise(vPosition*3.0+uTime*0.25)*0.5+0.5;',
    '  vec3 color=vec3(0.6,0.3,1.0);',
    '  float a=0.45*(0.5+0.5*n)*(1.0-length(vPosition)*0.4);',
    '  float pulse=sin(uTime*0.6)*0.1+0.9;',
    '  gl_FragColor=vec4(color,a*pulse);',
    '}'
  ].join('\n');

  var SCENE_BOUNDS = { cx: 0, cy: -0.5, cz: 0, r: 1.78 };
  var LINK_MAJOR = 0.22;
  var LINK_MINOR = 0.055;
  var ELONG = 1.5;
  var FLAT = 0.92;
  var GALAXY_INNER = 0.3;
  var GALAXY_OUTER = 2.4;
  var GALAXY_TURNS = 2.5;
  var GALAXY_THICK = 0.12;
  var MIN_LINK_DIST = 0.58;
  var FLOAT_AMP = 0.06;
  var FLOAT_SPEED = 0.25;
  var TUMBLE_SPEED = 0.12;
  var BOTTOM_Y = -2.2;
  var BOTTOM_SPACING = 2 * LINK_MAJOR * ELONG * 0.7;

  function seed(i) {
    var x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildGalaxyLayout(count) {
    var layout = [];
    var i, t, rBase, r, ang, x, z, y, pass, j, pi, pj, d, push, moved;
    for (i = 0; i < count; i++) {
      t = i / count;
      rBase = GALAXY_INNER + t * (GALAXY_OUTER - GALAXY_INNER);
      r = rBase + (seed(i * 31) - 0.5) * 0.5;
      ang = t * Math.PI * 2 * GALAXY_TURNS + (seed(i * 37) - 0.5) * 2.2 + seed(i * 41) * 0.5;
      x = r * Math.cos(ang);
      z = r * Math.sin(ang);
      y = (seed(i * 43) - 0.5) * GALAXY_THICK * 3;
      layout.push({
        x: x, y: y, z: z,
        rx: (seed(i * 47) - 0.5) * Math.PI * 1.1,
        ry: (seed(i * 53) - 0.5) * Math.PI,
        rz: (seed(i * 59) - 0.5) * Math.PI * 2,
        idx: i
      });
    }
    for (pass = 0; pass < 12; pass++) {
      moved = false;
      for (i = 0; i < layout.length; i++) {
        pi = layout[i];
        for (j = 0; j < layout.length; j++) {
          if (i === j) continue;
          pj = layout[j];
          d = Math.hypot(pi.x - pj.x, pi.y - pj.y, pi.z - pj.z);
          if (d > 0 && d < MIN_LINK_DIST) {
            push = (MIN_LINK_DIST - d) / d;
            pi.x += (pi.x - pj.x) * push;
            pi.y += (pi.y - pj.y) * push;
            pi.z += (pi.z - pj.z) * push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return layout;
  }

  function getQ() {
    return window.HLS && window.HLS.getQuality ? window.HLS.getQuality() : {
      dpr: 2, lite: false, orbFrameSkip: 1, orbMaxPx: 1280,
      threeSphereSeg: 128, threeInnerSeg: 64, threeChainCount: 48,
      threeTubeSeg: 56, threeRingSeg: 48, threeBottomChains: true, lightning: true
    };
  }

  function shouldRun() {
    return window.HLS && window.HLS.shouldAnimateHero ? window.HLS.shouldAnimateHero() : !document.hidden;
  }

  function boundsForCanvas(w, h) {
    var aspect = w / Math.max(h, 1);
    if (aspect < 1.4 || w < 420) {
      return { cx: 0, cy: -0.28, cz: 0, r: 1.02, tight: true };
    }
    if (aspect < 1.85) {
      return { cx: 0, cy: -0.38, cz: 0, r: 1.35, tight: false };
    }
    return { cx: 0, cy: -0.5, cz: 0, r: 1.78, tight: false };
  }

  function createHeroScene(deps, canvas) {
    var THREE = deps.THREE;
    var RoomEnvironment = deps.RoomEnvironment;
    var q = getQ();
    var running = true;
    var raf = 0;
    var frame = 0;
    var start = performance.now();
    var bounds = boundsForCanvas(canvas.clientWidth, canvas.clientHeight);
    var center = new THREE.Vector3(bounds.cx, bounds.cy, bounds.cz);

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !q.lite,
      powerPreference: q.lite ? 'low-power' : 'high-performance',
      desynchronized: true
    });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(3, 4, 2);
    scene.add(dirLight);
    var ptCore = new THREE.PointLight(0x7a2cff, 2.5, 4);
    ptCore.position.set(0, 0, 0);
    scene.add(ptCore);
    var ptBlue = new THREE.PointLight(0x4a6cf7, 0.8, 8);
    ptBlue.position.set(-2, 2, -3);
    scene.add(ptBlue);
    var ptDeep = new THREE.PointLight(0x2a2aff, 0.5, 8);
    ptDeep.position.set(3, -2, -2);
    scene.add(ptDeep);
    var ptRim = new THREE.PointLight(0xa0b0c8, 0.7, 8);
    ptRim.position.set(2, 1, 2);
    scene.add(ptRim);

    var fitGroup = new THREE.Group();
    var content = new THREE.Group();
    fitGroup.add(content);
    scene.add(fitGroup);

    var sphereSeg = q.threeSphereSeg || 128;
    var innerSeg = q.threeInnerSeg || 64;
    var sphereUniforms = {
      uTime: { value: 0 },
      uNoiseScale: { value: 3.2 },
      uDisplacement: { value: 0.28 },
      uSpeed: { value: 0.28 },
      uEmission: { value: 3.0 }
    };
    var outer = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, sphereSeg, sphereSeg),
      new THREE.ShaderMaterial({
        vertexShader: SPHERE_VS,
        fragmentShader: SPHERE_FS,
        uniforms: sphereUniforms,
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide
      })
    );
    content.add(outer);

    var innerUniforms = {
      uTime: { value: 0 },
      uNoiseScale: { value: 2.5 },
      uDisplacement: { value: 0.1 },
      uSpeed: { value: 0.15 }
    };
    var inner = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, innerSeg, innerSeg),
      new THREE.ShaderMaterial({
        vertexShader: CORE_VS,
        fragmentShader: CORE_FS,
        uniforms: innerUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      })
    );
    inner.scale.setScalar(0.75);
    content.add(inner);

    var starCount = q.lite ? 500 : 1400;
    var starPos = new Float32Array(starCount * 3);
    var starCol = new Float32Array(starCount * 3);
    var si;
    for (si = 0; si < starCount; si++) {
      var th = Math.random() * Math.PI * 2;
      var ph = Math.acos(2 * Math.random() - 1);
      var rad = 2.2 + Math.random() * 7.5;
      starPos[si * 3] = rad * Math.sin(ph) * Math.cos(th);
      starPos[si * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
      starPos[si * 3 + 2] = rad * Math.cos(ph);
      starCol[si * 3] = 0.55 + Math.random() * 0.35;
      starCol[si * 3 + 1] = 0.65 + Math.random() * 0.3;
      starCol[si * 3 + 2] = 1;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
      size: q.lite ? 0.018 : 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    content.add(stars);

    var ringMeshes = [];
    var ri;
    for (ri = 0; ri < ringRadii.length; ri++) {
      var orbit = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadii[ri], 0.006, 8, q.lite ? 64 : 128),
        new THREE.MeshBasicMaterial({
          color: ri === 0 ? 0x4a6cf7 : (ri === 1 ? 0x7a2cff : 0x1aaa11),
          transparent: true,
          opacity: 0.28 - ri * 0.05,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      orbit.rotation.x = Math.PI * 0.5 + ri * 0.12;
      orbit.rotation.z = ri * 0.35;
      orbit.userData.ringIdx = ri;
      ringMeshes.push(orbit);
      content.add(orbit);
    }

    var chainCount = bounds.tight ? Math.min(q.threeChainCount || 0, 16) : (q.threeChainCount || 0);
    var layout = chainCount > 0 ? buildGalaxyLayout(chainCount) : [];
    var chains = [];
    var tubeSeg = q.threeTubeSeg || 56;
    var ringSeg = q.threeRingSeg || 48;
    var linkGeo = new THREE.TorusGeometry(LINK_MAJOR, LINK_MINOR, tubeSeg, ringSeg);
    linkGeo.scale(ELONG, FLAT, 1);
    var linkMat = new THREE.MeshPhysicalMaterial({
      color: 0x9ca4ac,
      metalness: 1,
      roughness: 0.15,
      clearcoat: 0.15,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.6
    });
    var chainGroup = new THREE.Group();
    var li, link;
    for (li = 0; li < layout.length; li++) {
      link = new THREE.Mesh(linkGeo, linkMat);
      link.position.set(layout[li].x, layout[li].y, layout[li].z);
      link.rotation.set(layout[li].rx, layout[li].ry, layout[li].rz);
      link.userData = layout[li];
      chainGroup.add(link);
      chains.push(link);
    }
    content.add(chainGroup);

    var bottomRefs = [];
    if (q.threeBottomChains !== false && !q.lite && !bounds.tight) {
      var bottom = new THREE.Group();
      bottom.position.y = BOTTOM_Y;
      for (li = 0; li < 3; li++) {
        link = new THREE.Mesh(linkGeo, linkMat);
        link.position.x = (li - 1) * BOTTOM_SPACING;
        link.rotation.x = li % 2 === 0 ? 0 : Math.PI / 2;
        link.userData.bottomIdx = li;
        bottom.add(link);
        bottomRefs.push(link);
      }
      content.add(bottom);
    }

    var corners = [];
    var r = bounds.r;
    var ci;
    for (ci = 0; ci < 8; ci++) {
      corners.push(new THREE.Vector3(
        center.x + (ci & 1 ? r : -r),
        center.y + (ci & 2 ? r : -r),
        center.z + (ci & 4 ? r : -r)
      ));
    }

    var proj = new THREE.Vector3();
    var clip = new THREE.Vector4();
    var projMat = new THREE.Matrix4();

    function fitCamera() {
      var dir = new THREE.Vector3(4, -4, 3).normalize();
      var halfRad = (camera.fov * Math.PI) / 360;
      var dist = (bounds.r * 0.88) / Math.tan(halfRad);
      camera.position.copy(center).add(dir.multiplyScalar(dist));
      camera.lookAt(center);
    }

    function fitScale() {
      camera.updateMatrixWorld(true);
      projMat.copy(camera.projectionMatrix).multiply(camera.matrixWorldInverse);
      var lo = 0.12;
      var hi = bounds.tight ? 14 : 22;
      var mid, ok, iter, scaled, c;
      for (iter = 0; iter < 28; iter++) {
        mid = (lo + hi) * 0.5;
        ok = true;
        for (ci = 0; ci < corners.length; ci++) {
          c = corners[ci];
          scaled = new THREE.Vector3(
            center.x + mid * (c.x - center.x),
            center.y + mid * (c.y - center.y),
            center.z + mid * (c.z - center.z)
          );
          clip.set(scaled.x, scaled.y, scaled.z, 1);
          clip.applyMatrix4(projMat);
          if (Math.abs(clip.w) < 1e-6) { ok = false; break; }
          if (Math.abs(clip.x / clip.w) > 1 || Math.abs(clip.y / clip.w) > 1) { ok = false; break; }
        }
        if (ok) lo = mid; else hi = mid;
      }
      fitGroup.scale.setScalar(lo);
      fitGroup.position.copy(center);
      content.position.set(-center.x, -center.y, -center.z);
    }

    function getReactive() {
      return window.HLS && window.HLS.getOrbReactive ? window.HLS.getOrbReactive() : {
        intensity: 0.14, hue: 220, pulse: 0.32, speed: 1, mode: 'idle', speakingPhase: 0
      };
    }

    function applyReactiveVisuals(t, rx) {
      var energy = rx.intensity;
      var speedMul = rx.speed || 1;
      var pulse = rx.pulse || 0.3;
      var speakWave = rx.mode === 'speaking' ? Math.sin(rx.speakingPhase || t * 3) * 0.5 + 0.5 : 0;

      sphereUniforms.uSpeed.value = (0.28 + energy * 0.55) * speedMul;
      sphereUniforms.uDisplacement.value = 0.28 + energy * 0.14 + speakWave * 0.06;
      sphereUniforms.uEmission.value = 3.0 + energy * 2.8 + speakWave * 1.2;
      innerUniforms.uSpeed.value = (0.15 + energy * 0.35) * speedMul;

      ptCore.intensity = 2.5 + energy * 2.4 + speakWave * 1.5;
      ptBlue.intensity = 0.8 + energy * 1.1;
      ptDeep.intensity = 0.5 + energy * 0.6;

      var hue = (rx.hue || 220) / 360;
      ptCore.color.setHSL(hue, 0.72, 0.52);
      ptBlue.color.setHSL((hue + 0.08) % 1, 0.65, 0.5);

      stars.material.opacity = 0.55 + energy * 0.35;
      stars.material.size = (q.lite ? 0.018 : 0.026) * (1 + energy * 0.35);

      var ringHue = hue;
      var ri2;
      for (ri2 = 0; ri2 < ringMeshes.length; ri2++) {
        ringMeshes[ri2].material.opacity = (0.28 - ri2 * 0.05) + energy * 0.22;
        ringMeshes[ri2].material.color.setHSL((ringHue + ri2 * 0.06) % 1, 0.75, 0.55);
      }

      content.rotation.y = Math.sin(t * 0.12 * speedMul) * 0.04 * energy;
      outer.scale.setScalar(1 + speakWave * 0.035 + energy * 0.02);
      inner.scale.setScalar(0.75 + speakWave * 0.04 + energy * 0.015);
    }

    function animateExtras(t, rx) {
      var i;
      var speedMul = (rx && rx.speed) || 1;
      var energy = (rx && rx.intensity) || 0.14;
      for (i = 0; i < content.children.length; i++) {
        var child = content.children[i];
        if (child.userData && child.userData.ringIdx !== undefined) {
          child.rotation.y = t * (0.08 + child.userData.ringIdx * 0.04) * speedMul;
          child.rotation.x = Math.PI * 0.5 + child.userData.ringIdx * 0.12 +
            Math.sin(t * 0.3 * speedMul + child.userData.ringIdx) * (0.06 + energy * 0.05);
        }
      }
    }

    function animateChains(t, rx) {
      var i, mesh, b, s1, s2, s3;
      var amp = FLOAT_AMP * (1 + ((rx && rx.intensity) || 0.14) * 1.8);
      var tumble = TUMBLE_SPEED * ((rx && rx.speed) || 1);
      for (i = 0; i < chains.length; i++) {
        mesh = chains[i];
        b = mesh.userData;
        s1 = seed(b.idx * 7);
        s2 = seed(b.idx * 11 + 100);
        s3 = seed(b.idx * 13 + 200);
        mesh.position.set(
          b.x + amp * Math.sin(t * FLOAT_SPEED + s1 * 20) * (0.8 + s2 * 0.4),
          b.y + amp * Math.sin(t * FLOAT_SPEED * 0.7 + s2 * 20) * (0.8 + s3 * 0.4),
          b.z + amp * Math.sin(t * FLOAT_SPEED * 0.5 + s3 * 20) * (0.8 + s1 * 0.4)
        );
        mesh.rotation.set(
          b.rx + Math.sin(t * tumble + s1 * 10) * 0.08,
          b.ry + Math.sin(t * tumble * 0.8 + s2 * 10) * 0.06,
          b.rz + t * 0.02 * (s3 - 0.5) * ((rx && rx.speed) || 1)
        );
      }
      for (i = 0; i < bottomRefs.length; i++) {
        mesh = bottomRefs[i];
        var phase = mesh.userData.bottomIdx * 1.3;
        mesh.position.y = 0.04 * Math.sin(t * 0.45 + phase);
        mesh.position.z = 0.024 * Math.sin(t * 0.315 + phase);
      }
    }

    function resize() {
      var cw = canvas.clientWidth;
      var ch = canvas.clientHeight;
      if (cw < 1 || ch < 1) return;
      bounds = boundsForCanvas(cw, ch);
      center.set(bounds.cx, bounds.cy, bounds.cz);
      r = bounds.r;
      for (ci = 0; ci < 8; ci++) {
        corners[ci].set(
          center.x + (ci & 1 ? r : -r),
          center.y + (ci & 2 ? r : -r),
          center.z + (ci & 4 ? r : -r)
        );
      }
      chainGroup.visible = !bounds.tight || chainCount > 0;
      var qq = getQ();
      var dpr = qq.lite ? 1 : Math.min(qq.dpr || 2, window.devicePixelRatio || 1, 2);
      var maxPx = qq.orbMaxPx || 1280;
      if (maxPx > 0) dpr = Math.min(dpr, maxPx / Math.max(cw, ch));
      renderer.setPixelRatio(dpr);
      renderer.setSize(cw, ch, false);
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      fitCamera();
      fitScale();
    }

    function tick(now) {
      raf = 0;
      if (!running || !shouldRun()) return;
      frame += 1;
      if (frame % (getQ().orbFrameSkip || 1) !== 0) { schedule(); return; }
      var t = (now - start) * 0.001;
      var rx = getReactive();
      sphereUniforms.uTime.value = t;
      innerUniforms.uTime.value = t;
      applyReactiveVisuals(t, rx);
      animateChains(t, rx);
      animateExtras(t, rx);
      fitScale();
      var t0 = performance.now();
      renderer.render(scene, camera);
      if (window.HLS && window.HLS.reportFrameTime) {
        window.HLS.reportFrameTime(performance.now() - t0);
      }
      schedule();
    }

    function schedule() {
      if (!raf && running && shouldRun()) raf = requestAnimationFrame(tick);
    }

    function wake() { resize(); schedule(); }

    if (window.ResizeObserver) new ResizeObserver(wake).observe(canvas);
    ['hls:visibility', 'hls:hero-visibility', 'hls:scroll-idle', 'hls:quality-change'].forEach(function (ev) {
      window.addEventListener(ev, wake);
    });

    resize();
    schedule();
    window.dispatchEvent(new Event('hls:hero-scene-ready'));

    return function dispose() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      pmrem.dispose();
      if (scene.environment) scene.environment.dispose();
      linkGeo.dispose();
      linkMat.dispose();
      starGeo.dispose();
      outer.geometry.dispose();
      outer.material.dispose();
      inner.geometry.dispose();
      inner.material.dispose();
      renderer.dispose();
    };
  }

  function init() {
    loadGen += 1;
    if (disposer) { disposer(); disposer = null; }
    var bg = document.getElementById('scene-bg');
    if (bg) bg.classList.add('scene-bg--static');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('hero-orb');
    if (!canvas) return;
    var gen = loadGen;
    loadDeps().then(function (deps) {
      if (gen !== loadGen) return;
      disposer = createHeroScene(deps, canvas);
    }).catch(function (err) {
      console.warn('[scene]', err);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('hls:theme-applied', init);
})();
