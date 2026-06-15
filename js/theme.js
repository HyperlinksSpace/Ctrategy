(function () {
  'use strict';

  function isLightTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function getThemePreference() {
    return document.documentElement.getAttribute('data-theme') || 'system';
  }

  window.HLS = window.HLS || {};
  window.HLS.isLightTheme = isLightTheme;
  window.HLS.isDarkTheme = function () { return !isLightTheme(); };
  window.HLS.getThemePreference = getThemePreference;
})();
