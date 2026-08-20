#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Remove o <meta name="robots" content="noindex, nofollow"> das páginas.

Rodar SÓ no corte para a raiz. Enquanto o site vive em public_html/novo, o
noindex é obrigatório: sem ele a cópia de teste passa a competir no Google com
o site que está no ar, e o Google pode escolher indexar a errada.

/calculadoras/ é a exceção permanente: continua noindex até o responsável
validar os cálculos.

Uso:
    python tools/liberar-indexacao.py --check     # mostra o estado, não altera
    python tools/liberar-indexacao.py --aplicar
"""
import argparse, glob, io, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META = '<meta name="robots" content="noindex, nofollow">\n'
# Páginas que seguem fora do índice mesmo depois do corte
EXCECOES = {'calculadoras/index.html',     # aguarda validação dos cálculos
            'rp-cimento-cal/index.html'}  # só um redirect pro site do parceiro


def paginas():
    alvos = ['index.html', '404.html'] + sorted(
        p.replace('\\', '/') for p in glob.glob('*/index.html', root_dir=RAIZ))
    return [p for p in alvos if os.path.exists(os.path.join(RAIZ, p))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--aplicar', action='store_true')
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    if not (args.aplicar or args.check):
        ap.error('use --check ou --aplicar')

    mudou = 0
    for rel in paginas():
        caminho = os.path.join(RAIZ, rel)
        s = io.open(caminho, encoding='utf-8').read()
        tem = 'content="noindex' in s
        if rel in EXCECOES:
            print('  %-42s noindex MANTIDO (exceção)' % rel)
            continue
        if rel == '404.html':
            print('  %-42s noindex MANTIDO (página de erro)' % rel)
            continue
        if not tem:
            print('  %-42s já indexável' % rel)
            continue
        if args.aplicar:
            linha = [l for l in s.splitlines(True) if 'content="noindex' in l][0]
            io.open(caminho, 'w', encoding='utf-8', newline='').write(s.replace(linha, ''))
            print('  %-42s LIBERADA' % rel)
            mudou += 1
        else:
            print('  %-42s seria liberada' % rel)

    if args.check:
        print('\n(--check: nada foi alterado)')
    else:
        print('\n%d páginas liberadas para indexação.' % mudou)
        print('Depois do deploy: submeter sitemap.xml no Search Console.')


if __name__ == '__main__':
    main()
