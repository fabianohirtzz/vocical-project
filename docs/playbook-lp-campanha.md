# Playbook: landing page de campanha

Como construir uma LP de campanha no padrão do Grupo Vocical. Escrito a partir da
`/campaigns-robracon-drywall/`, que foi a primeira e serve de modelo. Setembro de 2026.

Quem for fazer a próxima: leia isto inteiro antes de abrir um arquivo. Quase tudo aqui
nasceu de erro cometido e corrigido em revisão, não de preferência.

Documentos vizinhos:
- `CLAUDE.md`, com as regras do projeto inteiro, que continuam valendo.
- `docs/superpowers/specs/2026-09-13-lp-drywall-robracon-design.md`, a spec da LP de
  drywall: objetivo, decisões fechadas com o cliente, público e pendências daquela página.
  Este playbook é o método; aquela spec é o caso.

---

## 1. O que é uma LP de campanha aqui

Página de destino de anúncio pago, **sem menu de navegação**, cujo único caminho é o
formulário. Não é página de unidade nem página de produto do catálogo.

Use quando houver: verba de mídia apontando para um produto ou linha específica, um
público definido e um vendedor pronto para atender o lead.

Não use quando: o objetivo é institucional, o conteúdo é o mix inteiro de uma unidade,
ou a página precisa do menu. Nesses casos o template de unidade (`js/unidade.js`) resolve.

**A diferença que define tudo o resto:** as páginas de unidade nascem em JavaScript, a
partir de `unidades-data.js`. Uma LP de campanha com objetivo de GEO **nasce em HTML
estático**, porque os crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) em geral não
executam JavaScript e chegariam numa casca vazia. O Google renderiza JS sem problema; as
IAs, não. Se a página precisa ser citada por IA, o conteúdo mora no HTML.

---

## 2. Regras duras, antes de qualquer linha de código

**URL.** Pasta com `index.html` e barra final, no padrão `/campaigns-<marca>-<tema>/`.
Ex.: `/campaigns-robracon-roo/`, `/campaigns-robracon-drywall/`. A URL entra na lista
dura do `CLAUDE.md` e **nunca é renomeada sem 301**, porque a campanha do Google Ads
aponta para ela e o rastreamento está configurado em cima.

**Indexação.** Nasce com `<meta name="robots" content="noindex, follow">` e fora do
`sitemap.xml`. Marque a linha com comentário: é a única a trocar quando o cliente
aprovar. Só então inclua a URL no sitemap.

**Rastreamento.** GTM `GTM-MGL778C` e meutrack no `<head>`, iguais às outras 14 páginas.
Não reconfigure nada. E a regra que mata silenciosamente se for esquecida: **todo link de
WhatsApp usa `api.whatsapp.com`, nunca `wa.me`**, porque o gatilho de conversão do Ads é
*Click URL contém "whatsapp"* e `wa.me` não contém essa string.

**Copy.** Valem as regras do `CLAUDE.md`, sem exceção de campanha: português do Brasil,
sem travessões, sem emojis, números concretos. "Canteiro" é banida. "Obra" só em três
contextos (vergalhão, segmento construtoras, mão de obra). Revenda vem junto ou primeiro
ao listar público, porque o cliente majoritário compra para revender e não para construir.

---

## 3. Arquivos de uma LP nova

```
campaigns-<marca>-<tema>/index.html     a página inteira, estática
css/campanha-<tema>.css                 só o que é desta página, prefixo .<xx>-
js/<tema>-calc.js                       se houver calculadora
js/<tema>-zoom.js                       se houver desenho técnico ampliável
img/<tema>/                             fotos geradas (nunca em Imagens/, que é do cliente)
tools/desenho-iso/                      gerador dos ícones e desenhos, compartilhado
```

O CSS da LP **reaproveita** `base.css`, `site.css`, `pages.css`, `unidade.css` e
`calculadoras.css`. O arquivo próprio carrega só o que é específico. Como ele só é
incluído nessa página, qualquer seletor escrito ali já está escopado: dá para
sobrescrever regra global (o rodapé, por exemplo) sem afetar o resto do site.

