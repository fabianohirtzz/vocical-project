/* Renderiza a landing rica de uma unidade a partir de body[data-unidade].
   Depende de config.js, unidades-data.js, catalogo.js. Páginas em /marcas/ usam data-base="../".
   Padrão espelhado em js/marca.js. Não depende de marcas-data.js. */
(function () {
  var V = window.VOCICAL || {}, CAT = window.CATALOGO || [];
  var U = (window.UNIDADES || {})[document.body.getAttribute('data-unidade')];
  if (!U) return;
  var m = (V.MARCAS || []).filter(function (x) { return x.slug === U.marcaSlug; })[0] || {};
  var u = (m.unidades || []).filter(function (x) { return x.key === U.unidadeKey; })[0] || {};
  var base = document.documentElement.getAttribute('data-base') || '';
  function p(path) { return path ? base + path : path; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function telLink(t) { return 'https://wa.me/55' + (t || '').replace(/\D/g, ''); }
  function telHref(t) { return 'tel:+55' + (t || '').replace(/\D/g, ''); }
  function cidadeUf() { return esc(u.cidade) + (u.uf ? '/' + esc(u.uf) : ''); }

  /* ---------- 1. Hero ---------- */
  function hero() {
    var selos = (U.hero.selos || []).map(function (s) {
      return '<span class="un-selo">' + esc(s) + '</span>';
    }).join('');
    return '<section class="un-hero grain">' +
      '<div class="duotone"><img src="' + p(u.fachada || m.capaFoto) + '" alt="" aria-hidden="true" loading="eager" fetchpriority="high"></div>' +
      '<div class="container un-hero__inner" data-reveal>' +
        '<div class="un-hero__logo"><img src="' + p(m.logoBranco || m.logo) + '" alt="' + esc(m.nome) + ' ' + cidadeUf() + '"></div>' +
        '<span class="eyebrow">' + esc(U.hero.kicker) + '</span>' +
        '<h1 class="un-hero__title">' + U.hero.h1 + '</h1>' +
        '<p class="un-hero__lede">' + esc(U.hero.lede) + '</p>' +
        '<div class="un-hero__selos">' + selos + '</div>' +
        '<a class="btn btn--cta un-hero__cta" id="un-hero-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale com esta unidade</a>' +
      '</div></section>';
  }

  /* ---------- 2. Números (painel-instrumento) ---------- */
  function numeros() {
    if (!U.numeros || !U.numeros.length) return '';
    var cells = U.numeros.map(function (n) {
      return '<div class="un-num">' +
        '<span class="un-num__n" data-count="' + esc(n.n) + '" data-suffix="' + esc(n.suf || '') + '">0' + esc(n.suf || '') + '</span>' +
        '<span class="un-num__label">' + esc(n.label) + '</span>' +
      '</div>';
    }).join('');
    return '<div class="un-nums">' + cells + '</div>';
  }

  /* ---------- 3. Sobre a unidade (split assimétrico, foto à esquerda) ---------- */
  function sobre() {
    if (!U.sobre) return '';
    var paras = (U.sobre.paras || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    return '<section class="section surface--white un-sobre">' +
      '<div class="container sobre__grid">' +
        '<div class="sobre__media duotone" data-reveal="left"><img src="' + p(U.sobre.foto) + '" alt="' + esc(U.sobre.fotoAlt) + '" loading="lazy"></div>' +
        '<div class="sobre__text" data-reveal="right">' +
          '<span class="eyebrow">A unidade</span>' +
          '<h2 class="display--mass">' + U.sobre.titulo + '</h2>' + paras +
        '</div>' +
      '</div></section>';
  }

  /* ---------- 4. Segmentos atendidos (hairline-grid) ---------- */
  function segmentos() {
    if (!U.segmentos || !U.segmentos.length) return '';
    var cells = U.segmentos.map(function (s) {
      return '<div class="cell"><div class="un-seg__name">' + esc(s) + '</div></div>';
    }).join('');
    return '<section class="section surface--char grain un-seg">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Quem atendemos</span>' +
        '<h2 class="display--mass">Quem esta unidade <span class="accent">atende</span></h2></div>' +
        '<div class="hairline-grid un-seg__grid" data-reveal>' + cells + '</div>' +
      '</div></section>';
  }

  /* ---------- 5. Produtos (catálogo filtrado por categorias da unidade) ---------- */
  function produtos() {
    var cats = (U.categorias || []).map(function (slug) {
      return CAT.filter(function (c) { return c.slug === slug; })[0];
    }).filter(Boolean);
    if (!cats.length) return '';
    var blocks = cats.map(function (c) {
      var itens = (c.itens || []).map(function (it) {
        return '<div class="un-prod">' +
          '<div class="un-prod__name">' + esc(it.nome) + '</div>' +
          '<p class="un-prod__desc">' + esc(it.desc) + '</p>' +
        '</div>';
      }).join('');
      return '<div class="un-cat" data-reveal><h3>' + esc(c.nome) + '</h3>' +
        '<div class="un-cat__grid">' + itens + '</div></div>';
    }).join('');
    var nota = U.categoriasNota ? '<p class="lede un-cat__nota" data-reveal>' + esc(U.categoriasNota) + '</p>' : '';
    return '<section class="section surface--paper un-produtos">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Portfólio</span>' +
        '<h2 class="display--mass">Linhas que esta unidade <span class="accent">trabalha</span></h2>' +
        '<p class="lede">A disponibilidade pode variar por item. Consulte o time comercial da unidade.</p></div>' +
        blocks + nota +
      '</div></section>';
  }

  /* ---------- 6. Serviços especializados ---------- */
  function servicos() {
    if (!U.servicos || !U.servicos.length) return '';
    var cards = U.servicos.map(function (s) {
      var bens = (s.beneficios || []).map(function (b) {
        return '<div class="un-serv__ben"><strong>' + esc(b) + '</strong></div>';
      }).join('');
      return '<article class="un-serv" data-reveal>' +
        '<div class="un-serv__head"><h3>' + esc(s.t) + '</h3><p class="muted">' + esc(s.d) + '</p></div>' +
        (bens ? '<div class="un-serv__grid">' + bens + '</div>' : '') +
      '</article>';
    }).join('');
    return '<section class="section surface--dark grain un-servicos">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Serviços</span>' +
        '<h2 class="display--mass">Serviços <span class="accent">especializados</span></h2></div>' +
        cards +
      '</div></section>';
  }

  /* ---------- 7. Diferenciais (reusa .feat) ---------- */
  function diferenciais() {
    if (!U.diferenciais || !U.diferenciais.length) return '';
    var ic = '<span class="feat__ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>';
    var cards = U.diferenciais.map(function (d) {
      return '<article class="feat" data-reveal>' + ic + '<h3>' + esc(d) + '</h3></article>';
    }).join('');
    return '<section class="section surface--paper un-diferenciais">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Por que comprar aqui</span>' +
        '<h2 class="display--mass">O que diferencia esta <span class="accent">unidade</span></h2></div>' +
        '<div class="un-dif">' + cards + '</div>' +
      '</div></section>';
  }

  /* ---------- 8. Galeria (some se vazia) ---------- */
  function galeria() {
    if (!U.galeria || !U.galeria.length) return '';
    var items = U.galeria.map(function (src) {
      return '<div class="un-gal__item duotone"><img src="' + p(src) + '" alt="Instalações e operação da ' + esc(m.nome) + ' ' + cidadeUf() + '" loading="lazy"></div>';
    }).join('');
    return '<section class="section surface--char grain un-gal">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Por dentro</span>' +
        '<h2 class="display--mass">A unidade por <span class="accent">dentro</span></h2></div></div>' +
      '<div class="un-gal__track" data-reveal>' + items + '</div></section>';
  }

  /* ---------- 9. Atuação e logística ---------- */
  function atuacao() {
    if (!U.atuacao) return '';
    var chips = '';
    if (U.atuacao.frota) chips += '<li>' + esc(U.atuacao.frota) + '</li>';
    return '<section class="section surface--paper un-atuacao">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Atuação e logística</span>' +
        '<h2 class="display--mass">Onde a unidade <span class="accent">atende</span></h2></div>' +
        '<p class="lede" data-reveal>' + esc(U.atuacao.texto) + '</p>' +
        (chips ? '<ul class="un-atuacao__list" data-reveal>' + chips + '</ul>' : '') +
      '</div></section>';
  }

  /* ---------- 10. Contato da unidade ---------- */
  function contato() {
    var list = '';
    if (u.endereco) list += '<li><span>Endereço</span><strong>' + esc(u.endereco) + ' — ' + cidadeUf() + '</strong></li>';
    if (u.telefone) list += '<li><span>Telefone</span><a href="' + telHref(u.telefone) + '">' + esc(u.telefone) + '</a></li>';
    if (u.email) list += '<li><span>E-mail</span><a href="mailto:' + esc(u.email) + '">' + esc(u.email) + '</a></li>';
    if (!list) list = '<li><span>Contato</span><strong>Fale com o comercial pelo botão acima.</strong></li>';
    var legal = '';
    if (U.razaoSocial || U.cnpj) {
      legal = '<p class="un-legal">' + esc(U.razaoSocial || '') +
        (U.cnpj ? (U.razaoSocial ? ' · ' : '') + 'CNPJ ' + esc(U.cnpj) : '') + '</p>';
    }
    return '<section class="section surface--dark grain un-contato">' +
      '<div class="container"><div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Contato</span>' +
        '<h2 class="display--mass">Fale com esta <span class="accent">unidade</span></h2></div>' +
        '<ul class="un-contato__list" data-reveal>' + list + '</ul>' + legal +
      '</div></section>';
  }

  /* ---------- 11. FAQ (acordeão) ---------- */
  function faq() {
    if (!U.faq || !U.faq.length) return '';
    var items = U.faq.map(function (f) {
      return '<div class="un-faq__item"><button class="un-faq__q" type="button">' + esc(f.q) + '</button>' +
        '<div class="un-faq__a"><p>' + esc(f.a) + '</p></div></div>';
    }).join('');
    return '<section class="section surface--white un-faq-sec"><div class="container">' +
      '<div class="sec-head" data-reveal>' +
        '<span class="eyebrow">Perguntas frequentes</span>' +
        '<h2 class="display--mass">Dúvidas sobre a <span class="accent">unidade</span></h2></div>' +
      '<div class="un-faq">' + items + '</div></div></section>';
  }

  /* ---------- 12. Conversão ---------- */
  function conversao() {
    return '<section class="section surface--red conversao"><div class="container conversao__inner" data-reveal>' +
      '<h2 class="conversao__title">Precisa de material ou um orçamento em ' + cidadeUf() + '?</h2>' +
      '<p class="conversao__sub">Fale com o time da ' + esc(m.nome) + ' ' + esc(u.cidade) + ' e receba atendimento consultivo e resposta ágil.</p>' +
      '<a class="btn btn--light btn--lg" id="un-conv-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale com esta unidade</a>' +
    '</div></section>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('conteudo');
    if (main) {
      main.innerHTML = hero() + numeros() + sobre() + segmentos() + produtos() +
        servicos() + diferenciais() + galeria() + atuacao() + contato() + faq() + conversao();
    }
    var url = V.CTA_URL || '#';
    ['un-hero-cta', 'un-conv-cta'].forEach(function (id) {
      var b = document.getElementById(id); if (b) b.href = url;
    });
    document.querySelectorAll('.un-faq__q').forEach(function (q) {
      q.addEventListener('click', function () {
        q.closest('.un-faq__item').classList.toggle('is-open');
      });
    });
    if (window.__revealObserve) window.__revealObserve();
  });
})();
