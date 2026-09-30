# Prompts das fotos da LP de telha galvalume

Dez fotos, no mesmo padrão das dez da LP de drywall. Vão para `img/telha/`, nunca
para `Imagens/`, que é o acervo do cliente: a distinção entre foto real e foto
gerada precisa continuar óbvia.

## Situação (fechada em 30/09)

**As dez estão no lugar.** Nada pendente de geração.

Três slots foram resolvidos com **foto real** do acervo do cliente, da operação de
Rondonópolis, e são melhores que qualquer foto gerada: por serem reais e da unidade,
a legenda ali pode falar em primeira pessoa, o que o resto das fotos da página não pode.

| Slot | Resolvido por | O que mostra |
|---|---|---|
| 8. `producao-sob-medida.jpg` | `Imagens/Robracon ROO/robracon1 (13).png` | Telha trapezoidal saindo conformada dos rolos da perfiladeira |
| 10. `bobina-galvalume.jpg` | `Imagens/Robracon ROO/robracon1 (14).png` | Bobina na desbobinadeira, alimentando a linha |
| extra: `corte-dobra-chapa.jpg` | `Imagens/Robracon ROO/corte-dobra-chapa.png` | Dobradeira conformando chapa, de onde saem calha e rufo |

**Antes de escrever prompt, varrer o acervo.** As fotos de cobertura em
`Imagens/Produtos/` são miniaturas de 150 por 150 pixels e não servem, mas as das
pastas de unidade servem, e eu quase gerei foto para algo que o cliente já tinha
fotografado.

As outras sete são geradas, porque são produto isolado e telhado montado, que o acervo
não tem. Recortadas na proporção de cada slot, 1500 x 1000 (3:2), 1200 x 900 (4:3) ou
1500 x 844 (16:9), JPEG 82 progressivo. **Não passam pelo `tools/tratar-foto.py`:**
aquilo é para foto de acervo escura, e estas já nascem limpas do gerador; mexer só
degradaria.

Sobrou uma reserva, `montagem-cobertura-alt.jpg`, segundo enquadramento do telhado em
montagem. Está no repositório mas fora da página, para trocar sem gerar de novo.

### A ondulada custou duas rodadas, e o motivo vale para a próxima LP

A primeira rodada devolveu **trapezoidal de passo estreito**, não ondulada: dobra viva
e vale plano, só com as ondas mais juntas. Não dava para usar, porque o card diz na
linha "Como reconhecer" que a ondulada tem **"ondas curvas e contínuas, sem vale plano"**
— a foto contradiria o próprio texto que ensina a distinguir uma da outra, que é a razão
de ser do card.

A causa é a mesma classe da proporção no drywall: **"corrugated roofing sheet" em metal
quase sempre devolve chapa nervurada**, porque é isso que domina o treinamento.

O que resolveu, e que está no prompt 3 abaixo:

1. **Repetir a proibição de três formas.** Uma só o gerador atropela. Seção como senoide
   pura; depois "no straight segments anywhere, no flat valleys, no flat crests and no
   sharp folds or creases of any kind"; e por fim o comportamento da luz, que "grades
   softly and continuously around each curve instead of breaking at an edge". O terceiro
   costuma pesar mais que a descrição da forma, porque o modelo entende bem o que é uma
   quina refletindo.
2. **Referência de produto conhecido:** "the same wave shape as a classic corrugated
   fibre cement or corrugated zinc sheet".
3. **Medida da onda em número:** 18 mm de profundidade, passo de 76 mm, cerca de treze
   ondas na largura. Número já tinha resolvido a proporção da placa no drywall, e aqui
   evitou três ondas gigantes.
4. **"trapezoidal" no negative prompt**, junto de straight ribs, flat valleys, sharp
   folds e box profile.

**Por que gerar.** As fotos de cobertura que existem no acervo
(`Imagens/Produtos/TELHAS.jpg`, `bobina-galvalume.jpg`, `telha-termoacustica.jpg`,
`telha-fibrocimento.jpg`, `telha-transparente.jpg`) são todas miniaturas de
150 por 150 pixels. Não servem para nada além de ícone de catálogo.

**As duas lições que custaram rodada no drywall**, já aplicadas em todos os prompts
abaixo:

1. Se a proporção da peça não estiver escrita **com número**, o gerador entrega
   quadrado. Toda telha aqui tem a medida declarada e a frase "clearly elongated
   and never square".
2. Sem declarar a condição do equipamento e do piso, vem caminhão velho e chão
   rachado. Todo prompt pede `commercial photograph`, `modern late-model` e
   `smooth level concrete in good repair`.

**Sobre o galvalume.** É aço revestido de liga alumínio-zinco. Na foto ele é prata
fosco, levemente mais claro e mais quente que o galvanizado, com o desenho sutil de
cristalização na superfície. Os prompts dizem isso, senão o gerador entrega inox
espelhado ou alumínio escovado.

