# Desenho isométrico da LP de drywall

Gera os 15 ícones de produto e os 2 desenhos técnicos de
`/campaigns-robracon-drywall/`. Existe para que o desenho possa ser refeito a
partir da geometria quando o conteúdo mudar, em vez de alguém editar path de SVG
na mão.

## Por que geometria calculada

Os perfis de drywall são chapa dobrada: cada segmento da seção é uma chapa plana.
O gerador extruda segmento a segmento e sombreia cada face pela orientação dela em
relação à luz, então guia, montante, F530, tabica e cantoneira saem com a forma
real do produto, não com uma aproximação desenhada a olho.

## Arquivos

- `iso.py` — projeção isométrica e primitivas (caixa, perfil extrudado, elipse).
- `cena.py` — cena 3D com ordenação por profundidade, cotas e chamadas numeradas.
- `icones.py` — os 15 ícones da linha de produto (perfis e peças, extrusão em x).
- `icones-extra.py` — os 6 que precisam de cena 3D: três conceitos do glossário
  (sistema, chapeamento duplo, espaçamento entre montantes) e os três públicos da
  seção "quem atendemos" (revenda, construtora, instalador).
- `desenhos.py` — corte isométrico da parede e do forro.
- `fit.mjs` — mede o bounding box de cada ícone no browser e grava o enquadramento.
- `icones-final.json` / `desenhos.json` — saída pronta, que é o que entra no HTML.

## Como regerar

```
python3 tools/desenho-iso/desenhos.py       # grava desenhos.json
python3 -c "import sys;sys.path.insert(0,'tools/desenho-iso');import json;from icones import ICONES;json.dump(ICONES,open('tools/desenho-iso/icones-raw.json','w'))"
node tools/desenho-iso/fit.mjs tools/desenho-iso   # precisa de playwright, só para medir o enquadramento
```

```
python3 tools/desenho-iso/icones-extra.py      # grava icones-extra.json, já enquadrado
```

Depois é só injetar o conteúdo dos JSON no `<svg>` correspondente do
`campaigns-robracon-drywall/index.html`. O ícone de cada item é resolvido pelo
nome: `<h3 class="dw-item__n">` na linha de produto e `<dt class="dw-gloss__t">`
no glossário. Os 21 ícones cobrem os 15 itens da linha, os 16 termos do glossário
(13 reaproveitados) e os 3 cards de público.
