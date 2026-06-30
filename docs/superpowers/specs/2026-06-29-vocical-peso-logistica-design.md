# Vocical — Sistema "Peso e Logística" + Remodel da Home

**Data:** 2026-06-29
**Projeto:** Site Grupo Vocical (`vocical-project`)
**Escopo:** Elevar a skill `vocical-design` a sistema de design completo e aplicá-lo na home.

---

## Problema

Toda vez que o site da Vocical é gerado só por comando (sem o dev colocar a mão), ele
sai genérico — a "cara de site feito por IA". Causa-raiz confirmada por inspeção:

- A skill `vocical-design` carrega **apenas tokens** (cor + Archivo). Ela tem
  `DESIGN.md`, `CARDS.md`, `PIPELINE.md` — os dois últimos são sobre **cards de
  Instagram**, não sobre compor um site.
- As skills boas do mesmo dev (`clientex-design`/NOX, `quarezemin-design`) têm
  `LAYOUT.md`, `COMPONENTS.md`, `ANIMATIONS.md`, `INTERACTIONS.md`, `INSPIRATION.md`
  — e por isso não saem genéricas.
- Princípio operante: **IA sem restrição regride para a média.** O que a skill fixa,
  o build respeita; o que ela deixa em aberto (layout, composição, motion, referência),
  o build preenche com o lugar-comum do material de treino = "site de IA".
- A home atual (`index.html`) é a pilha simétrica de manual: hero centralizado →
  contador → split → grids de card mole → faixa vermelha. Exatamente o padrão que o
  `INSPIRATION.md` do NOX lista como "o que NÃO fazer".

## Objetivo

Codificar uma **direção criativa específica** para a Vocical na skill, e provar essa
direção remodelando a home. Desenhar o sistema **uma vez**: escrever nos arquivos da
skill e aplicar na home (não fazer o trabalho duas vezes).

## Direção criativa escolhida: "Peso e Logística" (abordagem "Canteiro")

A escala da operação como protagonista — tonelagem, 11 unidades, frota própria,
pronta-entrega, 35+ anos. Materialidade pesada, Archivo Black como massa, grade
editorial **assimétrica**, números como instrumento. Confiante e industrial, sem
soar "site de prêmio" (a audiência B2B — lojista, construtora, serralheria — valoriza
clareza e velocidade).

A distinção mora na **composição e tipografia** (a que dura), não em chrome/motion
(que envelhece e ainda pode parecer template).

---

## Entregável 1 — Sistema de design na `vocical-design`

Localização: `C:\Users\fabia\.claude\skills\vocical-design\`

| Arquivo | Estado | Conteúdo |
|---|---|---|
| `references/DESIGN.md` | expandir | tokens, tipo-massa, escada de superfície, receita duotone, regras anti-template |
| `references/LAYOUT.md` | novo | anatomia da home, sistema de seção, regra de ancoragem alternada, grids, responsivo |
| `references/COMPONENTS.md` | novo | medidor, linha-de-marca, célula-de-catálogo, bloco-foto-duotone, ticker, bloco-CTA, botões, eyebrow |
| `references/ANIMATIONS.md` | novo | slide-and-settle, count-up, ticker, grão, reduced-motion |
| `references/INSPIRATION.md` | novo | direções criativas + referências + seção "o que NÃO copiamos" |
| `SKILL.md` | atualizar | apontar para os novos refs; deixar claro que a skill cobre **site** além de cards |

`CARDS.md` e `PIPELINE.md` permanecem (são o pipeline de Instagram, escopo válido).

### Regras do sistema (resumo do que entra nos arquivos)

**Tipografia como massa.** Archivo Black gigante, `line-height ~0.9`, tracking
negativo, manchetes sangram a borda. Uma palavra por título em vermelho. Eyebrow
caixa-alta espaçada com régua curta vermelha. Números superdimensionados como mostrador.

**Escada de superfícies.** `preto #0d0d0d → charcoal #1a1a1a → branco frio #f9f9f9 →
branco #ffffff`. Seções alternam degraus para separar sem borda. Vermelho `#a60303`
como acento estrutural que trabalha (palavra-acento, bloco CTA, régua), nunca enfeite.

**Foto duotone.** Toda foto em duotone charcoal→vermelho com grão sutil, receita CSS
fixa, aplicada sempre igual. Unifica o acervo só-decente e crava a materialidade.