---

## Negative prompt (o mesmo em todas)

```
square panel, equal width and height, panel cropped at the edges of the frame,
mirror finish, polished chrome, brushed aluminium, text, letters, labels, logos,
watermark, brand names, people, hands, dented or bent sheet, rusty or corroded
metal, dirty or stained surface, cracked floor, cluttered messy warehouse, old
rusty equipment, harsh direct sunlight, oversaturated colors
```

---

## 1. `estoque-telhas-galvalume.jpg` · 16:9 · fundo da faixa de números

```
Commercial photograph of a clean, well organized building materials warehouse
interior, with long galvalume trapezoidal roofing sheets stacked flat in tall
neat bundles on one side and bundles of Z purlins on the other. The sheets are
six metres long and one metre wide, clearly elongated and never square, stacked
so the ribbed profile reads along the whole length. Galvalume finish: matte
aluminium-zinc coated steel, light neutral silver with a faint crystalline
spangle pattern, not mirrored and not brushed. Wide establishing shot down the
aisle, soft even daylight from high side windows, smooth level concrete floor in
good repair, modern well maintained racking. Neutral color grading. No text, no
labels, no logos, no watermarks, no people. Photorealistic, 16:9 landscape,
high detail.
```

## 2. `telha-trapezoidal.jpg` · 4:3 · card do guia técnico

```
Commercial product photograph of a single galvalume trapezoidal roofing sheet
inside a clean, well organized warehouse. The sheet measures 1 metre wide by
3 metres long, exactly three times as long as it is wide, clearly elongated and
never square. It leans at a diagonal against a smooth light grey concrete wall,
and the entire sheet is visible within the frame from one end to the other. The
defining trait: bold straight trapezoidal ribs about 40 mm high running the full
length of the sheet, with flat valleys between them, the ribs catching the light
along their crowns. Galvalume finish: matte aluminium-zinc coated steel, light
neutral silver with a faint crystalline spangle, not mirrored. Soft even daylight
from a large side opening, shallow depth of field. Neutral color grading, modern
and well maintained space, smooth level concrete floor in good repair. No text,
no labels, no logos, no watermarks, no people. Photorealistic, 4:3 landscape,
high detail.
```

## 3. `telha-ondulada.jpg` · 4:3 · card do guia técnico — PRONTA na segunda rodada

Negative prompt desta aqui, além do comum: `trapezoidal profile, straight ribs,
flat valleys, sharp folds, angular creases, box profile, standing seam`.

```
Commercial product photograph of a single corrugated metal roofing sheet with a
sinusoidal wave profile, inside a clean, well organized warehouse. The sheet
measures 1 metre wide by 3 metres long, exactly three times as long as it is
wide, clearly elongated and never square. It leans at a diagonal against a
smooth light grey concrete wall, and the entire sheet is visible within the
frame from one end to the other. The defining trait, which must be unmistakable:
the cross section is a pure sine wave, a continuous smooth curve from crest to
trough with no straight segments anywhere, no flat valleys, no flat crests and
no sharp folds or creases of any kind, the same wave shape as a classic
corrugated fibre cement or corrugated zinc sheet, about 18 mm deep with a wave
pitch of about 76 mm, so roughly thirteen full waves across the width. The light
grades softly and continuously around each curve instead of breaking at an edge.
Galvalume finish: matte aluminium-zinc coated steel, light neutral silver with a
faint crystalline spangle, not mirrored. Soft even daylight from a large side
opening, shallow depth of field. Neutral color grading, modern and well
maintained space, smooth level concrete floor in good repair. No text, no
labels, no logos, no watermarks, no people. Photorealistic, 4:3 landscape, high
detail.
```

## 4. `telha-termoacustica.jpg` · 4:3 · card do guia técnico

```
Commercial product photograph of a single thermoacoustic sandwich roofing panel
inside a clean, well organized warehouse. The panel measures 1 metre wide by
3 metres long, exactly three times as long as it is wide, clearly elongated and
never square. It leans at a diagonal against a smooth light grey concrete wall,
and the entire panel is visible within the frame from one end to the other. The
defining trait: the cut end faces the camera and shows the sandwich construction
in section, a trapezoidal galvalume top skin, a thick white expanded polystyrene
insulating core about 30 mm thick, and a flat smooth galvalume liner sheet
underneath. Galvalume finish: matte aluminium-zinc coated steel, light neutral
silver, not mirrored. Soft even daylight from a large side opening, shallow depth
of field. Neutral color grading, modern and well maintained space, smooth level
concrete floor in good repair. No text, no labels, no logos, no watermarks, no
people. Photorealistic, 4:3 landscape, high detail.
```

