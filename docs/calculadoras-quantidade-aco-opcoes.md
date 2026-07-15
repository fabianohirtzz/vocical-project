# Calculadora "Quantidade de Aço" — opções de direção

**Status:** em aberto, aguardando decisão da direção do Grupo Vocical.
**Decisão provisória (2026-07-14):** manter a **Opção A — Estimativa por volume de concreto (m³)**, já implementada. Reavaliar após conversa com a dona da empresa.

Este documento registra as três formas possíveis de construir a calculadora
"Quantidade de Aço" da página `calculadoras.html`, para apoiar a decisão de negócio.
As outras cinco calculadoras (peso teórico, conversor polegada/mm, área de seção,
corte e dobra, espaçadores) não são afetadas por esta decisão.

---

## Contexto

A página de calculadoras foi inspirada nos simuladores da ArcelorMittal
(`conexao.arcelormittal.com.br/simuladores`). Ao estudar o simulador deles,
descobrimos que a ferramenta "Quantitativo de Aço" da ArcelorMittal **não é uma
estimativa rápida** — é um **detalhamento de armadura barra a barra**: o usuário
cadastra cada elemento estrutural (viga, pilar, sapata, estaca) com as dimensões e a
armadura real (bitola, número de barras, estribo, espaçamento) e o sistema gera uma
"Tabela de Aço" somando o peso por bitola. É uma ferramenta de engenharia, e fica
atrás de login (acesso só para clientes cadastrados da ArcelorMittal).

A estimativa simples por área (a versão "fácil") na ArcelorMittal mora no
"Portfólio Guiado", que optamos por não replicar.

Diante disso, há três caminhos possíveis para a nossa calculadora.

---

## Opção A — Estimativa por volume de concreto (m³)  ✅ implementada

O usuário informa o **tipo de elemento** (laje, viga, pilar, sapata, radier) e o
**volume de concreto em m³**. A calculadora estima o aço aplicando uma taxa usual de
consumo (kg de aço por m³ de concreto) e mostra também a faixa provável.

**Taxas usadas (kg/m³), calibradas por referências públicas de engenharia:**

| Elemento | Mínimo | Referência | Máximo |
|---|---|---|---|
| Laje maciça | 70 | 80 | 100 |
| Viga | 90 | 110 | 130 |
| Pilar | 100 | 120 | 150 |
| Sapata / fundação | 40 | 50 | 70 |
| Radier | 70 | 85 | 100 |

Base: superestrutura (laje + viga + pilar) gira em torno de 100 kg/m³ e
infraestrutura (sapatas) em torno de 40 kg/m³.

- **Prós:** baixa fricção, número tecnicamente defensável, ótima como isca de lead,
  já está pronta e testada.
- **Contras:** exige que o usuário saiba o volume de concreto (nem todo leigo sabe).
- **Esforço:** concluído.

## Opção B — Estimativa por área construída (m²)

O usuário informa a **área construída em m²** e o **tipo de obra** (casa, prédio,
galpão). A calculadora estima o aço por uma taxa kg/m² de área.

- **Prós:** mais intuitiva para o público leigo (todo mundo sabe a metragem da obra).
- **Contras:** a taxa por m² varia bastante conforme padrão e altura da obra, então a
  estimativa é menos precisa e mais difícil de defender tecnicamente.
- **Esforço:** pequeno (troca de campo e de tabela de taxa na calculadora atual).

## Opção C — Detalhamento de armadura barra a barra (réplica fiel da ArcelorMittal)

O usuário cadastra cada elemento (viga, pilar, sapata, estaca) com dimensões e
armadura real, e o sistema gera o romaneio exato somando o peso por bitola.

- **Prós:** fidelidade total ao simulador da ArcelorMittal; ferramenta de real valor
  técnico e autoridade; resultado preciso (peso teórico por bitola × comprimento).
- **Contras:** é uma ferramenta de engenharia com fricção alta (muitos campos por
  elemento); build grande; foge do posicionamento "estimativa rápida" das demais.
- **Esforço:** grande (nova interface de cadastro de elementos, lógica de
  detalhamento, tabela de resultado).

---

## Recomendação técnica

Para o objetivo do site (autoridade técnica + geração de lead), a **Opção A** entrega
o melhor custo-benefício: útil, honesta como estimativa e sem afastar o visitante.
A **Opção C** só se justifica se a Vocical quiser posicionar o site como ferramenta
de engenharia de referência (e assumir o build maior). A **Opção B** é um meio-termo
mais amigável, porém menos preciso.

## Notas de calibração das outras estimativas (referências públicas)

- **Corte e dobra:** perda de aço no corte manual em obra fica entre 5% e 15%
  (comum ~10%); no corte e dobra industrializado a perda cai para menos de 1%.
- **Espaçadores treliçados:** consumo linear de cerca de 1,66 m/m² para treliça
  convencional e 0,85 m/m² para o espaçador tipo W (rende ~50% a mais).

Fontes consultadas: AECweb (taxa de armadura), Intacta Engenharia e blog Rangel Lage
("números mágicos" das estruturas), FAMETH (espaçador tipo W), e materiais sobre
corte e dobra de vergalhão (grupoolx/OLX, Mikrostamp, AçoBuilder).
