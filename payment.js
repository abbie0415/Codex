const paymentItems = document.querySelector("#paymentItems");
const paymentEmpty = document.querySelector("#paymentEmpty");
const paymentTotal = document.querySelector("#paymentTotal");
const paymentItemCount = document.querySelector("#paymentItemCount");
const sendOrderEmail = document.querySelector("#sendOrderEmail");

function readCheckoutCart() {
  const params = new URLSearchParams(window.location.search);
  const cartFromUrl = params.get("cart");

  if (cartFromUrl) {
    try {
      const parsedCart = JSON.parse(decodeURIComponent(cartFromUrl));
      localStorage.setItem("sakuraCheckoutCart", JSON.stringify(parsedCart));
      return parsedCart;
    } catch (error) {
      console.warn("Could not read checkout cart from URL.", error);
    }
  }

  return JSON.parse(localStorage.getItem("sakuraCheckoutCart") || "[]");
}

const checkoutCart = readCheckoutCart().map((item) => ({
  ...item,
  price: Number(item.price) || 0,
  quantity: Number(item.quantity) || 0
}));
let currentEmailSubject = "";
let currentEmailBody = "";
let currentMailtoLink = "";
let currentGmailLink = "";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR"
  }).format(value);
}

function buildEmailBody(items, total) {
  const lines = items.map((item) => {
    const lineTotal = getLineTotal(item);
    return `${item.name} - ${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(lineTotal)}`;
  });

  return [
    "Hello,",
    "",
    "I would like to confirm this Sakura Goods order:",
    "",
    ...lines,
    "",
    `Total amount: ${formatPrice(total)}`,
    "Bank account: 1234",
    "",
    "Reminder: please attach your payment receipt before sending this email.",
    "",
    "Payment has been / will be made by bank transfer."
  ].join("\n");
}

function updateEmailLink(total) {
  currentEmailSubject = `Sakura Goods order - ${formatPrice(total)}`;
  currentEmailBody = buildEmailBody(checkoutCart, total);
  currentMailtoLink = `mailto:lost0415@hotmail.com?subject=${encodeURIComponent(currentEmailSubject)}&body=${encodeURIComponent(currentEmailBody)}`;
  currentGmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=lost0415@hotmail.com&su=${encodeURIComponent(currentEmailSubject)}&body=${encodeURIComponent(currentEmailBody)}`;
}

function getTotal() {
  return checkoutCart.reduce((sum, item) => sum + getLineTotal(item), 0);
}

function getLineTotal(item) {
  return item.price * item.quantity;
}

function renderPaymentSummary() {
  const itemCount = checkoutCart.reduce((sum, item) => sum + item.quantity, 0);
  const total = getTotal();

  paymentItemCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  paymentTotal.textContent = formatPrice(total);
  paymentEmpty.hidden = checkoutCart.length > 0;

  paymentItems.innerHTML = checkoutCart.map((item) => `
    <div class="payment-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>Unit price: ${formatPrice(item.price)}</p>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <strong>${formatPrice(getLineTotal(item))}</strong>
    </div>
  `).join("");

  updateEmailLink(total);
}

sendOrderEmail.addEventListener("click", () => {
  const emailWindow = window.open(currentGmailLink, "_blank", "noopener");

  if (!emailWindow) {
    window.location.href = currentMailtoLink;
  }
});

renderPaymentSummary();
