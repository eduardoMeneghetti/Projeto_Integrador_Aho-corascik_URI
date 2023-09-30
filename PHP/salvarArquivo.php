<?php
$arquivo = '../JS/entrada.txt'; //escolhendo o arquivo de gravação
$texto = $_POST['texto']; //nome empresa
$descricao = $_POST['descricao'];//descrição empresa

//fazendo a escrita no arquivo e separando tratando a mesma
if ($texto) {
  $linha = $texto . ';' . $descricao . PHP_EOL;
  if (file_put_contents($arquivo, $linha, FILE_APPEND)) {
    http_response_code(200); //resposta http quando da certo
  } else {
    http_response_code(500); //resposta http caso de erro
  }
} else {
  http_response_code(400); //resposta http caso de erro
}
?>

