function formatMonalText(value) {
    const brandMarker = "\uE000";

    return String(value ?? "")
        .replace(/m[ōo]nal/giu, brandMarker)
        .toLocaleUpperCase("uk-UA")
        .replaceAll(brandMarker, "Monal");
}

const PARFUM_MODAL_PRODUCTS = {
    "fairytale": {
        name: "FAIRYTALE",
        pyramid: {
            top: "коньяк, кориця",
            heart: "амбра, ваніль",
            base: "боби тонка, сандал"
        },
        description: "Теплий і глибокий аромат із пряно-коньячним стартом. Амбра та ваніль створюють відчуття затишку, а боби тонка й сандал формують м’який деревний шлейф.",
        longevity: 5,
        intensity: 4,
        volumes: {
            "100": {
                price: 990,
                image: "images/gifts/gift_parfum_2.png",
                cartName: "FAIRYTALE"
            }
        }
    },
    "golden-rum": {
        name: "GOLDEN RUM",
        pyramid: {
            top: "ром, кориця",
            heart: "мускатний горіх, ваніль",
            base: "кедр, сандал"
        },
        description: "Глибокий і затишний аромат із пряно-ромовим стартом. Мускатний горіх і ваніль додають м’якого тепла, а кедр і сандал залишають спокійний деревний шлейф.",
        longevity: 4,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_golden_rum.png",
                cartName: "GOLDEN RUM 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/golden_rum.png",
                cartName: "GOLDEN RUM"
            }
        }
    },
    "stone-salt": {
        name: "STONE & SALT",
        pyramid: {
            top: "морська сіль, грейпфрут",
            heart: "цитруси, шавлія",
            base: "морські водорості"
        },
        description: "Свіжий морський аромат із солонуватими акордами та яскравою цитрусовою свіжістю. Шавлія додає сухої зеленості й відчуття природної рівноваги.",
        longevity: 3,
        intensity: 3,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_stone_salt.png",
                cartName: "STONE & SALT 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/stone_salt.png",
                cartName: "STONE & SALT"
            }
        }
    },
    "drift": {
        name: "DRIFT",
        pyramid: {
            top: "морські ноти, бергамот",
            heart: "розмарин, шавлія, герань",
            base: "ладан, пачулі"
        },
        description: "Густий, глибокий аромат із виразним ладаном у центрі звучання. Морські ноти й бергамот додають прохолодного відтінку та пом’якшують смолисту теплоту композиції.",
        longevity: 4,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_drift.png",
                cartName: "DRIFT 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/drift.png",
                cartName: "DRIFT"
            }
        }
    },
    "freedom": {
        name: "FREEDOM",
        pyramid: {
            top: "фісташка, бергамот, кардамон",
            heart: "рожевий перець, тубероза",
            base: "іланг-іланг, жасмин, боби тонка"
        },
        description: "Кремово-ніжний аромат із теплим акцентом фісташки, бергамоту та кардамону. Тубероза, жасмин і боби тонка створюють м’яке, об’ємне звучання.",
        longevity: 3,
        intensity: 3,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_freedom.png",
                cartName: "FREEDOM 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/freedom.png",
                cartName: "FREEDOM"
            }
        }
    },
    "green-haven": {
        name: "GREEN HAVEN",
        pyramid: {
            top: "мандарин, лимон",
            heart: "бергамот, імбир",
            base: "жасмин, білий чай"
        },
        description: "Свіжий цитрусовий аромат із сонячним стартом мандарина й лимона. Бергамот та імбир додають глибини, а жасмин і білий чай залишають чистий, спокійний шлейф.",
        longevity: 2,
        intensity: 2,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_green_haven.png",
                cartName: "GREEN HAVEN 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/green_haven.png",
                cartName: "GREEN HAVEN"
            }
        }
    },
    "nocturne": {
        name: "NOCTURNE",
        pyramid: {
            top: "мандарин, червоне яблуко",
            heart: "шавлія, бурбонський перець",
            base: "деревина, тютюн, пачулі"
        },
        description: "Соковитий фруктовий старт переходить у пряне серце шавлії та бурбонського перцю. Деревина, тютюн і пачулі формують теплий, об’ємний та впевнений шлейф.",
        longevity: 4,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_nocturne.png",
                cartName: "NOCTURNE 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/nocturne.png",
                cartName: "NOCTURNE"
            }
        }
    },
    "crown-of-olive": {
        name: "CROWN OF OLIVE",
        pyramid: {
            top: "жасмин, персик, кедр, груша, аніс",
            heart: "лаванда, лимон, троянда",
            base: "олива, фіалка, деревні ноти"
        },
        description: "Квітково-фруктовий аромат із м’яким персиком, жасмином і легкою пряністю. Олива, фіалка та деревні ноти створюють теплий, округлий і комфортний фінал.",
        longevity: 3,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_crown_of_olive.png",
                cartName: "CROWN OF OLIVE 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/crown_of_olive.png",
                cartName: "CROWN OF OLIVE"
            }
        }
    },
    "shadow-of-fig": {
        name: "SHADOW OF FIG",
        pyramid: {
            top: "озон, фрезія",
            heart: "жасмин, герань, вишневий цвіт, інжир, бамбук",
            base: "пудра, пачулі, деревні ноти"
        },
        description: "Повітряний, чистий аромат з озоном і фрезією. Інжир та квіткові ноти додають ніжності, а пудрово-деревна база формує спокійний, округлий шлейф.",
        longevity: 3,
        intensity: 3,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_shadow_of_fig.png",
                cartName: "SHADOW OF FIG 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/shadow_of_fig.png",
                cartName: "SHADOW OF FIG"
            }
        }
    },
    "vesper": {
        name: "VESPER",
        pyramid: {
            top: "лаванда, бергамот",
            heart: "перець, кедр, тютюн",
            base: "ветивер, пачулі, сандал, мускус, дерево"
        },
        description: "Глибокий деревно-пряний аромат зі свіжим лавандово-цитрусовим стартом. Перець, кедр і тютюн переходять в оксамитовий шлейф ветиверу, сандалу та мускусу.",
        longevity: 4,
        intensity: 3,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_vesper.png",
                cartName: "VESPER 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/vesper.png",
                cartName: "VESPER"
            }
        }
    },
    "rosalya": {
        name: "ROSALYA",
        pyramid: {
            top: "рожевий перець, бергамот",
            heart: "троянда, жасмин",
            base: "ваніль, амбра"
        },
        description: "Витончений квітковий аромат із пряністю рожевого перцю та світлим бергамотом. Троянда й жасмин створюють тепле серце, а ваніль та амбра — м’який солодкий шлейф.",
        longevity: 3,
        intensity: 3,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_rosalya.png",
                cartName: "ROSALYA 15 ml"
            },
            "100": {
                price: 990,
                image: "images/perfumes/rosalya.png",
                cartName: "ROSALYA"
            }
        }
    },
    "leather-absolute": {
        name: "LEATHER ABSOLUTE",
        pyramid: {
            top: "шафран, кардамон, рожевий перець",
            heart: "шкіра, кедр, фіалка",
            base: "пачулі, амбра, замша"
        },
        description: "Щільний, виразний аромат із теплим пряним стартом. Гладка шкіра, кедр і фіалка переходять у глибокий шлейф пачулі, амбри та м’якої замші.",
        longevity: 4,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_black_leather_.png",
                cartName: "LEATHER ABSOLUTE 15 ml"
            }
        }
    },
    "amber-elite": {
        name: "AMBER ELITE",
        pyramid: {
            top: "бергамот, кориця",
            heart: "бензоїн, лабданум, ваніль",
            base: "боби тонка, сандал, амбра"
        },
        description: "Теплий, густий аромат із пряною корицею та легким відблиском бергамота. Бензоїн, лабданум і ваніль створюють округле смолисте звучання з глибокою амбровою базою.",
        longevity: 4,
        intensity: 5,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_black_amber_.png",
                cartName: "AMBER ELITE 15 ml"
            }
        }
    },
    "bois-noir": {
        name: "BOIS NOIR",
        pyramid: {
            top: "гваякове дерево, кедр",
            heart: "сандал, пачулі",
            base: "смоли, лабданум, мускус"
        },
        description: "Темний деревний аромат із сухим і глибоким стартом. Гваякове дерево, кедр та сандал створюють зібране звучання, яке завершується смолами, лабданумом і мускусом.",
        longevity: 4,
        intensity: 4,
        volumes: {
            "15": {
                price: 385,
                image: "images/perfumes/travel_black_bois_.png",
                cartName: "BOIS NOIR 15 ml"
            }
        }
    }
};

