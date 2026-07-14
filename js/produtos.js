/* Renderiza a página de Produtos a partir de window.CATALOGO. */
(function () {
  var C = window.CATALOGO || [];

  function renderNav() {
    var el = document.getElementById('cat-nav'); if (!el) return;
    el.innerHTML = C.map(function (c, i) {
      return '<a href="#' + c.slug + '" class="cat-tab' + (i === 0 ? ' is-active' : '') + '">' + c.nome + '</a>';
    }).join('');
  }

  function renderCats() {
    var el = document.getElementById('cat-list'); if (!el) return;
    el.innerHTML = C.map(function (c) {
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
      return '<section class="cat-block" id="' + c.slug + '">' +
        '<div class="cat-block__head" data-reveal>' +
          '<span class="kicker">Categoria</span>' +
          '<h2>' + c.nome + '</h2>' +
        '</div>' +
        '<div class="prod-items">' + itens + '</div>' +
      '</section>';
    }).join('');
  }

  function activeOnScroll() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.cat-tab'));
    var blocks = C.map(function (c) { return document.getElementById(c.slug); });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          tabs.forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    blocks.forEach(function (b) { if (b) io.observe(b); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav(); renderCats(); activeOnScroll();
    if (window.__revealObserve) window.__revealObserve();
  });
})();
