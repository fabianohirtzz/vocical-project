# Vocical "Peso e Logística" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remodelar a home da Vocical na direção "peso e logística" (composição editorial assimétrica, tipo-massa, foto duotone, motion com peso) e depois codificar o sistema provado nos arquivos da skill `vocical-design`.

**Architecture:** Preservar a camada data-driven (`config.js` → `home.js`). O trabalho é CSS + marcação: novos primitivos de design no `base.css` (compartilháveis), composição da home no `home.css`, e ajustes de marcação nos renderers do `home.js` e no `index.html`. Construir a home primeiro (prova viva), depois espelhar o sistema nos arquivos da skill (modelo NOX: o doc descreve o arquivo real).

**Tech Stack:** HTML + CSS + JS puro, sem build. Archivo / Archivo Black. Verificação por browser (Playwright MCP) + agente `web-qa-reviewer`.

## Global Constraints

- Projeto **não é repo git** → sem commits. Cada tarefa fecha com verificação de browser (screenshot + console limpo), não com `git commit`.
- Stack HTML/CSS/JS puro, **sem framework, sem build**.
- Idioma **PT-BR**. Copy padrão Freela: **sem travessões, sem emoji, números concretos**.
- `<meta name="robots" content="noindex, nofollow">` permanece no `index.html`.
- **Nunca** apagar/sobrescrever a pasta `Imagens/` (artefato do cliente).
- CTA centralizado em `config.js` (`window.VOCICAL.CTA_URL`) — não hardcodar URL.
- Tokens de marca fixos: `--red #a60303`, `--red-dark #730a0a`, `--ink #0d0d0d`, `--charcoal #1a1a1a`, `--paper #f9f9f9`, `--white #ffffff`, `--gray #8a8a8a`.
- Guarda-corpo anti-template (nenhum pode aparecer na home final): hero centralizado empilhado; card mole arredondado com drop-shadow; fade-up uniforme em tudo; ícone emoji; foto stock lavada de fundo; contador isolado flutuando.
- Responsivo obrigatório em ≤1024px e ≤680px; `prefers-reduced-motion` respeitado.

---

## File Structure

| Arquivo | Responsabilidade | Ação |
|---|---|---|
| `css/base.css` | tokens + primitivos compartilhados (tipo-massa, duotone, reveal-com-peso, hairline-grid, eyebrow, ticker keyframes) | Modificar |
| `css/home.css` | composição das 9 seções da home | Reescrever seções |
| `index.html` | marcação estática das seções (hero, medidor, sobre, serviços, conversão) | Modificar |
| `js/home.js` | marcação data-driven (marcas, produtos, parceiros, unidades) | Modificar renderers |
| `js/main.js` | count-up (`data-count`) — reusar; só conferir que cobre o medidor | Verificar |
| skill `references/DESIGN.md` | tokens + tipo-massa + duotone + escada + anti-template | Expandir |
| skill `references/LAYOUT.md` | anatomia da home, ancoragem alternada, grids, responsivo | Criar |
| skill `references/COMPONENTS.md` | medidor, linha-marca, célula-catálogo, bloco-foto-duotone, ticker, bloco-CTA, botões, eyebrow | Criar |
| skill `references/ANIMATIONS.md` | slide-and-settle, count-up, ticker, grão, reduced-motion | Criar |
| skill `references/INSPIRATION.md` | direções criativas + referências + "o que NÃO copiamos" | Criar |
| skill `SKILL.md` | apontar novos refs; cobrir site além de cards | Atualizar |

Caminho da skill: `C:\Users\fabia\.claude\skills\vocical-design\`

---

### Task 1: Primitivos de design no `base.css`

**Files:**
- Modify: `css/base.css`

**Interfaces:**
- Produces (classes/utilitários consumidos pelas tarefas seguintes):
  - `.display--mass` — Archivo Black gigante, `line-height:.9`, tracking negativo, pode sangrar.
  - `.eyebrow` — eyebrow com régua vermelha (variante do `.kicker` existente; manter `.kicker` por compat).
  - `.duotone` — wrapper que renderiza `<img>` filha em duotone charcoal→vermelho com grão.
  - `.hairline-grid` — grade de células soldadas (`gap:1px` sobre `--ink`/`--line`).
  - `[data-reveal="up|left|right"]` — variantes slide-and-settle (estende o reveal atual).
  - `@keyframes ticker-marquee` + `.ticker` — trilha que rola sem emenda.
  - `--ease-weight: cubic-bezier(.2,.7,.2,1)` token de easing "pesado".

- [ ] **Step 1: Adicionar token de easing e escala tipo-massa**

No `:root` do `base.css`, após `--shadow-sm`, adicionar:

```css
  /* Motion */
  --ease-weight: cubic-bezier(.2,.7,.2,1);
