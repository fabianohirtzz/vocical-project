/* CTA "anti-metal" — porte 1:1 do componente 21st.dev (smammar100/anti-metal-button).
   Reescreve os CTAs principais (Solicitar orçamento / Fale Conosco) no formato do
   componente: rótulo + slab vermelho com o padrão de bolinhas em chevron que marcham
   em onda. Mantém href/target/rel e id (a interceptação do lead.js segue funcionando).
   Adaptações: verde->vermelho, borda rounded-xl->pílula, slab em pílula. */
(function () {
  'use strict';

  // Chevron (bolinhas) — uma seta de pontos por unidade; várias marcham em onda.
  // Colapsado, o slab mostra exatamente 1; no hover, expandem e preenchem o botão.
  var CHEVRONS = 12;
  function chevron(index) {
    var base = index * 0.12;
    var dots = [[2, 2, 0], [5, 5, 0.05], [8, 8, 0.1], [5, 11, 0.15], [2, 14, 0.2]];
    var circles = dots.map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1" class="amb-dot" style="animation-delay:' + (base + p[2]).toFixed(2) + 's"></circle>';
    }).join('');
    return '<svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" class="amb-cv"><g>' + circles + '</g></svg>';
  }
  function accent() {
    var svgs = '';
    for (var i = 0; i < CHEVRONS; i++) svgs += chevron(i);
    return '<span class="amb__accent" aria-hidden="true">' + svgs + '</span>';
  }

  function labelOf(el) {
    var l = el.getAttribute('data-amb-label');
    if (l) return l;
    var span = el.querySelector('.btn-arrow__label, .btn__label');
    var t = span ? span.textContent : el.textContent;
    // tira o "›" / bullets iniciais e normaliza espaços
    return (t || '').replace(/^[\s›»>·]+/, '').replace(/\s+/g, ' ').trim();
  }

  var STRIP = ['btn', 'btn--cta', 'btn--light', 'btn--dark', 'btn--ghost', 'btn--red', 'btn--lg', 'btn-arrow', 'btn-arrow--lg'];

  function upgrade(el, opts) {
    if (!el || el.classList.contains('amb')) return;   // idempotente
    opts = opts || {};
    var label = labelOf(el);
    STRIP.forEach(function (c) { el.classList.remove(c); });
    el.classList.add('amb');
    if (opts.lg) el.classList.add('amb--lg');
    if (opts.block) el.classList.add('amb--block');
    // cor por contexto:
    //   variante forçada (ex.: calculadoras -> --ghost) vence;
    //   superfície vermelha -> --white (corpo branco, slab vermelho claro);
    //   demais (fundo claro/escuro, menu) -> padrão (corpo vermelho, slab branco).
    var variant = opts.variant || (el.closest('.surface--red') ? 'amb--white' : null);
    if (variant) el.classList.add(variant);
    el.innerHTML = '<span class="amb__label">' + label + '</span>' + accent();
  }

  function run() {
    // CTAs grandes de conversão/contato (todas as páginas)
    ['hero-cta', 'conv-cta', 'prod-cta', 'sobre-cta', 'ct-cta', 'mk-hero-cta', 'mk-conv-cta', 'un-hero-cta', 'un-conv-cta']
      .forEach(function (id) { upgrade(document.getElementById(id), { lg: true }); });
    // botão "Solicitar orçamento" do menu mobile (largura cheia)
    upgrade(document.querySelector('.drawer__orc'), { block: true });
    // seção das calculadoras ("Peça seu orçamento"): corpo branco, slab preto;
    // exceto o conversor polegada<->mm, cujo slab é vermelho claro da marca.
    [].forEach.call(document.querySelectorAll('.calc__cta'), function (el) {
      upgrade(el, { variant: el.closest('#calc-conversor') ? 'amb--white' : 'amb--ghost' });
    });
    // CTA de conversão final (superfície vermelha): slab vermelho claro da marca.
    upgrade(document.getElementById('calc-conv-cta'), { lg: true });
  }

  // roda após layout.js / marca.js / home.js terem montado os botões
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 0); });
})();
