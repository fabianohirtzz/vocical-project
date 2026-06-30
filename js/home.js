/* Renderiza grids data-driven da home a partir de window.VOCICAL. */
(function () {
  var V = window.VOCICAL || {};

  function cidadesLabel(m) {
    var cs = (m.unidades || []).map(function (u) { return u.cidade; });
    return cs.join(' · ') + (m.uf && cs.length === 1 ? '/' + m.uf : '');
  }

  function renderMarcas() {
    var el = document.getElementById('marcas-grid'); if (!el) return;
    el.innerHTML = (V.MARCAS || []).map(function (m, i) {
      var n = (m.unidades || []).length;
      var sub = cidadesLabel(m);
      var qtd = n > 1 ? (n + ' unidades') : '1 unidade';
      var num = ('0' + (i + 1)).slice(-2);
      return '<a class="cell marca-row" href="marcas/' + m.slug + '.html" data-reveal="up">' +
        '<span class="marca-row__num num--mass">' + num + '</span>' +
        '<span class="marca-row__name">' + m.nome + '</span>' +
        '<span class="marca-row__meta">' + sub + ' · ' + qtd + '</span>' +
        '<span class="marca-row__go" aria-hidden="true">&rarr;</span>' +
        '</a>';
    }).join('');
  }

  function renderProdutos() {
    var el = document.getElementById('produtos-grid'); if (!el) return;
    el.innerHTML = (V.CATEGORIAS || []).map(function (c, i) {
      var num = ('0' + (i + 1)).slice(-2);
      return '<a class="cell prod-cell" href="produtos.html#' + c.slug + '" data-reveal="up">' +
        '<div class="prod-cell__media duotone"><img src="' + c.img + '" alt="' + c.nome + '" loading="lazy"></div>' +
        '<div class="prod-cell__body">' +
          '<span class="prod-cell__num num--mass">' + num + '</span>' +
          '<h3 class="prod-cell__name">' + c.nome + '</h3>' +
          '<p class="prod-cell__desc">' + (c.desc || '') + '</p>' +
        '</div></a>';
    }).join('');
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

  function renderUnidades() {
    var el = document.getElementById('unidades-list'); if (!el) return;
    var rows = [];
    (V.MARCAS || []).forEach(function (m) {
      (m.unidades || []).forEach(function (u) {
        rows.push('<a class="unidade-row" href="marcas/' + m.slug + '.html" data-reveal="up">' +
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
