# Incremento 1 — Base visual + Header/Footer + Home (hub) — Plano de Implementação

> **Para workers:** plano de build front-end estático. Verificação por navegador
> (render + responsivo) e, ao final, subagent `web-qa-reviewer`. Steps com checkbox.

**Goal:** Entregar a base visual do site (tokens, tipografia, reset), o header e o
footer compartilhados, e a home (hub do grupo) completa, publicados em preview no
GitHub Pages.

**Architecture:** HTML/CSS/JS puro, multipágina, sem build. CSS base único
(`css/base.css`) com tokens + reset + utilitários + componentes. Header e footer
injetados por `js/layout.js` (fonte de verdade única, sem CORS/fetch). Destino de
CTA centralizado em `js/config.js`. Home montada como seções estáticas em `index.html`.

**Tech Stack:** HTML5 semântico, CSS3 (custom properties, grid/flex, clamp), JS ES6
vanilla. Fonte Archivo (woff2 local em `fonts/` ou Google Fonts). Sem dependências.

## Global Constraints

- Stack: HTML/CSS/JS puro, sem framework, sem build. Sobe estático via FTP.
- Copy: português BR, **sem travessões, sem emojis, números concretos**.
- Tokens de marca (exatos): `--red:#a60303` · `--red-dark:#730a0a` · `--ink:#0d0d0d`
  · `--charcoal:#1a1a1a` · `--paper:#f9f9f9` · `--white:#ffffff` · `--gray:#8a8a8a`.
- Tipografia: Archivo (Black para display/números; variável para títulos/corpo).
- Direção: meio-termo equilibrado (base clara + momentos de impacto industrial).
- CTA (por enquanto) aponta para:
  `https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b`
  Definido UMA vez em `js/config.js` (`CTA_URL`).
- Preview com `<meta name="robots" content="noindex">` em todas as páginas até aprovação.
- Mobile-first. Imagens com `alt`. Não alterar a pasta `Imagens/` (conteúdo do cliente).
- Fonte de conteúdo: `referencia-conteudo.md` (grupo/produtos) e `referencia-unidades.md` (unidades).

---

### Task 1: Esqueleto de pastas, config e fontes

**Files:**
- Create: `css/base.css`, `js/config.js`, `js/layout.js`, `js/main.js`, `index.html`
- Create: `fonts/` (Archivo woff2) ou usar Google Fonts via `<link>` (decidir no Step 1)
- Create: `assets/` para logos/ícones recortados se necessário

**Interfaces:**
- Produces: `window.VOCICAL.CTA_URL` (string), `window.VOCICAL.WHATSAPP` (string),
  `window.VOCICAL.UNIDADES` (array de marcas/unidades para footer e cards).

- [ ] **Step 1: Escolher fonte.** Preferir Archivo local em `fonts/` (offline-safe no
  erehost). Se não houver woff2 à mão, usar Google Fonts:
  `Archivo:wght@400;500;600;700` + `Archivo+Black` via `<link preconnect>`. Registrar a escolha.
- [ ] **Step 2: Criar `js/config.js`** com objeto global:
```js
window.VOCICAL = {
  CTA_URL: 'https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b',
  WHATSAPP: 'https://wa.me/5566999393953',
  EMAIL: 'contato@grupovocical.com.br',
  SOCIAL: { instagram:'https://instagram.com/grupo.vocical', facebook:'https://facebook.com/grupovocical', linkedin:'https://www.linkedin.com/company/grupo-vocical' }
};
```
- [ ] **Step 3: Criar `css/base.css`** com `:root` (tokens acima), reset moderno
  (box-sizing, margin 0, img max-width:100%), escala tipográfica fluida com `clamp()`,
  classes utilitárias (`.container` max-width ~1200px, `.section`, `.kicker`, `.accent`,
  `.btn`, `.btn--cta`), e estilos de superfície (`.surface--dark`, `.surface--red`).
- [ ] **Step 4: Criar `index.html`** mínimo: `<head>` com charset, viewport, title,
  meta description, OG, canonical, **noindex**, link para `css/base.css` e fontes;
  `<body>` com `<div id="site-header"></div>`, `<main>…</main>`, `<div id="site-footer"></div>`,
  e scripts `config.js`, `layout.js`, `main.js` antes de `</body>`.
