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
    
    const elementoPreco = document.getElementById('precoProduto');
    
    if (quantidadeDisponivel <= 20) {
        const precoLimpo = produtoEncontrado.preco.replace("R$", "").replace(".", "").replace(",", ".").trim();
        const valorOriginal = parseFloat(precoLimpo) || 0;
        const valorPromocional = valorOriginal - (valorOriginal * 0.33);

        elementoPreco.innerHTML = `
            <span style="text-decoration: line-through; color: #888; font-size: 0.9rem;">${produtoEncontrado.preco}</span><br>
            <strong style="color: #2e7d32;">R$ ${valorPromocional.toFixed(2).replace('.', ',')}</strong>
            <div style="color: #d32f2f; font-size: 0.85rem; font-weight: bold; margin-top: 4px;">
                🔥 Últimas ${quantidadeDisponivel} unidades! (33% OFF)
            </div>
        `;
    } else {
        elementoPreco.textContent = produtoEncontrado.preco;
    }
    
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
        if (!produtoEncontrado) return;

        const valorUnitarioOriginal = extrairValorNumerico(produtoEncontrado.preco);
        let quantidadeDesejada = parseInt(inputQtd.value) || 1;
        const estoqueAtual = estoqueLocal[idProduto]; 
        const formaPagamento = selectPagamento.value;

        let badgeDesconto = document.getElementById('avisoDescontoEstoque');
        if (!badgeDesconto) {
            badgeDesconto = document.createElement('div');
            badgeDesconto.id = 'avisoDescontoEstoque';
            badgeDesconto.style.color = '#d32f2f';
            badgeDesconto.style.fontWeight = 'bold';
            badgeDesconto.style.fontSize = '0.85rem';
            document.querySelector('.info-compra').prepend(badgeDesconto);
        }
        
        
        if (quantidadeDesejada > estoqueAtual) {
            alert(`Quantidade máxima disponível em estoque: ${estoqueAtual}`);
            quantidadeDesejada = estoqueAtual;
            inputQtd.value = estoqueAtual;
        }

        let valorUnitarioFinal = valorUnitarioOriginal;
        let valorDescontoTotal = 0;
        let textoDescontoNota = "R$ 0,00";

        
        if (estoqueAtual <= 20) {
            const descontoUnitario = valorUnitarioOriginal * 0.33;
            valorUnitarioFinal = valorUnitarioOriginal - descontoUnitario;
            valorDescontoTotal = descontoUnitario * quantidadeDesejada;
            
            badgeDesconto.textContent = `🔥 Preço promocional: 33% OFF (Restam apenas ${estoqueAtual} unidades!)`;
            textoDescontoNota = `- R$ ${valorDescontoTotal.toFixed(2).replace('.', ',')} (33% OFF Estoque)`;
        } else {
            badgeDesconto.textContent = '';
            if (formaPagamento === 'pix') {
                valorDescontoTotal = (valorUnitarioOriginal * quantidadeDesejada) * 0.05;
                textoDescontoNota = `- R$ ${valorDescontoTotal.toFixed(2).replace('.', ',')} (Pix 5%)`;
            }
        }

        const subtotal = valorUnitarioFinal * quantidadeDesejada;
        
        const valorFinal = estoqueAtual <= 20 ? subtotal : (subtotal - valorDescontoTotal);

        
        document.getElementById('nfNome').textContent = produtoEncontrado.nome;
        document.getElementById('nfPrecoUnitario').textContent = `R$ ${valorUnitarioFinal.toFixed(2).replace('.', ',')}`;
        document.getElementById('nfQtd').textContent = quantidadeDesejada;
        document.getElementById('nfDesconto').textContent = textoDescontoNota;
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