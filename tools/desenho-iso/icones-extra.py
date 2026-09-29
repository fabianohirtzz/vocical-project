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
    """Estante de estoque: placas embaixo, perfis no meio, baldes em cima.
    O que identifica revenda nao e a fachada, e a prateleira abastecida."""
    c = Cena()
    L, D, H = 28.0, 11.0, 26.0
    niveis = (0.0, 9.0, 18.0)
    # montantes da estante
    for x in (0.0, L - 2.0):
        c.caixa((x, 0, 0), (2.0, 2.0, H), '#8b9298', grupo=0, sw=.8)
        c.caixa((x, D - 2.0, 0), (2.0, 2.0, H), '#8b9298', grupo=0, sw=.8)
    # prateleiras
    for z in niveis:
        c.caixa((-1.0, -.6, z), (L + 2.0, D + 1.2, 1.4), '#b9c0c5', grupo=1, sw=.8)
    # placas empilhadas no nivel de baixo
    c.caixa((1.5, 1.0, niveis[0] + 1.4), (23.0, 8.5, 5.2), PLACA, grupo=2, sw=.75)
    # perfis amarrados no nivel do meio
    for k in range(3):
        c.caixa((1.5, 1.2 + k * 2.6, niveis[1] + 1.4), (23.0, 2.2, 2.4), GALV, grupo=2, sw=.7)
    # baldes de massa no nivel de cima
    for k in range(3):
        c.caixa((2.5 + k * 7.5, 3.0, niveis[2] + 1.4), (5.4, 5.4, 5.4), '#e9ecef', grupo=2, sw=.75)
        c.face([(2.5 + k * 7.5, 3.0, niveis[2] + 3.6), (7.9 + k * 7.5, 3.0, niveis[2] + 3.6),
                (7.9 + k * 7.5, 3.0, niveis[2] + 4.9), (2.5 + k * 7.5, 3.0, niveis[2] + 4.9)],
               '#a60303', grupo=3, sw=.6, lum=1.0)
    return c


def construtora():
    """Estrutura de concreto em execucao: dois pavimentos prontos e a laje de
    cima ainda pela metade. Predio pronto nao diz construtora, obra em
    andamento diz."""
    c = Cena()
    L, D = 24.0, 20.0
    CONC = '#d9d6d0'
    PIL = '#cbc7c1'
    pilares = ((1.5, 1.5), (L - 4.0, 1.5), (1.5, D - 4.0), (L - 4.0, D - 4.0))
    def laje(z, comp=L, cor=CONC, grupo=0):
        c.caixa((-1.0, -1.0, z), (comp + 1.0, D + 2.0, 1.6), cor, grupo=grupo, sw=.85)
    laje(0)
    for nivel in (1.6, 12.2):
        for (x, y) in pilares:
            c.caixa((x, y, nivel), (2.5, 2.5, 9.0), PIL, grupo=1, sw=.8)
        laje(nivel + 9.0, grupo=2)
    # laje de cobertura pela metade, com as esperas de ferro aparecendo
    laje(22.8, comp=13.0, cor='#cfccc6', grupo=3)
    for (x, y) in pilares[1:]:
        if x > 12:
            c.linha((x + 1.25, y + 1.25, 21.8), (x + 1.25, y + 1.25, 26.4), '#a60303', 1.4, grupo=4)
    return c


def instalador():
    """Parafusadeira com o parafuso na ponta: a ferramenta de quem monta."""
    c = Cena()
    CORPO = '#a60303'
    # corpo, com o motor mais estreito atras
    c.caixa((0, 1.2, 8.4), (5.5, 5.6, 6.4), '#8d0303', grupo=1, sw=.8)
    c.caixa((5.5, .6, 7.6), (11.0, 6.8, 8.0), CORPO, grupo=1, sw=.85)
    # colar e mandril
    c.caixa((16.5, 2.0, 9.2), (2.2, 4.0, 4.8), '#5f666b', grupo=1, sw=.75)
    c.caixa((18.7, 2.6, 10.0), (4.6, 2.8, 3.2), '#7b8288', grupo=1, sw=.75)
    # ponta e parafuso sendo apertado
    c.caixa((23.3, 3.4, 11.0), (4.0, 1.2, 1.2), ACO, grupo=1, sw=.7)
    c.caixa((27.3, 3.0, 10.6), (1.2, 2.0, 2.0), '#c9d0d5', grupo=2, sw=.7)
    c.caixa((28.5, 3.6, 11.2), (3.4, .8, .8), '#b9c0c5', grupo=2, sw=.65)
    # gatilho
    c.caixa((5.8, 2.6, 6.0), (2.0, 2.8, 2.0), '#2f3336', grupo=1, sw=.7)
    # cabo e bateria
    c.caixa((6.5, 1.6, -1.0), (5.4, 4.8, 8.8), '#33383b', grupo=0, sw=.85)
    c.caixa((4.6, .8, -4.6), (9.2, 6.4, 3.8), '#464d51', grupo=0, sw=.85)
    c.linha((5.5, .6, 13.4), (16.5, .6, 13.4), '#6e0202', 1.2, grupo=2)
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