**Motion com peso.** Reveal = slide-and-settle (translateY curto + easing pesado).
Count-up no scroll para o medidor. Ticker industrial dos parceiros. Sem loader, sem
cursor custom. `prefers-reduced-motion` respeitado. Hover deliberado nas células.

**Guarda-corpo anti-template (o que NÃO fazer):** hero centralizado empilhado; card
mole arredondado com drop-shadow; fade-up uniforme em tudo; ícone emoji; foto stock
lavada de fundo; contador isolado flutuando.

---

## Entregável 2 — Remodel da home (`index.html` + CSS)

Preservar a arquitetura **data-driven** (`config.js`, `marcas-data.js`, `catalogo.js`,
`marca.js`, renderers). O remodel é **visual + composição**, não reescrita de dados.
Trabalho concentrado em `home.css` (+ tokens/componentes em `base.css`/`pages.css`
quando o sistema for compartilhável) e nos renderers da home (`home.js`) para a nova
marcação. CTA continua centralizado no `config.js` (`CTA_URL`).

### Anatomia da nova home

Regra-mãe: **quebrar a pilha simétrica** — alternar ancoragem (esq/dir), alternar
fundo (charcoal → paper → vermelho), foto sempre como bloco duotone pesado.

1. **Hero assimétrico** `[dark]` — manchete Archivo Black sangrando a borda + bloco
   foto duotone (pátio/aço/frota) ao lado; kicker "DESDE 1987"; lede curta; CTA duplo.
   Não centralizado.
2. **Faixa-medidor** `[black]` ◀ momento de assinatura — painel de logística:
   `1987 · 35+ anos · 11 unidades · SP+MT · frota própria · corte e dobra`, números
   contam no scroll, divisores hairline. Reenquadra o antigo contador como instrumento.
3. **Sobre** `[paper]` — split ancorado à ESQUERDA (inverte o hero), foto duotone,
   tipo grande, [Nossa história].
4. **Marcas** `[dark]` — lista editorial com numeração pesada (01–06), região por
   marca, grade hairline. Não card mole.
5. **Produtos** `[paper]` — 6 categorias em grade hairline, nome da categoria como
   tipo grande, "da fundação ao acabamento".
6. **Serviços** `[dark]` — seção full-bleed duotone, corte e dobra + frota própria,
   ancorado à direita (a musculatura operacional).
7. **Parceiros** — ticker industrial (marquee) dos fabricantes distribuídos.
8. **Unidades** `[paper]` — lista pesada das 11 unidades SP+MT com números.
9. **Conversão** `[vermelho]` — bloco vermelho composto com peso (não só centralizado).

Footer mantido (revisar para coerência com o novo sistema).

---

## Fora de escopo (por agora)

- Páginas internas (produtos, 6 marcas, sobre, contato) — virão depois, já guiadas
  pelo sistema. Validamos a direção na home primeiro.
- Reescrever a camada de dados/JS de conteúdo.
- Pipeline/CARDS de Instagram da skill.
- Conteúdo pendente do parceiro (Rio Preto Cimento e Cal; fotos ≥800px de coberturas
  e agronegócio).

## Critérios de sucesso

1. A `vocical-design` tem `LAYOUT.md`, `COMPONENTS.md`, `ANIMATIONS.md`,
   `INSPIRATION.md` no nível de detalhe das skills NOX/Quarezemin (mecânica-a-estudar,
   regras concretas, seção anti-template).
2. A home remodelada não dispara nenhum item do guarda-corpo anti-template: hero
   assimétrico, sem card mole, fundo alternado, foto duotone, números como massa.
3. QA de browser limpo (0 erro de console, sem imagem quebrada, responsivo em
   ≤1024px e ≤680px), via `web-qa-reviewer`.
4. Teste do dono: "cite 3 coisas aqui que um template nunca faria." Tem que haver 3.
5. Próximo `/site` da Vocical, rodado só por comando, herda o chão de composição —
   não regride para a média.

## Notas de restrição

- Projeto **não é repo git** — sem commits; entregas verificadas por QA de browser.
- Stack HTML/CSS/JS puro, sem build. Nada de React/framework.
- Idioma PT-BR. Copy padrão Freela: sem travessões, sem emoji, números concretos.
- `noindex` permanece até aprovação do domínio final.
- Nunca apagar/sobrescrever artefatos do cliente (pasta `Imagens/`).
