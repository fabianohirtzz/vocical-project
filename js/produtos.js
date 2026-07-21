/* Renderiza a página de Produtos a partir de window.CATALOGO. */
(function () {
  var C = window.CATALOGO || [];

  function renderNav() {
    var el = document.getElementById('cat-nav'); if (!el) return;
    el.innerHTML = C.map(function (c, i) {
      return '<a href="#' + c.slug + '" class="cat-tab' + (i === 0 ? ' is-active' : '') + '">' + c.nome + '</a>';
    }).join('');
  }

  /* Bandas de CTA intercaladas entre as categorias (convite a orçamento).
     data-cta faz o lead.js abrir o modal do Vico; href é só fallback. */
  var CTA_VARIANTES = [
    { eyebrow: 'Orçamento sem compromisso', title: 'Já sabe o que precisa para a obra?', btn: 'Pedir orçamento' },
    { eyebrow: 'Corte e dobra e volume', title: 'Precisa de peça sob medida ou grande quantidade?', btn: 'Falar com o time' }
  ];
  // depois de qual índice de categoria entra cada banda (com 6 categorias: após a 2ª e a 4ª)
  var CTA_APOS = { 1: 0, 3: 1 };

  function ctaBand(v) {
    var url = (window.VOCICAL || {}).CTA_URL || '#';
    return '<aside class="cat-cta grain" data-reveal>' +
      '<div class="cat-cta__tx">' +
        '<span class="cat-cta__eyebrow">' + v.eyebrow + '</span>' +
        '<h3 class="cat-cta__title">' + v.title + '</h3>' +
      '</div>' +
      '<a class="btn btn--light cat-cta__btn" data-cta target="_blank" rel="noopener" href="' + url + '">' +
        '<span class="btn__ic" aria-hidden="true">›</span> ' + v.btn +
      '</a>' +
    '</aside>';
  }

  function renderCats() {
    var el = document.getElementById('cat-list'); if (!el) return;
    el.innerHTML = C.map(function (c, i) {
      var itens = c.itens.map(function (it) {
        var media = it.img
          ? '<div class="prod-item__img"><img src="' + it.img + '" alt="' + it.nome + '" loading="lazy"></div>'
          : '';
        return '<div class="prod-item" data-reveal>' +
          '<div class="prod-item__txt">' +
            '<h3 class="prod-item__name">' + it.nome + '</h3>' +
            '<p class="prod-item__desc">' + it.desc + '</p>' +
          '</div>' +
          media +
        '</div>';
      }).join('');
      var block = '<section class="cat-block" id="' + c.slug + '">' +
        '<div class="cat-block__head" data-reveal>' +
          '<span class="kicker">Categoria</span>' +
          '<h2>' + c.nome + '</h2>' +
        '</div>' +
        '<div class="prod-items">' + itens + '</div>' +
      '</section>';
      if (CTA_APOS.hasOwnProperty(i)) block += ctaBand(CTA_VARIANTES[CTA_APOS[i]]);
      return block;
    }).join('');
  }

  function activeOnScroll() {
    var nav = document.getElementById('cat-nav'); // o próprio scroller horizontal
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.cat-tab'));
    var blocks = C.map(function (c) { return document.getElementById(c.slug); })
                  .filter(Boolean);
    if (!tabs.length || !blocks.length) return;

    var curId = null;
    function setActive(id) {
      if (id === curId) return;
      curId = id;
      var activeTab = null;
      tabs.forEach(function (t) {
        var on = t.getAttribute('href') === '#' + id;
        t.classList.toggle('is-active', on);
        if (on) activeTab = t;
      });
      // rola a nav horizontal p/ manter a aba atual sempre visível (centralizada)
      if (activeTab && nav && nav.scrollWidth > nav.clientWidth) {
        var target = activeTab.offsetLeft - (nav.clientWidth - activeTab.offsetWidth) / 2;
        nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      }
    }

    // scrollspy determinístico: a seção "atual" é a que já cruzou a linha de
    // referência (32% da tela) e está mais próxima dela. Mais confiável que
    // uma banda de IntersectionObserver em telas de alturas variadas (mobile).
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var line = (window.innerHeight || document.documentElement.clientHeight) * 0.32;
        var best = blocks[0].id, bestTop = -Infinity;
        blocks.forEach(function (b) {
          var top = b.getBoundingClientRect().top;
          if (top - line <= 0 && top > bestTop) { bestTop = top; best = b.id; }
        });
        setActive(best);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav(); renderCats(); activeOnScroll();
    if (window.__revealObserve) window.__revealObserve();
  });
})();
