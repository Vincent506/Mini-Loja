async function iniciarHome() {
    try {
        const resposta = await fetch('src/produtos.json');
        const produtosDB = await resposta.json();

        const produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')) || [];
        const estoqueLocal = JSON.parse(localStorage.getItem('estoqueProdutos')) || {};

        const produtosNaTela = document.querySelectorAll(".produto");

        produtosNaTela.forEach((card) => {
            const idCard = card.getAttribute("data-id");
            const produtoInfo = produtosDB[idCard];

            if (produtosComprados.includes(idCard) || (estoqueLocal[idCard] !== undefined && estoqueLocal[idCard] <= 0)) {
                card.style.display = 'none';
                return;
            }

            const quantidadeAtual = estoqueLocal[idCard] !== undefined ? estoqueLocal[idCard] : (produtoInfo ? produtoInfo.quantidade : 100);

            if (quantidadeAtual <= 20 && produtoInfo) {
                const precoLimpo = produtoInfo.preco.replace("R$", "").replace(".", "").replace(",", ".").trim();
                const valorOriginal = parseFloat(precoLimpo) || 0;
                
                const valorDesconto = valorOriginal * 0.33;
                const valorFinal = valorOriginal - valorDesconto;

                let precoAntigo = card.querySelector('h5');
                precoAntigo.style.display = 'none';
                let elementoPreco = card.querySelector('.preco');
                if (!elementoPreco) {
                    elementoPreco = document.createElement('p');
                    elementoPreco.className = 'preco';
                    card.appendChild(elementoPreco);
                }

                elementoPreco.innerHTML = `
                    <span style="text-decoration: line-through; color: #888; font-size: 0.85rem;">${produtoInfo.preco}</span><br>
                    <strong style="color: #2e7d32;">R$ ${valorFinal.toFixed(2).replace('.', ',')}</strong>
                `;

                if (!card.querySelector('.aviso-estoque')) {
                    const aviso = document.createElement('div');
                    aviso.className = 'aviso-estoque';
                    aviso.style.color = '#d32f2f';
                    aviso.style.fontSize = '0.82rem';
                    aviso.style.fontWeight = 'bold';
                    aviso.style.marginTop = '4px';
                    aviso.textContent = `🔥 Últimas ${quantidadeAtual} unidades! (33% OFF)`;
                    card.appendChild(aviso);
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar os dados na página inicial:", erro);
    }
}

const produtosNaTela = document.querySelectorAll(".produto");
produtosNaTela.forEach((linkProduto) => {
    linkProduto.addEventListener("click", () => {
        const id = linkProduto.getAttribute("data-id");
        window.location.href = `pages/produto.html?id=${id}`;
    });
});

iniciarHome();