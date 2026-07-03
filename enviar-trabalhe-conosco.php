<?php
/**
 * Handler do formulário "Trabalhe Conosco" — site estático Grupo Vocical.
 *
 * Recebe o POST multipart de trabalhe-conosco.html, roteia o e-mail para o
 * responsável da UNIDADE selecionada, com o currículo em anexo, e responde JSON.
 * Standalone (sem WordPress). Equivalente ao hook Elementor do site antigo.
 *
 * Requisitos: PHP com mail() habilitado (padrão em hospedagem compartilhada).
 * Sobe este arquivo na raiz do site na erehost, ao lado do index.html.
 */

header('Content-Type: application/json; charset=UTF-8');

/* ---------------- resposta JSON ---------------- */
function responder($ok, $msg, $code = 200) {
    http_response_code($code);
    echo json_encode($ok ? ['ok' => true, 'mensagem' => $msg]
                         : ['ok' => false, 'erro' => $msg]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método não permitido.', 405);
}

/* ---------------- 1) Mapa unidade -> destino (só no servidor) ---------------- */
/* Chave = value do <option> gerado no cliente (slug-da-marca + '-' + key da unidade).
   Ajuste os e-mails aqui se algum responsável mudar. */
$UNIDADES = [
    'vocical-votuporanga'          => ['email' => 'rh@grupovocical.com.br',                        'label' => 'Vocical - Votuporanga/SP'],
    'jacical-jales'                => ['email' => 'gerencia.jacical@grupovocical.com.br',          'label' => 'Jacical - Jales/SP'],
    'ello-forte-ribeirao-preto'    => ['email' => 'fernando@grupovocical.com.br',                  'label' => 'Ello Forte - Ribeirão Preto/SP'],
    'ello-forte-sao-carlos'        => ['email' => 'rodolfo.ellofortesc@grupovocical.com.br',       'label' => 'Ello Forte - São Carlos/SP'],
    'distribuidoras-itu'           => ['email' => 'diego@grupovocical.com.br',                     'label' => 'Distribuidora Ituana - Itu/SP'],
    'distribuidoras-piracicaba'    => ['email' => 'diego@grupovocical.com.br',                     'label' => 'Distribuidora Piracicabana - Piracicaba/SP'],
    'distribuidoras-itapetininga'  => ['email' => 'diego@grupovocical.com.br',                     'label' => 'Distribuidora Itapetininga - Itapetininga/SP'],
    'robracon-cuiaba'              => ['email' => 'financeiro.robraconcba@grupovocical.com.br',    'label' => 'Robracon - Cuiabá/MT'],
    'robracon-rondonopolis'        => ['email' => 'contabilidaderh.robracon@grupovocical.com.br',  'label' => 'Robracon - Rondonópolis/MT'],
    'robracon-sinop'               => ['email' => 'financeiro.robraconsnp@grupovocical.com.br',    'label' => 'Robracon - Sinop/MT'],
];

/* RH central sempre em cópia oculta (espelha o site antigo). */
$BCC_RH_CENTRAL = 'rh@grupovocical.com.br';
/* Cópia de monitoramento (Freela). Remover no encerramento do acompanhamento. */
$BCC_MONITORAMENTO = 'freelainhome@gmail.com';
/* Remetente no domínio (melhor entregabilidade que o e-mail do candidato). */
$FROM_EMAIL = 'site@grupovocical.com.br';
$FROM_NAME  = 'Grupo Vocical SITE';

/* ---------------- 2) Honeypot anti-spam ---------------- */
if (!empty($_POST['_gotcha'])) {
    responder(true, 'Candidatura enviada com sucesso.'); // finge sucesso p/ bots
}

/* ---------------- 3) Captura + sanitiza campos ---------------- */
function limpa($v) { return trim(str_replace(["\r", "\n"], ' ', (string) $v)); }

$nome       = isset($_POST['nome'])       ? limpa($_POST['nome'])       : '';
$email      = isset($_POST['email'])      ? limpa($_POST['email'])      : '';
$whatsapp   = isset($_POST['whatsapp'])   ? limpa($_POST['whatsapp'])   : '';
$unidadeKey = isset($_POST['unidade'])    ? limpa($_POST['unidade'])    : '';
$cargo      = isset($_POST['cargo'])      ? limpa($_POST['cargo'])      : '';
$comentario = isset($_POST['comentario']) ? trim((string) $_POST['comentario']) : '';

/* ---------------- 4) Validação ---------------- */
if ($nome === '')                                       responder(false, 'Informe seu nome.', 400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL))         responder(false, 'Informe um e-mail válido.', 400);
if ($whatsapp === '')                                   responder(false, 'Informe seu WhatsApp.', 400);
if (!isset($UNIDADES[$unidadeKey])) {
    error_log('Trabalhe Conosco: unidade não mapeada -> ' . $unidadeKey);
    responder(false, 'Selecione uma unidade válida.', 400);
}
if ($cargo === '')                                      responder(false, 'Selecione o cargo de interesse.', 400);

