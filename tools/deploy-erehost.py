#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy do site estático do Grupo Vocical na erehost (FTP).

Monta um pacote limpo (só o que é site) e envia por FTP para um diretório alvo.
Por padrão envia para a subpasta de teste, nunca para a raiz — subir na raiz
exige --alvo raiz explícito, porque lá ainda mora o WordPress em produção.

Uso:
    export FTP_SENHA='...'
    python tools/deploy-erehost.py --alvo novo            # sobe em /novo/ (teste)
    python tools/deploy-erehost.py --alvo novo --dry      # só lista, não envia
    python tools/deploy-erehost.py --alvo raiz            # produção (pede confirmação)

O que NUNCA é enviado: fontes de conteúdo (.md), screenshots de referência,
os JSONs do Elementor, as páginas proto, o .git e as ferramentas.
"""
import argparse, ftplib, io, ftplib as _f, os, posixpath, sys, fnmatch

HOST = 'ftp.grupovocical.com.br'
USUARIO = 'ftpvocical@grupovocical.com.br'

# Diretórios inteiros que ficam de fora do pacote
PASTAS_FORA = {
    '.git', '.github', '.playwright-mcp', '.claude', '.superpowers',
    'docs', 'tools', 'Paginas Unidades', 'node_modules', '__pycache__',
}
# Padrões de arquivo que ficam de fora
ARQUIVOS_FORA = [
    '*.md',            # referencia-conteudo, copy-novo-site, CLAUDE.md, validacao...
    '*.jpeg',          # screenshots de referência soltos na raiz
    '.gitignore', '.DS_Store', 'Thumbs.db',
    '*.py', '*.mjs',
]
# Páginas de protótipo que não vão para produção
CAMINHOS_FORA = ['marcas/rondonopolis-proto.html',
                 'marcas/rondonopolis-proto2.html',
                 'marcas/rondonopolis-proto3.html']

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def deve_ir(rel):
    partes = rel.split('/')
    if any(p in PASTAS_FORA for p in partes[:-1]):
        return False
    if rel in CAMINHOS_FORA:
        return False
    nome = partes[-1]
    return not any(fnmatch.fnmatch(nome, p) for p in ARQUIVOS_FORA)


def coletar():
    itens = []
    for base, dirs, arquivos in os.walk(RAIZ):
        dirs[:] = [d for d in dirs if d not in PASTAS_FORA]
        for a in arquivos:
            caminho = os.path.join(base, a)
            rel = os.path.relpath(caminho, RAIZ).replace('\\', '/')
            if deve_ir(rel):
                itens.append((rel, caminho, os.path.getsize(caminho)))
    return sorted(itens)


_DIRS_OK = set()


def garantir_dir(ftp, caminho):
    """mkdir -p remoto, tolerante a diretório já existente.
    Guarda o que já criou: sem isso seriam milhares de MKD por deploy."""
    if caminho in _DIRS_OK:
        return
    atual = ''
    for parte in caminho.split('/'):
        if not parte:
            continue
        atual = posixpath.join(atual, parte) if atual else parte
        try:
            ftp.mkd(atual)
        except ftplib.error_perm as e:
            if not str(e).startswith('550'):   # 550 = já existe
                raise
        _DIRS_OK.add(atual)
    _DIRS_OK.add(caminho)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--alvo', required=True, help='"novo" (teste) ou "raiz" (produção)')
    ap.add_argument('--dry', action='store_true', help='lista o pacote e sai')
    ap.add_argument('--senha', default=os.environ.get('FTP_SENHA'))
    ap.add_argument('--so', nargs='*', metavar='CAMINHO',
                    help='envia apenas estes caminhos (relativos a raiz do projeto)')
    args = ap.parse_args()

    destino = '' if args.alvo == 'raiz' else args.alvo
    itens = coletar()
    if args.so:
        alvos = set(args.so)
        itens = [i for i in itens if i[0] in alvos]
        faltando = alvos - {i[0] for i in itens}
        if faltando:
            print('Nao estao no pacote: ' + ', '.join(sorted(faltando))); sys.exit(1)
    total = sum(t for _, _, t in itens)
    print('Pacote: %d arquivos, %.1f MB' % (len(itens), total / 1048576))
    print('Destino: %s/%s' % (HOST, destino or '(raiz)'))

    if args.dry:
        for rel, _, tam in itens:
            print('  %8.1f KB  %s' % (tam / 1024, rel))
        return

    if args.alvo == 'raiz':
        print('\n!! RAIZ é produção e ainda tem o WordPress no ar.')
        if input('   Digite "subir na raiz" para confirmar: ').strip() != 'subir na raiz':
            print('   Cancelado.'); return

    if not args.senha:
        print('Faltou a senha: defina FTP_SENHA ou passe --senha'); sys.exit(1)

    ftp = ftplib.FTP(HOST, timeout=60)
    ftp.login(USUARIO, args.senha)
    ftp.set_pasv(True)
    print('Conectado.')

    if destino:
        garantir_dir(ftp, destino)

    feitos = criados = 0
    for rel, caminho, tam in itens:
        remoto = posixpath.join(destino, rel) if destino else rel
        pasta = posixpath.dirname(remoto)
        if pasta:
            garantir_dir(ftp, pasta)
        if rel == '.htaccess' and destino:
            # Na subpasta de teste o ErrorDocument precisa apontar para dentro
            # dela; com /404.html o Apache serviria a raiz, onde ainda esta o
            # WordPress. Na raiz o arquivo sobe sem alteracao.
            conteudo = io.open(caminho, encoding='utf-8').read().replace(
                'ErrorDocument 404 /404.html',
                'ErrorDocument 404 /%s/404.html' % destino)
            ftp.storbinary('STOR ' + remoto, io.BytesIO(conteudo.encode('utf-8')))
        else:
            with open(caminho, 'rb') as fh:
                ftp.storbinary('STOR ' + remoto, fh, blocksize=65536)
        feitos += 1
        criados += tam
        if feitos % 25 == 0 or feitos == len(itens):
            print('  %4d/%d  (%.1f MB)' % (feitos, len(itens), criados / 1048576))
    ftp.quit()
    print('Concluído: %d arquivos, %.1f MB' % (feitos, criados / 1048576))


if __name__ == '__main__':
    main()
