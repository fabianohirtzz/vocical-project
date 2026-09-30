/* Encaixa a pilula de fundo de cada rotulo no texto de verdade.

   O cena.py emite a pilula com a largura estimada pela contagem de caracteres,
   que erra para mais em palavra estreita e para menos em palavra larga.

   A medida tem que ser feita na PAGINA SERVIDA, nao num HTML solto: a Archivo
   so carrega por http, e medir com a fonte de fallback do sistema dava pilula
   com 35px de sobra de um lado e 7 do outro, porque o texto de fallback e mais
   largo e, com text-anchor "end", a diferenca toda cai num lado so.

   Sobe um servidor na raiz do repositorio antes de rodar:
     python3 -m http.server 8787 --bind 127.0.0.1
     node tools/desenho-iso/ajusta-rotulos.mjs

   Roda depois de qualquer regeneracao dos desenhos, porque ele corrige o HTML
   ja injetado, e nao o JSON de geometria.
*/
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
import path from 'path';

const RAIZ = path.dirname(path.dirname(path.dirname(new URL(import.meta.url).pathname)));
const BASE = 'http://127.0.0.1:8787/';
const PAD_X = 7.5, PAD_Y = 4.5, RX = 7;

const PAGINAS = [
  { arquivo: 'campaigns-robracon-drywall/index.html', pre: 'dw' },
  { arquivo: 'campaigns-robracon-telha-galvalume/index.html', pre: 'tg' },
];

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-proxy-server'],
});

let total = 0;
for (const { arquivo, pre } of PAGINAS) {
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto(BASE + path.dirname(arquivo) + '/', { waitUntil: 'networkidle' }).catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);

  const medidas = await p.evaluate(({ pre, padX, padY, rx }) => {
    const out = [];
    document.querySelectorAll(`.${pre}-esquema svg g.${pre}-esq__lbl`).forEach(g => {
      const t = g.querySelector('text');
      const r = g.querySelector('rect[data-fit]');
      if (!t || !r) return;
      const bb = t.getBBox();
      out.push({
        x: (bb.x - padX).toFixed(1), y: (bb.y - padY).toFixed(1),
        w: (bb.width + 2 * padX).toFixed(1), h: (bb.height + 2 * padY).toFixed(1),
        rx, texto: t.textContent,
      });
    });
    return out;
  }, { pre, padX: PAD_X, padY: PAD_Y, rx: RX });
  await p.close();

  // troca cada <rect data-fit ...> na ordem em que aparece, por indice
  const caminho = path.join(RAIZ, arquivo);
  let html = fs.readFileSync(caminho, 'utf8');
  let i = 0, pos = 0;
  for (const m of medidas) {
    const ini = html.indexOf('<rect data-fit="1"', pos);
    if (ini === -1) { console.error('  ERRO: faltou rect para', m.texto); process.exit(1); }
    // a tag pode estar auto-fechada (<rect/>) ou aberta (<rect></rect>): o primeiro
    // ajuste passou pelo serializador do navegador, que troca uma forma pela outra
    const fim = html.indexOf('>', ini) + 1;
    const autoFecha = html[fim - 2] === '/';
    const novo = `<rect data-fit="1" x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" `
               + `rx="${m.rx}" fill="#ffffff" fill-opacity="0.90"${autoFecha ? '/>' : '>'}`;
    html = html.slice(0, ini) + novo + html.slice(fim);
    pos = ini + novo.length;
    i++;
  }
  fs.writeFileSync(caminho, html);
  console.log(`  ${arquivo}: ${i} pilulas encaixadas`);
  total += i;
}
await b.close();
console.log('total:', total, 'rotulos');