Ordem dos scripts no fim do `<body>`:
`config.js` → `layout.js` → `lead.js` → `main.js` → `<tema>-calc.js` →
`<tema>-zoom.js` → `cta.js`. O `cta.js` roda por último porque reescreve os CTAs no
formato anti-metal sem quebrar a interceptação do lead.

O `<body>` carrega `data-landing`, que prende os CTAs na própria página em vez de mandar
para fora.

---

## 4. Blueprint de seções

Dezessete blocos, nesta ordem. A sequência não é decorativa: ela leva de "eu tenho um
problema" até "manda a lista", passando por prova técnica antes de pedir o contato.

| # | Seção | Função |
|---|---|---|
| 1 | Hero com formulário ao lado | Promessa em três linhas e o formulário já na primeira tela |
| 2 | Faixa de números | Porte da empresa, sobre foto, em cartões |
| 3 | O problema | Quatro dores reais, nenhuma sobre preço |
| 4 | A linha completa | Todos os itens, com ícone desenhado de cada peça |
| 5 | Guia técnico | Os três produtos que a pessoa confunde, em cards mais tabela comparativa |
| 6 | Estrutura e componentes | O que segura o serviço, com desenho isométrico |
| 7 | Consumo por metro quadrado | Tabela de referência para orçar |
| 8 | Calculadora | Estima o material a partir das medidas reais |
| 9 | Como comprar | Quatro passos, tirando o medo do processo |
| 10 | Para quem é | Três públicos, com o que identifica cada um |
| 11 | Autoridade | Quem é a empresa, com foto real da unidade |
| 12 | Marcas fornecedoras | Carrossel infinito de logos |
| 13 | Unidades (NAP) | Endereço, telefone e e-mail de cada uma |
| 14 | Fornecedor único | As outras linhas que saem do mesmo pedido |
| 15 | FAQ | Dezoito perguntas em `<details>`, sem JS |
| 16 | Glossário | O vocabulário do produto, com ícone por termo |
| 17 | Conversão final | Formulário de novo, com razão social e CNPJ |

**Três CTAs no meio do caminho**, além dos dois formulários: um no fim da seção do
problema, um no fim da linha de produtos e um no guia técnico. Frase curta mais botão,
dentro de um card com filete vermelho à esquerda.

Regra de proporção: a página tem que ter **muito conteúdo técnico antes de pedir o
contato**. É o que separa uma LP de convencimento de um formulário com enfeite. Na de
drywall são 1.128 linhas de HTML, e isso é o piso, não o teto.

---

## 5. SEO no `<head>`

Tudo estático, nada renderizado por JS:

- `title` com o produto, a região e a marca.
- `description` listando os itens da linha e as cidades.
- `canonical`, Open Graph completo, `theme-color`.
- Preload das duas fontes woff2 em uso.
- `noscript` que anula os `[data-reveal]`, senão quem chega sem JS vê página em branco.

**JSON-LD, cinco blocos:**

1. `WebPage` com `isPartOf` apontando para o site.
2. `BreadcrumbList` de três níveis: grupo, unidade, campanha.
3. `HardwareStore` da unidade principal, com `legalName`, `taxID`, telefone, endereço,
   `areaServed`, `parentOrganization`, as outras unidades em `department` e um
   `hasOfferCatalog` com os produtos.
4. `HowTo` do cálculo de material, um passo por etapa.
5. `FAQPage` com todas as perguntas da seção 15.

Ao editar uma pergunta no HTML, **edite também no JSON-LD**. Eles não são gerados um do
outro e sair de sincronia é o erro mais fácil de cometer aqui.

---

## 6. GEO: fazer a IA citar a página

O que funciona, em ordem de peso:

