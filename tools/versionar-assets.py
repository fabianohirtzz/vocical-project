#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Carimba ?v=<hash> nas referências a CSS e JS dentro dos HTML.

Por que existe: o .htaccess serve css/js com cache de 1 ano, que é o certo para
performance. Só que o projeto não tem build e os arquivos têm nome fixo
(site.css, lead.js), então sem isso uma correção nunca chegaria em quem já
visitou o site — o navegador serviria a versão velha por um ano.

O hash é do conteúdo de cada arquivo. Só o que mudou de fato ganha URL nova, o
resto continua vindo do cache. Rodar sempre antes do deploy.

Uso:
    python tools/versionar-assets.py            # aplica
    python tools/versionar-assets.py --check    # só mostra o que mudaria
"""
import argparse, glob, hashlib, io, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# href/src apontando para css/ ou js/, com ou sem ../ e com ou sem ?v= antigo
PADRAO = re.compile(r'((?:href|src)=")((?:\.\./)*(?:css|js)/[A-Za-z0-9._-]+\.(?:css|js))(\?[^"]*)?(")')


def hash_de(rel):
    caminho = os.path.join(RAIZ, rel)
    if not os.path.exists(caminho):
        return None
    with open(caminho, 'rb') as fh:
        return hashlib.md5(fh.read()).hexdigest()[:8]


def htmls():
    alvos = ['index.html', '404.html']
    alvos += sorted(p.replace('\\', '/') for p in glob.glob('*/index.html', root_dir=RAIZ))
    alvos += sorted(p.replace('\\', '/') for p in glob.glob('marcas/*.html', root_dir=RAIZ))
    return [a for a in alvos if os.path.exists(os.path.join(RAIZ, a))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()

    cache = {}
    tocados = ausentes = 0
    for rel in htmls():
        caminho = os.path.join(RAIZ, rel)
        s = io.open(caminho, encoding='utf-8').read()

        def troca(m):
            nonlocal ausentes
            asset = m.group(2)
            limpo = asset
            while limpo.startswith('../'):
                limpo = limpo[3:]
            if limpo not in cache:
                cache[limpo] = hash_de(limpo)
            h = cache[limpo]
            if h is None:
                ausentes += 1
                print('  !! %s cita %s, que nao existe' % (rel, asset))
                return m.group(0)
            return '%s%s?v=%s%s' % (m.group(1), asset, h, m.group(4))

        novo = PADRAO.sub(troca, s)
        if novo != s:
            tocados += 1
            if not args.check:
                io.open(caminho, 'w', encoding='utf-8', newline='').write(novo)
            print('  %-42s %s' % (rel, 'mudaria' if args.check else 'carimbado'))

    print('\n%d HTML %s, %d asset(s) distinto(s).'
          % (tocados, 'mudariam' if args.check else 'atualizados', len(cache)))
    if args.check:
        print('(--check: nada foi alterado)')
    return 1 if ausentes else 0


if __name__ == '__main__':
    sys.exit(main())
