// Inicialização e gerenciamento do carrinho de compras
document.addEventListener('DOMContentLoaded', function() {
  // Injetar os componentes do carrinho no DOM
  injectCartComponents();
  
  // Inicializar o carrinho
  const cart = new ShoppingCart();
  
  // Adicionar event listeners para os botões de adicionar ao carrinho
  setupAddToCartButtons(cart);
  
  // Configurar os controles do carrinho
  setupCartControls(cart);
});

// Injetar os componentes HTML do carrinho no DOM
function injectCartComponents() {
  fetch('cart-components.html')
    .then(response => response.text())
    .then(html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div);
      
      // Após injetar os componentes, configurar os event listeners
      setupCartToggle();
    })
    .catch(error => {
      console.error('Erro ao carregar componentes do carrinho:', error);
      
      // Fallback: injetar diretamente no DOM
      const cartHTML = `
        <div class="cart-toggle" id="cart-toggle">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count" id="cart-count">0</span>
        </div>
        
        <div class="cart-container" id="cart-container">
          <div class="cart-header">
            <h3>Seu Carrinho</h3>
            <button class="close-cart" id="close-cart">&times;</button>
          </div>
          
          <div class="cart-items" id="cart-items">
            <div class="empty-cart">Seu carrinho está vazio</div>
          </div>
          
          <div class="cart-footer">
            <div class="cart-total-container">
              <span>Total:</span>
              <span class="cart-total-value" id="cart-total">R$ 0,00</span>
            </div>
            
            <div class="cart-actions">
              <button class="cart-action-btn clear-cart-btn" id="clear-cart">Limpar</button>
              <button class="cart-action-btn checkout-btn" id="checkout">Finalizar Pedido</button>
            </div>
          </div>
        </div>
        
        <div class="overlay" id="cart-overlay"></div>
      `;
      
      const div = document.createElement('div');
      div.innerHTML = cartHTML;
      document.body.appendChild(div);
      
      setupCartToggle();
    });
}

// Configurar o toggle do carrinho
function setupCartToggle() {
  const cartToggle = document.getElementById('cart-toggle');
  const cartContainer = document.getElementById('cart-container');
  const closeCart = document.getElementById('close-cart');
  const overlay = document.getElementById('cart-overlay');
  
  if (cartToggle && cartContainer && closeCart && overlay) {
    // Abrir o carrinho
    cartToggle.addEventListener('click', function() {
      cartContainer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Impedir rolagem
    });
    
    // Fechar o carrinho
    closeCart.addEventListener('click', function() {
      cartContainer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Permitir rolagem
    });
    
    // Fechar o carrinho ao clicar no overlay
    overlay.addEventListener('click', function() {
      cartContainer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Permitir rolagem
    });
  }
}

// Configurar os botões de adicionar ao carrinho
function setupAddToCartButtons(cart) {
  const addButtons = document.querySelectorAll('.add-button');
  
  addButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      const menuItem = this.closest('.menu-item');
      const itemName = menuItem.querySelector('h4').textContent;
      const itemPrice = menuItem.querySelector('.price').textContent;
      const itemId = itemName.split(')')[0].trim(); // Usar o número do item como ID
      
      // Adicionar ao carrinho
      cart.addItem(itemId, itemName, itemPrice);
      
      // Feedback visual
      this.classList.add('added');
      setTimeout(() => {
        this.classList.remove('added');
      }, 300);
      
      // Abrir o carrinho automaticamente na primeira adição
      if (cart.items.length === 1) {
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
          cartToggle.click();
        }
      }
    });
  });
}

// Configurar os controles do carrinho
function setupCartControls(cart) {
  // Limpar carrinho
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      cart.clearCart();
    });
  }
  
  // Finalizar pedido
  const checkoutBtn = document.getElementById('checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.items.length === 0) return;
      
      // Preparar mensagem para WhatsApp
      let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
      
      cart.items.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.name} - ${cart.formatPrice(item.price)} x${item.quantity} = ${cart.formatPrice(item.price * item.quantity)}\n`;
      });
      
      mensagem += `\nTotal: ${cart.formatPrice(cart.getTotal())}`;
      
      // Codificar a mensagem para URL
      const mensagemCodificada = encodeURIComponent(mensagem);
      
      // Abrir WhatsApp com a mensagem
      window.open(`https://wa.me/+5534998171930?text=${mensagemCodificada}`, '_blank');
      
      // Opcional: limpar o carrinho após finalizar o pedido
      // cart.clearCart();
    });
  }
  
  // Inicializar a UI do carrinho
  cart.updateCartUI();
}
