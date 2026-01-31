/* =====================================================
   INLINE GALLERY — Mōnal
   Працює на:
   - parfums.html  (body.page-parfums)  + .parfum-gallery
   - refills.html  (body.page-refills)  + .refill-gallery
   Без модалки. Гортає фото НА МІСЦІ. + SWIPE (mobile)
===================================================== */

const isParfums = document.body.classList.contains('page-parfums');
const isRefills = document.body.classList.contains('page-refills');
const isDiscovery = document.body.classList.contains('page-discovery');
const isGifts = document.body.classList.contains('page-gifts');

/* ===================== PARFUMS ===================== */
const parfumsGalleries = {
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

/* ===================== REFILLS ===================== */
const refillsGalleries = {
  "shadow-of-fig": [
    "images/refills/shadow_of_fig_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "nocturne": [
    "images/refills/nocturne_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "crown-of-olive": [
    "images/refills/crown_of_olive_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "green-haven": [
    "images/refills/green_haven_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "vesper": [
    "images/refills/vesper_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "rosalya": [
    "images/refills/rosalya_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "drift": [
    "images/refills/drift_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "freedom": [
    "images/refills/freedom_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "golden-rum": [
    "images/refills/golden_rum_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ],
  "stone-salt": [
    "images/refills/stone&salt_.png",
    "images/refills/sticks_5.png",
    "images/refills/sticks.png"
  ]
};

/* ===================== DISCOVERY ===================== */
const discoveryGalleries = {
  "freedom": [
    "images/discovery/discovery_freedom.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "golden-rum": [
    "images/discovery/discovery_golden_rum.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"    
  ],

  "green-haven": [
    "images/discovery/discovery_green_haven.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "nocturne": [
    "images/discovery/discovery_nocturne.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "rosalya": [
    "images/discovery/discovery_rosalya.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "shadow-of-fig": [
    "images/discovery/discovery_shadow_of_fig.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "stone-salt": [
    "images/discovery/discovery_stone&salt.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "vesper": [
    "images/discovery/discovery_vesper.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "crown-of-olive": [
    "images/discovery/discovery_crown_of_olive.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ],

  "drift": [
    "images/discovery/discovery_drift.png",
    "images/discovery/discovery_8.png",
    "images/discovery/discovery_9.png",
    "images/discovery/discovery_12.png",
    "images/discovery/discovery_13.png",
    "images/discovery/discovery_15.png"
  ]
};

/* ===================== GIFTS ===================== */
const giftsGalleries = {
  "fairytale": [
    "images/gifts/gift_6.png",
    "images/gifts/gift_3.png",
    "images/gifts/gift_9.png",
    "images/gifts/gift.png",
    "images/gifts/gift_4.png",
    "images/gifts/gift_parfum_2.png",
    "images/gifts/gift_parfum_3.png",
    "images/gifts/schocko_3.png"
  ],

  "ten-mini": [
    "images/gifts/discovery_5.png",
    "images/gifts/discovery_4.png",
    "images/gifts/discovery_11.png",
    "images/gifts/discovery_14.png"
  ]
};

/* ===================== HELPERS ===================== */
function initGalleries(selector, galleriesMap) {
  document.querySelectorAll(selector).forEach(gallery => {
    const key = gallery.dataset.gallery;
    const images = galleriesMap[key];
    if (!images) return;

    const img = gallery.querySelector("img");
    const prevBtn = gallery.querySelector(".gallery-prev");
    const nextBtn = gallery.querySelector(".gallery-next");
    if (!img || !prevBtn || !nextBtn) return;

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
}

function initSwipe(selector, galleriesMap) {
  if (window.innerWidth > 768) return;

  document.querySelectorAll(selector).forEach(gallery => {
    const img = gallery.querySelector(".product-diffuser") || gallery.querySelector("img");
    const key = gallery.dataset.gallery;
    const images = galleriesMap[key];
    if (!img || !images) return;

    let startX = 0;
    let endX = 0;

    gallery.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    gallery.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;

      const diff = startX - endX;
      if (Math.abs(diff) < 40) return;

      let index = images.indexOf(img.getAttribute("src"));
      if (index < 0) index = 0;

      if (diff > 0) {
        index = (index + 1) % images.length;
      } else {
        index = (index - 1 + images.length) % images.length;
      }

      img.src = images[index];
    });
  });
}

/* ===================== INIT (НЕ ЛАМАЄ НІЧОГО) ===================== */
if (isParfums) {
  initGalleries(".parfum-gallery", parfumsGalleries);
  initSwipe(".parfum-gallery", parfumsGalleries);
}

if (isRefills) {
  initGalleries(".refill-gallery", refillsGalleries);
  initSwipe(".refill-gallery", refillsGalleries);
}

if (isDiscovery) {
  initGalleries(".discovery-gallery", discoveryGalleries);
  initSwipe(".discovery-gallery", discoveryGalleries);
}

if (isGifts) {
  initGalleries(".gifts-gallery", giftsGalleries);
  initSwipe(".gifts-gallery", giftsGalleries);
}
