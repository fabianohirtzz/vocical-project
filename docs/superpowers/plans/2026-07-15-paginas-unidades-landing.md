# Landing pages por unidade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar as páginas de marca em landing pages completas por unidade (7 ricas + distribuidoras sucinta), com SEO local por cidade e geração de lead B2B.

**Architecture:** Site estático HTML/CSS/JS puro, data-driven. Um arquivo de conteúdo por-unidade (`js/unidades-data.js`, keyed por `pageSlug`) + um renderer (`js/unidade.js`) que monta a landing rica a partir de `VOCICAL.MARCAS` + `CATALOGO`. `<head>` SEO + JSON-LD estáticos por página. Roteamento por `u.pageSlug`.

**Tech Stack:** HTML5, CSS3 (tokens em `css/base.css`, seções em `css/pages.css`), JavaScript ES5-vanilla (padrão do projeto, IIFE, sem framework/build). Verificação por browser (Playwright via agente `web-qa-reviewer`).

## Global Constraints

- Idioma pt-BR. Copy: **sem travessões, sem emojis, números concretos** (regra Freela).
- Design system `vocical-design`: direção "peso e logística"; foto sempre `.duotone`; superfícies alternando (papel → vermelho-escuro `#730a0a` → vermelho `#a60303`); título de seção com `.sec-head .display--mass` (override de escala) + UMA palavra `.accent`; eyebrow `.eyebrow` à esquerda; sem card mole arredondado (usar `.hairline-grid`); reveal direcional `data-reveal`/`="left"`/`="right"`.
- **`<meta name="robots" content="noindex, nofollow">`** em TODA página até o deploy final aprovado. NÃO ligar indexação neste trabalho.
- Nunca reintroduzir guard global de `prefers-reduced-motion` (efeitos rodam sob reduced-motion, decisão do cliente).
- Só publicar como confirmado o que `grupo-vocical-produtos-servicos-por-unidade.md` confirma. Itens "a validar" entram genéricos/sob consulta e vão pra `validacao-unidades.md`. CNPJ confirmado só Robracon Rondonópolis: `06.937.383/0001-05`.
- Menção a "frota própria" sempre com ressalva (varia por unidade).
- Ordem de CSS: `base.css` → `site.css` → `pages.css` → `lead.css`. Ordem de JS (páginas ricas): `config.js` → `marcas-data.js` → `unidades-data.js` → `catalogo.js` → `layout.js` → `lead.js` → `unidade.js` → `main.js` → `cta.js`.
- CTAs nunca com URL hardcoded: `href = VOCICAL.CTA_URL` como fallback; o `lead.js` intercepta e o `cta.js` reescreve no `.amb`. Dar aos CTAs a classe/atributo que esses scripts já esperam (`.btn--cta`, id conhecido).
- Servidor local para QA: `python -m http.server 8080` na raiz do projeto (caminhos usam `data-base="../"` nas subpáginas de `/marcas/`).

---

### Task 1: Camada de dados por unidade (`js/unidades-data.js`)

**Files:**
- Create: `js/unidades-data.js`
- Reference (fonte de copy/mix): `grupo-vocical-produtos-servicos-por-unidade.md` §4.1–§4.11, §2, §3
- Reference (contato/endereço/logo/fachada): `js/config.js` (MARCAS/unidades)
- Reference (categorias e itens): `js/catalogo.js` (`window.CATALOGO`)

**Interfaces:**
- Produces: `window.UNIDADES` — objeto keyed por `pageSlug`. Cada valor:
  ```js
  {
    pageSlug: 'robracon-rondonopolis',
    marcaSlug: 'robracon',        // p/ achar m em VOCICAL.MARCAS
    unidadeKey: 'rondonopolis',   // p/ achar u em m.unidades
    seo: {
      title: 'Material de Construção, Aço, Drywall e Coberturas em Rondonópolis/MT | Robracon',
      description: '...(≤160 char, keyword+cidade)...',
      canonical: 'https://grupovocical.com.br/marcas/robracon-rondonopolis.html'
    },
    hero: {
      kicker: 'Rondonópolis/MT',
      h1: 'Distribuidora de <span class="accent">aço</span>, material de construção e drywall em Rondonópolis',
      lede: '...',
      selos: ['Desde 2005', 'Mix mais amplo do grupo', 'Atendimento B2B', 'Logística regional']
    },
    numeros: [ { n: 2005, suf: '', label: 'Desde' }, { n: 6, suf: '', label: 'Linhas de produto' }, ... ], // só confirmados
    sobre: { titulo: '...', paras: ['...','...'], foto: 'Imagens/Robracon ROO/robracon1 (2).png', fotoAlt: '...' },
    segmentos: ['Construtoras e incorporadoras', 'Serralherias e metalúrgicas', 'Indústrias', 'Agronegócio', ...],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas','drywall'], // slugs do CATALOGO
    categoriasNota: '',   // ex Cuiabá/Sinop: 'Linhas além de construção e aço sob consulta na unidade.'
    servicos: [ { t:'Corte e dobra de chapas', d:'...', beneficios:['...','...'] }, ... ],
    diferenciais: ['Mix amplo', 'Drywall completo', ...],
    galeria: [ 'Imagens/Robracon ROO/robracon1 (3).png', ... ],   // [] se sem galeria
    atuacao: { texto: '...', frota: 'Frota própria conforme a unidade.' },
    faq: [ { q:'Onde comprar vergalhão em Rondonópolis?', a:'...' }, ... ],  // 4-6
    razaoSocial: 'ROBRACON RONDONÓPOLIS BRASIL MATERIAIS P/ CONSTRUÇÃO LTDA',  // só se confirmado
    cnpj: '06.937.383/0001-05',                                               // só se confirmado
    validar: ['corte e dobra de vergalhão na unidade', ...]                    // itens a confirmar
  }
  ```
  Campos ausentes (ex: `galeria: []`, sem `cnpj`) são tolerados pelo renderer (Task 3).

