# Página Trabalhe Conosco — Design

Data: 2026-07-03
Projeto: Site Grupo Vocical

## Objetivo

Criar a página "Trabalhe Conosco" no site novo (estático), com formulário de
candidatura idêntico em campos ao do site atual (Elementor), roteamento de
e-mail por unidade selecionada e currículo em anexo. Adicionar link para a
página em "Links úteis" no footer.

## Contexto

O site novo é estático (HTML/CSS/JS puro, sem build, deploy por FTP na erehost).
O site atual é WordPress/Elementor e faz o roteamento por unidade com um hook PHP
(`elementor_pro/forms/new_record`) + `wp_mail` com anexo. Precisamos de um
equivalente standalone, já que não há WordPress no site novo.

Decisões tomadas no brainstorming:
- Backend: **handler PHP standalone na erehost** (erehost suporta PHP; site antigo
  era WordPress). Envio real de e-mail só funciona na erehost, não no preview.
- Visual: **tratamento novo da skill `vocical-design`** (não copiar o Elementor).

## Arquitetura (3 peças)

### 1. `trabalhe-conosco.html` (página estática)
- Mesma casca das demais páginas: `<header id="site-header">` / `<footer id="site-footer">`
  injetados por `layout.js`; ordem de CSS `base.css → site.css → pages.css`;
  `<meta name="robots" content="noindex, nofollow">` (regra do projeto até aprovação).
- Scripts: `config.js`, `layout.js`, `main.js`, `trabalhe-conosco.js`.
- Seções (direção "peso e logística" da `vocical-design`):
  1. **Hero editorial** — kicker "Trabalhe Conosco", título display com acento
     vermelho em uma palavra, lede curta sobre o grupo (11 unidades em SP e MT).
  2. **Intro curta** — 1 parágrafo: oportunidades variam por unidade; preencher
     com unidade e cargo corretos para o processo não se perder. (copy sem
     travessão, sem emoji.)
  3. **Formulário** — card no sistema visual novo, sobre superfície apropriada.

### 2. `js/trabalhe-conosco.js`
- Monta o `<select>` de **unidades** a partir de `window.VOCICAL.MARCAS` (DRY):
  itera marcas → unidades, pula unidades pendentes / Rio Preto Cimento e Cal
  (canal próprio, sem e-mail de RH — igual ao form antigo → **10 unidades**).
  - `option.value` = **chave estável** da unidade (ex.: `robracon-cuiaba`,
    derivada de `slug + '-' + unidade.key`), `option.textContent` = rótulo legível
    (`nomeExib || nome` + " · " + `cidade` + "/" + `uf`).
- Monta o `<select>` de **cargo** com as 7 opções fixas.
- Validação no cliente (campos obrigatórios, tipo/tamanho do arquivo: pdf/doc/docx,
  máx 5MB, 1 arquivo) antes de enviar.
- Envia via `fetch` (POST `multipart/form-data`) para o endpoint PHP; mostra
  sucesso/erro inline sem recarregar. Desabilita o botão durante o envio.
- Endpoint lido de `window.VOCICAL.FORM_ENDPOINT` (ponto único de troca).

### 3. `enviar-trabalhe-conosco.php` (handler na erehost)
- Recebe o POST multipart. Sanitiza os campos.
- **Mapa de roteamento chave→e-mail vive só no servidor** (não exposto no HTML):

  | Chave (option value) | E-mail de destino |
  |---|---|
  | `vocical-votuporanga` | rh@grupovocical.com.br |
  | `jacical-jales` | gerencia.jacical@grupovocical.com.br |
  | `ello-forte-ribeirao-preto` | fernando@grupovocical.com.br |
  | `ello-forte-sao-carlos` | rodolfo.ellofortesc@grupovocical.com.br |
  | `distribuidoras-itu` | diego@grupovocical.com.br |
  | `distribuidoras-piracicaba` | diego@grupovocical.com.br |
  | `distribuidoras-itapetininga` | diego@grupovocical.com.br |
  | `robracon-cuiaba` | financeiro.robraconcba@grupovocical.com.br |
  | `robracon-rondonopolis` | contabilidaderh.robracon@grupovocical.com.br |
  | `robracon-sinop` | financeiro.robraconsnp@grupovocical.com.br |

  O mapa também guarda o **rótulo legível** de cada unidade (para o assunto/corpo),
  para não depender do texto vindo do cliente.
- **BCC** para `rh@grupovocical.com.br` (RH central), espelhando o PHP atual.
- Valida a chave: se não existir no mapa, não envia (400 + log).
- Valida o anexo: extensão em [pdf, doc, docx], tamanho ≤ 5MB, upload sem erro.
- Assunto: `Novo currículo recebido - <rótulo unidade> - <nome>`.
  Corpo em texto: nome, e-mail, whatsapp, unidade, cargo, comentário.
  `Reply-To` = e-mail do candidato.
- Envia com anexo. Preferência: **PHPMailer** se disponível; senão `mail()` com
  MIME multipart montado à mão. Responde JSON `{ok:true}` / `{ok:false, erro:"..."}`
  com o status HTTP adequado.
- CORS não é necessário (mesmo domínio na erehost); no preview o PHP não roda.

## Campos do formulário (idênticos ao atual)

| Rótulo | id / name | Tipo | Obrigatório |
|---|---|---|---|
| Nome | `nome` | text | sim |
| E-mail | `email` | email | sim |
| WhatsApp | `whatsapp` | tel | sim |
| Unidade | `unidade` | select (10 unidades) | sim |
| Cargo de interesse | `cargo` | select (7 opções) | sim |
| Comentário | `comentario` | textarea | não |
| Currículo | `curriculo` | file (pdf/doc/docx, máx 5MB, 1) | sim |

Opções de cargo: Administrativo, Financeiro, Comercial, Produção, Logística,
Expedição, Contabilidade.

## Footer

Em `layout.js`, adicionar `<li>` "Trabalhe Conosco" → `trabalhe-conosco.html`
na coluna **Links úteis** (hoje só tem Webmail), usando o helper `p()` para o
caminho relativo funcionar na raiz e em subpastas.

## Config

Adicionar em `config.js`:
```js
FORM_ENDPOINT: 'enviar-trabalhe-conosco.php'
```
(ponto único, análogo ao `CTA_URL`).

## Fora de escopo

- Integração com o widget de atendimento (segue como está no resto do site).
- reCAPTCHA/anti-spam (pode entrar depois; honeypot simples é opcional aqui).
- Otimização de imagens do hero (segue o backlog geral do projeto).

## Verificação

- Preview (GitHub Pages): página renderiza sem erro de console, select de unidades
  com 10 itens, validação de campos e de arquivo funcionando, footer com o link.
- erehost (pós-deploy): envio real roteia para o e-mail correto por unidade, com
  BCC ao RH central e o CV anexado; JSON de sucesso/erro tratado na UI.