const DISCOVERY_TESTER_IMAGES = {
    "golden-rum": "images/discovery/discovery_golden_rum.png",
    "stone-salt": "images/discovery/discovery_stone_salt.png",
    "drift": "images/discovery/discovery_drift.png",
    "freedom": "images/discovery/discovery_freedom.png",
    "green-haven": "images/discovery/discovery_green_haven.png",
    "nocturne": "images/discovery/discovery_nocturne.png",
    "crown-of-olive": "images/discovery/discovery_crown_of_olive.png",
    "shadow-of-fig": "images/discovery/discovery_shadow_of_fig.png",
    "vesper": "images/discovery/discovery_vesper.png",
    "rosalya": "images/discovery/discovery_rosalya.png"
};

Object.entries(DISCOVERY_TESTER_IMAGES).forEach(function ([productKey, image]) {
    const product = PARFUM_MODAL_PRODUCTS[productKey];

    if (!product) return;

    product.volumes["3"] = {
        price: 100,
        image: image,
        buttonLabel: "ТЕСТЕР 3 ML",
        cartName: `Тестер ${product.name} 3 ml`,
        cartLabel: "Тестери"
    };
});

const DIFFUSER_MODAL_IMAGES = {
    "fairytale": "images/aromadiffusers/diffuser_11.png",
    "shadow-of-fig": "images/aromadiffusers/diffuser_13.png",
    "nocturne": "images/aromadiffusers/diffuser_7.png",
    "crown-of-olive": "images/aromadiffusers/diffuser_3.png",
    "green-haven": "images/aromadiffusers/diffuser_10.png",
    "vesper": "images/aromadiffusers/diffuser_8.png",
    "rosalya": "images/aromadiffusers/diffuser_13.png",
    "drift": "images/aromadiffusers/diffuser_7.png",
    "freedom": "images/aromadiffusers/diffuser_3.png",
    "golden-rum": "images/aromadiffusers/diffuser_10.png",
    "stone-salt": "images/aromadiffusers/diffuser_8.png"
};

const REFILL_MODAL_IMAGES = {
    "shadow-of-fig": "images/refills/shadow_of_fig_.png",
    "nocturne": "images/refills/nocturne_.png",
    "crown-of-olive": "images/refills/crown_of_olive_.png",
    "green-haven": "images/refills/green_haven_.png",
    "vesper": "images/refills/vesper_.png",
    "rosalya": "images/refills/rosalya_.png",
    "drift": "images/refills/drift_.png",
    "freedom": "images/refills/freedom_.png",
    "golden-rum": "images/refills/golden_rum_.png",
    "stone-salt": "images/refills/stone_salt_.png"
};

function getModalProduct(productType, productKey) {
    const aroma = PARFUM_MODAL_PRODUCTS[productKey];

    if (!aroma) return null;

    if (productType === "parfum") {
        return {
            ...aroma,
            typeLabel: "ПАРФУМИ ДЛЯ ІНТЕР’ЄРУ",
            cartLabel: "Парфуми для інтер’єру",
            volumes: aroma.volumes
        };
    }

    if (productType === "diffuser" && DIFFUSER_MODAL_IMAGES[productKey]) {
        return {
            ...aroma,
            typeLabel: "АРОМАДИФУЗОР",
            cartLabel: "Аромадифузор",
            volumes: {
                "200": {
                    price: 1590,
                    image: DIFFUSER_MODAL_IMAGES[productKey],
                    cartName: aroma.name
                }
            }
        };
    }

    if (productType === "refill" && REFILL_MODAL_IMAGES[productKey]) {
        return {
            ...aroma,
            typeLabel: "РЕФІЛ ДЛЯ АРОМАДИФУЗОРА",
            cartLabel: "Рефіл",
            volumes: {
                "275": {
                    price: 1300,
                    image: REFILL_MODAL_IMAGES[productKey],
                    cartName: aroma.name
                }
            }
        };
    }

    return null;
}

