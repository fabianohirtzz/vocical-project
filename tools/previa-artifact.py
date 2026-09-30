# -*- coding: utf-8 -*-
"""Monta o pacote da previa de uma LP para publicar como Artifact.

Receita da secao 12 do playbook, com os ajustes que o contrato do Artifact impoe:

- O Artifact envolve a pagina num esqueleto proprio (<!doctype>, <html>, <head>,
  <body>), entao o arquivo publicado NAO pode trazer os seus. O <title> e os
  <link> de estilo vao para o topo do conteudo, e os atributos que ficavam no
  <body> (data-landing, data-lead-*) passam a ser aplicados por um script inline,
  antes do lead.js rodar.
- `data-base` deixa de existir, e o lead.js le isso como '' — que e exatamente o
  caminho plano que a previa precisa.
- GTM e meutrack saem. LEAD.DRY_RUN entra como true, entao nenhum lead real e
  gerado, e uma faixa no topo avisa disso.
- As imagens sao achatadas em a/, com nome sem espaco, acento ou parentese. Foi
  caminho de imagem esquecido que virou o "rodape sem imagem" da previa anterior,
  e o que mais escapa e justamente o que so aparece dentro do CSS.

    python3 tools/previa-artifact.py <pasta-da-lp> <pasta-de-saida>
"""
import io, os, re, shutil, sys, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Assets que nenhum parser de HTML acha, porque nascem no CSS ou no JS.
EXTRAS = [
    'Imagens/footer-desktop.png',      # cena do rodape, no site.css
    'Imagens/footer-mobile.jpg',       # idem, versao mobile
    'Imagens/logo-header.png',         # header montado pelo layout.js
    'Imagens/logo-site-1.png',         # rodape montado pelo layout.js
    'img/vico-avatar.jpg',             # avatar do widget de lead
]
CSS = ['base', 'site', 'pages', 'unidade', 'calculadoras', 'lead', 'fonts']

# Aviso de foto por LP. Sem entrada, vale o texto genérico.
AVISO_FOTO = {
    'campaigns-robracon-telha-galvalume':
        'Só a foto da telha ondulada ainda é provisória.',
}
JS = ['config', 'layout', 'lead', 'main', 'cta']


def seguro(caminho):
    """Nome plano, sem espaco, acento ou parentese."""
    nome = os.path.basename(caminho)
    nome = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode()
    nome = re.sub(r'[^A-Za-z0-9._-]+', '-', nome).strip('-')
    return re.sub(r'-+', '-', nome)


