# -*- coding: utf-8 -*-
"""Os dois desenhos tecnicos da LP de telha galvalume.

1. Sistema de cobertura: terca, telha, sobreposicao lateral e fixacao na crista.
2. Arremates: cumeeira no encontro das aguas, rufo na parede e calha no beiral.

A telha e inclinada, entao nao da para usar `Cena.perfil`, que extruda em x ou em z
com a secao sempre no mesmo nivel. Aqui a secao anda junto com o caimento: cada
segmento vira um quadrilatero cujo lado de baixo esta mais baixo que o de cima.

Roda:  python3 tools/desenho-iso/desenhos-cobertura.py
Grava: desenhos-cobertura.json
"""
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cena import Cena, OUT
from coberturas import sec_trapezoidal

GALVALUME = '#c9d1d6'
GALVANIZADO = '#aeb9c2'
ACO = '#8f979e'
ALVENARIA = '#d9d4cb'
EPDM = '#26292d'

CAI = 0.16          # caimento: quanto a telha desce por unidade de comprimento


# ------------------------------------------------------------------ helpers
def telha(c, sec, x0, x1, y0, z0, cor=GALVALUME, grupo=0, sw=1.0, caimento=CAI):
    """Chapa trapezoidal inclinada: a secao (y,z) extrudada de x0 a x1, descendo."""
    for i in range(len(sec) - 1):
        (a1, b1), (a2, b2) = sec[i], sec[i + 1]
        za, zb = z0 - caimento * x0, z0 - caimento * x1
        c.face([(x0, y0 + a1, za + b1), (x0, y0 + a2, za + b2),
                (x1, y0 + a2, zb + b2), (x1, y0 + a1, zb + b1)], cor, grupo, sw)
    # aresta da secao nas duas pontas, que e o que da leitura do perfil
    for x, z in ((x0, z0 - caimento * x0), (x1, z0 - caimento * x1)):
        for i in range(len(sec) - 1):
            c.linha((x, y0 + sec[i][0], z + sec[i][1]),
                    (x, y0 + sec[i + 1][0], z + sec[i + 1][1]), OUT, sw * .9, grupo)


def extrude_y(c, sec_xz, y0, y1, cor, grupo=0, sw=1.0, tampa=True):
    """Perfil com a secao em (x,z), extrudado ao longo de y. Serve para terca e calha."""
    for i in range(len(sec_xz) - 1):
        (x1, z1), (x2, z2) = sec_xz[i], sec_xz[i + 1]
        c.face([(x1, y0, z1), (x2, y0, z2), (x2, y1, z2), (x1, y1, z1)], cor, grupo, sw)
    if tampa:
        for y in (y0, y1):
            for i in range(len(sec_xz) - 1):
                c.linha((sec_xz[i][0], y, sec_xz[i][1]),
                        (sec_xz[i + 1][0], y, sec_xz[i + 1][1]), OUT, sw * .9, grupo)


def parafuso(c, x, y, z, grupo=9, k=1.0):
    """Parafuso autobrocante com arruela de vedacao, de pe na crista da onda."""
    c.caixa((x - 1.1 * k, y - 1.1 * k, z), (2.2 * k, 2.2 * k, 3.4 * k), ACO, grupo, sw=.8)
    c.caixa((x - 2.6 * k, y - 2.6 * k, z - .9 * k), (5.2 * k, 5.2 * k, .9 * k), EPDM, grupo, sw=.8)


# ------------------------------------------------------------------ desenho 1
def sistema():
    """Terca, telha, sobreposicao lateral e o parafuso na crista."""
    c = Cena()
    sec = sec_trapezoidal(3, periodo=26.0, alt=5.0, topo=7.0, rampa=4.5)
    larg = sec[-1][0]                       # largura util de uma chapa
    passo = larg - 26.0                     # a chapa de cima cobre uma onda da de baixo
    ZT = 52.0                               # altura da telha na cumeeira
    X0, X1 = 0.0, 104.0

    # --- tercas: perfil Z atravessado sob as telhas
    def terca_z(xc, ymax, grupo=0):
        z = ZT - CAI * xc - 9.6
        sec_z = [(xc - 5.0, z), (xc - 0.6, z), (xc - 0.6, z + 8.4), (xc + 4.0, z + 8.4)]
        extrude_y(c, sec_z, -4.0, ymax, ACO, grupo, sw=1.0)

    terca_z(22.0, larg + passo + 4.0)   # esta corre sob as duas chapas
    terca_z(80.0, larg + passo + 4.0)   # aparece no rasgo deixado pelo corte

    # --- chapa de baixo, inteira
    telha(c, sec, X0, X1, 0.0, ZT, GALVALUME, grupo=2)
    # --- chapa de cima, deslocada de uma onda e cortada no meio do comprimento,
    #     para deixar a terca a vista, como no corte da parede de drywall
    telha(c, sec, X0, 58.0, passo, ZT + 0.5, GALVALUME, grupo=3)

    # --- parafusos na crista, em cima das duas tercas
    for xc in (22.0, 80.0):
        zc = ZT - CAI * xc + 5.0
        for k in range(3):
            yc = sec[2][0] + 3.5 + k * 26.0
            if xc > 58.0 or yc < passo:
                parafuso(c, xc, yc, zc, grupo=9)
    for k in range(3):
        yc = passo + sec[2][0] + 3.5 + k * 26.0
        parafuso(c, 22.0, yc, ZT - CAI * 22.0 + 5.5, grupo=9)

    # --- chamadas
    c.marca((14, passo + sec[2][0] + 2, ZT - CAI * 14 + 5.5), -52, -46,
            'Telha trapezoidal galvalume', '1', 'end')
    c.marca((40, passo + 2.0, ZT - CAI * 40 + 5.0), 104, -70,
            'Sobreposição lateral de uma onda', '2', 'start')
    c.marca((80, larg + 34.0, ZT - CAI * 80 - 1.2), 74, 34,
            'Terça, o apoio da telha', '3', 'start')
    c.marca((22, sec[2][0] + 3.5, ZT - CAI * 22 + 8.6), -66, -26,
            'Parafuso com vedação, na crista', '4', 'end')
    return c.svg(940, 560, margem=16, fonte=15)


