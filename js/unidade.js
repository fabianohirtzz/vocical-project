/* Landing de unidade — renderiza a partir de body[data-unidade].
   Depende de config.js, unidades-data.js, catalogo.js. As páginas vivem em
   /<slug-cidade-uf>/ e usam data-base="../".

   ESTE É O TEMPLATE ÚNICO das 7 unidades. O layout é o da Robracon Rondonópolis,
   que foi desenhada de ponta a ponta para servir de modelo: hero com dois cards
   inclinados, "sobre" em vermelho, portfólio em abas, segmentos em carrossel,
   serviços, diferenciais, galeria, atuação, FAQ e contato com mapa.
   Estilos em css/unidade.css (obrigatório na página) + css/pages.css.

   body[data-landing] deixa o CTA preso na própria página (#vico-open), para a
   landing de campanha. */
(function () {
  var V = window.VOCICAL || {}, CAT = window.CATALOGO || [];
  var U = (window.UNIDADES || {})[document.body.getAttribute('data-unidade')];
  if (!U) return;
  var m = (V.MARCAS || []).filter(function (x) { return x.slug === U.marcaSlug; })[0] || {};
  var u = (m.unidades || []).filter(function (x) { return x.key === U.unidadeKey; })[0] || {};
  var base = document.documentElement.getAttribute('data-base') || '';
  var LANDING = document.body.hasAttribute('data-landing');

  function p(path) { return path ? base + path : path; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function telHref(t) { return 'tel:+55' + (t || '').replace(/\D/g, ''); }
  function cidadeUf() { return esc(u.cidade) + (u.uf ? '/' + esc(u.uf) : ''); }
  function nomeUnidade() { return esc(u.nomeExib || m.nome || ''); }
  /* CTA: na landing nunca sai da página; nas demais o cta.js/lead.js assume. */
  function ctaAttrs() {
    return LANDING ? ' href="#vico-open" data-cta'
                   : ' data-cta target="_blank" rel="noopener"';
  }

  /* ---------- tabelas compartilhadas ----------
     Os dados por unidade guardam segmentos/serviços como texto. A imagem e o
     apoio vêm daqui, por palavra-chave, para não duplicar acervo por unidade. */
  var SEG_INFO = [
    { k: ['lojist', 'revend', 'loja'], img: 'Imagens/loja-de-materiais-de-construcao.png',
      d: 'Reposição de giro e mix amplo para a loja não perder venda.' },
    { k: ['construtora', 'empreiteir', 'incorporad'], img: 'Imagens/construtoras-e-incorporadoras.png',
      d: 'Aço, cimento e fechamento com prazo previsível para o cronograma da obra.' },
    { k: ['serralh', 'metal'], img: 'Imagens/serralheria.png',
      d: 'Perfis, chapas, tubos e corte e dobra sob medida para a produção do dia a dia.' },
    { k: ['indúst', 'indust', 'estrutura'], img: 'Imagens/industrias.png',
      d: 'Aço, chapas e telhas em volume para galpões, linhas de produção e manutenção.' },
    { k: ['gess', 'drywall'], img: 'Imagens/gesseiros.jpg',
      d: 'Linha completa de drywall: placas, perfis e acessórios com pronta entrega.' },
    { k: ['agro', 'rural'], img: 'Imagens/agronegocio.png',
      d: 'Aço, telhas e materiais para construções e estruturas rurais.' },
    { k: ['calheir', 'cobertura'], img: 'Imagens/calheiros.png',
      d: 'Bobinas e chapas para calhas, rufos e coberturas metálicas sob medida.' },
    { k: ['profissiona', 'pedreir'], img: 'Imagens/servicos1.jpg',
      d: 'Atendimento de balcão com apoio técnico na hora de escolher o material.' },
    { k: ['consumidor', 'cliente final'], img: 'Imagens/contato.jpg',
      d: 'Compra direta no distribuidor, com retirada ou entrega combinada.' }
  ];
  var SERV_IMG = [
    { k: ['vergalh', 'armado'], img: 'Imagens/corte-e-dobra-de-vergalhao.png' },
    { k: ['chapa'],             img: 'Imagens/Robracon ROO/corte-dobra-chapa.png' },
    { k: ['laser', 'plasma'],   img: 'Imagens/Robracon ROO/corte-laser.png' },
    { k: ['telha', 'cobertura'],img: 'Imagens/Produtos/telha-termoacustica.jpg' },
    { k: ['drywall', 'gesso'],  img: 'Imagens/drywall.jpg' },
    { k: ['fornecimento', 'entrega', 'abastec'], img: 'Imagens/REVENDAS.jpg' }
  ];
  function acha(tabela, texto) {
    var t = String(texto || '').toLowerCase();
    for (var i = 0; i < tabela.length; i++) {
      for (var j = 0; j < tabela[i].k.length; j++) {
        if (t.indexOf(tabela[i].k[j]) !== -1) return tabela[i];
      }
    }
    return null;
  }
  /* Acervo de fotos da unidade, sem repetir: fachada, sobre e galeria.
     Unidades com acervo curto (ex.: São Carlos, só 3 arquivos) precisam disso,
     senão os dois cards da hero saem com a MESMA imagem. */
  var FOTOS = (function () {
    var out = [], vistos = {};
    [u.fachada, U.sobre && U.sobre.foto].concat(U.galeria || []).forEach(function (f) {
      if (f && !vistos[f]) { vistos[f] = 1; out.push(f); }
    });
    return out;
  })();
  /* Sem correspondência numa tabela, usa foto da própria unidade. */
  function fotoDaUnidade(i) {
    return FOTOS.length ? FOTOS[i % FOTOS.length] : '';
  }

  var ICONES = [
    '<path d="M4 4h16v4H4z"/><path d="M4 12h16v8H4z"/><path d="M9 12v8"/><path d="M15 12v8"/>',
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M3 9h9"/><path d="M3 15h9"/>',
    '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/>',
    '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  ];
  function icone(i) {
    return '<span class="feat__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      ICONES[i % ICONES.length] + '</svg></span>';
  }

  /* ---------- 1. Hero (dois cards inclinados) ---------- */
  function hero() {
    var stats = (U.numeros || []).map(function (n) {
      return '<div class="rr3-stat"><span class="rr3-stat__num">' + esc(n.n) + esc(n.suf || '') +
        '</span><span class="rr3-stat__label">' + esc(n.label) + '</span></div>';
    }).join('');
    var logo = u.logoPin ? '<img class="rr3-card__logo" src="' + p(u.logoPin) + '" alt="" aria-hidden="true">' : '';
    /* frente = fachada (a foto de identidade); fundo = a próxima disponível. */
    var frente = u.fachada || FOTOS[0] || '';
    var fundo = FOTOS.filter(function (f) { return f !== frente; })[0] || frente;
    return '<section class="rr3-hero">' +
      '<div class="rr3-hero__grid" aria-hidden="true"></div>' +
      '<div class="rr3-inner">' +
        '<div class="rr3-left">' +
          '<h1 class="rr3-title rr3-rise rr3-rise--1">' + (U.hero && U.hero.h1 || nomeUnidade()) + '</h1>' +
          '<div class="rr3-bar rr3-rise rr3-rise--2"></div>' +
          '<p class="rr3-sub rr3-rise rr3-rise--2">' + esc(U.hero && U.hero.lede || '') + '</p>' +
          '<div class="rr3-actions rr3-rise rr3-rise--3">' +
            '<a class="btn btn--cta btn--lg" id="un-hero-cta"' + ctaAttrs() + '>Peça seu orçamento</a>' +
          '</div>' +
          (stats ? '<div class="rr3-stats rr3-rise rr3-rise--4">' + stats + '</div>' : '') +
        '</div>' +
        '<div class="rr3-right"><div class="rr3-cards" id="rr3-cards">' +
          '<div class="rr3-card rr3-card--back"><img src="' + p(fundo) + '" alt="Operação interna da ' +
            nomeUnidade() + ' em ' + cidadeUf() + '" loading="eager">' + logo + '</div>' +
          '<div class="rr3-card rr3-card--front"><img src="' + p(frente) + '" alt="Fachada da ' +
            nomeUnidade() + ' em ' + cidadeUf() + '" loading="eager" fetchpriority="high">' + logo + '</div>' +
        '</div></div>' +
      '</div></section>';
  }

  /* ---------- 2. Sobre (superfície vermelha, foto à esquerda) ---------- */
  function sobre() {
    var s = U.sobre; if (!s) return '';
    return '<section class="section sobre surface--red"><div class="container sobre__grid">' +
      '<div class="sobre__media" data-reveal="left"><img src="' + p(s.foto) + '" alt="' +
        esc(s.fotoAlt || ('Estrutura da ' + nomeUnidade())) + '" loading="lazy"></div>' +
      '<div class="sobre__text" data-reveal="right">' +
        '<span class="kicker">A unidade</span><h2>' + (s.titulo || '') + '</h2>' +
        (s.paras || []).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('') +
      '</div></div></section>';
  }

  /* ---------- 3. Portfólio em abas (catálogo filtrado pela unidade) ---------- */
  function catsDaUnidade() {
    var ids = U.categorias || [];
    return CAT.filter(function (c) { return ids.indexOf(c.slug) !== -1; });
  }
  function portfolio() {
    if (!catsDaUnidade().length) return '';
    return '<section class="section surface--paper mesh rr-cat" id="produtos"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">Portfólio</span>' +
      '<h2 class="display--mass">O que a unidade <span class="accent">distribui</span></h2>' +
      '<p class="lede">' + esc(U.categoriasNota ||
        'Selecione uma linha. A disponibilidade pode variar por estoque.') + '</p></div>' +
      '<div data-reveal><div class="rr-cnav" id="rr-cnav" role="tablist" aria-label="Linhas de produto"></div>' +
      '<div class="rr-cpanels" id="rr-cpanels"></div></div></div></section>';
  }

  /* ---------- 4. Quem atendemos (carrossel image-expansion) ---------- */
  function segmentos() {
    var segs = U.segmentos || []; if (!segs.length) return '';
    var cards = segs.map(function (nome, i) {
      var info = acha(SEG_INFO, nome);
      var img = info ? info.img : fotoDaUnidade(i);
      var desc = info ? info.d : 'Atendimento consultivo e fornecimento conforme a necessidade.';
      return '<article class="ie__card">' +
        '<img class="ie__img" src="' + p(img) + '" alt="' + esc(nome) + '" loading="lazy">' +
        '<span class="ie__scrim" aria-hidden="true"></span>' +
        '<span class="ie__badge"><span class="ie__badge-dot" aria-hidden="true"></span>Segmentos</span>' +
        '<div class="ie__cardfoot"><h3 class="ie__cardtitle">' + esc(nome) + '</h3>' +
        '<p class="ie__carddesc">' + esc(desc) + '</p>' +
        '<a class="ie__btn"' + ctaAttrs() + '>Fale conosco</a></div></article>';
    }).join('');
    return '<section class="section surface--white quem-atende">' +
      '<div class="container"><div class="sec-head" data-reveal><span class="kicker">Quem atendemos</span>' +
      '<h2>Parceria com quem <span class="accent">revende, produz e constrói</span></h2></div></div>' +
      '<div class="container" data-reveal><div class="ie" id="ie">' +
        '<div class="ie__bar"><span class="ie__tab">Segmentos atendidos</span>' +
        '<a class="ie__all" href="#produtos">Ver a linha completa <span aria-hidden="true">›</span></a></div>' +
        '<div class="ie__viewport"><div class="ie__track" id="ie-track">' + cards + '</div></div>' +
        '<div class="ie__foot"><div class="ie__dots" id="ie-dots"></div><div class="ie__nav">' +
          '<button class="ie__arrow" id="ie-prev" type="button" aria-label="Anterior">‹</button>' +
          '<button class="ie__arrow" id="ie-next" type="button" aria-label="Próximo">›</button>' +
        '</div></div></div></div></section>';
  }

  /* ---------- 5. Serviços ---------- */
  function servicos() {
    var sv = U.servicos || []; if (!sv.length) return '';
    var cards = sv.map(function (s, i) {
      // título primeiro: a descrição costuma citar várias linhas ("do cimento ao
      // drywall") e puxaria a imagem errada.
      var info = acha(SERV_IMG, s.t) || acha(SERV_IMG, s.d || '');
      var img = info ? info.img : fotoDaUnidade(i + 2);
      return '<article class="servico" data-reveal>' +
        '<div class="servico__img"><img src="' + p(img) + '" alt="' + esc(s.t) + ' em ' + cidadeUf() +
        '" loading="lazy"></div><h3>' + esc(s.t) + '</h3><p class="muted">' + esc(s.d) + '</p></article>';
    }).join('');
    return '<section class="section surface--dark grain servicos"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">Serviços sob medida</span>' +
      '<h2>Peças e soluções conforme o seu <span class="accent">projeto</span></h2></div>' +
      '<div class="grid servicos__grid">' + cards + '</div></div></section>';
  }

  /* ---------- 6. Diferenciais ---------- */
  function diferenciais() {
    var d = U.diferenciais || []; if (!d.length) return '';
    var cards = d.map(function (x, i) {
      return '<article class="feat" data-reveal>' + icone(i) + '<h3>' + esc(x) + '</h3></article>';
    }).join('');
    return '<section class="section surface--paper"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">Por que a ' + nomeUnidade() + '</span>' +
      '<h2>O que faz a diferença aqui</h2></div>' +
      '<div class="grid feat-grid">' + cards + '</div></div></section>';
  }

  /* ---------- 7. Galeria ---------- */
  function galeria() {
    var g = U.galeria || []; if (!g.length) return '';
    var itens = g.map(function (src, i) {
      return '<div class="u-gal__item' + (i === 0 ? ' u-gal__item--wide' : '') + '">' +
        '<img src="' + p(src) + '" alt="Estrutura e operação da ' + nomeUnidade() + ' em ' +
        cidadeUf() + '" loading="lazy"></div>';
    }).join('');
    return '<section class="section surface--dark grain"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">A unidade por dentro</span>' +
      '<h2>Estrutura, estoque e <span class="accent">operação</span></h2></div>' +
      '<div class="u-gal" data-reveal>' + itens + '</div></div></section>';
  }

  /* ---------- 8. Atuação e logística ---------- */
  function atuacao() {
    var a = U.atuacao; if (!a) return '';
    var tags = [esc(u.cidade), 'Região de ' + esc(u.cidade)]
      .concat((U.segmentos || []).slice(0, 2).map(esc))
      .map(function (t) { return '<li>' + t + '</li>'; }).join('');
    return '<section class="section surface--red mesh"><div class="container u-atuacao__grid">' +
      '<div data-reveal="left"><span class="kicker">Área de atuação</span>' +
        '<h2>' + esc(u.cidade) + ' e <span class="accent">região</span></h2>' +
        '<p class="lede" style="color:rgba(255,255,255,.9)">' + esc(a.texto) + '</p>' +
        '<ul class="u-atuacao__tags">' + tags + '</ul>' +
        (a.frota ? '<p class="u-frota">' + esc(a.frota) + '</p>' : '') +
      '</div>' +
      '<div class="u-atuacao__card" data-reveal="right"><h3>Atendimento B2B consultivo</h3>' +
        '<p>Apoio no quantitativo, alternativas de produto e orçamento técnico rápido para lojistas, ' +
        'construtoras, indústrias e órgãos públicos. Entrega programada conforme o cronograma combinado.</p>' +
      '</div></div></section>';
  }

  /* ---------- 9. FAQ ---------- */
  function faq() {
    var f = U.faq || []; if (!f.length) return '';
    var itens = f.map(function (x) {
      return '<div class="u-faq__item"><button class="u-faq__q" type="button">' + esc(x.q) +
        '</button><div class="u-faq__a"><p>' + esc(x.a) + '</p></div></div>';
    }).join('');
    return '<section class="section surface--paper"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">Perguntas frequentes</span>' +
      '<h2>Dúvidas sobre a <span class="accent">unidade</span></h2></div>' +
      '<div class="u-faq" data-reveal>' + itens + '</div></div></section>';
  }

  /* ---------- 10. Contato + como chegar ---------- */
  function contato() {
    var end = [u.endereco, u.cidade && (u.cidade + (u.uf ? '/' + u.uf : ''))].filter(Boolean).join(', ');
    var q = encodeURIComponent(end);
    var legal = U.razaoSocial
      ? '<p class="u-legal">' + esc(U.razaoSocial) + (U.cnpj ? ' · CNPJ ' + esc(U.cnpj) : '') +
        ' · Unidade do Grupo Vocical.</p>'
      : '';
    var linhas =
      (end ? '<li><span>Endereço</span><a href="https://www.google.com/maps/search/?api=1&query=' + q +
             '" target="_blank" rel="noopener">' + esc(end) + '</a></li>' : '') +
      (u.telefone ? '<li><span>Telefone</span><a href="' + telHref(u.telefone) + '">' + esc(u.telefone) + '</a></li>' : '') +
      (u.email ? '<li><span>E-mail</span><a href="mailto:' + esc(u.email) + '">' + esc(u.email) + '</a></li>' : '');
    /* Mapa por endereço, não por coordenada: nem toda unidade tem lat/lng. */
    var mapa = end ? '<div class="u-mapa" data-reveal><p class="kicker u-mapa__label">Como chegar</p>' +
      '<div class="u-mapa__canvas"><iframe title="Mapa da localização da ' + nomeUnidade() + ', ' + esc(end) +
      '" src="https://maps.google.com/maps?q=' + q + '&hl=pt-BR&z=15&output=embed" loading="lazy" ' +
      'referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
      '<a class="btn btn--cta u-mapa__route" href="https://www.google.com/maps/dir/?api=1&destination=' + q +
      '" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Traçar rota</a>' +
      '</div></div>' : '';
    return '<section class="section surface--white"><div class="container">' +
      '<div class="sec-head" data-reveal><span class="kicker">Contato</span>' +
      '<h2>Fale com a <span class="accent">' + nomeUnidade() + ' ' + esc(u.cidade) + '</span></h2></div>' +
      '<div class="u-contato__grid"><ul class="ct-list" data-reveal>' + linhas + '</ul>' +
      '<div data-reveal><p class="lede">Precisa de material ou de um orçamento técnico? ' +
      'O time da unidade responde rápido e com atendimento consultivo.</p>' +
      '<a class="btn btn--cta btn--lg" id="un-contato-cta"' + ctaAttrs() + ' style="margin-top:1.6rem">' +
      '<span class="btn__ic" aria-hidden="true">›</span> Pedir orçamento</a>' + legal + '</div></div>' +
      mapa + '</div></section>';
  }

  /* ---------- monta a página ---------- */
  var alvo = document.getElementById('un-root') || document.getElementById('conteudo');
  if (!alvo) return;
  alvo.innerHTML = hero() + sobre() + portfolio() + segmentos() + servicos() +
                   diferenciais() + galeria() + atuacao() + faq() + contato();

  /* ---------- comportamentos ---------- */
  /* Abas do portfólio, montadas do catálogo filtrado. */
  var nav = document.getElementById('rr-cnav');
  var panels = document.getElementById('rr-cpanels');
  if (nav && panels) {
    catsDaUnidade().forEach(function (c, i) {
      var tab = document.createElement('button');
      tab.type = 'button'; tab.className = 'rr-ctab' + (i === 0 ? ' is-active' : '');
      tab.setAttribute('role', 'tab'); tab.dataset.i = i; tab.textContent = c.nome;
      nav.appendChild(tab);
      var cards = (c.itens || []).map(function (it) {
        return '<article class="rr-prod">' +
          '<div class="rr-prod__media"><img src="' + p(it.img) + '" alt="' + esc(it.nome) + '" loading="lazy"></div>' +
          '<div class="rr-prod__body"><h3 class="rr-prod__name">' + esc(it.nome) + '</h3>' +
          '<p class="rr-prod__desc">' + esc(it.desc) + '</p></div></article>';
      }).join('');
      var panel = document.createElement('div');
      panel.className = 'rr-cpanel' + (i === 0 ? ' is-active' : ''); panel.dataset.i = i;
      panel.innerHTML = '<div class="rr-grid">' + cards + '</div>' +
        '<div class="rr-cpanel__foot"><p class="rr-cpanel__note">' + esc(c.nome) +
        ' — disponibilidade pode variar por estoque.</p>' +
        '<a class="btn btn--cta rr-cat__cta"' + ctaAttrs() + '><span class="btn__ic" aria-hidden="true">›</span> ' +
        'Pedir orçamento de ' + esc(c.nome.toLowerCase()) + '</a></div>';
      panels.appendChild(panel);
    });

    var tabs = [].slice.call(nav.querySelectorAll('.rr-ctab'));
    var todos = [].slice.call(panels.querySelectorAll('.rr-cpanel'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var i = +t.dataset.i;
        tabs.forEach(function (x) { x.classList.toggle('is-active', +x.dataset.i === i); });
        todos.forEach(function (pn) { pn.classList.toggle('is-active', +pn.dataset.i === i); });
        if (nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({ left: Math.max(0, t.offsetLeft - (nav.clientWidth - t.offsetWidth) / 2), behavior: 'smooth' });
        }
      });
    });
    /* Abas em UMA linha: reduz --rr-fs até caber; abaixo do piso vira scroller. */
    var rootEl = document.documentElement;
    function fitTabs() {
      var max = parseFloat(getComputedStyle(rootEl).fontSize) * 1.3, min = 15;
      var fs = max, guard = 80;
      nav.style.setProperty('--rr-fs', fs + 'px');
      while (nav.scrollWidth > nav.clientWidth + 1 && fs > min && guard-- > 0) {
        fs -= 0.5; nav.style.setProperty('--rr-fs', fs + 'px');
      }
    }
    var frt;
    window.addEventListener('resize', function () { clearTimeout(frt); frt = setTimeout(fitTabs, 120); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitTabs); }
    fitTabs();
  }

  /* Entrada dos cards da hero. */
  var cardsHero = document.getElementById('rr3-cards');
  if (cardsHero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { cardsHero.classList.add('is-in'); });
    });
  }

  /* FAQ acordeão. */
  [].forEach.call(document.querySelectorAll('.u-faq__q'), function (q) {
    q.addEventListener('click', function () { q.parentElement.classList.toggle('is-open'); });
  });

  /* Segmentos — carrossel image-expansion (mesmo comportamento da home). */
  (function () {
    var track = document.getElementById('ie-track');
    if (!track) return;
    var viewport = track.parentElement;
    var cards = [].slice.call(track.children);
    if (!cards.length) return;
    var prev = document.getElementById('ie-prev');
    var next = document.getElementById('ie-next');
    var dotsWrap = document.getElementById('ie-dots');
    var index = 0, maxIndex = 0, step = 0;
    function gap() { var cs = getComputedStyle(track); return parseFloat(cs.columnGap || cs.gap) || 0; }
    function apply() {
      track.style.transform = 'translateX(' + (-index * step) + 'px)';
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex;
      if (dotsWrap) [].forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('is-on', i === index); });
    }
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex; i++) {
        var d = document.createElement('button');
        d.type = 'button'; d.className = 'ie__dot';
        d.setAttribute('aria-label', 'Grupo ' + (i + 1));
        (function (n) { d.addEventListener('click', function () { index = n; apply(); }); })(i);
        dotsWrap.appendChild(d);
      }
    }
    function measure() {
      var g = gap();
      var cw = cards[0].getBoundingClientRect().width;
      var vp = viewport.getBoundingClientRect().width;
      step = cw + g;
      var perView = Math.max(1, Math.round((vp + g) / step));
      maxIndex = Math.max(0, cards.length - perView);
      if (index > maxIndex) index = maxIndex;
      buildDots(); apply();
    }
    if (prev) prev.addEventListener('click', function () { if (index > 0) { index--; apply(); } });
    if (next) next.addEventListener('click', function () { if (index < maxIndex) { index++; apply(); } });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 150); });
    requestAnimationFrame(measure);
  })();

  if (window.__revealObserve) window.__revealObserve();
})();
