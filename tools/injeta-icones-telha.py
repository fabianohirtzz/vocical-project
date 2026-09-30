# -*- coding: utf-8 -*-
"""Injeta os icones e os desenhos tecnicos no HTML da LP de telha galvalume.

Substituicao por token exato ({{ICONE:nome}} e {{DESENHO:nome}}), de proposito.
Na LP de drywall os icones foram injetados por regex ancorada no <h3> do card, e
o `.*?` atravessou o fim do bloco: o casamento pulou para o card seguinte e
duplicou artigos inteiros dentro dos cards. Token nao tem esse risco, porque nao
depende do que vem em volta.

Roda quantas vezes precisar: se ja nao houver token, ele avisa e nao faz nada.

    python3 tools/injeta-icones-telha.py
"""
import io, json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ISO = os.path.join(RAIZ, 'tools', 'desenho-iso')
HTML = os.path.join(RAIZ, 'campaigns-robracon-telha-galvalume', 'index.html')


def carrega(nome):
    with io.open(os.path.join(ISO, nome), encoding='utf-8') as f:
        return json.load(f)


def main():
    icones = {}
    icones.update(carrega('icones-final.json'))      # reaproveita revenda/construtora/instalador
    icones.update(carrega('coberturas-final.json'))  # os da linha de cobertura
    desenhos = carrega('desenhos-cobertura.json')

    html = io.open(HTML, encoding='utf-8').read()
    pedidos = set(re.findall(r'\{\{(?:ICONE|DESENHO):([a-z0-9-]+)\}\}', html))
    if not pedidos:
        print('nenhum token no HTML, nada a fazer')
        return 0

    # O token de icone precisa estar DENTRO de um <svg>: a geometria e so um <g>,
    # e solta no HTML ela nao renderiza nada. Aconteceu em 01/10, com o icone da
    # telha semi-sanduie, e so apareceu na contagem do QA.
    for m in re.finditer(r'\{\{ICONE:([a-z0-9-]+)\}\}', html):
        antes = html[max(0, m.start() - 60):m.start()]
        if '<svg' not in antes:
            print('ERRO: o token {{ICONE:%s}} nao esta dentro de um <svg>' % m.group(1),
                  file=sys.stderr)
            return 1

    faltando = [n for n in sorted(pedidos) if n not in icones and n not in desenhos]
    if faltando:
        print('ERRO: sem geometria para: ' + ', '.join(faltando), file=sys.stderr)
        return 1

    for nome, corpo in icones.items():
        html = html.replace('{{ICONE:%s}}' % nome, corpo)

    for nome, corpo in desenhos.items():
        # O rotulo de dentro do SVG some no mobile e vira legenda numerada embaixo.
        # Quem apaga e o CSS (.tg-esq__lbl), entao a classe precisa entrar aqui.
        marcado = corpo.replace(' font-size="15" fill="#3a3a3a">',
                                ' class="tg-esq__lbl" font-size="15" fill="#3a3a3a">')
        n_lbl = marcado.count('tg-esq__lbl')
        if not n_lbl:
            print('ERRO: nenhum rotulo marcado no desenho "%s"' % nome, file=sys.stderr)
            return 1
        html = html.replace('{{DESENHO:%s}}' % nome, marcado)
        print('desenho %-10s %d rotulos marcados' % (nome, n_lbl))

    sobrou = re.findall(r'\{\{[^}]+\}\}', html)
    if sobrou:
        print('ERRO: token nao substituido: ' + ', '.join(sorted(set(sobrou))), file=sys.stderr)
        return 1

    io.open(HTML, 'w', encoding='utf-8').write(html)
    print('ok: %d tokens substituidos, %d linhas no HTML' % (len(pedidos), html.count('\n') + 1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
