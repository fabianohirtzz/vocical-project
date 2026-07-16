# Site Grupo Vocical — Vocical In Home

## O que é
Site institucional do **Grupo Vocical**, distribuidor B2B de materiais de construção
e soluções para construção civil/indústria, ativo desde 1987. Estrutura de **hub do
grupo + páginas por marca/unidade**. Objetivo de negócio: institucional completo
(grupo + marcas + produtos) **com foco em geração de leads B2B**.

Público: lojas de material de construção, construtoras/incorporadoras, serralherias,
calheiros, gesseiros e indústrias.

## Stack
HTML + CSS + JS puro (sem framework, sem build). Sobe estático via FTP/host.
Tipografia Archivo (mesma da marca). Sem dependência de Node no servidor.

## Design
- Design skill: `vocical-design` — cobre o **site** (direção "peso e logística") e os
  **cards** de Instagram. Os refs SITE (DESIGN/LAYOUT/COMPONENTS/ANIMATIONS/INSPIRATION)
  já espelham o build real; leia antes de tocar UI/copy/motion do site.
- Paleta: vermelho `#a60303`, vermelho escuro `#730a0a`, preto `#0d0d0d`,
  charcoal `#1a1a1a`, branco frio `#f9f9f9`, branco `#ffffff`, cinza apoio `#8a8a8a`,
  divisores `#e4e4e4` (claro) / `rgba(255,255,255,.12)` (escuro). Detalhe sobre escuro:
  `#ff5a5a` (eyebrow/unidades de medida). **Escada de superfície:** as seções "escuras"
  usam vermelho-escuro `#730a0a` (`.surface--dark`/`--char`), não preto; o preto `#0d0d0d`
  fica em painéis-instrumento pontuais (footer, leitor de calculadora, widget de contato,
  faixa do modal Vico). Conversão em vermelho `#a60303`.
- Tipografia: **Archivo** (Black para display/números, variável para títulos/corpo),
  auto-hospedada em `fonts/` (woff2, subsets latin + latin-ext).
- Acento de marca: uma palavra do título em vermelho.
- Foto sempre em **duotone**: `grayscale(1) contrast(1.05) brightness(.82)` + gradiente
  `150deg vermelho→charcoal→ink` (multiply) + grão.
- Assinaturas visuais: malha "planta técnica" 46px, faixa-medidor `.medidor`, cutout cards
  de unidade, botão anti-metal `.amb`, mapa interativo, timeline scroll-driven, widget Vico.

## Estrutura
```
vocical-project/
├── CLAUDE.md
├── referencia-conteudo.md                       # copy/dados do site atual (catálogo geral)
├── referencia-unidades.md                       # conteúdo por unidade (JSONs Elementor)
├── grupo-vocical-produtos-servicos-por-unidade.md  # copy + mix consolidado por unidade
├── copy-novo-site.md                            # copy do novo site
├── Imagens/  ·  Paginas Unidades/               # acervo do cliente + JSONs de unidade
├── index.html  produtos.html  sobre.html  contato.html
├── trabalhe-conosco.html  calculadoras.html     # form TC + 6 calculadoras de aço
├── enviar-trabalhe-conosco.php                  # handler PHP do form (roda só na erehost)
├── marcas/  (vocical, jacical, ello-forte-ribeirao-preto, ello-forte-sao-carlos,
│            robracon-cuiaba, robracon-rondonopolis, robracon-sinop, distribuidoras,
│            rp-cimento-cal[redirect]).html
├── css/   base, site, pages, home, hero-preview, lead, contato, calculadoras, fonts
├── js/    config, marcas-data, catalogo, layout, lead, home, produtos, marca, unidade,
│          unidades-data, mapa, mapa-geo(gerado), hero-preview, produtos-hero, blur-text,
│          timeline, main, cta, calculadoras, trabalhe-conosco
├── fonts/ (Archivo + Archivo Black, woff2)  ·  img/  videos/
└── tools/gerar-mapa.mjs                         # gera js/mapa-geo.js
```

