# LP de campanha: Drywall Robracon (MT)

Data: 2026-09-13
URL: `/campaigns-robracon-drywall/`
Origem: briefing do gestor de trafego (metodologia PROSP, 17 pecas) + decisoes do cliente.

## 1. Objetivo

Landing page de destino de campanha de Google Ads (busca) para a linha de drywall
da Robracon em Mato Grosso. Tres funcoes, nesta ordem:

1. **Converter** o clique pago em lead qualificado pelo widget Vico.
2. **Convencer** por profundidade de conteudo, nao por promessa.
3. **Ser citavel** por buscador e por IA generativa (SEO + GEO).

## 2. Decisoes de escopo (fechadas com o cliente em 13/09/2026)

| Tema | Decisao |
|---|---|
| Prazo e entrega | **Nao falar de prazo em lugar nenhum.** Sem "frota propria", sem "entrega em todo MT", sem "entrega rapida". O prazo se combina com o vendedor. |
| Formato | LP fechada, sem menu de navegacao. Todos os CTAs abrem o Vico na propria pagina, igual a `/campaigns-robracon-roo/`. |
| URL | `/campaigns-robracon-drywall/` (espelha o padrao `campaigns-<slug>/` ja em producao). |
| Indexacao | `noindex, follow` ate a aprovacao do cliente. Todo o resto de SEO ja montado. Ponto unico de troca marcado no HTML. |
| Imagens | Ilustracao tecnica em SVG inline agora, com pontos de troca marcados para as fotos reais entrarem depois. |
| Calculadora | Completa e interativa, com handoff do resultado para o vendedor. |

## 3. Por que o copy original nao pode subir como veio

O documento do gestor e um bom esqueleto de oferta, mas tem quatro problemas de fato:

1. **A promessa central e falsa na operacao.** "Entrega propria em todo Mato Grosso"
   sustenta as pecas 1, 5, 6, 7, 15 e duas respostas do FAQ. So a Rondonopolis tem
   estoque de drywall; Cuiaba e Sinop trabalham com carga combinada. O cliente decidiu
   nao falar de prazo, entao todo esse eixo sai.
2. **"A Robracon esta no mercado desde 1987" esta incorreto.** 1987 e o Grupo Vocical,
   em Votuporanga/SP. A Robracon Rondonopolis foi constituida em 2004 e opera desde 2005.
   Enquadramento correto: grupo desde 1987, Robracon em MT desde 2005, 11 unidades.
3. **Viola a regra de posicionamento do projeto.** O copy repete "obra" como
   guarda-chuva ("obra parada", "material na obra", "obra grande"). No projeto,
   "canteiro" e banida e "obra" so vale para construtoras, para vergalhao e para
   "mao de obra". O cliente majoritario e revenda.
4. **Prova social vazia.** A peca 16 esta em branco. Sem depoimento real, o lugar dela
   e ocupado por prova de porte verificavel, nunca por depoimento inventado.

## 4. Posicionamento da pagina

**Eixo:** nao e "a gente entrega rapido". E **"a gente tem a linha inteira e nao some"**.

Sustentacao factual, toda verificavel no material do cliente:

- Grupo Vocical distribui material de construcao **desde 1987**; a **Robracon opera em MT desde 2005**.
- **11 unidades** em SP e MT, **3 delas em Mato Grosso**: Rondonopolis, Cuiaba e Sinop.
- Linha de drywall **completa**: 15 itens, da placa ao prego, incluindo ST, RU e Glasroc X.
- Fornecedores homologados de linha: Placo, Quartzolit, Brasilit, entre 16 marcas.
- Atendimento **tecnico e consultivo**, com apoio no quantitativo.
- **Fornecedor unico**: aco, cobertura, serralheria e material de construcao no mesmo CNPJ.

## 5. Publico

Na ordem da regra de posicionamento do projeto:

1. **Revendas** de material de construcao que compram drywall para revender.
2. **Construtoras e incorporadoras** (unico segmento em que "obra" e permitido).
3. **Gesseiros e instaladores** de drywall que prestam servico.

## 6. Estrutura da pagina

