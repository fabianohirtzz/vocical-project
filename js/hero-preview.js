/* Hero da home (index): marquee de marcas + reveal "vertical cut" do título.
   O header (pill, dropdown Unidades, drawer) é responsabilidade do layout.js. */
(function () {
  'use strict';

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
    { n: 'Quartzolit',          s: M + 'quartzolit.png' },
    { n: 'Belgo',               s: M + 'belgo.png' },
    { n: 'Ciplan',              s: M + 'ciplan.png' },
    { n: 'Fortlev',             s: M + 'fortlev-logo.png' },
    { n: 'Imbralit',            s: M + 'imbralit.png' },
    { n: 'Infibra',             s: M + 'infibra.png' },
    { n: 'PortoKoll',           s: M + 'portokoll.jpg' },
    { n: 'Sikal',               s: M + 'sikal.png' }
  ];

  function enc(path) { return path.split('/').map(encodeURIComponent).join('/'); }

  document.addEventListener('DOMContentLoaded', function () {
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
      /* reveal do título mantido mesmo sob reduced-motion (decisão do cliente):
         o CSS já não zera a animação; o JS também não pode barrar o disparo. */
      var reduce = false;
      var i = 0;
      [].forEach.call(title.querySelectorAll('.t-line'), function (line) {
        var words = line.textContent.trim().split(/\s+/);
        line.innerHTML = words.map(function (w) {
          var d = (i++ * 0.06).toFixed(2);
          return '<span class="rw"><span class="rw__i" style="animation-delay:' + d + 's">' + w + '</span></span>';
        }).join(' ');
      });
      // Dispara quando o herói entra em cena (mais confiável no mobile que um rAF
      // no load, que pode ser perdido). Fallback: dispara direto se não houver IO.
      var fire = function () { title.classList.add('is-rev'); };
      if (!reduce) {
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) { fire(); io.disconnect(); }
            });
          }, { threshold: .2 });
          io.observe(title);
          // rede de segurança: se por algum motivo o IO não disparar, garante o reveal
          setTimeout(function () { if (!title.classList.contains('is-rev')) fire(); }, 1200);
        } else {
          requestAnimationFrame(fire);
        }
      }
    }
  });
})();
