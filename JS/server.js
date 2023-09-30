// Variável para armazenar os dados das empresas
let companiesData = [];

// Função para carregar os dados das empresas a partir do arquivo
function loadCompaniesData() {
  // Caminho do arquivo de empresas
  const filePath = '../JS/entrada.txt';
  
  // Fazendo uma solicitação HTTP GET para carregar o arquivo de dados
  fetch(filePath)
    .then((response) => response.text()) // Lendo o conteúdo do arquivo como texto
    .then((fileContent) => {
      // Chamando a função para fazer o parsing do conteúdo do arquivo
      companiesData = parseFileContent(fileContent);
      console.log('Dados das empresas carregados:', companiesData);
    })
    .catch((error) => {
      console.error('Erro ao carregar o arquivo:', error);
    });
}

// Função para fazer o parsing do conteúdo do arquivo
function parseFileContent(fileContent) {
  // Dividindo o conteúdo do arquivo em linhas
  const lines = fileContent.split('\n');

  // Mapeando cada linha para obter os dados da empresa
  const companies = lines.map((line) => {
    // Dividindo a linha em nome e descrição da empresa usando ';' como separador
    const [name, description] = line.split(';');
    return { name, description };
  });

  // Retornando os dados das empresas
  return companies;
}

// Função para realizar a busca das empresas
function searchCompanies() {
  // Obtendo o valor digitado no campo de pesquisa
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Verificando se o termo de pesquisa não está vazio
  if (searchTerm === '') {
    return;
  }

  // Obtendo a lista de resultados onde os resultados serão exibidos
  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = '';

  // Implementação do algoritmo Aho-Corasick
  //A classe AhoCorasickNode representa um nó na estrutura de dados do algoritmo Aho-Corasick. 
  //Cada nó armazena um caractere (value), uma coleção de nós filhos (children), 
  //uma referência ao nó de falha (fail), e uma lista de padrões de busca que terminam neste nó (output).
  class AhoCorasickNode {
    constructor(value) {
      this.value = value;  //value: É o caractere associado ao nó. Ele representa uma parte do padrão de busca.
      this.children = new Map(); //children: É uma coleção de nós filhos, representando os caracteres seguintes no padrão de busca.
      this.fail = null; //fail: É uma referência ao nó de falha. O nó de falha é usado para otimizar a busca, permitindo pular para um ponto válido da árvore de busca quando ocorre uma falha.
      this.output = []; //output: É uma lista de padrões de busca que terminam neste nó. Esses padrões são armazenados para identificar os padrões encontrados durante a busca.
    }
  }

  /*A classe AhoCorasick representa o objeto Aho-Corasick em si e contém os métodos necessários para adicionar padrões de busca, 
  construir os links de falha e realizar a busca.*/
  class AhoCorasick {
    constructor() {
      this.root = new AhoCorasickNode(null); //root: É o nó raiz da estrutura de dados do Aho-Corasick. Todos os outros nós são descendentes deste nó.
    }
    //addPattern(pattern): Este método adiciona um padrão de busca à estrutura de dados do Aho-Corasick. 
    //Ele recebe um padrão como entrada e percorre a árvore de busca, criando novos nós conforme necessário para representar o padrão. 
    //Se um caminho já existir para o próximo caractere do padrão, o método apenas segue esse caminho. 
    //Caso contrário, ele cria um novo nó filho no caminho. O nó atualiza sua lista output, adicionando o padrão ao qual ele pertence.
    addPattern(pattern) {
      let node = this.root;
      for (const char of pattern) {
        if (!node.children.has(char)) {
          node.children.set(char, new AhoCorasickNode(char));
        }
        node = node.children.get(char);
      }
      node.output.push(pattern);
    }
    //buildFailureLinks(): Este método constrói os links de falha na estrutura de dados do Aho-Corasick. 
    //Ele percorre a árvore em largura, usando uma fila para processar os nós em ordem. 
    //Para cada nó, o método segue o link de falha do seu nó pai até encontrar um nó que tenha um filho correspondente ao caractere atual.
    //Em seguida, atualiza o link de falha do nó atual para esse nó correspondente. 
    //Isso permite que a busca avance rapidamente na árvore em caso de falha.
    buildFailureLinks() {
      const queue = [];
      for (const child of this.root.children.values()) {
        queue.push(child);
        child.fail = this.root;
      }

      while (queue.length > 0) {
        const node = queue.shift();
        for (const [char, child] of node.children) {
          queue.push(child);
          let failNode = node.fail;
          while (failNode !== null && !failNode.children.has(char)) {
            failNode = failNode.fail;
          }
          child.fail = failNode !== null ? failNode.children.get(char) : this.root;
          child.output = child.output.concat(child.fail.output);
        }
      }
    }
    //search(text): Este método realiza a busca de padrões no texto fornecido. 
    //Ele recebe o texto como entrada e percorre o texto caractere por caractere. 
    //Para cada caractere, o método segue o link de falha do nó atual até encontrar um nó que tenha um filho correspondente ao caractere atual. 
    //Se isso acontecer, o método avança para esse nó e adiciona os padrões encontrados à lista de resultados. 
    //Caso contrário, o método retorna ao nó raiz e continua a busca a partir dali. 
    //No final, o método retorna a lista de padrões encontrados durante a busca.
    search(text) {
      const results = [];
      let node = this.root;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        while (node !== null && !node.children.has(char)) {
          node = node.fail;
        }
        if (node === null) {
          node = this.root;
          continue;
        }
        node = node.children.get(char);
        results.push(...node.output);
      }
      return results;
    }
  }

  // Criando o objeto Aho-Corasick
  const ac = new AhoCorasick();

  // Adicionando os padrões de busca (nomes das empresas)
  companiesData.forEach((company) => {
    ac.addPattern(company.name.toLowerCase());
  });

  // Construindo os links de falha
  ac.buildFailureLinks();

  // Realizando a busca com o algoritmo Aho-Corasick
  const results = ac.search(searchTerm);

  // Filtrando as empresas correspondentes aos resultados
  const filteredCompanies = companiesData.filter((company) => {
    const nameMatch = company.name.toLowerCase().includes(searchTerm);
    const description = company.description ? company.description.toLowerCase() : '';
    const descriptionMatch = description.includes(searchTerm);
    return nameMatch || descriptionMatch;
  });

  // Exibindo os resultados na lista
  filteredCompanies.forEach((result) => {
    const listItem = document.createElement('li');
    const highlightedName = result.name.replace(new RegExp(searchTerm, 'gi'), '<mark>$&</mark>');
    const highlightedDescription = result.description.replace(new RegExp(searchTerm, 'gi'), '<mark>$&</mark>');
    listItem.innerHTML = `
      <h3>${highlightedName}</h3>
      <p>${highlightedDescription}</p>
      <hr>
    `;
  
    resultsList.appendChild(listItem);
  });
}


// Carregando os dados das empresas ao iniciar a página
loadCompaniesData();