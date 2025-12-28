const BOT_TOKEN = "8077484017:AAHesSbIXkI-G-ZoHpgPQgRma03P31tqkWU";
const CHAT_ID = "883840916";

let PAYMENT_CONTEXT = null;

/* ===================== КОШИК ===================== */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const el = document.getElementById("cart-count");
    if (el) {
        el.textContent = cart.length > 0 ? `(${cart.length})` : "";
    }
}

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

    totalEl.textContent = cart.reduce((s, i) => s + i.price, 0) + " грн";
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
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

/* ===================== МАСКА ТЕЛЕФОНУ ===================== */

function formatPhone(e) {
    let v = e.target.value.replace(/\D/g, "");
    if (!v.startsWith("38")) v = "38" + v;
    if (v.length > 12) v = v.slice(0, 12);

    let r = "38";
    if (v.length > 2) r += "(" + v.slice(2, 5);
    if (v.length >= 5) r += ")";
    if (v.length > 5) r += " " + v.slice(5, 8);
    if (v.length > 8) r += "-" + v.slice(8, 10);
    if (v.length > 10) r += "-" + v.slice(10, 12);

    e.target.value = r;
}

/* ===================== НОВА ПОШТА (np.json) ===================== */

let NP_DATA = null;

function loadNPFromJSON() {
    fetch("/monal-glass-v2/np.json")
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            if (!data || !Object.keys(data).length) return;
            NP_DATA = data;
            initCityAutocomplete();
        })
        .catch(err => {
            console.warn("Не вдалося завантажити np.json", err);
        });
}

function initCityAutocomplete() {
    const input = document.getElementById("np-city-input");
    const list = document.getElementById("np-city-list");

    if (!input || !list || !NP_DATA) return;

    const cities = Object.keys(NP_DATA).sort((a, b) => {
        if (a === "Київ") return -1;
        if (b === "Київ") return 1;
        return a.localeCompare(b, "uk");
    });

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase().trim();
        list.innerHTML = "";

        if (!value) {
            list.style.display = "none";
            return;
        }

        const matches = cities.filter(c =>
            c.toLowerCase().startsWith(value)
        ).slice(0, 15);

        if (!matches.length) {
            list.style.display = "none";
            return;
        }

        matches.forEach(city => {
            const div = document.createElement("div");
            div.className = "autocomplete-item";
            div.textContent = city;
            div.onclick = () => {
                input.value = city;
                list.style.display = "none";
                fillWarehouses(city);
            };
            list.appendChild(div);
        });

        list.style.display = "block";
    });

    document.addEventListener("click", e => {
        if (!list.contains(e.target) && e.target !== input) {
            list.style.display = "none";
        }
    });
}

function fillWarehouses(city) {
    const select = document.getElementById("np-warehouse");
    select.innerHTML = `<option value="">Оберіть відділення / поштомат</option>`;
    select.disabled = true;

    if (!NP_DATA || !NP_DATA[city]) return;

    const filtered = NP_DATA[city].filter(w => {
        const s = w.toLowerCase();
        return (
            (s.includes("відділення") || s.includes("поштомат")) &&
            !s.includes("вантаж") &&
            !s.includes("склад") &&
            !s.includes("термінал") &&
            !s.includes("служб")
        );
    });

    if (filtered.length === 0) return;

    filtered.forEach(w => {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });

    select.disabled = false;
}

function toggleManualNP() {
    const manual = document.getElementById("np-manual");
    const select = document.getElementById("np-warehouse");
    const hint   = document.getElementById("np-manual-hint");

    if (!manual || !select || !hint) return;

    const manualVisible = manual.style.display === "block";

    if (!manualVisible) {
        // показуємо ручне поле
        manual.style.display = "block";
        hint.style.display = "block";
        manual.focus();

        select.style.display = "none";
        select.value = "";
        select.disabled = true;
    } else {
        // повертаємо select
        manual.style.display = "none";
        hint.style.display = "none";
        manual.value = "";

        select.style.display = "block";
        select.disabled = false;
    }
}


