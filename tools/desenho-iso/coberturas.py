# -*- coding: utf-8 -*-
"""Icones da linha de cobertura metalica, em isometria, com geometria calculada.

Telha e chapa dobrada: a secao e um perfil e o corpo e a extrusao dela ao longo do
comprimento. Entao trapezoidal, ondulada, cumeeira, rufo, calha, terca e arremate
saem todos de `perfil()`, com a forma real da peca, e nao de um desenho a olho.

Roda:  python3 tools/desenho-iso/coberturas.py
Grava: coberturas-raw.json  (sem enquadramento; quem enquadra e o fit.mjs)
"""
import os, sys, math, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from iso import iso, pts, poly, line, shade, box, perfil

OUT = '#14161a'
GALVALUME = '#c9d1d6'    # liga aluminio-zinco, cinza claro levemente frio
GALVANIZADO = '#aeb9c2'  # zinco puro, mais escuro e mais azulado
ACO = '#9aa3aa'
EPS = '#f2efe6'          # nucleo isolante da termoacustica
POLI = '#cfe3ec'         # policarbonato translucido
FIBRO = '#c4c1b8'        # fibrocimento
EPDM = '#26292d'         # arruela de vedacao


def rev(sec):
    """Inverte o sentido da secao.

    `perfil` tira a normal do sentido de percurso: o lado "de fora" e o que fica a
    esquerda de quem caminha pela secao. Numa telha o lado de fora e o de cima, e
    percorrer de y maior para y menor e o que poe a normal apontando para cima.
    Sem isso a telha inteira renderiza com a luz de baixo e sai chapada de escuro.
    """
    return list(reversed(sec))


# ---------------------------------------------------------------- secoes
def sec_trapezoidal(nper=3, periodo=25.0, alt=4.2, topo=6.5, rampa=4.0):
    """Secao de telha trapezoidal: vale, rampa, crista, rampa, vale.

    periodo e a distancia entre cristas; topo e a largura da crista; rampa e o
    avanco horizontal de cada aba inclinada. O vale e o que sobra.
    """
    vale = periodo - topo - 2 * rampa
    if vale <= 0:
        raise ValueError('periodo curto demais para essa crista e essa rampa')
    p = [(0.0, 0.0)]
    y = 0.0
    for i in range(nper):
        y += vale / 2 if i == 0 else vale
        p.append((y, 0.0))
        y += rampa;  p.append((y, alt))
        y += topo;   p.append((y, alt))
        y += rampa;  p.append((y, 0.0))
    y += vale / 2
    p.append((y, 0.0))
    return p


def sec_ondulada(nper=3, periodo=17.0, amp=2.6, passos=10):
    """Secao de telha ondulada: senoide amostrada, comecando e terminando no vale."""
    p = []
    total = nper * periodo
    n = nper * passos
    for i in range(n + 1):
        y = total * i / n
        z = amp * 0.5 * (1 - math.cos(2 * math.pi * y / periodo))
        p.append((y, z))
    return p


# ---------------------------------------------------------------- telhas
def _telha(sec, cor, comp=23.0, s=1.42, ox=12, oy=44, sw=0.8, esp=0.9):
    return perfil(sec, comp, cor, s, ox, oy, sw=sw, espessura=esp)


def telha_trapezoidal():
    return _telha(rev(sec_trapezoidal(3)), GALVALUME)


def telha_ondulada():
    # a onda e curva: tracinho fino em cada faceta, senao o degrade vira grade
    return _telha(rev(sec_ondulada(3)), GALVALUME, sw=0.34, esp=0.95)


def telha_galvanizada():
    # mesma familia, zinco puro: onda mais aberta e tom mais azulado
    return _telha(rev(sec_ondulada(3, periodo=19.0, amp=3.0)), GALVANIZADO, sw=0.34, esp=0.95)


def telha_translucida():
    return _telha(rev(sec_trapezoidal(3)), POLI)


def telha_fibrocimento():
    # fibrocimento: onda mais longa e mais baixa que a metalica
    return _telha(rev(sec_ondulada(2, periodo=24.0, amp=2.9)), FIBRO, sw=0.34, esp=1.1)


