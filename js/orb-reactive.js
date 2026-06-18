(function () {
  'use strict';

  var MODES = ['idle', 'listening', 'thinking', 'typing', 'speaking', 'user', 'navigate', 'tour'];
  var MODE_CFG = {
    idle: { intensity: 0.12, hue: 248, pulse: 0.24, speed: 0.78 },
    listening: { intensity: 0.64, hue: 162, pulse: 0.94, speed: 1.06 },
    thinking: { intensity: 0.58, hue: 278, pulse: 0.76, speed: 1.48 },
    typing: { intensity: 0.5, hue: 292, pulse: 0.84, speed: 1.38 },
    speaking: { intensity: 0.84, hue: 318, pulse: 1, speed: 0.9 },
    user: { intensity: 0.78, hue: 340, pulse: 0.96, speed: 1.5 },
    navigate: { intensity: 0.92, hue: 198, pulse: 1, speed: 1.55 },
    tour: { intensity: 0.52, hue: 265, pulse: 0.7, speed: 1.04 }
  };

  var SECTION_HUE = {
    hero: 248,
    vision: 278,
    pillars: 162,
    'earth-space': 198,
    roadmap: 265,
    architecture: 288,
    revenue: 155,
    moats: 310,
    'genesis-links': 278,
    'scale-links': 198,
    'intellectual-links': 248,
    'north-star': 318
  };

  var zone = null;
  var idleTimer = 0;
  var reactive = {
    mode: 'idle',
    intensity: 0.14,
    targetIntensity: 0.14,
    hue: 248,
    targetHue: 248,
    pulse: 0.26,
    targetPulse: 0.26,
    speed: 0.82,
    targetSpeed: 0.82,
    impulse: 0,
    sectionId: null,
    speakingPhase: 0,
    cursorX: 0,
    cursorY: 0,
    targetCursorX: 0,
    targetCursorY: 0,
    cursorActive: 0,
    targetCursorActive: 0
  };

  function findZone() {
    return document.querySelector('.stratviz-stage') ||
      document.querySelector('.nexus-stage') ||
      document.querySelector('.ai-orb-zone');
  }

  function applyDom() {
    if (!zone) zone = findZone();
    if (!zone) return;
    var i;
    for (i = 0; i < MODES.length; i++) {
      zone.classList.remove('orb-reactive--' + MODES[i]);
    }
    zone.classList.add('orb-reactive--' + reactive.mode);
    zone.setAttribute('data-orb-mode', reactive.mode);
    if (reactive.sectionId) {
      zone.setAttribute('data-orb-section', reactive.sectionId);
    } else {
      zone.removeAttribute('data-orb-section');
    }
    var intensity = reactive.intensity + reactive.impulse * 0.55;
    zone.style.setProperty('--orb-reactive-intensity', String(intensity));
    zone.style.setProperty('--orb-reactive-hue', String(reactive.hue));
    zone.style.setProperty('--orb-reactive-pulse', String(reactive.pulse));
    zone.style.setProperty('--orb-reactive-speed', String(reactive.speed));
    zone.style.setProperty('--stratviz-cursor-x', String(50 + reactive.cursorX * 46));
    zone.style.setProperty('--stratviz-cursor-y', String(44 + reactive.cursorY * 38));
    zone.style.setProperty('--stratviz-cursor-active', String(reactive.cursorActive));
    zone.style.setProperty('--stratviz-tilt-x', String(reactive.cursorY * -2.5 * reactive.cursorActive));
    zone.style.setProperty('--stratviz-tilt-y', String(reactive.cursorX * 3 * reactive.cursorActive));
    zone.classList.toggle('stratviz-cursor-on', reactive.cursorActive > 0.05);
  }

  function broadcast() {
    window.dispatchEvent(new CustomEvent('hls:orb-reactive', { detail: {
      mode: reactive.mode,
      intensity: reactive.intensity,
      hue: reactive.hue,
      pulse: reactive.pulse,
      speed: reactive.speed,
      impulse: reactive.impulse,
      sectionId: reactive.sectionId,
      cursorX: reactive.cursorX,
      cursorY: reactive.cursorY,
      cursorActive: reactive.cursorActive
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

  function tick(now) {
    reactive.intensity += (reactive.targetIntensity - reactive.intensity) * 0.09;
    reactive.hue += (reactive.targetHue - reactive.hue) * 0.07;
    reactive.pulse += (reactive.targetPulse - reactive.pulse) * 0.1;
    reactive.speed += (reactive.targetSpeed - reactive.speed) * 0.08;
    reactive.impulse *= 0.85;
    reactive.cursorX += (reactive.targetCursorX - reactive.cursorX) * 0.16;
    reactive.cursorY += (reactive.targetCursorY - reactive.cursorY) * 0.16;
    reactive.cursorActive += (reactive.targetCursorActive - reactive.cursorActive) * 0.18;
    reactive.speakingPhase += reactive.mode === 'speaking' ? 0.15 * reactive.pulse : 0.035;
    if (zone) {
      var intensity = reactive.intensity + reactive.impulse * 0.55;
      zone.style.setProperty('--orb-reactive-intensity', String(intensity));
      zone.style.setProperty('--orb-reactive-hue', String(reactive.hue));
      zone.style.setProperty('--orb-reactive-pulse', String(reactive.pulse));
      zone.style.setProperty('--orb-reactive-speed', String(reactive.speed));
      zone.style.setProperty('--orb-speaking-phase', String(reactive.speakingPhase));
      zone.style.setProperty('--stratviz-cursor-x', String(50 + reactive.cursorX * 46));
      zone.style.setProperty('--stratviz-cursor-y', String(44 + reactive.cursorY * 38));
      zone.style.setProperty('--stratviz-cursor-active', String(reactive.cursorActive));
      zone.style.setProperty('--stratviz-tilt-x', String(reactive.cursorY * -2.5 * reactive.cursorActive));
      zone.style.setProperty('--stratviz-tilt-y', String(reactive.cursorX * 3 * reactive.cursorActive));
      var cx = 50 + reactive.cursorX * 46;
      var cy = 44 + reactive.cursorY * 38;
      var beamAngle = Math.atan2(44 - cy, 50 - cx) * (180 / Math.PI);
      zone.style.setProperty('--stratviz-beam-angle', String(beamAngle));
      zone.classList.toggle('stratviz-cursor-on', reactive.cursorActive > 0.05);
      var coordsEl = document.getElementById('stratviz-coords');
      if (coordsEl && reactive.cursorActive > 0.05) {
        coordsEl.textContent = 'X ' + Math.round(50 + reactive.cursorX * 46) +
          ' · Y ' + Math.round(44 + reactive.cursorY * 38);
      }
      var coordX = zone.querySelector('.stratviz-coord-x');
      var coordY = zone.querySelector('.stratviz-coord-y');
      if (coordX) coordX.textContent = String(Math.round(50 + reactive.cursorX * 46));
      if (coordY) coordY.textContent = String(Math.round(44 + reactive.cursorY * 38));
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

  function setCursor(x, y, active) {
    reactive.targetCursorX = Math.max(-1, Math.min(1, x || 0));
    reactive.targetCursorY = Math.max(-1, Math.min(1, y || 0));
    reactive.targetCursorActive = active ? 1 : 0;
  }

  window.HLS = window.HLS || {};
  window.HLS.getOrbReactive = function () {
    return {
      mode: reactive.mode,
      intensity: reactive.intensity + reactive.impulse * 0.55,
      hue: reactive.hue,
      pulse: reactive.pulse,
      speed: reactive.speed,
      sectionId: reactive.sectionId,
      speakingPhase: reactive.speakingPhase,
      cursorX: reactive.cursorX,
      cursorY: reactive.cursorY,
      cursorActive: reactive.cursorActive
    };
  };
  window.HLS.setOrbReactive = function (mode, detail) {
    document.dispatchEvent(new CustomEvent('ai-core:orb', {
      detail: Object.assign({ mode: mode }, detail || {})
    }));
  };
  window.HLS.setStratvizCursor = setCursor;
  window.HLS.setNexusCursor = setCursor;
  window.HLS.orbImpulse = function (amount) {
    reactive.impulse = Math.min(1, reactive.impulse + (amount || 0.35));
    applyDom();
  };

  document.addEventListener('ai-core:orb', onOrbEvent);
  zone = findZone();
  applyDom();
  broadcast();

  function shouldTick() {
    return window.HLS && window.HLS.shouldAnimateHero
      ? window.HLS.shouldAnimateHero()
      : !document.hidden;
  }

  if (window.HLS && window.HLS.raf) {
    window.HLS.raf.add('orb-reactive', tick, { when: shouldTick, skip: 1 });
  } else {
    (function loop() {
      if (shouldTick()) tick(performance.now());
      requestAnimationFrame(loop);
    })();
  }
})();
