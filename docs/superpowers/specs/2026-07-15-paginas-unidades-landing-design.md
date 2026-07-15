# Landing pages por unidade — Grupo Vocical

> Spec de design. Data: 2026-07-15. Fonte de copy/mix: `grupo-vocical-produtos-servicos-por-unidade.md`.
> Design system: skill `vocical-design` (direção "peso e logística"). Regras: `CLAUDE.md`.

## Objetivo

Transformar as páginas de marca (hoje 6 shells data-driven via `marca.js`) em **landing pages
completas por unidade**, com SEO local por cidade, foco em geração de lead B2B. Cada unidade
mira palavras-chave reais de produto/serviço + cidade no Google.

## Decisões do cliente (2026-07-15)

1. **Uma página dedicada e rica por cidade** para: Vocical (Votuporanga), Jacical (Jales),
   Ello Forte Ribeirão Preto, Ello Forte São Carlos, Robracon Cuiabá, Robracon Rondonópolis,
   Robracon Sinop. **7 páginas ricas.**
2. **Distribuidoras:** 1 página só, as 3 unidades (Itu, Piracicaba, Itapetininga) juntas,
   **sucinta** — não é foco de marketing.
3. **Rio Preto Cimento e Cal:** sem página; tudo redireciona pro site externo deles (já é assim).
4. **FAQ + schema FAQPage** por unidade rica.
5. **Galeria:** cada Robracon usa a própria fachada; Cuiabá e Sinop reaproveitam as fotos de
   galeria da Robracon Rondonópolis (acervo `Imagens/Robracon ROO/robracon1 (*).png`) para o
   restante das imagens (a fachada continua sendo a de cada cidade).

## Arquitetura e roteamento

### Chave de rota por unidade (`pageSlug`)

Campo novo `pageSlug` em cada unidade no `config.js` (fonte única de rota). Onde não houver
`pageSlug`, cai no comportamento atual (`m.slug`).

| Marca | Unidade (key) | pageSlug | Arquivo |
|---|---|---|---|
| vocical | votuporanga | `vocical` | `marcas/vocical.html` (upgrade) |
| jacical | jales | `jacical` | `marcas/jacical.html` (upgrade) |
| ello-forte | ribeirao-preto | `ello-forte-ribeirao-preto` | novo |
| ello-forte | sao-carlos | `ello-forte-sao-carlos` | novo |
| robracon | cuiaba | `robracon-cuiaba` | novo |
| robracon | rondonopolis | `robracon-rondonopolis` | novo |
| robracon | sinop | `robracon-sinop` | novo |
| distribuidoras | itu/piracicaba/itapetininga | `distribuidoras` (as 3) | `marcas/distribuidoras.html` (mantém) |
| rp-cimento-cal | rio-preto | — (siteExterno) | redirect |

### Pontos de link que passam a usar `u.pageSlug`

- `js/layout.js:34` — dropdown de unidades no header (usa `u.slug` hoje).
- `js/layout.js:158` — lista de marcas no footer (usa `m.slug` hoje).
- `js/home.js:60` — CTA "Ver unidade" dos cutout cards; **cards multi-cidade** (Ello 2, Robracon 3)
  precisam rotear cada chip/CTA pra sua página.
- `js/mapa.js:135` — botão "Ver marca" do painel do mapa.

Regra do resolver: `siteExterno` vence (RP externo) → senão `u.pageSlug` → senão `m.slug`.

### Camada de dados e render

- **Novo `js/unidades-data.js`** — conteúdo editorial + SEO por unidade, keyed por `pageSlug`.
  Campos por unidade: `hero` (kicker/h1/lede/selos), `numeros` (stats confirmados), `sobre`
  (narrativa + história), `segmentos`, `categorias` (mix do catálogo que a unidade trabalha),
  `servicos` (com benefícios), `diferenciais`, `galeria` (lista de imagens; Cuiabá/Sinop apontam
  pro acervo de RO), `atuacao` (região + logística), `faq` (4-6 Q&A), `cnpj`/`razaoSocial`
  (só onde confirmado), `validar` (lista de itens a confirmar com gerente).
- **Novo `js/unidade.js`** — renderer da landing rica: lê `body[data-unidade]` (pageSlug), acha
  a marca+unidade no `VOCICAL.MARCAS`, cruza com `unidades-data.js` e `CATALOGO`, monta as seções.
- **Distribuidoras** continua no `js/marca.js` atual (já é uma página sucinta que lista unidades).
- Produtos vêm do `window.CATALOGO` existente, filtrados pelas `categorias` da unidade.

## Anatomia da página rica (escada de superfícies alternada)

Ordem e superfícies (alterna claro → vermelho-escuro → vermelho, sem duas iguais adjacentes):

1. **Hero de unidade** (`.un-hero`, foto fachada duotone + gradiente, conteúdo na base) — logo da
   unidade, kicker cidade/UF, `<h1>` com keyword real + cidade, selos de confiança (desde/estrutura/
   pronta-entrega/frota conforme a unidade), CTA → Vico.
2. **Faixa de números** (`.medidor` ou `.sobre__stats`, count-up) — só números confirmados.
3. **Sobre a unidade** (`.sobre__grid`, foto duotone à esquerda `data-reveal="left"`).
4. **Segmentos atendidos** (`.hairline-grid` de `.cell`).
5. **Produtos por categoria** — mix real da unidade (blocos por categoria com itens do catálogo).
   Miolo de SEO: cada item é uma keyword.
6. **Serviços especializados** (`surface--red`/`--dark grain`) — corte e dobra de vergalhão,
   corte e dobra de chapas, telhas sob medida, drywall/laser onde se aplica, com benefícios.
