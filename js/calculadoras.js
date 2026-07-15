/* Calculadoras de aço — Grupo Vocical.
   Fórmulas de engenharia (padrão, determinísticas). Atualização ao vivo.
   Depende de config.js apenas para o CTA_URL dos botões "Peça seu orçamento". */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function num(el) {
    if (!el) return 0;
    var s = String(el.value).trim();
    if (!s) return 0;
    // Se há vírgula, ela é o decimal e o ponto é milhar (pt-BR: 1.234,56).
    // Sem vírgula, o ponto é o decimal (campos type=number: 1.5).
    if (s.indexOf(',') > -1) { s = s.replace(/\./g, '').replace(',', '.'); }
    var v = parseFloat(s);
    return isFinite(v) ? v : 0;
  }
  function fmt(n, dec) {
    if (!isFinite(n)) n = 0;
    if (dec == null) dec = 2;
    return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function out(root, key) { return root.querySelector('[data-out="' + key + '"]'); }
  function set(root, key, val) { var e = out(root, key); if (e) e.textContent = val; }

  /* ---------- formatos de seção (peso e área) ---------- */
  var SHAPES = {
    redonda:  { label: 'Barra redonda / vergalhão', dims: [{ k: 'd', l: 'Diâmetro Ø (mm)' }],
                area: function (v) { return Math.PI / 4 * v.d * v.d; } },
    quadrada: { label: 'Barra quadrada', dims: [{ k: 'a', l: 'Lado (mm)' }],
                area: function (v) { return v.a * v.a; } },
    chata:    { label: 'Barra chata', dims: [{ k: 'b', l: 'Largura (mm)' }, { k: 'e', l: 'Espessura (mm)' }],
                area: function (v) { return v.b * v.e; } },
    chapa:    { label: 'Chapa', dims: [{ k: 'b', l: 'Largura (mm)' }, { k: 'e', l: 'Espessura (mm)' }],
                area: function (v) { return v.b * v.e; } },
    tuboR:    { label: 'Tubo redondo', dims: [{ k: 'D', l: 'Ø externo (mm)' }, { k: 't', l: 'Parede (mm)' }],
                area: function (v) { var i = v.D - 2 * v.t; if (i < 0) i = 0; return Math.PI / 4 * (v.D * v.D - i * i); } },
    tuboQ:    { label: 'Tubo quadrado (metalon)', dims: [{ k: 'L', l: 'Lado (mm)' }, { k: 't', l: 'Parede (mm)' }],
                area: function (v) { var i = v.L - 2 * v.t; if (i < 0) i = 0; return v.L * v.L - i * i; } }
  };
  function fieldHTML(k, l, val) {
    return '<div class="field"><label>' + l + '</label>' +
      '<input type="number" min="0" step="any" inputmode="decimal" data-k="' + k + '"' +
      (val != null ? ' value="' + val + '"' : '') + '></div>';
  }
  function readDims(root) {
    var v = {};
    root.querySelectorAll('[data-k]').forEach(function (i) { v[i.getAttribute('data-k')] = num(i); });
    return v;
  }
  // valores iniciais amigáveis por formato (para o preview já mostrar número)
  var SEED = { d: 10, a: 20, b: 50, e: 6.35, D: 50, t: 2, L: 50 };

  /* ---------- 1. Peso teórico ---------- */
  function initPeso() {
    var root = document.getElementById('calc-peso'); if (!root) return;
    var shapeSel = root.querySelector('[data-shape]');
    var dimWrap = root.querySelector('[data-dims]');
    var matSel = root.querySelector('[data-mat]');
    var lenEl = root.querySelector('[data-len]');
    var qtyEl = root.querySelector('[data-qty]');

    function compute() {
      var s = SHAPES[shapeSel.value];
      var A = s.area(readDims(root));               // mm²
      var dens = parseFloat(matSel.value) || 7850;  // kg/m³
      var kgm = A * 1e-6 * dens;                     // kg por metro
      var peca = kgm * num(lenEl);
      var total = peca * (num(qtyEl) || 0);
      set(root, 'total', fmt(total, 2));
      set(root, 'kgm', fmt(kgm, 3));
      set(root, 'peca', fmt(peca, 2));
    }
    function buildDims() {
      var s = SHAPES[shapeSel.value];
      dimWrap.innerHTML = s.dims.map(function (d) { return fieldHTML(d.k, d.l, SEED[d.k]); }).join('');
      compute();
    }
    shapeSel.addEventListener('change', buildDims);
    root.addEventListener('input', compute);
    buildDims();
  }

  /* ---------- 2. Conversor polegada ↔ mm ---------- */
  function initConversor() {
    var root = document.getElementById('calc-conversor'); if (!root) return;
    var inEl = root.querySelector('[data-in]');
    var mmEl = root.querySelector('[data-mm]');
    var IN = 25.4;
    var lock = false;
    inEl.addEventListener('input', function () {
      if (lock) return; lock = true;
      mmEl.value = inEl.value === '' ? '' : fmt(num(inEl) * IN, 2);
      lock = false;
    });
    mmEl.addEventListener('input', function () {
      if (lock) return; lock = true;
      inEl.value = mmEl.value === '' ? '' : fmt(num(mmEl) / IN, 4);
      lock = false;
    });
    root.querySelectorAll('[data-frac]').forEach(function (c) {
      c.addEventListener('click', function () {
        var pol = parseFloat(c.getAttribute('data-frac'));
        inEl.value = fmt(pol, 4).replace(/0+$/, '').replace(/,$/, '');
        mmEl.value = fmt(pol * IN, 2);
      });
    });
    // seed
    inEl.value = '1'; mmEl.value = fmt(IN, 2);
  }

  /* ---------- 3. Área de seção ---------- */
  function initArea() {
    var root = document.getElementById('calc-area'); if (!root) return;
    var shapeSel = root.querySelector('[data-shape]');
    var dimWrap = root.querySelector('[data-dims]');

    function compute() {
      var s = SHAPES[shapeSel.value];
      var mm2 = s.area(readDims(root));
      set(root, 'cm2', fmt(mm2 / 100, 2));
      set(root, 'mm2', fmt(mm2, 1));
    }
    function buildDims() {
      var s = SHAPES[shapeSel.value];
      dimWrap.innerHTML = s.dims.map(function (d) { return fieldHTML(d.k, d.l, SEED[d.k]); }).join('');
      compute();
    }
    shapeSel.addEventListener('change', buildDims);
    root.addEventListener('input', compute);
    buildDims();
  }

  /* ---------- 4. Quantidade de aço (taxa de armadura) ---------- */
  // Taxas típicas de consumo de aço por m³ de concreto (kg/m³), com faixa.
  // Taxas usuais de consumo de aço por m³ de concreto (kg/m³), com faixa.
  // Base: superestrutura (laje+viga+pilar) ~100 kg/m³; infraestrutura (sapata) ~40 kg/m³.
  var TAXA = {
    laje:    { nome: 'Laje maciça',       min: 70,  ref: 80,  max: 100 },
    viga:    { nome: 'Viga',              min: 90,  ref: 110, max: 130 },
    pilar:   { nome: 'Pilar',             min: 100, ref: 120, max: 150 },
    sapata:  { nome: 'Sapata / fundação', min: 40,  ref: 50,  max: 70 },
    radier:  { nome: 'Radier',            min: 70,  ref: 85,  max: 100 }
  };
  function initArmadura() {
    var root = document.getElementById('calc-armadura'); if (!root) return;
    var elemSel = root.querySelector('[data-elem]');
    var volEl = root.querySelector('[data-vol]');
    function compute() {
      var t = TAXA[elemSel.value] || TAXA.laje;
      var vol = num(volEl);
      set(root, 'kg', fmt(vol * t.ref, 1));
      set(root, 'faixa', fmt(vol * t.min, 0) + ' a ' + fmt(vol * t.max, 0) + ' kg');
      set(root, 'taxa', fmt(t.ref, 0) + ' kg/m³');
    }
    elemSel.addEventListener('change', compute);
    root.addEventListener('input', compute);
    compute();
  }

  /* ---------- 5. Economia com corte e dobra ---------- */
  var PERDA_CD = 1; // perda típica no corte e dobra industrializado (%) — fontes: < 1%
  function initCorteDobra() {
    var root = document.getElementById('calc-corte-dobra'); if (!root) return;
    var pesoEl = root.querySelector('[data-peso]');
    var perdaEl = root.querySelector('[data-perda]');
    var precoEl = root.querySelector('[data-preco]');
    function compute() {
      var peso = num(pesoEl);
      var perdaObra = num(perdaEl);
      if (perdaObra < PERDA_CD) perdaObra = PERDA_CD;
      var evitada = peso * (perdaObra - PERDA_CD) / 100;   // kg de perda evitada
      var preco = num(precoEl);
      set(root, 'kg', fmt(evitada, 1));
      set(root, 'reais', preco > 0 ? 'R$ ' + fmt(evitada * preco, 2) : '—');
      set(root, 'perdacd', fmt(peso * PERDA_CD / 100, 1) + ' kg');
    }
    root.addEventListener('input', compute);
    compute();
  }

  /* ---------- 6. Espaçadores / consumo em laje ---------- */
  // Consumo linear de espaçador por m² de laje/radier (metros por m²).
  // Base: treliça convencional ~1,66 m/m²; espaçador tipo W ~0,85 m/m².
  function initEspacadores() {
    var root = document.getElementById('calc-espacadores'); if (!root) return;
    var areaEl = root.querySelector('[data-area]');
    var tipoEl = root.querySelector('[data-tipo]');
    function compute() {
      var area = num(areaEl);
      var taxa = parseFloat(tipoEl.value) || 0;   // m lineares por m²
      set(root, 'ml', fmt(area * taxa, 1));
      set(root, 'area', fmt(area, 2) + ' m²');
      set(root, 'taxa', fmt(taxa, 2) + ' m/m²');
    }
    tipoEl.addEventListener('change', compute);
    root.addEventListener('input', compute);
    compute();
  }

  /* ---------- CTAs "Peça seu orçamento" ---------- */
  function wireCTAs() {
    var url = (window.VOCICAL || {}).CTA_URL || '#';
    document.querySelectorAll('[data-cta]').forEach(function (a) { a.href = url; });
  }

  /* ---------- Altura do menu -> --catnav-h (hero cabe em 100dvh) ---------- */
  function setCatnavH() {
    var nav = document.querySelector('.cat-nav');
    if (nav) document.documentElement.style.setProperty('--catnav-h', nav.offsetHeight + 'px');
  }

  /* ---------- Índice: marca a calculadora ativa no scroll ---------- */
  function initNavSpy() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.cat-tab'));
    if (!tabs.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          tabs.forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    tabs.forEach(function (t) {
      var b = document.getElementById(t.getAttribute('href').slice(1));
      if (b) io.observe(b);
    });
  }

  /* ---------- Header direcional: some ao descer, nav cola no topo ----------
     Mesma lógica da página de Produtos (keyed em .cat-nav; CSS em pages.css). */
  function initHeaderScroll() {
    if (!document.querySelector('.cat-nav')) return;
    var THRESH = 6, TOP_ZONE = 120;
    var last = window.scrollY || 0, ticking = false;
    function update() {
      var y = window.scrollY || 0, diff = y - last;
      if (Math.abs(diff) > THRESH) {
        if (diff > 0 && y > TOP_ZONE) document.body.classList.add('hdr-hidden');
        else document.body.classList.remove('hdr-hidden');
        last = y;
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPeso();
    initConversor();
    initArea();
    initArmadura();
    initCorteDobra();
    initEspacadores();
    wireCTAs();
    initNavSpy();
    initHeaderScroll();
    setCatnavH();
    window.addEventListener('resize', setCatnavH, { passive: true });
    if (window.__revealObserve) window.__revealObserve();
  });
})();
