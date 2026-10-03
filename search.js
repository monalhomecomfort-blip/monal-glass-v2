(function initMonalSearch() {
    if (window.monalSearchInitialized) return;
    window.monalSearchInitialized = true;

    const triggers = Array.from(
        document.querySelectorAll(".home-search-trigger")
    );

    if (!triggers.length) return;

    const catalogUrl = new URL(
        "/catalog.html",
        window.location.origin
    );

    const products = createSearchProducts();
    let lastTrigger = null;

    const style = document.createElement("style");

    style.textContent = `
        .monal-search-panel[hidden] {
            display: none !important;
        }

        .monal-search-panel {
            position: fixed;
            z-index: 5000;
            width: min(430px, calc(100vw - 24px));
            max-height: min(520px, calc(100vh - 88px));
            border: 1px solid rgba(17, 17, 15, 0.15);
            display: flex;
            flex-direction: column;
            background: #f4efe6;
            color: #11110f;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24);
        }

        .monal-search-head {
            position: relative;
            flex: 0 0 auto;
            padding: 18px 20px 14px;
            border-bottom: 1px solid rgba(17, 17, 15, 0.13);
        }

        .monal-search-label {
            margin: 0 34px 12px 0;
            color: #777b5b;
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 0.16em;
        }

        .monal-search-close {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 32px;
            height: 32px;
            padding: 0;
            border: 0;
            display: grid;
            place-items: center;
            background: transparent;
            color: #11110f;
            font-family: inherit;
            font-size: 18px;
            line-height: 1;
            cursor: pointer;
        }

        .monal-search-input {
            width: 100%;
            height: 40px;
            padding: 8px 0;
            border: 0;
            border-bottom: 1px solid rgba(17, 17, 15, 0.55);
            border-radius: 0;
            background: transparent;
            color: #11110f;
            font-family: inherit;
            font-size: 14px;
            outline: none;
        }

        .monal-search-input:focus {
            border-bottom-color: #777b5b;
        }

        .monal-search-input::placeholder {
            color: rgba(17, 17, 15, 0.48);
        }

        .monal-search-status {
            min-height: 15px;
            margin: 10px 0 0;
            color: rgba(17, 17, 15, 0.58);
            font-size: 9px;
            line-height: 1.4;
        }

        .monal-search-results {
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        .monal-search-result {
            width: 100%;
            min-width: 0;
            padding: 10px 14px;
            border: 0;
            border-bottom: 1px solid rgba(17, 17, 15, 0.1);
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr) auto;
            gap: 12px;
            align-items: center;
            background: #f4efe6;
            color: #11110f;
            font-family: inherit;
            text-align: left;
            cursor: pointer;
        }

        .monal-search-result:last-child {
            border-bottom: 0;
        }

        .monal-search-result:hover,
        .monal-search-result:focus-visible {
            background: #ebe4d8;
            outline: none;
        }

        .monal-search-result img {
            width: 48px;
            height: 56px;
            object-fit: contain;
        }

        .monal-search-result-copy {
            min-width: 0;
        }

        .monal-search-result-type {
            display: block;
            margin-bottom: 3px;
            overflow: hidden;
            color: #777b5b;
            font-size: 8px;
            line-height: 1.3;
            letter-spacing: 0.07em;
            text-overflow: ellipsis;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .monal-search-result-name {
            display: block;
            overflow: hidden;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.3;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .monal-search-result-description {
            display: block;
            margin-top: 3px;
            overflow: hidden;
            color: rgba(17, 17, 15, 0.62);
            font-size: 8px;
            line-height: 1.35;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .monal-search-result-price {
            white-space: nowrap;
            font-size: 10px;
            font-weight: 600;
        }

        @media (max-width: 520px) {
            .monal-search-panel {
                width: calc(100vw - 20px);
            }

            .monal-search-head {
                padding: 16px 16px 12px;
            }

            .monal-search-result {
                grid-template-columns: 44px minmax(0, 1fr);
                gap: 10px;
                padding: 9px 12px;
            }

            .monal-search-result img {
                width: 44px;
                height: 52px;
            }

            .monal-search-result-price {
                grid-column: 2;
                margin-top: -7px;
            }
        }
    `;

    const panel = document.createElement("section");

    panel.className = "monal-search-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Пошук по каталогу");

    panel.innerHTML = `
        <div class="monal-search-head">
            <button
                class="monal-search-close"
                type="button"
                aria-label="Закрити пошук"
            >✕</button>

            <p class="monal-search-label">
                ПОШУК ПО КАТАЛОГУ
            </p>

            <input
                class="monal-search-input"
                type="search"
                placeholder="Назва аромату або категорія"
                autocomplete="off"
                aria-label="Пошук товарів"
            >

            <p
                class="monal-search-status"
                aria-live="polite"
            >
                Введіть щонайменше 2 символи
            </p>
        </div>

        <div class="monal-search-results"></div>
    `;

    document.head.appendChild(style);
    document.body.appendChild(panel);

    const closeButton = panel.querySelector(
        ".monal-search-close"
    );

    const input = panel.querySelector(
        ".monal-search-input"
    );

    const status = panel.querySelector(
        ".monal-search-status"
    );

    const results = panel.querySelector(
        ".monal-search-results"
    );

    function normalize(value) {
        return String(value || "")
            .toLocaleLowerCase("uk-UA")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[’'`]/g, "")
            .replace(/&/g, " and ")
            .replace(/[^a-zа-яіїєґ0-9]+/gi, " ")
            .trim();
    }
    
    function createSearchProducts() {
        const scentRows = [
            [
                "fairytale",
                "FAIRYTALE",
                "фейрітейл фейрі тейл казка",
                "коньяк / кориця / амбра / сандал",
                "fairytale"
            ],
            [
                "golden-rum",
                "GOLDEN RUM",
                "голден рам голден рум золотий ром",
                "ром / кориця / ваніль / сандал",
                "golden_rum"
            ],
            [
                "stone-salt",
                "STONE & SALT",
                "стоун енд солт стоун солт камінь і сіль",
                "морська сіль / грейпфрут / шавлія",
                "stone_salt"
            ],
            [
                "drift",
                "DRIFT",
                "дріфт дрифт",
                "морські ноти / розмарин / ладан / пачулі",
                "drift"
            ],
            [
                "freedom",
                "FREEDOM",
                "фрідом свобода",
                "фісташка / тубероза / жасмин / боби тонка",
                "freedom"
            ],
            [
                "green-haven",
                "GREEN HAVEN",
                "грін хейвен зелена гавань трав'яне плесо",
                "мандарин / бергамот / імбир / білий чай",
                "green_haven"
            ],
            [
                "nocturne",
                "NOCTURNE",
                "ноктюрн полотно ночі",
                "мандарин / шавлія / тютюн / пачулі",
                "nocturne"
            ],
            [
                "crown-of-olive",
                "CROWN OF OLIVE",
                "краун оф олів корона оливи крона оливи крону оливи",
                "жасмин / персик / олива / кедр",
                "crown_of_olive"
            ],
            [
                "shadow-of-fig",
                "SHADOW OF FIG",
                "шедоу оф фіг тінь інжиру",
                "озон / інжир / пудра / деревні ноти",
                "shadow_of_fig"
            ],
            [
                "vesper",
                "VESPER",
                "веспер вечір вечірня зоря",
                "лаванда / перець / тютюн / ветивер",
                "vesper"
            ],
            [
                "rosalya",
                "ROSALYA",
                "розалія",
                "троянда / жасмин / ваніль / амбра",
                "rosalya"
            ],
            [
                "leather-absolute",
                "LEATHER ABSOLUTE",
                "лезер абсолют абсолютна шкіра",
                "шафран / шкіра / кедр / замша",
                "black_leather_"
            ],
            [
                "amber-elite",
                "AMBER ELITE",
                "амбер еліт елітна амбра",
                "бергамот / бензоїн / ваніль / амбра",
                "black_amber_"
            ],
            [
                "bois-noir",
                "BOIS NOIR",
                "буа нуар боіс нуар чорне дерево боа нуар",
                "кедр / сандал / смоли / лабданум",
                "black_bois_"
            ]
        ];

        const scents = Object.fromEntries(
            scentRows.map(function (row) {
                return [
                    row[0],
                    {
                        key: row[0],
                        name: row[1],
                        uk: row[2],
                        description: row[3],
                        file: row[4]
                    }
                ];
            })
        );

        const result = [];

        function addProduct(product) {
            result.push({
                ...product,

                image: new URL(
                    product.image,
                    catalogUrl
                ).href,

                nameText: normalize(
                    `${product.name} ${product.uk || ""}`
                ),

                categoryText: normalize(
                    product.category
                ),

                typeText: normalize(
                    product.type
                ),

                searchText: normalize([
                    "каталог товар продукція аромат аромати",
                    product.name,
                    product.uk,
                    product.type,
                    product.category,
                    product.description,
                    product.keywords
                ].join(" "))
            });
        }

        [
            "fairytale",
            "golden-rum",
            "stone-salt",
            "drift",
            "freedom",
            "green-haven",
            "nocturne",
            "crown-of-olive",
            "shadow-of-fig",
            "vesper",
            "rosalya"
        ].forEach(function (key) {
            const scent = scents[key];

            addProduct({
                id: `parfum-${key}-100`,
                name: scent.name,
                uk: scent.uk,
                type: "ПАРФУМИ ДЛЯ ІНТЕР’ЄРУ · 100 ML",
                category: "Парфуми для інтер'єру 100 мл",
                description: scent.description,
                price: "990 ₴",

                image: key === "fairytale"
                    ? "images/gifts/gift_parfum_2.png"
                    : `images/perfumes/${scent.file}.png`,

                keywords:
                    "парфуми парфюм аромат аромати спрей 100 мл"
            });
        });

        [
            "leather-absolute",
            "amber-elite",
            "bois-noir",
            "golden-rum",
            "stone-salt",
            "drift",
            "freedom",
            "green-haven",
            "nocturne",
            "crown-of-olive",
            "shadow-of-fig",
            "vesper",
            "rosalya"
        ].forEach(function (key) {
            const scent = scents[key];

            addProduct({
                id: `parfum-${key}-15`,
                name: scent.name,
                uk: scent.uk,
                type: "ПАРФУМИ ДЛЯ ІНТЕР’ЄРУ · 15 ML",
                category: "Парфуми для інтер'єру 15 мл",
                description: scent.description,
                price: "385 ₴",

                image:
                    `images/perfumes/travel_${scent.file}.png`,

                keywords:
                    "парфуми парфюм аромат аромати спрей тревел міні 15 мл"
            });
        });

        const diffuserImages = {
            fairytale: "diffuser_11.png",
            "shadow-of-fig": "diffuser_13.png",
            nocturne: "diffuser_7.png",
            "crown-of-olive": "diffuser_3.png",
            "green-haven": "diffuser_10.png",
            vesper: "diffuser_8.png",
            rosalya: "diffuser_13.png",
            drift: "diffuser_7.png",
            freedom: "diffuser_3.png",
            "golden-rum": "diffuser_10.png",
            "stone-salt": "diffuser_8.png"
        };

        Object.keys(
            diffuserImages
        ).forEach(function (key) {
            const scent = scents[key];

            addProduct({
                id: `diffuser-${key}`,
                name: scent.name,
                uk: scent.uk,
                type: "АРОМАДИФУЗОР · 200 ML",
                category: "Аромадифузори",
                description: scent.description,
                price: "1590 ₴",

                image:
                    `images/aromadiffusers/${diffuserImages[key]}`,

                keywords:
                    "аромадифузор аромадифузори дифузор дифузори ароматизатор 200 мл"
            });
        });

        [
            "shadow-of-fig",
            "nocturne",
            "crown-of-olive",
            "green-haven",
            "vesper",
            "rosalya",
            "drift",
            "freedom",
            "golden-rum",
            "stone-salt"
        ].forEach(function (key) {
            const scent = scents[key];

            addProduct({
                id: `refill-${key}`,
                name: scent.name,
                uk: scent.uk,
                type: "РЕФІЛ · 275 ML",
                category: "Рефіли",
                description: scent.description,
                price: "1300 ₴",

                image:
                    `images/refills/${scent.file}_.png`,

                keywords:
                    "рефіл рефіли refill запасний блок наповнювач 275 мл"
            });
        });

        [
            {
                id: "discovery-set-card",
                name: "DISCOVERY SET",
                uk: "діскавері діскавері сет набір тестерів",
                type: "НАБІР · 4 × 3 ML",
                category: "Discovery Set",
                description:
                    "Оберіть 4 аромати для знайомства з колекцією",
                price: "395 ₴",
                image:
                    "images/discovery/discovery_17.png",
                keywords:
                    "тестери тестер пробники набір ароматів"
            },
            {
                id: "ten-mini-card",
                name: "TEN MINI",
                uk: "тен міні набір мініатюр",
                type:
                    "ПОДАРУНКОВИЙ НАБІР · 10 МІНІАТЮР",
                category:
                    "Подарункові набори",
                description:
                    "Повна колекція ароматів у форматі мініатюр",
                price: "750 ₴",
                image:
                    "images/gifts/ten mini_4 (1).png",
                keywords:
                    "подарунок подарунковий набір мініатюри"
            },
            {
                id: "certificate-card",
                name:
                    "ПОДАРУНКОВИЙ СЕРТИФІКАТ",
                uk:
                    "сертифікат подарунковий сертифікат",
                type:
                    "ЕЛЕКТРОННИЙ АБО ФІЗИЧНИЙ",
                category:
                    "Подарункові сертифікати",
                description:
                    "Свобода самостійно обрати аромат Mōnal",
                price: "від 1000 ₴",
                image:
                    "images/сертифікат_фон_.jpg",
                keywords:
                    "сертифікати подарунок електронний фізичний"
            },
            {
                id: "candles",
                name: "АРОМАСВІЧКИ",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Аромасвічки",
                description:
                    "Нова колекція для атмосфери дому",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "свічки свічка ароматичні незабаром"
            },
            {
                id: "car-sachets",
                name: "АРОМАСАШЕ ДЛЯ АВТО",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Аромасаше",
                description:
                    "Аромат для простору в дорозі",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "саше авто автомобіль машина незабаром"
            },
            {
                id: "wardrobe-sachets",
                name:
                    "АРОМАСАШЕ ДЛЯ ГАРДЕРОБУ",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Аромасаше",
                description:
                    "Делікатний аромат для текстилю",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "саше гардероб шафа текстиль незабаром"
            },
            {
                id: "hand-soap",
                name: "МИЛО ДЛЯ РУК",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Догляд",
                description:
                    "Ароматний ритуал щоденного догляду",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "мило для рук догляд незабаром"
            },
            {
                id: "hand-cream",
                name: "КРЕМ ДЛЯ РУК",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Догляд",
                description:
                    "Догляд, комфорт і аромат",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "крем для рук догляд незабаром"
            },
            {
                id: "shower-gel",
                name: "ГЕЛЬ ДЛЯ ДУШУ",
                uk: "",
                type: "НЕЗАБАРОМ",
                category: "Догляд",
                description:
                    "Свіжість і аромат у щоденному ритуалі",
                price: "",
                image: "images/далі буде.jpg",
                keywords:
                    "гель для душу догляд незабаром"
            }
        ].forEach(addProduct);

        return result;
    }    

    function getAliases(card, category, type) {
        const id = card.id;

        const source = normalize(
            `${id} ${category} ${type}`
        );

        const aliases = [];

        if (
            id.startsWith("parfum-") ||
            source.includes("парфум")
        ) {
            aliases.push(
                "парфуми парфюм аромат аромати спрей для дому"
            );
        }

        if (
            id.startsWith("diffuser-") ||
            source.includes("дифузор")
        ) {
            aliases.push(
                "аромадифузор аромадифузори дифузор дифузори ароматизатор"
            );
        }

        if (
            id.startsWith("refill-") ||
            source.includes("рефіл")
        ) {
            aliases.push(
                "рефіл рефіли refill запасний блок наповнювач"
            );
        }

        if (
            id === "discovery-set-card" ||
            source.includes("discovery")
        ) {
            aliases.push(
                "діскавері діскавері сет discovery тестери пробники набір"
            );
        }

        if (
            id === "certificate-card" ||
            source.includes("сертифікат")
        ) {
            aliases.push(
                "сертифікат сертифікати подарунковий подарунок"
            );
        }

        if (
            id === "ten-mini-card" ||
            source.includes("ten mini")
        ) {
            aliases.push(
                "тен міні ten mini набір мініатюр подарунковий набір"
            );
        }

        if (source.includes("подарунков")) {
            aliases.push(
                "подарунок подарунки набір набори"
            );
        }

        if (
            card.classList.contains(
                "catalog-card--soon"
            )
        ) {
            aliases.push(
                "незабаром скоро новинки"
            );
        }

        return aliases.join(" ");
    }

    function getName(card) {
        const nameElement = card.querySelector(
            '[itemprop="name"], ' +
            ".catalog-card-copy h3, " +
            ".catalog-card-copy h2, " +
            "h3, h2"
        );

        if (
            nameElement &&
            nameElement.textContent.trim()
        ) {
            return nameElement.textContent.trim();
        }

        const imageAlt = card
            .querySelector("img")
            ?.getAttribute("alt")
            ?.trim();

        if (imageAlt) {
            return imageAlt;
        }

        return card.id
            .replace(
                /^(parfum|diffuser|refill)-/,
                ""
            )
            .replace(
                /-(15|100|200|275)$/,
                ""
            )
            .replace(/-/g, " ")
            .toUpperCase();
    }

    function collectProducts(sourceDocument) {
        return Array.from(
            sourceDocument.querySelectorAll(
                ".catalog-card[id]"
            )
        ).map(function (card) {
            const section = card.closest(
                ".catalog-section"
            );

            const category =
                section
                    ?.querySelector("h2")
                    ?.textContent
                    .trim() ||
                "";

            const name = getName(card);

            const type =
                card
                    .querySelector(
                        ".catalog-card-type"
                    )
                    ?.textContent
                    .trim() ||
                category;

            const description =
                card
                    .querySelector(
                        '[itemprop="description"]'
                    )
                    ?.textContent
                    .trim() ||
                card
                    .querySelector(
                        ".catalog-card-copy p:last-of-type"
                    )
                    ?.textContent
                    .trim() ||
                "";

            const price =
                card
                    .querySelector(
                        ".catalog-card-offer span"
                    )
                    ?.textContent
                    .trim() ||
                card
                    .querySelector(
                        '[itemprop="price"]'
                    )
                    ?.getAttribute("content") ||
                "";

            const imagePath =
                card
                    .querySelector("img")
                    ?.getAttribute("src") ||
                "";

            const nameText = normalize(name);
            const categoryText = normalize(category);
            const typeText = normalize(type);

            return {
                id: card.id,
                name: name,
                type: type,
                category: category,
                description: description,

                price:
                    price &&
                    !price.includes("₴")
                        ? `${price} ₴`
                        : price,

                image: imagePath
                    ? new URL(
                        imagePath,
                        catalogUrl
                    ).href
                    : "",

                nameText: nameText,
                categoryText: categoryText,
                typeText: typeText,

                searchText: normalize([
                    name,
                    category,
                    type,
                    description,
                    card.id,
                    getAliases(
                        card,
                        category,
                        type
                    )
                ].join(" "))
            };
        });
    }

    async function loadProducts() {
        if (productsLoaded) {
            return products;
        }

        if (
            document.body.classList.contains(
                "catalog-page"
            )
        ) {
            products = collectProducts(document);
            productsLoaded = true;

            return products;
        }

        const response = await fetch(
            catalogUrl.href,
            {
                credentials: "same-origin",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Catalog load failed"
            );
        }

        const html = await response.text();

        const sourceDocument =
            new DOMParser().parseFromString(
                html,
                "text/html"
            );

        products = collectProducts(
            sourceDocument
        );

        productsLoaded = true;

        return products;
    }

    function positionPanel(trigger) {
        if (window.innerWidth <= 760) {
            const pageGap = 10;
            const top = 68;

            panel.style.left = `${pageGap}px`;
            panel.style.top = `${top}px`;
            panel.style.width = `calc(100vw - ${pageGap * 2}px)`;
            panel.style.maxHeight = `${Math.max(
                220,
                window.innerHeight - top - pageGap
            )}px`;

            return;
        }

        panel.style.width = "";

        const rect =
            trigger.getBoundingClientRect();

        const panelWidth = Math.min(
            430,
            window.innerWidth - 24
        );

        const pageGap =
            window.innerWidth <= 520
                ? 10
                : 12;

        let left =
            rect.right - panelWidth;

        left = Math.max(
            pageGap,
            Math.min(
                left,
                window.innerWidth -
                    panelWidth -
                    pageGap
            )
        );

        const top = Math.min(
            rect.bottom + 10,
            window.innerHeight - 100
        );

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;

        panel.style.maxHeight = `${Math.min(
            520,
            Math.max(
                220,
                window.innerHeight -
                    top -
                    12
            )
        )}px`;
    }

    function clearResults() {
        results.innerHTML = "";
    }

    function closeSearch() {
        panel.hidden = true;

        clearResults();

        input.value = "";

        status.textContent =
            "Введіть щонайменше 2 символи";
    }

    function openProduct(productId) {
        if (
            document.body.classList.contains(
                "catalog-page"
            )
        ) {
            const card =
                document.getElementById(
                    productId
                );

            closeSearch();

            if (!card) return;

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            window.setTimeout(function () {
                card.click();
            }, 220);

            return;
        }

        const targetUrl = new URL(
            catalogUrl.href
        );

        targetUrl.searchParams.set(
            "open",
            productId
        );

        window.location.href =
            targetUrl.href;
    }

    function createResult(product) {
        const button =
            document.createElement("button");

        button.className =
            "monal-search-result";

        button.type = "button";

        const image =
            document.createElement("img");

        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const copy =
            document.createElement("span");

        copy.className =
            "monal-search-result-copy";

        const type =
            document.createElement("span");

        type.className =
            "monal-search-result-type";

        type.textContent =
            product.type ||
            product.category;

        const name =
            document.createElement("span");

        name.className =
            "monal-search-result-name";

        name.textContent =
            product.name;

        const description =
            document.createElement("span");

        description.className =
            "monal-search-result-description";

        description.textContent =
            product.description;

        const price =
            document.createElement("span");

        price.className =
            "monal-search-result-price";

        price.textContent =
            product.price;

        copy.append(
            type,
            name
        );

        if (product.description) {
            copy.appendChild(
                description
            );
        }

        button.append(
            image,
            copy
        );

        if (product.price) {
            button.appendChild(
                price
            );
        }

        button.addEventListener(
            "click",
            function () {
                openProduct(
                    product.id
                );
            }
        );

        return button;
    }

    function renderResults() {
        const query = normalize(
            input.value
        );

        clearResults();

        if (query.length < 2) {
            status.textContent =
                "Введіть щонайменше 2 символи";

            return;
        }

        const queryParts = query
            .split(" ")
            .filter(Boolean);

        const matches = products
            .filter(function (product) {
                return queryParts.every(
                    function (part) {
                        return product
                            .searchText
                            .includes(part);
                    }
                );
            })
            .sort(function (
                first,
                second
            ) {
                function getScore(product) {
                    if (
                        product.nameText
                            .startsWith(query)
                    ) {
                        return 0;
                    }

                    if (
                        product.nameText
                            .includes(query)
                    ) {
                        return 1;
                    }

                    if (
                        product.categoryText
                            .includes(query)
                    ) {
                        return 2;
                    }

                    if (
                        product.typeText
                            .includes(query)
                    ) {
                        return 3;
                    }

                    return 4;
                }

                return (
                    getScore(first) -
                    getScore(second)
                );
            });

        if (!matches.length) {
            status.textContent =
                "Нічого не знайдено. Спробуйте іншу назву.";

            return;
        }

        status.textContent =
            `Знайдено: ${matches.length}`;

        matches
            .slice(0, 40)
            .forEach(function (product) {
                results.appendChild(
                    createResult(product)
                );
            });
    }

    function openSearch(event) {
        event.stopPropagation();

        if (
            !panel.hidden &&
            lastTrigger === event.currentTarget
        ) {
            closeSearch();
            return;
        }

        lastTrigger = event.currentTarget;

        const mobileMenu = lastTrigger.closest(
            ".home-mobile-menu"
        );

        if (mobileMenu) {
            mobileMenu.classList.remove("open");
            document.body.classList.remove(
                "mobile-menu-open"
            );

            const burgerButton =
                document.querySelector(
                    ".home-burger"
                );

            if (burgerButton) {
                burgerButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }

        positionPanel(lastTrigger);

        panel.hidden = false;

        input.focus();
    }

    triggers.forEach(
        function (trigger) {
            trigger.addEventListener(
                "click",
                openSearch
            );
        }
    );

    input.addEventListener(
        "input",
        renderResults
    );

    input.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key !== "Enter"
            ) {
                return;
            }

            const firstResult =
                results.querySelector(
                    ".monal-search-result"
                );

            if (firstResult) {
                event.preventDefault();
                firstResult.click();
            }
        }
    );

    closeButton.addEventListener(
        "click",
        closeSearch
    );

    document.addEventListener(
        "click",
        function (event) {
            if (panel.hidden) return;

            if (
                panel.contains(
                    event.target
                )
            ) {
                return;
            }

            const clickedTrigger =
                triggers.some(
                    function (trigger) {
                        return trigger.contains(
                            event.target
                        );
                    }
                );

            if (clickedTrigger) return;

            closeSearch();
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                !panel.hidden
            ) {
                closeSearch();
            }
        }
    );

    window.addEventListener(
        "resize",
        function () {
            if (
                !panel.hidden &&
                lastTrigger
            ) {
                positionPanel(
                    lastTrigger
                );
            }
        }
    );

    if (
        document.body.classList.contains(
            "catalog-page"
        )
    ) {
        const productId =
            new URLSearchParams(
                window.location.search
            ).get("open");

        if (productId) {
            const cleanUrl =
                new URL(
                    window.location.href
                );

            cleanUrl.searchParams.delete(
                "open"
            );

            window.history.replaceState(
                {},
                "",
                cleanUrl.pathname +
                    cleanUrl.search +
                    cleanUrl.hash
            );

            window.setTimeout(
                function () {
                    const card =
                        document.getElementById(
                            productId
                        );

                    if (!card) return;

                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    card.click();
                },
                220
            );
        }
    }
})();