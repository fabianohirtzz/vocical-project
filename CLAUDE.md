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
├── index.html                                   # home (raiz)
├── produtos/  sobre/  contato/  trabalhe-conosco/  calculadoras/   (index.html)
├── vocical-votuporanga-sp/  jacical-jales-sp/                      (index.html)
│   ello-forte-ribeirao-preto-sp/  ello-forte-sao-carlos-sp/
│   robracon-cuiaba-mt/  robracon-rondonopolis-mt/  robracon-sinop-mt/
│   distribuidoras-sp/  rp-cimento-cal/[redirect]
├── campaigns-robracon-roo/                      # LP de campanha (sem menu)
├── 404.html  robots.txt  sitemap.xml  .htaccess
├── enviar-trabalhe-conosco.php                  # handler PHP do form (roda só na erehost)
├── marcas/                                      # só protótipos de dev (não sobem)
├── css/   base, site, pages, home, hero-preview, lead, contato, calculadoras, fonts
├── js/    config, marcas-data, catalogo, layout, lead, home, produtos, marca, unidade,
│          unidades-data, mapa, mapa-geo(gerado), hero-preview, produtos-hero, blur-text,
│          timeline, main, cta, calculadoras, trabalhe-conosco
├── fonts/ (Archivo + Archivo Black, woff2)  ·  img/  videos/
└── tools/gerar-mapa.mjs                         # gera js/mapa-geo.js
```

## URLs (regra dura)
As URLs **espelham exatamente** o site WordPress que estava no ar, porque há campanhas
de Google Ads rodando com essas URLs como destino e o rastreamento já configurado em
cima delas. **Nunca renomear uma pasta de página sem 301 correspondente.**
`/produtos/` · `/sobre/` · `/contato/` · `/trabalhe-conosco/` ·
`/vocical-votuporanga-sp/` · `/jacical-jales-sp/` · `/ello-forte-ribeirao-preto-sp/` ·
`/ello-forte-sao-carlos-sp/` · `/robracon-cuiaba-mt/` · `/robracon-rondonopolis-mt/` ·
`/robracon-sinop-mt/` · `/distribuidoras-sp/` · `/campaigns-robracon-roo/`
Pasta com `index.html` (barra final), sem rewrite: o DirectoryIndex resolve e os
caminhos relativos (`../css/`) seguem válidos em qualquer profundidade e na subpasta
de teste. Roteamento em JS: `config.js` `URL_UNIDADE` + `VOCICAL.urlUnidade()`.

## Comandos
- Dev: abrir `index.html` no navegador (ou Live Server). Sem build.
- Deploy preview: **GitHub Pages** (repo https://github.com/fabianohirtzz/vocical-project.git)
- Deploy final: **erehost** via `FTP_SENHA='...' python tools/deploy-erehost.py --alvo novo`
  (`--alvo raiz` para produção, com confirmação digitada). FTP: `ftp.grupovocical.com.br`,
  usuário `ftpvocical@grupovocical.com.br` (o `@domínio` é obrigatório). A raiz do FTP
  **já é o public_html**.

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
- **Rastreamento (portado do WordPress legado, não reconfigurar):**
  **GTM `GTM-MGL778C`** + **meutrack** (`meutrack-ingest.carlosabsj-ti.workers.dev/
  t.js?p=uYwDmBtwlYC2`) no `<head>` das 14 páginas de produção. Dentro do GTM:
  GA4 `G-EM24R0ET8R`, Google Ads `AW-617740888` e a **única conversão configurada**,
  `Google ADS | Whatsapp` (label `C0sPCP6J9NEbENj0x6YC`), disparada pelo gatilho
  `Event_Botão_Whatsapp` = *Click URL contém "whatsapp"*.
  ⚠️ **Todo link de WhatsApp deve usar `api.whatsapp.com`, nunca `wa.me`** — `wa.me`
  não contém a string "whatsapp", o gatilho não casa e a conversão morre sem erro.
  ⚠️ A atribuição pago vs orgânico acontece no **Vico/meutrack**, pelo preenchimento
  do formulário: `lead.js` → `trackLead()` chama `TrackHub.track('lead'|'lead_pj', ...)`
  replicando evento e campos do widget legado (que fazia isso via postMessage do
  iframe da Zyvia). O mapeamento `pessoa_juridica → 'PJ'` é obrigatório, senão todo
  lead PJ entra como PF. QA sem gerar lead: `?leaddry=1` loga o payload no console.
  O gatilho `Formulario_Vico` existe no container mas **não está ligado a nenhuma
  tag** (decisão do cliente: a conversão é medida dentro do Vico, não no Ads).
- Search Console: submeter `sitemap.xml` depois do corte para a raiz.
- **Formulário Trabalhe Conosco:** `trabalhe-conosco.html` posta (fetch multipart)
  para `enviar-trabalhe-conosco.php` — handler PHP standalone na erehost que roteia
  o e-mail por unidade selecionada (mapa chave→e-mail no PHP, BCC RH central) e anexa
  o CV. Endpoint centralizado em `config.js` (`FORM_ENDPOINT`). O select de unidades
  é gerado do `config.js` (10 unidades, exclui Rio Preto). **Envio de e-mail só roda
  na erehost (PHP), não no preview do GitHub Pages.**

## Como verificar o site (o jeito certo)
**Imagem nascida em JS não aparece em crawler que só lê HTML.** Quase todo `<img>`
do site é montado pelos renderers a partir do `config.js`/`catalogo.js`. Uma
varredura de `src`/`href` no HTML estático dá "tudo certo" com o site cheio de
imagem quebrada — foi o que aconteceu em 26/08/2026: o crawler dizia 73 assets OK
enquanto **79 imagens** estavam quebradas em `/produtos/`, `/sobre/` e `/contato/`.

Verificação válida: abrir cada página **no browser**, desligar o `loading="lazy"`
(`img.loading='eager'; img.src=img.src`) e contar `naturalWidth === 0`. Dá para
rodar as 15 páginas de uma vez num iframe oculto, mesma origem. Referência atual:
**15 páginas, 997 imagens, zero quebrada**.

Cuidado com `naturalWidth` sem desligar o lazy: card fora da dobra reporta 0x0 e
parece defeito. E `tools/checar-caminhos.py` só confere grafia/existência em disco
— não pega prefixo `../` faltando, que é outra classe de erro.

## Regras do projeto
- Idioma: português (BR).
- Copy padrão Freela: **sem travessões, sem emojis, números concretos**.
- **Posicionamento (regra dura de copy).** O cliente majoritário é **B2B de revenda**:
  lojas de material de construção que compram para revender, não necessariamente para
  construir. A linguagem é de **parceria e fornecimento/abastecimento**, nunca "sua obra"
  como se todo cliente estivesse construindo.
  - A palavra **"canteiro" está banida** do site.
  - Ao listar público, **revenda vem junto ou primeiro**: "revendas, indústrias e
    serralherias", nunca "obras e indústrias" sozinho.
  - **"obra" só é aceitável** em três contextos: (1) corte e dobra de **vergalhão**/aço
    armado, que de fato atende obra ("etapa da obra", "quantitativo da obra"); (2) o
    segmento **construtoras** ("cronograma da obra"); (3) "mão de obra".
    **Corte e dobra de CHAPA não atende obra** — nunca coloque os dois sob um
    guarda-chuva de obra/canteiro.
  - Narrativa de origem: "distribuímos materiais de construção desde 1987 e fomos
    agregando outros produtos ao portfólio, como aço, drywall e coberturas".
  - Verificar com: `grep -rniE "canteiro|obras?" --include=*.html --include=*.js
    --exclude-dir=.playwright-mcp .`
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
- **✅ Ello Forte São Carlos sem galeria (decisão do cliente, 20/08/2026):** o acervo
  tem só duas fotos úteis (fachada e interior) e o cliente confirmou que não há mais.
  A seção de galeria foi retirada dessa página — `galeria: []` no `unidades-data.js`,
  e o template omite a seção quando a lista está vazia. É o estado desejado: não
  reabrir como bug nem preencher com foto de outra unidade.
- **✅ Cuiabá e Sinop carregam o mix da Rondonópolis (confirmado pelo cliente,
  20/08/2026):** as três Robracon trabalham as mesmas 5 linhas (construção, aço,
  estruturais, coberturas, drywall). Os **serviços** (corte e dobra de chapas, telhas
  sob medida) seguem **só confirmados em Rondonópolis** — dependem de equipamento e
  continuam na checklist de validação das outras duas.
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
- **Páginas de unidade: UM template só.** As 7 unidades renderizam por
  `js/unidade.js` a partir de `js/unidades-data.js`, no layout da Robracon
  Rondonópolis (que foi desenhada como modelo): hero com dois cards inclinados,
  "sobre" em vermelho, portfólio em abas, segmentos em carrossel, serviços,
  diferenciais, galeria, atuação, FAQ e contato com mapa. A página precisa de
  `css/unidade.css` além de `pages.css`, e do par `<body data-unidade="...">` +
  `<main id="conteudo"></main>` vazio. `data-landing` no body prende os CTAs na
  própria página (`#vico-open`), usado pela LP `/campaigns-robracon-roo/`.
  **Nunca escrever HTML de unidade à mão** — foi o que fez as 6 páginas ficarem
  com layout diferente do modelo. Ajuste é no template ou no dado.
  `distribuidoras.html` segue no template genérico `marca.js`;
  `rp-cimento-cal` é redirect estático.
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
**Passo 9 de 9 — No ar e em pós-lançamento** (cronologia freela-method).
Site estático em produção na raiz desde 20/08/2026, validação pós-corte fechada
em 26/08/2026. O que resta é manutenção e limpeza — ver "Corte para a raiz".
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
✅ **Migração para a erehost (Fase A concluída).** URLs espelhando o WordPress,
   rastreamento portado e verificado no browser, LP `/campaigns-robracon-roo/`
   construída, `.htaccess` + 404 + robots + sitemap prontos, site publicado em
   `public_html/novo/` para teste no domínio real.

