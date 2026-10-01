# Grupo de produtos por unidade (documento do cliente)

Fonte: `docs/cliente/grupo-de-produtos-por-unidade.pdf`, enviado pelo cliente em
01/10/2026. É a matriz de quais linhas cada unidade trabalha, por marcação "sim".

**Esta página é uma extração parcial. O PDF é a fonte de verdade.**

## Por que parcial

O PDF usa fonte com subset e as strings são UTF-16BE com os códigos deslocados 29
abaixo do caractere real. Dá para decodificar, e a maior parte do texto sai limpa,
mas **13 das 36 linhas de produto não trazem o rótulo no fluxo de texto** — só os
"sim". Essas linhas têm que ser lidas no PDF, a olho. As 23 abaixo são as que
decodificaram com rótulo e posição, e o casamento de coluna é inequívoco (as colunas
ficam a ~100pt uma da outra e o "sim" cai a menos de 40pt do seu cabeçalho).

Receita, caso precise refazer: descomprimir os `stream` do PDF, pegar os operadores
`Tm`/`Td`/`Tj`, decodificar cada string como UTF-16BE somando 29 a cada código, e
agrupar por `y`. As colunas ficam em x = 251, 375, 498, 586, 672, 758 e 844.

## O que saiu limpo

| Produto | Robracon ROO | Robracon CBA | Vocical | Jacical | Ello RP | Ello SC | Robracon SNP |
|---|---|---|---|---|---|---|---|
| ACESSORIOS SERRALHERIA | sim | sim | sim | sim |  | sim | sim |
| AGRO | sim |  |  | sim |  |  | sim |
| ARAME | sim | sim | sim | sim | sim | sim | sim |
| ARGAMASSA | sim | sim | sim | sim | sim | sim | sim |
| CAL | sim | sim | sim | sim | sim | sim | sim |
| CALHA |  |  | sim | sim |  |  |  |
| CANTONEIRA | sim |  | sim | sim | sim |  |  |
| CHAPA | sim |  |  |  | sim |  |  |
| CIMENTO | sim | sim | sim | sim | sim | sim | sim |
| DRYWALL | sim |  |  |  |  |  |  |
| ESTRIBO | sim |  | sim |  | sim |  |  |
| GESSO |  |  | sim | sim |  |  |  |
| IMPERMEABILIZANTE | sim | sim | sim | sim | sim | sim | sim |
| LOUCA |  | sim | sim | sim |  |  |  |
| MECANICA | sim |  | sim | sim | sim |  |  |
| PAINEL | sim |  |  |  |  |  |  |
| PECAS LASER INDUSTRIA | sim |  |  |  |  |  |  |
| PERFIS | sim | sim | sim | sim | sim |  |  |
| PREGO | sim | sim | sim | sim |  |  | sim |
| REJUNTE |  | sim | sim | sim | sim | sim | sim |
| TRELICA | sim | sim | sim | sim | sim | sim | sim |
| TUBOS E CONEXOES |  |  | sim | sim |  |  |  |
| VERGALHAO | sim | sim |  | sim | sim | sim | sim |

## Pontos que importam para o site

- **Não há linha de viga I nem de viga W nesta matriz.** O que existe é
  `COLUNA VIGA BROCA`, com quatro unidades marcadas, e ela está classificada em
  **Aço Construção Civil**, ou seja, é viga de concreto armado, não viga metálica
  estrutural. Confirma o que o cliente disse: viga I e viga W vendem bem e **não
  estão mapeadas**. Entram como linha nova, não como correção de algo existente.
- **Drywall aparece em uma unidade só, a Robracon Rondonópolis.** Bate com o que o
  `CLAUDE.md` já registra e com a LP de campanha.
- **Perfis** estão em Rondonópolis, Cuiabá, Vocical, Jacical e Ello RP.
  **Chapa** só em Rondonópolis e Ello RP. **Cantoneira** em Rondonópolis, Vocical,
  Jacical e Ello RP.
- O PDF traz ainda duas colunas de taxonomia, "Setores site" e "Subsetores site",
  que é como o cliente pensa a navegação de produtos. Vale comparar com as 6
  categorias do `config.js` antes de mexer no catálogo.

## Antes de publicar qualquer coisa a partir daqui

Esta matriz é um retrato do que o cliente mandou, não uma validação. A checklist
`validacao-unidades.md` continua valendo: confirmar com os gerentes antes de afirmar
no site que uma unidade trabalha uma linha.
