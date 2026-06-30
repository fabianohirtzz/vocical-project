/* Renderiza grids data-driven da home a partir de window.VOCICAL. */
(function () {
  var V = window.VOCICAL || {};

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  /* SVG de canto côncavo (notch) que solda a aba/pino na superfície do card. */
  function corner(cls) {
    return '<svg class="ucard__corner ' + cls + '" viewBox="0 0 30 30" width="30" height="30" aria-hidden="true">' +
      '<path d="M30 0A30 30 0 0 1 0 30H30Z"/></svg>';
  }

  /* Grade de unidades (cutout cards): 1 card por marca, foto da fachada + badges.
     UF no pino (sup. dir.), cidade(s) na aba (inf. esq.). Em unidades com mais de
     uma loja, clicar na cidade troca a fachada e o endereço. */
  function renderUnidadesCards() {
    var el = document.getElementById('unidades-cards'); if (!el) return;
    var marcas = V.MARCAS || [];

    el.innerHTML = marcas.map(function (m, i) {
      var us = m.unidades || [];
      var first = us[0] || {};
      var foto = first.fachada || m.fachada || m.capaFoto || 'Imagens/back1.jpg';
      var multi = us.length > 1;

      var chips = us.map(function (u, k) {
        var tag = multi ? 'button type="button"' : 'span';
        var open = multi ? '<button type="button"' : '<span';
        var close = multi ? '</button>' : '</span>';
        return open + ' class="ucard__chip' + (k === 0 ? ' is-active' : '') + '"' +
          (multi ? ' data-city="' + k + '"' : '') + '>' + esc(u.cidade) + close;
      }).join('');

      var tag = m.tagline ? '<p class="ucard__tag">' + esc(m.tagline) + '</p>' : '';
      var addr = '<p class="ucard__addr"' + (first.endereco ? '' : ' hidden') + '>' + esc(first.endereco || '') + '</p>';
      var logo = m.logo || '';

      return '<article class="ucard" data-reveal="up" style="transition-delay:' + (i % 3) * 90 + 'ms"' +
        ' data-slug="' + esc(m.slug) + '">' +
        '<div class="ucard__media">' +
          '<img class="ucard__img" src="' + foto + '" alt="Fachada da unidade ' + esc(m.nome) + ' em ' + esc(first.cidade || '') + '" loading="lazy">' +
          '<span class="ucard__overlay" aria-hidden="true"></span>' +
          '<span class="ucard__pin"><span class="ucard__uf">' + esc(first.uf || m.uf || '') + '</span>' +
            corner('ucard__corner--pin-l') + corner('ucard__corner--pin-b') +
          '</span>' +
          '<span class="ucard__tab' + (multi ? ' is-multi' : '') + '">' + chips +
            corner('ucard__corner--tab-r') + corner('ucard__corner--tab-t') +
          '</span>' +
        '</div>' +
        '<div class="ucard__body">' +
          '<h3 class="ucard__title">' + esc(m.nome) + '</h3>' +
          tag + addr +
          '<div class="ucard__foot">' +
            '<span class="ucard__brand">' +
              '<span class="ucard__logo">' + (logo ? '<img src="' + logo + '" alt="" loading="lazy">' : '') + '</span>' +
              '<span class="ucard__bname">' + esc(m.nome) + '</span>' +
            '</span>' +
            '<a class="ucard__cta" href="marcas/' + esc(m.slug) + '.html">Ver unidade</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    initUnidadesCards(el, marcas);
  }

  function initUnidadesCards(root, marcas) {
    [].slice.call(root.querySelectorAll('.ucard')).forEach(function (card, i) {
      var m = marcas[i] || {}; var us = m.unidades || [];
      var img = card.querySelector('.ucard__img');
      var uf = card.querySelector('.ucard__uf');
      var addr = card.querySelector('.ucard__addr');
      var chips = [].slice.call(card.querySelectorAll('.ucard__chip[data-city]'));

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var k = +chip.getAttribute('data-city');
          var u = us[k]; if (!u) return;
          chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
          var foto = u.fachada || m.fachada || m.capaFoto;
          if (foto && img) {
            img.src = foto;
            img.alt = 'Fachada da unidade ' + (m.nome || '') + ' em ' + (u.cidade || '');
          }
          if (uf) uf.textContent = u.uf || m.uf || '';
          if (addr) {
            if (u.endereco) { addr.textContent = u.endereco; addr.hidden = false; }
            else { addr.hidden = true; }
          }
        });
      });
    });
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
    renderUnidadesCards(); renderProdutos(); renderParceiros(); renderUnidades();
    // re-observa reveals criados dinamicamente
    if (window.__revealObserve) window.__revealObserve();
  });
})();