## Corte para a raiz — CONCLUÍDO em 20/08/2026
O site estático está **no ar na raiz** (`https://grupovocical.com.br/`). Verificado
depois do corte: 18 URLs em 200, 73 assets/links sem quebra, os 5 redirects 301
(`/inicio/ /unidades/ /manutencao/ /hello-world/ /category/uncategorized/`), toda a
superfície do WordPress em 404 (inclusive `/wp-antigo/`), HTTPS e sem-www forçados,
404 da marca sendo servido, cache (HTML no-cache / asset 1 ano), **PHP executando na
raiz** (o handler `ea-php84` sobreviveu ao `.htaccess` novo) e as 5 aplicações do
cliente de pé. Home e unidade sem erro de console; GTM e TrackHub carregando.
Formulário do Vico testado ponta a ponta com `?leaddry=1`: dispara `lead_pj` com
`tipo: PJ` e todos os campos.

O WordPress **não foi apagado** — está em `/wp-antigo/`, respondendo 404.
Rollback: `python tools/arquivar-wordpress.py --desfazer --aplicar`.

✅ **Validação pós-corte concluída (26/08/2026):** sitemap submetido no Search
Console (propriedade de **domínio**, TXT no Zone Editor da erehost — o SPF
convive, são dois TXT), 1 lead real pelo formulário do Vico e 1 envio real do
Trabalhe Conosco, ambos confirmados pelo cliente.

