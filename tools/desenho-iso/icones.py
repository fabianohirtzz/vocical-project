# -*- coding: utf-8 -*-
"""Icones dos 15 itens da linha de drywall, em isometria, com geometria calculada."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from iso import iso, pts, poly, line, shade, box, perfil

OUT = '#14161a'
GALV = '#cbd3d8'
ACO = '#9aa3aa'
GESSO = '#f1ebdf'
PAPEL_ST = '#e0d3ba'
PAPEL_RU = '#9cbe9d'
PAPEL_GX = '#d9c08a'


# ---------- placas ----------
def placa(cor, n=1, mesh=False, gota=False):
    s, ox, oy = 1.42, 12, 44
    dx, dy, dz = 25, 14.5, 1.8
    o = ''
    for i in range(n):
        z = i * (dz + .3)
        o += box((0, 0, z), (dx, dy, dz), cor, s, ox, oy, sw=.8, topmul=1.0, leftmul=.9, rightmul=.72)
        o += poly([(dx, .5, z + .3), (dx, dy - .5, z + .3), (dx, dy - .5, z + dz - .3), (dx, .5, z + dz - .3)],
                  GESSO, s, ox, oy, sw=.45)
    topo = n * (dz + .3) - .3
    if mesh:
        for k in range(1, 7):
            t = k / 7.0
            o += line((dx * t, 0, topo), (dx * t, dy, topo), shade(cor, .74), .65, s, ox, oy)
        for k in range(1, 4):
            t = k / 4.0
            o += line((0, dy * t, topo), (dx, dy * t, topo), shade(cor, .74), .65, s, ox, oy)
    if gota:
        cx, cy = iso((dx * .30, dy * .52, topo), s, ox, oy)
        o += ('<path d="M%.1f %.1f c2.1 2.3 3.1 3.8 3.1 4.9a3.1 3.1 0 0 1-6.2 0c0-1.1 1-2.6 3.1-4.9z" '
              'fill="#ffffff" fill-opacity=".92" stroke="%s" stroke-width=".9" stroke-linejoin="round"/>'
              % (cx, cy - 5.4, OUT))
    return o


# ---------- perfis de chapa dobrada ----------
def perfil_icone(secao, comp=25, cor=GALV, s=1.42, ox=12, oy=None, esp=.85):
    ys = [p[0] for p in secao]; zs = [p[1] for p in secao]
    oy = oy if oy is not None else 44
    return perfil(secao, comp, cor, s, ox, oy, sw=.8, espessura=esp)


def guia():
    # perfil U: aba, alma, aba
    h, w = 4.4, 9.5
    return perfil_icone([(0, h), (0, 0), (w, 0), (w, h)], comp=25, oy=40)


def montante():
    # perfil C com labios
    h, f, lab = 8.2, 5.2, 1.5
    sec = [(f, lab), (f, 0), (0, 0), (0, h), (f, h), (f, h - lab)]
    return perfil_icone(sec, comp=25, oy=42)


def f530():
    # perfil chapeu (omega)
    fa, hh, wt = 3.2, 3.4, 5.4
    sec = [(0, 0), (fa, 0), (fa, hh), (fa + wt, hh), (fa + wt, 0), (2 * fa + wt, 0)]
    return perfil_icone(sec, comp=25, oy=38)


def tabica():
    # perfil com degrau, que e o que da a junta aparente do forro
    sec = [(0, 4.6), (0, 0), (4.6, 0), (4.6, 2.2), (7.6, 2.2), (7.6, 0)]
    return perfil_icone(sec, comp=25, oy=40)


def cantoneira():
    h, w = 5.6, 5.6
    o = perfil_icone([(0, h), (0, 0), (w, 0)], comp=25, oy=40)
    # furos da cantoneira perfurada
    s, ox, oy = 1.42, 12, 40
    for i in range(4):
        x = 4 + i * 5.6
        for (y, z) in ((0, h * .55), (w * .55, 0)):
            cx, cy = iso((x, y, z), s, ox, oy)
            o += '<circle cx="%.2f" cy="%.2f" r="1.05" fill="%s" fill-opacity=".55"/>' % (cx, cy, OUT)
    return o


# ---------- itens desenhados ----------
def parafuso():
    """Dois parafusos ponta agulha, de pe, levemente inclinados."""
    def um(cx, cy, k=1.0, rot=0):
        r = 2.5 * k          # raio da haste
        rc = 5.2 * k         # raio da cabeca trombeta
        htot = 30 * k
        g = []
        g.append('<g transform="translate(%.1f %.1f) rotate(%d)">' % (cx, cy, rot))
        # haste conica ate a ponta
        g.append('<path d="M%.1f 0 L%.1f %.1f L0 %.1f L%.1f %.1f Z" fill="%s" stroke="%s" '
                 'stroke-width=".95" stroke-linejoin="round"/>'
                 % (-r, -r * .55, htot - 5 * k, htot, r * .55, htot - 5 * k, ACO, OUT))
        # rosca
        for i in range(7):
            y = 3.2 * k + i * 3.4 * k
            w = r * (1 - .1 * max(0, i - 3.6))
            g.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="%.2f" '
                     'stroke-linecap="round"/>' % (-w, y, w, y + 2.2 * k, shade(ACO, .62), 1.0 * k))
        # cabeca trombeta
        g.append('<path d="M%.1f %.1f Q0 %.1f %.1f %.1f L%.1f 0 L%.1f 0 Z" fill="%s" stroke="%s" '
                 'stroke-width=".95" stroke-linejoin="round"/>'
                 % (-rc, -3.4 * k, -.2 * k, rc, -3.4 * k, r, -r, shade(ACO, 1.12), OUT))
        g.append('<ellipse cx="0" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="%s" stroke-width=".95"/>'
                 % (-3.4 * k, rc, rc * .34, shade(ACO, 1.22), OUT))
        # fenda phillips
        g.append('<path d="M%.1f %.1f h%.1f M0 %.1f v%.1f" stroke="%s" stroke-width="1.1" '
                 'stroke-linecap="round"/>' % (-rc * .5, -3.4 * k, rc, -3.4 * k - rc * .22, rc * .44, shade(ACO, .5)))
        g.append('</g>')
        return ''.join(g)
    return um(24, 15, .92, -12) + um(41, 19, .92, 9)


def fita():
    """Rolo de fita telada visto em isometria."""
    s, ox, oy = 1.0, 32, 40
    R, r, h = 15.5, 6.2, 11
    cxs = 0.0
    o = []
    # corpo do rolo
    o.append('<path d="M%.1f %.1f a%.1f %.1f 0 0 0 %.1f 0 v%.1f a%.1f %.1f 0 0 1 %.1f 0 z" '
             'fill="%s" stroke="%s" stroke-width=".95" stroke-linejoin="round"/>'
             % (ox - R, oy - h, R, R * .38, 2 * R, -0.001, R, R * .38, -2 * R, shade('#efe9dc', .8), OUT))
    o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="%s" stroke-width=".95"/>'
             % (ox, oy - h, R, R * .38, '#f4efe4', OUT))
    # malha da fita na face de cima
    for k in range(-4, 5):
        x = ox + k * 3.1
        dy = R * .38 * math.sqrt(max(0.0, 1 - (k * 3.1 / R) ** 2))
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width=".6"/>'
                 % (x, oy - h - dy, x, oy - h + dy, '#b9b0a0'))
    for k in range(-2, 3):
        yy = oy - h + k * 2.3
        dx = R * math.sqrt(max(0.0, 1 - (k * 2.3 / (R * .38)) ** 2))
        o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width=".6"/>'
                 % (ox - dx, yy, ox + dx, yy, '#b9b0a0'))
    # furo central
    o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="%s" stroke-width=".95"/>'
             % (ox, oy - h, r, r * .38, '#cfc6b4', OUT))
    # espessura lateral do rolo
    o.append('<path d="M%.1f %.1f v%.1f a%.1f %.1f 0 0 0 %.1f 0 v%.1f" fill="none" stroke="%s" '
             'stroke-width=".95"/>' % (ox - R, oy - h, h, R, R * .38, 2 * R, -h, OUT))
    return ''.join(o)


def massa():
    """Balde de massa para drywall."""
    ox, oy = 32, 46
    rt, rb, h = 13.5, 10.8, 22
    o = []
    o.append('<path d="M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 0 0 %.1f %.1f L%.1f %.1f Z" '
             'fill="%s" stroke="%s" stroke-width=".95" stroke-linejoin="round"/>'
             % (ox - rt, oy - h, ox - rb, oy, rb, rb * .36, ox + rb, oy, ox + rt, oy - h, '#e9ecef', OUT))
    o.append('<path d="M%.1f %.1f v%.1f" stroke="%s" stroke-width="5" stroke-opacity=".25"/>'
             % (ox + rt * .58, oy - h + 3, h - 5, '#8f979e'))
    # faixa de rotulo
    o.append('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s" stroke="%s" stroke-width=".8"/>'
             % (ox - rt * .97, oy - h * .74, ox + rt * .97, oy - h * .74,
                ox + rt * .89, oy - h * .36, ox - rt * .89, oy - h * .36, '#a60303', OUT))
    o.append('<path d="M%.1f %.1f h%.1f" stroke="#ffffff" stroke-width="1.5" stroke-opacity=".85" stroke-linecap="round"/>'
             % (ox - rt * .55, oy - h * .55, rt * 1.1))
    # tampa
    o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" stroke="%s" stroke-width=".95"/>'
             % (ox, oy - h, rt, rt * .36, '#f4f6f7', OUT))
    o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="%s" stroke-width=".8" stroke-opacity=".55"/>'
             % (ox, oy - h, rt * .72, rt * .26, OUT))
    # alca
    o.append('<path d="M%.1f %.1f q%.1f %.1f %.1f 0" fill="none" stroke="%s" stroke-width="1.7" stroke-linecap="round"/>'
             % (ox - rt * .96, oy - h - 1.5, rt * .96, -11, rt * 1.92, '#6f777d'))
    return ''.join(o)


def presilha():
    """Presilha: clipe de chapa que abraca o perfil, com as abas de encaixe."""
    sec = [(-1.1, 7.6), (0.4, 6.2), (0.4, 1.1), (1.5, 0), (6.5, 0), (7.6, 1.1), (7.6, 6.2), (9.1, 7.6)]
    return perfil(sec, 7.5, GALV, 2.3, 20, 46, sw=.85, espessura=1.0)


def regulador():
    """Regulador de altura: arame com mola e gancho."""
    ox, oy = 32, 12
    o = []
    o.append('<path d="M%.1f %.1f v14" stroke="%s" stroke-width="2.4" stroke-linecap="round"/>' % (ox, oy, ACO))
    # mola
    d = ''
    y = oy + 14
    for i in range(6):
        d += 'M%.1f %.1f q6.4 3.2 0 6.4 ' % (ox - 3.2, y + i * 3.2)
    o.append('<path d="%s" fill="none" stroke="%s" stroke-width="2.1" stroke-linecap="round"/>' % (d, shade(ACO, .86)))
    y2 = y + 6 * 3.2
    o.append('<path d="M%.1f %.1f v6" stroke="%s" stroke-width="2.4" stroke-linecap="round"/>' % (ox, y2, ACO))
    # gancho
    o.append('<path d="M%.1f %.1f a5 5 0 1 0 -7 4.6" fill="none" stroke="%s" stroke-width="2.4" '
             'stroke-linecap="round"/>' % (ox, y2 + 5, ACO))
    return ''.join(o)


def arame():
    """Rolo de arame: espiras concentricas, com volume."""
    ox, oy = 32, 32
    o = []
    for i, R in enumerate((18.5, 15.2, 11.9, 8.6)):
        cy = oy + i * 1.4
        o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="%s" '
                 'stroke-width="4.6" stroke-linecap="round"/>' % (ox, cy, R, R * .40, OUT))
        o.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="%s" '
                 'stroke-width="3.4" stroke-linecap="round"/>' % (ox, cy, R, R * .40, shade(ACO, 1.02 - .06 * i)))
        o.append('<path d="M%.1f %.1f a%.1f %.1f 0 0 1 %.1f 0" fill="none" stroke="%s" stroke-width="1.3" '
                 'stroke-linecap="round" stroke-opacity=".7"/>'
                 % (ox - R * .8, cy - R * .30, R, R * .40, R * 1.6, shade(ACO, 1.3)))
    o.append('<path d="M%.1f %.1f q9 -6 17 .5" fill="none" stroke="%s" stroke-width="4.4" '
             'stroke-linecap="round"/>' % (ox - 21, oy - 7, OUT))
    o.append('<path d="M%.1f %.1f q9 -6 17 .5" fill="none" stroke="%s" stroke-width="3.2" '
             'stroke-linecap="round"/>' % (ox - 21, oy - 7, shade(ACO, 1.12)))
    return ''.join(o)


def prego():
    """Dois pregos cruzados."""
    def um(cx, cy, rot):
        return ('<g transform="translate(%.1f %.1f) rotate(%d)">'
                '<path d="M-1.9 0 L-1 24 L0 27.5 L1 24 L1.9 0 Z" fill="%s" stroke="%s" stroke-width=".95" '
                'stroke-linejoin="round"/>'
                '<ellipse cx="0" cy="0" rx="5.2" ry="1.9" fill="%s" stroke="%s" stroke-width=".95"/>'
                '<path d="M-2.6 5 h5.2 M-2.4 9 h4.8" stroke="%s" stroke-width=".8" stroke-opacity=".6"/>'
                '</g>') % (cx, cy, rot, ACO, OUT, shade(ACO, 1.2), OUT, OUT)
    return um(23, 14, -14) + um(41, 20, 12)


ICONES = {
    'placa-st': placa(PAPEL_ST, n=3),
    'placa-ru': placa(PAPEL_RU, n=2, gota=True),
    'glasroc': placa(PAPEL_GX, n=1, mesh=True),
    'guia': guia(),
    'montante': montante(),
    'f530': f530(),
    'tabica': tabica(),
    'cantoneira': cantoneira(),
    'parafuso': parafuso(),
    'fita': fita(),
    'massa': massa(),
    'presilha': presilha(),
    'regulador': regulador(),
    'arame': arame(),
    'prego': prego(),
}

if __name__ == '__main__':
    cards = ''.join(
        '<div class="c"><svg viewBox="0 0 64 64">%s</svg><p>%s</p></div>' % (v, k)
        for k, v in ICONES.items())
    open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icones-preview.html'), 'w').write(
        '<meta charset="utf-8"><style>body{background:#fff;font:600 12px system-ui;margin:0;padding:24px;'
        'display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.c{border:1px solid #e4e4e4;border-radius:12px;'
        'padding:12px;text-align:center}svg{width:82px;height:82px;display:block;margin:0 auto}'
        'p{margin:8px 0 0;color:#666}</style>' + cards)
    print('ok', len(ICONES))