- [ ] **Step 5: Verificar** abrindo via Live Server: página carrega, tokens aplicados
  (fundo `--paper`, fonte Archivo). Sem erros no console.
- [ ] **Step 6: Commit** `feat: base visual (tokens, fontes, config, esqueleto da home)`.

---

### Task 2: Header compartilhado (js/layout.js)

**Files:**
- Modify: `js/layout.js`, `css/base.css`

**Interfaces:**
- Consumes: `window.VOCICAL`.
- Produces: `renderHeader()` injeta em `#site-header`; chamado em `DOMContentLoaded`.

- [ ] **Step 1:** Em `layout.js`, escrever `renderHeader()` que monta: logo Vocical
  (de `Imagens/Vocical/` ou `Imagens/Marcas/`), nav (Início, Marcas, Produtos, Sobre,
  Contato) e um `.btn--cta` "Fale Conosco" → `VOCICAL.CTA_URL`. Inserir como template string.
- [ ] **Step 2:** CSS do header em `base.css`: barra sticky, fundo claro com leve
  sombra ao rolar, layout flex, espaçamento generoso.
- [ ] **Step 3:** Menu responsivo: botão hambúrguer < 900px que abre/fecha a nav
  (toggle de classe via JS em `layout.js`). Acessível (`aria-expanded`, foco).
- [ ] **Step 4:** Verificar desktop e mobile (DevTools responsive): nav visível no
  desktop, hambúrguer funcional no mobile, CTA abre o link correto em nova aba.
- [ ] **Step 5: Commit** `feat: header compartilhado responsivo`.

---

### Task 3: Footer compartilhado (js/layout.js)

**Files:**
- Modify: `js/layout.js`, `css/base.css`

**Interfaces:**
- Consumes: `window.VOCICAL`.
- Produces: `renderFooter()` injeta em `#site-footer`.

- [ ] **Step 1:** `renderFooter()` (superfície escura `--ink`): colunas com sobre curto
  do grupo, links de navegação, marcas, contato (e-mail, WhatsApp), redes sociais,
  e linha legal (razão social + CNPJ de `referencia-conteudo.md`). Sem emojis.
- [ ] **Step 2:** CSS do footer (grid responsivo, texto branco/gray, acento vermelho nos links hover).
- [ ] **Step 3:** Verificar render e links (mailto, wa.me, redes) em desktop e mobile.
- [ ] **Step 4: Commit** `feat: footer compartilhado`.

---

### Task 4: Home — Hero (escuro)

**Files:** Modify: `index.html`, `css/base.css` (+ `css/home.css` se preferir isolar a home)

- [ ] **Step 1:** Seção hero `.surface--dark` com grão sutil: kicker ("Desde 1987"),
  headline com 1 palavra em `.accent` vermelho (ex: proposta de valor sobre distribuição
  de materiais e aço para obra), subtexto curto, `.btn--cta` "Fale Conosco" → CTA_URL,
  e imagem de fundo de `Imagens/` (ex: `back1.jpg`) com scrim para contraste.
- [ ] **Step 2:** CSS: altura ~80vh, gradiente/scrim sobre a foto, tipografia display
  Archivo Black, responsivo (texto reflui no mobile).
- [ ] **Step 3:** Verificar contraste do texto sobre a foto e responsividade.
- [ ] **Step 4: Commit** `feat: home hero`.

---

### Task 5: Home — Faixa de números

**Files:** Modify: `index.html`, `css/base.css`

- [ ] **Step 1:** Faixa (clara ou escura para ritmo) com 4 números concretos: "1987"
  (fundação), "35+" anos, "11" unidades, "SP + MT" atuação. Archivo Black grande + label.
- [ ] **Step 2:** CSS grid 4 colunas (2x2 no mobile), divisores sutis.
- [ ] **Step 3:** Verificar responsivo. **Commit** `feat: home faixa de numeros`.

---

### Task 6: Home — O que é o grupo

**Files:** Modify: `index.html`

- [ ] **Step 1:** Seção clara: kicker + título + parágrafo institucional (base em
  `referencia-conteudo.md`, ajustado à regra Freela) + imagem de apoio. Sem travessões/emojis.
- [ ] **Step 2:** Verificar. **Commit** `feat: home sobre o grupo`.

---

### Task 7: Home — 6 marcas em cards

**Files:** Modify: `index.html`, `css/base.css`

