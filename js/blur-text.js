/* Blur-text (port vanilla do efeito 21st.dev xubohuah/blur-text-animation).
   Divide o texto em palavras e as revela desfocadas -> nitidas, com stagger.
   Elementos marcados com [data-blur-text] animam na ordem do documento:
   o titulo aparece primeiro; o proximo elemento so comeca depois dele. */
(function () {
  var STAGGER = 60;    // atraso entre palavras (ms)
  var GAP = 220;       // pausa entre um elemento e o proximo (ms)
  var START = 160;     // atraso inicial apos o load (ms)

  /* Quebra em palavras preservando <br> e spans internos (ex.: .accent). */
  function splitInto(el, words) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {                       // texto
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement('span');
          span.className = 'blur-text__word';
          span.textContent = part;
          frag.appendChild(span);
          words.push(span);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        splitInto(node, words);                          // preserva o elemento, quebra o conteudo
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-blur-text]');
    if (!els.length) return;
    /* Efeito de texto mantido mesmo sob reduced-motion (decisão do cliente).
       Importante: as palavras começam em opacity:0 no CSS e só aparecem quando o
       JS adiciona .is-in — se barrássemos aqui, o título ficaria invisível. */

    var startAt = START;
    Array.prototype.forEach.call(els, function (el) {
      var words = [];
      splitInto(el, words);
      words.forEach(function (w, i) { w.style.transitionDelay = (startAt + i * STAGGER) + 'ms'; });
      startAt += words.length * STAGGER + GAP;          // proximo elemento comeca depois deste
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.querySelectorAll('.blur-text__word').forEach(function (w) { w.classList.add('is-in'); });
      });
    });
  });
})();
