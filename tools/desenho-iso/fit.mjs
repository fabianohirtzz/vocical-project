import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const SP = path.resolve(process.argv[2]);
const icons = JSON.parse(fs.readFileSync(SP + '/icones-raw.json', 'utf8'));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage();
await p.setContent('<svg id=s xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="640" height="640"><g id=g></g></svg>');
const PAD = 3, MAXK = 1.55, out = {};
for (const [k, v] of Object.entries(icons)) {
  const bb = await p.evaluate(m => { const g = document.getElementById('g'); g.innerHTML = m; const r = g.getBBox(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, v);
  const kk = Math.min((64 - 2 * PAD) / bb.w, (64 - 2 * PAD) / bb.h, MAXK);
  const tx = 32 - kk * (bb.x + bb.w / 2), ty = 32 - kk * (bb.y + bb.h / 2);
  out[k] = `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${kk.toFixed(3)})">${v}</g>`;
}
fs.writeFileSync(SP + '/icones-final.json', JSON.stringify(out));
const cards = Object.entries(out).map(([k, v]) => `<div class="c"><svg viewBox="0 0 64 64">${v}</svg><p>${k}</p></div>`).join('');
fs.writeFileSync(SP + '/icones-preview.html', '<meta charset="utf-8"><style>body{background:#fff;font:600 12px system-ui;margin:0;padding:20px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.c{border:1px solid #e4e4e4;border-radius:12px;padding:10px;text-align:center}svg{width:74px;height:74px;display:block;margin:0 auto;background:rgba(166,3,3,.05);border-radius:12px}p{margin:7px 0 0;color:#666}</style>' + cards);
const pg = await b.newPage({ viewport: { width: 600, height: 560 } });
await pg.goto('file://' + SP + '/icones-preview.html');
await pg.screenshot({ path: SP + '/icones3.png', fullPage: true });
await b.close();
console.log('ok');
