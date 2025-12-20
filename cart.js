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
            <span>${item.label ? item.label + " " : ""}${item.name}</span>
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

    const last = document.getElementById("inp-last").value.trim();
    const first = document.getElementById("inp-first").value.trim();
    const phone = document.getElementById("inp-phone").value.trim();
    const city = document.getElementById("city-input").value.trim();
    const np = document.getElementById("warehouse-select").value;
    const pay = document.querySelector("input[name='pay']:checked");

    if (!last || !first || !phone || !city || !np || !pay) {
        return alert("Заповніть всі поля");
    }
    
    const orderId = Date.now().toString().slice(-6);
    const total = cart.reduce((sum, i) => sum + i.price, 0);

    const itemsText = cart
        .map(i => `• ${i.label ? `[${i.label}] ` : ""}${i.name} — ${i.price} грн`)
        .join('\n');

    const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${last} ${first}
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

const NP_KEY = "0447e2217cd16e6fabda5e3536506922323aff2c";

async function searchCity() {
    const query = document.getElementById("city-input").value.trim();
    const box = document.getElementById("city-results");

    if (query.length < 3) {
        box.innerHTML = "";
        return;
    }

    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            apiKey: NP_KEY,
            modelName: "AddressGeneral",
            calledMethod: "getSettlements",
            methodProperties: {
                FindByString: query,
                Limit: 20
            }
        })
    });

    const data = await res.json();
    const list = data?.data || [];

    box.innerHTML = list
        .slice(0, 10)
        .map(c => `
            <div class="np-item"
                 onclick="selectCity('${c.Ref}','${c.Description}')">
                 ${c.Description} (${c.AreaDescription})
            </div>
        `)
        .join("");
}


function selectCity(ref, name) {
    document.getElementById("city-input").value = name;
    document.getElementById("city-results").innerHTML = "";
    loadWarehouses(ref);
}

async function loadWarehouses(cityRef) {
    const sel = document.getElementById("warehouse-select");
    sel.innerHTML = `<option>Завантаження…</option>`;

    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            apiKey: NP_KEY,
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: { CityRef: cityRef }
        })
    });

    const data = await res.json();
    const list = data?.data || [];

    sel.innerHTML = list.length
        ? list.map(w => `<option value="${w.Description}">${w.Description}</option>`).join("")
        : `<option>Немає відділень</option>`;
}
