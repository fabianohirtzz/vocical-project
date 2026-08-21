#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tira o WordPress da raiz (public_html) no corte para o site estático.

MOVE, não apaga. Tudo vai para /wp-antigo/ com RENAME, que no FTP é uma
operação de servidor: instantânea, independente do tamanho de wp-content, e
desfazível na hora se algo der errado no corte. Apagar 30 mil arquivos por FTP
levaria muito tempo e não teria volta sem acionar a restauração da erehost.

O que NUNCA é tocado (aplicações do cliente e infraestrutura):
    /arquivos/  /assinatura/  /calcular/  /processos/  /backup/
    /.well-known/  (validação de SSL — mexer aqui derruba o certificado)
    /cgi-bin/  .ftpquota  favicon.ico  /novo/  (cópia de teste)

O .htaccess da raiz NÃO é movido: ele é sobrescrito pelo deploy do site novo.
Rodar este script DEPOIS de subir o site, não antes, senão a raiz fica sem
nada respondendo no intervalo.

Uso:
    export FTP_SENHA='...'
    python tools/arquivar-wordpress.py            # simula, não move nada
    python tools/arquivar-wordpress.py --aplicar
    python tools/arquivar-wordpress.py --desfazer # devolve tudo para a raiz
"""
import argparse, ftplib, os, sys

HOST = 'ftp.grupovocical.com.br'
USUARIO = 'ftpvocical@grupovocical.com.br'
ARQUIVO = 'wp-antigo'

# Diretórios do WordPress
DIRS_WP = ['wp-admin', 'wp-content', 'wp-includes']

# Arquivos do WordPress na raiz. wp-config.php entra: leva as credenciais do
# banco e não pode continuar na raiz de um site que não roda mais WordPress.
ARQS_WP = [
    'index.php', 'license.txt', 'readme.html', 'xmlrpc.php',
    'wp-activate.php', 'wp-blog-header.php', 'wp-comments-post.php',
    'wp-config-sample.php', 'wp-config.php', 'wp-cron.php',
    'wp-links-opml.php', 'wp-load.php', 'wp-login.php', 'wp-mail.php',
    'wp-settings.php', 'wp-signup.php', 'wp-trackback.php',
    '.htaccess.bk',      # backup do .htaccess do WP, sem função no site novo
    'error_log',         # só erros de cron do WordPress
]

# Confere que não vamos encostar em nada do cliente
INTOCAVEIS = {'arquivos', 'assinatura', 'calcular', 'processos', 'backup',
              'novo', '.well-known', 'cgi-bin', '.ftpquota', 'favicon.ico',
              '.htaccess'}


def conectar(senha):
    ftp = ftplib.FTP(HOST, timeout=60)
    ftp.login(USUARIO, senha)
    ftp.set_pasv(True)
    return ftp


def existe(ftp, caminho):
    """Testa presença sem depender de MLST (que a Pure-FTPd nem sempre expõe)."""
    try:
        ftp.size(caminho)
        return True
    except ftplib.error_perm:
        pass
    atual = ftp.pwd()
    try:
        ftp.cwd(caminho)
        ftp.cwd(atual)
        return True
    except ftplib.error_perm:
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--aplicar', action='store_true')
    ap.add_argument('--desfazer', action='store_true')
    ap.add_argument('--senha', default=os.environ.get('FTP_SENHA'))
    args = ap.parse_args()

    alvos = DIRS_WP + ARQS_WP
    conflito = INTOCAVEIS & set(alvos)
    if conflito:
        print('ABORTADO: a lista encosta em %s' % ', '.join(conflito))
        sys.exit(2)

    if not args.senha:
        print('Faltou a senha: defina FTP_SENHA ou passe --senha')
        sys.exit(1)

    ftp = conectar(args.senha)
    print('conectado em %s (raiz: %s)' % (HOST, ftp.pwd()))

    if args.desfazer:
        print('\n=== DEVOLVENDO O WORDPRESS PARA A RAIZ ===')
        voltou = 0
        for nome in alvos:
            de = '%s/%s' % (ARQUIVO, nome)
            if not existe(ftp, de):
                continue
            if args.aplicar:
                ftp.rename(de, nome)
                voltou += 1
                print('  <- %s' % nome)
            else:
                print('  (simulacao) voltaria %s' % nome)
        print('\n%d item(ns) devolvido(s).' % voltou)
        if not args.aplicar:
            print('Nada foi alterado. Use --desfazer --aplicar para valer.')
        ftp.quit()
        return

    if args.aplicar:
        try:
            ftp.mkd(ARQUIVO)
            print('criado /%s/' % ARQUIVO)
        except ftplib.error_perm as e:
            if not str(e).startswith('550'):
                raise
            print('/%s/ ja existe' % ARQUIVO)

    print('\n=== MOVENDO O WORDPRESS PARA /%s/ ===' % ARQUIVO)
    movidos = ausentes = 0
    for nome in alvos:
        if not existe(ftp, nome):
            ausentes += 1
            print('  --  %-26s (nao esta na raiz)' % nome)
            continue
        if args.aplicar:
            ftp.rename(nome, '%s/%s' % (ARQUIVO, nome))
            movidos += 1
            print('  ->  %-26s movido' % nome)
        else:
            print('  ->  %-26s seria movido' % nome)

    print('\n%d movido(s), %d ausente(s).' % (movidos, ausentes))
    if not args.aplicar:
        print('SIMULACAO: nada foi alterado. Rode com --aplicar.')
    else:
        print('Para desfazer: python tools/arquivar-wordpress.py --desfazer --aplicar')
    ftp.quit()


if __name__ == '__main__':
    main()
