/* Mapa interativo de unidades — home "Onde estamos".
   Silhueta do Brasil + SP/MT em destaque, pins com logo por unidade.
   Clique num pin (ou na lista) dá zoom na cidade e mostra o contato.
   Geometria: window.VOCICAL_MAPA (gerado por tools/gerar-mapa.mjs).
   Sem biblioteca: pan/zoom por transform + requestAnimationFrame. */
(function () {
  var V = window.VOCICAL || {};
  var GEO = window.VOCICAL_MAPA;
  var mapa = document.getElementById('mapa');
  var canvas = document.getElementById('mapa-canvas');
  if (!GEO || !mapa || !canvas) return;

  var info = document.getElementById('mapa-info');
  var resetBtn = document.getElementById('mapa-reset');
  var CW = GEO.viewBox.w, CH = GEO.viewBox.h;
  var CTA = V.CTA_URL || '#';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function telHref(t) { return 'tel:+55' + String(t).replace(/\D/g, ''); }

  /* --- monta a lista plana de unidades (com geometria) --------------------- */
  var units = [];
  (V.MARCAS || []).forEach(function (m) {
    (m.unidades || []).forEach(function (u) {
      var g = u.key && GEO.cities[u.key];
      if (!g) return; // sem coordenada não entra no mapa
      units.push({
        key: u.key, x: g.x, y: g.y,
        nome: u.nomeExib || m.nome, marca: m.nome, slug: m.slug, uf: u.uf || m.uf,
        cidade: u.cidade, endereco: u.endereco, telefone: u.telefone, email: u.email,
        logoPin: u.logoPin || m.logo, matriz: !!u.matriz, pendente: !!u.pendente,
        siteExterno: u.siteExterno || m.siteExterno
      });
    });
  });

  /* distância (unid. SVG) até o vizinho mais próximo — governa o tamanho do
     pin para nunca sobrepor o vizinho: pin_i = min(FATOR * nn_i * escala, teto). */
  units.forEach(function (u, i) {
    var best = Infinity;
    units.forEach(function (v, j) {
      if (i === j) return;
      var d = Math.hypot(u.x - v.x, u.y - v.y);
      if (d < best) best = d;
    });
    u.nn = isFinite(best) ? best : 9999;
  });

  /* enquadramento inicial: foco em MT+SP (onde estão as unidades), com o
     Brasil só de contexto ao redor. Centro do aglomerado de cidades
     (x ~434-635, y ~430-708) e largura reduzida p/ os pins ficarem maiores. */
  var HOME = { x: CW * 0.53, y: CH * 0.58, w: CW * 0.47 };
  var ZOOM_W = 190; // largura (unid. SVG) ao focar uma cidade

  /* dimensionamento dos pins (px de tela) */
  var PIN_BASE = 40;   // deve casar com o width base de .mapa__pin-dot
  var PIN_FACTOR = 0.9; // <=1 garante que dois vizinhos não se sobreponham
  var PIN_MIN = 17;    // menor tamanho visível (visão nacional)
  var PIN_MAX = 52;    // maior tamanho legível (zoom próximo)

  /* --- SVG dos estados + pins --------------------------------------------- */
  canvas.style.width = CW + 'px';
  canvas.style.height = CH + 'px';

  var svg = '<svg class="mapa__svg" viewBox="0 0 ' + CW + ' ' + CH + '" ' +
    'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<path class="mapa__silhueta" d="' + GEO.silhueta + '"/>' +
    '<path class="mapa__uf" d="' + GEO.sp + '"/>' +
    '<path class="mapa__uf" d="' + GEO.mt + '"/>' +
    '</svg>';

  var pinsHTML = units.map(function (u, i) {
    var cls = 'mapa__pin' + (u.matriz ? ' mapa__pin--matriz' : '') + (u.pendente ? ' mapa__pin--pendente' : '');
    return '<button type="button" class="' + cls + '" data-i="' + i + '" ' +
      'style="left:' + u.x + 'px;top:' + u.y + 'px" ' +
      'aria-label="' + esc(u.nome + ' — ' + u.cidade + '/' + u.uf) + '">' +
      '<span class="mapa__pin-dot"><img src="' + esc(u.logoPin) + '" alt="" loading="lazy"></span>' +
      '<span class="mapa__pin-label">' + esc(u.cidade) + '</span>' +
      '</button>';
  }).join('');

  canvas.innerHTML = svg + pinsHTML;
  var pins = [].slice.call(canvas.querySelectorAll('.mapa__pin'));

  /* --- painel de contato -------------------------------------------------- */
  function promptInfo() {
    info.classList.remove('is-active');
    info.innerHTML =
      '<p class="mapa__info-prompt">Clique numa unidade no mapa ' +
      'para ver endereço, telefone e e-mail.</p>';
  }

  function fillInfo(u) {
    info.classList.add('is-active');
    var rows = '';
    if (u.siteExterno) {
      rows = '<p class="mapa__info-soon">Esta unidade tem atendimento direto. ' +
        'Fale com a equipe pela página oficial.</p>';
    } else if (u.pendente) {
      rows = '<p class="mapa__info-soon">Unidade em implantação. Contato em breve — ' +
        'fale com a central de vendas do grupo.</p>';
    } else {
      if (u.endereco) rows += row('Endereço', esc(u.endereco));
      if (u.telefone) rows += row('Telefone',
        '<a href="' + telHref(u.telefone) + '">' + esc(u.telefone) + '</a>');
      if (u.email) rows += row('E-mail',
        '<a href="mailto:' + esc(u.email) + '">' + esc(u.email) + '</a>');
    }
    var verMarca, falar;
    if (u.siteExterno) {
      verMarca = '';
      falar = '<a class="btn btn--cta" href="' + esc(u.siteExterno) + '" target="_blank" rel="noopener">Acessar site</a>';
    } else {
      verMarca = '<a class="btn btn--ghost" href="marcas/' + esc(u.slug) + '.html">Ver ' + esc(u.marca) + '</a>';
      falar = '<a class="btn btn--cta" href="' + esc(CTA) + '" target="_blank" rel="noopener">Falar com vendas</a>';
    }

    info.innerHTML =
      '<div class="mapa__info-head">' +
        '<p class="mapa__info-eyebrow">' + esc(u.cidade) + '/' + esc(u.uf) +
          (u.matriz ? ' · Matriz' : '') + '</p>' +
        '<h3 class="mapa__info-name">' + esc(u.nome) + '</h3>' +
      '</div>' +
      '<div class="mapa__info-rows">' + rows + '</div>' +
      '<div class="mapa__info-cta">' + verMarca + falar + '</div>';
  }

  function row(label, val) {
    return '<div class="mapa__info-row">' +
      '<span class="mapa__info-label">' + label + '</span>' +
      '<span class="mapa__info-val">' + val + '</span></div>';
  }

  /* --- engine de zoom (transform translate+scale sobre o canvas) ---------- */
  var cur = { x: HOME.x, y: HOME.y, w: HOME.w };
  var tgt = { x: HOME.x, y: HOME.y, w: HOME.w };
  var raf = null;
  var MIN_W = 90;          // zoom máximo (largura mínima em unid. SVG)
  var MAX_W = CW * 1.02;   // zoom mínimo (Brasil inteiro)

  // escala/translação para um estado {x,y,w}; a translação é presa às bordas
  function computeTransform(st) {
    var vw = mapa.clientWidth, vh = mapa.clientHeight;
    var s = Math.max(vw / st.w, vh / (st.w * 0.82), vw / CW, vh / CH);
    var dispW = CW * s, dispH = CH * s, tx, ty;
    if (dispW <= vw) tx = (vw - dispW) / 2;
    else tx = Math.min(0, Math.max(vw - dispW, vw / 2 - st.x * s));
    if (dispH <= vh) ty = (vh - dispH) / 2;
    else ty = Math.min(0, Math.max(vh - dispH, vh / 2 - st.y * s));
    return { s: s, tx: tx, ty: ty, vw: vw, vh: vh };
  }

  function render() {
    var t = computeTransform(cur);
    if (!t.vw || !t.vh) return;
    canvas.style.transform = 'translate(' + t.tx + 'px,' + t.ty + 'px) scale(' + t.s + ')';
    // cada pin dimensionado pela distância ao vizinho na escala atual:
    // cresce ao aproximar, encolhe ao afastar e não sobrepõe o vizinho.
    // Logos são 1080px nativos: ampliar não pixeliza.
    for (var i = 0; i < pins.length; i++) {
      var diam = clamp(PIN_FACTOR * units[i].nn * t.s, PIN_MIN, PIN_MAX);
      pins[i].style.setProperty('--inv', diam / (PIN_BASE * t.s));
    }
  }

  function frame() {
    var f = 0.16;
    cur.x += (tgt.x - cur.x) * f;
    cur.y += (tgt.y - cur.y) * f;
    cur.w += (tgt.w - cur.w) * f;
    render();
    if (Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.w - cur.w) > 0.6) {
      raf = requestAnimationFrame(frame);
    } else {
      cur.x = tgt.x; cur.y = tgt.y; cur.w = tgt.w; render(); raf = null;
    }
  }

  function animateTo(x, y, w) {
    tgt.x = x; tgt.y = y; tgt.w = w;
    if (reduce) { cur.x = x; cur.y = y; cur.w = w; render(); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  /* --- seleção ------------------------------------------------------------ */
  var activeI = -1;
  function select(i) {
    var u = units[i]; if (!u) return;
    activeI = i;
    pins.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
    fillInfo(u);
    mapa.classList.add('is-selected');
    resetBtn.hidden = false;
    animateTo(u.x, u.y, ZOOM_W);
  }

  function reset() {
    activeI = -1;
    pins.forEach(function (p) { p.classList.remove('is-active'); });
    promptInfo();
    mapa.classList.remove('is-selected');
    resetBtn.hidden = true;
    animateTo(HOME.x, HOME.y, HOME.w);
  }

  var justDragged = false; // suprime o clique do pin quando houve arrasto
  pins.forEach(function (p) {
    p.addEventListener('click', function () {
      if (justDragged) return;
      select(+p.getAttribute('data-i'));
    });
  });
  resetBtn.addEventListener('click', reset);

  /* --- zoom com a roda do mouse (centrado no cursor) ---------------------- */
  function zoomAt(cx, cy, factor) {
    var t = computeTransform(cur);
    var svgX = (cx - t.tx) / t.s, svgY = (cy - t.ty) / t.s; // ponto do mapa sob o cursor
    var wNew = clamp(cur.w * factor, MIN_W, MAX_W);
    if (wNew === cur.w) return;
    var sNew = Math.max(t.vw / wNew, t.vh / (wNew * 0.82), t.vw / CW, t.vh / CH);
    tgt.w = wNew;
    tgt.x = svgX - (cx - t.vw / 2) / sNew; // mantém o ponto sob o cursor fixo
    tgt.y = svgY - (cy - t.vh / 2) / sNew;
    resetBtn.hidden = false; // permite voltar ao Brasil inteiro
    if (reduce) { cur.x = tgt.x; cur.y = tgt.y; cur.w = tgt.w; render(); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  mapa.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = mapa.getBoundingClientRect();
    var factor = e.deltaY > 0 ? 1.12 : 1 / 1.12; // baixo = afasta, cima = aproxima
    zoomAt(e.clientX - r.left, e.clientY - r.top, factor);
  }, { passive: false });

  /* --- arrastar com o mouse (pan) ---------------------------------------- */
  var dragging = false, moved = false, sx = 0, sy = 0, fx = 0, fy = 0, dScale = 1, pid = null;
  mapa.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return; // só mouse
    if (e.target.closest('.mapa__reset')) return;            // não sequestra o botão
    justDragged = false; dragging = true; moved = false; pid = e.pointerId;
    sx = e.clientX; sy = e.clientY; fx = tgt.x; fy = tgt.y;
    dScale = computeTransform(cur).s;
    // NÃO capturar aqui: capturar no pointerdown redireciona o clique do pin
    // para o mapa e a seleção não dispara. Só capturamos ao virar arrasto.
  });
  mapa.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 4) {
      moved = true; resetBtn.hidden = false;
      mapa.classList.add('is-grabbing');
      try { mapa.setPointerCapture(pid); } catch (err) {}
    }
    if (!moved) return;
    tgt.x = fx - dx / dScale; tgt.y = fy - dy / dScale;
    cur.x = tgt.x; cur.y = tgt.y; render(); // 1:1, sem easing durante o arrasto
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    mapa.classList.remove('is-grabbing');
    if (moved) justDragged = true; // impede seleção acidental ao soltar
  }
  mapa.addEventListener('pointerup', endDrag);
  mapa.addEventListener('pointercancel', endDrag);

  var rtimer;
  window.addEventListener('resize', function () {
    clearTimeout(rtimer); rtimer = setTimeout(render, 120);
  });

  /* --- start -------------------------------------------------------------- */
  promptInfo();
  render();
  if (window.__revealObserve) window.__revealObserve();
})();
