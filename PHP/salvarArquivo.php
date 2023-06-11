<?php
$arquivo = '../JS/entrada.txt';
$texto = $_POST['texto'];
$descricao = $_POST['descricao'];

if ($texto) {
  $linha = $texto . ';' . $descricao . PHP_EOL;
  if (file_put_contents($arquivo, $linha, FILE_APPEND)) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
?>

