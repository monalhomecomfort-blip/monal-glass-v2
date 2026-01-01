/* ===================== DISCOVERY SET ===================== */

const DISCOVERY_PRICE = 395;
let discoverySet = [];

document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("add-to-set")) return;

    const product = e.target.closest(".product-text");
    if (!product) return;

    const name = product.querySelector(".product-title").innerText;

    // можна додавати однакові — ТОМУ ЦЕ ВИДАЛЯЄМО
    // if (discoverySet.includes(name)) return;

    if (discoverySet.length >= 4) {
        updateDiscoveryHint(
            "Сет містить 4 аромати — видаліть один, щоб додати інший"
        );
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

    if (!list || !count || !hint || !buyBtn) return;

    list.innerHTML = "";

    discoverySet.forEach((name, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${name}</span>
            <button class="remove-item" data-index="${index}">×</button>
        `;
        list.appendChild(li);
    });

    count.textContent = discoverySet.length;

    if (discoverySet.length < 4) {
        hint.textContent = `Оберіть ще ${4 - discoverySet.length} аромат(и)`;
        buyBtn.disabled = true;
        buyBtn.innerText = `Додати сет в кошик · ${DISCOVERY_PRICE} грн`;
        return;
    }

    hint.textContent = "Сет готовий до покупки";
    buyBtn.disabled = false;
    buyBtn.innerText = `Додати сет в кошик · ${DISCOVERY_PRICE} грн`;
}

// видалення аромату
document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("remove-item")) return;

    const index = Number(e.target.dataset.index);
    discoverySet.splice(index, 1);
    updateDiscoveryUI();
});

// купити сет
document.getElementById("buy-discovery-btn")?.addEventListener("click", () => {
    if (discoverySet.length !== 4) return;

    addToCart(
        "Discovery set (4×3 ml)",
        DISCOVERY_PRICE,
        "Discovery set",
        discoverySet.join(", ")
    );

    discoverySet = [];
    updateDiscoveryUI();
});
