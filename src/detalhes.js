const produtosDB = {
    "batedeira": {
        nome: "Batedeira",
        preco: "R$ 270,00",
        imagem: "../assets/batedeira.jpeg"
    },
    "airfryer": {
        nome: "Airfryer",
        preco: "R$ 500,00",
        imagem: "../assets/airfrie.jpeg"
    },
    "ferro": {
        nome: "Ferro de Passar",
        preco: "R$ 80,00",
        imagem: "../assets/ferrodepassar.jpeg"
    },
    "cooktop": {
        nome: "Fogão de Mesa Cooktop",
        preco: "R$ 800,00",
        imagem: "../assets/fogaocooktop.jpeg"
    },
    "maquina": {
        nome: "Máquina Lava e Seca",
        preco: "R$ 2.500,00",
        imagem: "../assets/maquinadelavar.jpeg"
    },
    "microondas": {
        nome: "Micro-Ondas",
        preco: "R$ 600,00",
        imagem: "../assets/microondas.jpeg"
    }
};


const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get('id');
console.log(idProduto);

const produtoEncontrado = produtosDB[idProduto];


if (produtoEncontrado) {
    document.getElementById('nomeProduto').textContent = produtoEncontrado.nome;
    document.getElementById('precoProduto').textContent = produtoEncontrado.preco;
    document.getElementById('fotoProduto').src = produtoEncontrado.imagem;
    document.title = `${produtoEncontrado.nome} - Mini Loja`;
} else {
    document.getElementById('nomeProduto').textContent = "Produto não encontrado";
}
// ... (Mantenha no topo o seu objeto produtosDB e a captura do idProduto via URL)

const btnComprar = document.querySelector('.btn-comprar');
const modal = document.getElementById('modalCheckout');
const btnFecharModal = document.getElementById('btnFecharModal');
const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');

const inputQtd = document.getElementById('qtdItem');
const selectPagamento = document.getElementById('formaPagamento');

// Helper para converter a string "R$ 270,00" para número (270.00)
function extrairValorNumerico(precoString) {
    if (!precoString) return 0;
    // Remove "R$", espaços e troca ponto por nada e vírgula por ponto
    const limpo = precoString.replace("R$", "").replace(".", "").replace(",", ".").trim();
    return parseFloat(limpo) || 0;
}

// Função responsável por recalcular os valores da Nota Fiscal
function calcularNotaFiscal() {
    if (!produtoEncontrado) return;

    const valorUnitario = extrairValorNumerico(produtoEncontrado.preco);
    const quantidade = parseInt(inputQtd.value) || 1;
    const formaPagamento = selectPagamento.value;

    let subtotal = valorUnitario * quantidade;
    let desconto = 0;

    // Aplica 5% de desconto se a opção escolhida for Pix
    if (formaPagamento === 'pix') {
        desconto = subtotal * 0.05;
    }

    const valorFinal = subtotal - desconto;

    // Atualiza o HTML da Nota Fiscal
    document.getElementById('nfNome').textContent = produtoEncontrado.nome;
    document.getElementById('nfPrecoUnitario').textContent = produtoEncontrado.preco;
    document.getElementById('nfQtd').textContent = quantidade;
    
    document.getElementById('nfDesconto').textContent = desconto > 0 
        ? `- R$ ${desconto.toFixed(2).replace('.', ',')}` 
        : 'R$ 0,00';

    document.getElementById('nfTotal').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
}

// Escuta mudanças na Quantidade e no Tipo de Pagamento para atualizar a nota em tempo real
inputQtd.addEventListener('input', calcularNotaFiscal);
selectPagamento.addEventListener('change', calcularNotaFiscal);

// 1. Abrir o modal e calcular a nota inicial
btnComprar.addEventListener('click', () => {
    modal.style.display = 'flex';
    calcularNotaFiscal(); // Gera a nota no momento em que abre
});

// 2. Cancelar/Fechar o modal
btnFecharModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 3. Confirmar a Compra e remover da Home
btnConfirmarCompra.addEventListener('click', () => {
    let produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')) || [];
    
    if (!produtosComprados.includes(idProduto)) {
        produtosComprados.push(idProduto);
        localStorage.setItem('produtosComprados', JSON.stringify(produtosComprados));
    }

    alert('Compra realizada com sucesso! Nota fiscal gerada.');
    
    // Redireciona para a home
    window.location.href = '../index.html';
});