def main(pasta_lp, saida):
    html = io.open(os.path.join(RAIZ, pasta_lp, 'index.html'), encoding='utf-8').read()
    os.path.exists(saida) and shutil.rmtree(saida)
    for d in ('a', 'css', 'js', 'fonts'):
        os.makedirs(os.path.join(saida, d), exist_ok=True)

    # ---- 1. levanta as imagens citadas no HTML, mais as que so o CSS/JS conhece
    refs = set(re.findall(r'(?:src|href)="((?:\.\./)?(?:img|Imagens)/[^"]+)"', html))
    refs |= set(EXTRAS)
    mapa = {}
    for ref in sorted(refs):
        rel = ref[3:] if ref.startswith('../') else ref
        origem = os.path.join(RAIZ, rel)
        if not os.path.exists(origem):
            print('  FALTA no repo:', rel); continue
        destino = seguro(rel)
        # nome repetido em pastas diferentes ganha prefixo da pasta
        if destino in mapa.values() and mapa.get(rel) != destino:
            destino = seguro(os.path.dirname(rel) + '-' + os.path.basename(rel))
        mapa[rel] = destino
        shutil.copy2(origem, os.path.join(saida, 'a', destino))
    print('  imagens copiadas:', len(mapa))

    def troca_imgs(txt, prefixo=''):
        for rel, dest in sorted(mapa.items(), key=lambda kv: -len(kv[0])):
            for variante in ('../' + rel, rel):
                txt = txt.replace('"' + variante + '"', '"' + prefixo + 'a/' + dest + '"')
                txt = txt.replace("'" + variante + "'", "'" + prefixo + 'a/' + dest + "'")
                txt = txt.replace('(' + variante + ')', '(' + prefixo + 'a/' + dest + ')')
        return txt

    # ---- 2. css e js, com os caminhos de imagem reescritos
    tema = os.path.basename(pasta_lp.rstrip('/')).replace('campaigns-robracon-', '')
    css_lp = 'campanha-telha' if 'telha' in tema else 'campanha-' + tema
    for nome in CSS + [css_lp]:
        p = os.path.join(RAIZ, 'css', nome + '.css')
        if not os.path.exists(p):
            print('  css ausente:', nome); continue
        io.open(os.path.join(saida, 'css', nome + '.css'), 'w', encoding='utf-8').write(
            troca_imgs(io.open(p, encoding='utf-8').read(), '../'))
    js_lp = [n for n in os.listdir(os.path.join(RAIZ, 'js'))
             if n.endswith('.js') and (n.startswith(tema.split('-')[0]) or n == 'desenho-zoom.js')]
    for nome in [n + '.js' for n in JS] + js_lp:
        p = os.path.join(RAIZ, 'js', nome)
        if not os.path.exists(p):
            continue
        io.open(os.path.join(saida, 'js', nome), 'w', encoding='utf-8').write(
            troca_imgs(io.open(p, encoding='utf-8').read()))
    for f in os.listdir(os.path.join(RAIZ, 'fonts')):
        if f.endswith('.woff2'):
            shutil.copy2(os.path.join(RAIZ, 'fonts', f), os.path.join(saida, 'fonts', f))

    # ---- 3. a pagina
    titulo = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
    corpo = re.search(r'<body([^>]*)>(.*)</body>', html, re.S)
    attrs = dict(re.findall(r'([a-z-]+)(?:="([^"]*)")?', corpo.group(1)))
    conteudo = corpo.group(2)
    # GTM, meutrack e o noscript do GTM saem da previa
    conteudo = re.sub(r'<noscript><iframe src="https://www\.googletagmanager\.com.*?</noscript>', '', conteudo, flags=re.S)
    conteudo = troca_imgs(conteudo)
    conteudo = conteudo.replace('../css/', 'css/').replace('../js/', 'js/')

    links = '\n'.join('<link rel="stylesheet" href="css/%s.css">' % n for n in CSS[:-1] + [css_lp])
    set_attrs = ';'.join("d.setAttribute('%s','%s')" % (k, v or '') for k, v in attrs.items())
    # O aviso das fotos muda por LP: na de telha só a ondulada segue placeholder,
    # dizer "as fotos são provisórias" ali passaria a ser mentira.
    faixa = (
        '<div id="previa-aviso">Prévia para aprovação. '
        'O rastreamento está desligado e o formulário <b>não envia lead real</b>. '
        + AVISO_FOTO.get(os.path.basename(pasta_lp.rstrip('/')), 'As fotos ainda são provisórias.')
        + '</div>')
    estilo = (
        '<style>\n'
        '#previa-aviso{position:sticky;top:0;z-index:300;background:#0d0d0d;color:#fff;'
        'font:600 12px/1.45 Archivo,system-ui,sans-serif;text-align:center;'
        'padding:.62rem 1rem;letter-spacing:.01em}\n'
        '#previa-aviso b{color:#ff8a8a}\n'
        '</style>')
    cabeca = (
        '<title>%s</title>\n%s\n%s\n'
        '<script>(function(){var d=document.body;%s;'
        'window.VOCICAL=window.VOCICAL||{};})();</script>\n'
        % (titulo, links, estilo, set_attrs))
    # DRY_RUN depois do config.js e antes do lead.js
    conteudo = conteudo.replace(
        '<script src="js/lead.js',
        '<script>VOCICAL.LEAD.DRY_RUN=true;</script>\n  <script src="js/lead.js', 1)
    io.open(os.path.join(saida, 'index.html'), 'w', encoding='utf-8').write(
        cabeca + faixa + conteudo)
    print('  pagina:', os.path.join(saida, 'index.html'))
    return mapa


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
