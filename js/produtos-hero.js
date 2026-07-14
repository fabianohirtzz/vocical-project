/* Hero da página de produtos:
   1) container-text-flip — a palavra troca dentro de um container que estica p/
      o tamanho de cada uma; as letras entram desfocadas -> nítidas (port vanilla
      do manuarora700/container-text-flip).
   2) header direcional — some ao rolar p/ baixo (fica só a nav de categorias no
      topo) e volta ao rolar p/ cima. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- container-text-flip ---------------- */
  var STAGGER = 30;   // atraso entre letras (blur-in)
  var HOLD = 2200;    // tempo com cada palavra na tela

  function makeLetters(word) {
    var arr = [];
    for (var i = 0; i < word.length; i++) {
      var ch = word.charAt(i);
      var s = document.createElement('span');
      s.className = 'ctf__l';
      s.textContent = (ch === ' ') ? String.fromCharCode(160) : ch; // nbsp mantém largura
      arr.push(s);
    }
    return arr;
  }

  function startFlip(container, inner, words) {
    var i = 0;

    function paint(word) {
      inner.innerHTML = '';
      var ls = makeLetters(word);
      ls.forEach(function (s) { inner.appendChild(s); });
      container.style.width = inner.scrollWidth + 'px';   // estica p/ a palavra (content-box)
      if (reduce) { ls.forEach(function (s) { s.classList.add('is-in'); }); return; }
      requestAnimationFrame(function () {
        ls.forEach(function (s, idx) {
          setTimeout(function () { s.classList.add('is-in'); }, idx * STAGGER);
        });
      });
    }

    paint(words[0]);
    if (reduce) return;
    (function loop() {
      setTimeout(function () {
        i = (i + 1) % words.length;
        paint(words[i]);
        loop();
      }, HOLD);
    })();
  }

  function initFlip() {
    document.querySelectorAll('[data-flip]').forEach(function (container) {
      var inner = container.querySelector('.ctf__inner');
      var words;
      try { words = JSON.parse(container.getAttribute('data-words')); } catch (e) { words = []; }
      if (inner && words.length) startFlip(container, inner, words);
    });
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(initFlip);
  else window.addEventListener('load', initFlip);

  /* ---------------- header direcional ---------------- */
  (function headerScroll() {
    if (!document.querySelector('.cat-nav')) return;   // só na página de produtos
    var THRESH = 6;        // ignora tremidos mínimos
    var TOP_ZONE = 120;    // perto do topo, sempre mostra o header
    var last = window.scrollY || 0;
    var ticking = false;

    function update() {
      var y = window.scrollY || 0;
      var diff = y - last;
      if (Math.abs(diff) > THRESH) {
        if (diff > 0 && y > TOP_ZONE) document.body.classList.add('hdr-hidden');  // desceu
        else document.body.classList.remove('hdr-hidden');                         // subiu
        last = y;
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  })();
})();
