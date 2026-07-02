// gerar-mapa.mjs — geometria do mapa de unidades (build-time, roda 1x)
//
// Baixa o GeoJSON oficial dos estados do Brasil, projeta em equiretangular
// para um viewBox fixo, simplifica e emite:
//   - path d da silhueta (27 estados), de SP e de MT (para o HTML)
//   - {x,y} de cada cidade-unidade projetado com a MESMA projecao (para o config.js)
//
// Uso:  node tools/gerar-mapa.mjs
// Saida: tools/mapa-out.json  (+ resumo no console)
//
// Regenerar so e necessario se mudar o conjunto de estados/cidades ou o viewBox.

import { writeFileSync } from 'node:fs';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/main/geojson/br_states.json';

// viewBox alvo (largura fixa; altura calculada pela bbox)
const TARGET_W = 1000;
const PAD = 24;
const LAT_REF = -15; // paralelo de referencia p/ corrigir a largura

// Cidades-unidade (lat, lng conhecidos). key = slug usado no config.js
const CIDADES = [
  { key: 'itu',           lat: -23.2637, lng: -47.2992 },
  { key: 'piracicaba',    lat: -22.7253, lng: -47.6492 },
  { key: 'itapetininga',  lat: -23.5915, lng: -48.0530 },
  { key: 'ribeirao-preto',lat: -21.1775, lng: -47.8103 },
  { key: 'sao-carlos',    lat: -22.0175, lng: -47.8908 },
  { key: 'jales',         lat: -20.2685, lng: -50.5460 },
  { key: 'votuporanga',   lat: -20.4227, lng: -49.9781 },
  { key: 'rio-preto',     lat: -20.8197, lng: -49.3794 },
  { key: 'cuiaba',        lat: -15.6014, lng: -56.0979 },
  { key: 'rondonopolis',  lat: -16.4708, lng: -54.6356 },
  { key: 'sinop',         lat: -11.8604, lng: -55.5024 },
];

const cosRef = Math.cos((LAT_REF * Math.PI) / 180);
// projecao equiretangular (bruta) -> [X, Y]
const proj = (lng, lat) => [lng * cosRef, -lat];

function collectPolys(geom) {
  // retorna array de rings (cada ring = array de [lng,lat])
  if (geom.type === 'Polygon') return geom.coordinates;
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat();
  return [];
}

async function main() {
  console.log('baixando GeoJSON...');
  const res = await fetch(GEOJSON_URL);
  const gj = await res.json();
  const feats = gj.features;

  // 1) bbox em espaco projetado (todos os estados)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const f of feats) {
    for (const ring of collectPolys(f.geometry)) {
      for (const [lng, lat] of ring) {
        const [X, Y] = proj(lng, lat);
        if (X < minX) minX = X; if (X > maxX) maxX = X;
        if (Y < minY) minY = Y; if (Y > maxY) maxY = Y;
      }
    }
  }
  const scale = (TARGET_W - 2 * PAD) / (maxX - minX);
  const W = TARGET_W;
  const H = Math.round((maxY - minY) * scale + 2 * PAD);
  const toPx = (lng, lat) => {
    const [X, Y] = proj(lng, lat);
    return [(X - minX) * scale + PAD, (Y - minY) * scale + PAD];
  };

  // 2) constroi path d de uma feature, simplificando.
  //    tol = distancia minima (px) entre pontos mantidos; dec = casas decimais;
  //    minPts = descarta aneis (ilhotas) menores que isso.
  function featPath(feature, { tol = 1, dec = 1, minPts = 6 } = {}) {
    const k = Math.pow(10, dec);
    let d = '';
    for (const ring of collectPolys(feature.geometry)) {
      const pts = [];
      let last = null;
      for (const [lng, lat] of ring) {
        const [px, py] = toPx(lng, lat);
        const rx = Math.round(px * k) / k, ry = Math.round(py * k) / k;
        if (last && Math.abs(rx - last[0]) < tol && Math.abs(ry - last[1]) < tol) continue;
        pts.push([rx, ry]); last = [rx, ry];
      }
      if (pts.length < minPts) continue; // dropa ilhotas irrelevantes
      d += 'M' + pts.map((p) => p[0] + ' ' + p[1]).join('L') + 'Z';
    }
    return d;
  }

  const byUf = {};
  for (const f of feats) byUf[f.properties.SIGLA] = f;

  // silhueta: coarse (fundo discreto). SP/MT: detalhe fino (protagonistas).
  const silhueta = feats.map((f) => featPath(f, { tol: 2, dec: 0, minPts: 14 })).join('');
  const sp = featPath(byUf.SP, { tol: 1, dec: 1, minPts: 4 });
  const mt = featPath(byUf.MT, { tol: 1, dec: 1, minPts: 4 });

  // 3) cidades projetadas
  const cities = {};
  for (const c of CIDADES) {
    const [x, y] = toPx(c.lng, c.lat);
    cities[c.key] = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }

  const out = { viewBox: { w: W, h: H }, silhueta, sp, mt, cities };

  // arquivo de dados consumido pelo site (js/mapa-geo.js)
  const banner =
    '/* Gerado por tools/gerar-mapa.mjs — NAO editar a mao. Regenerar: node tools/gerar-mapa.mjs */\n';
  const dataFile = new URL('../js/mapa-geo.js', import.meta.url);
  writeFileSync(dataFile, banner + 'window.VOCICAL_MAPA = ' + JSON.stringify(out) + ';\n');

  console.log('viewBox:', W, 'x', H);
  console.log('silhueta chars:', silhueta.length);
  console.log('sp chars:', sp.length, '| mt chars:', mt.length);
  console.log('cidades:');
  for (const c of CIDADES) console.log('  ', c.key.padEnd(16), cities[c.key]);
  console.log('salvo em js/mapa-geo.js');
}

main().catch((e) => { console.error(e); process.exit(1); });