## Comandos
- Dev: abrir `index.html` no navegador (ou Live Server). Sem build.
- Deploy preview: **GitHub Pages** (repo https://github.com/fabianohirtzz/vocical-project.git)
- Deploy final: **erehost** (host próprio do cliente, via FTP)

## Integrações
- **Formulário de lead branded "Vico"** — botão flutuante em todas as páginas + todos
  os CTAs abrem um modal da marca (`js/lead.js` + `css/lead.css`, avatar em
  `img/vico-avatar.jpg`). Envio **idêntico ao widget Zyvia atual**: `POST` em
  `https://vico2.zyvia.com.br/widget/lead` (JSON `emp/canal/tipo_cliente/produto/
  nome/telefone/cidade/estado`), resposta `{success, vendedor_whatsapp}` monta o
  handoff pro WhatsApp do vendedor. CORS aberto no endpoint, posta direto do domínio
  e do preview (sem proxy PHP). Tudo centralizado em `config.js` (`LEAD.ENDPOINT/EMP/
  CANAL/PRODUTOS/TIPOS`) — ponto único de troca. QA sem gerar lead real: `?leaddry=1`
  (`LEAD.DRY_RUN`). Os CTAs mantêm `href=CTA_URL` como fallback se o JS falhar.
  Ver spec em `docs/superpowers/specs/2026-07-14-formulario-lead-vico-design.md`.
- CTA legado (`CTA_URL` em `config.js`): `https://grupovocical.com.br/produtos/?utm_content=meutrack_533fa7c4ec8b`
  — hoje só fallback dos CTAs (o modal do Vico é o destino real).
- WhatsApp comercial: (66) 99939-3953 (canal secundário)
- E-mail: contato@grupovocical.com.br
- Redes: Instagram @grupo.vocical · Facebook /grupovocical · LinkedIn /company/grupo-vocical
- Analytics/Search Console: configurar no pós-lançamento.
- **Formulário Trabalhe Conosco:** `trabalhe-conosco.html` posta (fetch multipart)
  para `enviar-trabalhe-conosco.php` — handler PHP standalone na erehost que roteia
  o e-mail por unidade selecionada (mapa chave→e-mail no PHP, BCC RH central) e anexa
  o CV. Endpoint centralizado em `config.js` (`FORM_ENDPOINT`). O select de unidades
  é gerado do `config.js` (10 unidades, exclui Rio Preto). **Envio de e-mail só roda
  na erehost (PHP), não no preview do GitHub Pages.**

## Regras do projeto
- Idioma: português (BR).
- Copy padrão Freela: **sem travessões, sem emojis, números concretos**.
- Preview/proposta sempre com `noindex` até o cliente aprovar o domínio final.
- Nunca apagar/sobrescrever artefatos do cliente (a pasta Imagens é dele).

## Fontes de conteúdo
- `referencia-conteudo.md` — home/produtos/contato do site atual (catálogo geral).
- `referencia-unidades.md` — conteúdo por unidade extraído dos JSONs Elementor em
  `Paginas Unidades/`. **Fonte de verdade para produtos/serviços/contato de cada marca.**
  Cada unidade lista só as categorias/produtos que trabalha (mix varia por unidade).
  Distribuidoras = 3 sub-unidades (Itu, Piracicaba, Itapetininga).
- `grupo-vocical-produtos-servicos-por-unidade.md` — **documento consolidado do parceiro**
  (2026-07): copy institucional + mix de produtos/serviços das 11 unidades, linhas de
  produto (6), serviços especializados (corte e dobra de vergalhão, de chapas, telhas sob
  medida), quadro-resumo por unidade e lista de pontos a validar com os gerentes. Usar como
  referência de copy/mix; itens marcados "a validar" (CNPJs, anos, serviços por local) só
  publicar após confirmação.
- `copy-novo-site.md` — copy redigida para o novo site.
- Catálogo de produtos (página): 6 categorias reais (config.js `CATEGORIAS`):
  materiais-de-construcao, aco, estruturais, coberturas, drywall, agronegocio.

## Backlog / pendências de conteúdo
- **Fotos faltando no acervo (grandes):** Coberturas (telhas) e Agronegócio (arame/rural)
  só têm thumbnail 150px — pedir ao parceiro fotos ≥800px. Cards usam stopgap suave.
- **Rio Preto Cimento e Cal:** página da marca segue externa (LP deles, `siteExterno`).
  O doc consolidado (`grupo-vocical-produtos-servicos-por-unidade.md` §4.3) já traz copy
  e mix de RP, caso o parceiro decida por página interna no futuro.
- Imagens grandes podem ser otimizadas/comprimidas antes do deploy final na erehost.
- ✅ Mapa das unidades: seção "Onde estamos" da home é um mapa interativo (Brasil +
  SP/MT em destaque, pins-logo, zoom por clique, painel de contato). Ver
  `js/mapa.js` + `js/mapa-geo.js` (gerado) + `tools/gerar-mapa.mjs`.
- **Validação de conteúdo por unidade:** as 7 landings ricas (`js/unidades-data.js`)
  têm SEO completo (title/description/canonical/OG + JSON-LD LocalBusiness/HardwareStore
  + FAQPage) já montado, mas só a Robracon Rondonópolis tem CNPJ/razão social
  confirmados. Antes de remover o `noindex` e indexar, rodar a checklist
  `validacao-unidades.md` (agrega os campos `validar` de cada unidade + os pontos
  gerais do doc consolidado) com os gerentes de cada unidade.

## Arquitetura de código (referência rápida)
- CSS: `base.css` (tokens/reset/superfícies/duotone/botões) → `site.css` (header/drawer/
  footer/wa-float) → `pages.css` (seções compartilhadas + páginas internas: page-hero,
  hist-hero, timeline, "o que nos move", image-expansion, formulários) → `home.css`
  (só home: medidor, cutout cards, slideshow, mapa, conversão) → `hero-preview.css`
  (hero real da home `.hero2` + marquee de marcas) → `lead.css` (FAB + modal Vico) →
  `contato.css` / `calculadoras.css` (extras por página). `fonts.css` importado por base.
- JS (ordem de carga): `config.js` (dados: marcas, unidades, categorias, parceiros,
  CTA_URL, LEAD, FORM_ENDPOINT, CNPJ/RAZAO_SOCIAL) → `marcas-data.js` (tagline/sobre/
  serviços/categorias por marca) → `catalogo.js` (catálogo mestre) → `unidades-data.js`
  (conteúdo editorial + SEO por unidade, keyed por `pageSlug`) → `mapa-geo.js`
  (gerado) → `layout.js` (header/footer/reveal) → `lead.js` (widget Vico: FAB + modal +
  inline + envio, intercepta os CTAs) → renderers (`home.js`, `produtos.js`, `marca.js`,
  `unidade.js`) → `mapa.js` (mapa interativo, lê `mapa-geo.js`) → `hero-preview.js`
  (marquee + reveal vertical-cut) → `produtos-hero.js` (container-text-flip + header
  direcional) → `blur-text.js` → `timeline.js` (feixe scroll-driven) → `main.js`
  (count-up) → `cta.js` (botão anti-metal `.amb`, roda por ÚLTIMO reescrevendo os CTAs
  sem quebrar a interceptação do lead) → `calculadoras.js` / `trabalhe-conosco.js`
  (nas suas páginas). Ports 21st.dev (vanilla): anti-metal (cta), blur-text,
  container-text-flip, timeline.
- Páginas de unidade: duas famílias. (1) **Landing rica por cidade** (`unidade.js` +
  `unidades-data.js`, bloco `.un-` em `css/pages.css`) para as 7 unidades com
  identidade própria: vocical, jacical, ello-forte-ribeirao-preto,
  ello-forte-sao-carlos, robracon-cuiaba, robracon-rondonopolis, robracon-sinop —
  hero, números, sobre, segmentos, categorias, serviços, diferenciais, galeria,
  atuação/logística, FAQ (JSON-LD), razão social/CNPJ. (2) **Marca sucinta**
  (`marca.js`, template genérico) para `distribuidoras.html` (3 sub-unidades: Itu,
  Piracicaba, Itapetininga). `rp-cimento-cal.html` é um redirect estático
  (`meta http-equiv="refresh"`) para o site externo do parceiro (`siteExterno`).
  Roteamento por `pageSlug`: `config.js`/`layout.js`/`home.js`/`mapa.js` resolvem a
  URL de cada unidade na ordem `siteExterno → pageSlug → slug`. As antigas páginas
  combinadas `robracon.html` e `ello-forte.html` (uma página por marca, várias
  unidades) foram removidas em favor das landings por cidade.
- Dados (config.js): 6 marcas → 11 unidades; RP Cimento e Cal com `pendenteConteudo` +
  `siteExterno`; 6 categorias; 16 parceiros; `RAZAO_SOCIAL`/`CNPJ` da Vocical preenchidos.
  `unidades-data.js` traz o conteúdo editorial e um campo `seo`/`faq` de referência das
  7 unidades ricas; contato/endereço/logo/fachada seguem vindo de `config.js` (resolvidos
  por `marcaSlug` + `unidadeKey`). **Fonte de verdade de SEO para crawlers é o `<head>`
  estático de cada `marcas/<pageSlug>.html`** (title/description/canonical/OG + JSON-LD
  HardwareStore/FAQPage) — o campo `seo` do JS é redundante (não renderizado); ao editar
  `faq` no JS, atualize também o JSON-LD FAQPage do HTML correspondente.

## Estado atual
**Passo 4 de 7 — Build incremental** (cronologia freela-method).
✅ TODAS as páginas construídas e publicadas: home, produtos, sobre, contato,
   trabalhe-conosco, **calculadoras** (6 ferramentas de aço) e as páginas de unidade.
   Sobre é a mais rica: hero em vídeo com blur-text, timeline "Nossa trajetória"
   scroll-driven, "o que nos move", "quem atendemos" (carrossel image-expansion) e
   parceiros. Botão anti-metal `.amb` como CTA de assinatura em todo o site.
   Preview: https://fabianohirtzz.github.io/vocical-project/
   Home: QA aprovado. Demais páginas: verificadas (0 erros console, sem img quebrada).
   Trabalhe Conosco: verificada (0 erros console, select 10 unidades, validação e
   footer OK); envio real de e-mail depende do PHP na erehost (testar no deploy).
✅ Formulário de lead branded "Vico" em todo o site (FAB + modal + todos os CTAs)
   e **embutido inline na página de contato** (`#lead-inline`, mesma fábrica de card
   do `lead.js`, instâncias isoladas). Rio Preto Cimento e Cal: contato preenchido
   (endereço + (17) 3236-1000 + link do site oficial rpcimentoecal.com.br) no
   `config.js`; página da marca segue externa (LP deles).
   QA no browser aprovado (home, marca, desktop/mobile, interceptação de CTA,
   validação, sucesso, WhatsApp condicional; 0 erros de console). Envio real ao
   endpoint Zyvia validado por CORS/preflight (não disparado em QA para não gerar
   lead; testar 1 envio real no deploy). WhatsApp flutuante saiu do canto (lead é o
   principal); WhatsApp segue no header/footer/contato.
✅ Páginas de unidade reescritas como **landing pages ricas por cidade** (7:
   vocical, jacical, ello-forte-ribeirao-preto, ello-forte-sao-carlos, robracon-cuiaba,
   robracon-rondonopolis, robracon-sinop), cada uma com hero, números, sobre, segmentos,
   categorias, serviços, diferenciais, galeria, atuação/logística e FAQ próprios
   (`js/unidades-data.js` + `js/unidade.js`, bloco `.un-` em `css/pages.css`). SEO
   completo por unidade (title/description/canonical/OG + JSON-LD LocalBusiness/
   HardwareStore + FAQPage), site segue `noindex` até a validação do parceiro.
   Distribuidoras (Itu, Piracicaba, Itapetininga) seguem numa página sucinta única
   via `marca.js`. Rio Preto Cimento e Cal segue redirect estático pro site externo.
   As antigas páginas combinadas `robracon.html` e `ello-forte.html` foram removidas.
   Checklist de validação com os gerentes: `validacao-unidades.md`.
Próximo: revisão do parceiro (ajustes em partes, validar conteúdo das unidades via
`validacao-unidades.md`), depois QA final → deploy erehost.
