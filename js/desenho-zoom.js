/* Visualizador dos desenhos tecnicos das LPs de campanha.

   No mobile o desenho aparece inteiro na tela, com a legenda numerada embaixo em
   vez de texto minusculo dentro da figura. Quem quiser ler no detalhe toca em
   "Ampliar o desenho" e abre aqui: o desenho entra em tela cheia, com os rotulos
   de volta, e a pessoa move com o dedo e da zoom com dois dedos.
   Sem dependencia: o SVG e clonado do proprio HTML, que ja tem tudo.

   Versao generica, para servir a qualquer LP. Opera em [data-zoom] e aceita tanto
   os atributos [data-zoom-abrir] / [data-zoom-area] quanto as classes das LPs que
   ja existem. E a evolucao do js/drywall-zoom.js, que atende so a LP de drywall.
   Ver docs/playbook-lp-campanha.md. */
(function () {
  var alvos = [].slice.call(document.querySelectorAll('[data-zoom]'));
  if (!alvos.length) return;

  var SEL_ABRIR = '[data-zoom-abrir], .tg-esq__zoom, .dw-esq__zoom';
  var SEL_AREA = '[data-zoom-area], .tg-esquema__scroll, .dw-esquema__scroll';

  var raiz = null, palco = null, titulo = null, aberto = null;
  var esc = 1, tx = 0, ty = 0;                 // estado da transformacao
  var MIN = 1, MAX = 8;
  var ponteiros = {};                          // id -> {x,y}
  var pinca = null;                            // {dist, esc, cx, cy, tx, ty}

  function monta() {
    if (raiz) return;
    raiz = document.createElement('div');
    raiz.className = 'dwz';
    raiz.setAttribute('role', 'dialog');
    raiz.setAttribute('aria-modal', 'true');
    raiz.hidden = true;
    raiz.innerHTML =
      '<div class="dwz__bar">' +
        '<p class="dwz__t"></p>' +
        '<div class="dwz__acoes">' +
          '<button class="dwz__b" type="button" data-acao="menos" aria-label="Diminuir o zoom">&minus;</button>' +
          '<button class="dwz__b" type="button" data-acao="mais" aria-label="Aumentar o zoom">+</button>' +
          '<button class="dwz__b dwz__b--x" type="button" data-acao="fechar" aria-label="Fechar">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="dwz__area"><div class="dwz__palco"></div></div>' +
      '<p class="dwz__dica">Arraste para mover, use dois dedos para aproximar</p>';
    document.body.appendChild(raiz);
    palco = raiz.querySelector('.dwz__palco');
    titulo = raiz.querySelector('.dwz__t');

    raiz.querySelector('.dwz__acoes').addEventListener('click', function (e) {
      var b = e.target.closest('[data-acao]'); if (!b) return;
      var a = b.getAttribute('data-acao');
      if (a === 'fechar') fecha();
      else zoomNoCentro(a === 'mais' ? 1.6 : 1 / 1.6);
    });

    var area = raiz.querySelector('.dwz__area');
    area.addEventListener('pointerdown', function (e) {
      area.setPointerCapture(e.pointerId);
      ponteiros[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ponteiros);
      if (ids.length === 2) {
        var a = ponteiros[ids[0]], b = ponteiros[ids[1]];
        pinca = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, esc: esc,
                  cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, tx: tx, ty: ty };
      }
      raiz.classList.add('is-arrastando');
    });
    area.addEventListener('pointermove', function (e) {
      var p = ponteiros[e.pointerId]; if (!p) return;
      var ids = Object.keys(ponteiros);
      if (ids.length >= 2 && pinca) {
        ponteiros[e.pointerId] = { x: e.clientX, y: e.clientY };
        var a = ponteiros[ids[0]], b = ponteiros[ids[1]];
        var d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        aplica(pinca.esc * (d / pinca.dist), pinca.tx, pinca.ty);
      } else {
        tx += e.clientX - p.x; ty += e.clientY - p.y;
        ponteiros[e.pointerId] = { x: e.clientX, y: e.clientY };
        aplica(esc, tx, ty);
      }
    });
    function solta(e) {
      delete ponteiros[e.pointerId];
      if (Object.keys(ponteiros).length < 2) pinca = null;
      if (!Object.keys(ponteiros).length) raiz.classList.remove('is-arrastando');
    }
    area.addEventListener('pointerup', solta);
    area.addEventListener('pointercancel', solta);
    area.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomNoCentro(e.deltaY < 0 ? 1.15 : 1 / 1.15);
    }, { passive: false });
    area.addEventListener('dblclick', function () { zoomNoCentro(esc > 1.5 ? 1 / esc : 2.5); });

    document.addEventListener('keydown', function (e) {
      if (raiz.hidden) return;
      if (e.key === 'Escape') fecha();
      if (e.key === '+' || e.key === '=') zoomNoCentro(1.4);
      if (e.key === '-') zoomNoCentro(1 / 1.4);
    });
  }

  /* limita o arrasto ao que de fato saiu da tela, senao o desenho some do campo */
  function aplica(novaEsc, novoTx, novoTy) {
    esc = Math.min(MAX, Math.max(MIN, novaEsc));
    var r = palco.getBoundingClientRect();
    var folgaX = Math.max(0, (r.width * esc - r.width) / 2);
    var folgaY = Math.max(0, (r.height * esc - r.height) / 2);
    tx = Math.min(folgaX, Math.max(-folgaX, novoTx));
    ty = Math.min(folgaY, Math.max(-folgaY, novoTy));
    palco.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + esc.toFixed(3) + ')';
  }

  function zoomNoCentro(fator) { aplica(esc * fator, tx * fator, ty * fator); }

  function abre(fig) {
    monta();
    var svg = fig.querySelector('svg');
    if (!svg) return;
    var copia = svg.cloneNode(true);
    if (svg.getAttribute('data-vb')) copia.setAttribute('viewBox', svg.getAttribute('data-vb'));
    copia.removeAttribute('width'); copia.removeAttribute('height');
    copia.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    palco.innerHTML = '';
    palco.appendChild(copia);
    var t = fig.querySelector('figcaption');
    titulo.textContent = t ? t.textContent.trim().split('.')[0] + '.' : 'Desenho técnico';
    raiz.setAttribute('aria-label', titulo.textContent);
    aberto = document.activeElement;
    esc = 1; tx = 0; ty = 0; aplica(1, 0, 0);
    raiz.hidden = false;
    document.body.classList.add('dwz-open');
    raiz.querySelector('[data-acao="fechar"]').focus();
  }

  function fecha() {
    if (!raiz || raiz.hidden) return;
    raiz.hidden = true;
    document.body.classList.remove('dwz-open');
    palco.innerHTML = '';
    if (aberto && aberto.focus) aberto.focus();
  }

  /* No mobile os rotulos saem da figura e sobra muito branco em volta do desenho.
     Aqui o viewBox e reapertado no que de fato ficou visivel (getBBox ignora o que
     esta em display:none), entao o desenho ocupa a largura inteira do card. */
  function enquadra() {
    alvos.forEach(function (fig) {
      var svg = fig.querySelector('svg'); if (!svg) return;
      if (!svg.getAttribute('data-vb')) svg.setAttribute('data-vb', svg.getAttribute('viewBox'));
      var original = svg.getAttribute('data-vb');
      svg.setAttribute('viewBox', original);
      if (window.innerWidth > 760) return;
      try {
        var bb = svg.getBBox(), m = 8;
        if (!bb.width || !bb.height) return;
        svg.setAttribute('viewBox', [bb.x - m, bb.y - m, bb.width + 2 * m, bb.height + 2 * m]
          .map(function (n) { return n.toFixed(1); }).join(' '));
      } catch (e) { /* enquadramento nunca pode derrubar a pagina */ }
    });
  }
  enquadra();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(enquadra, 180); });

  alvos.forEach(function (fig) {
    var b = fig.querySelector(SEL_ABRIR);
    if (b) b.addEventListener('click', function () { abre(fig); });
    var area = fig.querySelector(SEL_AREA);
    if (area) area.addEventListener('click', function () { abre(fig); });
  });
})();
