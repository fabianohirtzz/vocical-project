# Redesign da página de unidade — piloto Robracon Rondonópolis

Data: 2026-07-20
Status: aprovado (estrutura + cadência de CTA), pronto para plano de implementação.

## Contexto e objetivo

As páginas de unidade do Grupo Vocical são páginas de **conversão B2B**. A landing atual
da Robracon Rondonópolis (`marcas/robracon-rondonopolis.html`, já estática e desacoplada
do renderizador `js/unidade.js`) está funcional, mas "genérica/templatada". Este é o
**piloto** de uma nova direção de página; se aprovado no browser, servirá de base para
rediscutir as outras 6 unidades (fora do escopo deste spec).

Objetivo: reconstruir a página **inteira** em vanilla, sob a `vocical-design` (direção
"peso e logística"), usando o 21st.dev apenas como **inspiração de layout** (os
componentes são React+Tailwind e não entram no site sem port). Mesmo conteúdo e dados,
hierarquia e craft elevados, com CTAs de orçamento dosados e estratégicos.

## Diagnóstico da página atual (o que resolver)

1. **Ritmo monótono** — ~10 faixas full-width quase idênticas (kicker + título centralizado
   + grid). Tudo com o mesmo peso, sem hierarquia.
2. **Catálogo = parede de caixinhas** — 5 categorias viram ~23 mini-cards com thumbnail
   pequeno. Parece planilha, não editorial. Trecho mais fraco.
3. **Pouca da direção "peso e logística"** — composição centralizada e simétrica; falta
   assimetria editorial, Archivo Black como massa e os números da operação como protagonistas.
4. **Hero discreto** — números (2005 / 5 / 11) miúdos; a escala da operação não impõe.

## Nova arquitetura (seção a seção)

Ordem pensada para conversão (prova → interesse → oferta → fecho). Cada seção cita a
inspiração 21st que a orienta (referência de layout, não de código).

1. **Hero editorial** — foto duotone full-bleed; título Archivo Black assimétrico; os
   números da operação (2005 em atividade, 5 linhas de produto, 11 unidades no grupo) como
   **massa protagonista**. CTA primário anti-metal `.amb` "Peça seu orçamento".
   Inspiração: Editorial Image Hero (felipemenezes098/hero-07) + Ruixen Stats (figura grande assimétrica).
2. **Sobre a unidade** — split assimétrico foto/texto (refina espaçamento e tipo-massa).
3. **Quem atende** — mantém o carrossel de segmentos (image-expansion), aperta o ritmo.
4. **Catálogo editorial por categoria (mudança principal)** — substitui a parede de cards
   por um showcase com **abas de categoria** (Materiais de Construção, Aço, Estruturais e
   Serralheria, Coberturas, Drywall): ao selecionar a aba, foto grande duotone de um lado +
   lista de itens da linha do outro. Cada painel tem **1 CTA contextual** "Pedir orçamento
   de [linha]" (só 1 visível por vez). Inspiração: Feature Showcase (ruixen.ui, abas + mídia)
   / Elegant Carousel (split editorial).
5. **Serviços especializados** — corte e dobra de chapas, telhas metálicas/termoacústicas
   sob medida, sistemas drywall completos: cards editoriais maiores com foto real.
   CTA "Solicitar corte e dobra / telha sob medida".
6. **Diferenciais (bento)** — substitui a fileira de 4 cards iguais por um **bento** de
   blocos com tamanhos diferentes ("mix mais amplo do grupo" ocupa o bloco maior).
   Inspiração: Feature Section with Bento Grid (manuarora700).
7. **Galeria** — mantém o track duotone da operação (há boas fotos em `Imagens/Robracon ROO/`).
   Inspiração de ritmo: Masonry.
