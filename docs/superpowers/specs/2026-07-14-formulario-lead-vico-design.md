# Formulário de Lead branded ("Vico") — Grupo Vocical

Data: 2026-07-14
Status: aprovado, em implementação

## Objetivo
Formulário de captação de lead presente em todo o site, com o **mesmo envio e
roteamento** do widget Zyvia atual (`emp=51`, `canal=site`), mas com o **layout da
marca** e a persona **Vico** mantida. Substitui a promessa antiga do `CTA_URL`
(destino placeholder dos CTAs até "o widget definitivo entrar").

## Como o widget atual funciona (engenharia reversa)
- Site atual (WordPress) carrega `https://vico2.zyvia.com.br/embed.js`, que injeta um
  iframe flutuante (`#vico-widget`, canto inferior direito → expande fullscreen com
  backdrop; postMessage `vico-open`/`vico-close`; intercepta `href="#vico-open"`).
- O formulário mora **dentro** do iframe `vico2.zyvia.com.br/widget?emp=51&canal=site`
  (cross-origin — não dá pra reestilizar de fora).
- Envio: `POST https://vico2.zyvia.com.br/widget/lead` (JSON).
  Payload: `{ emp, canal, tipo_cliente, produto, nome, telefone, cidade, estado }`.
  Resposta: `{ success: true, vendedor_whatsapp: "55..." }`.
- **CORS aberto** (`access-control-allow-origin: *`, aceita POST JSON) → podemos postar
  direto do nosso domínio e do preview GitHub Pages, **sem proxy PHP**.

### Valores exatos dos campos (têm que bater com o backend)
- `produto` (string exata): `Materiais de Construção`, `Aço Construção Civil`,
  `Coberturas e Telhas`, `Serralheria / Indústria`, `Drywall`, `Agronegócio`.
- `tipo_cliente`: `pessoa_fisica` | `pessoa_juridica`.
- `estado`: UF de 2 letras.
- Máscara de telefone: `(66) 99999-9999`; mínimo 10 dígitos.
- Validação: `tipo && produto && nome≥3 && telefone≥10 dígitos && cidade≥2 && estado`.
- Sucesso: se vier `vendedor_whatsapp`, monta `https://wa.me/<num>?text=...` com nome+produto.

## Decisões (aprovadas pelo cliente)
1. **Persona:** manter o Vico (avatar/persona no topo do modal, reestilizado com a marca).
2. **Gatilhos:** botão flutuante em todas as páginas **+** todos os CTAs abrem o mesmo modal.
3. **Flutuantes:** o botão de lead vira o principal no canto; o WhatsApp flutuante sai
   (continua em header/footer/contato).
4. **Sem emoji** nos produtos (regra Freela) — ícones SVG hairline no lugar.
5. Rodapé do modal assina "Atendimento por Vico IA · Grupo Vocical" (como hoje).

## Arquitetura (encaixa no padrão data-driven do site, sem build)
- **`js/config.js`** ganha bloco `LEAD` (endpoint, emp, canal, avatar, PRODUTOS, TIPOS).
  Ponto único de troca. `CTA_URL` permanece como **fallback**.
- **`js/lead.js`** (novo, análogo a `layout.js`): injeta FAB + backdrop + modal uma vez;
  abrir/fechar (ESC, backdrop, botão, `VOCICAL.openLead()`); seleção de pills; máscara;
  validação; `fetch` POST; painel de sucesso + handoff WhatsApp. Base-path aware via
  `data-base`. Auto-init no DOMContentLoaded.
- **`css/lead.css`** (novo): FAB + modal com tokens da marca (faixa escura no topo com o
  Vico, corpo claro, botão vermelho). Carregado em todas as páginas.
- **`img/vico-avatar.jpg`** (novo): avatar do Vico extraído do widget atual.

### Interceptação dos CTAs (degradação graciosa)
`lead.js` registra um listener delegado de clique. Seletores de abertura:
`[data-cta], #hero-cta, #conv-cta, #prod-cta, #sobre-cta, #ct-cta, #mk-conv-cta,
#mk-hero-cta, .ie__btn, a[href="#lead-open"]`. `preventDefault()` + abre o modal.
Os CTAs **mantêm `href=CTA_URL`** como fallback: se `lead.js` falhar, o link antigo
ainda funciona. `mapa.js` linha "Falar com vendas" recebe `data-cta`; a linha
"Acessar site" (RP, `siteExterno`) **não** é interceptada (link externo real).

### Modal (marca + Vico)
- Faixa escura (ink/charcoal, grão): avatar do Vico em anel vermelho, "Olá! Sou o Vico"
  + "Assistente do Grupo Vocical", linha-convite curta, botão fechar. Sem emoji.
- Corpo claro: "Produto de interesse" (6 pills, ícone SVG), "Tipo" (PF/PJ), Nome,
  WhatsApp (máscara), Cidade + UF. Inputs em Archivo, hairline industrial.
  Botão vermelho "Quero ser atendido →" (desabilita até validar).
- Sucesso: "Recebemos seu contato" + botão WhatsApp do vendedor.
- Rodapé: "Atendimento por Vico IA · Grupo Vocical".
- Responsivo: card centrado no desktop; sheet quase-fullscreen no mobile.

### QA sem gerar lead real
`LEAD.DRY_RUN` acionável por query param (`?leaddry=1`): não chama o endpoint,
simula `{success:true}` para testar o fluxo/painel de sucesso. Desligado em produção.

## Arquivos
- Novos: `css/lead.css`, `js/lead.js`, `img/vico-avatar.jpg`.
- Editados: `js/config.js` (bloco LEAD), `js/layout.js` (remove WhatsApp flutuante),
  `js/mapa.js` (`data-cta` no "Falar com vendas").
- Includes: `<link ... css/lead.css>` no head e `<script ... js/lead.js>` no rodapé de
  todas as páginas (raiz + `marcas/*.html` com base `../`).

## Fora de escopo (YAGNI)
- Tracking meutrack/Google Ads (config pós-lançamento, conforme CLAUDE.md).
- Envio de campo extra de origem/página (payload idêntico ao atual para não quebrar o backend).