def telha_termoacustica():
    """Telha sanduiche: chapa trapezoidal em cima, nucleo de EPS, liner liso embaixo."""
    s, ox, oy = 1.42, 12, 46
    comp = 23.0
    nucleo = 4.6
    sec_topo = sec_trapezoidal(3)
    larg = sec_topo[-1][0]
    o = ''
    # liner liso, na base
    o += perfil(rev([(0.0, 0.0), (larg, 0.0)]), comp, GALVANIZADO, s, ox, oy, sw=0.8, espessura=0.85)
    # nucleo de EPS entre as duas chapas, visto pelo topo do corte
    o += box((0, 0, 0.35), (comp, larg, nucleo), EPS, s, ox, oy,
             sw=0.7, topmul=1.0, leftmul=0.94, rightmul=0.84)
    # chapa trapezoidal apoiada no nucleo
    o += perfil(rev([(y, z + nucleo + 0.35) for (y, z) in sec_topo]), comp, GALVALUME,
                s, ox, oy, sw=0.8, espessura=0.9)
    return o


# ---------------------------------------------------------------- acessorios
def cumeeira():
    """Cumeeira: duas aguas dobradas sobre a crista, com o lip virado para baixo."""
    sec = [(0.0, -1.3), (1.6, 0.0), (11.0, 3.6), (20.4, 0.0), (22.0, -1.3)]
    return _telha(sec, GALVALUME, comp=22.0, esp=0.95)


def rufo():
    """Rufo: aba vertical que sobe na parede e aba horizontal que deita na telha."""
    sec = [(0.0, 12.0), (0.0, 0.0), (9.0, 0.0), (9.0, 1.7)]
    return _telha(sec, GALVALUME, comp=23.0, esp=0.95)


def calha():
    """Calha em U, com a borda externa dobrada para fora."""
    sec = [(0.0, 10.0), (0.0, 0.9), (1.1, 0.0), (10.9, 0.0),
           (12.0, 0.9), (12.0, 10.0), (10.7, 10.9)]
    return _telha(sec, GALVANIZADO, comp=23.0, esp=0.95)


def arremate():
    """Tapa-onda: peca macica que fecha o vao da onda no beiral e na cumeeira.

    O topo acompanha o desenho da telha e a base e reta, entao a secao e fechada:
    sobe pelo perfil trapezoidal e volta por baixo. E o que a distingue do rufo,
    que e uma chapa dobrada, e da terca, que e um perfil estrutural.
    """
    topo = sec_trapezoidal(2, periodo=20.0, alt=4.0, topo=6.0, rampa=3.6)
    larg = topo[-1][0]
    base = [(larg, -2.2), (0.0, -2.2)]
    return _telha(rev(topo + base + [topo[0]]), GALVALUME, comp=7.5, esp=0.95)


def terca():
    """Terca em perfil Z: o apoio onde a telha e parafusada."""
    sec = [(0.0, 0.0), (4.4, 0.0), (4.4, 9.8), (8.8, 9.8)]
    return _telha(sec, ACO, comp=26.0, esp=0.95)


def parafuso_vedacao():
    """Parafuso autobrocante com arruela de vedacao EPDM, que e o que difere do de drywall."""
    def um(cx, cy, k=1.0):
        g = ['<g transform="translate(%.1f %.1f) scale(%.2f)">' % (cx, cy, k)]
        # haste com rosca e ponta broca
        g.append('<path d="M-1.7 0 L-1.7 19 L0 23.5 L1.7 19 L1.7 0 Z" fill="%s" stroke="%s" '
                 'stroke-width=".95" stroke-linejoin="round"/>' % (ACO, OUT))
        for i in range(6):
            z = 3.4 + i * 2.5
            g.append('<path d="M-1.7 %.1f L1.7 %.1f" stroke="%s" stroke-width=".7" '
                     'stroke-opacity=".55"/>' % (z, z - 1.2, OUT))
        # arruela de vedacao: o disco escuro logo abaixo da cabeca
        g.append('<ellipse cx="0" cy="0" rx="6.4" ry="2.3" fill="%s" stroke="%s" '
                 'stroke-width=".95"/>' % (EPDM, OUT))
        # arruela metalica sobre a borracha
        g.append('<ellipse cx="0" cy="-2.1" rx="5.0" ry="1.8" fill="%s" stroke="%s" '
                 'stroke-width=".9"/>' % (shade(ACO, 1.18), OUT))
        # cabeca sextavada
        g.append('<path d="M-3.6 -3.0 L-3.6 -7.4 L0 -9.5 L3.6 -7.4 L3.6 -3.0 L0 -0.9 Z" '
                 'fill="%s" stroke="%s" stroke-width=".95" stroke-linejoin="round"/>'
                 % (shade(ACO, 1.1), OUT))
        g.append('<path d="M-3.6 -7.4 L0 -5.3 L3.6 -7.4 M0 -5.3 L0 -0.9" stroke="%s" '
                 'stroke-width=".8" stroke-opacity=".5" fill="none"/>' % OUT)
        g.append('</g>')
        return ''.join(g)
    return um(22, 16, 1.0) + um(42, 24, 0.86)


