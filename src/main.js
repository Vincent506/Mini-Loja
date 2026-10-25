// 1. Busca os produtos comprados no localStorage do navegador
const produtosComprados = JSON.parse(localStorage.getItem('produtosComprados')) || [];

// 2. Percorre todos os cards da página inicial
const produtosNaTela = document.querySelectorAll(".produto");

produtosNaTela.forEach((card) => {
    const idCard = card.getAttribute("data-id");

    // Se o ID deste card estiver na lista de comprados, esconde ele da vitrine
    if (produtosComprados.includes(idCard)) {
        card.style.display = 'none';
    }
});

produtosNaTela.forEach((linkProduto) => {
    linkProduto.addEventListener("click", () => {
        const id = linkProduto.getAttribute("data-id");
        
        window.location.href = `pages/produto.html?id=${id}`;
    });
});