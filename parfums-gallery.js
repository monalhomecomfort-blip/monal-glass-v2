/* =====================================================
   PARFUMS GALLERY — Mōnal
   Працює ТІЛЬКИ на сторінці parfums.html
   Не залежить від cart.js / discovery.js
===================================================== */

/* =====================
   1. ГАЛЕРЕЇ АРОМАТІВ
   Ключ = data-gallery в HTML
   ===================== */

const galleries = {
  "golden-rum": [
    "images/perfumes/golden_rum.png",
    "images/perfumes/golden_rum_2.png",
    "images/perfumes/golden_rum_3.png"
  ],

  "stone-salt": [
    "images/perfumes/stone&salt.png",
    "images/perfumes/stone&salt_2.png",
    "images/perfumes/stone&salt_3.png"
  ],

  "drift": [
    "images/perfumes/drift.png",
    "images/perfumes/drift_2.png",
    "images/perfumes/drift_3.png"
  ],

  "freedom": [
    "images/perfumes/freedom.png",
    "images/perfumes/freedom_2.png",
    "images/perfumes/freedom_3.png"
  ],

  "green-haven": [
    "images/perfumes/green_haven.png",
    "images/perfumes/green_haven_2.png",
    "images/perfumes/green_haven_3.png"
  ],

  "nocturne": [
    "images/perfumes/nocturne.png",
    "images/perfumes/nocturne_2.png",
    "images/perfumes/nocturne_3.png"
  ],

  "crown-of-olive": [
    "images/perfumes/crown_of_olive.png",
    "images/perfumes/crown_of_olive_2.png",
    "images/perfumes/crown_of_olive_3.png"
  ],

  "shadow-of-fig": [
    "images/perfumes/shadow_of_fig.png",
    "images/perfumes/shadow_of_fig_2.png",
    "images/perfumes/shadow_of_fig_3.png"
  ],

  "vesper": [
    "images/perfumes/vesper.png",
    "images/perfumes/vesper_2.png",
    "images/perfumes/vesper_3.png"
  ],

  "rosalya": [
    "images/perfumes/rosalya.png",
    "images/perfumes/rosalya_2.png",
    "images/perfumes/rosalya_3.png"
  ]
};

/* =====================
   2. DOM ЕЛЕМЕНТИ
   ===================== */

const modal = document.querySelector(".parfums-gallery-modal");
const galleryBox = document.querySelector(".parfums-gallery-track");
const closeBtn = document.querySelector(".parfums-gallery-close");

/* =====================
   3. ВІДКРИТТЯ ГАЛЕРЕЇ
   ===================== */

document.querySelectorAll(".parfum-open").forEach(button => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    const key = img.dataset.gallery;

    // safety check
    if (!galleries[key]) {
      console.warn(`Gallery "${key}" not found`);
      return;
    }

    // очищаємо галерею
    galleryBox.innerHTML = "";

    // додаємо фото
    galleries[key].forEach(src => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = img.alt; // використовуємо той самий ALT
      galleryBox.appendChild(image);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden"; // фіксуємо скрол сторінки
  });
});

/* =====================
   4. ЗАКРИТТЯ МОДАЛКИ
   ===================== */

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeModal();
  }
});

/* =====================
   5. ESC ДЛЯ ЗАКРИТТЯ
   ===================== */

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});
