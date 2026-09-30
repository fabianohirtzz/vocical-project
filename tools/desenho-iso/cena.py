# -*- coding: utf-8 -*-
"""Mini renderizador isometrico para os desenhos tecnicos da LP de drywall.

Coleta faces em 3D, ordena por profundidade dentro de cada grupo (o grupo define
a ordem de pintura macro, que eu conheco: fundo -> estrutura -> frente), projeta
tudo, calcula o enquadramento e devolve o SVG ja ajustado ao viewBox.
"""
import math

C30 = math.cos(math.radians(30))
S30 = 0.5
OUT = '#14161a'
LUZ = (0.32, -0.72, 0.62)   # de cima, da frente e da esquerda


def proj(p):
    x, y, z = p
    return ((x - y) * C30, (x + y) * S30 - z)


def shade(base, f):
    base = base.lstrip('#')
    r, g, b = (int(base[i:i + 2], 16) for i in (0, 2, 4))
    j = lambda v: max(0, min(255, int(round(v * f))))
    return '#%02x%02x%02x' % (j(r), j(g), j(b))


def _norm(v):
    m = math.sqrt(sum(c * c for c in v)) or 1e-9
    return tuple(c / m for c in v)


def _cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


# Geometria da chamada numerada.
# A pilula branca do rotulo comeca a PAD_PILULA antes do texto, entao o texto tem
# que arrancar longe o bastante da bolinha para a pilula nao invadi-la:
#   borda da pilula = cxn +- (GAP_NUM - PAD_PILULA)  >  borda da bolinha = cxn +- R_NUM
# Com R_NUM 10.5 e PAD_PILULA 7.5, GAP_NUM 24 deixa 6px de respiro. Antes era 16,
# o que punha a pilula 1.5px DENTRO da bolinha e comia o numero.
R_NUM = 10.5
PAD_PILULA = 7.5
GAP_NUM = R_NUM + PAD_PILULA + 6.0