/* ---------------- 5) Valida o anexo (currículo) ---------------- */
if (empty($_FILES['curriculo']) || $_FILES['curriculo']['error'] === UPLOAD_ERR_NO_FILE) {
    responder(false, 'Anexe seu currículo.', 400);
}
$file = $_FILES['curriculo'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    responder(false, 'Falha no envio do arquivo. Tente novamente.', 400);
}
if ($file['size'] > 5 * 1024 * 1024) {
    responder(false, 'Arquivo acima de 5 MB.', 400);
}
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ['pdf', 'doc', 'docx'], true)) {
    responder(false, 'Formato inválido. Use PDF, DOC ou DOCX.', 400);
}
if (!is_uploaded_file($file['tmp_name'])) {
    responder(false, 'Arquivo inválido.', 400);
}
$conteudo = file_get_contents($file['tmp_name']);
if ($conteudo === false) {
    responder(false, 'Não foi possível ler o arquivo enviado.', 400);
}

/* Nome de anexo seguro. */
$nomeBase   = preg_replace('/[^A-Za-z0-9._-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$nomeAnexo  = 'curriculo-' . ($nomeBase !== '' ? $nomeBase : 'candidato') . '.' . $ext;

/* ---------------- 6) Monta e envia o e-mail (MIME multipart) ---------------- */
$destino = $UNIDADES[$unidadeKey]['email'];
$rotulo  = $UNIDADES[$unidadeKey]['label'];

$assunto = 'Novo currículo recebido - ' . $rotulo . ' - ' . $nome;

$corpo  = "Novo currículo enviado pelo site.\n\n";
$corpo .= "Nome: {$nome}\n";
$corpo .= "E-mail: {$email}\n";
$corpo .= "WhatsApp: {$whatsapp}\n";
$corpo .= "Unidade selecionada: {$rotulo}\n";
$corpo .= "Cargo de interesse: {$cargo}\n";
$corpo .= "Comentário: " . ($comentario !== '' ? $comentario : '-') . "\n\n";
$corpo .= "Este envio foi realizado pelo formulário Trabalhe Conosco do site.\n";

$boundary = 'vc_' . md5(uniqid('', true));
$eol = "\r\n";

/* Cabeçalhos */
$headers  = 'From: ' . mb_encode_mimeheader($FROM_NAME) . ' <' . $FROM_EMAIL . '>' . $eol;
$headers .= 'Reply-To: ' . mb_encode_mimeheader($nome) . ' <' . $email . '>' . $eol;
$bccs = array_values(array_unique(array_filter([$BCC_RH_CENTRAL, $BCC_MONITORAMENTO])));
if ($bccs) { $headers .= 'Bcc: ' . implode(', ', $bccs) . $eol; }
$headers .= 'MIME-Version: 1.0' . $eol;
$headers .= 'Content-Type: multipart/mixed; boundary="' . $boundary . '"' . $eol;

/* Corpo MIME: parte texto + parte anexo */
$msg  = '--' . $boundary . $eol;
$msg .= 'Content-Type: text/plain; charset=UTF-8' . $eol;
$msg .= 'Content-Transfer-Encoding: 8bit' . $eol . $eol;
$msg .= $corpo . $eol . $eol;

$msg .= '--' . $boundary . $eol;
$msg .= 'Content-Type: application/octet-stream; name="' . $nomeAnexo . '"' . $eol;
$msg .= 'Content-Transfer-Encoding: base64' . $eol;
$msg .= 'Content-Disposition: attachment; filename="' . $nomeAnexo . '"' . $eol . $eol;
$msg .= chunk_split(base64_encode($conteudo)) . $eol;

$msg .= '--' . $boundary . '--' . $eol;

$assuntoEnc = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
$enviado = @mail($destino, $assuntoEnc, $msg, $headers, '-f' . $FROM_EMAIL);

if (!$enviado) {
    error_log('Trabalhe Conosco: falha ao enviar para ' . $destino . ' | unidade ' . $unidadeKey);
    responder(false, 'Não foi possível enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.', 500);
}

error_log('Trabalhe Conosco: e-mail enviado para ' . $destino . ' | unidade ' . $unidadeKey);
responder(true, 'Candidatura enviada com sucesso. Boa sorte no processo seletivo!');