- [ ] **Step 1: Criar o arquivo com o scaffold IIFE e o exemplar completo de Robracon Rondonópolis**

Padrão do projeto: IIFE que popula `window.UNIDADES`. Escrever PRIMEIRO a unidade mais rica, completa, como exemplar de referência para as demais. Copy de §4.9; mix de §2 (construção, aço, estrutural, coberturas, drywall) e serviços de §3.

```js
/* Conteúdo editorial + SEO por unidade (landing rica). Keyed por pageSlug.
   Consumido por js/unidade.js. Fonte: grupo-vocical-produtos-servicos-por-unidade.md. */
window.UNIDADES = {
  'robracon-rondonopolis': {
    pageSlug: 'robracon-rondonopolis', marcaSlug: 'robracon', unidadeKey: 'rondonopolis',
    seo: {
      title: 'Material de Construção, Aço, Drywall e Coberturas em Rondonópolis/MT | Robracon — Grupo Vocical',
      description: 'Robracon Rondonópolis: aço, vergalhão, material de construção, drywall, coberturas metálicas e corte e dobra de chapas em Rondonópolis/MT. Atendimento B2B e orçamento ágil.',
      canonical: 'https://grupovocical.com.br/marcas/robracon-rondonopolis.html'
    },
    hero: {
      kicker: 'Rondonópolis/MT',
      h1: 'Aço, material de construção e <span class="accent">drywall</span> em Rondonópolis',
      lede: 'Uma das unidades com o portfólio mais amplo do Grupo Vocical. Do cimento ao drywall, com serviços especializados e logística regional para obras, indústrias e serralherias.',
      selos: ['Desde 2005', 'Mix mais amplo do grupo', 'Atendimento B2B', 'Logística regional']
    },
    numeros: [ { n: 2005, suf: '', label: 'Em atividade desde' }, { n: 6, suf: '', label: 'Linhas de produto' }, { n: 100, suf: '%', label: 'Drywall completo' } ],
    sobre: {
      titulo: 'A unidade de maior portfólio do <span class="accent">grupo</span>',
      paras: [
        'A Robracon Rondonópolis foi constituída em 2004 e iniciou suas atividades em 2005, para aproximar lojistas, obras e grandes indústrias do setor da construção.',
        'Hoje atende construção civil, indústrias, serralherias, estruturas metálicas, agronegócio e sistemas drywall, reunindo produtos, serviços e soluções voltadas para produtividade, organização e desempenho.'
      ],
      foto: 'Imagens/Robracon ROO/robracon1 (2).png',
      fotoAlt: 'Estrutura da Robracon Rondonópolis, distribuidora de aço e material de construção em Rondonópolis MT'
    },
    segmentos: ['Construtoras e incorporadoras','Serralherias e metalúrgicas','Indústrias','Estruturas metálicas','Agronegócio','Lojistas e revendas'],
    categorias: ['materiais-de-construcao','aco','estruturais','coberturas','drywall'],
    categoriasNota: '',
    servicos: [
      { t: 'Corte e dobra de chapas', d: 'Para serralherias, metalúrgicas e indústria: perfis U, C e Z, terças, reforços, suportes e peças com dobras personalizadas, prontas para solda ou montagem.', beneficios: ['Precisão dimensional','Padronização das peças','Menos retrabalho','Ganho de produtividade'] },
      { t: 'Telhas metálicas e termoacústicas sob medida', d: 'Cobertura produzida conforme as medidas do projeto, em comprimentos personalizados, com menos emendas e montagem mais rápida.', beneficios: ['Menor desperdício','Melhor acabamento','Conforto térmico e acústico','Aplicação em galpões e centros logísticos'] },
      { t: 'Sistemas drywall completos', d: 'Fornecimento completo de drywall: placas ST, RU e Glasroc X, guias, montantes, perfil F530, e todos os acessórios de montagem e acabamento.', beneficios: ['Áreas secas, úmidas e fachadas','Montagem rápida','Linha completa em um só fornecedor'] }
    ],
    diferenciais: ['Mix mais amplo do Grupo Vocical','Drywall completo','Linha de serralheria e estruturas','Soluções para indústria e agronegócio','Telhas sob medida','Estrutura logística regional'],
    galeria: ['Imagens/Robracon ROO/robracon1 (3).png','Imagens/Robracon ROO/robracon1 (4).png','Imagens/Robracon ROO/robracon1 (5).png','Imagens/Robracon ROO/robracon1 (6).png','Imagens/Robracon ROO/corte-dobra-chapa.png','Imagens/Robracon ROO/corte-laser.png'],
    atuacao: { texto: 'Atende Rondonópolis e região, com estrutura logística para entrega regional de materiais e peças produzidas sob medida.', frota: 'Frota própria conforme a disponibilidade da unidade.' },
    faq: [
      { q: 'Onde comprar vergalhão e aço em Rondonópolis?', a: 'A Robracon Rondonópolis fornece vergalhões CA50 e CA60, colunas, treliças, tela soldada e malha POP, além de corte e dobra sob medida. Fale com o comercial para orçamento.' },
      { q: 'A Robracon Rondonópolis trabalha com drywall?', a: 'Sim. É a unidade do grupo com a linha completa de drywall: placas ST, RU e Glasroc X, perfis, guias, montantes e acessórios.' },
      { q: 'Vocês produzem telhas metálicas sob medida?', a: 'Sim. Produzimos telhas metálicas e termoacústicas em comprimentos personalizados, conforme o projeto, para galpões, comércios, indústrias e centros logísticos.' },
      { q: 'A Robracon atende serralherias e indústrias?', a: 'Sim. Além do material de construção, oferecemos corte e dobra de chapas, perfis, tubos, chapas e componentes metálicos para serralherias, metalúrgicas e manutenção industrial.' },
      { q: 'Vocês atendem pessoa jurídica e obras de grande porte?', a: 'Sim. O atendimento é consultivo e preparado para B2B: lojistas, construtoras, indústrias e órgãos públicos, com apoio no quantitativo e entrega programada.' }
    ],
    razaoSocial: 'ROBRACON RONDONÓPOLIS BRASIL MATERIAIS P/ CONSTRUÇÃO LTDA',
    cnpj: '06.937.383/0001-05',
    validar: ['Disponibilidade atual de corte e dobra de vergalhão na unidade','Confirmar m² de estrutura para a faixa de números']
  }
};
```

