document.getElementById('salvar').addEventListener('click', function() {
  const textoEscrita = document.getElementById('cadastroEmp').value;
  const descricao = document.getElementById('descricaoEmp').value;
  enviarDadosParaServidor(textoEscrita, descricao);
});

function enviarDadosParaServidor(texto, descricao) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '../PHP/salvarArquivo.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('Escrita realizada com sucesso no servidor.');
      } else {
        console.error('Erro ao salvar o arquivo no servidor.');
      }
    }
  };
  const params = 'texto=' + encodeURIComponent(texto) + '&descricao=' + encodeURIComponent(descricao);
  xhr.send(params);
}