```

Após o bloco `.display { ... }`, adicionar:

```css
/* Tipo como massa — manchetes que sangram, números de instrumento */
.display--mass {
  font-family: var(--display); font-weight: 400;
  line-height: .9; letter-spacing: -.03em;
  font-size: clamp(2.8rem, 8vw, 7rem);
  text-transform: none;
}
.num--mass { font-family: var(--display); line-height: .85; letter-spacing: -.02em; }
```

- [ ] **Step 2: Eyebrow com régua (variante coexistindo com `.kicker`)**

O `.kicker` atual já entrega o padrão eyebrow+régua. Em vez de duplicar, definir `.eyebrow` como alias mais forte para uso em superfície escura:

```css
.eyebrow {
  display: inline-flex; align-items: center; gap: .7rem;
  font-size: .78rem; font-weight: 700; letter-spacing: .22em; text-transform: uppercase;
  color: var(--red);
}
.eyebrow::before { content: ""; width: 40px; height: 2px; background: currentColor; }
.surface--dark .eyebrow, .surface--char .eyebrow { color: #ff5a5a; }
```

- [ ] **Step 3: Utilitário duotone**

Adicionar (após `.grain`):

```css
/* Foto tratada como bloco duotone charcoal→vermelho + grão. Uso:
   <div class="duotone"><img src="..." alt="..."></div> */
.duotone { position: relative; overflow: hidden; background: var(--ink); }
.duotone > img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: grayscale(1) contrast(1.05) brightness(.82);
  mix-blend-mode: luminosity;
}
.duotone::before {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(150deg, var(--red) 0%, var(--charcoal) 62%, var(--ink) 100%);
  mix-blend-mode: multiply; opacity: .9;
}
.duotone::after {
  content: ""; position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: .06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

- [ ] **Step 4: Hairline-grid (célula soldada, substitui card mole)**

```css
/* Grade de células soldadas — linguagem de catálogo industrial.
   Cada célula define seu próprio fundo. */
.hairline-grid { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); }
.surface--dark .hairline-grid, .surface--char .hairline-grid { background: var(--line-dark); border-color: var(--line-dark); }
.cell { background: var(--white); transition: background .2s var(--ease-weight); }
.surface--dark .cell, .surface--char .cell { background: var(--ink); }
.cell:hover { background: var(--paper); }
.surface--dark .cell:hover, .surface--char .cell:hover { background: var(--charcoal); }
```

- [ ] **Step 5: Reveal slide-and-settle com direção**

Substituir o bloco `[data-reveal]` atual por variantes direcionais com easing pesado:

```css
[data-reveal] { opacity: 0; transition: opacity .7s var(--ease-weight), transform .7s var(--ease-weight); will-change: transform, opacity; }
[data-reveal="up"], [data-reveal=""] , [data-reveal]:not([data-reveal="left"]):not([data-reveal="right"]) { transform: translateY(34px); }
[data-reveal="left"]  { transform: translateX(-44px); }
[data-reveal="right"] { transform: translateX(44px); }
[data-reveal].is-in { opacity: 1; transform: none; }
```

Manter o bloco `@media (prefers-reduced-motion: reduce)` existente (já zera reveals).

- [ ] **Step 6: Ticker (marquee dos parceiros)**

```css
.ticker { overflow: hidden; }
.ticker__track { display: inline-flex; gap: clamp(2rem,5vw,5rem); align-items: center; white-space: nowrap; animation: ticker-marquee 32s linear infinite; }
.ticker:hover .ticker__track { animation-play-state: paused; }
@keyframes ticker-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .ticker__track { animation: none; } }
```

- [ ] **Step 7: Verificar no browser**

Navegar para o `index.html` local (Playwright `browser_navigate` em `file:///E:/Clientes/Vocical/Site/vocical-project/index.html`), abrir console (`browser_console_messages`).
Expected: página carrega sem novo erro de console; layout ainda intacto (primitivos só adicionados, ainda não aplicados). Tirar screenshot de baseline.

---

### Task 2: Hero assimétrico

**Files:**
- Modify: `index.html` (seção `.hero`)
- Modify: `css/home.css` (bloco HERO)

**Interfaces:**
- Consumes: `.display--mass`, `.eyebrow`, `.duotone`, `.btn` (Task 1 + existentes).
- Produces: estrutura `.hero` em grid 2 colunas assimétrico.

- [ ] **Step 1: Reescrever a marcação do hero no `index.html`**

Trocar o bloco `<section class="hero ...">` por:

```html
<section class="hero surface--dark grain">
  <div class="container hero__grid">
    <div class="hero__text">
      <span class="eyebrow">Grupo Vocical · desde 1987</span>
      <h1 class="display--mass hero__title">O material da obra com <span class="accent">peso</span> e pronta-entrega</h1>
      <p class="lede hero__lede">Distribuição de materiais de construção, aço, drywall e coberturas para lojas, construtoras, serralherias e indústrias. 11 unidades em São Paulo e Mato Grosso, com corte e dobra e frota própria.</p>
      <div class="hero__actions">
        <a class="btn btn--cta" id="hero-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale Conosco</a>
        <a class="btn btn--ghost" href="produtos.html">Ver produtos</a>
      </div>
    </div>
    <div class="hero__media duotone" data-reveal="right">
      <img src="Imagens/corte-e-dobra-de-vergalhao.png" alt="Pátio de corte e dobra de vergalhão do Grupo Vocical">
    </div>
  </div>
</section>
```

- [ ] **Step 2: Reescrever o CSS do hero em `home.css`**

Substituir o bloco `.hero` atual por:

```css
.hero { position: relative; display: flex; align-items: center; min-height: clamp(560px, 88vh, 860px); overflow: hidden; }
.hero__grid { position: relative; z-index: 1; display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(2rem,5vw,5rem); align-items: center; width: 100%; }
.hero__text { padding-block: clamp(64px,10vh,120px); }
.hero__title { margin-top: 1.1rem; max-width: 12ch; }
.hero__lede { margin-top: 1.6rem; max-width: 52ch; color: rgba(255,255,255,.82); }
.hero__actions { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2.2rem; }
.hero__media { align-self: stretch; min-height: 60%; border-radius: 0; aspect-ratio: 4/5; margin-right: calc(var(--gutter) * -1); }
@media (max-width: 1024px) {
  .hero__grid { grid-template-columns: 1fr; }
  .hero__media { display: none; }
}
```

Remover as regras antigas `.hero__bg`, `.hero::before`, `.hero__inner` (substituídas).

- [ ] **Step 3: Verificar no browser**

Navegar para o `index.html`, screenshot do hero em 1440px e em 680px (`browser_resize` + `browser_take_screenshot`).
Expected: título Archivo Black grande à esquerda sangrando, foto duotone vermelha à direita (oculta em 680px), sem hero centralizado. Console limpo.

---

### Task 3: Faixa-medidor (momento de assinatura)

**Files:**
- Modify: `index.html` (seção `.stats` → `.medidor`)
- Modify: `css/home.css` (bloco NÚMEROS → MEDIDOR)
- Verify: `js/main.js` (count-up cobre `data-count`)

**Interfaces:**
- Consumes: `.num--mass`, count-up via `data-count`/`data-suffix` (já em `main.js`).
- Produces: faixa `.medidor` horizontal com divisores hairline.

- [ ] **Step 1: Marcação do medidor no `index.html`**

Trocar a seção `<section class="stats ...">` por:

```html
<section class="medidor surface--char">
  <div class="container medidor__row">
    <div class="medidor__item"><span class="num--mass medidor__num">1987</span><span class="medidor__label">fundação</span></div>
    <div class="medidor__item"><span class="num--mass medidor__num" data-count="35" data-suffix="+">0</span><span class="medidor__label">anos de mercado</span></div>
    <div class="medidor__item"><span class="num--mass medidor__num" data-count="11">0</span><span class="medidor__label">unidades</span></div>
    <div class="medidor__item"><span class="num--mass medidor__num">SP+MT</span><span class="medidor__label">atuação</span></div>
    <div class="medidor__item"><span class="num--mass medidor__num">100%</span><span class="medidor__label">frota própria</span></div>
  </div>
</section>
```

- [ ] **Step 2: CSS do medidor em `home.css`**

Substituir o bloco NÚMEROS/`.stats` por:

```css
.medidor { padding-block: clamp(40px,6vw,72px); border-top: 1px solid var(--line-dark); border-bottom: 1px solid var(--line-dark); }
.medidor__row { display: grid; grid-template-columns: repeat(5, 1fr); }
.medidor__item { padding: .4rem clamp(.6rem,2vw,1.6rem); position: relative; }
.medidor__item + .medidor__item::before { content: ""; position: absolute; left: 0; top: 10%; height: 80%; width: 1px; background: var(--line-dark); }
.medidor__num { display: block; font-size: clamp(2.2rem,4.6vw,3.8rem); color: #fff; }
.medidor__label { display: block; margin-top: .5rem; font-size: .75rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.6); }
@media (max-width: 860px) {
  .medidor__row { grid-template-columns: repeat(2, 1fr); gap: 1.5rem 0; }
  .medidor__item:nth-child(odd)::before { display: none; }
  .medidor__item:nth-child(5) { grid-column: 1 / -1; }
}
```

- [ ] **Step 3: Verificar count-up e visual**

Abrir `index.html`, rolar até o medidor, screenshot.
Expected: faixa charcoal com 5 números grandes (Archivo Black) e divisores verticais finos; `35+` e `11` animam de 0 ao entrar na viewport. Se não animarem, conferir em `main.js` que o observer pega `[data-count]` criados estaticamente (estão no HTML, então deve cobrir). Console limpo.

---

### Task 4: Sobre (split ancorado à esquerda)

**Files:**
- Modify: `index.html` (seção `.sobre`)
- Modify: `css/home.css` (bloco SOBRE)

**Interfaces:**
- Consumes: `.duotone`, `.eyebrow`, `[data-reveal="left|up"]`.

- [ ] **Step 1: Marcação — foto à esquerda, texto à direita**

Na seção `.sobre`, garantir ordem: media primeiro (esquerda), texto depois. Trocar `sobre__media`/`img` para usar duotone:

```html
<section class="section sobre surface--paper">
  <div class="container sobre__grid">
    <div class="sobre__media duotone" data-reveal="left">
      <img src="Imagens/vocical2.jpg" alt="Operação do Grupo Vocical">
    </div>
    <div class="sobre__text" data-reveal="up">
      <span class="eyebrow">Quem somos</span>
      <h2 class="display--mass sobre__title">Três décadas movendo a <span class="accent">construção</span> do interior</h2>
      <p>O Grupo Vocical distribui produtos e soluções para construção civil e indústrias desde 1987. São 11 unidades em São Paulo e Mato Grosso atendendo diversos estados, com um mix completo de materiais de construção, aço, estruturais, coberturas, drywall e agronegócio.</p>
      <p>Atendemos lojas de material de construção, construtoras, incorporadoras, serralherias, calheiros, gesseiros e indústrias com foco em disponibilidade, prazo e atendimento consultivo.</p>
      <a class="btn btn--dark" href="sobre.html">Nossa história</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS — remover sombra/raio da foto, escala de título**

Substituir o bloco SOBRE por:

```css
.sobre__grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(32px,5vw,72px); align-items: center; }
.sobre__media { aspect-ratio: 4/5; }
.sobre__title { margin-top: .8rem; font-size: clamp(2rem,4.4vw,3.6rem); }
.sobre__text p { margin-top: 1.1rem; max-width: 54ch; }
.sobre__text .btn { margin-top: 1.8rem; }
@media (max-width: 820px) { .sobre__grid { grid-template-columns: 1fr; } .sobre__media { order: -1; aspect-ratio: 16/10; } }
```

- [ ] **Step 3: Verificar**

Screenshot da seção sobre em 1440px e 820px.
Expected: foto duotone à esquerda (sem borda arredondada/sombra), título massa à direita, inverte a ancoragem do hero. Console limpo.

---

### Task 5: Marcas — lista editorial numerada

**Files:**
- Modify: `js/home.js` (`renderMarcas`)
- Modify: `css/home.css` (bloco MARCAS)
- Modify: `index.html` (container vira `.hairline-grid`)

**Interfaces:**
- Consumes: `V.MARCAS` (`config.js`), `.hairline-grid`, `.cell`.
- Produces: linhas `.marca-row` numeradas 01..0N.

- [ ] **Step 1: Reescrever `renderMarcas` no `home.js`**

```js
  function renderMarcas() {
    var el = document.getElementById('marcas-grid'); if (!el) return;
    el.innerHTML = (V.MARCAS || []).map(function (m, i) {
      var n = (m.unidades || []).length;
      var sub = cidadesLabel(m);
      var qtd = n > 1 ? (n + ' unidades') : '1 unidade';
      var num = ('0' + (i + 1)).slice(-2);
      return '<a class="cell marca-row" href="marcas/' + m.slug + '.html" data-reveal="up">' +
        '<span class="marca-row__num num--mass">' + num + '</span>' +
        '<span class="marca-row__name">' + m.nome + '</span>' +
        '<span class="marca-row__meta">' + sub + ' · ' + qtd + '</span>' +
        '<span class="marca-row__go" aria-hidden="true">&rarr;</span>' +
        '</a>';
    }).join('');
  }