- [ ] **Step 2: Verificar que o arquivo carrega sem erro**

Rodar `python -m http.server 8080` na raiz. Criar uma página temporária ou abrir o console em qualquer página que já inclua o script (após Task 5). Verificação isolada agora: `node -e "global.window={}; require('./js/unidades-data.js'); console.log(Object.keys(window.UNIDADES))"`.
Expected: imprime `[ 'robracon-rondonopolis' ]` sem erro de sintaxe.

- [ ] **Step 3: Adicionar as demais 6 unidades ricas**

Replicar a MESMA estrutura para cada pageSlug abaixo, transcrevendo a copy/mix do doc citado. NÃO inventar dado; onde o doc diz "a validar", usar `categoriasNota`/`validar` e manter mix confirmado.

- `vocical` (marcaSlug `vocical`, key `votuporanga`) — copy §4.1; categorias `['materiais-de-construcao','aco','estruturais','coberturas','agronegocio']`; serviços: corte e dobra de vergalhão + corte e dobra de chapas; foto/galeria de `Imagens/Vocical/vocical1..17.jpg`; numeros: `{n:1987,label:'Origem do grupo desde'}`. É a unidade de origem — destacar na copy.
- `jacical` (`jacical`/`jales`) — copy §4.2; mesmas categorias da Vocical; serviços corte e dobra de vergalhão + chapas; galeria `Imagens/jacical/jacical1..8.jpg`.
- `ello-forte-ribeirao-preto` (`ello-forte`/`ribeirao-preto`) — copy §4.4; categorias `['materiais-de-construcao','aco','estruturais','coberturas']`; serviço corte e dobra de vergalhão; numeros `{n:2009,label:'Sob gestão Vocical desde'}`, `{n:7000,suf:' m²',label:'Área total aprox.'}`; galeria `Imagens/Ello Forte RP/elloforterp1..17.jpg`.
- `ello-forte-sao-carlos` (`ello-forte`/`sao-carlos`) — copy §4.5; categorias `['materiais-de-construcao','aco','coberturas']`; `categoriasNota` sobre demais linhas sob consulta; numeros `{n:2012,label:'Desde'}`, `{n:8000,suf:' m²',label:'Estrutura'}`; **galeria: []** (só fachada + `Imagens/Ello Forte SC/sobre-ello-sc.jpg` no sobre).
- `robracon-cuiaba` (`robracon`/`cuiaba`) — copy §4.10; categorias confirmadas `['materiais-de-construcao','aco']`; `categoriasNota: 'Linhas de coberturas, serralheria e drywall são da Robracon; disponibilidade sob consulta nesta unidade.'`; fachada própria `Imagens/Robracon CBA/capa-robracon-cba.jpg`; **galeria reaproveita RO** (`Imagens/Robracon ROO/robracon1 (*).png`); `validar` inclui mix completo da unidade.
- `robracon-sinop` (`robracon`/`sinop`) — copy §4.11; igual estrutura de Cuiabá; fachada `Imagens/Robracon SNP/capa-robracon-snp.jpg` + `Imagens/Robracon SNP/sobre-robracon-snp.jpg` no sobre; **galeria reaproveita RO**; `validar` inclui mix completo.

Cada FAQ: 4-6 perguntas long-tail com a cidade no texto ("onde comprar [produto] em [cidade]", "a [unidade] atende [público]", "vocês fazem entrega em [cidade]", "trabalham com pessoa jurídica"). Respostas honestas, sem inventar horário/prazo específico.

- [ ] **Step 4: Verificar todas as chaves**

Run: `node -e "global.window={}; require('./js/unidades-data.js'); var u=window.UNIDADES; console.log(Object.keys(u)); Object.keys(u).forEach(function(k){var x=u[k]; if(!x.seo||!x.hero||!x.categorias) throw new Error('faltando campo em '+k)})"`
Expected: imprime as 7 chaves, sem throw.

