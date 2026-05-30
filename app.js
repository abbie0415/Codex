const products = [
  {
    id: "ceramic-lamp",
    name: "Ceramic Table Lamp",
    category: "Home",
    price: 68,
    description: "A warm matte lamp with a linen shade for soft evening light.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "canvas-tote",
    name: "Structured Canvas Tote",
    category: "Travel",
    price: 74,
    description: "A sturdy daily tote with reinforced handles and interior pockets.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "linen-shirt",
    name: "Washed Linen Shirt",
    category: "Style",
    price: 56,
    description: "Breathable linen with a relaxed cut and natural texture.",
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "stoneware-mug",
    name: "Stoneware Mug Set",
    category: "Home",
    price: 42,
    description: "Four hand-finished mugs with an easy stackable profile.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "travel-bottle",
    name: "Insulated Travel Bottle",
    category: "Wellness",
    price: 34,
    description: "Keeps drinks cold or warm with a leak-resistant steel body.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "desk-tray",
    name: "Walnut Desk Tray",
    category: "Home",
    price: 39,
    description: "A low-profile organizer for keys, cards, pens, and cables.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "day-pack",
    name: "Compact Day Pack",
    category: "Travel",
    price: 89,
    description: "A clean weather-resistant backpack for commuting and short trips.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "knit-scarf",
    name: "Merino Knit Scarf",
    category: "Style",
    price: 48,
    description: "A lightweight merino layer with a soft hand feel.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80"
  }
];

const bundle = {
  id: "weekend-bundle",
  name: "Weekend Carry Set",
  category: "Travel",
  price: 129,
  description: "Tote, bottle, and pouch bundled for quick getaways.",
  image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=900&q=80"
};

const state = {
  activeCategory: "All",
  search: "",
  cart: new Map()
};

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const cartButton = document.querySelector("#cartButton");
const cartDrawer = document.querySelector("#cartDrawer");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const addFeatured = document.querySelector("#addFeatured");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function filteredProducts() {
  const term = state.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = state.activeCategory === "All" || product.category === state.activeCategory;
    const matchesSearch = !term || [product.name, product.category, product.description].some((field) =>
      field.toLowerCase().includes(term)
    );

    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="empty-results">No products match your search.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="product-body">
        <div class="product-meta">
          <h3>${product.name}</h3>
          <span>${formatPrice(product.price)}</span>
        </div>
        <p>${product.description}</p>
        <button class="add-button" type="button" data-product-id="${product.id}">Add to cart</button>
      </div>
    </article>
  `).join("");
}

function addToCart(product) {
  const current = state.cart.get(product.id);
  state.cart.set(product.id, {
    product,
    quantity: current ? current.quantity + 1 : 1
  });
  renderCart();
}

function updateQuantity(productId, delta) {
  const current = state.cart.get(productId);
  if (!current) return;

  const quantity = current.quantity + delta;
  if (quantity <= 0) {
    state.cart.delete(productId);
  } else {
    state.cart.set(productId, { ...current, quantity });
  }

  renderCart();
}

function renderCart() {
  const entries = [...state.cart.values()];
  const itemCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(total);
  cartEmpty.hidden = entries.length > 0;

  cartItems.innerHTML = entries.map(({ product, quantity }) => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)}</p>
      </div>
      <div class="qty-controls" aria-label="Quantity controls for ${product.name}">
        <button type="button" data-qty-id="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
        <span>${quantity}</span>
        <button type="button" data-qty-id="${product.id}" data-delta="1" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function hideCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest(".tab");
  if (!tab) return;

  state.activeCategory = tab.dataset.category;
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button === tab);
  });
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;

  const product = products.find((item) => item.id === button.dataset.productId);
  addToCart(product);
  openCart();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-qty-id]");
  if (!button) return;

  updateQuantity(button.dataset.qtyId, Number(button.dataset.delta));
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) hideCart();
});
addFeatured.addEventListener("click", () => {
  addToCart(bundle);
  openCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideCart();
});

renderProducts();
renderCart();
