/* Formulário de lead "Vico" — botão flutuante + modal branded, em todas as páginas.
   Envio idêntico ao widget Zyvia atual (POST no LEAD.ENDPOINT). Dados em config.js.
   Auto-injetado no body; expõe window.VOCICAL.openLead(). Base-path aware (data-base). */
(function () {
  var V = window.VOCICAL || {};
  var L = V.LEAD;
  if (!L) return;

  var base = document.documentElement.getAttribute('data-base') || '';   // '' na raiz, '../' nas subpastas
  function p(path) { return base + path; }
  var DRY = L.DRY_RUN || /[?&]lead(dry|test)=1/.test(location.search);

  /* ---- estado ---- */
  var produto = '';
  var tipoCliente = '';
  var submitted = false;

  /* ---- ícones hairline (sem emoji) ---- */
  var svg = ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICON = {
    materiais:   '<svg' + svg + '><path d="M3 21h18"/><path d="M6 21V9l6-4 6 4v12"/><path d="M10 21v-5h4v5"/></svg>',
    aco:         '<svg' + svg + '><path d="M4 20 20 4"/><path d="M9 20 20 9"/><path d="M4 15 15 4"/></svg>',
    coberturas:  '<svg' + svg + '><path d="M3 12 12 5l9 7"/><path d="M5 11v8h14v-8"/><path d="M9 19v-4h6v4"/></svg>',
    serralheria: '<svg' + svg + '><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/></svg>',
    drywall:     '<svg' + svg + '><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M3 15h18M9 4v6M15 10v5M9 15v5"/></svg>',
    agro:        '<svg' + svg + '><path d="M12 22V9"/><path d="M12 12c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 9c0-3 2-5 5-5 0 3-2 5-5 5Z"/></svg>',
    pf:          '<svg' + svg + '><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>',
    pj:          '<svg' + svg + '><path d="M4 21V6l8-3 8 3v15"/><path d="M9 21v-4h6v4"/><path d="M8 8h1M12 8h1M16 8h1M8 12h1M12 12h1M16 12h1"/></svg>',
    close:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    check:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    whats:       '<svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm5.7 14.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>',
    arrow:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- construção do DOM (uma vez) ---- */
  function build() {
    if (document.getElementById('lead-root')) return;

    var prodPills = (L.PRODUTOS || []).map(function (x, i) {
      return '<button type="button" class="lead-pill" data-prod="' + esc(x.id) + '" data-i="' + i + '">' +
        '<span class="lead-pill__ic">' + (ICON[x.icon] || '') + '</span>' +
        '<span class="lead-pill__tx">' + esc(x.label) + '</span></button>';
    }).join('');

    var tipoPills = (L.TIPOS || []).map(function (x) {
      return '<button type="button" class="lead-pill lead-pill--wide" data-tipo="' + esc(x.id) + '">' +
        '<span class="lead-pill__ic">' + (ICON[x.icon] || '') + '</span>' +
        '<span class="lead-pill__tx">' + esc(x.label) + '</span></button>';
    }).join('');

    var ufOpts = '<option value="">UF</option>' + (L.UFS || []).map(function (u) {
      return '<option value="' + u + '">' + u + '</option>';
    }).join('');

    var root = document.createElement('div');
    root.id = 'lead-root';
    root.innerHTML =
      // FAB
      '<button class="lead-fab" id="lead-fab" type="button" aria-haspopup="dialog" aria-controls="lead-modal" aria-label="Fale com o Vico, peça seu orçamento">' +
        '<span class="lead-fab__ava"><img src="' + p(L.AVATAR) + '" alt="" width="56" height="56" loading="lazy"></span>' +
        '<span class="lead-fab__dot" aria-hidden="true"></span>' +
        '<span class="lead-fab__label">Peça seu orçamento</span>' +
      '</button>' +
      // backdrop + modal
      '<div class="lead-backdrop" id="lead-backdrop" hidden></div>' +
      '<div class="lead-modal" id="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title" hidden>' +
        '<div class="lead-card">' +
          '<button class="lead-x" id="lead-x" type="button" aria-label="Fechar">' + ICON.close + '</button>' +
          '<div class="lead-head grain">' +
            '<span class="lead-head__ava"><img src="' + p(L.AVATAR) + '" alt="Vico, assistente do Grupo Vocical" width="72" height="72"></span>' +
            '<div class="lead-head__tx">' +
              '<p class="lead-head__hi" id="lead-title">Olá! Sou o <span>Vico</span></p>' +
              '<p class="lead-head__sub">Assistente do Grupo Vocical</p>' +
            '</div>' +
          '</div>' +
          '<div class="lead-body" id="lead-body">' +
            '<p class="lead-intro">Quer receber o contato de um consultor da sua região? Preencha abaixo e retornamos rapidinho.</p>' +
            '<form class="lead-form" id="lead-form" novalidate>' +
              '<fieldset class="lead-fs">' +
                '<legend class="lead-lbl">Produto de interesse</legend>' +
                '<div class="lead-pills" id="lead-prods">' + prodPills + '</div>' +
              '</fieldset>' +
              '<fieldset class="lead-fs">' +
                '<legend class="lead-lbl">Tipo</legend>' +
                '<div class="lead-pills lead-pills--2" id="lead-tipos">' + tipoPills + '</div>' +
              '</fieldset>' +
              '<div class="lead-field">' +
                '<label class="lead-lbl" for="lead-nome">Nome completo</label>' +
                '<input class="lead-input" id="lead-nome" name="nome" type="text" autocomplete="name" placeholder="Ex: João da Silva" required>' +
              '</div>' +
              '<div class="lead-field">' +
                '<label class="lead-lbl" for="lead-tel">WhatsApp / Telefone</label>' +
                '<input class="lead-input" id="lead-tel" name="tel" type="tel" inputmode="numeric" autocomplete="tel" placeholder="(66) 99999-9999" required>' +
              '</div>' +
              '<div class="lead-row">' +
                '<div class="lead-field lead-field--grow">' +
                  '<label class="lead-lbl" for="lead-cidade">Cidade</label>' +
                  '<input class="lead-input" id="lead-cidade" name="cidade" type="text" autocomplete="address-level2" placeholder="Sua cidade" required>' +
                '</div>' +
                '<div class="lead-field lead-field--uf">' +
                  '<label class="lead-lbl" for="lead-estado">Estado</label>' +
                  '<select class="lead-input lead-select" id="lead-estado" name="estado" required>' + ufOpts + '</select>' +
                '</div>' +
              '</div>' +
              '<p class="lead-note">Seus dados são usados só para este atendimento. Não compartilhamos com terceiros.</p>' +
              '<button class="lead-submit" id="lead-submit" type="submit" disabled>' +
                '<span class="lead-submit__tx">Quero ser atendido</span>' + ICON.arrow +
              '</button>' +
            '</form>' +
          '</div>' +
          '<div class="lead-success" id="lead-success">' +
            '<span class="lead-success__ic">' + ICON.check + '</span>' +
            '<h3 class="lead-success__h">Recebemos seu contato</h3>' +
            '<p class="lead-success__p">Um consultor do Grupo Vocical vai falar com você em breve. Se preferir, adiante pelo WhatsApp.</p>' +
            '<a class="lead-wa" id="lead-wa" target="_blank" rel="noopener" hidden>' + ICON.whats + '<span>Falar no WhatsApp</span></a>' +
            '<button class="lead-success__close" id="lead-success-close" type="button">Fechar</button>' +
          '</div>' +
          '<p class="lead-foot">Atendimento por <b>Vico IA</b> · Grupo Vocical</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    wire();
  }

  /* ---- comportamento ---- */
  var lastFocus = null;

  function open() {
    var m = document.getElementById('lead-modal');
    var b = document.getElementById('lead-backdrop');
    if (!m) return;
    if (submitted) resetForm();
    lastFocus = document.activeElement;
    b.hidden = false; m.hidden = false;
    // força reflow para a transição
    void m.offsetWidth;
    document.body.classList.add('lead-open');
    b.classList.add('on'); m.classList.add('on');
    var first = document.getElementById('lead-nome');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function close() {
    var m = document.getElementById('lead-modal');
    var b = document.getElementById('lead-backdrop');
    if (!m || m.hidden) return;
    m.classList.remove('on'); b.classList.remove('on');
    document.body.classList.remove('lead-open');
    setTimeout(function () { m.hidden = true; b.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function resetForm() {
    submitted = false; produto = ''; tipoCliente = '';
    var f = document.getElementById('lead-form');
    if (f) f.reset();
    document.querySelectorAll('#lead-root .lead-pill.on').forEach(function (el) { el.classList.remove('on'); });
    document.getElementById('lead-body').style.display = '';
    document.getElementById('lead-success').classList.remove('on');
    var btn = document.getElementById('lead-submit');
    if (btn) { btn.disabled = true; setBtnLabel('Quero ser atendido'); }
  }

  function setBtnLabel(t) {
    var s = document.querySelector('#lead-submit .lead-submit__tx');
    if (s) s.textContent = t;
  }

  function maskPhone(el) {
    var v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    else if (v.length > 0) v = '(' + v;
    el.value = v;
  }

  function validate() {
    var n = (document.getElementById('lead-nome').value || '').trim();
    var t = (document.getElementById('lead-tel').value || '').replace(/\D/g, '');
    var c = (document.getElementById('lead-cidade').value || '').trim();
    var e = document.getElementById('lead-estado').value;
    var ok = tipoCliente && produto && n.length >= 3 && t.length >= 10 && c.length >= 2 && e;
    document.getElementById('lead-submit').disabled = !ok;
    return ok;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    var btn = document.getElementById('lead-submit');
    btn.disabled = true; setBtnLabel('Enviando...');

    var nome = document.getElementById('lead-nome').value.trim();
    var payload = {
      emp: L.EMP || '', canal: L.CANAL || 'site',
      tipo_cliente: tipoCliente || null, produto: produto,
      nome: nome,
      telefone: document.getElementById('lead-tel').value.trim(),
      cidade: document.getElementById('lead-cidade').value.trim(),
      estado: document.getElementById('lead-estado').value.trim()
    };

    try {
      var data;
      if (DRY) {
        data = { success: true, vendedor_whatsapp: '' };   // QA: não gera lead real
      } else {
        var res = await fetch(L.ENDPOINT, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        data = await res.json();
      }
      if (data && data.success) {
        showSuccess(data, nome);
      } else {
        btn.disabled = false; setBtnLabel('Quero ser atendido');
        alert('Não foi possível enviar agora. Tente novamente.');
      }
    } catch (e) {
      btn.disabled = false; setBtnLabel('Quero ser atendido');
      alert('Erro de conexão. Tente novamente.');
    }
  }

  function showSuccess(data, nome) {
    submitted = true;
    if (data.vendedor_whatsapp) {
      var num = String(data.vendedor_whatsapp).replace(/\D/g, '');
      var texto = encodeURIComponent(
        'Olá! Acabei de preencher o formulário do site.\n' +
        'Meu nome é ' + nome + ' e tenho interesse em ' + (produto || 'produtos') + '.'
      );
      var wa = document.getElementById('lead-wa');
      wa.href = 'https://wa.me/' + num + '?text=' + texto;
      wa.hidden = false;
    }
    document.getElementById('lead-body').style.display = 'none';
    document.getElementById('lead-success').classList.add('on');
  }

  function wire() {
    document.getElementById('lead-fab').addEventListener('click', open);
    document.getElementById('lead-x').addEventListener('click', close);
    document.getElementById('lead-backdrop').addEventListener('click', close);
    document.getElementById('lead-success-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.getElementById('lead-prods').addEventListener('click', function (e) {
      var b = e.target.closest('.lead-pill'); if (!b) return;
      document.querySelectorAll('#lead-prods .lead-pill').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); produto = b.getAttribute('data-prod'); validate();
    });
    document.getElementById('lead-tipos').addEventListener('click', function (e) {
      var b = e.target.closest('.lead-pill'); if (!b) return;
      document.querySelectorAll('#lead-tipos .lead-pill').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); tipoCliente = b.getAttribute('data-tipo'); validate();
    });

    var tel = document.getElementById('lead-tel');
    tel.addEventListener('input', function () { maskPhone(tel); validate(); });
    ['lead-nome', 'lead-cidade', 'lead-estado'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', validate);
    });
    document.getElementById('lead-form').addEventListener('submit', submit);
  }

  /* ---- interceptação dos CTAs do site (abre o modal) ---- */
  var OPENERS = '[data-cta],#hero-cta,#conv-cta,#prod-cta,#sobre-cta,#ct-cta,#mk-conv-cta,#mk-hero-cta,.ie__btn,a[href="#lead-open"]';
  function interceptCtas() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest(OPENERS);
      if (!t) return;
      e.preventDefault();
      open();
    });
  }

  /* API pública para novos gatilhos */
  V.openLead = open;
  window.VOCICAL = V;

  document.addEventListener('DOMContentLoaded', function () {
    build();
    interceptCtas();
  });
})();