- [ ] **Step 5: Commit**

```bash
git add js/unidades-data.js
git commit -m "Adiciona camada de conteudo por unidade (unidades-data.js)"
```

---

### Task 2: Estilos das seções de unidade (bloco `.un-` em `css/pages.css`)

**Files:**
- Modify: `css/pages.css` (adicionar bloco `.un-` ao final, antes de eventuais media queries globais; seguir o padrão dos blocos `.mk-` existentes)
- Reference: `css/base.css` (tokens, `.duotone`, `.hairline-grid`, `.eyebrow`, `.display--mass`, `.sec-head`), `css/pages.css` `.page-hero`/`.feat`/`.ie`, `css/home.css` `.medidor`/`.sobre__grid`

**Interfaces:**
- Produces (classes consumidas pelo renderer da Task 3): `.un-hero`, `.un-hero__inner`, `.un-hero__logo`, `.un-hero__title`, `.un-hero__lede`, `.un-hero__selos`/`.un-selo`, `.un-nums`/`.un-num`, `.un-sobre` (reusa `.sobre__grid`), `.un-seg`/`.un-seg__grid` (reusa `.hairline-grid`/`.cell`), `.un-cat`/`.un-cat__grid`/`.un-prod`, `.un-serv`/`.un-serv__grid`/`.un-serv__ben`, `.un-dif` (reusa `.feat`), `.un-gal`/`.un-gal__track`/`.un-gal__item`, `.un-atuacao`, `.un-faq`/`.un-faq__item`/`.un-faq__q`/`.un-faq__a`, `.un-contato`/`.un-contato__list`, `.un-legal` (razão social/CNPJ).

- [ ] **Step 1: Escrever o bloco CSS completo**

Reaproveitar o máximo das classes existentes; criar só o que falta. Zero border-radius nos cards de catálogo; hairlines; foto duotone. Exemplo mínimo do hero e da galeria (o restante segue os padrões de `.mk-`/`.sobre__grid`/`.hairline-grid`):

```css
/* ===== Página de unidade (landing rica) ===== */
.un-hero { position: relative; display: flex; align-items: flex-end; min-height: clamp(420px, 62vh, 620px); overflow: hidden; background: var(--ink); }
.un-hero > .duotone { position: absolute; inset: 0; z-index: 0; }
.un-hero__inner { position: relative; z-index: 2; max-width: 820px; padding-block: clamp(48px, 8vh, 104px); }
.un-hero__logo img { height: clamp(40px, 6vw, 64px); width: auto; margin-bottom: 1.2rem; }
.un-hero__title { font-family: var(--font); font-weight: 700; letter-spacing: -.02em; line-height: 1.02; font-size: clamp(2rem, 5vw, 3.6rem); color: #fff; margin-top: .6rem; }
.un-hero__title .accent { color: #ff5a5a; }
.un-hero__lede { color: rgba(255,255,255,.82); max-width: 56ch; margin-top: 1rem; }
.un-hero__selos { display: flex; flex-wrap: wrap; gap: .6rem 1.4rem; margin-top: 1.6rem; }
.un-selo { display: inline-flex; align-items: center; gap: .5rem; font-size: .82rem; color: rgba(255,255,255,.9); }
.un-selo::before { content: ""; width: 7px; height: 7px; background: var(--red); border-radius: 50%; }
.un-hero__cta { margin-top: 1.8rem; }

/* Números da unidade (instrumento) */
.un-nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line-dark); border-block: 1px solid var(--line-dark); }
.un-num { background: var(--red-dark); padding: clamp(1.2rem,3vw,2rem); }
.un-num__n { font-family: var(--display); font-size: clamp(2rem,4.6vw,3.4rem); line-height: .85; color: #fff; }
.un-num__label { display: block; margin-top: .5rem; font-size: .72rem; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.6); }

/* Produtos por categoria */
.un-cat + .un-cat { margin-top: clamp(2rem,4vw,3.5rem); }
.un-cat__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); }
.un-prod { background: var(--white); padding: 1.4rem; }
.un-prod__name { color: var(--red); font-weight: 700; }
.un-prod__desc { color: var(--charcoal); font-size: .92rem; margin-top: .4rem; }

/* Galeria (scroll-snap horizontal) */
.un-gal__track { display: flex; gap: 1px; overflow-x: auto; scroll-snap-type: x mandatory; }
.un-gal__item { flex: 0 0 clamp(240px, 42vw, 420px); aspect-ratio: 4/3; scroll-snap-align: start; }
.un-gal__item.duotone { background: var(--ink); }

/* FAQ (acordeão) */
.un-faq__item { border-top: 1px solid var(--line); }
.un-faq__q { width: 100%; text-align: left; background: none; border: 0; padding: 1.2rem 0; font: inherit; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; gap: 1rem; }
.un-faq__q::after { content: "+"; color: var(--red); }
.un-faq__item.is-open .un-faq__q::after { content: "\2013"; }
.un-faq__a { max-height: 0; overflow: hidden; transition: max-height .3s var(--ease-weight); }
.un-faq__item.is-open .un-faq__a { max-height: 400px; }
.un-faq__a p { padding-bottom: 1.2rem; color: var(--charcoal); max-width: 68ch; }

/* Contato + legal */
.un-contato__list { list-style: none; display: grid; gap: .8rem; }
.un-legal { color: var(--gray); font-size: .82rem; margin-top: 2rem; }
```

