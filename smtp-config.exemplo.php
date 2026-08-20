<?php
/**
 * Credenciais de SMTP do formulário Trabalhe Conosco.
 *
 * COPIE este arquivo para `smtp-config.php` (que NÃO vai para o Git) e preencha
 * a senha da caixa. O `smtp-config.php` sobe por FTP junto com o site.
 *
 * Por que SMTP e não mail(): a erehost recusa envio não autenticado vindo de
 * script PHP ("Saida nao autenticada - PHP SCRIPT"). O mail() é aceito pelo
 * sendmail local e depois barrado no roteamento, gerando bounce silencioso.
 */
return [
    // Precisa ser o hostname que consta no certificado. Com 'localhost' o
    // STARTTLS falha na verificação do nome do peer ("STARTTLS falhou" no log).
    'host'  => 'mail.grupovocical.com.br',
    'porta' => 587,                            // STARTTLS
    'user'  => 'site@grupovocical.com.br',     // caixa real, criada no cPanel
    'senha' => 'COLOQUE_A_SENHA_AQUI',
];
