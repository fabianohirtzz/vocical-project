# LP de campanha: Telha Galvalume (Robracon/MT)

Spec aberta em 29/09/2026. Por enquanto guarda só os **dados brutos do Google Ads**
entregues pelo cliente, para a redação da LP acontecer em cima de número real, e não
de suposição. A página ainda não existe.

## URL prevista

`/campaigns-robracon-telha-galvalume/` (ou outro nome, desde que comece com
`campaigns-`). **Regra dura do projeto:** o `config.js` marca o lead como tráfego pago
(`canal: lp`) olhando a pasta `/campaigns-`. LP de campanha fora desse padrão entra
como orgânica e falseia a atribuição no Vico.

## Os dados

Período: **1 de junho a 29 de setembro de 2026**. Uma campanha de rede de pesquisa, um
grupo de anúncios (`Grp - Telhas Metálicas`), 16 palavras-chave em correspondência de
frase. Segmentação geográfica: **só Mato Grosso**.

| Métrica | Valor |
|---|---|
| Impressões | 8.007 |
| Cliques | 573 |
| CTR | 7,16% |
| Custo | R$ 630,66 |
| CPC médio | R$ 1,10 |
| Conversões | 4 |
| Custo por conversão | R$ 157,67 |

Pontos que saltam dos arquivos e que a LP precisa levar em conta:

- **A campanha só começou a rodar na semana de 27/07/2026.** As oito primeiras semanas
  do período estão zeradas. O histórico útil é de cerca de dois meses.
- **97% das impressões são de smartphone** (7.797 de 8.007). A LP nasce mobile.
- **Quem clica não pesquisa por galvalume.** A palavra-chave `telha galvalume` teve 163
  impressões, enquanto `comprar telha metálica` teve 3.854 e `telha metálica orçamento`
  2.329. Nos termos de pesquisa reais, o topo é `telha isotermica` (428 impressões),
  `telha sanduiche` (280) e `telha de zinco` (279). Galvalume e aluzinco aparecem pouco.
- **A intenção dominante é preço.** As consultas campeãs são "valor", "preço",
  "quanto custa", "preço por metro", "preço m2". A LP terá de responder a pergunta de
  preço de algum jeito, mesmo sem publicar tabela.
- **Há demanda por cidade:** Cuiabá, Rondonópolis, Sinop, Sorriso e Várzea Grande
  aparecem nos termos de pesquisa, e as três unidades da Robracon em MT cobrem isso.
- **Concorrência:** no relatório de leilão, o Mercado Livre tem 39,17% de parcela de
  impressões contra 18,01% da campanha do cliente. Depois vêm Kingspan/Isoeste (13,56%)
  e telhacoisotelhas (10,64%).
- **As 4 conversões** do relatório vêm da única conversão configurada na conta, o clique
  em link de WhatsApp (ver `CLAUDE.md`, bloco de rastreamento). Confirmar com o gestor
  antes de usar esse número como medida de lead.

## Arquivos

Todos em `dados-google-ads/`, exportados do Google Ads pelo cliente, sem edição de
conteúdo. Só os nomes foram normalizados (sem espaço, acento ou parêntese).

| Arquivo | O que traz |
|---|---|
| `palavras-chave-rede-de-pesquisa.csv` | As 16 palavras-chave com impressão, clique, custo e conversão |
| `palavras-chave-de-pesquisa.csv` | As mesmas palavras-chave, resumidas por custo e CTR |
| `termos-de-pesquisa.csv` | O que as pessoas digitaram de fato (relatório completo) |
| `pesquisas-consultas.csv` | Consultas agregadas por volume |
| `pesquisas-por-palavra.csv` | Palavras isoladas dentro das consultas |
| `serie-temporal.csv` | Semana a semana |
| `dia-semana.csv` · `hora.csv` · `dia-e-hora.csv` | Distribuição por dia e por hora |
| `dispositivos.csv` | Computador, celular, tablet, TV |
| `demografia-idade.csv` · `demografia-sexo.csv` · `demografia-sexo-idade.csv` | Perfil de quem vê o anúncio |
| `leilao-comparar-metricas.csv` · `leilao-metrica-ao-longo-do-tempo.csv` | Concorrentes no leilão |
| `locais-relatorio-geografico.csv` · `locais-segmentacao.csv` | Só Mato Grosso |
| `pontuacao-de-otimizacao.csv` | Veio vazio na exportação |

## Antes de escrever a página

Vale reler o que a LP de drywall (`/campaigns-robracon-drywall/`) fixou, porque as
mesmas regras valem aqui: HTML estático por causa do GEO, sem promessa de prazo ou
entrega, revenda antes de obra, e o formulário do Vico com produto pré-selecionado.
Spec: `docs/superpowers/specs/2026-09-13-lp-drywall-robracon-design.md`.

Pendências de conteúdo a levantar com o cliente: linha de telha que a Robracon
realmente trabalha em cada unidade, espessuras e comprimentos disponíveis, se telha
sob medida é confirmada fora de Rondonópolis, e política de preço na página.
