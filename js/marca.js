/* Renderiza uma página de marca a partir de body[data-marca] + window.VOCICAL/CATALOGO.
   Páginas em /marcas/ usam data-base="../". Depende de config.js, marcas-data.js, catalogo.js. */
(function () {
  var V = window.VOCICAL || {};
  var CAT = window.CATALOGO || [];
  var slug = document.body.getAttribute('data-marca');
  var m = (V.MARCAS || []).filter(function (x) { return x.slug === slug; })[0];
  if (!m) return;

  var base = document.documentElement.getAttribute('data-base') || '';
  function p(path) { return path ? base + path : path; }
  function telLink(t) { return 'https://wa.me/' + ('55' + t.replace(/\D/g, '')); }

  function hero() {
    var cidades = (m.unidades || []).map(function (u) { return u.cidade + '/' + u.uf; }).join(' · ');
    return '<section class="mk-hero surface--dark grain">' +
      '<div class="mk-hero__bg"><img src="' + p(m.capaFoto || 'Imagens/back2.jpg') + '" alt="" aria-hidden="true"></div>' +
      '<div class="container mk-hero__inner">' +
        '<a class="mk-hero__back" href="../index.html#marcas">&larr; Todas as marcas</a>' +
        '<div class="mk-hero__logo"><img src="' + p(m.logoBranco || m.logo) + '" alt="' + m.nome + '"></div>' +
        '<span class="kicker">' + cidades + '</span>' +
        '<h1 class="display mk-hero__title">' + (m.tagline || m.nome) + '</h1>' +
        '<a class="btn btn--cta" id="mk-hero-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale Conosco</a>' +
      '</div>' +
    '</section>';
  }

  function sobre() {
    if (!m.sobre) return '';
    var aviso = m.pendente ? '<p class="mk-pendente">Conteúdo desta marca em atualização.</p>' : '';
    return '<section class="section mk-sobre">' +
      '<div class="container mk-sobre__grid">' +
        '<div data-reveal><span class="kicker">A marca</span><h2>' + m.nome + '</h2>' + aviso + '<p class="lede">' + m.sobre + '</p></div>' +
      '</div>' +
    '</section>';
  }

  function servicos() {
    if (!m.servicos || !m.servicos.length) return '';
    var cards = m.servicos.map(function (s) {
      return '<article class="mk-serv" data-reveal><h3>' + s.t + '</h3><p class="muted">' + s.d + '</p></article>';
    }).join('');
    return '<section class="section surface--dark grain mk-servicos">' +
      '<div class="container"><div class="sec-head" data-reveal><span class="kicker">Serviços</span><h2>O que esta marca faz por você</h2></div>' +
      '<div class="grid mk-serv-grid">' + cards + '</div></div>' +
    '</section>';
  }

  function unidades() {
    var cards = (m.unidades || []).map(function (u) {
      var contato = '';
      if (u.endereco) contato += '<li><span>Endereço</span>' + u.endereco + '</li>';
      if (u.telefone) contato += '<li><span>Telefone</span><a href="' + telLink(u.telefone) + '" target="_blank" rel="noopener">' + u.telefone + '</a></li>';
      if (u.email) contato += '<li><span>E-mail</span><a href="mailto:' + u.email + '">' + u.email + '</a></li>';
      if (!contato) contato = '<li class="muted">Contato em atualização.</li>';
      return '<article class="mk-unidade card" data-reveal>' +
        '<h3>' + u.cidade + '<span class="mk-unidade__uf">/' + u.uf + '</span></h3>' +
        '<ul class="mk-unidade__contato">' + contato + '</ul>' +
      '</article>';
    }).join('');
    var n = (m.unidades || []).length;
    return '<section class="section mk-unidades">' +
      '<div class="container"><div class="sec-head" data-reveal><span class="kicker">' + (n > 1 ? n + ' unidades' : 'Unidade') + '</span><h2>Onde encontrar</h2></div>' +
      '<div class="grid mk-unidade-grid">' + cards + '</div></div>' +
    '</section>';
  }

  function produtos() {
    var cats = (m.categorias || []).map(function (slug) {
      return CAT.filter(function (c) { return c.slug === slug; })[0];
    }).filter(Boolean);
    if (!cats.length) return '';
    var blocks = cats.map(function (c) {
      var itens = c.itens.map(function (it) { return '<li><strong>' + it.nome + '</strong> ' + it.desc + '</li>'; }).join('');
      return '<div class="mk-cat" data-reveal><h3>' + c.nome + '</h3><ul class="mk-cat__list">' + itens + '</ul></div>';
    }).join('');
    return '<section class="section surface--paper mk-produtos">' +
      '<div class="container"><div class="sec-head" data-reveal><span class="kicker">Linha desta marca</span>' +
        '<h2>Produtos que esta marca trabalha</h2><p class="lede">A disponibilidade pode variar por unidade. Consulte o time de vendas.</p></div>' +
      '<div class="mk-cats">' + blocks + '</div></div>' +
    '</section>';
  }

  function conversao() {
    return '<section class="section surface--red conversao"><div class="container conversao__inner" data-reveal>' +
      '<h2 class="conversao__title">Precisa de material ou um orçamento para a obra?</h2>' +
      '<p class="conversao__sub">Fale com o time da ' + m.nome + ' e receba atendimento consultivo e resposta ágil.</p>' +
      '<a class="btn btn--light btn--lg" id="mk-conv-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale Conosco</a>' +
    '</div></section>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('conteudo');
    if (main) main.innerHTML = hero() + sobre() + servicos() + unidades() + produtos() + conversao();
    var url = V.CTA_URL || '#';
    ['mk-hero-cta', 'mk-conv-cta'].forEach(function (id) { var b = document.getElementById(id); if (b) b.href = url; });
    if (window.__revealObserve) window.__revealObserve();
  });
})();