# ------------------------------------------------------------------ desenho 2
def arremates():
    """Cumeeira no encontro das aguas, rufo contra a parede e calha no beiral."""
    c = Cena()
    sec = sec_trapezoidal(3, periodo=26.0, alt=5.0, topo=7.0, rampa=4.5)
    larg = sec[-1][0]
    ZT = 56.0
    Y0, Y1 = 0.0, larg

    # --- parede lateral, que e o que justifica o rufo
    c.caixa((-22.0, -13.0, 0.0), (130.0, 11.0, 66.0), ALVENARIA, grupo=0, sw=1.0)

    # --- agua de tras (curta) e agua da frente (longa), encontrando na cumeeira em x=0
    telha(c, sec, -28.0, 0.0, Y0, ZT, GALVALUME, grupo=2, caimento=-CAI)
    telha(c, sec, 0.0, 104.0, Y0, ZT, GALVALUME, grupo=2, caimento=CAI)

    # --- cumeeira: duas abas dobradas sobre o encontro, ao longo de y
    zc = ZT + 6.4
    sec_cum = [(-19.0, zc - 19.0 * CAI - 1.2), (-17.0, zc - 17.0 * CAI),
               (0.0, zc + 2.6), (17.0, zc - 17.0 * CAI), (19.0, zc - 19.0 * CAI - 1.2)]
    extrude_y(c, sec_cum, Y0 - 2.0, Y1 + 2.0, GALVALUME, grupo=6, sw=1.0)

    # --- rufo: aba na parede e aba deitada na telha, acompanhando o caimento
    for i, (xa, xb) in enumerate(((0.0, 34.0), (34.0, 68.0), (68.0, 100.0))):
        za, zb = ZT - CAI * xa + 5.6, ZT - CAI * xb + 5.6
        c.face([(xa, -2.0, za), (xa, -2.0, za + 13.0),
                (xb, -2.0, zb + 13.0), (xb, -2.0, zb)], GALVALUME, 7, 1.0)
        c.face([(xa, -2.0, za), (xa, 9.0, za), (xb, 9.0, zb), (xb, -2.0, zb)],
               GALVALUME, 7, 1.0)

    # --- calha no beiral, em U, correndo ao longo de y
    zb = ZT - CAI * 104.0 - 2.0
    sec_calha = [(104.0, zb + 1.0), (105.0, zb - 8.0), (116.0, zb - 8.0), (117.0, zb + 2.4)]
    extrude_y(c, sec_calha, Y0 - 2.0, Y1 + 2.0, GALVANIZADO, grupo=6, sw=1.0)

    # --- tapa-onda fechando o vao da onda no beiral
    for k in range(3):
        y = sec[1][0] + k * 26.0
        c.caixa((100.0, y, zb + 2.2), (4.0, 15.5, 4.6), GALVALUME, grupo=8, sw=.85)

    # --- chamadas
    c.marca((0, larg * .62, zc + 2.6), -44, -58,
            'Cumeeira no encontro das águas', '1', 'end')
    c.marca((52, -2.0, ZT - CAI * 52 + 15.0), 104, -44,
            'Rufo no encontro com a parede', '2', 'start')
    c.marca((110, larg * .55, zb - 4.0), 96, 54, 'Calha no beiral', '3', 'start')
    c.marca((102, sec[1][0] + 8.0, zb + 6.8), -96, 62,
            'Tapa-onda fecha o vão da onda', '4', 'end')
    return c.svg(940, 560, margem=16, fonte=15)


if __name__ == '__main__':
    aqui = os.path.dirname(os.path.abspath(__file__))
    saida = {'sistema': sistema(), 'arremates': arremates()}
    json.dump(saida, open(os.path.join(aqui, 'desenhos-cobertura.json'), 'w'))
    corpo = ''.join(
        '<figure><svg viewBox="0 0 940 560" font-family="Archivo, system-ui, sans-serif">%s</svg>'
        '<figcaption>%s</figcaption></figure>' % (v, k) for k, v in saida.items())
    open(os.path.join(aqui, 'cobertura-preview.html'), 'w').write(
        '<meta charset="utf-8"><style>body{background:#fff;font:600 13px system-ui;margin:0;'
        'padding:18px}figure{margin:0 0 18px}svg{width:100%;border:1px solid #e4e4e4;'
        'border-radius:14px;background:#fbfbfb}figcaption{margin:6px 2px 0;color:#777}'
        '</style>' + corpo)
    print('ok', list(saida))