- [ ] **Step 2: Adicionar responsivo (escada de breakpoints do projeto)**

```css
@media (max-width: 900px) { .un-cat__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 760px) { .un-nums { grid-template-columns: 1fr 1fr; } .un-nums .un-num:nth-child(3) { grid-column: 1 / -1; } }
@media (max-width: 560px) { .un-cat__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verificar sintaxe do CSS**

Run: `node -e "var c=require('fs').readFileSync('css/pages.css','utf8'); var o=(c.match(/{/g)||[]).length, x=(c.match(/}/g)||[]).length; if(o!==x) throw new Error('chaves desbalanceadas '+o+' vs '+x); console.log('CSS OK', o, 'blocos')"`
Expected: "CSS OK" com contagem balanceada.

- [ ] **Step 4: Commit**

```bash
git add css/pages.css
git commit -m "Adiciona estilos das secoes de unidade (.un-) em pages.css"
```

---

### Task 3: Renderer da landing rica (`js/unidade.js`) + fatia vertical (Robracon Rondonópolis)

**Files:**
- Create: `js/unidade.js`
- Create: `marcas/robracon-rondonopolis.html`
- Reference: `js/marca.js` (padrão de renderer: IIFE, `data-base`, `telLink`, `DOMContentLoaded`, `__revealObserve`), `js/lead.js` (CTAs), `js/main.js` (count-up via `data-count`/`data-suffix`)

**Interfaces:**
- Consumes: `window.UNIDADES` (Task 1), `window.VOCICAL.MARCAS`, `window.CATALOGO`, `VOCICAL.CTA_URL`.
- Produces: monta `#conteudo` a partir de `body[data-unidade]`; funções internas por seção (`hero`, `numeros`, `sobre`, `segmentos`, `produtos`, `servicos`, `diferenciais`, `galeria`, `atuacao`, `faq`, `contato`, `conversao`). CTAs recebem `class="btn btn--cta"` e ids conhecidos (`un-hero-cta`, `un-conv-cta`) para o `lead.js`/`cta.js` interceptarem; `href` = `VOCICAL.CTA_URL`.

- [ ] **Step 1: Escrever `js/unidade.js`**

Seguir o padrão do `js/marca.js`. Ler `data-unidade`, achar `U = UNIDADES[slug]`, `m`/`u` no config, montar seções na ordem do spec, tolerar campos ausentes (galeria vazia, sem cnpj). Count-up: números com `data-count` + `data-suffix`. FAQ: acordeão com listener de clique. Fechar CTAs com `href = VOCICAL.CTA_URL` e ids conhecidos.

```js
/* Renderiza a landing rica de uma unidade a partir de body[data-unidade].
   Depende de config.js, unidades-data.js, catalogo.js. Páginas em /marcas/ usam data-base="../". */
(function () {
  var V = window.VOCICAL || {}, CAT = window.CATALOGO || [], U = (window.UNIDADES || {})[document.body.getAttribute('data-unidade')];
  if (!U) return;
  var m = (V.MARCAS || []).filter(function (x) { return x.slug === U.marcaSlug; })[0] || {};
  var u = (m.unidades || []).filter(function (x) { return x.key === U.unidadeKey; })[0] || {};
  var base = document.documentElement.getAttribute('data-base') || '';
  function p(path) { return path ? base + path : path; }
  function telLink(t) { return 'https://wa.me/55' + (t || '').replace(/\D/g, ''); }
  function esc(s) { return String(s == null ? '' : s); }

  function hero() {
    var selos = (U.hero.selos || []).map(function (s) { return '<span class="un-selo">' + esc(s) + '</span>'; }).join('');
    return '<section class="un-hero grain">' +
      '<div class="duotone"><img src="' + p(u.fachada || m.capaFoto) + '" alt="" aria-hidden="true" loading="eager" fetchpriority="high"></div>' +
      '<div class="container un-hero__inner" data-reveal>' +
        '<div class="un-hero__logo"><img src="' + p(m.logoBranco || m.logo) + '" alt="' + esc(m.nome) + ' ' + esc(u.cidade) + '"></div>' +
        '<span class="eyebrow">' + esc(U.hero.kicker) + '</span>' +
        '<h1 class="un-hero__title">' + U.hero.h1 + '</h1>' +
        '<p class="un-hero__lede">' + esc(U.hero.lede) + '</p>' +
        '<div class="un-hero__selos">' + selos + '</div>' +
        '<a class="btn btn--cta un-hero__cta" id="un-hero-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale com esta unidade</a>' +
      '</div></section>';
  }
  // ... numeros(), sobre(), segmentos(), produtos(), servicos(), diferenciais(), galeria(), atuacao(), faq(), contato(), conversao()
  // (implementar cada uma na ordem do spec, seguindo os padrões de marca.js e as classes da Task 2)

  function faq() {
    if (!U.faq || !U.faq.length) return '';
    var items = U.faq.map(function (f) {
      return '<div class="un-faq__item"><button class="un-faq__q" type="button">' + esc(f.q) + '</button>' +
        '<div class="un-faq__a"><p>' + esc(f.a) + '</p></div></div>';
    }).join('');
    return '<section class="section un-faq-sec"><div class="container"><div class="sec-head" data-reveal>' +
      '<span class="eyebrow">Perguntas frequentes</span><h2 class="display--mass">Dúvidas sobre a <span class="accent">unidade</span></h2></div>' +
      '<div class="un-faq">' + items + '</div></div></section>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var main = document.getElementById('conteudo');
    if (main) main.innerHTML = hero() + numeros() + sobre() + segmentos() + produtos() + servicos() + diferenciais() + galeria() + atuacao() + faq() + contato() + conversao();
    var url = V.CTA_URL || '#';
    ['un-hero-cta', 'un-conv-cta'].forEach(function (id) { var b = document.getElementById(id); if (b) b.href = url; });
    // FAQ acordeão
    document.querySelectorAll('.un-faq__q').forEach(function (q) {
      q.addEventListener('click', function () { q.closest('.un-faq__item').classList.toggle('is-open'); });
    });
    if (window.__revealObserve) window.__revealObserve();
  });
})();
```