8. **Atuação / logística** — texto de área + card "Atendimento B2B consultivo" com CTA
   "Falar com esta unidade". Menção a frota própria **sempre com ressalva** ("conforme a
   disponibilidade da unidade").
9. **FAQ** — acordeão (mantém as 5 perguntas; JSON-LD FAQPage do `<head>` permanece).
10. **Contato** — endereço/telefone/e-mail + razão social e CNPJ (dados validados). CTA
    "Pedir orçamento".
11. **Conversão final** — faixa vermelha de fecho com CTA "Fale com a Robracon Rondonópolis".

**Princípios anti-genérico:** alternar composições (full / split / abas / bento), Archivo
Black como massa nos números e títulos, assimetria editorial, foto duotone da marca no
lugar de thumbnails soltos. Motion e tokens da `vocical-design` (reveal com peso, count-up,
efeitos sempre ligados mesmo sob reduced-motion).

## Estratégia de CTA (dosada e estratégica)

Todas as chamadas abrem o modal do Vico da unidade. Mecanismo: atributo **`data-cta`** no
botão (interceptado por `js/lead.js`, `OPENERS`), com `href=CTA_URL` como fallback se o JS
falhar. **Sem pré-seleção de categoria** (decisão do cliente) e **sem alterar `lead.js`**.

Cadência (≈6 momentos numa página longa, cada um contextual):

| Momento | CTA |
|---------|-----|
| Hero | "Peça seu orçamento" (anti-metal `.amb`) |
| Catálogo — cada aba | "Pedir orçamento de [linha]" (1 visível por vez) |
| Serviços | "Solicitar corte e dobra / telha sob medida" |
| Atuação/logística | "Falar com esta unidade" (no card B2B) |
| Contato | "Pedir orçamento" |
| Conversão final | "Fale com a Robracon Rondonópolis" |
| FAB flutuante Vico | "Peça seu orçamento" (persistente, já existe) |

## O que NÃO muda

- `<head>` com SEO e JSON-LD (HardwareStore + FAQPage) — fonte de verdade para crawlers.
- `<meta name="robots" content="noindex, nofollow">` até validação do parceiro.
- Conteúdo/dados factuais: produtos por linha, serviços, endereço, telefone, e-mail,
  razão social e CNPJ (06.937.383/0001-05), FAQ.
- Copy padrão Freela: sem travessões, sem emojis, números concretos.
- As outras 6 unidades (renderizador `.un-`) ficam intactas.

## Assets

- Fotos da operação: `Imagens/Robracon ROO/` (hero, galeria, corte e dobra, corte a laser).
- Fotos de produto por linha: `Imagens/Produtos/` (existem; algumas de cobertura/agro são
  menores — usar as melhores disponíveis por aba, stopgap suave quando faltar ≥800px).
- Logo branco: `Imagens/Logos Unidades/Robracon/ROBRACON---BRANCO.png`.

## CSS / JS

- Reconstruir `marcas/robracon-rondonopolis.html` (estático, mantém o `<head>` atual).
- Estilos novos em `css/unidade.css` (já linkado; hoje traz `.u-`/`.mk-`). Reescrever/estender
  para os blocos novos (hero editorial, catálogo em abas, bento) mantendo tokens da base.
- JS de página: só o mínimo inline (abas do catálogo, FAQ acordeão, count-up já vem de
  `main.js`). Sem framework, sem build.

## Checkpoint de validação (importante)

Antes de construir a página inteira, entregar **um protótipo só do hero + catálogo em abas**
(as duas peças mais arriscadas) rodando no browser local, para o cliente aprovar a direção.
Só depois seguir com as demais seções. QA final no browser (0 erros de console, sem imagem
quebrada, responsivo, CTAs abrindo o Vico) antes de considerar pronto.

## Fora de escopo

- Templatizar a nova direção para as outras 6 unidades (decisão posterior ao piloto).
- Qualquer mudança no `lead.js` ou no fluxo de envio do Vico.
- Remover `noindex` / indexar (depende da checklist `validacao-unidades.md`).
