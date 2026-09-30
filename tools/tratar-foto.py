# -*- coding: utf-8 -*-
"""Tratamento fotografico das fotos do acervo, sem IA.

Resolve o que o cliente descreveu como "muito escuras, sem brilho, pouco nitidas":
exposicao, contraste, levantamento de sombra, equilibrio de branco e nitidez. Tudo
processamento de imagem de verdade, deterministico e reversivel (o original nunca
e tocado).

O que ele NAO faz, e nao tem como fazer: tirar sujeira do piso e da parede, remover
objeto, repintar superficie. Isso e edicao generativa e precisa de uma IA de imagem.

    python3 tools/tratar-foto.py <entrada> <saida> [--proporcao 3:2] [--largura 1500]
"""
import argparse, os, sys
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat


def equilibra_branco(im, forca=0.6):
    """Cinza-medio: neutraliza a dominante amarelada da luz de galpao."""
    r, g, b = ImageStat.Stat(im).mean[:3]
    cinza = (r + g + b) / 3
    if min(r, g, b) < 1:
        return im
    canais = []
    for canal, media in zip(im.split(), (r, g, b)):
        fator = 1 + (cinza / media - 1) * forca
        canais.append(canal.point(lambda v, f=fator: min(255, int(v * f))))
    return Image.merge('RGB', canais)


def levanta_sombra(im, forca=0.35):
    """Clareia so a parte escura, via curva de gama, sem estourar o alto da imagem."""
    gama = 1 - forca * 0.5
    tabela = [min(255, int(((v / 255) ** gama) * 255)) for v in range(256)]
    return im.point(tabela * 3)


def trata(entrada, saida, proporcao=None, largura=None,
          corte_preto=0.5, corte_branco=0.3, sombra=0.35,
          contraste=1.08, cor=1.06, nitidez=1.25):
    im = Image.open(entrada).convert('RGB')
    antes = im.size

    im = equilibra_branco(im)
    # autocontraste com clipping pequeno: usa a faixa real do histograma
    im = ImageOps.autocontrast(im, cutoff=(corte_preto, corte_branco))
    im = levanta_sombra(im, sombra)
    im = ImageEnhance.Contrast(im).enhance(contraste)
    im = ImageEnhance.Color(im).enhance(cor)

    if proporcao:
        pw, ph = (float(x) for x in proporcao.split(':'))
        alvo = pw / ph
        ar = im.width / im.height
        if ar > alvo:
            nw = int(im.height * alvo); x = (im.width - nw) // 2
            im = im.crop((x, 0, x + nw, im.height))
        elif ar < alvo:
            nh = int(im.width / alvo); y = (im.height - nh) // 2
            im = im.crop((0, y, im.width, y + nh))
    if largura and im.width != largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)

    # nitidez por ultimo, depois do redimensionamento, senao vira ruido
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=int(nitidez * 100) - 100, threshold=3))

    im.save(saida, 'JPEG', quality=82, optimize=True, progressive=True)
    return antes, im.size, os.path.getsize(saida) / 1024


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('entrada'); p.add_argument('saida')
    p.add_argument('--proporcao'); p.add_argument('--largura', type=int)
    a = p.parse_args()
    antes, depois, kb = trata(a.entrada, a.saida, a.proporcao, a.largura)
    print('%s  %sx%s -> %sx%s  %.1f KB' % (os.path.basename(a.saida),
                                           antes[0], antes[1], depois[0], depois[1], kb))
