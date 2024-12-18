const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("adrress-warn")
const contactInput = document.getElementById("contact")
const contactWarnEmpty = document.getElementById("contact-warn-empty")
const contactWarnincomplete = document.getElementById("contact-warn-incomplete")
const comentario = document.getElementById("comentario")

// incompleto

//Lista do carrinho
let cart = [];


// Abrir o Modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "flex"
})
//

// Funções para fechar o Modal

// Fechar o Modal quando clicar fora
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
// Fechar o Modal quando clicar no Botão
closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
})
//

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // Adicionar no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        // se o item ja existe aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

// Atualiza o carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0

    cart.forEach((item, index) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-5", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between shadow-md py-2 px-3">
            <div>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-bold mt-1">${item.name}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div class="flex flex-col">
            <button class="btn-add text-center bg-green-600 hover:bg-green-500 rounded text-white px-5 py-1 flex items-center justify-center text-xl font-bold">+</button>
            <button class="btn-remove bg-red-600 hover:bg-red-500 rounded text-white text-center mt-5 px-5 py-1 flex items-center justify-center text-xl font-bold" data-name="${item.name}">
                -
            </button>
            </div>
        </div>
        `

        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)

    });

    // Adicionando Quantidade pelo botão " + " do Modal
    document.querySelectorAll(".btn-add").forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            cart[idx].quantity += 1;
            updateCartModal();
        });
    });
    //

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerText = cart.length;

}


// Remover Quantidade pelo botão " - " do Modal
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-remove")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
});
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}

//

// Finalizar pedido
checkoutBtn.addEventListener("click", () => {

    //Verifica se está aberto

    // const isOpen = checkRestaurantOpen();
    // if(!isOpen) {
    //     alert("RESTAURANTE FECHADO NO MOMENTO!")
    //     return;
    // }

    // Verificar se o carrinho ou endereço está vazio
    if (cart.length === 0 || addressInput.value === "") {
        if (addressInput.value === "") {
            addressWarn.classList.remove("hidden");
        }
        return;
    }

    // Capturar a forma de pagamento selecionada
    const selectedPayment = document.querySelector("input[name='payment']:checked");
    if (!selectedPayment) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }
    const paymentMethod = selectedPayment.value;

    // Calcular o total do pedido
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Gerar a lista de itens do carrinho
    const mensagemOla = 'Olá, estou vindo pelo site e gostaria de fazer o seguinte pedido: '
    const cartItems = cart.map((item) => {
        return `${item.name} - Quantidade: (${item.quantity}) | `; //Preço: R$${item.price.toFixed(2)} |
    }).join("") + ` 
        Total: R$${total.toFixed(2)}`;

    // Criar a mensagem final
    const message = encodeURIComponent(`${mensagemOla}
Pedido: ${cartItems}
Endereço: ${addressInput.value}
Forma de Pagamento: ${paymentMethod}

Comentário: ${comentario.value}`);
    const phone = "COLOQUE O CONTATO DO QUAL DESEJA ENVIAR O PEDIDO";

    // Abrir o WhatsApp com a mensagem
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar o carrinho e campos
    cart = [];    
    updateCartModal();
    window.location.reload(true);
});



// Verificar a hora e manipular o card do horario
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}