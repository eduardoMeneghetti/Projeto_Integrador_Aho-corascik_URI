const fs = require('fs');

try {
    const filePath = 'D:/xampp/htdocs/projetoIntegrador2/entrada.txt';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    var arquivoLido = fileContent;
} catch (error) {
    console.error('Erro ao ler o arquivo:', error);
}

function verificar() {
    var testeVar = document.getElementById('nomeEmp').value
    var res = window.document.getElementById('res')

    class TrieNode {
        constructor() {
            this.children = new Map();
            this.isEndOfWord = false;
            this.failure = null;
            this.output = [];
        }
    }

    class AhoCorasick {
        constructor() {
            this.root = new TrieNode();
        }

        addKeyword(keyword) {
            let currentNode = this.root;

            for (let i = 0; i < keyword.length; i++) {
                const char = keyword[i];
                if (!currentNode.children.has(char)) {
                    currentNode.children.set(char, new TrieNode());
                }
                currentNode = currentNode.children.get(char);
            }

            currentNode.isEndOfWord = true;
            currentNode.output.push(keyword);
        }

        buildFailureLinks() {
            const queue = [];

            for (const node of this.root.children.values()) {
                if (node) {
                    node.failure = this.root;
                    queue.push(node);
                }
            }

            while (queue.length > 0) {
                const currentNode = queue.shift();

                for (const [key, child] of currentNode.children) {
                    queue.push(child);

                    let failure = currentNode.failure;
                    while (failure && !failure.children.has(key)) {
                        failure = failure.failure;
                    }

                    child.failure = failure ? failure.children.get(key) : this.root;

                    child.output = child.failure.output.concat(child.output);
                }
            }
        }

        search(text) {
            let currentNode = this.root;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];

                while (currentNode !== this.root && !currentNode.children.has(char)) {
                    currentNode = currentNode.failure;
                }

                if (currentNode.children.has(char)) {
                    currentNode = currentNode.children.get(char);
                }

                if (currentNode.output.length > 0) {
                    res.innerHTML = `Encontrado(s) "${currentNode.output.join('", "')}" na posição ${i - currentNode.output[0].length + 1}`

                }
            }
        }
    }

    // Exemplo de uso
    const ac = new AhoCorasick();

    // Adiciona palavras-chave
    ac.addKeyword(testeVar);

    // Constrói os links de falha
    ac.buildFailureLinks();

    // Procura no texto
    ac.search("Master, Cassul, Astrus, Ereline, Olfar, Peccin, Rener");
}