# Mapa interativo de unidades — Grupo Vocical

Data: 2026-07-02
Status: aprovado (implementação em curso)

## Objetivo
Substituir a seção "Onde estamos" (lista `.unidades` de 2 colunas) da home por um
**mapa interativo** que mostra as 11 unidades do grupo sobre o Brasil, com SP e MT
destacados. Ao clicar num pin (ou numa cidade da lista), o mapa dá zoom até a cidade
e um painel exibe o contato da unidade. Conceito de pan/zoom herdado do mapa da
Casa Angelina; estética industrial da design system Vocical ("peso e logística").

## Decisões aprovadas
- **Escopo:** Brasil inteiro em silhueta discreta, **SP e MT preenchidos em vermelho**.
- **Fidelidade:** contornos geográficos **reais** (GeoJSON oficial projetado).
- **Interação:** **só clique** (pin ou lista). Sem setas/teclado/tour linear.
- **Reset:** botão "Ver todas" dá zoom-out ao enquadramento inicial.

## Dados (11 unidades, fonte: js/config.js)
8 em SP: Itu, Piracicaba, Itapetininga, Ribeirão Preto, São Carlos, Jales,
Votuporanga, São José do Rio Preto. 3 em MT: Cuiabá, Rondonópolis, Sinop.
Cada unidade: marca, cidade, uf, endereço, telefone, e-mail, (horário quando houver).
**Rio Preto Cimento e Cal** (São José do Rio Preto): contato pendente → pin "em breve".
Ênfase sutil no pin da **Vocical/Votuporanga** (matriz).

## Arquitetura
- **Geometria (build-time, 1x):** `tools/gerar-mapa.mjs` baixa o GeoJSON dos estados,
  aplica projeção equiretangular (fator cos(lat_ref)) para um viewBox fixo, e emite:
  (a) os `path d` de silhueta + SP + MT (colados no HTML);
  (b) o `{x,y}` de cada cidade projetado com a MESMA projeção (grava em config.js).
  Script fica versionado para regenerar; não é dependência de runtime.
- **HTML:** seção `.mapa-unidades` (`surface--dark grain`), grid editorial
  1.4fr (mapa) / .85fr (eyebrow+título+lista por UF+painel de contato). SVG embutido.
- **CSS:** bloco `.mapa*` em `css/home.css`. Estados: silhueta charcoal + hairline,
  SP/MT em `--red`. Pins: disco claro + logo da marca + anel; ativo preenche vermelho
  e mostra label; contra-escala via `--inv`. Painel estilo hairline. Aposenta `.unidades*`.
- **JS:** `js/mapa.js` — engine de zoom (`transform: translate scale` no canvas,
  `requestAnimationFrame`, interpolação ~12%), render dos pins e da lista a partir de
  `V.MARCAS`, clique → `focus`+`world` → anima + popula painel. `renderUnidades` sai.

## Painel de contato (ao selecionar)
Marca · Cidade/UF · endereço · telefone (`tel:`) · e-mail (`mailto:`) · horário (se houver)
· CTA "Ver [marca]" (`marcas/{slug}.html`) · CTA "Falar com vendas" (`CTA_URL` do config).

## Acessibilidade & responsivo
Pins como botões focáveis com `aria-label`; painel `aria-live="polite"`.
`prefers-reduced-motion`: salto direto sem animação. Mobile: mapa mantém tap-to-zoom,
painel vai estático abaixo, lista de cidades em scroll horizontal (sem pinch obrigatório).

## Arquivos
`index.html`, `css/home.css`, `js/config.js`, `js/mapa.js` (novo), `tools/gerar-mapa.mjs` (novo).

## QA (gate freela-method)
Console limpo · pins clicáveis · zoom suave · links tel/mailto/CTA corretos ·
responsivo 375/768/1200 · reduced-motion · sem imagem quebrada.