/* ===================== ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===================== */
function submitOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.length) {
        alert("Кошик порожній");
        return;
    }

    const last  = document.getElementById("inp-last")?.value.trim() || "";
    const first = document.getElementById("inp-first")?.value.trim() || "";
    const phone = document.getElementById("inp-phone")?.value.trim() || "";
    const city  = document.getElementById("np-city-input")?.value.trim() || "";

    const npSelectEl = document.getElementById("np-warehouse");
    const npManualEl = document.getElementById("np-manual");

    const npSelect = npSelectEl ? npSelectEl.value : "";
    const npManual = npManualEl ? npManualEl.value.trim() : "";

    const np = npManual
        ? `✍️ ВРУЧНУ: ${npManual}`
        : npSelect;

    const pay = document.querySelector("input[name='pay']:checked");

    if (!last || !first || !phone || !city || !np || !pay) {
        alert("Заповніть всі поля");
        return;
    }

    if (!/^38\(0\d{2}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone)) {
        alert("Телефон у форматі 38(0XX)XXX-XX-XX");
        return;
    }

    const orderId = Date.now().toString().slice(-6);
    const total = cart.reduce((s, i) => s + i.price, 0);

    let payNow = total;
    let paymentLabel = "100% оплата";

    if (pay.value === "Передплата 150 грн") {
        payNow = 150;
        paymentLabel = "Передплата 150 грн, решта при отриманні";
    }

    const itemsText = cart
        .map(i => `• ${i.label ? `[${i.label}] ` : ""}${i.name} — ${i.price} грн`)
        .join("\n");

    const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${last} ${first}
📞 ${phone}
🏙 ${city}
📦 НП: ${np}

💳 Оплата: ${paymentLabel}
💸 До оплати зараз: ${payNow} грн

🛒 Товари:
${itemsText}

