(function () {
  'use strict';

  var MODES = ['idle', 'listening', 'thinking', 'typing', 'speaking', 'user', 'navigate', 'tour'];
  var MODE_CFG = {
    idle: { intensity: 0.14, hue: 220, pulse: 0.32, speed: 1 },
    listening: { intensity: 0.58, hue: 128, pulse: 0.88, speed: 1.15 },
    thinking: { intensity: 0.52, hue: 235, pulse: 0.55, speed: 1.35 },
    typing: { intensity: 0.42, hue: 272, pulse: 0.68, speed: 1.25 },
    speaking: { intensity: 0.78, hue: 252, pulse: 0.96, speed: 1.1 },
    user: { intensity: 0.62, hue: 205, pulse: 0.82, speed: 1.4 },
    navigate: { intensity: 0.88, hue: 218, pulse: 1, speed: 1.55 },
    tour: { intensity: 0.64, hue: 248, pulse: 0.78, speed: 1.2 }
  };

  var SECTION_HUE = {
    hero: 220,
    vision: 268,
    pillars: 132,
    'earth-space': 208,
    roadmap: 48,
    architecture: 278,
    revenue: 158,
    moats: 292,
    'north-star': 242
  };

  var zone = null;
  var idleTimer = 0;
  var raf = 0;
  var reactive = {
    mode: 'idle',
    intensity: 0.14,
    targetIntensity: 0.14,
    hue: 220,
    targetHue: 220,
    pulse: 0.32,
    targetPulse: 0.32,
    speed: 1,
    targetSpeed: 1,
    impulse: 0,
    sectionId: null,
    speakingPhase: 0
  };

  function applyDom() {
    if (!zone) zone = document.querySelector('.ai-orb-zone');
    if (!zone) return;
    var i;
    for (i = 0; i < MODES.length; i++) {
      zone.classList.remove('orb-reactive--' + MODES[i]);
    }
    zone.classList.add('orb-reactive--' + reactive.mode);
    if (reactive.sectionId) {
      zone.setAttribute('data-orb-section', reactive.sectionId);
    } else {
      zone.removeAttribute('data-orb-section');
    }
    zone.style.setProperty('--orb-reactive-intensity', String(reactive.intensity + reactive.impulse * 0.45));
    zone.style.setProperty('--orb-reactive-hue', String(reactive.hue));
    zone.style.setProperty('--orb-reactive-pulse', String(reactive.pulse));
    zone.style.setProperty('--orb-reactive-speed', String(reactive.speed));
  }

  function broadcast() {
    window.dispatchEvent(new CustomEvent('hls:orb-reactive', { detail: {
      mode: reactive.mode,
      intensity: reactive.intensity,
      hue: reactive.hue,
      pulse: reactive.pulse,
      speed: reactive.speed,
      impulse: reactive.impulse,
      sectionId: reactive.sectionId
    } }));
  }

  function setMode(mode, detail) {
    detail = detail || {};
    var cfg = MODE_CFG[mode] || MODE_CFG.idle;
    reactive.mode = mode;
    reactive.targetIntensity = detail.intensity != null ? detail.intensity : cfg.intensity;
    reactive.targetPulse = detail.pulse != null ? detail.pulse : cfg.pulse;
    reactive.targetSpeed = detail.speed != null ? detail.speed : cfg.speed;
    reactive.targetHue = detail.hue != null ? detail.hue : (
      detail.sectionId && SECTION_HUE[detail.sectionId] != null
        ? SECTION_HUE[detail.sectionId]
        : cfg.hue
    );
    if (detail.sectionId !== undefined) reactive.sectionId = detail.sectionId;
    if (detail.impulse) reactive.impulse = Math.min(1, reactive.impulse + detail.impulse);
    applyDom();
    broadcast();
  }

  function scheduleIdle(delay) {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleTimer = 0;
      setMode('idle');
    }, delay == null ? 450 : delay);
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    reactive.intensity += (reactive.targetIntensity - reactive.intensity) * 0.07;
    reactive.hue += (reactive.targetHue - reactive.hue) * 0.06;
    reactive.pulse += (reactive.targetPulse - reactive.pulse) * 0.08;
    reactive.speed += (reactive.targetSpeed - reactive.speed) * 0.07;
    reactive.impulse *= 0.9;
    reactive.speakingPhase += reactive.mode === 'speaking' ? 0.14 * reactive.pulse : 0.04;
    if (zone) {
      zone.style.setProperty('--orb-reactive-intensity', String(reactive.intensity + reactive.impulse * 0.45));
      zone.style.setProperty('--orb-reactive-hue', String(reactive.hue));
      zone.style.setProperty('--orb-reactive-pulse', String(reactive.pulse));
      zone.style.setProperty('--orb-reactive-speed', String(reactive.speed));
      zone.style.setProperty('--orb-speaking-phase', String(reactive.speakingPhase));
    }
  }

  function onOrbEvent(e) {
    var d = e.detail || {};
    if (d.mode === 'idle') {
      scheduleIdle(d.delay);
      return;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = 0;
    }
    setMode(d.mode, d);
  }

  window.HLS = window.HLS || {};
  window.HLS.getOrbReactive = function () {
    return {
      mode: reactive.mode,
      intensity: reactive.intensity + reactive.impulse * 0.45,
      hue: reactive.hue,
      pulse: reactive.pulse,
      speed: reactive.speed,
      sectionId: reactive.sectionId,
      speakingPhase: reactive.speakingPhase
    };
  };
  window.HLS.setOrbReactive = function (mode, detail) {
    document.dispatchEvent(new CustomEvent('ai-core:orb', {
      detail: Object.assign({ mode: mode }, detail || {})
    }));
  };
  window.HLS.orbImpulse = function (amount) {
    reactive.impulse = Math.min(1, reactive.impulse + (amount || 0.35));
    applyDom();
  };

  document.addEventListener('ai-core:orb', onOrbEvent);
  applyDom();
  broadcast();
  tick();
})();
