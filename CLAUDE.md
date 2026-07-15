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
- Design skill: `vocical-design` (foi feita para cards de Instagram; reaproveitamos
  os **tokens de marca**, não os layouts de card). Arquitetura visual do site é nova.
- Paleta: vermelho `#a60303`, vermelho escuro `#730a0a`, preto `#0d0d0d`,
  charcoal `#1a1a1a`, branco frio `#f9f9f9`, branco `#ffffff`, cinza apoio `#8a8a8a`.
- Tipografia: **Archivo** (Black para display/números, variável para títulos/corpo).
- Acento de marca: uma palavra do título em vermelho.

## Estrutura
```
vocical-project/
├── CLAUDE.md
├── referencia-conteudo.md   # copy e dados extraídos do site atual
├── Imagens/                 # 209 imagens já organizadas por marca/unidade/produto
├── index.html               # hub do grupo (a construir)
├── css/                     # estilos (a construir)
├── js/                      # scripts (a construir)
└── (páginas por marca, a construir)
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
- Catálogo de produtos (página): categorizar **exatamente** como o site atual (6 categorias).

## Backlog / pendências de conteúdo
- **Fotos faltando no acervo (grandes):** Coberturas (telhas) e Agronegócio (arame/rural)
  só têm thumbnail 150px — pedir ao parceiro fotos ≥800px. Cards usam stopgap suave.
- **Rio Preto Cimento e Cal:** sem JSON de conteúdo — precisa do parceiro p/ a página da marca.
- Imagens grandes podem ser otimizadas/comprimidas antes do deploy final na erehost.
- ✅ Mapa das unidades: seção "Onde estamos" da home é um mapa interativo (Brasil +
  SP/MT em destaque, pins-logo, zoom por clique, painel de contato). Ver
  `js/mapa.js` + `js/mapa-geo.js` (gerado) + `tools/gerar-mapa.mjs`.

## Arquitetura de código (referência rápida)
- CSS: `base.css` (tokens/reset/componentes) → `site.css` (header/footer/whats) →
  `pages.css` (seções compartilhadas + páginas internas) → `home.css` (só home) →
  `lead.css` (FAB + modal do formulário Vico, em todas as páginas).
- JS: `config.js` (dados: marcas, unidades, categorias, parceiros, CTA_URL, LEAD) →
  `marcas-data.js` (tagline/sobre/serviços/categorias por marca) →
  `catalogo.js` (catálogo mestre) → `layout.js` (header/footer/whats/reveal) →
  renderers de página (`home.js`, `produtos.js`, `marca.js`) → `mapa.js`
  (mapa interativo de unidades, lê `mapa-geo.js`) → `lead.js` (formulário de lead
  Vico: FAB + modal + envio, intercepta os CTAs) → `main.js` (count-up).
- Páginas de marca: 1 template (`marca.js`) + 6 HTML enxutos em `/marcas/` com
  `data-marca="<slug>"` e `data-base="../"`. Tudo data-driven.

## Estado atual
**Passo 4 de 7 — Build incremental** (cronologia freela-method).
✅ TODAS as páginas construídas e publicadas: home, produtos, 6 marcas, sobre, contato,
   trabalhe-conosco.
   Preview: https://fabianohirtzz.github.io/vocical-project/
   Home: QA aprovado. Demais páginas: verificadas (0 erros console, sem img quebrada).
   Trabalhe Conosco: verificada (0 erros console, select 10 unidades, validação e
   footer OK); envio real de e-mail depende do PHP na erehost (testar no deploy).
✅ Formulário de lead branded "Vico" em todo o site (FAB + modal + todos os CTAs).
   QA no browser aprovado (home, marca, desktop/mobile, interceptação de CTA,
   validação, sucesso, WhatsApp condicional; 0 erros de console). Envio real ao
   endpoint Zyvia validado por CORS/preflight (não disparado em QA para não gerar
   lead; testar 1 envio real no deploy). WhatsApp flutuante saiu do canto (lead é o
   principal); WhatsApp segue no header/footer/contato.
Próximo: revisão do parceiro (ajustes em partes), depois QA final → deploy erehost.
