let produtosDB = {};

async function carregarBancoDeDados() {
    try {
        const resposta = await fetch('../src/produtos.json');
        produtosDB = await resposta.json();
        
        
        let estoqueLocal = JSON.parse(localStorage.getItem('estoqueProdutos'));
        if (!estoqueLocal) {
            estoqueLocal = {};
            for (let key in produtosDB) {
                estoqueLocal[key] = produtosDB[key].quantidade;
            }
            localStorage.setItem('estoqueProdutos', JSON.stringify(estoqueLocal));
        }

        iniciarLogicaDoProduto(estoqueLocal);

    } catch (erro) {
        console.error("Erro ao carregar o arquivo JSON:", erro);
    }
}


function iniciarLogicaDoProduto(estoqueLocal) {
    const urlParams = new URLSearchParams(window.location.search);
    const idProduto = urlParams.get('id');

    const produtoEncontrado = produtosDB[idProduto];
    const quantidadeDisponivel = estoqueLocal[idProduto];

        
    if (!produtoEncontrado || quantidadeDisponivel <= 0) {
        document.getElementById('nomeProduto').textContent = "Produto Esgotado ou Indisponível";
        document.querySelector('.btn-comprar').style.display = 'none';
        return;
    }

    
    document.getElementById('nomeProduto').textContent = produtoEncontrado.nome;
    document.getElementById('precoProduto').textContent = produtoEncontrado.preco;
    document.getElementById('fotoProduto').src = produtoEncontrado.imagem;
    document.title = `${produtoEncontrado.nome} - Mini Loja`;

    
    const inputQtd = document.getElementById('qtdItem');
    inputQtd.max = quantidadeDisponivel; 
    inputQtd.value = 1;

    configurarModal(idProduto, produtoEncontrado, estoqueLocal);
}


function configurarModal(idProduto, produtoEncontrado, estoqueLocal) {
    const btnComprar = document.querySelector('.btn-comprar');
    const modal = document.getElementById('modalCheckout');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const btnConfirmarCompra = document.getElementById('btnConfirmarCompra');
    const inputQtd = document.getElementById('qtdItem');
    const selectPagamento = document.getElementById('formaPagamento');

    function extrairValorNumerico(precoString) {
        if (!precoString) return 0;
        const limpo = precoString.replace("R$", "").replace(".", "").replace(",", ".").trim();
        return parseFloat(limpo) || 0;
    }

    function calcularNotaFiscal() {
        if (!produtoEncontrado) {
            return;
        }
        let valorUnitario = extrairValorNumerico(produtoEncontrado.preco);
        const quantidadeDesejada = parseInt(inputQtd.value) || 1;
        let valorUnitarioFinal = valorUnitario;
        let badgeDesconto = document.getElementById('avisoDescontoEstoque');
        const estoqueMaximo = estoqueLocal[idProduto];

        if (!badgeDesconto) {
            badgeDesconto = document.createElement('div');
            badgeDesconto.id = 'avisoDescontoEstoque';
            badgeDesconto.style.color = '#d32f2f';
            badgeDesconto.style.fontWeight = 'bold';
            badgeDesconto.style.fontSize = '0.85rem';
            document.querySelector('.info-compra').prepend(badgeDesconto);
        }
        
        if (quantidadeDesejada > estoqueMaximo) {
            alert(`Quantidade máxima disponível em estoque: ${estoqueMaximo}`);
            quantidadeDesejada = estoqueMaximo;
            inputQtd.value = estoqueMaximo;
        }

        const formaPagamento = selectPagamento.value;
        let subtotal = valorUnitario * quantidadeDesejada;
        let desconto = 0;

        if (formaPagamento === 'pix') {
            desconto = subtotal * 0.05; 
        } else if (estoqueAtual <= 20) {
            desconto = valorUnitario * 0.33;
            valorUnitario = valorUnitario - descontoEstoque;
            badgeDesconto.textContent = `🔥 Preço promocional: 33% OFF (Restam apenas ${estoqueAtual} unidades!)`
        } else{
            badgeDesconto.textContent = '';
        }

        const valorFinal = subtotal - desconto;

        
        document.getElementById('nfNome').textContent = produtoEncontrado.nome;
        document.getElementById('nfPrecoUnitario').textContent = produtoEncontrado.preco;
        document.getElementById('nfQtd').textContent = quantidadeDesejada;
        document.getElementById('nfDesconto').textContent = desconto > 0 
            ? `- R$ ${desconto.toFixed(2).replace('.', ',')}` 
            : 'R$ 0,00';
        document.getElementById('nfTotal').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
    }

    inputQtd.addEventListener('input', calcularNotaFiscal);
    selectPagamento.addEventListener('change', calcularNotaFiscal);

    btnComprar.addEventListener('click', () => {
        modal.style.display = 'flex';
        calcularNotaFiscal();
    });

    btnFecharModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    
    btnConfirmarCompra.addEventListener('click', () => {
        const quantidadeComprada = parseInt(inputQtd.value) || 1;

        
        estoqueLocal[idProduto] -= quantidadeComprada;

        
        let produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')) || [];
        if (estoqueLocal[idProduto] <= 0) {
            if (!produtosComprados.includes(idProduto)) {
                produtosComprados.push(idProduto);
            }
        }

        
        localStorage.setItem('estoqueProdutos', JSON.stringify(estoqueLocal));
        localStorage.setItem('produtosComprados', JSON.stringify(produtosComprados));

        alert('Compra realizada com sucesso! Estoque atualizado.');
        window.location.href = '../index.html';
    });
}

carregarBancoDeDados();