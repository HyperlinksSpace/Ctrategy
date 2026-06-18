import fs from 'fs';
import vm from 'vm';

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('js/i18n.js', 'utf8'), sandbox);
const trans = sandbox.window.HLS_I18N.en;
let html = fs.readFileSync('index.html', 'utf8');
let n = 0;

function escKey(key) {
  return key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const [key, val] of Object.entries(trans)) {
  const esc = val.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const re1 = new RegExp('(data-i18n="' + escKey(key) + '")([^>]*>)([^<]*)<', 'g');
  html = html.replace(re1, (m, a, b) => { n++; return a + b + esc + '<'; });
  const re2 = new RegExp('(data-i18n-placeholder="' + escKey(key) + '" placeholder=")([^"]*)(")', 'g');
  html = html.replace(re2, () => { n++; return '$1' + esc.replace(/"/g, '&quot;') + '$3'; });
  const re3 = new RegExp('(data-i18n-aria="' + escKey(key) + '" aria-label=")([^"]*)(")', 'g');
  html = html.replace(re3, () => { n++; return '$1' + esc.replace(/"/g, '&quot;') + '$3'; });
}

html = html.replace('<span class="stat-value">93</span>', '<span class="stat-value">96</span>');
html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Hyperlinks Space — strategic plan for industrial and space coordination (2026–2040)">');
html = html.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Strategic plan for a protocol layer from factory floor to lunar orbit">');
fs.writeFileSync('index.html', html);
console.log('updated', n, 'bindings');