1. **Conteúdo no HTML.** Se depende de JS, para a IA não existe.
2. **Perguntas literais, respostas completas.** O FAQ é escrito na forma como a pessoa
   pergunta ("qual placa usar em banheiro"), e cada resposta se sustenta sozinha, sem
   depender do resto da página.
3. **Tabela comparativa de verdade**, com as linhas que a pessoa procura: o que é, como
   identificar, onde entra, onde não entra, erro mais comum, medida usual.
4. **Glossário** dos termos do setor.
5. **NAP consistente**: o mesmo endereço e telefone aqui e no JSON-LD.

O que **não** funciona: um bloco de "resumo factual" repetindo a página. Tentamos, o
cliente mandou tirar e ele tinha razão. Repetição incomoda o leitor humano e não acrescenta
nada que o JSON-LD já não entregue. **Não reabrir.**

---

## 7. Conversão

**Formulário.** É o widget Vico de sempre (`lead.js`), montado inline pela LP em vez de
só no modal. Marque o container com `data-lead-inline`. Numa landing de produto único,
trave o produto e esconda a pergunta.

**Opções por página, declaradas em atributos do `<body>`.** Valem para todos os cards da
página, modal incluído, sem tocar no resto do site:

```html
<body data-landing
      data-lead-necessidade
      data-lead-produto="Drywall" data-lead-produto-fixo
      data-lead-submit="Solicitar orçamento">
```

- `data-lead-necessidade` mostra o campo "O que você precisa?" (opções em
  `config.js`, `LEAD.NECESSIDADES`).
- `data-lead-submit` troca o rótulo do botão de envio, e o header da landing segue o
  mesmo texto.
- `data-lead-produto` mais `data-lead-produto-fixo` pré-escolhem e escondem o produto.

**Contrato do campo de qualificação.** O endpoint da Zyvia tem contrato fixo de campos e
não aceita extras. Então o dado do campo novo sai por três caminhos que não dependem
deles: o texto do WhatsApp, o `TrackHub.track` do meutrack e um evento `vico_lead` no
dataLayer do GTM (sem nome e sem telefone, de propósito). No POST só entra com
`LEAD.ENVIAR_NECESSIDADE: true`, hoje `false`. É uma linha para trocar quando a Zyvia
confirmar.

**Contexto extra no handoff.** `window.VOCICAL.leadContexto` é texto livre que a página
preenche e que entra **só** na mensagem do WhatsApp. A calculadora usa isso para mandar a
lista de material junto. É o jeito de enriquecer o lead sem mexer no contrato da Zyvia.

**Botões.** Um verbo só na página inteira. Na de drywall é "Solicitar orçamento", em todos
os CTAs, no header e no botão de envio. As únicas exceções são as que mudam de intenção:
"Fale com um vendedor" no guia técnico, onde o pedido é ajuda para especificar, e
"Solicitar orçamento desta lista" na calculadora, onde o botão manda o resultado junto.

---

## 8. Sistema visual

Herda tudo do site: vermelho `#a60303`, Archivo, malha técnica de 46px, botão anti-metal,
escada de superfícies branco / papel / vermelho / vermelho-escuro.

Duas coisas específicas de LP:

**Sem menu.** O header da landing é logo do grupo mais um botão. O logo da marca da
campanha vai no hero, e precisa **pesar mais que o do grupo no header**: na de drywall,
62px contra 40px no celular. A página é da marca, não do grupo.

**Título do hero em três linhas escolhidas.** Cada linha num `<span class="dw-l">`, que
vira `display:block` a partir de 900px e volta a fluir no mobile. Medir a largura natural
de cada linha e ajustar o `clamp()` do tamanho da fonte até caber: no drywall, a linha
mais longa pedia 672px numa coluna de 539px, e a saída foi transformar a primeira linha
numa entrada menor (`font-size: .62em`) em vez de encolher o título inteiro.

---

## 9. Assets gerados