| # | Bloco | Superficie | Funcao |
|---|---|---|---|
| 1 | Header enxuto (logo + telefone + CTA) | branco | identidade, sem fuga de trafego |
| 2 | Hero com formulario Vico ao lado | branco + malha | conversao acima da dobra |
| 3 | Faixa medidor de credibilidade | vermelho escuro | porte em numeros |
| 4 | O que trava o fornecimento | papel | identificacao da dor |
| 5 | A linha completa (15 itens) | branco | prova de sortimento |
| 6 | Guia ST x RU x Glasroc X | papel + malha | conteudo tecnico, SEO e GEO |
| 7 | Perfis e estrutura | branco | conteudo tecnico |
| 8 | Consumo por metro quadrado | vermelho escuro | tabela citavel |
| 9 | Calculadora de drywall | branco | conversao + permanencia |
| 10 | Como comprar, em 4 passos | papel | reduz atrito, sem prazo |
| 11 | Para quem e | branco | qualificacao |
| 12 | Quem e a Robracon | vermelho | autoridade |
| 13 | Fornecedores homologados | papel | prova de cadeia |
| 14 | As tres unidades em MT (NAP) | branco | SEO local e entidade |
| 15 | Fornecedor unico da linha | vermelho escuro | ticket e retencao |
| 16 | FAQ (18 perguntas) | papel | SEO, GEO e objecao |
| 17 | Glossario do drywall | branco | cauda longa |
| 18 | Resumo factual | papel | bloco de extracao para IA |
| 19 | Conversao final com formulario | vermelho | fechamento |
| 20 | Rodape com razao social e CNPJ | preto | confianca e entidade |

## 7. SEO

- `title`, `description`, `canonical`, OG completos.
- H1 unico, hierarquia H2 e H3 correta.
- JSON-LD em camadas: `HardwareStore` (as 3 unidades), `Product` + `OfferCatalog`
  da linha drywall, `FAQPage`, `BreadcrumbList`, `HowTo` do calculo de material.
- `noindex, follow` ate aprovar. A linha esta marcada com comentario no HTML.
- Fora do `sitemap.xml` enquanto estiver noindex.

## 8. GEO (recomendacao por IA)

O que separa GEO de SEO, e o que a pagina faz por isso:

1. **Conteudo no HTML estatico.** Crawlers de IA em geral nao executam JavaScript.
   As paginas de unidade e a LP antiga renderizam tudo em JS e chegam vazias para eles.
   Esta LP escreve todo o texto, tabela e FAQ direto no HTML.
2. **Respostas autocontidas.** Cada pergunta do FAQ e cada linha do glossario faz
   sentido sozinha, fora do contexto da pagina.
3. **Afirmacoes factuais com numero, cidade e data**, que e o formato que os modelos citam.
4. **Tabelas de dado real** (comparativo de placa, consumo por m2, perfis).
5. **NAP consistente**: nome, endereco, telefone e CNPJ identicos aos do resto do site.
6. **Bloco de resumo factual** no fim da pagina.
7. **`dateModified`** no schema.

## 9. Conversao

- Formulario Vico inline no hero, repetido na calculadora e no fechamento.
- Produto pre-selecionado como "Drywall": tira um passo do funil.
- Qualificacao extra (volume, cidade, tipo de cliente) entra **no texto do WhatsApp**,
  nao no payload da Zyvia, que tem contrato fixo de campos.
- Todo link de WhatsApp usa `api.whatsapp.com`. `wa.me` quebra o gatilho do GTM.
- GTM `GTM-MGL778C` e meutrack no head, iguais as demais paginas de producao.

## 10. Pendencias que dependem do cliente

- [ ] Politica de troca e devolucao (peca 15 do briefing).
- [ ] Formas de pagamento aceitas (FAQ).
- [ ] Depoimentos reais ou avaliacoes do Google Meu Negocio.
- [ ] Validacao dos coeficientes de consumo por m2 pela equipe tecnica da Robracon.
- [ ] Confirmacao de que Cuiaba e Sinop atendem drywall sob carga combinada.
- [ ] Fotos reais de drywall (estoque, montagem) para trocar os SVG.
