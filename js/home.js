/* Renderiza grids data-driven da home a partir de window.VOCICAL. */
(function () {
  var V = window.VOCICAL || {};

  function cidadesLabel(m) {
    var cs = (m.unidades || []).map(function (u) { return u.cidade; });
    return cs.join(' · ') + (m.uf && cs.length === 1 ? '/' + m.uf : '');
  }

  function renderMarcas() {
    var el = document.getElementById('marcas-grid'); if (!el) return;
    el.innerHTML = (V.MARCAS || []).map(function (m) {
      var n = (m.unidades || []).length;
      var sub = cidadesLabel(m);
      var qtd = n > 1 ? (n + ' unidades') : '1 unidade';
      return '<a class="card marca-card" href="marcas/' + m.slug + '.html" data-reveal>' +
        '<div class="marca-card__logo"><img src="' + m.logo + '" alt="' + m.nome + '" loading="lazy"></div>' +
        '<div class="marca-card__body">' +
          '<span class="marca-card__qtd">' + qtd + '</span>' +
          '<h3 class="marca-card__name">' + m.nome + '</h3>' +
          '<p class="muted marca-card__city">' + sub + '</p>' +
          '<span class="marca-card__link">Conhecer <span aria-hidden="true">&rarr;</span></span>' +
        '</div></a>';
    }).join('');
  }

  function renderProdutos() {
    var el = document.getElementById('produtos-grid'); if (!el) return;
    el.innerHTML = (V.CATEGORIAS || []).map(function (c) {
      return '<a class="prod-card" href="produtos.html#' + c.slug + '" data-reveal>' +
        '<div class="prod-card__img"><img src="' + c.img + '" alt="' + c.nome + '" loading="lazy"></div>' +
        '<div class="prod-card__body">' +
          '<h3 class="prod-card__name">' + c.nome + '</h3>' +
          '<p class="prod-card__desc">' + (c.desc || '') + '</p>' +
        '</div></a>';
    }).join('');
  }

  function renderParceiros() {
    var el = document.getElementById('parceiros-grid'); if (!el) return;
    el.innerHTML = (V.PARCEIROS || []).map(function (p) {
      return '<div class="parceiro"><img src="' + p.logo + '" alt="' + p.nome + '" loading="lazy"></div>';
    }).join('');
  }

  function renderUnidades() {
    var el = document.getElementById('unidades-list'); if (!el) return;
    var rows = [];
    (V.MARCAS || []).forEach(function (m) {
      (m.unidades || []).forEach(function (u) {
        rows.push('<a class="unidade-row" href="marcas/' + m.slug + '.html" data-reveal>' +
          '<span class="unidade-row__city">' + u.cidade + '<span class="unidade-row__uf">/' + u.uf + '</span></span>' +
          '<span class="unidade-row__brand">' + m.nome + '</span>' +
          '<span class="unidade-row__go" aria-hidden="true">&rarr;</span>' +
          '</a>');
      });
    });
    el.innerHTML = rows.join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderMarcas(); renderProdutos(); renderParceiros(); renderUnidades();
    // re-observa reveals criados dinamicamente
    if (window.__revealObserve) window.__revealObserve();
  });
})();