**Ícones e desenhos técnicos: gerados, não desenhados à mão.** `tools/desenho-iso/` monta
a geometria isométrica de cada peça e devolve o SVG pronto, com sombreamento calculado
pela orientação de cada face. Projeção: `X = (x-y)·cos30`, `Y = (x+y)·sin30 - z`. Perfil
de chapa dobrada é extrudado segmento a segmento. O enquadramento é automático, por
`getBBox()` num navegador headless.

Ícone novo ou ajuste de peça é **lá**, não no HTML. São 21 na LP de drywall: 15 da linha,
3 de público, e os do glossário.

O que aprendemos sobre ícone: ele precisa dizer **o que identifica aquele item**, não onde
o item fica. A primeira leva de ícones de público mostrava loja, prédio e ferramenta
genérica, e foi reprovada duas vezes. A que passou mostra o que os bullets do card
prometem: estante abastecida para revenda, estrutura de concreto em execução para
construtora, parafusadeira detalhada para instalador.

**Fotos: geradas, e o alt diz isso sem mentir.** Ficam em `img/<tema>/`, nunca em
`Imagens/`, que é o acervo do cliente. Legenda e alt descrevem **o produto e o processo,
nunca em primeira pessoa**: "estoque de placas e perfis", jamais "o nosso galpão". Onde a
página fala da empresa em primeira pessoa, como a seção de autoridade, a foto é real.

**Template de prompt de foto de produto**, com a lição que custou duas rodadas:

> Commercial product photograph of [PRODUTO] inside a clean, well organized [AMBIENTE].
> **The [PRODUTO] is a long rectangular sheet measuring [X] by [Y], exactly twice as long
> as it is wide, clearly elongated and never square.** It leans at a diagonal against a
> smooth light grey concrete wall, and **the entire panel is visible within the frame from
> one end to the other**. [TRAÇO QUE IDENTIFICA O PRODUTO]. Soft even daylight from a large
> side opening, shallow depth of field. Neutral color grading, modern and well maintained
> space, smooth level concrete floor in good repair. No text, no labels, no logos, no
> watermarks, no people. Photorealistic, 4:3 landscape, high detail.

Negative prompt: `square panel, equal width and height, panel cropped at the edges of the
frame, text, letters, labels, logos, watermark, brand names, people, hands, damaged or
broken board, dirty or stained surface, cracked floor, cluttered messy warehouse, old
rusty equipment, harsh direct sunlight, oversaturated colors`

**A lição:** se a proporção da peça não estiver escrita com número no prompt, o gerador
entrega quadrado. E se o prompt disser "documentary style", "dry red earth" ou "strong
tropical midday sun" sem declarar a condição do equipamento, ele entrega caminhão velho e
piso rachado. Peça `commercial photograph`, `modern late-model` e
`smooth level concrete yard in good repair`.

**Processamento.** Recorte central para a proporção da figura do card, redimensionar para
1200 por 900, JPEG progressivo com qualidade 82 e `optimize`. Dá entre 60 e 80 KB por
foto.

---

## 10. Mobile: as regras que não são negociáveis

Esta seção é a mais cara do documento. Cada item aqui reprovou em revisão antes de virar
regra.

**Nada de rolagem lateral.** Nem em tabela, nem em desenho. Arrastar conteúdo para o lado
no celular é um jeito de esconder informação.

**Tabela vira bloco empilhado abaixo de 760px.** Cada linha da tabela é um cartão: o
título é o rótulo da linha e, embaixo, uma entrada por coluna. O cabeçalho de coluna é
repetido em cada célula por `td[data-col]` mais `::before`, então a leitura continua
fazendo sentido sem o `<thead>`. Precisa de variante para superfície escura e vermelha.
O `<caption>` precisa de `display: block`, senão o `table-caption` encolhe numa coluna
estreita e quebra palavra por linha.

**Desenho técnico cabe inteiro na tela.** Os rótulos de dentro do SVG somem e viram
legenda numerada embaixo, com as bolinhas vermelhas fazendo a ponte. Rótulo de 15px num
viewBox de 940 renderiza com 6px de altura num celular de 390: é ilegível, não adianta
tentar. Com os rótulos fora, sobra branco em volta do desenho, e aí o `viewBox` é
reapertado pelo `getBBox()` do que ficou visível (`getBBox` ignora `display:none`). No
drywall isso levou o desenho de 940x560 para 469x467, mais que dobrando o tamanho útil.

