/* Preview do novo header + hero (port do modelo shadcn-space/hero-01).
   Dados das unidades, dropdown, drawer mobile e marquee de logos. */
(function () {
  'use strict';

  // 11 unidades, cada uma com o logo da sua marca
  var L = 'Imagens/Logos Unidades/';
  var UNIDADES = [
    { nome: 'Vocical',                  cidade: 'Votuporanga/SP',        logo: L + 'Vocical/logo-vocical---transparente.png',                        href: 'marcas/vocical.html' },
    { nome: 'Jacical',                  cidade: 'Jales/SP',              logo: L + 'Jacical/Logo-Jacical---Transparente.png',                        href: 'marcas/jacical.html' },
    { nome: 'Ello Forte',               cidade: 'Ribeirão Preto/SP',     logo: L + 'Ello Forte Ribeirao Preto/ello-forte-RP---transparente.png',     href: 'marcas/ello-forte.html' },
    { nome: 'Ello Forte',               cidade: 'São Carlos/SP',         logo: L + 'Ello Forte Sao Carlos/ello-forte---fundo-transparente.png',      href: 'marcas/ello-forte.html' },
    { nome: 'Rio Preto Cimento e Cal',  cidade: 'São José do Rio Preto/SP', logo: L + 'Rio Preto Cimento e Cal/logo-rio-preto---transparente.png',   href: 'marcas/rp-cimento-cal.html' },
    { nome: 'Robracon',                 cidade: 'Cuiabá/MT',             logo: L + 'Robracon/ROBRACON---COLORIDO.png',                               href: 'marcas/robracon.html' },
    { nome: 'Robracon',                 cidade: 'Rondonópolis/MT',       logo: L + 'Robracon/ROBRACON---COLORIDO.png',                               href: 'marcas/robracon.html' },
    { nome: 'Robracon',                 cidade: 'Sinop/MT',              logo: L + 'Robracon/ROBRACON---COLORIDO.png',                               href: 'marcas/robracon.html' },
    { nome: 'Distribuidora Ituana',     cidade: 'Itu/SP',                logo: L + 'Distribuidoras/Ituana/logo-ituana-transparente.png',             href: 'marcas/distribuidoras.html' },
    { nome: 'Distribuidora Piracicabana', cidade: 'Piracicaba/SP',       logo: L + 'Distribuidoras/Piracicabana/logo-piracicabana-transparente.png', href: 'marcas/distribuidoras.html' },
    { nome: 'Distribuidora Itapetininga', cidade: 'Itapetininga/SP',     logo: L + 'Distribuidoras/Itapetininga/logo-itapetininga-transparente.png', href: 'marcas/distribuidoras.html' }
  ];

  // logos das marcas/parceiros que distribuímos (carrossel infinito)
  var M = 'Imagens/Marcas/';
  var MARQUEE = [
    { n: 'Gerdau',              s: M + 'gerdau.png' },
    { n: 'ArcelorMittal',       s: M + 'arcellor-mittal.png' },
    { n: 'CSN Siderúrgica',     s: M + 'csn-ciderurgica.png' },
    { n: 'CSN Cimentos',        s: M + 'csn-cimentos.png' },
    { n: 'Votorantim Cimentos', s: M + 'votorantim-cimentos.png' },
    { n: 'Usiminas',            s: M + 'usiminas.png' },
    { n: 'Brasilit',            s: M + 'brasilit.png' },
    { n: 'Placo',               s: M + 'placo.png' },
    { n: 'Quartzolit',          s: M + 'quartzolit.png' }
  ];

  function enc(path) { return path.split('/').map(encodeURIComponent).join('/'); }

  function unitRows() {
    return UNIDADES.map(function (u) {
      return '<a class="uni__item" href="' + u.href + '">' +
               '<span class="uni__logo"><img src="' + enc(u.logo) + '" alt="' + u.nome + '" loading="lazy"></span>' +
               '<span class="uni__txt"><span class="uni__name">' + u.nome + '</span>' +
               '<span class="uni__city">' + u.cidade + '</span></span>' +
             '</a>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // preencher dropdown desktop + lista no drawer
    var panel = document.getElementById('uni-panel');
    if (panel) panel.innerHTML = '<p class="uni__head">Nossas unidades</p>' + unitRows();
    var dUnits = document.getElementById('drawer-units');
    if (dUnits) dUnits.innerHTML = '<p class="uni__head">Nossas unidades</p>' + unitRows();

    // marquee: meia-volta larga o bastante para cobrir a tela inteira,
    // duplicada para loop contínuo de -50% (nunca fica vão sem logo)
    var track = document.getElementById('marquee-track');
    if (track) {
      var one = MARQUEE.map(function (m) {
        return '<img class="marquee__logo" src="' + enc(m.s) + '" alt="' + m.n + '" loading="lazy">';
      }).join('');
      var half = one + one + one;        // 27 logos ~ cobre qualquer viewport
      track.innerHTML = half + half;     // 2 metades idênticas -> loop sem emenda
    }

    // título: reveal "vertical cut" palavra a palavra, com stagger
    var title = document.getElementById('hero-title');
    if (title) {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var i = 0;
      [].forEach.call(title.querySelectorAll('.t-line'), function (line) {
        var words = line.textContent.trim().split(/\s+/);
        line.innerHTML = words.map(function (w) {
          var d = (i++ * 0.06).toFixed(2);
          return '<span class="rw"><span class="rw__i" style="animation-delay:' + d + 's">' + w + '</span></span>';
        }).join(' ');
      });
      if (!reduce) requestAnimationFrame(function () { title.classList.add('is-rev'); });
    }

    // dropdown unidades
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

    // drawer mobile
    var burger = document.getElementById('nb-burger');
    var close = document.getElementById('drawer-close');
    var scrim = document.getElementById('drawer-scrim');
    function setDrawer(open) {
      document.body.classList.toggle('drawer-open', open);
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (burger) burger.addEventListener('click', function () { setDrawer(true); });
    if (close) close.addEventListener('click', function () { setDrawer(false); });
    if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
    var dnav = document.getElementById('drawer-nav');
    if (dnav) dnav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setDrawer(false); });

    // mede a altura do header p/ a 1ª tela (.hero-screen) caber exata na viewport
    var nb = document.querySelector('.nb');
    var setNbH = function () {
      if (nb) document.documentElement.style.setProperty('--nb-h', nb.offsetHeight + 'px');
    };
    setNbH(); window.addEventListener('resize', setNbH);

    // sombra/pill ao rolar
    var onScroll = function () { document.body.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  });
})();
