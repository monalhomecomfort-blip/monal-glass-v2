(function () {
    const PROMO_IMAGE_SRC = "images/promo/ten-mini-diffuser-modal.png";
    const PROMO_TARGET_URL = "aromadiffusers.html";

    if (!document.body.classList.contains("home")) {
        return;
    }

    if (document.body.classList.contains("staff-page")) {
        return;
    }

    function closePromoModal() {
        const modal = document.getElementById("site-promo-modal");

        if (modal) {
            modal.remove();
        }

        document.body.classList.remove("site-promo-modal-open");
    }

    function openPromoModal() {
        const modal = document.createElement("div");
        modal.id = "site-promo-modal";
        modal.className = "site-promo-modal";
        modal.setAttribute("aria-hidden", "false");

        modal.innerHTML = `
            <div class="site-promo-modal-window">
                <img 
                    src="${PROMO_IMAGE_SRC}" 
                    alt="Промо Mōnal: TEN MINI в подарунок до аромадифузора"
                    class="site-promo-modal-image"
                >

                <button
                    type="button"
                    class="site-promo-modal-close-hitbox"
                    aria-label="Закрити промо"
                ></button>

                <a
                    href="${PROMO_TARGET_URL}"
                    class="site-promo-modal-cta-hitbox"
                    aria-label="Перейти до аромадифузорів"
                ></a>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add("site-promo-modal-open");

        const closeBtn = modal.querySelector(".site-promo-modal-close-hitbox");
        const ctaBtn = modal.querySelector(".site-promo-modal-cta-hitbox");

        closeBtn.addEventListener("click", closePromoModal);

        ctaBtn.addEventListener("click", function () {
            closePromoModal();
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closePromoModal();
            }
        });

        document.addEventListener("keydown", function handleEscape(event) {
            if (event.key === "Escape") {
                closePromoModal();
                document.removeEventListener("keydown", handleEscape);
            }
        });
    }

    window.addEventListener("load", function () {
        setTimeout(openPromoModal, 600);
    });
})();
