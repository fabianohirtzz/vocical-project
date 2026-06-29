/* Header + footer compartilhados, menu mobile, WhatsApp flutuante.
   Fonte de verdade única — injetado em todas as páginas. Depende de config.js. */
(function () {
  var V = window.VOCICAL || {};
  var base = document.documentElement.getAttribute('data-base') || '';   // '' na raiz, '../' nas subpastas
  function p(path) { return base + path; }

  /* ---------------- HEADER ---------------- */
  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;
    el.innerHTML =
      '<a class="hd__skip sr-only" href="#conteudo">Pular para o conteúdo</a>' +
      '<div class="hd__bar">' +
        '<div class="container hd__inner">' +
          '<a class="hd__brand" href="' + p('index.html') + '" aria-label="Grupo Vocical — início">' +
            '<img src="' + p('Imagens/logo-vocical.png') + '" alt="Grupo Vocical" class="hd__logo">' +
          '</a>' +
          '<nav class="hd__nav" id="hd-nav" aria-label="Navegação principal">' +
            '<a href="' + p('index.html') + '">Início</a>' +
            '<a href="' + p('index.html') + '#marcas">Marcas</a>' +
            '<a href="' + p('produtos.html') + '">Produtos</a>' +
            '<a href="' + p('sobre.html') + '">Sobre</a>' +
            '<a href="' + p('contato.html') + '">Contato</a>' +
            '<a class="btn btn--cta hd__cta" href="' + V.CTA_URL + '" target="_blank" rel="noopener">Fale Conosco</a>' +
          '</nav>' +
          '<button class="hd__burger" id="hd-burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="hd-nav">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>';

    var burger = document.getElementById('hd-burger');
    var nav = document.getElementById('hd-nav');
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    // sombra ao rolar
    var onScroll = function () { document.body.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------------- FOOTER ---------------- */
  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var marcasLinks = (V.MARCAS || []).map(function (m) {
      return '<li><a href="' + p('marcas/' + m.slug + '.html') + '">' + m.nome + '</a></li>';
    }).join('');
    var s = V.SOCIAL || {};
    el.innerHTML =
      '<div class="container ft__grid">' +
        '<div class="ft__col ft__about">' +
          '<img src="' + p('Imagens/logo-vocical-branco.png') + '" alt="Grupo Vocical" class="ft__logo">' +
          '<p class="muted">Distribuição de materiais de construção, aço e soluções para obra e indústria desde 1987. 11 unidades em São Paulo e Mato Grosso.</p>' +
          '<div class="ft__social">' +
            '<a href="' + s.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>' +
            '<a href="' + s.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>' +
            '<a href="' + s.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>' +
          '</div>' +
        '</div>' +
        '<div class="ft__col">' +
          '<h4 class="ft__h">Navegação</h4>' +
          '<ul><li><a href="' + p('index.html') + '">Início</a></li>' +
          '<li><a href="' + p('produtos.html') + '">Produtos</a></li>' +
          '<li><a href="' + p('sobre.html') + '">Sobre</a></li>' +
          '<li><a href="' + p('contato.html') + '">Contato</a></li></ul>' +
        '</div>' +
        '<div class="ft__col">' +
          '<h4 class="ft__h">Marcas</h4>' +
          '<ul>' + marcasLinks + '</ul>' +
        '</div>' +
        '<div class="ft__col">' +
          '<h4 class="ft__h">Contato</h4>' +
          '<ul>' +
            '<li><a href="mailto:' + V.EMAIL + '">' + V.EMAIL + '</a></li>' +
            '<li><a href="' + V.WHATSAPP + '" target="_blank" rel="noopener">WhatsApp ' + V.WHATSAPP_LABEL + '</a></li>' +
          '</ul>' +
          '<a class="btn btn--cta ft__cta" href="' + V.CTA_URL + '" target="_blank" rel="noopener">Fale Conosco</a>' +
        '</div>' +
      '</div>' +
      '<div class="ft__legal"><div class="container">' +
        '<span>' + V.RAZAO_SOCIAL + ' · CNPJ ' + V.CNPJ + '</span>' +
        '<span>© ' + '2026' + ' Grupo Vocical. Todos os direitos reservados.</span>' +
      '</div></div>';
  }

  /* ---------------- WhatsApp flutuante ---------------- */
  function renderWhats() {
    if (document.querySelector('.wa-float')) return;
    var a = document.createElement('a');
    a.className = 'wa-float';
    a.href = V.WHATSAPP; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Falar no WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.9 1 1-4.8-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C5.5 9.3 10.2 4.6 16 4.6S26.5 9.3 26.5 15 21.8 24.8 16 24.8zm5.7-7.3c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>';
    document.body.appendChild(a);
  }

  /* ---------------- Reveal on scroll ---------------- */
  function reveal() {
    if (!('IntersectionObserver' in window)) {
      window.__revealObserve = function () {
        document.querySelectorAll('[data-reveal]').forEach(function (e) { e.classList.add('is-in'); });
      };
      window.__revealObserve(); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    window.__revealObserve = function () {
      document.querySelectorAll('[data-reveal]:not(.is-observed)').forEach(function (e) {
        e.classList.add('is-observed'); io.observe(e);
      });
    };
    window.__revealObserve();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader(); renderFooter(); renderWhats(); reveal();
  });
})();
