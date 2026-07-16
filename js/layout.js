/* Header + footer compartilhados, menu mobile, WhatsApp flutuante.
   Fonte de verdade única — injetado em todas as páginas. Depende de config.js. */
(function () {
  var V = window.VOCICAL || {};
  var base = document.documentElement.getAttribute('data-base') || '';   // '' na raiz, '../' nas subpastas
  function p(path) { return base + path; }
  function enc(path) { return path.split('/').map(encodeURIComponent).join('/'); }  // espaços em pastas

  /* ---------------- HEADER ---------------- */
  function renderHeader() {
    var el = document.getElementById('site-header');
    if (!el) return;

    // arquivo atual p/ marcar o item de nav ativo
    var path = location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    var NAV = [
      { label: 'Início',         href: p('index.html'),          file: 'index.html' },
      { label: 'Produtos',       href: p('produtos.html'),       file: 'produtos.html' },
      { label: 'Nossa História', href: p('sobre.html'),          file: 'sobre.html' },
      { label: 'Contato',        href: p('contato.html'),        file: 'contato.html' },
      // separador vermelho antes de Calculadoras (só no menu desktop; oculto no drawer)
      { label: 'Calculadoras',   href: p('calculadoras.html'),   file: 'calculadoras.html', sep: true }
    ];
    function navLinks() {
      return NAV.map(function (n) {
        var sep = n.sep ? '<span class="nb__sep" aria-hidden="true">|</span>' : '';
        return sep + '<a href="' + n.href + '"' + (n.file === file ? ' class="is-active"' : '') + '>' + n.label + '</a>';
      }).join('');
    }
    function uniRows() {
      return (V.UNIDADES_NAV || []).map(function (u) {
        var href = u.siteExterno || p('marcas/' + (u.pageSlug || u.slug) + '.html');
        var ext = u.siteExterno ? ' target="_blank" rel="noopener"' : '';
        return '<a class="uni__item" href="' + href + '"' + ext + '>' +
          '<span class="uni__logo"><img src="' + enc(p(u.logo)) + '" alt="' + u.nome + '" loading="lazy"></span>' +
          '<span class="uni__txt"><span class="uni__name">' + u.nome + '</span>' +
          '<span class="uni__city">' + u.cidade + '</span></span></a>';
      }).join('');
    }

    el.className = 'nb';
    el.innerHTML =
      '<div class="nb__inner">' +
        '<div class="nb__left">' +
          '<a class="nb__brand" href="' + p('index.html') + '" aria-label="Grupo Vocical — início">' +
            '<img class="nb__logo" src="' + p('Imagens/logo-header.png') + '" alt="Grupo Vocical"></a>' +
          '<span class="nb__since">Desde 1987</span>' +
        '</div>' +
        '<nav class="nb__nav" aria-label="Navegação principal">' + navLinks() + '</nav>' +
        '<div class="nb__right">' +
          '<div class="uni" id="uni">' +
            '<button class="uni__btn" id="uni-btn" aria-haspopup="true" aria-expanded="false" aria-controls="uni-panel">Unidades' +
              '<svg class="chev" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<div class="uni__panel" id="uni-panel" role="menu"><p class="uni__head">Nossas unidades</p>' + uniRows() + '</div>' +
          '</div>' +
          '<button class="nb__burger" id="nb-burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>';

    // ícones sociais p/ o rodapé do drawer
    var s = V.SOCIAL || {};
    var svgA = ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var SOC = {
      instagram: '<svg' + svgA + '><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      facebook: '<svg' + svgA + '><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
      linkedin: '<svg' + svgA + '><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
    };
    function drawerSocial() {
      function a(url, label, icon) { return url ? '<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + label + '">' + icon + '</a>' : ''; }
      return '<div class="drawer__social">' + a(s.instagram, 'Instagram', SOC.instagram) + a(s.facebook, 'Facebook', SOC.facebook) + a(s.linkedin, 'LinkedIn', SOC.linkedin) + '</div>';
    }

    // drawer mobile (injetado uma vez no body)
    if (!document.getElementById('drawer')) {
      var d = document.createElement('div');
      d.className = 'drawer'; d.id = 'drawer';
      d.innerHTML =
        '<div class="drawer__scrim" id="drawer-scrim"></div>' +
        '<aside class="drawer__panel" role="dialog" aria-label="Menu">' +
          '<div class="drawer__top">' +
            '<img class="nb__logo" src="' + p('Imagens/logo-header.png') + '" alt="Grupo Vocical">' +
            '<button class="drawer__close" id="drawer-close" aria-label="Fechar menu">&times;</button>' +
          '</div>' +
          '<nav class="drawer__nav" id="drawer-nav" aria-label="Navegação">' + navLinks() + '</nav>' +
          '<span class="drawer__div" aria-hidden="true"></span>' +
          '<div class="drawer__extra">' +
            '<p class="uni__head">Links úteis</p>' +
            '<a class="drawer__link" href="' + p('trabalhe-conosco.html') + '">Trabalhe Conosco</a>' +
            '<a class="drawer__link" href="http://webmail.grupovocical.com.br/" target="_blank" rel="noopener">Webmail</a>' +
          '</div>' +
          '<span class="drawer__div" aria-hidden="true"></span>' +
          '<div class="drawer__units"><p class="uni__head">Nossas unidades</p>' + uniRows() + '</div>' +
          '<span class="drawer__div" aria-hidden="true"></span>' +
          '<a class="btn-arrow drawer__orc" href="#lead-open">' +
            '<span class="btn-arrow__label">Solicitar orçamento</span>' +
            '<span class="btn-arrow__circ" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
          '</a>' +
          '<span class="drawer__div" aria-hidden="true"></span>' +
          drawerSocial() +
        '</aside>';
      document.body.appendChild(d);
    }

    // dropdown Unidades
    var uni = document.getElementById('uni');
    var uniBtn = document.getElementById('uni-btn');
    if (uni && uniBtn) {
      uniBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = uni.classList.toggle('open');
        uniBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!uni.contains(e.target)) { uni.classList.remove('open'); uniBtn.setAttribute('aria-expanded', 'false'); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { uni.classList.remove('open'); uniBtn.setAttribute('aria-expanded', 'false'); }
      });
    }

    // drawer
    var burger = document.getElementById('nb-burger');
    var dClose = document.getElementById('drawer-close');
    var dScrim = document.getElementById('drawer-scrim');
    var dNav = document.getElementById('drawer-nav');
    function setDrawer(open) {
      document.body.classList.toggle('drawer-open', open);
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (burger) burger.addEventListener('click', function () { setDrawer(true); });
    if (dClose) dClose.addEventListener('click', function () { setDrawer(false); });
    if (dScrim) dScrim.addEventListener('click', function () { setDrawer(false); });
    // qualquer link do drawer (nav, links úteis, unidades, orçamento) fecha o menu.
    // O botão "Solicitar orçamento" (href="#lead-open") é interceptado pelo lead.js,
    // que abre o modal do Vico; aqui só garantimos o fechamento do drawer.
    var dPanel = document.querySelector('.drawer__panel');
    if (dPanel) dPanel.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });

    // altura do header p/ a 1ª tela (.hero-screen no index)
    var setNbH = function () { document.documentElement.style.setProperty('--nb-h', el.offsetHeight + 'px'); };
    setNbH(); window.addEventListener('resize', setNbH);

    // pill/sombra ao rolar
    var onScroll = function () { document.body.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------------- FOOTER ---------------- */
  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var marcasLinks = (V.MARCAS || []).map(function (m) {
      var href = m.siteExterno || p('marcas/' + ((m.unidades && m.unidades[0] && m.unidades[0].pageSlug) || m.slug) + '.html');
      var ext = m.siteExterno ? ' target="_blank" rel="noopener"' : '';
      return '<li><a href="' + href + '"' + ext + '>' + m.nome + '</a></li>';
    }).join('');
    var s = V.SOCIAL || {};
    var svgAttrs = ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var ICON = {
      instagram: '<svg' + svgAttrs + '><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      facebook: '<svg' + svgAttrs + '><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
      linkedin: '<svg' + svgAttrs + '><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
    };
    function social(url, label, icon) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="' + label + '">' + icon + '</a>';
    }

    el.innerHTML =
      '<div class="ft-hero__bg" aria-hidden="true"></div>' +
      '<div class="ft-hero__inner container">' +
        '<div class="ft-card" data-reveal>' +
          '<div class="ft-card__top">' +
            '<div class="ft-card__brand">' +
              '<img class="ft-card__logo" src="' + p('Imagens/logo-site-1.png') + '" alt="Grupo Vocical">' +
              '<p class="ft-card__tag">Distribuição de materiais de construção, aço e soluções para obra e indústria desde 1987. 11 unidades em São Paulo e Mato Grosso.</p>' +
            '</div>' +
            '<div class="ft-card__links">' +
              '<div class="ft-col">' +
                '<p class="ft-col__h">Links úteis</p>' +
                '<ul>' +
                  '<li><a href="' + p('trabalhe-conosco.html') + '">Trabalhe Conosco</a></li>' +
                  '<li><a href="http://webmail.grupovocical.com.br/" target="_blank" rel="noopener">Webmail</a></li>' +
                '</ul>' +
              '</div>' +
              '<div class="ft-col">' +
                '<p class="ft-col__h">Unidades</p>' +
                '<ul>' + marcasLinks + '</ul>' +
              '</div>' +
              '<div class="ft-col">' +
                '<p class="ft-col__h">Contato</p>' +
                '<ul>' +
                  '<li><a href="mailto:' + V.EMAIL + '">' + V.EMAIL + '</a></li>' +
                  '<li><a href="' + V.WHATSAPP + '" target="_blank" rel="noopener">WhatsApp ' + V.WHATSAPP_LABEL + '</a></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ft-card__bar">' +
            '<div class="ft-card__legal">' +
              '<span>' + V.RAZAO_SOCIAL + ' · CNPJ ' + V.CNPJ + '</span>' +
              '<span>© 2026 Grupo Vocical. Todos os direitos reservados.</span>' +
            '</div>' +
            '<div class="ft-card__social">' +
              social(s.instagram, 'Instagram', ICON.instagram) +
              social(s.facebook, 'Facebook', ICON.facebook) +
              social(s.linkedin, 'LinkedIn', ICON.linkedin) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ---------------- Parallax do fundo do footer ---------------- */
  function parallaxFooter() {
    var bg = document.querySelector('.ft-hero__bg');
    var hero = document.getElementById('site-footer');
    if (!bg || !hero) return;
    /* parallax mantido mesmo sob reduced-motion (decisão do cliente) */
    var ticking = false;
    function update() {
      ticking = false;
      var r = hero.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var prog = (vh - r.top) / (vh + r.height);
      prog = Math.max(0, Math.min(1, prog));
      var shift = (prog - 0.5) * 80;   // -40px .. 40px
      bg.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* WhatsApp flutuante removido: o botão de lead "Vico" (lead.js) assume o canto.
     O WhatsApp continua acessível no header, no footer e na página de contato. */

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
    renderHeader(); renderFooter(); reveal(); parallaxFooter();
  });
})();
