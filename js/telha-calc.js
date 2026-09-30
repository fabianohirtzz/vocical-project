/* Calculadora de telha galvalume da LP /campaigns-robracon-telha-galvalume/.

   Parte das medidas do vao, nao de um coeficiente unico por m2: com a largura, o
   comprimento, o numero de aguas e a inclinacao da para achar o comprimento de
   rampa, que e o que define o tamanho de cada telha. Como a Robracon produz telha
   em comprimento personalizado, esse numero e o resultado que mais importa aqui,
   mais ate que a quantidade de pecas.

   Os indices de consumo sao de referencia de mercado e estao marcados como
   estimativa na pagina. Precisam do aval tecnico da Robracon antes de virar
   promessa, do mesmo jeito que os da calculadora de drywall.

   O botao de envio monta o texto da lista em VOCICAL.leadContexto, que o lead.js
   anexa ao handoff do WhatsApp. Nada disso vai no payload da Zyvia, que tem
   contrato fixo de campos. */
(function () {
  var root = document.getElementById('tg-calc');
  if (!root) return;

  var PARAFUSO_M2 = 7;         // parafusos com vedacao por m2 de cobertura
  var st = {
    aguas: 2,                  // uma agua ou duas
    incl: 0.10,                // inclinacao em fracao (10% = 0,10)
    util: 0.98,                // largura util da telha, em metros
    vaoTerca: 2.0,             // distancia entre terças, em metros
    perda: 8
  };

  function q(s) { return root.querySelector(s); }
  function qa(s) { return [].slice.call(root.querySelectorAll(s)); }
  function num(sel) {
    var el = q(sel); if (!el) return 0;
    var v = parseFloat((el.value || '').replace(',', '.'));
    return isFinite(v) && v > 0 ? v : 0;
  }
  function numZ(sel) {           // aceita zero, para o beiral
    var el = q(sel); if (!el) return 0;
    var v = parseFloat((el.value || '').replace(',', '.'));
    return isFinite(v) && v >= 0 ? v : 0;
  }
  function fmt(n, casas) {
    return n.toLocaleString('pt-BR', {
      minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0
    });
  }
  function comPerda(n) { return n * (1 + st.perda / 100); }

  function calcula() {
    var larg = num('#tg-larg'), comp = num('#tg-comp'), beiral = numZ('#tg-beiral');
    if (!larg || !comp) return null;

    // a telha desce pela rampa: a projecao horizontal vira comprimento inclinado
    var fator = Math.sqrt(1 + st.incl * st.incl);
    var rampa = (larg / st.aguas) * fator + beiral;
    var area = comp * rampa * st.aguas;

    var porAgua = Math.ceil(comp / st.util);
    var telhas = porAgua * st.aguas;
    var lineares = telhas * rampa;

    var cumeeira = st.aguas === 2 ? comp : 0;
    var calha = comp * st.aguas;                       // um beiral por agua
    var linhasTerca = Math.floor(rampa / st.vaoTerca) + 1;
    var terca = linhasTerca * comp * st.aguas;
    var parafusos = Math.ceil(comPerda(area * PARAFUSO_M2));

    var itens = [
      ['Comprimento de cada telha', fmt(rampa, 2) + ' m'],
      ['Telhas (produzidas nessa medida)', fmt(telhas) + ' un'],
      ['Total em metros lineares de telha', fmt(lineares, 1) + ' m'],
      ['Parafusos autobrocantes com vedação', fmt(parafusos) + ' un'],
      ['Terças (' + fmt(linhasTerca) + ' linhas por água)', fmt(comPerda(terca), 1) + ' m'],
      ['Calha no beiral', fmt(comPerda(calha), 1) + ' m']
    ];
    if (cumeeira) itens.push(['Cumeeira', fmt(comPerda(cumeeira), 1) + ' m']);

    return { area: area, rampa: rampa, telhas: telhas, itens: itens };
  }

  function render() {
    var r = calcula();
    var big = q('#tg-calc-big'), lista = q('#tg-calc-list'), envio = q('#tg-calc-envia');
    if (!r) {
      big.innerHTML = '0<span class="u">telhas</span>';
      lista.innerHTML = '<p class="tg-calc__note" style="margin:0">Preencha as medidas para ver a lista de material.</p>';
      if (envio) envio.setAttribute('hidden', '');
      return;
    }
    big.innerHTML = fmt(r.telhas) + '<span class="u">telhas</span>';
    lista.innerHTML =
      '<div class="tg-calc__li"><span>Área de cobertura</span><b>' + fmt(r.area, 2) + ' m²</b></div>' +
      r.itens.map(function (i) {
        return '<div class="tg-calc__li"><span>' + i[0] + '</span><b>' + i[1] + '</b></div>';
      }).join('');
    if (envio) envio.removeAttribute('hidden');
  }

  /* Texto que vai junto no handoff do WhatsApp. */
  function textoDaLista() {
    var r = calcula();
    if (!r) return '';
    var cab = 'Estimativa da calculadora do site (' +
      (st.aguas === 2 ? 'duas águas' : 'uma água') + ', ' + fmt(r.area, 2) + ' m² de cobertura, ' +
      'inclinação de ' + fmt(st.incl * 100) + '%, telha de largura útil ' +
      fmt(st.util, 2) + ' m):';
    return cab + '\n' + r.itens.map(function (i) { return '- ' + i[0] + ': ' + i[1]; }).join('\n') +
      '\n(telha em comprimento sob medida; ' + st.perda +
      '% de perda aplicado aos acessórios, a confirmar com o vendedor)';
  }

  /* ---- ligações de interface ---- */
  qa('[data-seg]').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.getAttribute('data-seg'), v = parseFloat(b.getAttribute('data-val'));
      qa('[data-seg="' + g + '"]').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      st[g] = v;
      render();
    });
  });
  qa('#tg-larg,#tg-comp,#tg-beiral,#tg-perda').forEach(function (i) {
    i.addEventListener('input', function () {
      if (i.id === 'tg-perda') {
        var p = parseFloat(i.value);
        st.perda = isFinite(p) && p >= 0 ? p : 0;
      }
      render();
    });
  });

  var envia = q('#tg-calc-envia');
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
