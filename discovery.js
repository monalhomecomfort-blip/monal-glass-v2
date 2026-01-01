/* ===================== DISCOVERY SET ===================== */

/*
  УМОВИ:
  - HTML використовує ТІЛЬКИ класи
  - 10 discovery-box, логіка спільна
  - Один масив стану
  - Сет = кратно 4
  - Однакові аромати дозволені
  - Без alert
*/

let discoverySet = [];

/* ---------- DOM ---------- */

const discoveryBoxes = document.querySelectorAll(".discovery-box");
const addToSetButtons = document.querySelectorAll(".add-to-set");

/* ---------- HELPERS ---------- */

function getProductName(button) {
    const productRow = button.closest(".product-row");
    const title = productRow.querySelector(".product-title");
    return title ? title.textContent.trim() : "";
}

/* ---------- RENDER ---------- */

function renderDiscovery() {
    discoveryBoxes.forEach(box => {
        const list = box.querySelector(".discovery-items");
        const hint = box.querySelector(".discovery-hint");
        const buyBtn = box.querySelector(".buy-discovery-btn");

        // очистка списку
        list.innerHTML = "";

        // рендер ароматів
        discoverySet.forEach((name, index) => {
            const li = document.createElement("li");
            li.className = "discovery-item";
            li.innerHTML = `
                <span>${name}</span>
                <button class="remove-item" data-index="${index}">✕</button>
            `;
            list.appendChild(li);
        });

        // підказка + кнопка
        if (discoverySet.length === 0) {
            hint.textContent = "Сет містить 4 аромати";
            buyBtn.disabled = true;
        } else if (discoverySet.length % 4 !== 0) {
            hint.textContent = "Сет містить 4 аромати — додайте або видаліть";
            buyBtn.disabled = true;
        } else {
            const setsCount = discoverySet.length / 4;
            hint.textContent = `Готово: ${setsCount} сет${setsCount > 1 ? "и" : ""}`;
            buyBtn.disabled = false;
        }
    });
}

/* ---------- ADD TO SET ---------- */

addToSetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const name = getProductName(btn);
        if (!name) return;

        discoverySet.push(name);
        renderDiscovery();
    });
});

/* ---------- REMOVE ---------- */

document.addEventListener("click", e => {
    if (!e.target.classList.contains("remove-item")) return;

    const index = Number(e.target.dataset.index);
    if (isNaN(index)) return;

    discoverySet.splice(index, 1);
    renderDiscovery();
});

/* ---------- ADD TO CART ---------- */

document.addEventListener("click", e => {
    if (!e.target.classList.contains("buy-discovery-btn")) return;
    if (e.target.disabled) return;

    const setsCount = discoverySet.length / 4;
    if (setsCount <= 0) return;

    for (let i = 0; i < setsCount; i++) {
        addToCart(
            "Discovery set (4 × 3 ml)",
            395
        );
    }

    // очистка
    discoverySet = [];
    renderDiscovery();
});

/* ---------- INIT ---------- */

renderDiscovery();

