# -*- coding: utf-8 -*-
"""Geometria isometrica para os icones e desenhos tecnicos da LP de drywall.

Projecao isometrica classica:  X = (x - y)*cos30 ;  Y = (x + y)*sin30 - z
Eixos: x = profundidade/comprimento (para a direita e para baixo),
       y = largura (para a esquerda e para baixo), z = altura (para cima).
"""
import math

C30 = math.cos(math.radians(30))
S30 = 0.5


def iso(p, s=1.0, ox=0.0, oy=0.0):
    x, y, z = p
    return (ox + (x - y) * C30 * s, oy + ((x + y) * S30 - z) * s)


def pts(seq, s=1.0, ox=0.0, oy=0.0):
    return ' '.join('%.2f,%.2f' % iso(p, s, ox, oy) for p in seq)


def poly(seq, fill, s=1.0, ox=0.0, oy=0.0, stroke='#14161a', sw=0.9, extra=''):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%.2f" stroke-linejoin="round"%s/>' % (
        pts(seq, s, ox, oy), fill, stroke, sw, (' ' + extra if extra else ''))


def line(a, b, color, sw=0.9, s=1.0, ox=0.0, oy=0.0, cap='round', extra=''):
    ax, ay = iso(a, s, ox, oy)
    bx, by = iso(b, s, ox, oy)
    return '<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f" stroke="%s" stroke-width="%.2f" stroke-linecap="%s"%s/>' % (
        ax, ay, bx, by, color, sw, cap, (' ' + extra if extra else ''))


def shade(base, f):
    """Escurece/clareia uma cor hex por um fator multiplicativo."""
    base = base.lstrip('#')
    r, g, b = (int(base[i:i + 2], 16) for i in (0, 2, 4))
    j = lambda v: max(0, min(255, int(round(v * f))))
    return '#%02x%02x%02x' % (j(r), j(g), j(b))


def box(o, size, cor, s=1.0, ox=0.0, oy=0.0, sw=0.9, topmul=1.0, leftmul=.82, rightmul=.64):
    """Caixa isometrica. o = canto (x,y,z) minimo; size = (dx,dy,dz)."""
    x, y, z = o
    dx, dy, dz = size
    topo = [(x, y, z + dz), (x + dx, y, z + dz), (x + dx, y + dy, z + dz), (x, y + dy, z + dz)]
    dire = [(x + dx, y, z), (x + dx, y + dy, z), (x + dx, y + dy, z + dz), (x + dx, y, z + dz)]
    esq = [(x, y, z), (x + dx, y, z), (x + dx, y, z + dz), (x, y, z + dz)]
    out = []
    out.append(poly(topo, shade(cor, topmul), s, ox, oy, sw=sw))
    out.append(poly(esq, shade(cor, leftmul), s, ox, oy, sw=sw))
    out.append(poly(dire, shade(cor, rightmul), s, ox, oy, sw=sw))
    return ''.join(out)


def perfil(secao, comp, cor, s=1.0, ox=0.0, oy=0.0, sw=0.85, x0=0.0, espessura=0.0):
    """Perfil de chapa dobrada: cada segmento da secao vira uma chapa plana extrudada.

    secao: lista de pontos (y,z) da linha media da chapa.
    comp:  comprimento extrudado ao longo de x.
    Sombreamento pela orientacao do segmento, luz vindo de cima e da esquerda.
    Pinta de tras para a frente (o observador esta em x grande, y pequeno).
    """
    out = []
    chapas = []
    for i in range(len(secao) - 1):
        (y1, z1), (y2, z2) = secao[i], secao[i + 1]
        dy, dz = y2 - y1, z2 - z1
        comprimento = math.hypot(dy, dz) or 1e-6
        ny, nz = dz / comprimento, -dy / comprimento          # normal do segmento
        lum = 0.52 + 0.30 * max(0.0, nz) + 0.20 * max(0.0, -ny) + 0.10 * max(0.0, ny)
        quad = [(x0, y1, z1), (x0, y2, z2), (x0 + comp, y2, z2), (x0 + comp, y1, z1)]
        prof = (y1 + y2) / 2 - (z1 + z2) / 2                   # heuristica de profundidade
        chapas.append((prof, poly(quad, shade(cor, lum), s, ox, oy, sw=sw)))
    chapas.sort(key=lambda t: -t[0])
    out.extend(c[1] for c in chapas)
    if espessura:
        p = ' '.join('%.2f,%.2f' % iso((x0 + comp, y, z), s, ox, oy) for (y, z) in secao)
        out.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="%.2f" '
                   'stroke-linejoin="round" stroke-linecap="round"/>' % (p, shade(cor, 1.12), espessura * s))
        out.append('<polyline points="%s" fill="none" stroke="#14161a" stroke-width="%.2f" '
                   'stroke-linejoin="round" stroke-linecap="round" fill-opacity="0"/>' % (p, sw * .8))
    return ''.join(out)


def elipse(centro, rx, ry_z, cor, s=1.0, ox=0.0, oy=0.0, sw=0.9):
    """Circulo no plano xy (horizontal) visto em isometria: elipse achatada."""
    cx, cy = iso(centro, s, ox, oy)
    return ('<ellipse cx="%.2f" cy="%.2f" rx="%.2f" ry="%.2f" fill="%s" stroke="#14161a" '
            'stroke-width="%.2f"/>' % (cx, cy, rx * C30 * s, rx * S30 * s, cor, sw))
