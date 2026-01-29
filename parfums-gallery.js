document.addEventListener("DOMContentLoaded", () => {

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

  const modal = document.querySelector(".parfums-gallery-modal");
  const overlay = document.querySelector(".parfums-gallery-overlay");
  const closeBtn = document.querySelector(".parfums-gallery-close");
  const track = document.querySelector(".parfums-gallery-track");
  const buttons = document.querySelectorAll(".parfum-open");
  
  function openGallery(btn) {
    const img = btn.querySelector("img");
    if (!img) return;

    const key = img.dataset.gallery;
    const list = galleries[key];

    track.innerHTML = "";

    list.forEach(src => {
      const el = document.createElement("img");
      el.src = src;
      el.alt = img.alt;
      track.appendChild(el);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      openGallery(btn);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

});
