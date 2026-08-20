#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audita caminhos de asset citados no código contra os arquivos reais, com
COMPARAÇÃO SENSÍVEL A MAIÚSCULA.

Motivo: Windows é case-insensitive e Linux não. Um `Imagens/Logos Unidades/x.png`
que aponta para uma pasta chamada `logos unidades` funciona no navegador local e
dá 404 na erehost. Só se percebe depois do deploy, olhando o console.

Uso:
    python tools/checar-caminhos.py
Sai com código 1 se achar caminho quebrado (dá para usar como gate de deploy).
"""
import io, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTAS_FORA = {'.git', '.playwright-mcp', '.superpowers', 'node_modules',
               'Paginas Unidades', 'docs', '__pycache__'}
# pastas de asset servidas ao navegador
ASSETS = ('Imagens/', 'img/', 'css/', 'js/', 'fonts/', 'videos/')
EXTS = ('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp4', '.webm',
        '.woff2', '.woff', '.ico', '.css', '.js')

# captura o caminho dentro de aspas simples ou duplas
PADRAO = re.compile(r"""["']((?:\.\./)*(?:Imagens|img|css|js|fonts|videos)/[^"']+?)["']""")


def indice_real():
    """Todos os caminhos reais, exatamente como estão no disco."""
    reais = set()
    for base, dirs, arqs in os.walk(RAIZ):
        dirs[:] = [d for d in dirs if d not in PASTAS_FORA]
        for a in arqs:
            rel = os.path.relpath(os.path.join(base, a), RAIZ).replace('\\', '/')
            reais.add(rel)
    return reais


def fontes():
    for base, dirs, arqs in os.walk(RAIZ):
        dirs[:] = [d for d in dirs if d not in PASTAS_FORA]
        for a in arqs:
            if a.endswith(('.html', '.js', '.css')):
                yield os.path.join(base, a)


def main():
    reais = indice_real()
    # mapa minúsculo -> real, para dizer QUAL é o nome certo
    por_minusculo = {}
    for r in reais:
        por_minusculo.setdefault(r.lower(), r)

    quebrados = []
    vistos = set()
    for f in fontes():
        rel_fonte = os.path.relpath(f, RAIZ).replace('\\', '/')
        try:
            texto = io.open(f, encoding='utf-8').read()
        except UnicodeDecodeError:
            continue
        for m in PADRAO.finditer(texto):
            bruto = m.group(1)
            if not bruto.endswith(EXTS):
                continue
            # normaliza ../ e query/hash
            limpo = bruto.split('?')[0].split('#')[0].lstrip('./')
            while limpo.startswith('../'):
                limpo = limpo[3:]
            if not limpo.startswith(ASSETS):
                continue
            chave = (rel_fonte, limpo)
            if chave in vistos:
                continue
            vistos.add(chave)
            if limpo in reais:
                continue
            certo = por_minusculo.get(limpo.lower())
            quebrados.append((rel_fonte, bruto, certo))

    if not quebrados:
        print('OK: todo caminho de asset citado no codigo existe com a grafia exata.')
        return 0

    print('%d caminho(s) que quebram em servidor Linux:\n' % len(quebrados))
    for fonte, citado, certo in quebrados:
        print('  %s' % fonte)
        print('      citado: %s' % citado)
        print('      real  : %s' % (certo if certo else '(arquivo nao existe)'))
    return 1


if __name__ == '__main__':
    sys.exit(main())
