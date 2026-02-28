let PAYMENT_CONTEXT = null;
let PAY_NOW_AMOUNT = 0;
let CERT_APPLIED_AMOUNT = 0;
let CERT_CODE_USED = null;

// ===================== PROMO ENGINE =====================

const PROMO = window.PROMO_CONFIG || null;
let PROMO_CODE = (localStorage.getItem("promo_code") || "").trim().toUpperCase();

function isPromoActive() {
    if (!PROMO || !PROMO.active) return false;

    if (!PROMO.start || !PROMO.end) return true;

    const now = new Date();
    const start = new Date(PROMO.start);
    const end = new Date(PROMO.end);

    return now >= start && now <= end;
}

function isExcludedItem(item) {
    const name = String(item?.name || "").toLowerCase();

    if (PROMO?.exclusions?.certificates &&
        (name.includes("сертиф") || String(item?.label || "").toLowerCase().includes("сертиф"))) {
        return true;
    }

    if (PROMO?.exclusions?.discovery &&
        (name.includes("discovery") || name.includes("діскавер"))) {
        return true;
    }

    if (PROMO?.exclusions?.tenMini &&
        (name.includes("ten mini") || name.includes("10х3"))) {
        return true;
    }

    return false;
}

function calcPromoDiscount(cart) {
    if (!isPromoActive()) return 0;
    if (!PROMO_CODE || !PROMO.codes.includes(PROMO_CODE)) return 0;

    let eligibleSum = 0;
    let hasNonExcluded = false;

    cart.forEach(item => {
        if (!isExcludedItem(item)) {
            hasNonExcluded = true;
            eligibleSum += (Number(item.price) || 0);
        }
    });

    // ❗ Якщо в кошику тільки виключення — знижка не працює
    if (!hasNonExcluded) return 0;

    return Math.min(PROMO.discount, eligibleSum);
}
/* ===================== КОШИК ===================== */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const text = cart.length > 0 ? `(${cart.length})` : "";

    // лічильник у десктоп-меню
    const navCount = document.getElementById("cart-count");
    if (navCount) navCount.textContent = text;

    // лічильник у мобільній іконці
    const mobileCount = document.querySelector(".mobile-cart-count");
    if (mobileCount) mobileCount.textContent = text;
}

function addToCart(name, price, label = "", items = null) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = { name, price, label };
    if (items) item.items = items;

    cart.push(item);
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

    const total = cart.reduce((s, i) => s + Number(i.price), 0);
    const promoDiscount = typeof calcPromoDiscount === "function"
        ? calcPromoDiscount(cart)
        : 0;

    let finalTotal = total - promoDiscount;
    if (finalTotal < 0) finalTotal = 0;

    if (promoDiscount > 0) {
        totalEl.innerHTML = `
            Загальна сума: ${total} грн<br>
            Промокод: −${promoDiscount} грн<br>
            <strong>${finalTotal} грн</strong>
        `;
    } else {
        totalEl.textContent = total + " грн";
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function clearCart() {
    // очищаємо кошик
    localStorage.removeItem("cart");

    // очищаємо промокод
    localStorage.removeItem("promo_code");
    PROMO_CODE = "";

    // очищаємо поле вводу і повідомлення
    const promoInput = document.getElementById("promo-input");
    const promoMessage = document.getElementById("promo-message");

    if (promoInput) promoInput.value = "";
    if (promoMessage) promoMessage.textContent = "";

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
    fetch("/np.json")
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

function applyCertificate() {
    const codeInput = document.getElementById("cert-code");
    const infoEl = document.getElementById("cert-info");

    if (!codeInput || !infoEl) return;

    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
        infoEl.textContent = "Введіть код сертифіката";
        return;
    }

    infoEl.textContent = "Перевірка сертифіката…";

    fetch("https://monal-mono-pay-production.up.railway.app/check-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.valid) {
            infoEl.textContent = "Сертифікат недійсний або вже використаний";
            return;
        }

        CERT_CODE_USED = code;
        CERT_APPLIED_AMOUNT = data.nominal;

        infoEl.innerHTML = `
            Сертифікат <strong>${code}</strong> застосовано.<br>
            Покриває: <strong>${data.nominal} грн</strong>
        `;

        recalcAfterCertificate();
    })
    .catch(() => {
        infoEl.textContent = "Помилка перевірки сертифіката";
    });
}