Falta só limpeza, sem pressa e só depois de alguns dias estáveis: remover
`/wp-antigo/` (o WordPress arquivado) e `/novo/` (cópia de teste, ainda no ar com
`noindex`). Enquanto `/wp-antigo/` existir, o rollback continua a um comando.

### Runbook usado (para referência)
Preparação: `noindex` removido das 13 páginas públicas
(`tools/liberar-indexacao.py --aplicar`), LP de campanha travada como exceção
permanente e fora do sitemap, malha de links/assets varrida em `/novo/` sem quebra,
e conferido que **nenhuma das 5 aplicações do cliente faz `require` de `wp-load.php`**
(varredura de todo PHP em `/arquivos/ /assinatura/ /calcular/ /processos/ /backup/`).

Execução, nesta ordem (`FTP_SENHA='...'` no ambiente):
```
python tools/deploy-erehost.py --alvo raiz --sim --lista tools/corte-fase1-assets.txt
python tools/deploy-erehost.py --alvo raiz --sim --lista tools/corte-fase2-paginas.txt
python tools/deploy-erehost.py --alvo raiz --sim --lista tools/corte-fase3-htaccess.txt
python tools/arquivar-wordpress.py --aplicar
```
**Por que em 3 fases:** o `.htaccess` sobe primeiro na ordem alfabética. Se o deploy
fosse único, ele trocaria o roteamento no começo do upload e as páginas do WordPress
passariam a 404 por vários minutos, enquanto os assets ainda subiam — com campanhas de
Ads apontando para essas URLs. Assets → páginas → `.htaccess` faz a troca ser quase
instantânea no fim.

**Rollback:** `python tools/arquivar-wordpress.py --desfazer --aplicar` devolve o
WordPress para a raiz em segundos (o corte **move** para `/wp-antigo/`, não apaga).

Depois do corte (tudo feito, ver acima): sitemap no Search Console, 1 lead real
no formulário do Vico e 1 envio do Trabalhe Conosco no domínio real.
