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
        const saida = document.getElementById('res')
        saida.innerHTML = "<br><br><h3 style='color:green; text-align:center;'><b>Cadastro realizado com sucesso!</b></h3>"
      } else {
        saida.innerHTML = "<br><br><h3 style='color:red; text-align:center;' >Falha na realização do cadastro</h3>"
      }
    }
  };
  const params = 'texto=' + encodeURIComponent(texto) + '&descricao=' + encodeURIComponent(descricao);
  xhr.send(params);
}