## 5. `tercas-perfis.jpg` · 3:2 · seção de estrutura

```
Commercial photograph of neatly stacked galvanized steel Z purlins and C
channels in a clean, well organized warehouse. The profiles are six metres long
and about 200 mm deep, clearly elongated, bundled and banded, with the folded Z
and C cross sections clearly visible at the near end of the stack facing the
camera. Matte galvanized finish with a visible spangle pattern. Soft even
daylight from high side windows, shallow depth of field on the cut ends. Neutral
color grading, modern and well maintained space, smooth level concrete floor in
good repair. No text, no labels, no logos, no watermarks, no people.
Photorealistic, 3:2 landscape, high detail.
```

## 6. `montagem-cobertura.jpg` · 3:2 · seção do sistema

```
Commercial photograph of a metal roof under assembly on an industrial building,
seen from above and to the side. Long galvalume trapezoidal sheets are being laid
across steel Z purlins, one sheet overlapping the next by one rib, with self
drilling screws fitted with dark EPDM sealing washers fixed along the crowns of
the ribs. The purlins are visible underneath where the sheeting has not yet
reached. Galvalume finish: matte aluminium-zinc coated steel, light neutral
silver, not mirrored. Bright but soft overcast daylight, no harsh shadows.
Neutral color grading, modern and well maintained structure. No text, no labels,
no logos, no watermarks, no people. Photorealistic, 3:2 landscape, high detail.
```

## 7. `cumeeira-arremates.jpg` · 3:2 · seção de arremates

```
Commercial photograph of the ridge of a finished galvalume metal roof, close
three quarter view. A folded ridge cap runs along the top where the two roof
slopes meet, lapping over the trapezoidal sheets on both sides, and a wall
flashing runs along the junction with a rendered wall to one side. The folded
edges and the overlaps are crisp and clearly readable. Galvalume finish: matte
aluminium-zinc coated steel, light neutral silver, not mirrored. Soft overcast
daylight, no harsh shadows. Neutral color grading, modern and well maintained
building. No text, no labels, no logos, no watermarks, no people. Photorealistic,
3:2 landscape, high detail.
```

## 8. `producao-sob-medida.jpg` · 3:2 · **RESOLVIDO com foto real, não gerar**

```
Commercial photograph of a modern late-model roll forming machine producing a
galvalume trapezoidal roofing sheet inside a clean, well lit industrial shed. A
coil of galvalume steel feeds into one end of the machine and a finished ribbed
sheet emerges from the other onto a long run out table, clearly elongated and
extending out of the frame. The machine is modern, clean and well maintained,
painted in a neutral industrial colour. Soft even industrial lighting, smooth
level concrete floor in good repair. Neutral color grading. No text, no labels,
no logos, no watermarks, no people. Photorealistic, 3:2 landscape, high detail.
```

## 9. `carregamento-telhas.jpg` · 16:9 · pátio de carregamento — PRONTA

```
Commercial photograph of long galvalume roofing sheets being loaded onto a modern
late-model flatbed truck in the clean paved yard of a building materials
distributor. The bundles are six metres long, banded with protective edge
timbers, clearly elongated, and the loaded length reads across the frame. The
truck is modern, clean and in good condition. Soft late afternoon daylight
without harsh shadows, smooth level concrete yard in good repair, tidy
surroundings. Neutral color grading. No text, no labels, no logos, no watermarks,
no people. Photorealistic, 16:9 landscape, high detail.
```

## 10. `bobina-galvalume.jpg` · 3:2 · **RESOLVIDO com foto real, não gerar**

```
Commercial photograph of galvalume steel coils standing on end in a clean, well
organized warehouse, with one coil in the foreground turned so the wound layers
of the strip and the open eye at the centre face the camera. Matte aluminium-zinc
coated steel, light neutral silver with a faint crystalline spangle, not
mirrored, the wound edge crisp and undamaged. Soft even daylight from high side
windows, shallow depth of field. Neutral color grading, modern and well
maintained space, smooth level concrete floor in good repair. No text, no labels,
no logos, no watermarks, no people. Photorealistic, 3:2 landscape, high detail.
```

---

## Processamento depois de gerar

Mesma receita das fotos de drywall, que deu entre 60 e 80 KB por arquivo:

- recorte central para a proporção da figura do card;
- redimensionar para **1200 x 900** (4:3, cards do guia técnico),
  **1500 x 1000** (3:2) ou **1500 x 844** (16:9);
- JPEG progressivo, qualidade 82, com `optimize`.

## Regra de legenda e de alt

Descrever **o produto e o processo, nunca em primeira pessoa**: "estoque de telhas
e perfis", jamais "o nosso galpão". Onde a página fala da Robracon em primeira
pessoa, como a seção de autoridade, a foto é real, de `Imagens/Capas Unidades/`.
