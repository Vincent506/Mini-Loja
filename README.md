# 🛍️ Mini-Loja

## 🖌️ Design da Mini-Loja

### Home Page
![Página-Principal](assets/fotosdosite/homePage.png)

### Detalhes do Produto
![Detalhes-Do-Produto](assets/fotosdosite/detalheSite.png)

### Pop-up de Compra
![Compra](/assets/fotosdosite/popupcompra.png)

## 💻 Sobre o Projeto
Esse projeto veio como um desafio proposto pelo programa Trilhas. No qual consiste em criar um site simples de compras de produtos. Nesse site eu pude implementar conceitos aprendidos nas aulas do trilhas, como por exemplo:

- Tags HTML: Nesse projeto temos uma tag `<a></a>` que serve para mudar de página;
- Estilização com CSS: Nesse projeto nos utilizamos `class`,`id` ou a própria tag para referenciar cada componente do `index.html` que vamos estilizar no nosso `style.css`, por exemplo queremos estilizar a `class="produto"` no arquivo CSS nos chamamos essa classe da seguinte maneira: `.produto{ regras de estilização aqui}`. Foi a parte do nosso prójeto que teve mais linhas em um único arquivo;
- Lógica no JavaScript: Essa foi a parte onde eu particularmente mais encontrei dificuldades. Principalmente na parte de pegar elementos do HTML para trabalhar nas nossas variaveis sejam elas `let` ou `const`. Nos nossos arquivos `main.js` e `detalhes.js` nos utilizamos para montar a lógica por tras dos preços, descontos aplicados á forma de pagamento, estoque limitado, desconto aplicado aos 20 ultimos produtos e a dinamica da página principal, página de produto e pop-up de compra é toda controlada por JavaScript.

### Páginas do Projeto:
Esse projeto foi feito com mais do que foi pedido. Era pra ser uma página com `prompt()` para selecionar o produto e `alert()` para informar quando a compra foi realizada. Mas eu quis incrementar. Para me ajudar eu usei o Google Gemini para me guiar no desenvolvimento.

O projeto é composto por 2 páginas `index.html` e `produto.html`, a primeira página mostra todos os produtos e a segunda mostra apenas o produto que a pessoa clicar. Ao acessar a página `produto.html` a pessoa vai ter acesso ao preço, uma imagem mais nítida do produto, uma lista com as formas de pagamento e um botão de compra. Ao clicar no botão de compra aparece um pop-up que no código tem o nome de `modalChekout` ele não é uma página html. Ele é uma `<div></div>` que aparece somente quando voce apertar o botão de comprar. Por fim, a rota normal de compra é `index.html -> produto.html -> <div id="modalCheckout"></div>` se a compra for finalizada ela retorna pra `index.html` se não ela pode sair do pop-up, utilizar o botão de voltar e ir para a página principal escolher outro produto.

## 🚀 Funcionalidades

As principais funcionalidades desse projeto estão nos arquivos .js: `detalhes.js` e `main.js`. As funções do `main.js` são: 

- `iniciarHome()`: /vou descrever mais futuramente

- `produtosNaTela`: não é uma função, mas sim uma variavel que monitora se o usuario clicou em algum dos links que leva até a página de `produto.html`.

As funções do arquivo `detalhes.js`:

- `carregarBancoDeDados()`:

- `iniciarLogicaDoProduto(estoqueLocal)`:

- `configurarModal(idProduto, produtoEncontrado, estoqueLocal)`:

- `carregarNotaFiscal`:


## 🛠️ Tecnologias Utilizadas


## 🔧 Como Rodar o Projeto

