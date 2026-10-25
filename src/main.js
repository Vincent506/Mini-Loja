const produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')) || [];
const estoqueLocal = JSON.parse(localStorage.getItem('estoqueProdutos')) || {};
const produtosNaTela = document.querySelectorAll(".produto");

produtosNaTela.forEach((card) => {
    const idCard = card.getAttribute("data-id");

        
    if (produtosComprados.includes(idCard)) {
        card.style.display = 'none';
        return;
    }

    const quantidadeAtual = estoqueLocal[idCard];

    if (quantidadeAtual!==undefined && quantidadeAtual <=20) {
        if (!card.querySelector('.aviso-estoque')) {
            const aviso = document.createElement('div');
            aviso.className = 'aviso-estoque';
            aviso.style.color = '#d32f2f';
            aviso.style.fontSize = '0.85rem';
            aviso.style.fontWeight = 'bold';
            aviso.style.marginTop = '6px';
            aviso.textContent = `🔥 Ultimas ${quantidadeAtual} unidades! (33% OFF)`;
            card.appendChild(aviso);
        }
    }
});

produtosNaTela.forEach((linkProduto) => {
    linkProduto.addEventListener("click", () => {
        const id = linkProduto.getAttribute("data-id");
        
        window.location.href = `pages/produto.html?id=${id}`;
    });
});