function recalcAfterCertificate() {
    const totalEl = document.getElementById("cart-total");
    if (!totalEl) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((s, i) => s + i.price, 0);

    const remaining = Math.max(0, total - CERT_APPLIED_AMOUNT);

    totalEl.innerHTML = `
        Загальна сума: ${total} грн<br>
        Сертифікат: −${CERT_APPLIED_AMOUNT} грн<br>
        <strong>До оплати: ${remaining} грн</strong>
    `;

    // 🔒 UX: якщо 0 грн — блокуємо вибір оплати
    const payInputs = document.querySelectorAll('input[name="pay"]');

    if (remaining === 0) {
        payInputs.forEach(input => {
            input.checked = false;
            input.disabled = true;
        });
    } else {
        payInputs.forEach(input => {
            input.disabled = false;
        });
    }
}


/* ===================== ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===================== */
function submitOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.length) {        
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

    // 🎁 Повідомлення покупцю, якщо в кошику є сертифікат
    const hasCertificate = cart.some(i => i.label === "Сертифікат");

    // 🎁 Тип сертифікату (електронний / фізичний)
    let certificateType = null;

    if (hasCertificate) {
        const certTypeInput = document.querySelector('input[name="certType"]:checked');
        certificateType = certTypeInput ? certTypeInput.value : "електронний";
    }


    if (hasCertificate) {
        const infoEl = document.getElementById("cert-info");
        if (infoEl) {
            infoEl.innerHTML += `
                <div style="margin-top:10px; color:#b00; font-size:14px;">
                    🎁 У кошику є подарунковий сертифікат.<br>
                    Оплата можлива лише 100%.
                </div>
            `;
        }
    }

    // ===== ЄДИНЕ місце розрахунку сум =====
    const total = cart.reduce((s, i) => s + Number(i.price), 0);

    // рахуємо знижку по промокоду
    const promoDiscount = typeof calcPromoDiscount === "function"
        ? calcPromoDiscount(cart)
        : 0;

    // після промокоду
    const afterPromo = Math.max(0, total - promoDiscount);

    // після сертифіката
    const remainingToPay = Math.max(0, afterPromo - CERT_APPLIED_AMOUNT);

    const pay = document.querySelector("input[name='pay']:checked");

    // 🎁 Якщо є сертифікат — тільки 100% оплата
    if (hasCertificate) {
        const prepayRadio = document.querySelector(
            "input[name='pay'][value='Передплата 150 грн']"
        );

        if (prepayRadio) {
            prepayRadio.checked = false;
            prepayRadio.disabled = true;
        }
    }
    
    // ❗ якщо 0 грн — спосіб оплати не обовʼязковий
    if (!last || !first || !phone || !city || !np || (remainingToPay > 0 && !pay)) {
        alert("Заповніть всі поля");
        return;
    }

    if (!/^38\(0\d{2}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone)) {
        alert("Телефон у форматі 38(0XX)XXX-XX-XX");
        return;
    }

    const orderId = Date.now().toString().slice(-6);

    const discoveryItemsRaw = localStorage.getItem("discoverySetItems");
    let discoveryItems = [];

    if (discoveryItemsRaw) {
        try {
            discoveryItems = JSON.parse(discoveryItemsRaw);
        } catch (e) {
            discoveryItems = [];
        }
    }

    let payNow = remainingToPay;  

    let paymentLabel =
        remainingToPay === 0
            ? "Оплачено сертифікатом"
            : "100% оплата";

    if (pay && pay.value === "Передплата 150 грн") {
        payNow = 150; 
        paymentLabel = "Передплата 150 грн";
    }


    const remainingAfterCertificate = Math.max(0, total - CERT_APPLIED_AMOUNT);

    let dueAmount = Math.max(0, remainingAfterCertificate - payNow);


    const itemsText = cart
        .map(i => {
            // DISCOVERY SET
            if (i.name.startsWith("Discovery set") && discoveryItems.length) {
                return (
                    `• ${i.name} — ${i.price} грн\n` +
                    discoveryItems.map(a => `   ↳ ${a}`).join("\n")
                );
            }

            // ЗВИЧАЙНІ ТОВАРИ
            return `• ${i.name} — ${i.price} грн`;
        })
        .join("\n");

    const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${last} ${first}
📞 ${phone}
🏙 ${city}
📦 НП: ${np}

💰 Загальна сума: ${total} грн
${promoDiscount > 0 ? `🏷 Промокод: −${promoDiscount} грн\n` : ""}
${(typeof CERT_CODE_USED === "string" && CERT_CODE_USED)
  ? `🎟 Сертифікат: ${CERT_CODE_USED} (−${CERT_APPLIED_AMOUNT} грн)\n`
  : ""}
💳 Сплачено: ${paymentLabel}
💸 До оплати: ${dueAmount} грн

🛒 Товари:
${itemsText}
`;

// ✅ Збираємо ВСІ сертифікати з кошика
const certificatesData = cart
  .filter(i => i.label === "Сертифікат")
  .map(i => ({
    nominal: i.price
    // type: ""  // додамо пізніше, коли зробиш вибір електронний/фізичний
  }));

PAYMENT_CONTEXT = {
  orderId,
  text,
  payNow,
  certificates: certificatesData.length ? certificatesData : null,
  usedCertificates: CERT_CODE_USED ? [CERT_CODE_USED] : [],
  certificateType,

  buyerName: last + " " + first,
  buyerPhone: phone,
  delivery: np,
  itemsText: itemsText,
  totalAmount: total,
  paidAmount: payNow,
  dueAmount: dueAmount,
  paymentLabel: paymentLabel
};

    PAY_NOW_AMOUNT = payNow;

    // ✅ ВІДКРИВАЄМО МОДАЛКУ
    openPaymentModal(orderId, payNow);
}

/* ===================== МОДАЛКА ПЕРЕВІРКИ ЗАМОВЛЕННЯ ===================== */
function openPaymentModal(orderId, payNow) {
    const modal   = document.getElementById("payment-modal");
    const orderEl = document.getElementById("pay-order-id");
    const amountEl = document.getElementById("pay-amount");

    if (!modal || !orderEl || !amountEl) {
        alert("Помилка: вікно перевірки не знайдено");
        return;
    }

    // номер замовлення і сума
    orderEl.textContent = orderId;
    amountEl.textContent = payNow;

    // ПІБ
    document.getElementById("check-name").textContent =
        document.getElementById("inp-last").value + " " +
        document.getElementById("inp-first").value;

    // телефон
    document.getElementById("check-phone").textContent =
        document.getElementById("inp-phone").value;

    // місто
    document.getElementById("check-city").textContent =
        document.getElementById("np-city-input").value;

    // Нова пошта
    const npManual = document.getElementById("np-manual").value;
    const npSelect = document.getElementById("np-warehouse").value;

    document.getElementById("check-np").textContent =
        npManual ? npManual : npSelect;

    // тип оплати
    const payChecked = document.querySelector("input[name='pay']:checked");

    document.getElementById("check-pay-type").textContent =
        payChecked
            ? payChecked.value
            : "Оплачено сертифікатом";

    modal.style.display = "flex";
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) modal.style.display = "none";
}

function goToPayment() {
  if (!PAYMENT_CONTEXT) return;

// 1) реєструємо замовлення
fetch("https://monal-mono-pay-production.up.railway.app/register-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderId: PAYMENT_CONTEXT.orderId,
    text: PAYMENT_CONTEXT.text,
    certificates: PAYMENT_CONTEXT.certificates || null,
    usedCertificates: PAYMENT_CONTEXT.usedCertificates || [],
    certificateType: PAYMENT_CONTEXT.certificateType || "електронний",

    buyerName: PAYMENT_CONTEXT.buyerName || "",
    buyerPhone: PAYMENT_CONTEXT.buyerPhone || "",
    delivery: PAYMENT_CONTEXT.delivery || "",
    itemsText: PAYMENT_CONTEXT.itemsText || "",
    totalAmount: PAYMENT_CONTEXT.totalAmount || "",
    paidAmount: PAYMENT_CONTEXT.paidAmount || "",
    dueAmount: PAYMENT_CONTEXT.dueAmount || "",
    paymentLabel: PAYMENT_CONTEXT.paymentLabel || ""
  })
})

  .then(res => {
    if (!res.ok) throw new Error("register-order failed");

    // 2) є що платити → mono
    if (PAY_NOW_AMOUNT > 0) {
      startOnlinePayment(PAYMENT_CONTEXT.orderId, PAY_NOW_AMOUNT);
      return;
    }

    // 3) 0 грн → free order
    return fetch("https://monal-mono-pay-production.up.railway.app/send-free-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: PAYMENT_CONTEXT.orderId })
    })
    .then(res2 => {
      if (!res2.ok) throw new Error("send-free-order failed");
    })
    .then(() => {
      clearCart();
      closePaymentModal();

      const checkout = document.getElementById("checkout");
      if (checkout) {
        checkout.innerHTML = `
          <h2>Ваше замовлення №${PAYMENT_CONTEXT.orderId} оформлено.</h2>
          <p>Оплачено сертифікатом ✅</p>
        `;
      }
    });
  })
  .catch(err => {
    console.error(err);
    alert("Помилка оплати/відправки. Перевір консоль.");
  });
}

/* ===================== MONO ONLINE PAYMENT ===================== */
function startOnlinePayment(orderId, amount) {
    fetch("https://monal-mono-pay-production.up.railway.app/create-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            orderId,
            amount,
            text: PAYMENT_CONTEXT.text
        })

    })
    .then(res => res.json())
.then(data => {
    const url = data?.pageUrl || data?.paymentUrl; // на всяк випадок
    if (url) {
        window.location.href = url;
        return;
    }
    console.error("Mono create-payment failed:", data);
    alert("Помилка створення оплати");
})

    .catch(err => {
        console.error("Payment request failed:", err);
    });
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

    if (typeof loadNPFromJSON === "function") {
        loadNPFromJSON();
    }

    const phoneInput = document.getElementById("inp-phone");
    if (phoneInput && typeof formatPhone === "function") {
        phoneInput.addEventListener("input", formatPhone);
    }
});


/* ===== CLEAR CART AFTER MONO PAYMENT ===== */

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
        localStorage.removeItem("cart");

        if (typeof updateCartCount === "function") {
            updateCartCount();
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

/* ===================== PROMO APPLY BUTTON ===================== */

document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById("promo-input");
    const promoBtn = document.getElementById("promo-apply-btn");
    const promoMessage = document.getElementById("promo-message");

    if (!promoInput || !promoBtn || !promoMessage) return;

    // якщо вже був застосований код — підставляємо
    if (PROMO_CODE) {
        promoInput.value = PROMO_CODE;
    }

    promoBtn.addEventListener("click", () => {
        const entered = promoInput.value.trim().toUpperCase();

        if (!entered) {
            promoMessage.textContent = "Введіть промокод";
            return;
        }

        if (!isPromoActive()) {
            promoMessage.textContent = "Промо наразі не активне";
            return;
        }

        if (!PROMO || !PROMO.codes.includes(entered)) {
            promoMessage.textContent = "Невірний промокод";
            return;
        }

        PROMO_CODE = entered;
        localStorage.setItem("promo_code", PROMO_CODE);

        promoMessage.innerHTML = `Знижка застосована`;
        renderCart();
    });
});

/* ===== MAKE CART FUNCTIONS GLOBAL (for onclick="...") ===== */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.showCheckout = showCheckout;
window.submitOrder = submitOrder;

window.openPaymentModal = typeof openPaymentModal === "function" ? openPaymentModal : undefined;
window.closePaymentModal = typeof closePaymentModal === "function" ? closePaymentModal : undefined;
window.goToPayment = typeof goToPayment === "function" ? goToPayment : undefined;

window.applyCertificate = typeof applyCertificate === "function" ? applyCertificate : undefined;
