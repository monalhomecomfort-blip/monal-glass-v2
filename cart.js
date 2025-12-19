const BOT_TOKEN = "8231909798:AAH_lirUkv9a35yQSuXGzThAQhw6kXANAIw";
const CHAT_ID = "957205871";


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.length;
    const el = document.getElementById("cart-count");
    if (el) {
        el.textContent = count > 0 ? `(${count})` : "";
    }
}

updateCartCount();

function addToCart(name, price, label) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, label });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const list = document.getElementById("cart-list");
    const totalEl = document.getElementById("cart-total");

    if (!list || !totalEl) return;

    if (cart.length === 0) {
        list.innerHTML = "<p>Кошик порожній</p>";
        totalEl.textContent = "0 грн";
        return;
    }

    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.label ? `[${item.label}] ` : ""}${item.name}</span>
            <span>${item.price} грн</span>
            <button onclick="removeFromCart(${index})">X</button>
        </div>
    `).join("");

    const total = cart.reduce((sum, i) => sum + i.price, 0);
    totalEl.textContent = total + " грн";
}


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}


function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
}


function showCheckout() {
    document.getElementById("checkout").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}

function submitOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Кошик порожній");
        return;
    }

    const name = document.getElementById("inp-name").value.trim();
    const phone = document.getElementById("inp-phone").value.trim();
    const city = document.getElementById("inp-city").value.trim();
    const np = document.getElementById("inp-np").value.trim();
    const pay = document.querySelector("input[name='pay']:checked");

    if (!name || !phone || !city || !np || !pay) {
        alert("Заповніть всі поля");
        return;
    }

    const orderId = Date.now().toString().slice(-6);
    const total = cart.reduce((sum, i) => sum + i.price, 0);

    const itemsText = cart
        .map(i => `• ${i.label ? `[${i.label}] ` : ""}${i.name} — ${i.price} грн`)
        .join('\n');

    const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${name}
📞 ${phone}
🏙 ${city}
📦 НП: ${np}
💳 Оплата: ${pay.value}

🛒 Товари:
${itemsText}

💰 Сума: ${total} грн
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

document.addEventListener("DOMContentLoaded", updateCartCount);
document.addEventListener("DOMContentLoaded", renderCart);
