# -*- coding: utf-8 -*-
"""Os dois desenhos tecnicos da LP: corte isometrico de parede e de forro."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cena import Cena, OUT

GALV = '#c8d0d6'
PLACA = '#e3d7c0'
PLACA_FUNDO = '#d8ccb6'
LAJE = '#cdcdcd'
ACO = '#98a1a8'


def parede():
    L, H, w, t = 118.0, 44.0, 7.0, 1.4
    passo = 22.0
    montantes = [i * passo for i in range(6)]          # 0 .. 110
    c = Cena()

    # 0 — placa da face de tras (fecha o outro lado da parede)
    c.caixa((0, w, 0), (L, t, H), PLACA_FUNDO, grupo=0, sw=1.0)

    # 1 — guias: base e aba de tras (a aba da frente vem depois dos montantes)
    c.perfil([(0, 0), (w, 0), (w, 3.4)], L, GALV, eixo='x', base=0, grupo=1, sw=1.0)
    c.perfil([(w, H - 3.4), (w, H), (0, H)], L, GALV, eixo='x', base=0, grupo=1, sw=1.0)

    # 2 — montantes
    for xs in montantes:
        sec = [(xs + 4.4, 1.5), (xs + 4.4, 0), (xs, 0), (xs, w), (xs + 4.4, w), (xs + 4.4, w - 1.5)]
        c.perfil(sec, H, GALV, eixo='z', base=0, grupo=2, sw=1.0)

    # 3 — aba da frente das guias
    c.perfil([(0, 0), (0, 3.4)], L, GALV, eixo='x', base=0, grupo=3, sw=1.0)
    c.perfil([(0, H), (0, H - 3.4)], L, GALV, eixo='x', base=0, grupo=3, sw=1.0)

    # 4 — placas da face da frente: duas chapas, ate o montante do meio (corte)
    c.caixa((0, -t, 0), (44, t, H), PLACA, grupo=4, sw=1.0)
    c.caixa((44, -t, 0), (44, t, H), PLACA, grupo=4, sw=1.0)

    # 5 — parafusos na linha dos montantes, junta tratada
    for xs in (0, 22, 44, 66):
        for z in (5, 14, 23, 32, 40):
            c.linha((xs + 2.2, -t - .02, z), (xs + 2.2, -t - .35, z), '#a60303', 2.6, grupo=5)
    c.face([(44, -t - .05, 0), (44 + 2.6, -t - .05, 0), (44 + 2.6, -t - .05, H), (44, -t - .05, H)],
           '#f3efe6', grupo=5, sw=.9, lum=1.0)
    c.linha((45.3, -t - .12, 0), (45.3, -t - .12, H), '#a60303', 1.6, grupo=5, dash='4 3')

    # 6 — cota do espacamento entre montantes, na parte sem placa
    zc = -9.0
    c.linha((88, 0, zc), (110, 0, zc), '#8a8a8a', 1.2, grupo=6)
    c.linha((88, 0, zc + 2.6), (88, 0, zc - 2.6), '#8a8a8a', 1.2, grupo=6)
    c.linha((110, 0, zc + 2.6), (110, 0, zc - 2.6), '#8a8a8a', 1.2, grupo=6)
    c.linha((88, 0, 0), (88, 0, zc + 2.8), '#c9c9c9', .9, grupo=6, dash='3 3')
    c.linha((110, 0, 0), (110, 0, zc + 2.8), '#c9c9c9', .9, grupo=6, dash='3 3')
    c.marca((99, 0, zc), -58, 22, '0,60 m entre montantes', None, 'middle')

    c.marca((16, -t, H - 3), -40, -52, 'Placa, uma face de cada lado', '1', 'end')
    c.marca((45.3, -t, H * .72), 96, -52, 'Junta com fita telada e massa', '5', 'start')
    c.marca((104, 2, H * .80), 74, -44, 'Montante, o perfil vertical', '2', 'start')
    c.marca((104, 3.5, 1.7), 66, 40, 'Guia, no piso e no teto', '3', 'start')
    c.marca((22 + 2.2, -t - .35, 23), -84, 34, 'Parafuso ponta agulha', '4', 'end')
    return c


def forro():
    L, D = 118.0, 40.0
    zf = -17.0            # face de baixo do perfil F530
    t = 1.5
    c = Cena()

    # 0 — laje e parede de encontro
    c.caixa((0, 0, 0), (L, D, 5), LAJE, grupo=0, sw=1.0)
    c.caixa((-5, 0, -34), (5, D, 39), '#d5d5d5', grupo=0, sw=1.0)

    # 1 — pendurais com regulador
    linhas_y = (9.0, 29.0)
    for y in linhas_y:
        for x in (20.0, 62.0, 104.0):
            c.caixa((x - .5, y - .5, zf + 3), (1.0, 1.0, -zf - 3), ACO, grupo=1, sw=.8)
            c.caixa((x - 1.5, y - 1.5, zf + 8.5), (3.0, 3.0, 3.4), '#8d969d', grupo=1, sw=.8)

    # 2 — presilhas
    for y in linhas_y:
        for x in (20.0, 62.0, 104.0):
            c.caixa((x - 2.0, y - 2.6, zf + 2.6), (4.0, 5.2, 2.2), '#b9c2c8', grupo=2, sw=.8)

    # 3 — perfis F530
    for y in linhas_y:
        sec = [(y - 5.5, zf), (y - 2.5, zf), (y - 2.5, zf + 3), (y + 2.5, zf + 3), (y + 2.5, zf), (y + 5.5, zf)]
        c.perfil(sec, L, GALV, eixo='x', base=0, grupo=3, sw=1.0)

    # 4 — placa do forro, cortada para mostrar a estrutura
    c.caixa((0, 0, zf - t), (74, D, t), PLACA, grupo=4, sw=1.0)

    # 5 — parafusos na linha dos perfis e tabica no encontro com a parede
    for y in linhas_y:
        for x in (8.0, 26.0, 44.0, 62.0):
            c.linha((x, y, zf - t - .02), (x, y, zf - t - .5), '#a60303', 2.6, grupo=5)
    c.caixa((0, 0, zf - t - 2.6), (2.8, D, 2.6), '#b7c0c7', grupo=5, sw=.9)

    c.marca((22, 2, 5), -58, -46, 'Laje', '1', 'end')
    c.marca((62, 9, zf + 11), 70, -62, 'Pendural com regulador de altura', '2', 'start')
    c.marca((104, 29, zf + 4.6), 76, -26, 'Presilha', '3', 'start')
    c.marca((100, 9, zf + 1.5), 76, 36, 'Perfil F530', '4', 'start')
    c.marca((34, 24, zf - t), -86, 40, 'Placa parafusada por baixo', '5', 'end')
    c.marca((1.4, 34, zf - t - 1.3), -46, 30, 'Tabica no encontro com a parede', '6', 'end')
    return c


if __name__ == '__main__':
    aq = os.path.dirname(os.path.abspath(__file__))
    svgs = {
        'parede': (parede().svg(940, 560, margem=178, margem_y=64, fonte=15), 940, 560),
        'forro': (forro().svg(940, 540, margem=186, margem_y=70, fonte=15), 940, 540),
    }
    html = ''.join('<figure><svg viewBox="0 0 %d %d">%s</svg><figcaption>%s</figcaption></figure>'
                   % (w, h, s, k) for k, (s, w, h) in svgs.items())
    open(os.path.join(aq, 'desenhos-preview.html'), 'w').write(
        '<meta charset="utf-8"><style>body{background:#fff;font:600 13px Archivo,system-ui;margin:0;padding:20px}'
        'figure{margin:0 0 24px;border:1px solid #e4e4e4;border-radius:14px;padding:16px}'
        'svg{width:100%;height:auto;display:block}figcaption{margin-top:8px;color:#888}</style>' + html)
    import json
    json.dump({k: v[0] for k, v in svgs.items()}, open(os.path.join(aq, 'desenhos.json'), 'w'))
    print('ok')