💰 Загальна сума: ${total} грн
`;

    // ⛔ НЕ відправляємо одразу
    PAYMENT_CONTEXT = {
        orderId,
        text
    };

    // ✅ ВІДКРИВАЄМО МОДАЛКУ
    openPaymentModal(orderId, payNow);
}



/* ===================== МОДАЛКА ОПЛАТИ ===================== */
function openPaymentModal(orderId, payNow) {
    const modal = document.getElementById("payment-modal");
    const orderEl = document.getElementById("pay-order-id");
    const amountEl = document.getElementById("pay-amount");

    if (!modal || !orderEl || !amountEl) {
        alert("Помилка: вікно оплати не знайдено");
        return;
    }

    orderEl.textContent = orderId;
    amountEl.textContent = payNow;

    modal.style.display = "flex";
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) modal.style.display = "none";
}

function confirmPayment() {
    if (!PAYMENT_CONTEXT) return;

    sendOrderToTelegram(PAYMENT_CONTEXT);
    PAYMENT_CONTEXT = null;

    closePaymentModal();
}


/* ===================== ОПЛАТА ЗАМОВЛЕННЯ ===================== */
function sendOrderToTelegram(ctx) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: ctx.text,
            parse_mode: "Markdown"
        })
    }).then(() => {
        clearCart();
        document.getElementById("checkout").innerHTML =
            `<h2>Ваше замовлення №${ctx.orderId} оформлено.</h2>
             <p>Очікуйте дзвінок оператора.</p>`;
    });
}

/* ===================== INIT ===================== */

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
    loadNPFromJSON();

    const phoneInput = document.getElementById("inp-phone");
    if (phoneInput) phoneInput.addEventListener("input", formatPhone);
});

/* ===================== DISCOVERY SET ===================== */

const DISCOVERY_PRICE = 395;
let discoverySet = [];

document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("add-to-set")) return;

    const product = e.target.closest(".product-text");
    if (!product) return;

    const name = product.querySelector(".product-title").innerText;

    // якщо вже є — просто ігноруємо
    if (discoverySet.includes(name)) return;

    // жорстке обмеження
    if (discoverySet.length >= 4) {
        updateDiscoveryHint("Сет містить 4 аромати. Видаліть один, щоб додати інший.");
        return;
    }

    discoverySet.push(name);
    updateDiscoveryUI();
});

function updateDiscoveryUI() {
    const list = document.getElementById("discovery-list");
    const count = document.getElementById("discovery-count");
    const hint = document.getElementById("discovery-hint");
    const buyBtn = document.getElementById("buy-discovery-btn");

    list.innerHTML = "";

    discoverySet.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
    });

    count.textContent = discoverySet.length;

    if (discoverySet.length < 4) {
        hint.textContent = `Оберіть ще ${4 - discoverySet.length} аромат(и)`;
        buyBtn.disabled = true;
        buyBtn.innerText = `Купити сет · ${DISCOVERY_PRICE} грн`;
        return;
    }

    // рівно 4
    hint.textContent = "Discovery set сформовано";
    buyBtn.disabled = false;
    buyBtn.innerText = `Купити сет · ${DISCOVERY_PRICE} грн`;
}

function updateDiscoveryHint(text) {
    const hint = document.getElementById("discovery-hint");
    if (hint) hint.textContent = text;
}

/* ===== КУПИТИ DISCOVERY SET ===== */

document.getElementById("buy-discovery-btn")?.addEventListener("click", () => {
    if (discoverySet.length !== 4) return;

    addToCart(
        `Discovery set (${discoverySet.join(", ")})`,
        DISCOVERY_PRICE,
        "Discovery set"
    );

    // очищаємо
    discoverySet = [];
    updateDiscoveryUI();
});

/* ===================== INLINE DISCOVERY SET ===================== */

const DISCOVERY_PRICE = 395;
const MAX_ITEMS = 8;

/* Ініціалізація для кожного товару */
document.querySelectorAll(".product-row").forEach(row => {
    const addBtn = row.querySelector(".add-to-set");
    const panel = row.querySelector(".inline-discovery");

    if (!addBtn || !panel) return;

    const list = panel.querySelector(".inline-discovery-list");
    const hint = panel.querySelector(".inline-discovery-hint");
    const buyBtn = panel.querySelector(".inline-discovery-buy");

    let items = [];

    addBtn.addEventListener("click", () => {
        if (items.length >= MAX_ITEMS) {
            hint.textContent = "Максимум 2 сети (8 ароматів)";
            hint.style.opacity = "0.7";
            return;
        }

        const name = row.querySelector(".product-title").innerText;
        items.push(name);
        render();
    });

    function render() {
        list.innerHTML = "";

        items.forEach((name, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${name}</span>
                <button data-index="${index}">×</button>
            `;
            list.appendChild(li);
        });

        list.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", e => {
                const i = e.target.dataset.index;
                items.splice(i, 1);
                render();
            });
        });

        if (items.length === 0) {
            hint.textContent = "Сет містить 4 аромати";
            buyBtn.disabled = true;
            return;
        }

        if (items.length % 4 !== 0) {
            hint.textContent = "Сет містить 4 аромати — додайте або видаліть";
            hint.style.color = "#b46a6a";
            buyBtn.disabled = true;
            return;
        }

        const sets = items.length / 4;
        hint.textContent = `Готово: ${sets} сет(и)`;
        hint.style.color = "#d6cdbf";

        buyBtn.disabled = false;
        buyBtn.innerText = `Додати ${sets} сет · ${sets * DISCOVERY_PRICE} грн`;

        buyBtn.onclick = () => {
            addToCart("Discovery set", sets * DISCOVERY_PRICE, `${sets} сет(и)`);
            items = [];
            render();
        };
    }

    render();
});