(function initProductModal() {
    const modal = document.getElementById("parfum-modal");

    if (!modal) return;

    const modalDialog = modal.querySelector(".product-modal-dialog");
    const modalType = document.getElementById("product-modal-type");
    const modalImage = document.getElementById("parfum-modal-image");
    const galleryPrevButton = document.getElementById("parfum-modal-gallery-prev");
    const galleryNextButton = document.getElementById("parfum-modal-gallery-next");
    const modalName = document.getElementById("parfum-modal-name");
    const modalTopNotes = document.getElementById("parfum-modal-top-notes");
    const modalHeartNotes = document.getElementById("parfum-modal-heart-notes");
    const modalBaseNotes = document.getElementById("parfum-modal-base-notes");
    const modalDescription = document.getElementById("parfum-modal-description");
    const modalLongevity = document.getElementById("parfum-modal-longevity");
    const modalIntensity = document.getElementById("parfum-modal-intensity");
    const modalVolumes = document.getElementById("parfum-modal-volumes");
    const modalQuantity = document.getElementById("parfum-modal-quantity");
    const modalPrice = document.getElementById("parfum-modal-price");
    const minusButton = document.getElementById("parfum-modal-minus");
    const plusButton = document.getElementById("parfum-modal-plus");
    const buyButton = document.getElementById("parfum-modal-buy");
    const closeButton = modal.querySelector(".product-modal-close");

    let currentProduct = null;
    let currentProductType = null;
    let currentProductKey = null;
    let currentVolume = null;
    let currentQuantity = 1;
    let currentGalleryImages = [];
    let currentGalleryIndex = 0;
    let touchStartX = 0;
    let lastFocusedCard = null;

    function makeRating(value) {
        return Array.from({ length: 5 }, function (_, index) {
            return index < value ? "●" : "○";
        }).join(" ");
    }

    function formatPrice(value) {
        return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
    }
    
    function getCurrentGalleryImages() {
        if (!currentProduct || !currentProductKey || !currentVolume) {
            return [];
        }

        if (currentProductType === "parfum") {
            if (currentVolume === "3") {
                return discoveryGalleries[currentProductKey] || [];
            }

            if (currentVolume === "15") {
                return parfumsGalleries[`${currentProductKey}-15`] || [];
            }

            return parfumsGalleries[currentProductKey] || [];
        }

        if (currentProductType === "diffuser") {
            return aromadiffusersGalleries[currentProductKey] || [];
        }

        if (currentProductType === "refill") {
            return refillsGalleries[currentProductKey] || [];
        }

        return [];
    }

    function updateGallery() {
        const selectedVariant = currentProduct?.volumes?.[currentVolume];

        currentGalleryImages = getCurrentGalleryImages();

        if (!currentGalleryImages.length && selectedVariant?.image) {
            currentGalleryImages = [selectedVariant.image];
        }

        if (currentGalleryIndex >= currentGalleryImages.length) {
            currentGalleryIndex = 0;
        }

        const image = currentGalleryImages[currentGalleryIndex];

        if (image) {
            modalImage.src = image;
        }

        const hasMultipleImages = currentGalleryImages.length > 1;

        galleryPrevButton.hidden = !hasMultipleImages;
        galleryNextButton.hidden = !hasMultipleImages;
    }

    function showPreviousGalleryImage() {
        if (currentGalleryImages.length < 2) return;

        currentGalleryIndex =
            (currentGalleryIndex - 1 + currentGalleryImages.length) %
            currentGalleryImages.length;

        updateGallery();
    }

    function showNextGalleryImage() {
        if (currentGalleryImages.length < 2) return;

        currentGalleryIndex =
            (currentGalleryIndex + 1) %
            currentGalleryImages.length;

        updateGallery();
    }

    function updateOrderState() {
        if (!currentProduct || !currentVolume) return;

        const selectedVariant = currentProduct.volumes[currentVolume];

        updateGallery();
        modalImage.alt = `${currentProduct.typeLabel} Monal ${currentProduct.name} ${currentVolume} ml`;
        modalQuantity.textContent = String(currentQuantity);
        modalPrice.textContent = formatPrice(selectedVariant.price * currentQuantity);

        modalVolumes.querySelectorAll("button").forEach(function (button) {
            const isActive = button.dataset.volume === currentVolume;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    function selectVolume(volume) {
        if (!currentProduct || !currentProduct.volumes[volume]) return;

        currentVolume = volume;
        currentQuantity = 1;
        currentGalleryIndex = 0;
        updateOrderState();
    }

    function renderVolumeButtons(product) {
        modalVolumes.innerHTML = "";

        Object.keys(product.volumes)
            .sort(function (a, b) { return Number(a) - Number(b); })
            .forEach(function (volume) {
                const button = document.createElement("button");
                button.type = "button";
                button.dataset.volume = volume;
                button.textContent = product.volumes[volume].buttonLabel || volume + " ML";
                button.addEventListener("click", function () {
                    selectVolume(volume);
                });
                modalVolumes.appendChild(button);
            });
    }

    function openModal(productType, productKey, initialVolume, card) {
        const product = getModalProduct(productType, productKey);

        if (!product) return;

        currentProduct = product;
        currentProductType = productType;
        currentProductKey = productKey;
        currentVolume = product.volumes[initialVolume]
            ? initialVolume
            : Object.keys(product.volumes)[0];
        currentQuantity = 1;
        currentGalleryIndex = 0;
        lastFocusedCard = card;

        modalType.textContent =
            formatMonalText(product.typeLabel);

        modalName.textContent =
            formatMonalText(product.name);

        modalTopNotes.textContent =
            formatMonalText(product.pyramid.top);

        modalHeartNotes.textContent =
            formatMonalText(product.pyramid.heart);

        modalBaseNotes.textContent =
            formatMonalText(product.pyramid.base);

        modalDescription.textContent =
            formatMonalText(product.description);
        modalLongevity.textContent = makeRating(product.longevity);
        modalIntensity.textContent = makeRating(product.intensity);

        renderVolumeButtons(product);
        updateOrderState();

        modal.hidden = false;
        document.body.classList.add("catalog-modal-open");
        modalDialog.scrollTop = 0;
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove("catalog-modal-open");

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    }

    document.querySelectorAll(
        '.catalog-card[id^="parfum-"], .catalog-card[id^="diffuser-"], .catalog-card[id^="refill-"]'
    ).forEach(function (card) {
        card.setAttribute("aria-haspopup", "dialog");

        card.addEventListener("click", function (event) {
            const parfumMatch = card.id.match(/^parfum-(.+)-(15|100)$/);
            const diffuserMatch = card.id.match(/^diffuser-(.+)$/);
            const refillMatch = card.id.match(/^refill-(.+)$/);

            let productType = "";
            let productKey = "";
            let initialVolume = "";

            if (parfumMatch) {
                productType = "parfum";
                productKey = parfumMatch[1];
                initialVolume = parfumMatch[2];
            } else if (diffuserMatch) {
                productType = "diffuser";
                productKey = diffuserMatch[1];
                initialVolume = "200";
            } else if (refillMatch) {
                productType = "refill";
                productKey = refillMatch[1];
                initialVolume = "275";
            }

            if (!productType || !getModalProduct(productType, productKey)) return;

            event.preventDefault();
            openModal(productType, productKey, initialVolume, card);
        });
    });

    modal.querySelectorAll("[data-close-parfum-modal]").forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    minusButton.addEventListener("click", function () {
        currentQuantity = Math.max(1, currentQuantity - 1);
        updateOrderState();
    });

    plusButton.addEventListener("click", function () {
        currentQuantity = Math.min(99, currentQuantity + 1);
        updateOrderState();
    });

    buyButton.addEventListener("click", function () {
        if (!currentProduct || !currentVolume || typeof window.addToCart !== "function") return;

        const selectedVariant = currentProduct.volumes[currentVolume];

        for (let index = 0; index < currentQuantity; index += 1) {
            window.addToCart(
                selectedVariant.cartName,
                selectedVariant.price,
                selectedVariant.cartLabel || currentProduct.cartLabel
            );
        }

        closeModal();
    });
    
    galleryPrevButton.addEventListener("click", showPreviousGalleryImage);
    galleryNextButton.addEventListener("click", showNextGalleryImage);

    modalImage.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    modalImage.addEventListener("touchend", function (event) {
        const touchEndX = event.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 40) return;

        if (difference > 0) {
            showNextGalleryImage();
        } else {
            showPreviousGalleryImage();
        }
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
})();

const DISCOVERY_MODAL_ORDER = [
    "vesper",
    "nocturne",
    "rosalya",
    "drift",
    "stone-salt",
    "freedom",
    "crown-of-olive",
    "shadow-of-fig",
    "golden-rum",
    "green-haven"
];

const DISCOVERY_MODAL_SUBTITLES = {
    "vesper": "Вечірня зоря",
    "nocturne": "Полотно ночі",
    "rosalya": "Розалія",
    "drift": "Дрифтинг",
    "stone-salt": "Камінь і сіль",
    "freedom": "Свобода",
    "crown-of-olive": "Крона оливи",
    "shadow-of-fig": "Тінь смоковниці",
    "golden-rum": "Золотий ром",
    "green-haven": "Зелена гавань"
};

(function initDiscoverySetModal() {
    const modal = document.getElementById("discovery-modal");
    const modalCard = document.getElementById("discovery-set-card");
    const modalDialog = modal?.querySelector(".discovery-modal-dialog");
    const productsContainer = document.getElementById("discovery-modal-products");
    const closeButton = modal?.querySelector(".discovery-modal-close");

    if (!modal || !modalCard || !modalDialog || !productsContainer || !closeButton) return;

    let discoverySet = [];
    let lastFocusedCard = null;

    function makeRating(value) {
        return Array.from({ length: 5 }, function (_, index) {
            return index < value ? "●" : "○";
        }).join(" ");
    }

    function createProductRow(productKey) {
        const product = PARFUM_MODAL_PRODUCTS[productKey];
        const images = discoveryGalleries[productKey] || [];

        if (!product || !images.length) return "";

        return `
            <article class="product-row discovery-row" data-discovery-product="${productKey}">
                <div class="product-media">
                    <div class="discovery-gallery" data-gallery="${productKey}">
                        <button class="gallery-prev" type="button" aria-label="Попереднє фото">‹</button>
                        <img
                            src="${images[0]}"
                            alt="Мініатюра парфумів для дому Monal ${product.name}"
                            class="product-diffuser"
                        >
                        <button class="gallery-next" type="button" aria-label="Наступне фото">›</button>
                    </div>

                    <div class="product-modal-ratings" aria-label="Властивості аромату">
                        <div class="product-modal-rating-row">
                            <span>Стійкість</span>
                            <span>${makeRating(product.longevity)}</span>
                        </div>
                        <div class="product-modal-rating-row">
                            <span>Інтенсивність</span>
                            <span>${makeRating(product.intensity)}</span>
                        </div>
                    </div>
                </div>

                <div class="product-text">
                    <div class="discovery-modal-product-type">ПАРФУМИ ДЛЯ ІНТЕР’ЄРУ · 3 ML</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-subtitle">${formatMonalText(DISCOVERY_MODAL_SUBTITLES[productKey])}</div>

                    <div class="product-modal-pyramid" aria-label="Піраміда аромату">
                        <p><span>ВЕРХНІ НОТИ:</span> <strong>${formatMonalText(product.pyramid.top)}</strong></p>
                        <p><span>СЕРЦЕ:</span> <strong>${formatMonalText(product.pyramid.heart)}</strong></p>
                        <p><span>БАЗА:</span> <strong>${formatMonalText(product.pyramid.base)}</strong></p>
                    </div>

                    <p class="product-modal-description">${formatMonalText(product.description)}</p>

                    <button class="add-to-set" type="button">Додати в сет</button>
                </div>
            </article>
        `;
    }

    function renderProducts() {
        productsContainer.innerHTML = DISCOVERY_MODAL_ORDER
            .map(createProductRow)
            .join("");
    }

    function renderDiscoverySet() {
        const selectedCount = discoverySet.length;
        const remainingCount = Math.max(0, 4 - selectedCount);

        const remainingText =
            remainingCount === 1
                ? "1 аромат"
                : `${remainingCount} аромати`;

        modal.querySelectorAll(".discovery-box").forEach(function (box) {
            const title = box.querySelector(".discovery-title");
            const list = box.querySelector(".discovery-items");
            const hint = box.querySelector(".discovery-hint");
            const buyButton = box.querySelector(".buy-discovery-btn");

            title.innerHTML = `
                <span>ВАШ DISCOVERY SET</span>
                <strong>${selectedCount} / 4</strong>
            `;

            list.innerHTML = "";

            discoverySet.forEach(function (name, index) {
                const item = document.createElement("li");
                const number = document.createElement("span");
                const itemName = document.createElement("span");
                const removeButton = document.createElement("button");

                item.className =
                    "discovery-item discovery-slot";

                number.className =
                    "discovery-slot-number";

                itemName.className =
                    "discovery-slot-name";

                number.textContent =
                    `${index + 1}.`;

                itemName.textContent =
                    name;

                removeButton.className =
                    "remove-item";

                removeButton.type =
                    "button";

                removeButton.dataset.index =
                    String(index);

                removeButton.setAttribute(
                    "aria-label",
                    `Видалити ${name} із сету`
                );

                removeButton.textContent =
                    "✕";

                item.append(
                    number,
                    itemName,
                    removeButton
                );

                list.appendChild(item);
            });

            for (
                let index = selectedCount;
                index < 4;
                index += 1
            ) {
                const item =
                    document.createElement("li");

                const number =
                    document.createElement("span");

                const placeholder =
                    document.createElement("span");

                item.className =
                    "discovery-slot discovery-slot-empty";

                number.className =
                    "discovery-slot-number";

                placeholder.className =
                    "discovery-slot-placeholder";

                number.textContent =
                    `${index + 1}.`;

                placeholder.textContent =
                    "ОБЕРІТЬ АРОМАТ";

                item.append(
                    number,
                    placeholder
                );

                list.appendChild(item);
            }

            if (selectedCount < 4) {
                hint.textContent =
                    `Оберіть ще ${remainingText}`;

                buyButton.textContent =
                    `Оберіть ще ${remainingText}`;

                buyButton.disabled = true;
            } else {
                hint.textContent =
                    "✓ НАБІР ГОТОВИЙ";

                buyButton.textContent =
                    "Додати Discovery Set у кошик";

                buyButton.disabled = false;
            }
        });

        modal
            .querySelectorAll(".add-to-set")
            .forEach(function (button) {
                const isFull =
                    selectedCount >= 4;

                button.disabled =
                    isFull;

                button.textContent =
                    isFull
                        ? "Сет уже заповнений"
                        : "Додати в сет";
            });
    }

    function openModal(event) {
        event.preventDefault();
        lastFocusedCard = modalCard;
        modal.hidden = false;
        document.body.classList.add("catalog-modal-open");
        productsContainer.scrollTop = 0;
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove("catalog-modal-open");

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    }

    renderProducts();

    if (typeof initGalleries === "function") {
        initGalleries(".discovery-modal .discovery-gallery", discoveryGalleries);
    }

    if (typeof initSwipe === "function") {
        initSwipe(".discovery-modal .discovery-gallery", discoveryGalleries);
    }

    renderDiscoverySet();

    modalCard.setAttribute("aria-haspopup", "dialog");
    modalCard.setAttribute("aria-controls", "discovery-modal");
    modalCard.addEventListener("click", openModal);

    modal.querySelectorAll("[data-close-discovery-modal]").forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", function (event) {
        const addButton = event.target.closest(".add-to-set");
        const removeButton = event.target.closest(".remove-item");
        const buyButton = event.target.closest(".buy-discovery-btn");

        if (addButton) {
            const productRow = addButton.closest(".discovery-row");
            const productKey = productRow?.dataset.discoveryProduct;
            const product = PARFUM_MODAL_PRODUCTS[productKey];

            if (!product) return;

            if (discoverySet.length >= 4) {
                return;
            }

            discoverySet.push(product.name);
            renderDiscoverySet();
            return;
        }

        if (removeButton) {
            const index = Number(removeButton.dataset.index);

            if (Number.isNaN(index)) return;

            discoverySet.splice(index, 1);
            renderDiscoverySet();
            return;
        }

        if (buyButton && !buyButton.disabled) {
            const setsCount = discoverySet.length / 4;

            if (setsCount <= 0 || typeof window.addToCart !== "function") return;

            for (let index = 0; index < setsCount; index += 1) {
                window.addToCart("Discovery set (4 × 3 ml)", 395);
            }

            localStorage.setItem("discoverySetItems", JSON.stringify(discoverySet));
            discoverySet = [];
            renderDiscoverySet();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
})();

(function initCertificateModal() {
    const modal = document.getElementById("certificate-modal");
    const modalCard = document.getElementById("certificate-card");
    const modalDialog = modal?.querySelector(".product-modal-dialog");
    const closeButton = modal?.querySelector(".product-modal-close");

    const recipientModal = document.getElementById("certificate-recipient-modal");
    const recipientDialog = recipientModal?.querySelector(".certificate-recipient-dialog");
    const recipientCloseButton = recipientModal?.querySelector(".certificate-recipient-close");

    const typeButtons = modal?.querySelectorAll("[data-certificate-type]");
    const nominalButtons = modal?.querySelectorAll("[data-certificate-nominal]");

    const priceElement = document.getElementById("certificate-modal-price");
    const buyButton = document.getElementById("certificate-modal-buy");

    const recipientStep = document.getElementById("certificate-recipient-step");
    const recipientSelfButton = document.getElementById("certificate-recipient-self");
    const recipientGiftButton = document.getElementById("certificate-recipient-gift");

    const giftForm = document.getElementById("certificate-gift-form");
    const giftBackButton = document.getElementById("certificate-gift-back");
    const giftSubmitButton = document.getElementById("certificate-gift-submit");

    const recipientNameInput = document.getElementById("certificate-recipient-name");
    const recipientPhoneInput = document.getElementById("certificate-recipient-phone");
    const recipientTelegramInput = document.getElementById("certificate-recipient-telegram");
    const recipientEmailInput = document.getElementById("certificate-recipient-email");
    const greetingTextInput = document.getElementById("certificate-greeting-text");
    const greetingDateInput = document.getElementById("certificate-greeting-date");

    const phoneField = document.getElementById("certificate-phone-field");
    const telegramField = document.getElementById("certificate-telegram-field");
    const dateField = document.getElementById("certificate-date-field");

    if (
        !modal ||
        !modalCard ||
        !modalDialog ||
        !closeButton ||
        !recipientModal ||
        !recipientDialog ||
        !recipientCloseButton ||
        !typeButtons?.length ||
        !nominalButtons?.length ||
        !priceElement ||
        !buyButton ||
        !recipientStep ||
        !recipientSelfButton ||
        !recipientGiftButton ||
        !giftForm ||
        !giftBackButton ||
        !giftSubmitButton ||
        !recipientNameInput ||
        !recipientPhoneInput ||
        !recipientTelegramInput ||
        !recipientEmailInput ||
        !greetingTextInput ||
        !greetingDateInput ||
        !phoneField ||
        !telegramField ||
        !dateField
    ) return;

    let selectedCertificateType = null;
    let selectedNominal = null;

    function formatPrice(value) {
        return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
    }

    function clearGiftFields() {
        recipientNameInput.value = "";
        recipientPhoneInput.value = "";
        recipientTelegramInput.value = "";
        recipientEmailInput.value = "";
        greetingTextInput.value = "";
        greetingDateInput.value = "";
    }

    function updateGiftFieldsByType() {
        const isPhysical = selectedCertificateType === "фізичний";

        recipientPhoneInput.disabled = isPhysical;
        recipientTelegramInput.disabled = isPhysical;
        greetingDateInput.disabled = isPhysical;

        phoneField.classList.toggle(
            "certificate-field-disabled",
            isPhysical
        );

        telegramField.classList.toggle(
            "certificate-field-disabled",
            isPhysical
        );

        dateField.classList.toggle(
            "certificate-field-disabled",
            isPhysical
        );

        if (isPhysical) {
            recipientPhoneInput.value = "";
            recipientTelegramInput.value = "";
            greetingDateInput.value = "";
        }
    }

    function resetRecipientModal() {
        recipientStep.hidden = false;
        giftForm.hidden = true;

        recipientSelfButton.classList.remove("active");
        recipientGiftButton.classList.remove("active");

        recipientSelfButton.setAttribute("aria-pressed", "false");
        recipientGiftButton.setAttribute("aria-pressed", "false");

        clearGiftFields();
        updateGiftFieldsByType();
    }

    function updateCertificateState() {
        priceElement.textContent = selectedNominal
            ? formatPrice(selectedNominal)
            : "—";

        buyButton.disabled = !(
            selectedCertificateType &&
            selectedNominal
        );
    }

    function resetCertificateState() {
        selectedCertificateType = null;
        selectedNominal = null;

        typeButtons.forEach(function (button) {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        nominalButtons.forEach(function (button) {
            button.classList.remove("active");
            button.setAttribute("aria-pressed", "false");
        });

        resetRecipientModal();
        updateCertificateState();
    }

    function openRecipientModal() {
        if (
            !selectedCertificateType ||
            !selectedNominal
        ) {
            return;
        }

        resetRecipientModal();

        recipientModal.hidden = false;

        recipientDialog.scrollTop = 0;

        requestAnimationFrame(function () {
            recipientSelfButton.focus();
        });
    }

    function closeRecipientModal() {
        recipientModal.hidden = true;

        recipientStep.hidden = false;
        giftForm.hidden = true;

        if (!modal.hidden) {
            buyButton.focus();
        }
    }

    function addCertificateToCart(extraData = {}) {
        if (
            !selectedCertificateType ||
            !selectedNominal ||
            typeof window.addToCart !== "function"
        ) {
            return;
        }

        window.addToCart(
            "Подарунковий сертифікат Monal",
            selectedNominal,
            "Сертифікат",
            `Номінал: ${selectedNominal} грн`,
            {
                certificateType: selectedCertificateType,
                ...extraData
            }
        );

        recipientModal.hidden = true;
        closeModal();
    }

    function openModal() {
        resetCertificateState();

        recipientModal.hidden = true;
        modal.hidden = false;

        document.body.classList.add("catalog-modal-open");

        modalDialog.scrollTop = 0;
        closeButton.focus();
    }

    function closeModal() {
        recipientModal.hidden = true;
        modal.hidden = true;

        document.body.classList.remove("catalog-modal-open");

        resetRecipientModal();
        modalCard.focus();
    }

    modalCard.setAttribute("aria-haspopup", "dialog");
    modalCard.setAttribute("aria-controls", "certificate-modal");

    modalCard.addEventListener("click", function (event) {
        event.preventDefault();
        openModal();
    });

    typeButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", function () {
            selectedCertificateType =
                button.dataset.certificateType;

            typeButtons.forEach(function (item) {
                const isActive = item === button;

                item.classList.toggle(
                    "active",
                    isActive
                );

                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateCertificateState();
        });
    });

    nominalButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", "false");

        button.addEventListener("click", function () {
            selectedNominal = Number(
                button.dataset.certificateNominal
            );

            nominalButtons.forEach(function (item) {
                const isActive = item === button;

                item.classList.toggle(
                    "active",
                    isActive
                );

                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateCertificateState();
        });
    });

    function handleCertificateBuy(event) {
        event.preventDefault();
        event.stopPropagation();

        openRecipientModal();
    }

    buyButton.addEventListener(
        "click",
        handleCertificateBuy
    );

    buyButton.addEventListener(
        "touchend",
        handleCertificateBuy,
        { passive: false }
    );

    recipientSelfButton.setAttribute(
        "aria-pressed",
        "false"
    );

    recipientGiftButton.setAttribute(
        "aria-pressed",
        "false"
    );

    recipientSelfButton.addEventListener(
        "click",
        function () {
            addCertificateToCart({
                giftMode: "self"
            });
        }
    );

    recipientGiftButton.addEventListener(
        "click",
        function () {
            recipientGiftButton.classList.add("active");

            recipientGiftButton.setAttribute(
                "aria-pressed",
                "true"
            );

            recipientStep.hidden = true;
            giftForm.hidden = false;

            updateGiftFieldsByType();

            recipientDialog.scrollTop = 0;

            requestAnimationFrame(function () {
                recipientNameInput.focus();
            });
        }
    );

    giftBackButton.addEventListener(
        "click",
        function () {
            giftForm.hidden = true;
            recipientStep.hidden = false;

            recipientGiftButton.classList.remove("active");

            recipientGiftButton.setAttribute(
                "aria-pressed",
                "false"
            );

            recipientGiftButton.focus();
        }
    );

    giftSubmitButton.addEventListener(
        "click",
        function () {
            addCertificateToCart({
                giftMode: "gift",

                recipientName:
                    recipientNameInput.value.trim(),

                recipientPhone:
                    recipientPhoneInput.disabled
                        ? ""
                        : recipientPhoneInput.value.trim(),

                recipientTelegram:
                    recipientTelegramInput.disabled
                        ? ""
                        : recipientTelegramInput.value.trim(),

                recipientEmail:
                    recipientEmailInput.value.trim(),

                greetingText:
                    greetingTextInput.value.trim(),

                greetingDate:
                    greetingDateInput.disabled
                        ? ""
                        : greetingDateInput.value
            });
        }
    );

    modal.querySelectorAll(
        "[data-close-certificate-modal]"
    ).forEach(function (element) {
        element.addEventListener(
            "click",
            closeModal
        );
    });

    recipientModal.querySelectorAll(
        "[data-close-certificate-recipient-modal]"
    ).forEach(function (element) {
        element.addEventListener(
            "click",
            closeRecipientModal
        );
    });

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key !== "Escape") {
                return;
            }

            if (!recipientModal.hidden) {
                closeRecipientModal();
                return;
            }

            if (!modal.hidden) {
                closeModal();
            }
        }
    );
})();

(function initTenMiniModal() {
    const modal = document.getElementById("ten-mini-modal");
    const modalCard = document.getElementById("ten-mini-card");

    if (!modal || !modalCard) return;

    const modalDialog = modal.querySelector(".product-modal-dialog");
    const closeButton = modal.querySelector(".product-modal-close");
    const modalImage = document.getElementById("ten-mini-modal-image");
    const previousButton = document.getElementById("ten-mini-gallery-prev");
    const nextButton = document.getElementById("ten-mini-gallery-next");
    const minusButton = document.getElementById("ten-mini-minus");
    const plusButton = document.getElementById("ten-mini-plus");
    const quantityElement = document.getElementById("ten-mini-quantity");
    const priceElement = document.getElementById("ten-mini-price");
    const buyButton = document.getElementById("ten-mini-buy");

    const unitPrice = 750;
    const images = typeof giftsGalleries !== "undefined" && giftsGalleries["ten-mini"]
        ? giftsGalleries["ten-mini"]
        : ["images/gifts/ten mini_4 (1).png"];

    let currentImageIndex = 0;
    let currentQuantity = 1;
    let touchStartX = 0;

    function formatPrice(value) {
        return new Intl.NumberFormat("uk-UA").format(value) + " ₴";
    }

    function updateGallery() {
        modalImage.src = images[currentImageIndex];
        previousButton.hidden = images.length < 2;
        nextButton.hidden = images.length < 2;
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateGallery();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateGallery();
    }

    function updateOrderState() {
        quantityElement.textContent = String(currentQuantity);
        priceElement.textContent = formatPrice(unitPrice * currentQuantity);
    }

    function openModal() {
        currentImageIndex = 0;
        currentQuantity = 1;
        updateGallery();
        updateOrderState();
        modal.hidden = false;
        document.body.classList.add("catalog-modal-open");
        modalDialog.scrollTop = 0;
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove("catalog-modal-open");
        modalCard.focus();
    }

    modalCard.setAttribute("aria-haspopup", "dialog");
    modalCard.setAttribute("aria-controls", "ten-mini-modal");

    modalCard.addEventListener("click", function (event) {
        event.preventDefault();
        openModal();
    });

    modal.querySelectorAll("[data-close-ten-mini-modal]").forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    previousButton.addEventListener("click", showPreviousImage);
    nextButton.addEventListener("click", showNextImage);

    minusButton.addEventListener("click", function () {
        currentQuantity = Math.max(1, currentQuantity - 1);
        updateOrderState();
    });

    plusButton.addEventListener("click", function () {
        currentQuantity = Math.min(99, currentQuantity + 1);
        updateOrderState();
    });

    buyButton.addEventListener("click", function () {
        if (typeof window.addToCart !== "function") return;

        for (let index = 0; index < currentQuantity; index += 1) {
            window.addToCart("TEN MINI", unitPrice, "Подарунковий набір");
        }

        closeModal();
    });

    modalImage.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    modalImage.addEventListener("touchend", function (event) {
        const difference = touchStartX - event.changedTouches[0].clientX;

        if (Math.abs(difference) < 40) return;

        if (difference > 0) {
            showNextImage();
        } else {
            showPreviousImage();
        }
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
})();

const SOON_MODAL_PRODUCTS = {
    "candles": {
        name: "АРОМАСВІЧКИ",
        intro: "Колекція ароматичних свічок Monal перебуває на етапі підготовки.",
        copy: [
            "Ми працюємо над запуском колекції, продумуючи кожну деталь — від композицій і звучання до відчуття, яке свічки створюють у просторі.",
            "Детальна інформація про аромати, формати та склад буде додана після старту продажів."
        ]
    },
    "car-sachets": {
        name: "АРОМАСАШЕ ДЛЯ АВТО",
        intro: "Аромати супроводжують не лише дім, а й шлях. Колекція Monal для авто вже у розробці.",
        copy: [
            "Ми працюємо над ароматами, які м’яко наповнюватимуть простір автомобіля, не перевантажуючи й не відволікаючи.",
            "Детальна інформація про аромати, формати та склад буде додана після старту продажів."
        ]
    },
    "wardrobe-sachets": {
        name: "АРОМАСАШЕ ДЛЯ ГАРДЕРОБУ",
        intro: "Колекція аромасаше для гардеробу Monal зараз у підготовці.",
        copy: [
            "Ми працюємо над ароматами, які делікатно супроводжуватимуть ваші речі, створюючи відчуття чистоти, спокою й доглянутості.",
            "Детальна інформація про аромати, формати та склад буде додана після старту продажів."
        ]
    },
    "hand-soap": {
        name: "МИЛО ДЛЯ РУК",
        intro: "Лінійка мила для рук Monal перебуває у розробці.",
        copy: [
            "Ми працюємо над формулами та ароматами, щоб миття рук стало приємною частиною щоденного догляду.",
            "Мило для рук Monal поєднуватиме м’якість, чистоту й стримане ароматичне звучання."
        ]
    },
    "hand-cream": {
        name: "КРЕМ ДЛЯ РУК",
        intro: "Крем для рук Monal зараз у розробці.",
        copy: [
            "Ми працюємо над кремом, який даруватиме відчуття доглянутості, м’якості та спокою.",
            "Аромат і текстура створюються так, щоб доповнювати щоденні ритуали, не перевантажуючи відчуття."
        ]
    },
    "shower-gel": {
        name: "ГЕЛЬ ДЛЯ ДУШУ",
        intro: "Колекція гелів для душу Monal перебуває у розробці.",
        copy: [
            "Ми працюємо над ароматами й текстурами, щоб гель був комфортним у щоденному використанні.",
            "М’яке очищення, аромат і відчуття доглянутості лежать в основі майбутньої колекції."
        ]
    }
};

(function initSoonModal() {
    const modal = document.getElementById("soon-modal");

    if (!modal) return;

    const modalDialog = modal.querySelector(".product-modal-dialog");
    const closeButton = modal.querySelector(".product-modal-close");
    const modalName = document.getElementById("soon-modal-name");
    const modalIntro = document.getElementById("soon-modal-intro");
    const modalCopy = document.getElementById("soon-modal-copy");
    const modalImage = document.getElementById("soon-modal-image");

    let lastFocusedCard = null;

    function openModal(productKey, card) {
        const product = SOON_MODAL_PRODUCTS[productKey];

        if (!product) return;

        lastFocusedCard = card;
        modalName.textContent = product.name;
        modalIntro.textContent = product.intro;
        modalCopy.innerHTML = product.copy.map(function (paragraph) {
            return `<p>${paragraph}</p>`;
        }).join("");
        modalImage.alt = `${product.name} Monal — незабаром`;

        modal.hidden = false;
        document.body.classList.add("catalog-modal-open");
        modalDialog.scrollTop = 0;
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove("catalog-modal-open");

        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    }

    document.querySelectorAll(".catalog-card--soon[id]").forEach(function (card) {
        if (!SOON_MODAL_PRODUCTS[card.id]) return;

        card.setAttribute("aria-haspopup", "dialog");
        card.setAttribute("aria-controls", "soon-modal");

        card.addEventListener("click", function (event) {
            event.preventDefault();
            openModal(card.id, card);
        });
    });

    modal.querySelectorAll("[data-close-soon-modal]").forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
})();

(function initCatalogQuickBuy() {
    const PRODUCT_LIKES_API_URL =
        "https://monal-mono-pay-production.up.railway.app/api/product-likes";

    const cards = document.querySelectorAll(
        "#catalog.catalog-main .catalog-card:not(.catalog-card--soon)"
    );

    if (!cards.length) return;

    const likeButtonsByProductKey = new Map();

    function getProductLikeVisitorId() {
        const storageKey =
            "monal_product_like_visitor_id";

        const visitorIdPattern =
            /^[a-zA-Z0-9_-]{16,64}$/;

        try {
            const savedVisitorId =
                localStorage.getItem(storageKey);

            if (
                savedVisitorId &&
                visitorIdPattern.test(savedVisitorId)
            ) {
                return savedVisitorId;
            }

            const newVisitorId =
                window.crypto?.randomUUID?.() ||
                [
                    Date.now().toString(36),
                    Math.random().toString(36).slice(2),
                    Math.random().toString(36).slice(2)
                ].join("-");

            localStorage.setItem(
                storageKey,
                newVisitorId
            );

            return newVisitorId;

        } catch (error) {
            return [
                Date.now().toString(36),
                Math.random().toString(36).slice(2),
                Math.random().toString(36).slice(2)
            ].join("-");
        }
    }

    function getProductLikeData(card) {
        const categorySlug =
            card.closest(".catalog-section")?.id || "";

        const productName =
            card.querySelector("h3")?.textContent.trim() ||
            card.id;

        return {
            productKey: card.id,
            productName,
            categorySlug
        };
    }

    function setLikeButtonState(
        button,
        liked
    ) {
        button.classList.toggle(
            "is-liked",
            liked
        );

        button.setAttribute(
            "aria-pressed",
            String(liked)
        );

        button.setAttribute(
            "aria-label",
            liked
                ? `Прибрати вподобання: ${button.dataset.productName}`
                : `Подобається: ${button.dataset.productName}`
        );
    }

    async function loadLikedProducts(
        visitorId
    ) {
        try {
            const response = await fetch(
                `${PRODUCT_LIKES_API_URL}?visitorId=${encodeURIComponent(visitorId)}`
            );

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(
                    data.error || "Не вдалося отримати лайки"
                );
            }

            const likedProductKeys =
                new Set(data.likedProductKeys || []);

            likeButtonsByProductKey.forEach(
                function (button, productKey) {
                    setLikeButtonState(
                        button,
                        likedProductKeys.has(productKey)
                    );
                }
            );

        } catch (error) {
            console.error(
                "LOAD PRODUCT LIKES ERROR:",
                error
            );
        }
    }

    function getDirectCartItem(card) {
        const parfumMatch = card.id.match(
            /^parfum-(.+)-(15|100)$/
        );

        const diffuserMatch = card.id.match(
            /^diffuser-(.+)$/
        );

        const refillMatch = card.id.match(
            /^refill-(.+)$/
        );

        let productType = "";
        let productKey = "";
        let volume = "";

        if (parfumMatch) {
            productType = "parfum";
            productKey = parfumMatch[1];
            volume = parfumMatch[2];

        } else if (diffuserMatch) {
            productType = "diffuser";
            productKey = diffuserMatch[1];
            volume = "200";

        } else if (refillMatch) {
            productType = "refill";
            productKey = refillMatch[1];
            volume = "275";

        } else if (card.id === "ten-mini-card") {
            return {
                name: "TEN MINI",
                price: 750,
                label: "Подарунковий набір"
            };

        } else {
            return null;
        }

        const product = getModalProduct(
            productType,
            productKey
        );

        const variant =
            product?.volumes?.[volume];

        if (!product || !variant) return null;

        return {
            name: variant.cartName,
            price: variant.price,
            label:
                variant.cartLabel ||
                product.cartLabel
        };
    }

    const visitorId =
        getProductLikeVisitorId();

    cards.forEach(function (card) {
        if (card.closest(".catalog-card-wrap")) {
            return;
        }

        const directCartItem =
            getDirectCartItem(card);

        const requiresSelection =
            card.id === "discovery-set-card" ||
            card.id === "certificate-card";

        if (!directCartItem && !requiresSelection) {
            return;
        }

        const likeData =
            getProductLikeData(card);

        const wrapper =
            document.createElement("div");

        const likeButton =
            document.createElement("button");

        const buyButton =
            document.createElement("button");

        wrapper.className =
            "catalog-card-wrap";

        likeButton.className =
            "catalog-like-button";

        likeButton.type = "button";
        likeButton.dataset.productKey =
            likeData.productKey;
        likeButton.dataset.productName =
            likeData.productName;
        likeButton.dataset.categorySlug =
            likeData.categorySlug;

        setLikeButtonState(
            likeButton,
            false
        );

        buyButton.className =
            "catalog-quick-buy";

        buyButton.type = "button";
        buyButton.textContent = "КУПИТИ";

        card.parentNode.insertBefore(
            wrapper,
            card
        );

        wrapper.appendChild(card);
        wrapper.appendChild(likeButton);
        wrapper.appendChild(buyButton);

        likeButtonsByProductKey.set(
            likeData.productKey,
            likeButton
        );

        likeButton.addEventListener(
            "click",
            async function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (likeButton.disabled) {
                    return;
                }

                likeButton.disabled = true;

                try {
                    const response = await fetch(
                        `${PRODUCT_LIKES_API_URL}/toggle`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                visitorId,
                                productKey:
                                    likeData.productKey,
                                productName:
                                    likeData.productName,
                                categorySlug:
                                    likeData.categorySlug
                            })
                        }
                    );

                    const data =
                        await response.json();

                    if (!response.ok || !data.ok) {
                        throw new Error(
                            data.error ||
                            "Не вдалося змінити лайк"
                        );
                    }

                    setLikeButtonState(
                        likeButton,
                        data.liked
                    );

                } catch (error) {
                    console.error(
                        "TOGGLE PRODUCT LIKE ERROR:",
                        error
                    );

                } finally {
                    likeButton.disabled = false;
                }
            }
        );

        if (requiresSelection) {
            buyButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    card.click();
                }
            );

            return;
        }

        buyButton.setAttribute(
            "onclick",
            `event.preventDefault(); event.stopPropagation(); addToCart(${JSON.stringify(directCartItem.name)}, ${directCartItem.price}, ${JSON.stringify(directCartItem.label)});`
        );
    });

    loadLikedProducts(visitorId);
})();

