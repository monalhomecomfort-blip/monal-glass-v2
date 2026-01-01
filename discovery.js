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

/* ===================== DISCOVERY SET (GLOBAL, SYNCED) ===================== */

const SET_PRICE = 395;
let discoverySet = [];

/* ===== helpers ===== */

function getAllBoxes() {
    return document.querySelectorAll(".discovery-box");
}

function renderAllBoxes() {
    getAllBoxes().forEach(box => {
        const list = box.querySelector(".discovery-items");
        const hint = box.querySelector(".discovery-hint");
        const buyBtn = box.querySelector(".buy-discovery-btn");

        // список
        list.innerHTML = "";
        discoverySet.forEach((name, index) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <span>${name}</span>
                <button data-index="${index}">×</button>
            `;

            list.appendChild(li);
        });

        // видалення
        list.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = Number(btn.dataset.index);
                discoverySet.splice(i, 1);
                renderAllBoxes();
            });
        });

        // підказка + кнопка
        if (discoverySet.length === 0) {
            hint.textContent = "Сет містить 4 аромати";
            buyBtn.disabled = true;
            return;
        }

        if (discoverySet.length % 4 !== 0) {
            hint.textContent =
                "Сет містить 4 аромати — зробіть ще вибір або видаліть";
            buyBtn.disabled = true;
            return;
        }

        const sets = discoverySet.length / 4;
        hint.textContent = `Готово: ${sets} сет(и)`;
        buyBtn.disabled = false;
    });
}

/* ===== add to set ===== */

document.addEventListener("click", e => {
    if (!e.target.classList.contains("add-to-set")) return;

    const product = e.target.closest(".product-text");
    if (!product) return;

    const name = product.querySelector(".product-title")?.innerText;
    if (!name) return;

    discoverySet.push(name);
    renderAllBoxes();
});

/* ===== buy discovery set ===== */

document.addEventListener("click", e => {
    if (!e.target.classList.contains("buy-discovery-btn")) return;

    if (discoverySet.length === 0 || discoverySet.length % 4 !== 0) return;

    const sets = discoverySet.length / 4;
    const total = sets * SET_PRICE;

    addToCart(
        `Discovery set (${sets}×4 ml)`,
        total,
        discoverySet.join(", ")
    );

    discoverySet = [];
    renderAllBoxes();
});

/* ===== init ===== */
renderAllBoxes();

/* ===================== DISCOVERY SET (for your HTML) ===================== */

const SET_PRICE = 395;
const SET_SIZE = 4;

let discoverySet = [];

// Делегований клік по "Додати в сет"
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-set");
  if (!addBtn) return;

  const row = addBtn.closest(".product-row");
  if (!row) return;

  const title = row.querySelector(".product-title");
  if (!title) return;

  const name = title.innerText.trim();

  // ОДНАКОВІ МОЖНА → просто пушимо
  discoverySet.push(name);

  renderAllDiscoveryBoxes();
});

function renderAllDiscoveryBoxes() {
  // Оновлюємо всі 10 вікон одночасно
  document.querySelectorAll(".discovery-box").forEach((box) => {
    const list = box.querySelector(".discovery-items");
    const hint = box.querySelector(".discovery-hint");
    const buyBtn = box.querySelector(".buy-discovery-btn");

    if (!list || !hint || !buyBtn) return;

    // Рендер списку
    list.innerHTML = "";
    discoverySet.forEach((name, index) => {
      const li = document.createElement("li");
      li.className = "discovery-item";
      li.innerHTML = `
        <span class="discovery-name">${escapeHtml(name)}</span>
        <button type="button" class="discovery-remove" data-index="${index}">×</button>
      `;
      list.appendChild(li);
    });

    // Видалення по хрестику (делеговано всередині бокса)
    list.querySelectorAll(".discovery-remove").forEach((btn) => {
      btn.onclick = () => {
        const i = Number(btn.dataset.index);
        if (!Number.isNaN(i)) {
          discoverySet.splice(i, 1);
          renderAllDiscoveryBoxes();
        }
      };
    });

    // Логіка підказки + активності кнопки
    if (discoverySet.length === 0) {
      hint.textContent = "Сет містить 4 аромати";
      hint.classList.remove("error");
      buyBtn.disabled = true;
      buyBtn.onclick = null;
      return;
    }

    if (discoverySet.length % SET_SIZE !== 0) {
      hint.textContent = "Сет містить 4 аромати — додайте або видаліть";
      hint.classList.add("error");
      buyBtn.disabled = true;
      buyBtn.onclick = null;
      return;
    }

    const sets = discoverySet.length / SET_SIZE;
    hint.textContent = `Готово: ${sets} сет(и)`;
    hint.classList.remove("error");
    buyBtn.disabled = false;

    buyBtn.onclick = () => {
      // додаємо в кошик
      addToCart(`Discovery set (${sets}×4 мініатюри)`, sets * SET_PRICE, "Discovery set");

      // очищаємо і оновлюємо всі вікна
      discoverySet = [];
      renderAllDiscoveryBoxes();

      // НЕ alert: просто тихо міняємо підказку на секунду
      document.querySelectorAll(".discovery-box .discovery-hint").forEach(h => {
        h.textContent = "Додано в кошик ✓";
        h.classList.remove("error");
        setTimeout(() => {
          if (discoverySet.length === 0) h.textContent = "Сет містить 4 аромати";
        }, 900);
      });
    };
  });
}

// щоб назви не ламали html
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// первинний рендер (щоб кнопка точно була disabled зразу)
renderAllDiscoveryBoxes();