**Interfaces:**
- Produces: cards linkam para `marcas/<slug>.html` (páginas ainda não existem; links
  preparados, alvo construído no incremento 2). Slugs: `vocical`, `jacical`,
  `ello-forte`, `rp-cimento-cal`, `robracon`, `distribuidoras`.

- [ ] **Step 1:** Grid de 6 cards (logo/foto da marca de `Imagens/Marcas/` ou pasta da
  marca, nome, cidade[s], link "Conhecer"). Hover com acento vermelho.
- [ ] **Step 2:** CSS grid responsivo (3→2→1 colunas). Cards com profundidade sutil.
- [ ] **Step 3:** Verificar. **Commit** `feat: home cards de marcas`.

---

### Task 8: Home — Produtos em destaque

**Files:** Modify: `index.html`

- [ ] **Step 1:** Grid das 6 categorias (Materiais de Construção, Aço, Estruturais,
  Coberturas, Drywall, Agronegócio) com ícone/foto de `Imagens/Produtos/` e link
  preparado para `produtos.html#<cat>`.
- [ ] **Step 2:** Verificar. **Commit** `feat: home produtos em destaque`.

---

### Task 9: Home — Serviços (corte e dobra, frota)

**Files:** Modify: `index.html`

- [ ] **Step 1:** Seção (pode ser `.surface--dark` para impacto) com 3 destaques:
  corte e dobra de vergalhão/aço, corte e dobra de chapa/telha, logística com frota
  própria. Usar `Imagens/corte-e-dobra-*`. Copy de `referencia-conteudo.md`.
- [ ] **Step 2:** Verificar. **Commit** `feat: home servicos`.

---

### Task 10: Home — Parceiros

**Files:** Modify: `index.html`

- [ ] **Step 1:** Faixa de logos de fornecedores (Gerdau, ArcelorMittal, CSN,
  Votorantim, Usiminas, Brasilit, Placo, Quartzolit) de `Imagens/Marcas/`. Grid/marquee
  discreto, fundo claro, logos em escala de cinza com cor no hover (opcional).
- [ ] **Step 2:** Verificar. **Commit** `feat: home parceiros`.

---

### Task 11: Home — Unidades + bloco de conversão + WhatsApp flutuante

**Files:** Modify: `index.html`, `css/base.css`, `js/main.js`

- [ ] **Step 1:** Seção "Unidades" — lista resumida das 11 unidades (cidade/UF) a partir
  de `VOCICAL.UNIDADES`, com link para a página da marca. (Mapa Google entra depois,
  como melhoria — registrar no backlog.)
- [ ] **Step 2:** Bloco de conversão final `.surface--red`: chamada forte + `.btn`
  "Fale Conosco" → CTA_URL. Este é o destino que troca pelo widget depois.
- [ ] **Step 3:** Botão WhatsApp flutuante (canto inferior direito) → `VOCICAL.WHATSAPP`,
  em `main.js` (injetado em todas as páginas) ou no layout. Acessível, com `aria-label`.
- [ ] **Step 4:** Verificar tudo no desktop e mobile, console limpo.
- [ ] **Step 5: Commit** `feat: home unidades, conversao e whatsapp flutuante`.

---

### Task 12: SEO da home + publicar preview + QA

**Files:** Modify: `index.html`; Create: `robots.txt`, `sitemap.xml`, `assets/og-image` (se houver)

- [ ] **Step 1:** Conferir `<head>` da home: title descritivo, meta description,
  canonical, OG (title/description/image/url), `noindex`. `robots.txt` com `Disallow: /`
  durante preview.
- [ ] **Step 2:** `git push` para `main` → GitHub Pages publica.
- [ ] **Step 3:** Confirmar no ar em `https://fabianohirtzz.github.io/vocical-project/`.
- [ ] **Step 4:** Rodar subagent **web-qa-reviewer** contra a URL: console, links,
  responsivo, CTAs/WhatsApp, SEO on-page, contraste/a11y. Corrigir findings de severidade alta.
- [ ] **Step 5: Commit** correções e `git push`.

---

## Backlog (registrar, fora do incremento 1)
- Mapa Google das unidades (Task 11) — melhoria pós-base.
- Logos de parceiros em alta resolução se as atuais estiverem pequenas.
- Otimização/compressão de imagens grandes antes do deploy final.
