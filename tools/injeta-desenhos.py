# -*- coding: utf-8 -*-
"""Troca a geometria dos desenhos tecnicos dentro do HTML das LPs.

Serve para quando o gerador muda e os desenhos precisam ser reinjetados sem
reescrever a pagina. Trabalha por indice de string, achando a tag <svg> e o
</svg> correspondente, nunca por regex com `.*?`: numa pagina com mais de um
SVG esse casamento atravessa o fim do primeiro e come o resto.

O que e preservado: quando o SVG traz <title> e <desc> proprios, referenciados
pelo aria-labelledby, tudo ate o </desc> fica como esta e so a geometria depois
dele e trocada. Perder esses dois quebraria o nome acessivel da figura.

    python3 tools/injeta-desenhos.py
"""
import io, json, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ISO = os.path.join(RAIZ, 'tools', 'desenho-iso')

# pagina -> lista de (marca que identifica o svg, chave no json, arquivo json)
ALVOS = [
    ('campaigns-robracon-drywall/index.html', [
        ('dw-svg-parede-t', 'parede', 'desenhos.json'),
        ('dw-svg-forro-t', 'forro', 'desenhos.json'),
    ]),
    ('campaigns-robracon-telha-galvalume/index.html', [
        ('Corte isométrico de uma cobertura em telha galvalume', 'sistema', 'desenhos-cobertura.json'),
        ('Corte isométrico dos arremates', 'arremates', 'desenhos-cobertura.json'),
    ]),
]


def carrega(nome):
    with io.open(os.path.join(ISO, nome), encoding='utf-8') as f:
        d = json.load(f)
    return {k: (v[0] if isinstance(v, list) else v) for k, v in d.items()}


def main():
    cache, trocas = {}, 0
    for pagina, itens in ALVOS:
        caminho = os.path.join(RAIZ, pagina)
        html = io.open(caminho, encoding='utf-8').read()
        for marca, chave, arq in itens:
            if arq not in cache:
                cache[arq] = carrega(arq)
            novo = cache[arq][chave]

            pos = html.index(marca)
            ini_tag = html.rindex('<svg', 0, pos)          # abre a tag deste svg
            ini_conteudo = html.index('>', ini_tag) + 1
            fim = html.index('</svg>', ini_conteudo)        # svg nao aninha aqui
            conteudo = html[ini_conteudo:fim]

            # <title>/<desc> proprios ficam: e deles que sai o nome acessivel
            corte = conteudo.find('</desc>')
            prefixo = conteudo[:corte + len('</desc>')] if corte != -1 else ''
            html = html[:ini_conteudo] + prefixo + novo + html[fim:]
            trocas += 1
            print('  %-46s %-10s %6d bytes%s' % (
                os.path.basename(os.path.dirname(pagina)), chave, len(novo),
                '  (title/desc preservados)' if prefixo else ''))
        io.open(caminho, 'w', encoding='utf-8').write(html)

    # conferencia: um svg por figura, e nenhum </svg> orfao
    for pagina, itens in ALVOS:
        html = io.open(os.path.join(RAIZ, pagina), encoding='utf-8').read()
        if html.count('<svg') != html.count('</svg>'):
            print('ERRO: svg desbalanceado em', pagina, file=sys.stderr)
            return 1
    print('ok:', trocas, 'desenhos injetados')
    return 0


if __name__ == '__main__':
    sys.exit(main())
