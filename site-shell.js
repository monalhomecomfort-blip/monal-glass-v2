(function initMonalSiteShell() {
    const currentScript = document.currentScript;
    const root = currentScript?.dataset.root || "";
    const body = document.body;

    if (!body || !body.classList.contains("site-page")) return;

    const header = document.createElement("header");
    header.className = "home-header";
    header.innerHTML = `
        <nav class="home-nav" aria-label="Головна навігація">
            <a href="${root}index.html" class="home-wordmark" aria-label="Mōnal — головна">Mōnal</a>

            <div class="home-nav-center">
                <a href="${root}about.html">Про нас</a>
                <span class="home-nav-divider">|</span>

                <div class="home-catalog-menu">
                    <button class="home-catalog-button" type="button" aria-expanded="false">
                        Магазин
                    </button>

                    <div class="home-catalog-dropdown">
                        <a href="${root}catalog.html#aromadiffusers">Аромадифузори</a>
                        <a href="${root}catalog.html#refills">Рефіли</a>
                        <a href="${root}catalog.html#parfums-100">Парфуми для інтер’єру</a>
                        <a href="${root}catalog.html#discovery">Discovery set</a>
                        <a href="${root}catalog.html#candles">Свічки</a>
                        <a href="${root}catalog.html#gift-sets">Подарункові набори</a>
                        <a href="${root}catalog.html#certificates">Сертифікати</a>
                        <a href="${root}catalog.html#car-sachets">Аромасаше для авто</a>
                        <a href="${root}catalog.html#wardrobe-sachets">Аромасаше для гардеробу</a>
                        <a href="${root}catalog.html#hand-soap">Мило для рук</a>
                        <a href="${root}catalog.html#hand-cream">Крем для рук</a>
                        <a href="${root}catalog.html#shower-gel">Гель для душу</a>
                    </div>
                </div>

                <span class="home-nav-divider">|</span>

                <div class="home-catalog-menu">
                    <button class="home-catalog-button" type="button" aria-expanded="false">
                        Аромати
                    </button>

                    <div class="home-catalog-dropdown">
                        <a href="${root}catalog.html?aroma=fairytale#catalog">FAIRYTALE</a>
                        <a href="${root}catalog.html?aroma=golden-rum#catalog">GOLDEN RUM</a>
                        <a href="${root}catalog.html?aroma=stone-salt#catalog">STONE &amp; SALT</a>
                        <a href="${root}catalog.html?aroma=drift#catalog">DRIFT</a>
                        <a href="${root}catalog.html?aroma=freedom#catalog">FREEDOM</a>
                        <a href="${root}catalog.html?aroma=green-haven#catalog">GREEN HAVEN</a>
                        <a href="${root}catalog.html?aroma=nocturne#catalog">NOCTURNE</a>
                        <a href="${root}catalog.html?aroma=crown-of-olive#catalog">CROWN OF OLIVE</a>
                        <a href="${root}catalog.html?aroma=shadow-of-fig#catalog">SHADOW OF FIG</a>
                        <a href="${root}catalog.html?aroma=vesper#catalog">VESPER</a>
                        <a href="${root}catalog.html?aroma=rosalya#catalog">ROSALYA</a>
                        <a href="${root}catalog.html?aroma=leather-absolute#catalog">LEATHER ABSOLUTE</a>
                        <a href="${root}catalog.html?aroma=amber-elite#catalog">AMBER ELITE</a>
                        <a href="${root}catalog.html?aroma=bois-noir#catalog">BOIS NOIR</a>
                    </div>
                </div>

                <span class="home-nav-divider">|</span>
                <a href="${root}user-account.html" id="shell-nav-account">Кабінет</a>
            </div>

            <div class="home-nav-right">
                <button class="home-search-trigger" type="button">Пошук</button>
                <span class="home-nav-divider">|</span>
                <a href="${root}cart.html">Кошик <span id="shell-cart-count"></span></a>
            </div>

            <button class="home-burger" type="button" aria-label="Відкрити меню">☰</button>
        </nav>

        <div class="home-mobile-menu">
            <button class="home-mobile-close" type="button" aria-label="Закрити меню">✕</button>

            <a href="${root}about.html">Про нас</a>

            <div class="home-mobile-nav-group">
                <button
                    class="home-mobile-nav-toggle"
                    type="button"
                    aria-expanded="false"
                >
                    Магазин
                </button>

                <div class="home-mobile-nav-dropdown">
                    <a href="${root}catalog.html#aromadiffusers">Аромадифузори</a>
                    <a href="${root}catalog.html#refills">Рефіли</a>
                    <a href="${root}catalog.html#parfums-100">Парфуми для інтер’єру</a>
                    <a href="${root}catalog.html#discovery">Discovery set</a>
                    <a href="${root}catalog.html#candles">Свічки</a>
                    <a href="${root}catalog.html#gift-sets">Подарункові набори</a>
                    <a href="${root}catalog.html#certificates">Сертифікати</a>
                    <a href="${root}catalog.html#car-sachets">Аромасаше для авто</a>
                    <a href="${root}catalog.html#wardrobe-sachets">Аромасаше для гардеробу</a>
                    <a href="${root}catalog.html#hand-soap">Мило для рук</a>
                    <a href="${root}catalog.html#hand-cream">Крем для рук</a>
                    <a href="${root}catalog.html#shower-gel">Гель для душу</a>
                </div>
            </div>

            <div class="home-mobile-nav-group">
                <button
                    class="home-mobile-nav-toggle"
                    type="button"
                    aria-expanded="false"
                >
                    Аромати
                </button>

                <div class="home-mobile-nav-dropdown">
                    <a href="${root}catalog.html?aroma=fairytale#catalog">FAIRYTALE</a>
                    <a href="${root}catalog.html?aroma=golden-rum#catalog">GOLDEN RUM</a>
                    <a href="${root}catalog.html?aroma=stone-salt#catalog">STONE &amp; SALT</a>
                    <a href="${root}catalog.html?aroma=drift#catalog">DRIFT</a>
                    <a href="${root}catalog.html?aroma=freedom#catalog">FREEDOM</a>
                    <a href="${root}catalog.html?aroma=green-haven#catalog">GREEN HAVEN</a>
                    <a href="${root}catalog.html?aroma=nocturne#catalog">NOCTURNE</a>
                    <a href="${root}catalog.html?aroma=crown-of-olive#catalog">CROWN OF OLIVE</a>
                    <a href="${root}catalog.html?aroma=shadow-of-fig#catalog">SHADOW OF FIG</a>
                    <a href="${root}catalog.html?aroma=vesper#catalog">VESPER</a>
                    <a href="${root}catalog.html?aroma=rosalya#catalog">ROSALYA</a>
                    <a href="${root}catalog.html?aroma=leather-absolute#catalog">LEATHER ABSOLUTE</a>
                    <a href="${root}catalog.html?aroma=amber-elite#catalog">AMBER ELITE</a>
                    <a href="${root}catalog.html?aroma=bois-noir#catalog">BOIS NOIR</a>
                </div>
            </div>

            <a href="${root}user-account.html" id="shell-mobile-account">Кабінет</a>

            <button class="home-search-trigger home-mobile-search-trigger" type="button">
                Пошук
            </button>

            <a href="${root}cart.html">
                Кошик <span id="shell-burger-cart-count"></span>
            </a>
        </div>
    `;

    const footer = document.createElement("footer");
    footer.className = "home-footer";
    footer.innerHTML = `
        <div class="home-footer-main">
            <div class="home-footer-copy">
                © 2023 Аромати для дому та<br>
                подарунки
            </div>

            <nav class="home-footer-links" aria-label="Додаткова навігація">
                <a href="${root}partners.html">Партнерам</a>
                <a href="${root}account/loyalty.html">Програма лояльності</a>
                <a href="${root}delivery.html">Обмін та повернення</a>
                <a href="${root}delivery.html">Оплата та доставка</a>
                <a href="${root}privacy.html">Політика конфіденційності</a>
            </nav>

            <div class="home-footer-contacts">
                <a href="tel:+380930109000">+38 093 01 09 000</a>
                <a href="mailto:monalofficial.ua@gmail.com">monalofficial.ua@gmail.com</a>
            </div>
        </div>

        <div class="home-footer-socials">
            <a href="https://www.instagram.com/monal.official/" target="_blank" rel="noopener">Instagram</a>
            <span>|</span>
            <a href="https://t.me/Monalgroup" target="_blank" rel="noopener">Telegram</a>
            <span>|</span>
            <a href="https://www.facebook.com/people/Monal/61552030280894/" target="_blank" rel="noopener">Facebook</a>
            <span>|</span>
            <a href="https://www.tiktok.com/@monalofficial" target="_blank" rel="noopener">Tik Tok</a>
            <span>|</span>
            <span class="home-footer-social-label">Pinterest</span>
        </div>
    `;

    body.prepend(header);
    body.append(footer);

    const catalogMenus = header.querySelectorAll(".home-catalog-menu");
    const burgerButton = header.querySelector(".home-burger");
    const mobileMenu = header.querySelector(".home-mobile-menu");
    const mobileClose = header.querySelector(".home-mobile-close");

    catalogMenus.forEach(function (catalogMenu) {
        const catalogButton = catalogMenu.querySelector(".home-catalog-button");

        if (!catalogButton) return;

        catalogButton.addEventListener("click", function (event) {
            event.stopPropagation();

            catalogMenus.forEach(function (otherMenu) {
                if (otherMenu !== catalogMenu) {
                    otherMenu.classList.remove("open");

                    const otherButton = otherMenu.querySelector(".home-catalog-button");

                    if (otherButton) {
                        otherButton.setAttribute("aria-expanded", "false");
                    }
                }
            });

            const isOpen = catalogMenu.classList.toggle("open");

            catalogButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        catalogMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                catalogMenu.classList.remove("open");
                catalogButton.setAttribute("aria-expanded", "false");
            });
        });
    });

    document.addEventListener("click", function () {
        catalogMenus.forEach(function (catalogMenu) {
            catalogMenu.classList.remove("open");

            const catalogButton = catalogMenu.querySelector(".home-catalog-button");

            if (catalogButton) {
                catalogButton.setAttribute("aria-expanded", "false");
            }
        });
    });

    function setMobileMenu(open) {
        mobileMenu.classList.toggle("open", open);
        burgerButton.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("mobile-menu-open", open);
    }

    burgerButton.addEventListener("click", function () {
        setMobileMenu(true);
    });

    mobileClose.addEventListener("click", function () {
        setMobileMenu(false);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMobileMenu(false);
        });
    });
    
    mobileMenu.querySelectorAll(".home-mobile-nav-toggle").forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            const group = toggle.closest(".home-mobile-nav-group");
            const isOpen = group.classList.toggle("open");

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    });    

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
            setMobileMenu(false);
        }
    });

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartLabel = cart.length ? `(${cart.length})` : "";
    document.getElementById("shell-cart-count").textContent = cartLabel;
    document.getElementById("shell-burger-cart-count").textContent = cartLabel;

    const storedStaffUser = localStorage.getItem("monal_staff_user");
    const storedUser = localStorage.getItem("monal_user");

    if (storedStaffUser) {
        try {
            const staffData = JSON.parse(storedStaffUser);

            const staffName =
                String(staffData.name || "STAFF").trim();

            const staffRole =
                String(staffData.role || "").trim().toUpperCase();

            const staffLabel =
                staffRole
                    ? `${staffName} · ${staffRole}`
                    : staffName;

            [
                document.getElementById("shell-nav-account"),
                document.getElementById("shell-mobile-account")
            ].forEach(function (accountLink) {
                if (!accountLink) return;

                accountLink.textContent = staffLabel;
                accountLink.href =
                    `${root}account/staff-cabinet.html`;
            });

        } catch (error) {
            localStorage.removeItem("monal_staff_user");
        }

    } else if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);

            [
                document.getElementById("shell-nav-account"),
                document.getElementById("shell-mobile-account")
            ].forEach(function (accountLink) {
                if (!accountLink) return;

                accountLink.textContent =
                    userData.name || "Кабінет";

                if (typeof window.openSidebar === "function") {
                    accountLink.href = "#";

                    accountLink.addEventListener(
                        "click",
                        function (event) {
                            event.preventDefault();
                            window.openSidebar();
                        }
                    );
                }
            });

        } catch (error) {
            localStorage.removeItem("monal_user");
        }
    }

    const searchScript = document.createElement("script");
    searchScript.src = `${root}search.js`;
    searchScript.dataset.monalSearch = "";
    document.body.appendChild(searchScript);
})();