Implementar as funções de seção restantes por completo (não deixar comentário `...` no código final). `produtos()` filtra `CAT` pelos slugs em `U.categorias` e renderiza `.un-cat__grid`/`.un-prod`. `numeros()` renderiza `.un-num` com `<span class="un-num__n" data-count="N" data-suffix="suf">`. `galeria()` retorna `''` se `U.galeria` vazio.

- [ ] **Step 2: Criar `marcas/robracon-rondonopolis.html` com `<head>` SEO estático + JSON-LD**

Copiar o scaffold de `marcas/vocical.html`, trocar: `data-unidade="robracon-rondonopolis"` no body (remover `data-marca`), `<title>`/`description`/`canonical`/OG do `U.seo`, incluir `js/unidades-data.js` e `js/unidade.js` (no lugar de `marcas-data.js`+`marca.js` — manter `marcas-data.js` só se necessário; unidade.js não depende dele). Adicionar dois blocos JSON-LD no `<head>`:

```html
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"HardwareStore","name":"Robracon Rondonópolis — Grupo Vocical",
  "image":"https://grupovocical.com.br/Imagens/Capas Unidades/Robracon Rondonopolis.png",
  "url":"https://grupovocical.com.br/marcas/robracon-rondonopolis.html",
  "telephone":"+55-66-3422-8878",
  "address":{"@type":"PostalAddress","streetAddress":"Av. Josefa Machado de Rezende, 2999 - Parque Sagrada Família","addressLocality":"Rondonópolis","addressRegion":"MT","addressCountry":"BR"},
  "areaServed":"Rondonópolis e região",
  "parentOrganization":{"@type":"Organization","name":"Grupo Vocical"},
  "sameAs":["https://instagram.com/grupo.vocical","https://facebook.com/grupovocical","https://www.linkedin.com/company/grupo-vocical"] }
</script>
<script type="application/ld+json">
{ "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
  {"@type":"Question","name":"Onde comprar vergalhão e aço em Rondonópolis?","acceptedAnswer":{"@type":"Answer","text":"..."}}
] }
</script>
```

Scripts na ordem: `config.js` → `unidades-data.js` → `catalogo.js` → `layout.js` → `lead.js` → `unidade.js` → `main.js` → `cta.js`. Manter `noindex, nofollow`.

- [ ] **Step 3: Verificar a página no browser**

Rodar `python -m http.server 8080` na raiz. Usar o agente `web-qa-reviewer` (ou Playwright) em `http://localhost:8080/marcas/robracon-rondonopolis.html`:
- 0 erros de console; nenhuma imagem quebrada.
- Todas as seções renderizam (hero, números com count-up, sobre, segmentos, produtos, serviços, diferenciais, galeria, atuação, FAQ, contato, conversão).
- FAQ abre/fecha ao clicar.
- CTA do hero e da conversão viram botão `.amb` e abrem o modal Vico.
- `<head>`: title/description/canonical corretos; 2 blocos JSON-LD presentes e com JSON válido.
- Responsivo 460/560/760/900px sem quebra.

Expected: todos os itens OK.

- [ ] **Step 4: Commit**

```bash
git add js/unidade.js marcas/robracon-rondonopolis.html
git commit -m "Adiciona renderer de unidade e primeira landing rica (Robracon Rondonopolis)"
```

---

### Task 4: Demais páginas ricas (6 shells)

**Files:**
- Modify: `marcas/vocical.html`, `marcas/jacical.html` (trocar `data-marca`→`data-unidade`, `<head>` SEO+JSON-LD, scripts pro renderer novo)
- Create: `marcas/ello-forte-ribeirao-preto.html`, `marcas/ello-forte-sao-carlos.html`, `marcas/robracon-cuiaba.html`, `marcas/robracon-sinop.html`
- Reference: `marcas/robracon-rondonopolis.html` (Task 3, template de shell)

**Interfaces:**
- Consumes: `js/unidade.js` + `window.UNIDADES` (todas as 7 chaves da Task 1).

- [ ] **Step 1: Upgrade de `marcas/vocical.html` e `marcas/jacical.html`**

Para cada: trocar no `<body>` `data-marca="..."` por `data-unidade="vocical"` (ou `jacical`); atualizar `<head>` (title/description/canonical/OG a partir do respectivo `U.seo`); adicionar os 2 JSON-LD (HardwareStore com endereço/telefone do `config.js` + FAQPage); trocar os scripts para a ordem nova (remover `marca.js`, incluir `unidades-data.js` + `unidade.js`). Manter `noindex`.

- [ ] **Step 2: Criar os 4 shells novos (Ello RP, Ello SC, Robracon Cuiabá, Robracon Sinop)**

