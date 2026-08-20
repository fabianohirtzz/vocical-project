<?php
/**
 * Cliente SMTP mínimo — envio autenticado para o formulário Trabalhe Conosco.
 *
 * Por que existe: a erehost recusa envio não autenticado vindo de script PHP
 * ("Saida nao autenticada - PHP SCRIPT"). O mail() é aceito pelo sendmail local
 * e só depois barrado no roteamento, então a função retorna true, o formulário
 * mostra sucesso e o bounce vai para uma caixa que ninguém lê. Falhava calado.
 *
 * Escrito à mão de propósito: o projeto não tem Composer nem dependência, e o
 * que precisamos é só STARTTLS + AUTH LOGIN + um envelope com vários RCPT.
 */

/**
 * @param string   $de        remetente do envelope (caixa autenticada)
 * @param string[] $para      destinatários do envelope (To + Bcc juntos)
 * @param string   $mensagem  cabeçalhos + corpo, já montados
 * @param string   $erro      recebe a mensagem de erro em caso de falha
 */
function enviar_smtp($de, array $para, $mensagem, &$erro = '') {
    $cfgArquivo = __DIR__ . '/smtp-config.php';
    if (!is_file($cfgArquivo)) { $erro = 'smtp-config.php ausente no servidor'; return false; }
    $cfg = require $cfgArquivo;
    foreach (['host', 'porta', 'user', 'senha'] as $c) {
        if (empty($cfg[$c])) { $erro = "smtp-config.php sem '$c'"; return false; }
    }
    if (!$para) { $erro = 'sem destinatarios'; return false; }

    $fp = @fsockopen($cfg['host'], (int) $cfg['porta'], $en, $es, 15);
    if (!$fp) { $erro = "conexao falhou: $es ($en)"; return false; }
    stream_set_timeout($fp, 20);

    $ler = function () use ($fp) {
        $r = '';
        while (($l = fgets($fp, 1024)) !== false) {
            $r .= $l;
            // resposta multilinha: "250-" continua, "250 " encerra
            if (strlen($l) < 4 || $l[3] !== '-') break;
        }
        return $r;
    };
    $cmd = function ($linha, $esperado) use ($fp, $ler, &$erro) {
        if ($linha !== null) fwrite($fp, $linha . "\r\n");
        $r = $ler();
        if (strncmp($r, (string) $esperado, strlen((string) $esperado)) !== 0) {
            $erro = trim(substr($r, 0, 160));
            return false;
        }
        return true;
    };

    $host = 'grupovocical.com.br';
    if (!$cmd(null, '220'))          { fclose($fp); return false; }
    if (!$cmd("EHLO $host", '250'))  { fclose($fp); return false; }
    if (!$cmd('STARTTLS', '220'))    { fclose($fp); return false; }
    if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        $erro = 'STARTTLS falhou'; fclose($fp); return false;
    }
    if (!$cmd("EHLO $host", '250'))  { fclose($fp); return false; }   // reapresenta após o TLS

    if (!$cmd('AUTH LOGIN', '334'))                 { fclose($fp); return false; }
    if (!$cmd(base64_encode($cfg['user']), '334'))  { fclose($fp); return false; }
    if (!$cmd(base64_encode($cfg['senha']), '235')) {
        $erro = 'autenticacao recusada: ' . $erro; fclose($fp); return false;
    }

    if (!$cmd("MAIL FROM:<$de>", '250')) { fclose($fp); return false; }
    foreach ($para as $r) {
        if (!$cmd("RCPT TO:<$r>", '250')) { $erro = "destinatario $r: $erro"; fclose($fp); return false; }
    }
    if (!$cmd('DATA', '354')) { fclose($fp); return false; }

    // CRLF em tudo e dot-stuffing: uma linha começando com "." encerraria o DATA
    $corpo = preg_replace("/\r\n|\r|\n/", "\r\n", $mensagem);
    $corpo = preg_replace('/^\./m', '..', $corpo);
    fwrite($fp, $corpo . "\r\n.\r\n");
    if (!$cmd(null, '250')) { fclose($fp); return false; }

    $cmd('QUIT', '221');
    fclose($fp);
    return true;
}