7. **Diferenciais** (`.feat`, `surface--paper`).
8. **Galeria** (image-expansion/`.duotone`) — só onde há acervo (todas menos Ello SC).
9. **Área de atuação e logística** — região + ressalva de frota própria (varia por unidade).
10. **FAQ** (`.un-faq` + JSON-LD FAQPage) — 4-6 perguntas long-tail.
11. **Contato da unidade** — endereço, WhatsApp, e-mail + CTA.
12. **Conversão** (`surface--red` + botão anti-metal `.amb`) → Vico. Razão social/CNPJ só onde confirmado.

### Variações por riqueza de conteúdo

- **Ricas plenas** (Vocical, Jacical, Ello RP, Robracon Rondonópolis): mix e serviços detalhados
  do doc; galeria própria; números confirmados onde houver.
- **Robracon Cuiabá / Sinop:** visual rico (fachada própria + galeria de RO). Mix confirmado =
  construção + aço; linhas mais amplas da Robracon aparecem como "linha Robracon, disponibilidade
  sob consulta na unidade" (honesto, marcado em `validar`).
- **Ello Forte São Carlos:** rica mas sem galeria (só fachada + sobre); mix construção + aço.
- **Distribuidoras (sucinta):** hero + intro curta + 3 cards de unidade + essenciais + conversão.

## SEO

- `<head>` **estático** por unidade (robusto a crawler): `title` com keyword+cidade na frente,
  `meta description` rica (~150 char), `link canonical` (domínio final `grupovocical.com.br`),
  OG/Twitter, `theme-color`.
- **JSON-LD por unidade no HTML estático:**
  - `LocalBusiness`/`HardwareStore`: `name`, `address` (do config), `telephone`, `areaServed`
    (cidades), `parentOrganization` = Grupo Vocical, `sameAs` (redes do config).
  - `FAQPage`: as perguntas da unidade.
- Keywords reais nos `<h1>/<h2>` e nos `alt` de imagem (produto + cidade). Sem meta keywords.
- **`noindex, nofollow` permanece** enquanto for preview (regra do projeto). Todo o SEO fica
  montado; no deploy final na erehost, remover o `noindex` liga a indexação. Entregar aviso.

## Honestidade de conteúdo (regra do projeto)

Publicar como confirmado só o que o doc consolidado confirma. Itens "a validar" entram genéricos
/sob consulta. Entregar ao cliente uma **checklist de validação por unidade** (arquivo
`validacao-unidades.md`): CNPJ/razão social (só Robracon Rondonópolis confirmado:
06.937.383/0001-05), m² exatos, serviços por local, mix das unidades finas, frota própria por
unidade, disponibilidade de corte e dobra de vergalhão na Robracon Rondonópolis, drywall exclusivo
de Rondonópolis. Memória do projeto: menção a "frota própria" sempre com ressalva (varia por unidade).

## CSS

Novo bloco namespaced `.un-` em `css/pages.css` (seções internas), reaproveitando ao máximo:
`.page-hero`/`.duotone`/`.sobre__grid`/`.medidor`/`.hairline-grid`/`.feat`/`.ie` (image-expansion)/
`.conversao`/`.scard`/`.eyebrow`/`.display--mass` (com override de escala em `.sec-head`). Novos:
hero de unidade, chips de segmento, blocos de produto por categoria na página de unidade, galeria,
FAQ (acordeão simples). Zero border-radius mole; hairlines; foto sempre duotone.

## Ordem de carga (páginas ricas)

CSS: `base.css` → `site.css` → `pages.css` → `lead.css`.
JS: `config.js` → `marcas-data.js` → `unidades-data.js` → `catalogo.js` → `layout.js` → `lead.js`
→ `unidade.js` → `main.js` (count-up) → `cta.js` (por último, reescreve CTAs no `.amb`).
FAQ e galeria: JS pequeno no próprio `unidade.js` (acordeão + image-expansion), sem lib externa.

## Resumo de arquivos

- **Novos:** `js/unidades-data.js`, `js/unidade.js`, `marcas/ello-forte-ribeirao-preto.html`,
  `marcas/ello-forte-sao-carlos.html`, `marcas/robracon-cuiaba.html`,
  `marcas/robracon-rondonopolis.html`, `marcas/robracon-sinop.html`, `validacao-unidades.md`,
  bloco `.un-` em `css/pages.css`.
- **Editados:** `js/config.js` (pageSlug + campos), `js/layout.js` / `js/home.js` / `js/mapa.js`
  (rota por unidade), `marcas/vocical.html` / `marcas/jacical.html` (upgrade p/ renderer novo),
  `marcas/rp-cimento-cal.html` (redirect meta-refresh pro site externo), `CLAUDE.md` (estado).
- **Removidos:** `marcas/robracon.html`, `marcas/ello-forte.html` (combinados, deixam de ser linkados).

## Fora de escopo

- Otimização/compressão de imagens grandes (fica pro pré-deploy).
- Página interna do Rio Preto (segue externa).
- Ligar indexação (remover noindex) — só no deploy final aprovado.

## Critérios de aceite

- 7 páginas ricas + distribuidoras sucinta renderizam sem erro de console.
- Nav/header, footer, cards da home e painel do mapa roteiam cada unidade pra sua página
  (RP externo, distribuidoras juntas).
- Cada página rica tem `<head>` SEO único + JSON-LD LocalBusiness + FAQPage válidos.
- Nenhum dado "a validar" publicado como confirmado; checklist entregue.
- Responsivo de 460px a 900px; superfícies alternando; foto duotone; reveal direcional.
- `noindex` mantido no preview.