**Quem quiser detalhe, amplia.** Botão "Ampliar o desenho" abre um visualizador em tela
cheia com o desenho completo e os rótulos de volta, arrasto por ponteiro, pinça de dois
dedos, roda do mouse, duplo clique e ESC. Está em `js/drywall-zoom.js`, genérico o
bastante para reusar: ele opera em qualquer `[data-zoom]` que contenha um `<svg>`.

**Carrossel de logos, não grade.** Marquee infinito igual ao da home, com a lista
duplicada direto no HTML (a página é estática, não tem JS de renderização) e máscara de
fade nas pontas, senão o logo corta no meio e parece defeito.

**Cuidado com `flex-basis` em card que empilha.** `flex: 1 1 22ch` no parágrafo de um card
que vira coluna no mobile faz o `22ch` deixar de ser largura e virar **altura**. Foi isso
que abriu um vão de 200px entre o texto e o botão das faixas de CTA. No breakpoint de
empilhamento, `flex: 0 0 auto`.

**Respiro e divisor entre seções.** Em tela estreita as superfícies branco e papel quase
se confundem e a página parece uma pilha só. Mais ar em cima e embaixo de cada seção, mais
um fio de 1px no topo, claro sobre fundo claro e branco translúcido sobre vermelho e
escuro.

**Rodapé com cena de fundo.** A regra global do `site.css` usa a foto como fundo do rodapé
inteiro, em `cover`. Isso faz a escala da cena depender da altura do card, que depende de
como o texto quebra: o enquadramento muda sozinho a cada tela. Pior, a camada tem
`top: -12%` e `height: 124%` para dar folga ao parallax, e com a foto ancorada em `bottom`
esses 12% caem abaixo da borda do rodapé, que é `overflow: hidden`, cortando a parte de
baixo da cena. A saída é transformar a cena numa faixa própria colada na base, com a
janela de recorte travada: uma variável define a altura e o `background-size` sai dela, com
`max(..., 100%)` para cobrir a largura quando a altura bater no teto do clamp. O parallax
precisa ser neutralizado nessa faixa. Hoje isso está escopado na LP de drywall; se for
padronizar, o lugar é `site.css`.

---

## 11. QA: como verificar de verdade

**Varredura de `src` no HTML não vale.** Em 26/08/2026 um crawler disse "73 assets OK"
enquanto 79 imagens estavam quebradas. Imagem nascida em JS não aparece para quem só lê
HTML.

O roteiro que vale, sempre no navegador:

1. Desligar o lazy (`img.loading='eager'; img.src=img.src`), esperar, contar
   `naturalWidth === 0`. Sem isso, card fora da dobra reporta 0x0 e parece defeito.
2. Contar erros de console e `pageerror`. Ignorar o que é bloqueio de rede do ambiente
   (GTM, meutrack, certificado do proxy).
3. Medir, não olhar: quantas linhas o título do hero ocupa em cada largura, se alguma
   `.dw-tablewrap` tem `scrollWidth > clientWidth`, se cada SVG cabe na viewport, se a
   legenda aparece só no mobile, se o rótulo do SVG aparece só no desktop.
4. Testar o formulário ponta a ponta com o endpoint mockado: conferir o payload que sai,
   o texto do WhatsApp, o `dataLayer.push` e o bloqueio do envio sem campo obrigatório.
   `?leaddry=1` loga tudo sem gerar lead real.
5. Rodar o mesmo roteiro em 390, 1280 e 1440, mais as larguras de transição (1021, 1060).
6. **Verificar que a LP não vazou para o resto do site**: abrir home, contato e uma
   página de unidade e conferir que o formulário, o rótulo do botão e o rodapé seguem
   como estavam.

