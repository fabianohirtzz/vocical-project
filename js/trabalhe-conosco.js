/* Página Trabalhe Conosco — monta o select de unidades a partir do config.js,
   valida no cliente e envia via fetch para o handler PHP (config FORM_ENDPOINT).
   O roteamento por unidade (chave -> e-mail) vive no PHP, não aqui. */
(function () {
  var V = window.VOCICAL || {};

  var MAX_BYTES = 5 * 1024 * 1024;                 // 5 MB
  var EXT_OK = ['pdf', 'doc', 'docx'];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('tc-form');
    if (!form) return;

    populateUnidades();

    var status = document.getElementById('tc-status');
    var submit = form.querySelector('.tc-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var problems = validate();
      if (problems.length) {
        showStatus('erro', problems[0]);
        return;
      }

      var endpoint = V.FORM_ENDPOINT || form.getAttribute('action');
      submit.disabled = true;
      submit.classList.add('is-loading');
      showStatus('enviando', 'Enviando sua candidatura...');

      fetch(endpoint, { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (data) {
          if (data && data.ok) {
            form.reset();
            showStatus('ok', data.mensagem || 'Candidatura enviada com sucesso. Boa sorte no processo!');
            form.classList.add('is-sent');
          } else {
            submit.disabled = false;
            submit.classList.remove('is-loading');
            showStatus('erro', (data && data.erro) || 'Não foi possível enviar agora. Tente novamente em instantes.');
          }
        })
        .catch(function () {
          submit.disabled = false;
          submit.classList.remove('is-loading');
          showStatus('erro', 'Falha de conexão ao enviar. Verifique sua internet e tente novamente.');
        });
    });

    /* ---- monta o <select> de unidades a partir do config (10 unidades) ---- */
    function populateUnidades() {
      var sel = document.getElementById('tc-unidade');
      if (!sel) return;
      (V.MARCAS || []).forEach(function (m) {
        if (m.pendenteConteudo || m.siteExterno) return;          // Rio Preto: canal próprio, fora
        (m.unidades || []).forEach(function (u) {
          if (u.pendente) return;
          var brand = m.slug === 'distribuidoras' ? (u.nomeExib || m.nome) : m.nome;
          var opt = document.createElement('option');
          opt.value = m.slug + '-' + u.key;                       // chave estável (casa com o PHP)
          opt.textContent = brand + ' · ' + u.cidade + '/' + u.uf;
          sel.appendChild(opt);
        });
      });
    }

    /* ---- validação no cliente ---- */
    function validate() {
      var out = [];
      var nome = val('tc-nome');
      var email = val('tc-email');
      var whats = val('tc-whatsapp');
      var unidade = val('tc-unidade');
      var cargo = val('tc-cargo');
      var file = document.getElementById('tc-curriculo').files[0];

      if (!nome) { mark('tc-nome'); out.push('Informe seu nome.'); }
      if (!email || !EMAIL_RE.test(email)) { mark('tc-email'); out.push('Informe um e-mail válido.'); }
      if (!whats) { mark('tc-whatsapp'); out.push('Informe seu WhatsApp.'); }
      if (!unidade) { mark('tc-unidade'); out.push('Selecione a unidade.'); }
      if (!cargo) { mark('tc-cargo'); out.push('Selecione o cargo de interesse.'); }

      if (!file) {
        mark('tc-curriculo'); out.push('Anexe seu currículo (PDF, DOC ou DOCX).');
      } else {
        var ext = (file.name.split('.').pop() || '').toLowerCase();
        if (EXT_OK.indexOf(ext) === -1) { mark('tc-curriculo'); out.push('Formato inválido. Use PDF, DOC ou DOCX.'); }
        else if (file.size > MAX_BYTES) { mark('tc-curriculo'); out.push('Arquivo acima de 5 MB. Comprima ou reduza o currículo.'); }
      }
      return out;
    }

    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function mark(id) { var el = document.getElementById(id); if (el) el.closest('.tc-field').classList.add('has-error'); }
    function clearErrors() {
      form.querySelectorAll('.tc-field.has-error').forEach(function (f) { f.classList.remove('has-error'); });
    }
    function showStatus(kind, msg) {
      if (!status) return;
      status.hidden = false;
      status.className = 'tc-status is-' + kind;
      status.textContent = msg;
    }
  });
})();
