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
  /* animação de zoom mantida mesmo sob reduced-motion (decisão do cliente) */
  var reduce = false;

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
        nome: u.nomeExib || m.nome, marca: m.nome, slug: m.slug, pageSlug: u.pageSlug, uf: u.uf || m.uf,
        cidade: u.cidade, endereco: u.endereco, telefone: u.telefone, email: u.email,
        logoPin: u.logoPin || m.logo, matriz: !!u.matriz, pendente: !!u.pendente,
        siteExterno: u.siteExterno || m.siteExterno
      });
    });
  });

  /* raio de cada pin (unid. SVG). Base = metade da distância ao vizinho mais
     próximo (garante que ninguém sobreponha ninguém). Depois cada pin "cresce"
     para dentro do espaço que os vizinhos menores deixam livre — só cresce,
     nunca encolhe, então nenhum fica menor que a base e unidades agrupadas
     (ex.: SP) aproveitam o máximo de tamanho possível sem sobrepor. */
  var RCAP = 46; // teto de raio em unid. SVG (pin isolado, ex.: Sinop)
  units.forEach(function (u, i) {
    var best = Infinity;
    units.forEach(function (v, j) {
      if (i === j) return;
      var d = Math.hypot(u.x - v.x, u.y - v.y);
      if (d < best) best = d;
    });
    u.rSvg = Math.min(isFinite(best) ? best / 2 : RCAP, RCAP);
  });
  for (var pass = 0; pass < 80; pass++) {
    for (var a = 0; a < units.length; a++) {
      var lim = RCAP;
      for (var b = 0; b < units.length; b++) {
        if (a === b) continue;
        var dd = Math.hypot(units[a].x - units[b].x, units[a].y - units[b].y);
        if (dd - units[b].rSvg < lim) lim = dd - units[b].rSvg;
      }
      if (lim > units[a].rSvg) units[a].rSvg = lim; // só cresce
    }
  }

  /* enquadramento inicial: foco em MT+SP (onde estão as unidades), com o
     Brasil só de contexto ao redor. Centro do aglomerado de cidades
     (x ~434-635, y ~430-708) e largura reduzida p/ os pins ficarem maiores. */
  var HOME = { x: CW * 0.53, y: CH * 0.58, w: CW * 0.47 };
  var ZOOM_W = 190; // largura (unid. SVG) ao focar uma cidade

  /* dimensionamento dos pins (px de tela) */
  var PIN_BASE = 40;   // deve casar com o width base de .mapa__pin-dot
  var PIN_GAP = 0.94;  // <1: folga entre vizinhos que se tocam (respiro visual)
  var PIN_MIN = 17;    // menor tamanho visível (visão nacional)
  var PIN_MAX = 54;    // maior tamanho legível (zoom próximo)

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
      verMarca = '<a class="btn btn--ghost" href="marcas/' + esc(u.pageSlug || u.slug) + '.html">Ver ' + esc(u.marca) + '</a>';
      falar = '<a class="btn btn--cta" href="' + esc(CTA) + '" data-cta target="_blank" rel="noopener">Falar com vendas</a>';
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
      var diam = clamp(2 * units[i].rSvg * PIN_GAP * t.s, PIN_MIN, PIN_MAX);
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
  var isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)');
  function select(i) {
    var u = units[i]; if (!u) return;
    activeI = i;
    pins.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
    fillInfo(u);
    mapa.classList.add('is-selected');
    resetBtn.hidden = false;
    animateTo(u.x, u.y, ZOOM_W);
    syncTouchAction();
    // no mobile o painel de contato fica abaixo do mapa: traz à vista ao selecionar
    if (isMobile && isMobile.matches) {
      requestAnimationFrame(function () {
        try { info.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } catch (err) {}
      });
    }
  }

  function reset() {
    activeI = -1;
    pins.forEach(function (p) { p.classList.remove('is-active'); });
    promptInfo();
    mapa.classList.remove('is-selected');
    resetBtn.hidden = true;
    animateTo(HOME.x, HOME.y, HOME.w);
    syncTouchAction();
  }

  /* --- seleção por clique/tap num pin ------------------------------------ */
  var justDragged = false; // suprime o clique do pin logo após arrasto/pinch
  pins.forEach(function (p) {
    p.addEventListener('click', function () {
      if (justDragged) return;
      select(+p.getAttribute('data-i'));
    });
  });
  resetBtn.addEventListener('click', reset);

  /* Engaja o mapa: quando há unidade selecionada ou zoom além do "home",
     1 dedo passa a ARRASTAR o mapa (touch-action:none). No home, 1 dedo ROLA
     a página (touch-action:pan-y, sem prender o scroll) e 2 dedos dão pinch. */
  function isEngaged() { return activeI >= 0 || tgt.w < HOME.w - 1; }
  function syncTouchAction() { mapa.style.touchAction = isEngaged() ? 'none' : 'pan-y'; }

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
    syncTouchAction();
    if (reduce) { cur.x = tgt.x; cur.y = tgt.y; cur.w = tgt.w; render(); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  mapa.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = mapa.getBoundingClientRect();
    var factor = e.deltaY > 0 ? 1.12 : 1 / 1.12; // baixo = afasta, cima = aproxima
    zoomAt(e.clientX - r.left, e.clientY - r.top, factor);
  }, { passive: false });

  /* --- gestos unificados: mouse e toque no mesmo modelo -------------------
     1 ponteiro = arrasta (pan) e, parado, seleciona ao soltar (tap).
     2 dedos    = pinch (zoom) + pan ancorados no centro dos dedos.
     No home, 1 dedo rola a página; ao dar zoom/selecionar, passa a arrastar. */
  var pointers = new Map();
  var panStart = null;   // {sx,sy,fx,fy,scale} do pan de 1 ponteiro
  var pinchPrev = null;  // {d,cx,cy} do frame anterior do pinch
  var moved = false;
  function ptsArr() { var a = []; pointers.forEach(function (v) { a.push(v); }); return a; }
  function startPan(x, y) {
    var t = computeTransform(cur);
    panStart = { sx: x, sy: y, fx: tgt.x, fy: tgt.y, scale: t.s };
  }

  mapa.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.mapa__reset')) return;        // não sequestra o botão
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      moved = false; justDragged = false; pinchPrev = null;
      startPan(e.clientX, e.clientY);
    } else if (pointers.size === 2) {
      moved = true; pinchPrev = null; panStart = null;   // pinch não seleciona ao soltar
      resetBtn.hidden = false;
    }
  });

  mapa.addEventListener('pointermove', function (e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size >= 2) {                              // --- pinch (2 dedos) ---
      if (e.cancelable) e.preventDefault();
      var p = ptsArr();
      var dx = p[0].x - p[1].x, dy = p[0].y - p[1].y;
      var d = Math.hypot(dx, dy) || 1;
      var r = mapa.getBoundingClientRect();
      var cx = (p[0].x + p[1].x) / 2 - r.left;
      var cy = (p[0].y + p[1].y) / 2 - r.top;
      if (pinchPrev) {
        var t = computeTransform(cur);
        var wNew = clamp(cur.w * (pinchPrev.d / d), MIN_W, MAX_W);
        var sNew = Math.max(t.vw / wNew, t.vh / (wNew * 0.82), t.vw / CW, t.vh / CH);
        // ponto do mapa sob o centro dos dedos no frame anterior, reancorado ao
        // novo centro: produz pan + zoom naturais num só passo.
        var svgX = (pinchPrev.cx - t.tx) / t.s, svgY = (pinchPrev.cy - t.ty) / t.s;
        cur.w = wNew;
        cur.x = svgX - (cx - t.vw / 2) / sNew;
        cur.y = svgY - (cy - t.vh / 2) / sNew;
        tgt.x = cur.x; tgt.y = cur.y; tgt.w = cur.w;
        render(); syncTouchAction();
      }
      pinchPrev = { d: d, cx: cx, cy: cy };
      return;
    }

    if (!panStart) return;                                // --- pan (1 ponteiro) ---
    if (e.pointerType !== 'mouse' && !isEngaged()) return; // no home: deixa a página rolar
    var mx = e.clientX - panStart.sx, my = e.clientY - panStart.sy;
    if (!moved && Math.abs(mx) + Math.abs(my) > 6) {
      moved = true; resetBtn.hidden = false;
      mapa.classList.add('is-grabbing');
      try { mapa.setPointerCapture(e.pointerId); } catch (err) {}
    }
    if (!moved) return;
    if (e.cancelable) e.preventDefault();
    tgt.x = panStart.fx - mx / panStart.scale;
    tgt.y = panStart.fy - my / panStart.scale;
    cur.x = tgt.x; cur.y = tgt.y; render(); // 1:1, sem easing durante o arrasto
  }, { passive: false });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size === 1) {            // saiu do pinch p/ 1 dedo: retoma o pan nele
      var only = ptsArr()[0];
      startPan(only.x, only.y);
      pinchPrev = null;
    } else if (pointers.size === 0) {
      if (moved) justDragged = true;      // impede seleção acidental ao soltar
      mapa.classList.remove('is-grabbing');
      panStart = null; pinchPrev = null;
      syncTouchAction();
    }
  }
  mapa.addEventListener('pointerup', endPointer);
  mapa.addEventListener('pointercancel', endPointer);

  var rtimer;
  window.addEventListener('resize', function () {
    clearTimeout(rtimer); rtimer = setTimeout(function () { render(); syncTouchAction(); }, 120);
  });

  /* --- start -------------------------------------------------------------- */
  // hint por dispositivo: no toque não há "clique" nem roda do mouse
  var hint = document.getElementById('mapa-hint');
  if (hint && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    hint.textContent = 'Toque numa unidade · arraste e pince para dar zoom';
  }
  promptInfo();
  render();
  syncTouchAction();
  if (window.__revealObserve) window.__revealObserve();
})();