(function initCatalogScrollControls() {
    const controls = document.querySelector(
        ".catalog-scroll-controls"
    );

    const topButton = document.querySelector(
        ".catalog-scroll-button--top"
    );

    const bottomButton = document.querySelector(
        ".catalog-scroll-button--bottom"
    );

    if (!controls || !topButton || !bottomButton) {
        return;
    }

    let hideTimer = null;

    function scheduleControlsHide() {
        window.clearTimeout(hideTimer);

        hideTimer = window.setTimeout(function () {
            controls.hidden = true;
        }, 3000);
    }

    function updateScrollControls() {
        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const pageHeight =
            document.documentElement.scrollHeight;

        const windowHeight =
            window.innerHeight;

        controls.hidden = false;

        topButton.hidden = scrollTop <= 8;

        bottomButton.hidden =
            scrollTop + windowHeight >= pageHeight - 8;

        scheduleControlsHide();
    }

    topButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto"
        });
    });

    bottomButton.addEventListener("click", function () {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            left: 0,
            behavior: "auto"
        });
    });

    window.addEventListener(
        "scroll",
        updateScrollControls,
        { passive: true }
    );

    window.addEventListener("resize", function () {
        if (!controls.hidden) {
            updateScrollControls();
        }
    });
})();

(function initAromaCatalogFilter() {
    const params = new URLSearchParams(window.location.search);

    const aromaKey = String(params.get("aroma") || "")
        .trim()
        .toLowerCase();

    if (!aromaKey) return;

    const allowedAromas = new Set([
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
        "rosalya",
        "leather-absolute",
        "amber-elite",
        "bois-noir"
    ]);

    if (!allowedAromas.has(aromaKey)) return;

    const catalog = document.getElementById("catalog");
    const catalogIntro = catalog?.querySelector(".catalog-intro");
    const sections = Array.from(
        catalog?.querySelectorAll(".catalog-section") || []
    );

    if (!catalog || !catalogIntro || !sections.length) return;

    function getCardAromaKey(card) {
        const id = String(card.id || "").toLowerCase();

        const parfumMatch = id.match(
            /^parfum-(.+)-(15|100)$/
        );

        const diffuserMatch = id.match(
            /^diffuser-(.+)$/
        );

        const refillMatch = id.match(
            /^refill-(.+)$/
        );

        if (parfumMatch) {
            return parfumMatch[1];
        }

        if (diffuserMatch) {
            return diffuserMatch[1];
        }

        if (refillMatch) {
            return refillMatch[1];
        }

        return "";
    }

    const matchedItems = [];

    sections.forEach(function (section) {
        section.querySelectorAll(".catalog-card[id]").forEach(function (card) {
            if (getCardAromaKey(card) !== aromaKey) return;

            const wrapper = card.closest(".catalog-card-wrap");

            matchedItems.push(wrapper || card);
        });
    });

    sections.forEach(function (section) {
        section.style.display = "none";
    });

    const aromaSection = document.createElement("section");
    aromaSection.className = "catalog-section catalog-aroma-section";

    const aromaTitle = document.createElement("h2");
    aromaTitle.textContent = "ТОВАРИ ЛІНІЙКИ";

    const aromaGrid = document.createElement("div");
    aromaGrid.className = "catalog-grid";

    matchedItems.forEach(function (item) {
        aromaGrid.appendChild(item);
    });

    aromaSection.appendChild(aromaTitle);
    aromaSection.appendChild(aromaGrid);

    catalogIntro.insertAdjacentElement(
        "afterend",
        aromaSection
    );

    const aroma =
        typeof PARFUM_MODAL_PRODUCTS !== "undefined"
            ? PARFUM_MODAL_PRODUCTS[aromaKey]
            : null;

    if (aroma) {
        const title = catalogIntro.querySelector("h1");
        const description = catalogIntro.querySelector("p");

        if (title) {
            title.textContent = aroma.name;
        }

        if (description) {
            description.textContent =
                "Всі товари цієї ароматичної лінійки Monal.";
        }
    }
})();