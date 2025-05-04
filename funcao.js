let produtos = [
    { id: 1, nome: "Tênis Nike Air", preco: 399.90, imagem: "https://via.placeholder.com/300x200?text=Nike+Air" },
    { id: 2, nome: "Camiseta Oversized", preco: 89.90, imagem: "https://via.placeholder.com/300x200?text=Camiseta" },
    { id: 3, nome: "Calça Cargo Preta", preco: 159.90, imagem: "https://via.placeholder.com/300x200?text=Calca+Cargo" },
    { id: 4, nome: "Jaqueta Jeans", preco: 229.90, imagem: "https://via.placeholder.com/300x200?text=Jaqueta+Jeans" },
    { id: 5, nome: "Boné Preto", preco: 49.90, imagem: "https://via.placeholder.com/300x200?text=Bone+Preto" },
    { id: 6, nome: "Moletom Rosa", preco: 139.90, imagem: "https://via.placeholder.com/300x200?text=Moletom+Rosa" }
  ];
  

  let searchInput = document.getElementById('searchInput');
  let suggestions = document.getElementById('suggestions');
  let container = document.getElementById('productsContainer');
  let cartCount = document.getElementById('cartCount');

  function showSuggestions() {
    let value = searchInput.value.toLowerCase();
    let matched = produtos.filter(p => p.nome.toLowerCase().includes(value));
    suggestions.innerHTML = '';
    if (value && matched.length > 0) {
      matched.forEach(item => {
        let li = document.createElement('li');
        li.textContent = item.nome;
        li.className = 'list-group-item list-group-item-action';
        li.onmousedown = () => {
          searchInput.value = item.nome;
          suggestions.classList.add('d-none');
        };
        suggestions.appendChild(li);
      });
      suggestions.classList.remove('d-none');
    } else {
      suggestions.classList.add('d-none');
    }
  }

  searchInput.addEventListener('blur', () => {
    setTimeout(() => suggestions.classList.add('d-none'), 100);
  });

  function renderProducts(produtos) {
    container.innerHTML = '';
    produtos.forEach(produto => {
      let col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${produto.nome}</h5>
            <p class="text-danger fw-bold">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn btn-danger mt-auto" onclick="addToCart(${produto.id})">Adicionar ao carrinho</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = produtos.find(p => p.id === productId);
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) {
      cart[index].quantidade += 1;
    } else {
      cart.push({ ...item, quantidade: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.textContent = total;
  }

  renderProducts(produtos);
  updateCartCount();

  