```

- [ ] **Step 2: Trocar a classe do container no `index.html`**

Na seção MARCAS, trocar `<div class="grid marcas-grid" id="marcas-grid">` por `<div class="hairline-grid marcas-grid" id="marcas-grid">`. Usar `.display--mass` no h2 e `.eyebrow` no kicker da `.sec-head`.

- [ ] **Step 3: CSS das linhas de marca**

Substituir o bloco MARCAS por:

```css
.marcas-grid { grid-template-columns: 1fr; }
.marca-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: clamp(1rem,3vw,2.4rem); padding: clamp(1.1rem,2.2vw,1.8rem) clamp(1.2rem,2.5vw,2rem); }
.marca-row__num { font-size: clamp(1.6rem,3vw,2.4rem); color: var(--gray); width: 2.6ch; }
.surface--dark .marca-row__num { color: rgba(255,255,255,.4); }
.marca-row__name { font-family: var(--display); font-size: clamp(1.3rem,2.4vw,1.9rem); letter-spacing: -.01em; }
.marca-row__meta { font-size: .9rem; color: var(--gray); text-align: right; }
.surface--dark .marca-row__meta { color: rgba(255,255,255,.6); }
.marca-row__go { color: var(--red); transition: transform .25s var(--ease-weight); }
.marca-row:hover .marca-row__go { transform: translateX(6px); }
.marca-row:hover .marca-row__name { color: var(--accent, #ff5a5a); }
@media (max-width: 680px) {
  .marca-row { grid-template-columns: auto 1fr auto; }
  .marca-row__meta { display: none; }
}
```

Garantir que a seção MARCAS use `surface--dark grain` no `index.html` (`<section class="section surface--dark grain marcas" id="marcas">`).

- [ ] **Step 4: Verificar**

Screenshot da seção marcas.
Expected: lista vertical soldada (hairline) com números 01..06 grandes em Archivo Black, nome da marca como tipo display, sem card arredondado. Hover empurra a seta. Console limpo.

---

### Task 6: Produtos — grade hairline de categorias

**Files:**
- Modify: `js/home.js` (`renderProdutos`)
- Modify: `css/home.css` (bloco PRODUTOS)
- Modify: `index.html` (container vira `.hairline-grid`)

**Interfaces:**
- Consumes: `V.CATEGORIAS` (`config.js`), `.hairline-grid`, `.cell`, `.duotone`.

- [ ] **Step 1: Reescrever `renderProdutos`**

```js
  function renderProdutos() {
    var el = document.getElementById('produtos-grid'); if (!el) return;
    el.innerHTML = (V.CATEGORIAS || []).map(function (c, i) {
      var num = ('0' + (i + 1)).slice(-2);
      return '<a class="cell prod-cell" href="produtos.html#' + c.slug + '" data-reveal="up">' +
        '<div class="prod-cell__media duotone"><img src="' + c.img + '" alt="' + c.nome + '" loading="lazy"></div>' +
        '<div class="prod-cell__body">' +
          '<span class="prod-cell__num num--mass">' + num + '</span>' +
          '<h3 class="prod-cell__name">' + c.nome + '</h3>' +
          '<p class="prod-cell__desc">' + (c.desc || '') + '</p>' +
        '</div></a>';
    }).join('');
  }
```

- [ ] **Step 2: Container `.hairline-grid` no `index.html`**

Trocar `<div class="grid produtos-grid" id="produtos-grid">` por `<div class="hairline-grid produtos-grid" id="produtos-grid">`. h2 com `.display--mass`.

- [ ] **Step 3: CSS das células de produto**

Substituir o bloco PRODUTOS por:

```css
.produtos-grid { grid-template-columns: repeat(3, 1fr); }
.prod-cell { display: flex; flex-direction: column; min-height: 320px; }
.prod-cell__media { aspect-ratio: 16/10; flex: 0 0 auto; }
.prod-cell__body { padding: 1.4rem 1.5rem 1.6rem; display: flex; flex-direction: column; gap: .35rem; flex: 1; }
.prod-cell__num { font-size: 1.4rem; color: var(--gray); }
.prod-cell__name { font-family: var(--display); font-size: 1.3rem; }
.prod-cell__desc { font-size: .92rem; color: var(--gray); }
.produtos__cta { margin-top: clamp(28px,4vw,44px); }
@media (max-width: 860px) { .produtos-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .produtos-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Verificar**

Screenshot da seção produtos em 1440px e 540px.
Expected: 6 células soldadas, cada uma com foto duotone no topo + número + nome display; sem card mole flutuante. Console limpo.

---

### Task 7: Serviços — full-bleed duotone ancorado à direita

**Files:**
- Modify: `index.html` (seção `.servicos`)
- Modify: `css/home.css` (bloco SERVIÇOS)

**Interfaces:**
- Consumes: `.duotone`, `.eyebrow`, `[data-reveal]`.

- [ ] **Step 1: Marcação — texto à esquerda, trio de serviços; foto duotone de fundo**

```html
<section class="section surface--dark grain servicos">
  <div class="container servicos__grid">
    <div class="servicos__head" data-reveal="left">
      <span class="eyebrow">Além da distribuição</span>
      <h2 class="display--mass">Serviços que economizam tempo no <span class="accent">canteiro</span></h2>
    </div>
    <div class="servicos__list">
      <article class="servico" data-reveal="up">
        <h3>Corte e dobra de vergalhão e aço</h3>
        <p class="muted">Pilares, colunas, telas, sapatas, treliças, vigas e estribos conforme o projeto, prontos para a obra.</p>
      </article>
      <article class="servico" data-reveal="up">
        <h3>Corte e dobra de chapa e telha</h3>
        <p class="muted">Chapas, calhas e telhas onduladas ou trapezoidais cortadas sob medida para cada aplicação.</p>
      </article>
      <article class="servico" data-reveal="up">
        <h3>Logística com frota própria</h3>
        <p class="muted">Entrega com previsibilidade para manter o abastecimento regular do seu canteiro.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS — split com lista numerada, sem cards de imagem soltos**

Substituir o bloco SERVIÇOS por:

```css
.servicos__grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(2rem,5vw,5rem); align-items: start; }
.servicos__list { display: grid; gap: 0; }
.servico { padding: clamp(1.4rem,2.5vw,2rem) 0; border-top: 1px solid var(--line-dark); }
.servico:first-child { border-top: 0; }
.servico h3 { font-family: var(--display); font-size: clamp(1.2rem,2.2vw,1.6rem); }
.servico p { margin-top: .5rem; max-width: 56ch; }
@media (max-width: 900px) { .servicos__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verificar**

Screenshot da seção serviços.
Expected: cabeçalho display à esquerda, lista de 3 serviços separados por hairline à direita, fundo escuro com grão; ancoragem oposta ao sobre. Console limpo.

---

### Task 8: Parceiros — ticker industrial

**Files:**
- Modify: `js/home.js` (`renderParceiros`)
- Modify: `css/home.css` (bloco PARCEIROS)
- Modify: `index.html` (estrutura do ticker)

**Interfaces:**
- Consumes: `V.PARCEIROS` (`config.js`), `.ticker`, `.ticker__track`.

- [ ] **Step 1: Reescrever `renderParceiros` (trilha duplicada p/ loop sem emenda)**

```js
  function renderParceiros() {
    var el = document.getElementById('parceiros-grid'); if (!el) return;
    var items = (V.PARCEIROS || []).map(function (p) {
      return '<div class="parceiro"><img src="' + p.logo + '" alt="' + p.nome + '" loading="lazy"></div>';
    }).join('');
    el.innerHTML = items + items; // duplica a trilha p/ translateX(-50%) sem corte
  }
```

- [ ] **Step 2: Marcação do ticker no `index.html`**

Trocar `<div class="parceiros-grid" id="parceiros-grid" data-reveal></div>` por:

```html
<div class="ticker"><div class="ticker__track" id="parceiros-grid"></div></div>
```

- [ ] **Step 3: CSS do parceiro dentro do ticker**

Substituir o bloco PARCEIROS por:

```css
.parceiro { flex: 0 0 auto; height: 64px; display: grid; place-items: center; padding: 0 .5rem; }
.parceiro img { max-height: 42px; max-width: 160px; object-fit: contain; filter: grayscale(1); opacity: .65; transition: filter .25s ease, opacity .25s ease; }
.parceiro:hover img { filter: none; opacity: 1; }
```

- [ ] **Step 4: Verificar**

Abrir `index.html`, screenshot + observar o ticker rolando (`browser_wait_for` 2s, segundo screenshot mostra deslocamento).
Expected: logos rolam horizontalmente em loop contínuo, pausam no hover. Console limpo.

---

### Task 9: Unidades — lista pesada

**Files:**
- Modify: `js/home.js` (`renderUnidades`)
- Modify: `css/home.css` (bloco UNIDADES)

**Interfaces:**
- Consumes: `V.MARCAS[].unidades` (`config.js`).

- [ ] **Step 1: Manter `renderUnidades` mas alinhar classes ao novo sistema**

Manter a estrutura atual (`.unidade-row`), apenas garantir que cada linha use `data-reveal="up"` (já usa `data-reveal`). Nenhuma mudança de JS obrigatória além de trocar `data-reveal` para `data-reveal="up"` na string.

- [ ] **Step 2: CSS — número de ordem + tipografia pesada na cidade**

Ajustar o bloco UNIDADES (sem arredondar, manter a faixa vermelha no hover):

```css
.unidades-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 clamp(28px,4vw,56px); }
.unidade-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 1rem; padding: 1.15rem .2rem; border-bottom: 1px solid var(--line); transition: padding .2s var(--ease-weight), background .2s ease; }
.unidade-row:hover { padding-inline: .9rem; background: linear-gradient(90deg, rgba(166,3,3,.06), transparent); }
.unidade-row__city { font-family: var(--display); font-size: 1.1rem; }
.unidade-row__uf { color: var(--gray); }
.unidade-row__brand { font-size: .8rem; letter-spacing: .06em; text-transform: uppercase; color: var(--red); font-weight: 700; }
.unidade-row__go { color: var(--gray); transition: transform .2s var(--ease-weight), color .2s ease; }
.unidade-row:hover .unidade-row__go { transform: translateX(5px); color: var(--red); }
@media (max-width: 720px) { .unidades-list { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Verificar**

Screenshot da seção unidades.
Expected: duas colunas de linhas com cidade em Archivo Black, faixa vermelha no hover; coerente com o resto. Console limpo.

---

### Task 10: Conversão — bloco vermelho com peso

**Files:**
- Modify: `index.html` (seção `.conversao`)
- Modify: `css/home.css` (bloco CONVERSÃO)

**Interfaces:**
- Consumes: `.display--mass`, `.btn--light`, CTA via `conv-cta`.

- [ ] **Step 1: Marcação — composição assimétrica (não centralizada)**

```html
<section class="section surface--red conversao">
  <div class="container conversao__grid" data-reveal="up">
    <div class="conversao__text">
      <h2 class="display--mass conversao__title">Precisa de material para a obra ou um orçamento técnico?</h2>
      <p class="conversao__sub">Fale com o time do Grupo Vocical e receba atendimento consultivo e resposta ágil.</p>
    </div>
    <a class="btn btn--light btn--lg" id="conv-cta" target="_blank" rel="noopener"><span class="btn__ic" aria-hidden="true">›</span> Fale Conosco</a>
  </div>
</section>
```

- [ ] **Step 2: CSS — split alinhado à base, não center**

Substituir o bloco CONVERSÃO por:

```css
.conversao__grid { display: grid; grid-template-columns: 1.4fr auto; gap: clamp(2rem,5vw,4rem); align-items: end; }
.conversao__title { font-size: clamp(2rem,4.4vw,3.4rem); max-width: 18ch; }
.conversao__sub { margin-top: 1rem; font-size: 1.1rem; color: rgba(255,255,255,.9); max-width: 48ch; }
@media (max-width: 760px) { .conversao__grid { grid-template-columns: 1fr; align-items: start; } }
```

- [ ] **Step 3: Verificar**

Screenshot da seção conversão.
Expected: bloco vermelho com título massa à esquerda e CTA à direita alinhado à base; não centralizado. Console limpo.

---

### Task 11: QA de browser completo + correções

**Files:**
- Modify: conforme findings.

- [ ] **Step 1: Rodar o agente `web-qa-reviewer`**

Dispatch do agente `web-qa-reviewer` apontando para `file:///E:/Clientes/Vocical/Site/vocical-project/index.html`, pedindo auditoria do launch-checklist: console, imagens quebradas, responsividade (1440/1024/680), CTAs/WhatsApp, alt/headings, reduced-motion.

- [ ] **Step 2: Conferir o guarda-corpo anti-template manualmente**

Checklist (todos devem passar):
- [ ] Hero é assimétrico, não centralizado empilhado.
- [ ] Nenhuma seção usa card arredondado com drop-shadow (cards viraram células hairline).
- [ ] Fundos alternam (dark → char → paper → dark → paper → dark → paper → red).
- [ ] Reveal tem direção/peso, não fade-up uniforme.
- [ ] Fotos estão em duotone (não fundo lavado).
- [ ] Números são massa tecida (medidor como instrumento), não contador solto genérico.
- [ ] Sem emoji; copy sem travessão.

- [ ] **Step 3: Aplicar correções dos findings e revalidar**

Corrigir cada finding de severidade alta/média; re-screenshot das seções afetadas. Expected: 0 erro de console, 0 imagem quebrada, 3 itens "que um template nunca faria" identificáveis (hero assimétrico, faixa-medidor, grade hairline numerada).

---

### Task 12: Codificar o sistema provado na skill `vocical-design`

**Files:**
- Modify: `C:\Users\fabia\.claude\skills\vocical-design\references\DESIGN.md`
- Create: `...\references\LAYOUT.md`
- Create: `...\references\COMPONENTS.md`
- Create: `...\references\ANIMATIONS.md`
- Create: `...\references\INSPIRATION.md`
- Modify: `...\SKILL.md`

**Interfaces:**
- Consumes: o CSS/HTML real já validado na home (espelhar valores exatos, modelo NOX).

- [ ] **Step 1: Expandir `DESIGN.md`**

Acrescentar seções: tokens (já existem — confirmar), **tipo-massa** (`.display--mass`, escala clamp, tracking, regra "uma palavra em vermelho"), **escada de superfícies** (ink→charcoal→paper→white + regra de alternância), **receita duotone** (o CSS exato da Task 1 Step 3), **regras anti-template** (a lista do guarda-corpo). Cada regra com o valor real do `base.css`.

- [ ] **Step 2: Criar `LAYOUT.md`**

Espelhar a anatomia real: as 9 seções da home na ordem final, a regra de **ancoragem alternada** (hero dir → sobre esq → serviços dir), a **escada de fundos** por seção, os templates de grid (`hairline-grid`, split assimétrico, ticker), o **breakpoint ladder** real (1024/820/680/540) e o responsivo por seção. Abrir com nota "Mirrors `index.html` + `css/home.css`".

- [ ] **Step 3: Criar `COMPONENTS.md`**

Anatomia de cada componente construído, com o HTML+CSS real: `.eyebrow`, `.btn*`, `.duotone`, `.hairline-grid`/`.cell`, `.medidor`, `.marca-row`, `.prod-cell`, `.servico` (lista), `.ticker`, `.unidade-row`, bloco `.conversao`. Para cada: o que é, como usar, do que depende.

- [ ] **Step 4: Criar `ANIMATIONS.md`**

Documentar: reveal **slide-and-settle** direcional (`--ease-weight`, as variantes up/left/right), o **count-up** do medidor (`data-count`/`data-suffix` + observer em `main.js`), o **ticker** (trilha duplicada + `translateX(-50%)`), o **grão** (`.grain`), e o bloco `prefers-reduced-motion`. Regra: "sem loader, sem cursor custom".

- [ ] **Step 5: Criar `INSPIRATION.md`**

Seguir o molde do NOX: direções criativas (sistemas industriais/peso, catálogo técnico, editorial bold) com referências e **mecânica-a-estudar**; uma tabela de biblioteca-atalho; e a seção **"o que NÃO copiamos"** (hero centralizado, card mole, fade-up uniforme, foto stock lavada, contador solto, emoji). Fechar com "quando o usuário pede algo novo".

- [ ] **Step 6: Atualizar `SKILL.md`**

Acrescentar à descrição/corpo que a skill cobre **composição de site** (não só cards de Instagram), listar os novos refs e quando ler cada um. Manter `CARDS.md`/`PIPELINE.md` como o pipeline de Instagram.

- [ ] **Step 7: Verificar coerência skill ↔ home**

Reler `LAYOUT.md`/`COMPONENTS.md` e conferir, abrindo `base.css`/`home.css`, que cada valor citado bate com o código real (nomes de classe, ordem das seções, breakpoints). Corrigir divergências.

---

## Self-Review

**Spec coverage:**
- Entregável 1 (sistema na skill) → Task 12 (todos os 5 arquivos + SKILL.md). ✓
- Entregável 2 (remodel home) → Tasks 2–10 (9 seções) + Task 1 (primitivos) + Task 11 (QA). ✓
- Direção "peso e logística" (assimetria, tipo-massa, duotone, motion com peso) → Tasks 1–10. ✓
- Critério "faixa-medidor como assinatura" → Task 3. ✓
- Critério "teste do dono (3 coisas)" → Task 11 Step 3. ✓
- Critério QA de browser → Task 11. ✓
- Preservar data-driven → Tasks 5/6/8/9 só mexem em marcação dos renderers, não nos dados. ✓

**Placeholder scan:** sem TBD/TODO; todo passo de CSS/JS mostra o código real. ✓

**Type consistency:** classes definidas na Task 1 (`.display--mass`, `.eyebrow`, `.duotone`, `.hairline-grid`/`.cell`, reveal direcional, `.ticker`/`.ticker__track`, `--ease-weight`) são as mesmas consumidas nas Tasks 2–10 e documentadas na Task 12. `renderParceiros` duplica a trilha (Task 8) consistente com `.ticker__track` translateX(-50%) do CSS (Task 1). ✓
