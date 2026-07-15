/* Timeline "Nossa trajetória" — feixe que preenche a espinha conforme o scroll.
   Estilo aceternity portado para o site (vanilla). A ponta do feixe segue uma
   linha imaginária no meio da viewport; peso e settle sem parallax de conteúdo. */
(function () {
  var spine = document.querySelector('.tl__spine');
  var beam = document.querySelector('.tl__beam');
  if (!spine || !beam) return;

  /* feixe scroll-driven mantido mesmo sob reduced-motion (decisão do cliente) */
  var ticking = false;

  function update() {
    ticking = false;
    var rect = spine.getBoundingClientRect();
    var fillLine = window.innerHeight * 0.5;      // ponta do feixe = meio da tela
    var h = fillLine - rect.top;
    if (h < 0) h = 0;
    if (h > rect.height) h = rect.height;
    beam.style.height = h + 'px';
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
