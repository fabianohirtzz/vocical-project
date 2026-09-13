/* Calculadora de drywall da LP /campaigns-robracon-drywall/.
   Dois modos: parede (duas faces) e forro. Calcula a partir das medidas reais,
   não de um coeficiente único, e devolve a lista de material item a item.
   Os índices de consumo são de referência de mercado e estão marcados como
   estimativa na página — precisam do aval técnico da Robracon antes de virar
   promessa (ver spec 2026-09-13-lp-drywall-robracon-design.md).
   O botão de envio monta o texto da lista em VOCICAL.leadContexto, que o
   lead.js anexa ao handoff do WhatsApp. Nada disso vai no payload da Zyvia. */
(function () {
  var root = document.getElementById('dw-calc');
  if (!root) return;

  /* Consumo por m² (parede = m² de parede; forro = m² de forro). */
  var IDX = {
    parede: { parafusoAgulha: 14, parafusoMetal: 6, fita: 2.4, massa: 0.8 },
    forro:  { parafusoAgulha: 15, fita: 1.5, massa: 0.5, f530: 2.1, presilha: 2, regulador: 2 }
  };
  var BARRA = 3;               // metros por barra de perfil
  var PLACA_L = 1.2;           // largura padrão da placa, em metros

  var st = { modo: 'parede', camadas: 1, esp: 0.6, placaH: 1.8, perda: 10 };

  function q(s) { return root.querySelector(s); }
  function qa(s) { return [].slice.call(root.querySelectorAll(s)); }
  function num(sel) { var v = parseFloat((q(sel).value || '').replace(',', '.')); return isFinite(v) && v > 0 ? v : 0; }
  function fmt(n, casas) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 });
  }
  function comPerda(n) { return n * (1 + st.perda / 100); }
  function barras(metros) { return Math.ceil(comPerda(metros) / BARRA); }

  function calcula() {
    var c = num('#dw-c'), h = num('#dw-h');
    var areaPlacaUn = PLACA_L * st.placaH;
    var itens = [], area = 0, placas = 0;

    if (st.modo === 'parede') {
      area = c * h;
      if (!area) return null;
      var areaPlaca = area * 2 * st.camadas;                 // duas faces
      placas = Math.ceil(comPerda(areaPlaca) / areaPlacaUn);
      var nMont = Math.floor(c / st.esp) + 1;
      var mMont = nMont * h;
      var mGuia = c * 2;                                      // piso e teto
      itens = [
        ['Placas de drywall ' + (PLACA_L).toFixed(2).replace('.', ',') + ' x ' + st.placaH.toFixed(2).replace('.', ',') + ' m', fmt(placas) + ' un'],
        ['Montantes (barras de 3,00 m)', fmt(barras(mMont)) + ' un'],
        ['Guias (barras de 3,00 m)', fmt(barras(mGuia)) + ' un'],
        ['Parafusos ponta agulha 25 mm', fmt(Math.ceil(comPerda(areaPlaca * IDX.parede.parafusoAgulha))) + ' un'],
        ['Parafusos metal-metal 13 mm', fmt(Math.ceil(comPerda(area * IDX.parede.parafusoMetal))) + ' un'],
        ['Fita telada', fmt(Math.ceil(comPerda(area * IDX.parede.fita))) + ' m'],
        ['Massa para drywall', fmt(comPerda(area * IDX.parede.massa), 1) + ' kg']
      ];
    } else {
      area = c * h;
      if (!area) return null;
      placas = Math.ceil(comPerda(area) / areaPlacaUn);
      var perimetro = 2 * (c + h);
      itens = [
        ['Placas de drywall ' + (PLACA_L).toFixed(2).replace('.', ',') + ' x ' + st.placaH.toFixed(2).replace('.', ',') + ' m', fmt(placas) + ' un'],
        ['Perfil F530 (barras de 3,00 m)', fmt(barras(area * IDX.forro.f530)) + ' un'],
        ['Cantoneira ou tabica de perímetro (barras de 3,00 m)', fmt(barras(perimetro)) + ' un'],
        ['Presilhas', fmt(Math.ceil(comPerda(area * IDX.forro.presilha))) + ' un'],
        ['Reguladores', fmt(Math.ceil(comPerda(area * IDX.forro.regulador))) + ' un'],
        ['Parafusos ponta agulha 25 mm', fmt(Math.ceil(comPerda(area * IDX.forro.parafusoAgulha))) + ' un'],
        ['Fita telada', fmt(Math.ceil(comPerda(area * IDX.forro.fita))) + ' m'],
        ['Massa para drywall', fmt(comPerda(area * IDX.forro.massa), 1) + ' kg']
      ];
    }
    return { area: area, placas: placas, itens: itens };
  }

  function render() {
    var r = calcula();
    var big = q('#dw-calc-big'), lista = q('#dw-calc-list'), envio = q('#dw-calc-envia');
    if (!r) {
      big.innerHTML = '0<span class="u">placas</span>';
      lista.innerHTML = '<p class="dw-calc__note" style="margin:0">Preencha as medidas para ver a lista de material.</p>';
      if (envio) envio.setAttribute('hidden', '');
      return;
    }
    big.innerHTML = fmt(r.placas) + '<span class="u">placas</span>';
    lista.innerHTML = '<div class="dw-calc__li"><span>Área calculada</span><b>' + fmt(r.area, 2) + ' m²</b></div>' +
      r.itens.slice(1).map(function (i) {
        return '<div class="dw-calc__li"><span>' + i[0] + '</span><b>' + i[1] + '</b></div>';
      }).join('');
    if (envio) envio.removeAttribute('hidden');
  }

  /* Texto que vai junto no handoff do WhatsApp. */
  function textoDaLista() {
    var r = calcula();
    if (!r) return '';
    var cab = st.modo === 'parede'
      ? 'Estimativa da calculadora do site (parede, ' + fmt(r.area, 2) + ' m², ' +
        (st.camadas === 1 ? 'uma placa' : 'duas placas') + ' por face, montantes a cada ' +
        st.esp.toFixed(2).replace('.', ',') + ' m):'
      : 'Estimativa da calculadora do site (forro, ' + fmt(r.area, 2) + ' m²):';
    return cab + '\n' + r.itens.map(function (i) { return '- ' + i[0] + ': ' + i[1]; }).join('\n') +
      '\n(estimativa com ' + st.perda + '% de perda, a confirmar com o vendedor)';
  }

  /* ---- ligações de interface ---- */
  qa('[data-seg]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-seg'), v = b.getAttribute('data-val');
      qa('[data-seg="' + g + '"]').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      st[g] = (g === 'modo') ? v : parseFloat(v);
      if (g === 'modo') {
        var parede = v === 'parede';
        q('#dw-lbl-c').textContent = parede ? 'Comprimento da parede (m)' : 'Comprimento do forro (m)';
        q('#dw-lbl-h').textContent = parede ? 'Pé-direito / altura (m)' : 'Largura do forro (m)';
        qa('[data-so="parede"]').forEach(function (x) { x.hidden = !parede; });
      }
      render();
    });
  });
  qa('#dw-c,#dw-h,#dw-perda').forEach(function (i) {
    i.addEventListener('input', function () {
      if (i.id === 'dw-perda') { var p = parseFloat(i.value); st.perda = isFinite(p) && p >= 0 ? p : 0; }
      render();
    });
  });

  var envia = q('#dw-calc-envia');
  if (envia) {
    envia.addEventListener('click', function (e) {
      e.preventDefault();
      window.VOCICAL = window.VOCICAL || {};
      window.VOCICAL.leadContexto = textoDaLista();
      if (window.VOCICAL.openLead) window.VOCICAL.openLead();
    });
  }

  render();
})();
