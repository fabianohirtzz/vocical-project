# Curadoria do acervo do Drive — Robracon Rondonópolis

Pasta de origem: `14jC7jipLAs1H6hLrHrc77r2gJ3nNf4Gg`, 96 fotos, Sony ILCE-6500,
6000 x 4000, feitas em 2018. Todas da mesma unidade: o uniforme traz
**(66) 3422-8878**, que é o telefone da Robracon Rondonópolis no `config.js`.

Selecionadas **34**, tratadas e gravadas em `Imagens/Robracon ROO Drive/`,
recortadas em 3:2, 1400 x 933, JPEG 82 progressivo. Os originais do Drive não
foram alterados: o tratamento gerou cópia nova, com nome por assunto.

## O que o acervo tem, por assunto

| Assunto | Quantas | Aproveitadas | Observação |
|---|---|---|---|
| Estruturais: metalon, tubo redondo, tubo pintado | 20 | 10 | O melhor bloco do acervo. Seção de topo em foco, feixe em perspectiva |
| Cimento e argamassa em pilha | 22 | 3 | Muito repetitivo, oito quadros quase idênticos da mesma pilha |
| Corte e dobra de vergalhão, estribos, armaduras | 14 | 8 | Mostra o serviço acontecendo, com operador |
| Telha de fibrocimento e mourão no pátio | 6 | 3 | **É fibrocimento, não galvalume** |
| Escritório e equipe comercial | 13 | 4 | Rostos identificáveis em várias |
| Galpão, ponte rolante, carregamento | 12 | 6 | Boas para porte e logística |
| Prateleira de caixaria, caixa d'água | 9 | 1 | Escuras e sem assunto claro |

## O que isso NÃO resolve

**Nenhuma das 96 fotos mostra telha galvalume.** A única cobertura no acervo é
**telha ondulada de fibrocimento** empilhada no pátio, com a etiqueta da Imbralit
visível, ao lado de mourões de concreto. Serve para a linha de coberturas do site
e para o catálogo de fibrocimento, **não** para a LP de telha galvalume: usar essa
foto lá seria dizer galvalume e mostrar fibrocimento.

Continuam pendentes de geração, sem substituto no acervo, os 7 slots de
`img/telha/` e a número 9 da lista de prompts:

- `estoque-telhas-galvalume.jpg`, `telha-trapezoidal.jpg`, `telha-ondulada.jpg`,
  `telha-termoacustica.jpg`, `tercas-perfis.jpg`, `montagem-cobertura.jpg`,
  `cumeeira-arremates.jpg`
- `carregamento-telhas.jpg` (a #9): o acervo tem carregamento, mas de cimento em
  saco, e a legenda da seção fala de telha comprida

`tercas-perfis.jpg` foi o que chegou mais perto: há metalon e tubo galvanizado em
feixe, mas terça é perfil Z ou C, de chapa dobrada, e não aparece no acervo.

## O tratamento aplicado

`tools/tratar-foto.py`, o mesmo das outras fotos do projeto. Resolve exatamente o
que o cliente descreveu:

- **equilíbrio de branco** por cinza-médio, que tira a dominante amarelo-esverdeada
  da luz de galpão. É o ganho mais visível, principalmente nas do corte e dobra;
- **autocontraste** com clipping pequeno, usando a faixa real do histograma;
- **levantamento de sombra** por curva de gama, que clareia só a parte escura sem
  estourar o telhado e as janelas;
- contraste e saturação leves;
- **nitidez por último**, depois do redimensionamento, senão vira ruído.

## O que ainda precisa da sua IA

O tratamento acima é processamento de imagem, determinístico. Ele **não remove
sujeira, mancha nem objeto** — isso é edição generativa. Pela ordem de quanto
incomoda:

1. **`aco-corte-dobra-panoramica`, `aco-armaduras-dobradas`, `aco-estribos-bobinas`,
   `aco-corte-dobra-operador`, `aco-montagem-armadura`** — piso de concreto com
   mancha de óleo e poeira de ferrugem, parede com respingo e marca de impacto.
   É o bloco que mais pede sua IA, e é justamente o que mostra o serviço.
2. **`materiais-empilhadeira`, `logistica-carregamento`, `logistica-caminhao-carregado`**
   — piso sujo de cimento e pneu da empilhadeira marcando o chão.
3. **`porte-galpao-ponte-rolante`, `porte-galpao-vao`, `equipe-operador-estruturais`**
   — piso manchado no primeiro plano e sombra pesada no fundo do galpão. Aqui o
   tratamento já ajudou bastante; a IA só melhoraria o piso.
4. **`materiais-estoque-cimento`, `materiais-cimento-corredor`** — poeira de cimento
   em tudo, que é o normal da operação. Pode ser deixada como está.

Não precisam de IA: todo o bloco **estruturais** (fundo escuro, assunto limpo, a
seção do tubo em foco resolve o quadro) e as três de **coberturas** (pátio a céu
aberto, luz boa).

## Questão de imagem das pessoas

`equipe-comercial`, `equipe-comercial-corredor` e `equipe-sala-vendas` têm rostos
identificáveis de funcionários. As do galpão mostram a equipe de costas, o que não
levanta a questão. **Antes de publicar as do escritório, confirmar autorização de
uso de imagem com o cliente.**

## Onde usar

- **Galeria da Robracon Rondonópolis** (`js/unidades-data.js`): hoje tem 6 fotos;
  este conjunto permite uma galeria bem mais forte da unidade.
- **Categoria Coberturas** e card de **telha de fibrocimento** no catálogo: hoje o
  card é miniatura de 150px. `coberturas-telha-fibrocimento` resolve.
- **Categoria Estruturais e Serralheria**: o bloco de metalon e tubo é melhor que a
  foto genérica que está lá.
- **Serviço de corte e dobra de vergalhão**: `aco-corte-dobra-operador` e
  `aco-montagem-armadura` mostram o serviço de verdade.