Copiar de `robracon-rondonopolis.html`, trocar `data-unidade`, `<head>` e os 2 JSON-LD conforme cada `U.seo`/config. Endereços/telefones vêm do `config.js` (linhas 74-75, 98, 100).

- [ ] **Step 3: Verificar as 6 páginas no browser**

Com `python -m http.server 8080`, abrir cada URL e checar (mesma barra da Task 3, Step 3): 0 erros de console, seções renderizam, JSON-LD válido, responsivo. Conferir especialmente: Ello SC sem galeria (seção some, sem espaço vazio); Cuiabá/Sinop com fachada própria no hero mas galeria da Robracon Rondonópolis; nota de "linhas sob consulta" aparece.
Expected: 6 páginas OK.

- [ ] **Step 4: Commit**

```bash
git add marcas/vocical.html marcas/jacical.html marcas/ello-forte-ribeirao-preto.html marcas/ello-forte-sao-carlos.html marcas/robracon-cuiaba.html marcas/robracon-sinop.html
git commit -m "Constroi as 6 landings ricas restantes por unidade"
```

---

### Task 5: Roteamento por unidade (`config.js` + `layout.js` + `home.js` + `mapa.js`)

**Files:**
- Modify: `js/config.js` (adicionar `pageSlug` nas unidades e nos itens de `UNIDADES_NAV`)
- Modify: `js/layout.js:34` (nav dropdown), `js/layout.js:158` (footer marcas)
- Modify: `js/home.js:60` (CTA do ucard + chips multi-cidade)
- Modify: `js/mapa.js:135` (botão "Ver marca" do painel)

**Interfaces:**
- Produces: helper de rota consistente. Regra: `siteExterno` vence → senão `pageSlug` → senão `slug`.

- [ ] **Step 1: Adicionar `pageSlug` no `config.js`**

Em `MARCAS[].unidades[]`: `vocical`→`pageSlug:'vocical'`; `jacical`→`'jacical'`; ello ribeirao-preto→`'ello-forte-ribeirao-preto'`; ello sao-carlos→`'ello-forte-sao-carlos'`; robracon cuiaba→`'robracon-cuiaba'`; rondonopolis→`'robracon-rondonopolis'`; sinop→`'robracon-sinop'`; distribuidoras (itu/piracicaba/itapetininga)→`pageSlug:'distribuidoras'` nas 3. Em `UNIDADES_NAV[]`: adicionar `pageSlug` correspondente em cada item (RP mantém `siteExterno`, sem pageSlug).

- [ ] **Step 2: Atualizar os 4 pontos de link**

`js/layout.js:34`: `var href = u.siteExterno || p('marcas/' + (u.pageSlug || u.slug) + '.html');`
`js/layout.js:158`: para o footer (itera marcas): usar a primeira unidade com pageSlug, ou manter `m.slug` p/ marcas de 1 página — decisão: no footer, listar por marca continua ok apontando pra `m.slug` das de 1 unidade; para robracon/ello/distribuidoras apontar pra pageSlug da unidade principal (Rondonópolis, Ribeirão Preto, Itu) OU manter agrupado. Implementar: `var href = m.siteExterno || p('marcas/' + (m.unidades && m.unidades[0].pageSlug || m.slug) + '.html');`
`js/home.js:60`: CTA do ucard usa `(m.unidades[0].pageSlug || m.slug)`; e os chips multi-cidade (`.ucard__chip`) recebem `data-page` = pageSlug da cidade, roteando ao clicar. Ver `home.js` render do chip (perto da linha 40-60) e ajustar o handler.
`js/mapa.js:135`: `'marcas/' + esc(u.pageSlug || u.slug) + '.html'` (o objeto `u` do mapa vem de `mapa.js:35`; adicionar `pageSlug: u.pageSlug` no mapeamento da linha 35-38).

- [ ] **Step 3: Verificar navegação no browser**

Com o server, na home (`http://localhost:8080/`):
- Header → dropdown de unidades: cada cidade abre sua página (Robracon Sinop → `robracon-sinop.html`, etc.); RP abre site externo em nova aba.
- Cards de unidades (`#marcas`): chips de cidade da Robracon (3) e Ello (2) abrem páginas distintas; distribuidoras abre `distribuidoras.html`.
- Mapa: clicar num pin e "Ver [marca]" abre a página certa da cidade.
- Footer: links de marca abrem páginas válidas (sem 404).
Expected: todas as rotas corretas; 0 erros de console; nenhum link pra arquivo inexistente.

- [ ] **Step 4: Commit**

```bash
git add js/config.js js/layout.js js/home.js js/mapa.js
git commit -m "Roteia navegacao, cards e mapa por pageSlug de unidade"
```

---

### Task 6: Distribuidoras (sucinta), redirect do RP e limpeza dos combinados

**Files:**
- Modify: `marcas/distribuidoras.html` (garantir que segue no `marca.js`; ajustar `<head>` SEO + JSON-LD leve se desejado)
- Modify: `marcas/rp-cimento-cal.html` (virar redirect meta-refresh pro site externo)
- Delete: `marcas/robracon.html`, `marcas/ello-forte.html`
- Reference: `js/marca.js` (render atual da distribuidoras)

**Interfaces:**
- Consumes: `marca.js` (distribuidoras continua data-driven por `data-marca="distribuidoras"`).

- [ ] **Step 1: Confirmar distribuidoras**

