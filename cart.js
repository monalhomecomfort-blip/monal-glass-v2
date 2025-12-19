const BOT_TOKEN = "8231909798:AAH_lirUkv9a35yQSuXGzThAQhw6kXANAIw";
const CHAT_ID = "957205871";

function getCart() {
  return JSON.parse(localStorage.getItem("monal_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("monal_cart", JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  cart.push({ name, price });
  saveCart(cart);
  // alert("Додано в кошик!");
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function totalPrice() {
  return getCart().reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById("cart-list");
  const total = document.getElementById("cart-total");

  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = "<p>Кошик порожній</p>";
    total.textContent = "0 грн";
    return;
  }

  list.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>${item.price} грн</span>
      <button class="cart-remove" onclick="removeItem(${i})">X</button>
    </div>
  `).join("");

  total.textContent = totalPrice() + " грн";
}

function showCheckout() {
  document.getElementById("checkout").style.display = "block";
  window.scrollTo(0, document.body.scrollHeight);
}

function submitOrder() {
  const cart = getCart();
  if (cart.length === 0) return alert("Кошик порожній");

  const name = document.getElementById("inp-name").value;
  const phone = document.getElementById("inp-phone").value;
  const city = document.getElementById("inp-city").value;
  const np = document.getElementById("inp-np").value;
  const pay = document.querySelector("input[name='pay']:checked");

  if (!name || !phone || !city || !np || !pay) {
    return alert("Заповніть всі поля");
  }

  const orderId = Date.now().toString().slice(-6);

  const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${name}
📞 ${phone}
🏙 ${city}
📦 НП: ${np}
💳 Оплата: ${pay.value}

🛒 Товари:
${cart.map(i => `• ${i.name} — ${i.price} грн`).join("\n")}

💰 Сума: ${totalPrice()} грн
`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "Markdown"
    })
  }).then(() => {
    clearCart();
    document.getElementById("checkout").innerHTML =
      `<h2>Ваше замовлення №${orderId} оформлено.</h2>
       <p>Очікуйте дзвінок оператора.</p>`;
  });
}

document.addEventListener("DOMContentLoaded", renderCart);
