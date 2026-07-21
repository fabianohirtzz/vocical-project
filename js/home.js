/* Renderiza grids data-driven da home a partir de window.VOCICAL. */
(function () {
  var V = window.VOCICAL || {};

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* SVG de canto côncavo (notch) que solda a aba/pino na superfície do card. */
  function corner(cls) {
    return '<svg class="ucard__corner ' + cls + '" viewBox="0 0 30 30" width="30" height="30" aria-hidden="true">' +
      '<path d="M30 0A30 30 0 0 1 0 30H30Z"/></svg>';
  }

  /* Ordem fixa das unidades na home (1 card por unidade, não por marca).
     Cada item aponta para uma unidade dentro de uma marca de V.MARCAS. O cliente
     pediu 1 card por unidade porque, no card multi-cidade, ninguém achava o
     seletor de troca de unidade. Distribuidoras: ordem livre entre si. */
  var UNIDADES_ORDEM = [
    ['vocical', 'votuporanga'],
    ['jacical', 'jales'],
    ['ello-forte', 'sao-carlos'],
    ['ello-forte', 'ribeirao-preto'],
    ['robracon', 'rondonopolis'],
    ['robracon', 'cuiaba'],
    ['robracon', 'sinop'],
    ['distribuidoras', 'itu'],
    ['distribuidoras', 'piracicaba'],
    ['distribuidoras', 'itapetininga'],
    ['rp-cimento-cal', 'rio-preto']
  ];

  /* Resolve a ordem acima numa lista plana { marca, unidade } válida. */
  function unidadesFlat() {
    var marcas = V.MARCAS || [];
    var byMarca = {};
    marcas.forEach(function (m) { byMarca[m.slug] = m; });
    var out = [];
    UNIDADES_ORDEM.forEach(function (par) {
      var m = byMarca[par[0]]; if (!m) return;
      var u = (m.unidades || []).filter(function (x) { return x.key === par[1]; })[0];
      if (u) out.push({ marca: m, u: u });
    });
    return out;
  }

  /* Grade de unidades (cutout cards): 1 card por unidade, foto da fachada + badges.
     UF no pino (sup. dir.), cidade na aba (inf. esq.). Sem seletor de troca. */
  function renderUnidadesCards() {
    var el = document.getElementById('unidades-cards'); if (!el) return;
    var lista = unidadesFlat();

    el.innerHTML = lista.map(function (it, i) {
      var m = it.marca, u = it.u;
      var nome = u.nomeExib || m.nome;
      var foto = u.fachada || m.fachada || m.capaFoto || 'Imagens/back1.jpg';
      var externo = u.siteExterno || m.siteExterno;
      var addr = '<p class="ucard__addr"' + (u.endereco ? '' : ' hidden') + '>' + esc(u.endereco || '') + '</p>';
      var logo = m.logo || '';

      return '<article class="ucard" data-reveal="up" style="transition-delay:' + (i % 3) * 90 + 'ms"' +
        ' data-slug="' + esc(m.slug) + '">' +
        '<div class="ucard__media">' +
          '<img class="ucard__img" src="' + foto + '" alt="Fachada da unidade ' + esc(nome) + ' em ' + esc(u.cidade || '') + '" loading="lazy">' +
          '<span class="ucard__overlay" aria-hidden="true"></span>' +
          '<span class="ucard__pin"><span class="ucard__uf">' + esc(u.uf || m.uf || '') + '</span>' +
            corner('ucard__corner--pin-l') + corner('ucard__corner--pin-b') +
          '</span>' +
          '<span class="ucard__tab"><span class="ucard__chip is-active">' + esc(u.cidade) + '</span>' +
            corner('ucard__corner--tab-r') + corner('ucard__corner--tab-t') +
          '</span>' +
        '</div>' +
        '<div class="ucard__body">' +
          '<h3 class="ucard__title">' + esc(nome) + '</h3>' +
          addr +
          '<div class="ucard__foot">' +
            '<span class="ucard__brand">' +
              '<span class="ucard__logo">' + (logo ? '<img src="' + logo + '" alt="" loading="lazy">' : '') + '</span>' +
              '<span class="ucard__bname">' + esc(nome) + '</span>' +
            '</span>' +
            (externo
              ? '<a class="ucard__cta" href="' + esc(externo) + '" target="_blank" rel="noopener">Acessar site</a>'
              : '<a class="ucard__cta" href="marcas/' + esc(u.pageSlug || m.slug) + '.html">Ver unidade</a>') +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* Dados da seção "Quem atendemos" (segmentos de cliente). Mesmo layout de
     "O que distribuímos", só muda o conteúdo. */
  var SEGMENTOS = [
    { nome: 'Lojas de material de construção', img: 'Imagens/loja-de-materiais-de-construcao.png', desc: 'Reposição de giro e mix completo para a loja não perder venda.' },
    { nome: 'Construtoras e incorporadoras', img: 'Imagens/construtoras-e-incorporadoras.png', desc: 'Aço, cimento e fechamento com prazo previsível para o cronograma da obra.' },
    { nome: 'Serralherias', img: 'Imagens/serralheria.png', desc: 'Perfis, chapas, tubos e vergalhão para a produção do dia a dia.' },
    { nome: 'Calheiros', img: 'Imagens/calheiros.png', desc: 'Bobinas e chapas para calhas, rufos e coberturas metálicas sob medida.' },
    { nome: 'Gesseiros', img: 'Imagens/gesseiros.jpg', desc: 'Drywall, perfis e acessórios para forro e parede com pronta entrega.' },
    { nome: 'Indústrias', img: 'Imagens/industrias.png', desc: 'Aço e materiais em volume para linhas de produção e manutenção.' },
    { nome: 'Agronegócio', img: 'Imagens/agronegocio.png', desc: 'Arame, telhas e materiais para construções e estruturas rurais.' }
  ];

  /* Atributos de link de um item: href + (opcional) data-cta que faz o lead.js
     abrir o modal do Vico (segmentos), ou navegação normal (categorias). */
  function slideLink(it) {
    return ' href="' + esc(it.href || '#') + '"' + (it.data ? ' data-cta target="_blank" rel="noopener"' : '');
  }

  /* Slideshow reutilizável (lista à esquerda + imagem à direita + carrossel mobile).
     cfg: { gridId, items:[{nome,img,desc,href,data}], goLabel, mobileCta:{label,href,data} } */
  function buildSlideshow(cfg) {
    var el = document.getElementById(cfg.gridId); if (!el) return;
    var items = cfg.items || [];
    var section = el.closest('.section') || document;

    var list = items.map(function (c, i) {
      return '<button type="button" class="slide-nav__item' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' +
        '<span class="slide-nav__bar" aria-hidden="true"></span>' +
        '<span class="slide-nav__txt">' + esc(c.nome) + '</span>' +
      '</button>';
    }).join('');

    var media = items.map(function (c, i) {
      return '<figure class="slide' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' +
        '<img class="slide__img" src="' + c.img + '" alt="' + esc(c.nome) + '" loading="lazy">' +
        '<span class="slide__scrim" aria-hidden="true"></span>' +
        '<figcaption class="slide__cap">' +
          '<span class="slide__desc">' + esc(c.desc || '') + '</span>' +
          '<a class="slide__go"' + slideLink(c) + '>' + esc(cfg.goLabel) + ' &rarr;</a>' +
        '</figcaption>' +
      '</figure>';
    }).join('');

    el.innerHTML =
      '<div class="slide-left"><div class="slide-nav" role="tablist">' + list + '</div></div>' +
      '<div class="slide-media">' + media + '</div>';

    // move o CTA para o fim da coluna esquerda (escopado à própria seção)
    var cta = section.querySelector('.produtos__cta');
    if (cta) el.querySelector('.slide-left').appendChild(cta);

    // ---- Carrossel mobile: cada item = quadrado arredondado com imagem
    //      e overlay do título; setas abaixo para deslizar. (só aparece no mobile) ----
    var mc = cfg.mobileCta || {};
    var mcards = items.map(function (c) {
      return '<a class="prod-cat"' + slideLink(c) + '>' +
        '<img class="prod-cat__img" src="' + c.img + '" alt="' + esc(c.nome) + '" loading="lazy">' +
        '<span class="prod-cat__scrim" aria-hidden="true"></span>' +
        '<span class="prod-cat__title">' + esc(c.nome) + '</span>' +
      '</a>';
    }).join('');
    var mob = document.createElement('div');
    mob.className = 'prod-cats';
    mob.innerHTML =
      '<div class="prod-cats__viewport"><div class="prod-cats__track">' + mcards + '</div></div>' +
      '<div class="prod-cats__nav">' +
        '<button class="prod-cats__arrow" type="button" data-dir="-1" aria-label="Anterior">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button class="prod-cats__arrow" type="button" data-dir="1" aria-label="Próximo">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '</div>' +
      '<a class="btn btn--dark prod-cats__cta"' + (' href="' + esc(mc.href || '#') + '"' + (mc.data ? ' data-cta target="_blank" rel="noopener"' : '')) + '>' + esc(mc.label || '') + '</a>';
    el.parentNode.insertBefore(mob, el.nextSibling);

    var vp  = mob.querySelector('.prod-cats__viewport');
    var trk = mob.querySelector('.prod-cats__track');
    var mCards = [].slice.call(trk.querySelectorAll('.prod-cat'));
    var mIdx = 0;
    // centraliza o cartão i na viewport (pedaços dos vizinhos aparecem dos lados)
    function centerCat(i, smooth) {
      mIdx = Math.max(0, Math.min(mCards.length - 1, i));
      var card = mCards[mIdx]; if (!card) return;
      var left = card.offsetLeft - (vp.clientWidth - card.offsetWidth) / 2;
      vp.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
    }
    [].forEach.call(mob.querySelectorAll('.prod-cats__arrow'), function (btn) {
      btn.addEventListener('click', function () {
        centerCat(mIdx + (+btn.getAttribute('data-dir')), true);
      });
    });
    // mantém o índice sincronizado quando o usuário arrasta com o dedo
    var stimer;
    vp.addEventListener('scroll', function () {
      clearTimeout(stimer);
      stimer = setTimeout(function () {
        var mid = vp.scrollLeft + vp.clientWidth / 2, best = 0, bestD = Infinity;
        mCards.forEach(function (c, ci) {
          var d = Math.abs((c.offsetLeft + c.offsetWidth / 2) - mid);
          if (d < bestD) { bestD = d; best = ci; }
        });
        mIdx = best;
      }, 90);
    }, { passive: true });
    // ao montar, já deixa o primeiro cartão centralizado (não colado à esquerda)
    requestAnimationFrame(function () { centerCat(0, false); });

    var items = [].slice.call(el.querySelectorAll('.slide-nav__item'));
    var figs  = [].slice.call(el.querySelectorAll('.slide'));
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    function setActive(i) {
      items.forEach(function (x, ix) { x.classList.toggle('is-active', ix === i); });
      figs.forEach(function (x, ix) { x.classList.toggle('is-active', ix === i); });
    }
    items.forEach(function (it, i) {
      if (canHover) it.addEventListener('pointerenter', function () { setActive(i); });
      it.addEventListener('click', function () { setActive(i); });
      it.addEventListener('focus', function () { setActive(i); });
    });
  }

  /* "Quem atendemos" — segmentos de cliente (abre o Vico). */
  function renderAtende() {
    var url = V.CTA_URL || '#';
    var segs = SEGMENTOS.map(function (s) {
      return { nome: s.nome, img: s.img, desc: s.desc, href: url, data: true };
    });
    buildSlideshow({
      gridId: 'atende-grid', items: segs, goLabel: 'Fale conosco',
      mobileCta: { label: 'Fale com um consultor', href: url, data: true }
    });
  }

  function renderParceiros() {
    var el = document.getElementById('parceiros-grid'); if (!el) return;
    var items = (V.PARCEIROS || []).map(function (p) {
      return '<div class="parceiro"><img src="' + p.logo + '" alt="' + p.nome + '" loading="lazy"></div>';
    }).join('');
    // cópia da trilha p/ loop sem emenda; aria-hidden p/ não duplicar no leitor de tela
    var dup = (V.PARCEIROS || []).map(function (p) {
      return '<div class="parceiro" aria-hidden="true"><img src="' + p.logo + '" alt="" loading="lazy"></div>';
    }).join('');
    el.innerHTML = items + dup;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderUnidadesCards(); renderAtende(); renderParceiros();
    // "Onde estamos" agora é o mapa interativo (js/mapa.js)
    // re-observa reveals criados dinamicamente
    if (window.__revealObserve) window.__revealObserve();
  });
})();
