// Estrutura de dados e lógica para o carrinho de compras
class ShoppingCart {
  constructor() {
    this.items = [];
    this.loadFromLocalStorage();
  }

  // Adicionar item ao carrinho
  addItem(id, name, price) {
    // Verificar se o item já existe no carrinho
    const existingItemIndex = this.items.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
      // Se o item já existe, incrementa a quantidade
      this.items[existingItemIndex].quantity += 1;
    } else {
      // Se o item não existe, adiciona ao carrinho
      this.items.push({
        id: id,
        name: name,
        price: this.parsePrice(price),
        quantity: 1
      });
    }
    
    this.saveToLocalStorage();
    this.updateCartUI();
  }

  // Remover item do carrinho
  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveToLocalStorage();
    this.updateCartUI();
  }

  // Atualizar quantidade de um item
  updateQuantity(id, quantity) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Se a quantidade for 0 ou menos, remove o item
        this.removeItem(id);
      } else {
        // Atualiza a quantidade
        this.items[itemIndex].quantity = quantity;
        this.saveToLocalStorage();
        this.updateCartUI();
      }
    }
  }

  // Incrementar quantidade de um item
  incrementQuantity(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      this.items[itemIndex].quantity += 1;
      this.saveToLocalStorage();
      this.updateCartUI();
    }
  }

  // Decrementar quantidade de um item
  decrementQuantity(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      if (this.items[itemIndex].quantity > 1) {
        this.items[itemIndex].quantity -= 1;
        this.saveToLocalStorage();
        this.updateCartUI();
      } else {
        this.removeItem(id);
      }
    }
  }

  // Limpar o carrinho
  clearCart() {
    this.items = [];
    this.saveToLocalStorage();
    this.updateCartUI();
  }

  // Calcular o total do carrinho
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Obter o número total de itens no carrinho
  getTotalItems() {
    return this.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  // Converter string de preço para número
  parsePrice(priceString) {
    // Remove "R$ " e substitui vírgula por ponto
    return parseFloat(priceString.replace('R$ ', '').replace(',', '.'));
  }

  // Formatar preço como string
  formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  // Salvar carrinho no localStorage
  saveToLocalStorage() {
    localStorage.setItem('robsFitCart', JSON.stringify(this.items));
  }

  // Carregar carrinho do localStorage
  loadFromLocalStorage() {
    const savedCart = localStorage.getItem('robsFitCart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
        this.items = [];
      }
    }
  }

  // Atualizar a interface do carrinho
  updateCartUI() {
    const cartContainer = document.getElementById('cart-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartItemsContainer) return;
    
    // Limpa o conteúdo atual
    cartItemsContainer.innerHTML = '';
    
    if (this.items.length === 0) {
      // Carrinho vazio
      cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
      cartContainer.classList.remove('has-items');
    } else {
      // Adiciona os itens ao carrinho
      cartContainer.classList.add('has-items');
      
      this.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${this.formatPrice(item.price)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrement" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increment" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-total">${this.formatPrice(item.price * item.quantity)}</div>
          <button class="remove-item" data-id="${item.id}">×</button>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
      
      // Adiciona event listeners para os botões
      document.querySelectorAll('.quantity-btn.decrement').forEach(btn => {
        btn.addEventListener('click', () => {
          this.decrementQuantity(btn.dataset.id);
        });
      });
      
      document.querySelectorAll('.quantity-btn.increment').forEach(btn => {
        btn.addEventListener('click', () => {
          this.incrementQuantity(btn.dataset.id);
        });
      });
      
      document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          this.removeItem(btn.dataset.id);
        });
      });
    }
    
    // Atualiza o total
    if (cartTotal) {
      cartTotal.textContent = this.formatPrice(this.getTotal());
    }
    
    // Atualiza o contador de itens
    if (cartCount) {
      const count = this.getTotalItems();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }
}

// Exporta a classe para uso global
window.ShoppingCart = ShoppingCart;
