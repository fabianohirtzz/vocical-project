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
            (m.siteExterno
              ? '<a class="ucard__cta" href="' + esc(m.siteExterno) + '" target="_blank" rel="noopener">Acessar site</a>'
              : '<a class="ucard__cta" href="marcas/' + esc(first.pageSlug || m.slug) + '.html">Ver unidade</a>') +
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
      var cta = card.querySelector('.ucard__cta');
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
          // CTA "Ver unidade" acompanha a cidade selecionada no chip (marcas sem siteExterno).
          if (cta && !m.siteExterno) {
            cta.setAttribute('href', 'marcas/' + (u.pageSlug || m.slug) + '.html');
          }
        });
      });
    });
  }

  function renderProdutos() {
    var el = document.getElementById('produtos-grid'); if (!el) return;
    var cats = V.CATEGORIAS || [];

    var list = cats.map(function (c, i) {
      return '<button type="button" class="slide-nav__item' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' +
        '<span class="slide-nav__bar" aria-hidden="true"></span>' +
        '<span class="slide-nav__txt">' + c.nome + '</span>' +
      '</button>';
    }).join('');

    var media = cats.map(function (c, i) {
      return '<figure class="slide' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' +
        '<img class="slide__img" src="' + c.img + '" alt="' + c.nome + '" loading="lazy">' +
        '<span class="slide__scrim" aria-hidden="true"></span>' +
        '<figcaption class="slide__cap">' +
          '<span class="slide__desc">' + (c.desc || '') + '</span>' +
          '<a class="slide__go" href="produtos.html#' + c.slug + '">Ver categoria &rarr;</a>' +
        '</figcaption>' +
      '</figure>';
    }).join('');

    el.innerHTML =
      '<div class="slide-left"><div class="slide-nav" role="tablist">' + list + '</div></div>' +
      '<div class="slide-media">' + media + '</div>';

    // move o CTA "Ver catálogo" para o fim da coluna esquerda (alinha ao rodapé da imagem)
    var cta = document.querySelector('.produtos__cta');
    if (cta) el.querySelector('.slide-left').appendChild(cta);

    // ---- Carrossel mobile: cada categoria = quadrado arredondado com imagem
    //      e overlay do título; setas abaixo para deslizar. (só aparece no mobile) ----
    var mcards = cats.map(function (c) {
      return '<a class="prod-cat" href="produtos.html#' + c.slug + '">' +
        '<img class="prod-cat__img" src="' + c.img + '" alt="' + c.nome + '" loading="lazy">' +
        '<span class="prod-cat__scrim" aria-hidden="true"></span>' +
        '<span class="prod-cat__title">' + c.nome + '</span>' +
      '</a>';
    }).join('');
    var mob = document.createElement('div');
    mob.className = 'prod-cats';
    mob.innerHTML =
      '<div class="prod-cats__viewport"><div class="prod-cats__track">' + mcards + '</div></div>' +
      '<div class="prod-cats__nav">' +
        '<button class="prod-cats__arrow" type="button" data-dir="-1" aria-label="Categoria anterior">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button class="prod-cats__arrow" type="button" data-dir="1" aria-label="Próxima categoria">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '</div>' +
      '<a class="btn btn--dark prod-cats__cta" href="produtos.html">Ver catálogo completo</a>';
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
    renderUnidadesCards(); renderProdutos(); renderParceiros();
    // "Onde estamos" agora é o mapa interativo (js/mapa.js)
    // re-observa reveals criados dinamicamente
    if (window.__revealObserve) window.__revealObserve();
  });
})();
