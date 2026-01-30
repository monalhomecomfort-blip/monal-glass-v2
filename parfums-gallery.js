/* =====================================================
   PARFUMS INLINE GALLERY — Mōnal
   Працює ТІЛЬКИ на сторінці parfums.html
   Без модалки. Гортає фото НА МІСЦІ.
===================================================== */

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

document.querySelectorAll(".parfum-gallery").forEach(gallery => {
  const key = gallery.dataset.gallery;
  const images = galleries[key];
  if (!images) return;

  const img = gallery.querySelector("img");
  const prevBtn = gallery.querySelector(".gallery-prev");
  const nextBtn = gallery.querySelector(".gallery-next");

  let index = 0;

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    img.src = images[index];
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % images.length;
    img.src = images[index];
  });
});
/* =====================
   PARFUMS INLINE GALLERY — SWIPE (MOBILE)
===================== */

if (window.innerWidth <= 768) {

  document.querySelectorAll('.parfum-gallery').forEach(gallery => {

    const img = gallery.querySelector('.product-diffuser');
    const key = gallery.dataset.gallery;
    const images = galleries[key];

    if (!img || !images) return;

    let startX = 0;
    let endX = 0;

    gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = startX - endX;

      if (Math.abs(diff) < 40) return; // ігноруємо мікрорухи

      let index = images.indexOf(img.getAttribute('src'));

      if (diff > 0) {
        // свайп вліво → наступне фото
        index = (index + 1) % images.length;
      } else {
        // свайп вправо → попереднє фото
        index = (index - 1 + images.length) % images.length;
      }

      img.src = images[index];
    }

  });
}