class Cena:
    def __init__(self):
        self.grupos = []          # [(ordem, [faces])]
        self.linhas = []          # [(ordem, a, b, cor, sw, dash)]
        self.marcas = []          # anotacoes em 2D, resolvidas depois

    def face(self, pontos, cor, grupo=0, sw=1.1, stroke=None, lum=None, op=1.0):
        if lum is None:
            a, b, c = pontos[0], pontos[1], pontos[2]
            u = tuple(b[i] - a[i] for i in range(3))
            v = tuple(c[i] - a[i] for i in range(3))
            n = _norm(_cross(u, v))
            d = sum(n[i] * LUZ[i] for i in range(3))
            lum = 0.52 + 0.46 * abs(d) if d < 0 else 0.52 + 0.46 * d
        self.grupos.append((grupo, pontos, shade(cor, lum), stroke or OUT, sw, op))

    def linha(self, a, b, cor=OUT, sw=1.1, grupo=99, dash=None):
        self.linhas.append((grupo, a, b, cor, sw, dash))

    def caixa(self, o, size, cor, grupo=0, sw=1.1):
        x, y, z = o
        dx, dy, dz = size
        P = lambda a, b, c: (x + a, y + b, z + c)
        faces = [
            [P(0, 0, dz), P(dx, 0, dz), P(dx, dy, dz), P(0, dy, dz)],      # topo
            [P(0, 0, 0), P(dx, 0, 0), P(dx, 0, dz), P(0, 0, dz)],          # frente (y min)
            [P(dx, 0, 0), P(dx, dy, 0), P(dx, dy, dz), P(dx, 0, dz)],      # lateral (x max)
            [P(0, 0, 0), P(0, dy, 0), P(0, dy, dz), P(0, 0, dz)],          # lateral (x min)
            [P(0, dy, 0), P(dx, dy, 0), P(dx, dy, dz), P(0, dy, dz)],      # tras
            [P(0, 0, 0), P(dx, 0, 0), P(dx, dy, 0), P(0, dy, 0)],          # base
        ]
        for f in faces:
            self.face(f, cor, grupo, sw)

    def perfil(self, secao, comp, cor, eixo='x', base=0.0, desloc=(0, 0), grupo=0, sw=1.0, tampa=True):
        """Perfil de chapa dobrada extrudado. secao = linha media, em 2D.
        eixo 'x': secao em (y,z), extrusao em x.  eixo 'z': secao em (x,y), extrusao em z."""
        d1, d2 = desloc
        if eixo == 'x':
            P = lambda t, a, b: (base + t, a + d1, b + d2)
        else:
            P = lambda t, a, b: (a + d1, b + d2, base + t)
        for i in range(len(secao) - 1):
            (a1, b1), (a2, b2) = secao[i], secao[i + 1]
            self.face([P(0, a1, b1), P(0, a2, b2), P(comp, a2, b2), P(comp, a1, b1)], cor, grupo, sw)
        if tampa:
            for t in (0.0, comp):
                p = [P(t, a, b) for (a, b) in secao]
                for i in range(len(p) - 1):
                    self.linha(p[i], p[i + 1], OUT, sw * .9, grupo)

    def marca(self, ancora, dx, dy, texto, num=None, anchor='start'):
        self.marcas.append((ancora, dx, dy, texto, num, anchor))

    def svg(self, w, h, margem=14, escala_max=None, fonte=15, margem_y=None, classe=None):
        pontos = []
        for g in self.grupos:
            pontos += [proj(p) for p in g[1]]
        for l in self.linhas:
            pontos += [proj(l[1]), proj(l[2])]
        xs = [p[0] for p in pontos]; ys = [p[1] for p in pontos]
        bx, by = min(xs), min(ys)
        bw, bh = max(xs) - bx, max(ys) - by
        # espaco reservado nas laterais para os rotulos
        my = margem if margem_y is None else margem_y
        area_w, area_h = w - 2 * margem, h - 2 * my
        k = min(area_w / bw, area_h / bh)
        if escala_max:
            k = min(k, escala_max)
        ox = margem + (area_w - bw * k) / 2 - bx * k
        oy = my + (area_h - bh * k) / 2 - by * k
        T = lambda p: (ox + proj(p)[0] * k, oy + proj(p)[1] * k)

        itens = []
        for grupo, pontos3, cor, stroke, sw, op in self.grupos:
            prof = sum(p[0] - p[1] + p[2] for p in pontos3) / len(pontos3)
            pts = ' '.join('%.1f,%.1f' % T(p) for p in pontos3)
            itens.append((grupo, prof, '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%.2f" '
                                       'stroke-linejoin="round"%s/>'
                          % (pts, cor, stroke, sw, '' if op == 1 else ' fill-opacity="%.2f"' % op)))
        for grupo, a, b, cor, sw, dash in self.linhas:
            prof = (a[0] - a[1] + a[2] + b[0] - b[1] + b[2]) / 2
            ax, ay = T(a); bx2, by2 = T(b)
            itens.append((grupo, prof, '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" '
                                       'stroke-width="%.2f" stroke-linecap="round"%s/>'
                          % (ax, ay, bx2, by2, cor, sw, ' stroke-dasharray="%s"' % dash if dash else '')))
        itens.sort(key=lambda t: (t[0], t[1]))
        corpo = ''.join(i[2] for i in itens)

        anot = []
        for ancora, dx, dy, texto, num, anchor in self.marcas:
            ax, ay = T(ancora)
            tx, ty = ax + dx, ay + dy
            larg = len(texto) * fonte * 0.60 + (R_NUM + GAP_NUM if num is not None else 0)
            if anchor == 'end':
                tx = max(tx, larg + 8)
            elif anchor == 'start':
                tx = min(tx, w - larg - 8)
            else:
                tx = min(max(tx, larg / 2 + 8), w - larg / 2 - 8)
            ty = min(max(ty, 16), h - 10)
            anot.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#a60303" stroke-width="1.3"/>'
                        % (ax, ay, tx, ty))
            anot.append('<circle cx="%.1f" cy="%.1f" r="2.6" fill="#a60303"/>' % (ax, ay))
            if num is not None:
                cxn = tx + (R_NUM + .5 if anchor == 'start' else -(R_NUM + .5))
                anot.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#a60303"/>' % (cxn, ty, R_NUM))
                anot.append('<text x="%.1f" y="%.1f" text-anchor="middle" font-size="%d" font-weight="700" '
                            'fill="#fff">%s</text>' % (cxn, ty + 4.4, fonte - 2, num))
                tx = cxn + (GAP_NUM if anchor == 'start' else -GAP_NUM)
            rotulo = ('<text x="%.1f" y="%.1f" text-anchor="%s" font-size="%d" fill="#3a3a3a">%s</text>'
                      % (tx, ty + 4.6, anchor, fonte, texto))
            if classe:
                # Pilula atras do rotulo: sem ela o texto cai em cima do desenho e
                # fica ilegivel. As medidas aqui sao estimadas pela contagem de
                # caracteres; quem ajusta ao texto de verdade e o ajusta-rotulos.mjs,
                # que mede o bbox no navegador. O grupo leva a classe porque e ele
                # que some no mobile, levando junto a pilula.
                lt = len(texto) * fonte * 0.60
                px, py = PAD_PILULA, 4.5   # mesmos valores do ajusta-rotulos.mjs
                rx0 = tx - px if anchor == 'start' else (tx - lt - px if anchor == 'end' else tx - lt / 2 - px)
                anot.append('<g class="%s"><rect data-fit="1" x="%.1f" y="%.1f" width="%.1f" height="%.1f" '
                            'rx="7" fill="#ffffff" fill-opacity="0.90"/>%s</g>'
                            % (classe, rx0, ty + 4.6 - fonte * 0.82 - py,
                               lt + 2 * px, fonte * 1.12 + 2 * py, rotulo))
            else:
                anot.append(rotulo)
        return corpo + ''.join(anot)