Antes de qualquer deploy: `python tools/versionar-assets.py`, que carimba `?v=<md5>` nas
referências de css e js em todos os HTML.

---

## 12. Prévia para aprovação

A prévia vai como artefato publicado, não como link do GitHub Pages, porque o cliente abre
no celular e comenta ali.

Receita do pacote: copiar o `index.html` da LP, trocar `data-base="../"` por `""` e
`"../` por `"`, renomear os caminhos de imagem que têm espaço no nome, remover GTM e
meutrack, ligar `LEAD.DRY_RUN = true` e colocar uma faixa preta no topo avisando que o
rastreamento está desligado e o formulário não envia lead real. Copiar junto todo css, js,
fonte e imagem que a página referencia, **inclusive os que só aparecem dentro do CSS**,
como a foto de fundo do rodapé. Foi justamente essa que ficou de fora e virou um "rodapé
sem imagem" que não existia no site real.

---

## 13. Catálogo de armadilhas

Erros que já aconteceram nesta LP. Ler antes de repetir.

| Sintoma | Causa real |
|---|---|
| Vão enorme entre texto e botão no card empilhado | `flex-basis` em `ch` vira altura quando o flex é coluna |
| Título do hero quebrando em 4 linhas | Fonte grande demais para a coluna; medir a largura natural antes de escolher o `clamp` |
| Imagem de fundo do rodapé sumindo | Arquivo referenciado só pelo CSS, esquecido no pacote da prévia |
| Cena do rodapé cortada embaixo | `top: -12%` com `height: 124%` joga a base da foto para fora do `overflow: hidden` |
| Foto gerada saindo quadrada | Proporção não declarada com número no prompt |
| Caminhão velho e piso rachado na foto | `documentary style` e sol forte sem declarar condição do equipamento |
| Ícone que não diz nada | Desenhou o lugar do público em vez do que identifica o item |
| Texto do glossário quebrando uma palavra por linha | Nó de texto solto dentro de `display:grid` vira item anônimo e cai na coluna do ícone |
| Card com produto fixo travando no segundo envio | O reset limpava a seleção que o usuário não tem como refazer |
| Faixa de números no vermelho errado | `.surface--dark` neste projeto é vermelho-escuro `#730a0a`, não preto |
| Desenho com barra vermelha perdida | `perfil(..., eixo='z')` recebendo coordenadas na ordem errada |
| Rótulo do desenho cortado fora do viewBox | Falta estimar a largura do texto ao calcular a margem |
| Ícone errado repetido em cards diferentes | Regex com `.*?` atravessando o fim do bloco; use split por elemento, não regex |
| Legenda da tabela quebrando palavra por linha | `table-caption` num `table` que virou `display: block` |

---

## 14. Checklist para clonar

1. Fechar com o cliente: objetivo, público, e o que **não** pode ser prometido. Na de
   drywall, prazo de entrega ficou fora porque só uma unidade tem estoque.
2. Escrever a spec em `docs/superpowers/specs/`, com as decisões datadas.
3. Criar a pasta da URL, entrar com ela na lista dura do `CLAUDE.md`, nascer com `noindex`.
4. Montar o `<head>`: rastreamento, SEO, os cinco blocos de JSON-LD.
5. Escrever o conteúdo inteiro em HTML, seguindo o blueprint da seção 4.
6. Gerar os ícones e desenhos em `tools/desenho-iso/`.
7. Escrever os prompts de foto com a proporção declarada, gerar, recortar, otimizar.
8. Montar o CSS próprio, com prefixo, aplicando as regras de mobile da seção 10.
9. Ligar o formulário com os atributos do `<body>` e conferir o contrato de rastreamento.
10. Rodar o QA da seção 11, inclusive a verificação de não vazamento.
11. Publicar a prévia e coletar os ajustes.
12. Só depois da aprovação: trocar o `noindex`, incluir no `sitemap.xml`, submeter no
    Search Console e fazer o deploy pelo runbook de três fases do `CLAUDE.md`.
