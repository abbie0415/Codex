const products = [
  {
    id: "uji-matcha",
    name: "Uji Ceremonial Matcha",
    category: "Tea",
    price: 38,
    description: "Stone-milled green tea powder from Kyoto with a smooth, vivid finish.",
    image: "assets/iced-matcha.webp"
  },
  {
    id: "mino-bowl",
    name: "Mino Ware Rice Bowl",
    category: "Ceramics",
    price: 32,
    description: "A glazed ceramic bowl inspired by traditional Mino tableware.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "washi-notebook",
    name: "Washi Paper Notebook",
    category: "Stationery",
    price: 18,
    description: "A lay-flat notebook with textured Japanese paper for ink and pencil.",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "furoshiki-wrap",
    name: "Cotton Furoshiki Wrap",
    category: "Textiles",
    price: 24,
    description: "Reusable wrapping cloth for gifts, lunch boxes, and small carries.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "yuzu-ponzu",
    name: "Yuzu Ponzu Sauce",
    category: "Pantry",
    price: 16,
    description: "Bright citrus soy sauce for noodles, grilled fish, tofu, and salads.",
    image: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bamboo-whisk",
    name: "Bamboo Matcha Whisk",
    category: "Tea",
    price: 22,
    description: "A chasen-style whisk for preparing smooth bowls of matcha.",
    image: "https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tenugui-towel",
    name: "Tenugui Cotton Towel",
    category: "Textiles",
    price: 20,
    description: "Lightweight cotton cloth for kitchen use, wrapping, and travel.",
    image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kintsugi-kit",
    name: "Kintsugi Repair Kit",
    category: "Ceramics",
    price: 46,
    description: "A beginner-friendly repair kit inspired by golden joinery traditions.",
    image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=900&q=80"
  }
];

const bundle = {
  id: "kyoto-tea-bundle",
  name: "Kyoto Tea Ritual Bundle",
  category: "Tea",
  price: 76,
  description: "Matcha, bamboo whisk, and ceramic bowl for a complete tea setup.",
  image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80"
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
const contactForm = document.querySelector(".contact-form");
const checkoutButton = document.querySelector("#checkoutButton");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR"
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
        <button type="button" data-qty-id="${product.id}" data-delta="-1" aria-label="Decrease quantity">-</button>
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

function saveCheckoutCart() {
  const checkoutItems = [...state.cart.values()].map(({ product, quantity }) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity
  }));

  localStorage.setItem("sakuraCheckoutCart", JSON.stringify(checkoutItems));
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

checkoutButton.addEventListener("click", () => {
  if (state.cart.size === 0) return;

  saveCheckoutCart();
  window.location.href = "payment.html";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  button.textContent = "Message ready";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideCart();
});

renderProducts();
renderCart();