def bobina():
    """Bobina de chapa: cilindro com o eixo no comprimento, com a ponta da chapa solta."""
    s, ox, oy = 1.30, 16, 40
    r, comp = 11.0, 17.0
    ri = 3.6
    n = 44

    def aro(x, raio, z0=0.0, y0=0.0):
        return [(x, y0 + raio * math.cos(2 * math.pi * i / n),
                 z0 + raio * math.sin(2 * math.pi * i / n)) for i in range(n)]

    o = []
    # face de tras
    o.append(poly(aro(0.0, r), shade(GALVALUME, .66), s, ox, oy, sw=.85))
    # corpo: uma faixa por setor, sombreada pela normal
    for i in range(n):
        a1 = 2 * math.pi * i / n
        a2 = 2 * math.pi * (i + 1) / n
        ny, nz = math.cos((a1 + a2) / 2), math.sin((a1 + a2) / 2)
        lum = 0.56 + 0.30 * max(0.0, nz) + 0.18 * max(0.0, -ny)
        q = [(0.0, r * math.cos(a1), r * math.sin(a1)),
             (0.0, r * math.cos(a2), r * math.sin(a2)),
             (comp, r * math.cos(a2), r * math.sin(a2)),
             (comp, r * math.cos(a1), r * math.sin(a1))]
        o.append((ny - nz, poly(q, shade(GALVALUME, lum), s, ox, oy, sw=.42)))
    corpo = [t for t in o if isinstance(t, tuple)]
    corpo.sort(key=lambda t: -t[0])
    saida = [o[0]] + [c[1] for c in corpo]
    # face da frente e o olho da bobina
    saida.append(poly(aro(comp, r), shade(GALVALUME, 1.0), s, ox, oy, sw=.85))
    saida.append(poly(aro(comp, ri), shade(GALVALUME, .52), s, ox, oy, sw=.8))
    # espiral: marca as voltas da chapa na face
    for k in range(1, 4):
        rr = ri + (r - ri) * k / 4.0
        saida.append('<polygon points="%s" fill="none" stroke="%s" stroke-width=".55" '
                     'stroke-opacity=".5"/>' % (pts(aro(comp + .01, rr), s, ox, oy), OUT))
    return ''.join(saida)


ICONES = {
    'telha-trapezoidal': telha_trapezoidal(),
    'telha-ondulada': telha_ondulada(),
    'telha-termoacustica': telha_termoacustica(),
    'telha-galvanizada': telha_galvanizada(),
    'telha-translucida': telha_translucida(),
    'telha-fibrocimento': telha_fibrocimento(),
    'cumeeira': cumeeira(),
    'rufo': rufo(),
    'calha': calha(),
    'arremate': arremate(),
    'terca': terca(),
    'parafuso-vedacao': parafuso_vedacao(),
    'bobina': bobina(),
}

if __name__ == '__main__':
    aqui = os.path.dirname(os.path.abspath(__file__))
    json.dump(ICONES, open(os.path.join(aqui, 'coberturas-raw.json'), 'w'))
    cards = ''.join(
        '<div class="c"><svg viewBox="0 0 64 64">%s</svg><p>%s</p></div>' % (v, k)
        for k, v in ICONES.items())
    open(os.path.join(aqui, 'coberturas-preview.html'), 'w').write(
        '<meta charset="utf-8"><style>body{background:#fff;font:600 12px system-ui;margin:0;'
        'padding:20px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}'
        '.c{border:1px solid #e4e4e4;border-radius:12px;padding:10px;text-align:center}'
        'svg{width:92px;height:92px;display:block;margin:0 auto;background:rgba(166,3,3,.05);'
        'border-radius:12px}p{margin:7px 0 0;color:#666}</style>' + cards)
    print('ok', len(ICONES))