Abrir `http://localhost:8080/marcas/distribuidoras.html`: renderiza as 3 unidades (Itu, Piracicaba, Itapetininga) via `marca.js`, sucinta. Ajustar `<head>` title/description para SEO regional ("material de construção em Itu, Piracicaba e Itapetininga"). Opcional: 1 JSON-LD Organization simples. Manter `noindex`.

- [ ] **Step 2: Redirect do RP**

Substituir o corpo de `marcas/rp-cimento-cal.html` por um redirect seguro:

```html
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="0; url=https://rpcimentoecal.com.br/lp/">
<link rel="canonical" href="https://rpcimentoecal.com.br/lp/">
<title>Rio Preto Cimento e Cal</title></head>
<body><p>Redirecionando para <a href="https://rpcimentoecal.com.br/lp/">rpcimentoecal.com.br</a>.</p></body></html>
```

- [ ] **Step 3: Remover os combinados**

```bash
git rm marcas/robracon.html marcas/ello-forte.html
```

Verificar (grep) que nenhum link aponta mais pra `robracon.html` ou `ello-forte.html`:
Run: `grep -rn "robracon.html\|ello-forte.html" js/ *.html marcas/ || echo "nenhuma referencia"`
Expected: "nenhuma referencia" (ou só ocorrências dentro dos novos pageSlugs tipo `ello-forte-ribeirao-preto.html`, que são OK).

- [ ] **Step 4: Verificar no browser**

RP redireciona; distribuidoras OK; nenhum 404 na navegação da home. Expected: OK.

- [ ] **Step 5: Commit**

```bash
git add marcas/distribuidoras.html marcas/rp-cimento-cal.html
git commit -m "Distribuidoras sucinta, redirect do RP e remove paginas combinadas"
```

---

### Task 7: Checklist de validação + atualização do CLAUDE.md

**Files:**
- Create: `validacao-unidades.md`
- Modify: `CLAUDE.md` (seção "Estado atual" e "Backlog")

**Interfaces:** documentação; sem consumidores de código.

- [ ] **Step 1: Escrever `validacao-unidades.md`**

Agregar todos os campos `validar` das unidades (Task 1) + os pontos de §7 do doc consolidado, organizados por unidade, para o cliente confirmar com os gerentes antes de ligar a indexação. Incluir: CNPJ/razão social por unidade (só Rondonópolis confirmado), m² exatos, serviços por local, mix das unidades finas (Cuiabá/Sinop/Ello SC), frota própria por unidade, corte e dobra de vergalhão na Rondonópolis, drywall exclusivo de Rondonópolis.

- [ ] **Step 2: Atualizar `CLAUDE.md`**

Registrar: páginas de unidade agora são landings ricas por cidade (7) + distribuidoras sucinta + RP redirect; novos arquivos `js/unidades-data.js`, `js/unidade.js`; roteamento por `pageSlug`; pendência = validar conteúdo com gerentes (`validacao-unidades.md`) antes de remover `noindex`.

- [ ] **Step 3: Commit**

```bash
git add validacao-unidades.md CLAUDE.md
git commit -m "Adiciona checklist de validacao por unidade e atualiza CLAUDE.md"
```

---

### Task 8: QA final integrado (todas as páginas)

**Files:** nenhum novo; correções pontuais onde o QA apontar.

- [ ] **Step 1: Rodar QA de browser em todas as páginas de unidade**

Com `python -m http.server 8080`, usar o agente `web-qa-reviewer` no conjunto: as 7 ricas + distribuidoras + o fluxo de navegação da home (dropdown, cards, mapa, footer). Checar por página: 0 erros de console, sem imagem quebrada, todas as seções, CTAs→Vico, JSON-LD válido (validar em https://validator.schema.org copiando o bloco, ou via `node` parseando o `<script type=application/ld+json>`), responsivo 460→900px, superfícies alternando, foto duotone, `noindex` presente.

- [ ] **Step 2: Corrigir findings**

Aplicar correções que o QA levantar (imagens, contraste, quebras responsivas, copy). Commit por correção.

- [ ] **Step 3: Verificação final e resumo**

Confirmar critérios de aceite do spec. Entregar resumo ao usuário: páginas criadas, o que ficou pendente de validação (`validacao-unidades.md`), e o lembrete de que `noindex` só sai no deploy final aprovado.

- [ ] **Step 4: Commit final (se houver correções pendentes)**

```bash
git add -A && git commit -m "Ajustes finais de QA das landings por unidade"
```

---

## Self-Review (feito)

- **Cobertura do spec:** roteamento (T5), dados (T1), renderer (T3), CSS (T2), 7 shells ricos (T3+T4), distribuidoras sucinta + RP redirect (T6), SEO head+JSON-LD (T3/T4/T6), FAQ+schema (T1/T3), galeria com reaproveitamento RO (T1), honestidade+checklist (T1/T7), QA (T8). Todas as seções do spec têm tarefa.
- **Placeholders:** o `...` no exemplo de `unidade.js` é explicitamente marcado como "implementar por completo, sem `...` no código final". Conteúdo por-unidade referencia seções exatas do doc-fonte (não é TBD, é transcrição de fonte citada).
- **Consistência de tipos:** `pageSlug`/`marcaSlug`/`unidadeKey`/`categorias`/`galeria` usados igual em T1 (produz) e T3 (consome). Rota `pageSlug || slug` consistente em T5. Ids de CTA (`un-hero-cta`/`un-conv-cta`) idem T3.
