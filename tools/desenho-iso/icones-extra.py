# -*- coding: utf-8 -*-
"""Icones que precisam de cena 3D (perfil vertical, volumes empilhados).

Os 15 da linha de produto estao em icones.py, que basta extrudar ao longo de x.
Estes seis montam cena: tres conceitos do glossario (sistema, chapeamento duplo,
espacamento) e os tres publicos da secao "quem atendemos".
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cena import Cena

GALV = '#c8d0d6'
PLACA = '#e3d7c0'
CONCRETO = '#dfdcd6'
VIDRO = '#7d868d'
FERRAMENTA = '#a60303'
ACO = '#9aa3aa'


def _mont(c, x, alt=22, larg=7, grupo=2, sw=.8):
    """Montante em pe: secao C no plano xy, extrudada em z."""
    sec = [(x + 4.2, 1.4), (x + 4.2, 0), (x, 0), (x, larg), (x + 4.2, larg), (x + 4.2, larg - 1.4)]
    c.perfil(sec, alt, GALV, eixo='z', base=0, grupo=grupo, sw=sw)


def sistema():
    """Pedaco de parede: guia, dois montantes e a placa fechando uma face."""
    c = Cena()
    L, H, w, t = 30.0, 24.0, 7.0, 1.6
    c.perfil([(0, 0), (w, 0), (w, 3)], L, GALV, eixo='x', base=0, grupo=1, sw=.8)
    _mont(c, 2, H, w); _mont(c, 20, H, w)
    c.perfil([(0, 0), (0, 3)], L, GALV, eixo='x', base=0, grupo=3, sw=.8)
    c.caixa((0, -t, 0), (17, t, H), PLACA, grupo=4, sw=.8)
    return c


def chapeamento():
    """Duas placas por face: a de tras aparece na borda da da frente."""
    c = Cena()
    H, t = 24.0, 1.8
    _mont(c, 0, H, 7, grupo=1)
    _mont(c, 18, H, 7, grupo=1)
    c.caixa((0, -t, 0), (28, t, H), '#d9ccb4', grupo=2, sw=.8)
    c.caixa((3.5, -2 * t - .5, 0), (21, t, H), PLACA, grupo=3, sw=.8)
    return c


def espacamento():
    """Dois montantes e a cota entre eles."""
    c = Cena()
    H = 24.0
    _mont(c, 0, H, 7, grupo=1)
    _mont(c, 20, H, 7, grupo=1)
    z = -5.0
    c.linha((2, 0, z), (22, 0, z), '#a60303', 1.6, grupo=5)
    c.linha((2, 0, z + 2.6), (2, 0, z - 2.6), '#a60303', 1.6, grupo=5)
    c.linha((22, 0, z + 2.6), (22, 0, z - 2.6), '#a60303', 1.6, grupo=5)
    c.linha((2, 0, 0), (2, 0, z + 2.8), '#c9c9c9', 1.0, grupo=5, dash='2 2')
    c.linha((22, 0, 0), (22, 0, z + 2.8), '#c9c9c9', 1.0, grupo=5, dash='2 2')
    return c


def revenda():
    """Loja de material de construcao: volume com toldo listrado e vitrine."""
    c = Cena()
    L, D, H = 22.0, 14.0, 15.0
    c.caixa((0, 0, 0), (L, D, H), CONCRETO, grupo=0, sw=.85)
    # toldo avancando sobre a calcada, na frente (y negativo)
    c.caixa((0, -5.5, H - 4.6), (L, 5.5, 1.2), '#a60303', grupo=1, sw=.8)
    for i in range(1, 5):
        x = L * i / 5
        c.linha((x, -5.5, H - 3.4), (x, 0, H - 3.4), '#ffffff', 1.5, grupo=2)
    # vitrine e porta na face da frente
    c.face([(2.5, 0, 2), (11, 0, 2), (11, 0, 9.5), (2.5, 0, 9.5)], VIDRO, grupo=2, sw=.8, lum=1.0)
    c.face([(13.5, 0, 0), (19, 0, 0), (19, 0, 9.5), (13.5, 0, 9.5)], '#5d656b', grupo=2, sw=.8, lum=1.0)
    # paletes de placa encostados na fachada
    c.caixa((2.5, -9.5, 0), (8.5, 4, 5.4), PLACA, grupo=3, sw=.75)
    return c


def construtora():
    """Duas torres, a mais alta ainda em estrutura."""
    c = Cena()
    c.caixa((0, 0, 0), (11, 11, 30), CONCRETO, grupo=0, sw=.85)
    c.caixa((13, 1.5, 0), (9, 9, 19), '#d3d0ca', grupo=0, sw=.85)
    for z in (3.5, 9.5, 15.5, 21.5):
        for x in (1.6, 6.2):
            c.face([(x, 0, z), (x + 3.2, 0, z), (x + 3.2, 0, z + 3.6), (x, 0, z + 3.6)],
                   VIDRO, grupo=1, sw=.7, lum=1.0)
    for z in (3.5, 9.5):
        c.face([(14.6, 1.5, z), (20.4, 1.5, z), (20.4, 1.5, z + 3.6), (14.6, 1.5, z + 3.6)],
               VIDRO, grupo=1, sw=.7, lum=1.0)
    # laje de cobertura em execucao na torre alta
    c.caixa((-1, -1, 30), (13, 13, 1.6), '#b9bcbe', grupo=2, sw=.85)
    return c


def instalador():
    """Parafusadeira: corpo, cabo, bateria e ponta."""
    c = Cena()
    c.caixa((0, 0, 8), (16, 8, 8), FERRAMENTA, grupo=1, sw=.85)      # corpo
    c.caixa((16, 2, 9.5), (7, 4, 4.5), '#6f767c', grupo=1, sw=.8)    # mandril
    c.caixa((23, 3.2, 10.6), (7, 1.6, 2.2), ACO, grupo=1, sw=.75)    # ponta
    c.caixa((3.5, 1.5, 0), (6, 5, 8), '#2f3336', grupo=0, sw=.85)    # cabo
    c.caixa((1.5, .5, -3.4), (10, 7, 3.6), '#3f4549', grupo=0, sw=.85)  # bateria
    c.linha((0, 0, 13.5), (16, 0, 13.5), '#7c0303', 1.2, grupo=2)
    return c


EXTRA = {
    'sistema': sistema().svg(64, 64, margem=3, margem_y=3),
    'chapeamento': chapeamento().svg(64, 64, margem=3, margem_y=3),
    'espacamento': espacamento().svg(64, 64, margem=3, margem_y=3),
    'revenda': revenda().svg(64, 64, margem=3, margem_y=3),
    'construtora': construtora().svg(64, 64, margem=3, margem_y=3),
    'instalador': instalador().svg(64, 64, margem=3, margem_y=3),
}

if __name__ == '__main__':
    import json
    aq = os.path.dirname(os.path.abspath(__file__))
    json.dump(EXTRA, open(os.path.join(aq, 'icones-extra.json'), 'w'))
    cards = ''.join('<div class="c"><svg viewBox="0 0 64 64">%s</svg><p>%s</p></div>' % (v, k)
                    for k, v in EXTRA.items())
    open(os.path.join(aq, 'extra-preview.html'), 'w').write(
        '<meta charset="utf-8"><style>body{background:#fff;font:600 12px system-ui;margin:0;padding:20px;'
        'display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.c{border:1px solid #e4e4e4;border-radius:12px;'
        'padding:10px;text-align:center}svg{width:88px;height:88px;display:block;margin:0 auto;'
        'background:rgba(166,3,3,.05);border-radius:12px}p{margin:7px 0 0;color:#666}</style>' + cards)
    print('ok', len(EXTRA))
