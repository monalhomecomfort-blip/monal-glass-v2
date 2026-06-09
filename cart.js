let PAYMENT_CONTEXT = null;
let PAY_NOW_AMOUNT = 0;
let CERT_APPLIED_AMOUNT = 0;
let CERT_CODE_USED = null;

let PUBLIC_PROMO_CAMPAIGNS = [];

async function loadPublicPromoCampaigns() {
    try {
        const res = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/public-promo-campaigns",
            { cache: "no-store" }
        );

        const data = await res.json();

        PUBLIC_PROMO_CAMPAIGNS =
            data && data.ok && Array.isArray(data.campaigns)
                ? data.campaigns
                : [];
    } catch (err) {
        console.error("LOAD PUBLIC PROMO CAMPAIGNS ERROR:", err);
        PUBLIC_PROMO_CAMPAIGNS = [];
    }
}

function getSelectedOffer() {
    try {
        const user = JSON.parse(localStorage.getItem("monal_user") || "null");
        if (!user || !user.id) return null;
        return JSON.parse(localStorage.getItem("monal_selected_offer_" + user.id)) || null;
    } catch (e) {
        return null;
    }
}
function getCartItemProductId(item) {
    return Number(
        item?.product_id ||
        item?.productId ||
        item?.id ||
        0
    );
}

function getGiftOfferRequiredProductNamesFromOfferText(offer) {
    const offerText = String(offer?.offer_text || "").trim();

    const conditionMatch = offerText.match(
        /Умова\s*:\s*([\s\S]*?)\.?\s*$/i
    );

    const conditionText = conditionMatch
        ? String(conditionMatch[1] || "").trim()
        : "";

    if (!conditionText) {
        return [];
    }

    return conditionText
        .split(/\s*,\s*|\s*;\s*|\s*\|\s*/)
        .map(item => normalizeCartPersonalOfferText(item))
        .filter(Boolean);
}

function getGiftProductCompareTokens(value) {
    const ignoredTokens = new Set([
        "для",
        "грн",
        "uah",
        "ml",
        "мл"
    ]);

    return normalizeCartPersonalOfferText(value)
        .split(" ")
        .map(token => token.trim())
        .filter(token =>
            token.length > 1 &&
            !ignoredTokens.has(token)
        );
}

function isGiftProductTextMatch(requiredText, itemText) {
    const required = normalizeCartPersonalOfferText(requiredText);
    const item = normalizeCartPersonalOfferText(itemText);

    if (!required || !item) {
        return false;
    }

    if (required === item || item.includes(required) || required.includes(item)) {
        return true;
    }

    const requiredTokens = getGiftProductCompareTokens(required);
    const itemTokens = getGiftProductCompareTokens(item);

    if (!requiredTokens.length || !itemTokens.length) {
        return false;
    }

    const matchedCount = requiredTokens.filter(token =>
        itemTokens.includes(token)
    ).length;

    return matchedCount >= Math.min(requiredTokens.length, 2);
}

function isCartItemNameMatchGiftProductCondition(item, offer) {
    const requiredProductNames = getGiftOfferRequiredProductNamesFromOfferText(offer);

    if (!requiredProductNames.length) {
        return false;
    }

    const itemTexts = [
        item?.name,
        item?.label,
        item?.product_name,
        item?.display_name,
        item?.title,
        item?.product_key,
        item?.productKey,
        item?.key,
        `${item?.label || ""} ${item?.name || ""}`,
        `${item?.product_label || ""} ${item?.product_name || ""}`,
        `${item?.category_slug || ""} ${item?.label || ""} ${item?.name || ""}`
    ]
        .map(value => String(value || "").trim())
        .filter(Boolean);

    return requiredProductNames.some(requiredName =>
        itemTexts.some(itemText =>
            isGiftProductTextMatch(requiredName, itemText)
        )
    );
}

function isCartItemEligibleForSelectedGiftOffer(item, offer) {
    if (!offer || String(offer.offer_type || "").toLowerCase() !== "gift") {
        return false;
    }

    if (isCartCertificateItem(item)) {
        return false;
    }

    const requiredTarget = String(offer.required_category_slug || "").trim();

    if (!requiredTarget || requiredTarget.toLowerCase() === "all") {
        return true;
    }

    if (requiredTarget.toLowerCase().startsWith("products:")) {
        const requiredProductIds = requiredTarget
            .replace(/^products:/i, "")
            .split(",")
            .map(value => Number(value || 0))
            .filter(id => Number.isInteger(id) && id > 0);

        if (!requiredProductIds.length) {
            return false;
        }

        const itemProductId = getCartItemProductId(item);

        if (itemProductId > 0 && requiredProductIds.includes(itemProductId)) {
            return true;
        }

        return isCartItemNameMatchGiftProductCondition(item, offer);
    }

    const requiredCategoryKeys = [
        ...new Set(
            requiredTarget
                .split(",")
                .flatMap(value => getCartCategoryAliases(value))
                .filter(key => key && key !== "all" && key !== "certificates")
        )
    ];

    if (!requiredCategoryKeys.length) {
        return false;
    }

    const itemCategoryKeys = getCartItemCategoryKeys(item);

    return requiredCategoryKeys.some(categoryKey =>
        itemCategoryKeys.includes(categoryKey)
    );
}

function isSelectedGiftOfferAvailableInCart(offer, cart) {
    if (!offer || String(offer.offer_type || "").toLowerCase() !== "gift") {
        return false;
    }

    return cart.some(item =>
        isCartItemEligibleForSelectedGiftOffer(item, offer)
    );
}

function getOrderNoteFromSelectedOffer() {
    const offer = getSelectedOffer();

    if (!offer || offer.offer_type === "promo") {
        return "";
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const eligibleSum = cart
        .filter(item => !isCartCertificateItem(item))
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    const minOrderAmount = Number(offer.min_order_amount || 0);

    if (minOrderAmount > 0 && eligibleSum < minOrderAmount) {
        return "";
    }

    if (offer.offer_type === "gift" && !isSelectedGiftOfferAvailableInCart(offer, cart)) {
        return "";
    }

    if (
        offer.offer_type !== "gift" &&
        offer.required_category_slug
    ) {
        const offerCategories = getSelectedOfferCategoryKeys(offer);

        if (offerCategories.length) {
            const hasCategoryMatch = cart.some(item => {
                if (isCartCertificateItem(item)) {
                    return false;
                }

                const itemCategoryKeys = getCartItemCategoryKeys(item);

                return offerCategories.some(category =>
                    itemCategoryKeys.includes(category)
                );
            });

            if (!hasCategoryMatch) {
                return "";
            }
        }
    }

    if (offer.offer_type === "delivery") {
        return "Безкоштовна доставка";
    }

    if (offer.offer_type === "gift") {
        const offerText = String(offer.offer_text || "").trim();

        const giftMatch = offerText.match(
            /Подарунок\s*:\s*([\s\S]*?)(?:\.?\s*Умова\s*:|$)/i
        );

        const giftName = giftMatch
            ? String(giftMatch[1] || "").trim()
            : "";

        return giftName
            ? `Подарунок: ${giftName}`
            : offerText || offer.title || "Подарунок до замовлення";
    }

    return offer.title || "Персональна пропозиція";
}

// ===================== PROMO ENGINE =====================

const PROMO = window.PROMO_CONFIG || null;
let PROMO_CODE = (localStorage.getItem("promo_code") || "").trim().toUpperCase();

const PERSONAL_PROMO_CODE_STORAGE_KEY = "monal_personal_promo_code";

function getStoredPersonalPromoCodeData(code = PROMO_CODE) {
    try {
        const data = JSON.parse(
            localStorage.getItem(PERSONAL_PROMO_CODE_STORAGE_KEY) || "null"
        );

        if (!data || !data.promoCode) return null;

        const normalizedCode = String(code || "").trim().toUpperCase();
        const storedCode = String(data.promoCode || "").trim().toUpperCase();

        if (!normalizedCode || normalizedCode !== storedCode) {
            return null;
        }

        const user = JSON.parse(localStorage.getItem("monal_user") || "null");

        if (!user || !user.id) {
            return null;
        }

        if (Number(data.userId || 0) !== Number(user.id || 0)) {
            return null;
        }

        return data;

    } catch (err) {
        return null;
    }
}

function setStoredPersonalPromoCodeData(data) {
    localStorage.setItem(
        PERSONAL_PROMO_CODE_STORAGE_KEY,
        JSON.stringify(data)
    );
}

function clearStoredPersonalPromoCodeData() {
    localStorage.removeItem(PERSONAL_PROMO_CODE_STORAGE_KEY);
}

if (PROMO && Array.isArray(PROMO.promoDetails)) {
    const oldCodes = Array.isArray(PROMO.codes) ? PROMO.codes : [];
    const newCodes = PROMO.promoDetails
        .map(p => String(p.code || "").trim().toUpperCase())
        .filter(Boolean);

    PROMO.codes = [...new Set([...oldCodes, ...newCodes])];
}

function getPromoByCode(code) {
    if (!PROMO || !Array.isArray(PROMO.promoDetails)) return null;

    const normalizedCode = String(code || "").trim().toUpperCase();

    return PROMO.promoDetails.find(p =>
        String(p.code || "").trim().toUpperCase() === normalizedCode
    ) || null;
}

function isPromoWindowActive(promo) {
    if (!PROMO || !PROMO.active) return false;
    if (!promo) return false;

    if (!promo.start || !promo.end) return true;

    const now = new Date();
    const start = new Date(promo.start);
    const end = new Date(promo.end);

    return now >= start && now <= end;
}

function isPromoActive(code = PROMO_CODE) {
    if (!PROMO || !PROMO.active) return false;

    const promoDetailsItem = getPromoByCode(code);
    if (promoDetailsItem) {
        return isPromoWindowActive(promoDetailsItem);
    }

    if (!PROMO.start || !PROMO.end) return true;

    const now = new Date();
    const start = new Date(PROMO.start);
    const end = new Date(PROMO.end);

    return now >= start && now <= end;
}

function isExcludedItem(item, exclusions = null) {
    const name = String(item?.name || "").toLowerCase();
    const label = String(item?.label || "").toLowerCase();
    const rules = exclusions || PROMO?.exclusions || {};

    if (
        rules.certificates &&
        (name.includes("сертиф") || label.includes("сертиф"))
    ) {
        return true;
    }

    if (
        rules.discovery &&
        (name.includes("discovery") || name.includes("діскавер"))
    ) {
        return true;
    }

    if (
        rules.tenMini &&
        (name.includes("ten mini") || name.includes("10х3"))
    ) {
        return true;
    }

    if (isFocusProductItem(item)) {
        return true;
    }

    return false;
}

function getEligiblePromoSum(cart, code = PROMO_CODE) {
    const promoDetailsItem = getPromoByCode(code);
    const exclusions = promoDetailsItem?.exclusions || PROMO?.exclusions || {};

    let eligibleSum = 0;
    let hasNonExcluded = false;

    cart.forEach(item => {
        if (!isExcludedItem(item, exclusions)) {
            hasNonExcluded = true;
            eligibleSum += Number(item.price) || 0;
        }
    });

    return {
        eligibleSum,
        hasNonExcluded,
        promoDetailsItem
    };
}

function calcPromoDiscount(cart, code = PROMO_CODE) {
    const normalizedCode = String(code || "").trim().toUpperCase();

    if (!normalizedCode) return 0;

    const storedPersonalPromo = getStoredPersonalPromoCodeData(normalizedCode);

    if (storedPersonalPromo) {
        const storedDiscount = Number(storedPersonalPromo.discountAmount || 0);

        if (storedDiscount <= 0) return 0;

        const cartTotalWithoutCertificates = cart
            .filter(item => {
                const name = String(item?.name || "").toLowerCase();
                const label = String(item?.label || "").toLowerCase();

                return (
                    !name.includes("сертиф") &&
                    !label.includes("сертиф")
                );
            })
            .reduce((sum, item) => sum + Number(item.price || 0), 0);

        if (cartTotalWithoutCertificates <= 0) return 0;

        return Math.min(storedDiscount, cartTotalWithoutCertificates);
    }

    if (!PROMO || !PROMO.codes || !PROMO.codes.includes(normalizedCode)) return 0;
    if (!isPromoActive(normalizedCode)) return 0;

    const { eligibleSum, hasNonExcluded, promoDetailsItem } = getEligiblePromoSum(cart, normalizedCode);

    if (!hasNonExcluded) return 0;

    if (promoDetailsItem) {
        const minOrderAmount = Number(promoDetailsItem.minOrderAmount || 0);
        if (eligibleSum < minOrderAmount) return 0;

        const promoType = String(promoDetailsItem.type || "fixed").toLowerCase();

        if (promoType === "percent") {
            const percentValue = Number(promoDetailsItem.value || 0);
            if (percentValue <= 0) return 0;

            const discount = Math.round(eligibleSum * (percentValue / 100));
            return Math.min(discount, eligibleSum);
        }

        const fixedValue = Number(promoDetailsItem.value || 0);
        if (fixedValue <= 0) return 0;

        return Math.min(fixedValue, eligibleSum);
    }

    return Math.min(Number(PROMO.discount || 0), eligibleSum);
}
/* ===================== КОШИК ===================== */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const text = cart.length > 0 ? `(${cart.length})` : "";

    // лічильник у десктоп-меню
    const navCount = document.getElementById("cart-count");
    if (navCount) navCount.textContent = text;

    // лічильник у мобільній іконці
    const mobileCount = document.querySelector(".mobile-cart-count");
    if (mobileCount) mobileCount.textContent = text;
}

function addToCart(name, price, label = "", items = null, extra = null) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = { name, price, label };

    if (items) item.items = items;

    if (extra && typeof extra === "object") {
        Object.assign(item, extra);
    }

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    clearStoredPersonalPromoCodeData();
    localStorage.removeItem("promo_code");
    PROMO_CODE = "";

    updateCartCount();
}

function normalizeFocusPromoText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[’ʼ']/g, "")
        .replace(/[·•|/\\–—-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function uniqueFocusPromoTexts(values) {
    return [
        ...new Set(
            values
                .map(value => normalizeFocusPromoText(value))
                .filter(Boolean)
        )
    ];
}

function getFocusProductCampaign() {
    return PUBLIC_PROMO_CAMPAIGNS.find(c =>
        c.promo_type === "focus_product" &&
        (
            c.focus_product_id ||
            c.product_key ||
            c.product_name ||
            c.display_name
        )
    ) || null;
}

function isFocusProductItem(item) {
    const campaign = getFocusProductCampaign();

    if (!campaign || !item) return false;

    const campaignId = Number(campaign.focus_product_id || 0);
    const itemId = Number(item.product_id || item.productId || item.id || 0);

    if (campaignId && itemId && campaignId === itemId) {
        return true;
    }

    const campaignKey = normalizeFocusPromoText(campaign.product_key);
    const itemKey = normalizeFocusPromoText(item.product_key || item.productKey || item.key);

    if (campaignKey && itemKey && campaignKey === itemKey) {
        return true;
    }

    const itemName = item.name || item.product_name || item.display_name || item.title || "";
    const itemLabel = item.label || item.product_label || "";

    const campaignName = campaign.product_name || "";
    const campaignLabel = campaign.product_label || "";
    const campaignDisplayName = campaign.display_name || "";

    const itemTexts = uniqueFocusPromoTexts([
        itemName,
        itemLabel && itemName ? `${itemLabel} ${itemName}` : "",
        itemName && itemLabel ? `${itemName} ${itemLabel}` : ""
    ]);

    const campaignTexts = uniqueFocusPromoTexts([
        campaignDisplayName,
        campaignName,
        campaignLabel && campaignName ? `${campaignLabel} ${campaignName}` : "",
        campaignLabel && campaignDisplayName ? `${campaignLabel} ${campaignDisplayName}` : ""
    ]);

    return itemTexts.some(itemText =>
        campaignTexts.some(campaignText => {
            if (itemText === campaignText) return true;

            if (campaignText.length >= 8 && itemText.includes(campaignText)) {
                return true;
            }

            if (itemText.length >= 8 && campaignText.includes(itemText)) {
                return true;
            }

            return false;
        })
    );
}

function isVipCustomerForCart(user = null) {
    const cartUser = user || JSON.parse(localStorage.getItem("monal_user") || "null");
    const status = String(cartUser?.customer_status || "general").toLowerCase();

    return status === "friends" || status === "partners";
}

function calcFocusProductDiscount(cart) {
    if (isVipCustomerForCart()) {
        return 0;
    }

    const campaign = getFocusProductCampaign();

    if (!campaign) return 0;

    const discountPercent = Number(campaign.discount_percent || 0);

    if (discountPercent <= 0) return 0;

    const eligibleTotal = cart
        .filter(item => isFocusProductItem(item))
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    if (eligibleTotal <= 0) return 0;

    return Math.round(eligibleTotal * (discountPercent / 100));
}

function normalizeCartPersonalOfferText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/[’ʼ']/g, "")
        .replace(/[_/\\|–—-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function isCartCertificateItem(item) {
    const name = normalizeCartPersonalOfferText(item?.name);
    const label = normalizeCartPersonalOfferText(item?.label);
    const categorySlug = normalizeCartPersonalOfferText(item?.category_slug);

    return (
        name.includes("сертиф") ||
        label.includes("сертиф") ||
        categorySlug.includes("certificate")
    );
}

function getCartCategoryAliases(value) {
    const text = normalizeCartPersonalOfferText(value);
    const aliases = new Set();

    if (!text) {
        return [];
    }

    aliases.add(text);

    if (
        text.includes("аромадифузор") ||
        text.includes("diffuser") ||
        text.includes("aromadiffuser")
    ) {
        aliases.add("aromadiffusers");
        aliases.add("аромадифузори");
    }

    if (
        text.includes("рефіл") ||
        text.includes("refill")
    ) {
        aliases.add("refills");
        aliases.add("рефіли");
    }

    if (
        text.includes("парфум") ||
        text.includes("perfume") ||
        text.includes("parfum") ||
        text.includes("home perfume")
    ) {
        aliases.add("parfums");
        aliases.add("парфуми");
        aliases.add("парфуми для дому");
    }

    if (
        text.includes("discovery") ||
        text.includes("діскавер")
    ) {
        aliases.add("discovery");
        aliases.add("discovery set");
    }

    if (
        text.includes("подарунковий") ||
        text.includes("gift")
    ) {
        aliases.add("gift-sets");
        aliases.add("подарункові набори");
    }

    if (
        text.includes("тестер") ||
        text.includes("tester")
    ) {
        aliases.add("testers");
        aliases.add("тестери");
    }

    return Array.from(aliases)
        .map(item => normalizeCartPersonalOfferText(item))
        .filter(Boolean);
}

function getCartItemCategoryKeys(item) {
    const values = [
        item?.category_slug,
        item?.product_label,
        item?.label,
        item?.name,
        item?.product_name,
        item?.display_name,
        item?.title,
        `${item?.label || ""} ${item?.name || ""}`,
        `${item?.category_slug || ""} ${item?.label || ""} ${item?.name || ""}`
    ];

    return [
        ...new Set(
            values.flatMap(value => getCartCategoryAliases(value))
        )
    ];
}

function getSelectedOfferCategoryKeys(offer) {
    const categoriesRaw = String(offer?.required_category_slug || "").trim();

    if (!categoriesRaw || categoriesRaw.toLowerCase() === "all") {
        return [];
    }

    return [
        ...new Set(
            categoriesRaw
                .split(",")
                .flatMap(value => getCartCategoryAliases(value))
                .filter(Boolean)
        )
    ];
}

function isCartItemEligibleForSelectedPercentOffer(item, offer) {
    if (!offer || String(offer.offer_type || "").toLowerCase() !== "discount") {
        return false;
    }

    if (isCartCertificateItem(item)) {
        return false;
    }

    if (isFocusProductItem(item)) {
        return false;
    }

    const offerCategories = getSelectedOfferCategoryKeys(offer);

    if (!offerCategories.length) {
        return true;
    }

    const itemCategoryKeys = getCartItemCategoryKeys(item);

    return offerCategories.some(category =>
        itemCategoryKeys.includes(category)
    );
}
function calcSelectedPersonalPercentOfferDiscount(cart) {
    const selectedOffer = getSelectedOffer();

    if (
        !selectedOffer ||
        String(selectedOffer.offer_type || "").toLowerCase() !== "discount"
    ) {
        return 0;
    }

    const percent = Number(selectedOffer.discount_percent || 0);

    if (percent <= 0) {
        return 0;
    }

    const eligibleTotal = cart
        .filter(item => isCartItemEligibleForSelectedPercentOffer(item, selectedOffer))
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    if (eligibleTotal <= 0) {
        return 0;
    }

    return Math.min(
        eligibleTotal,
        Math.round(eligibleTotal * (percent / 100))
    );
}

function calcUserCartDiscount(cart, user) {
    if (!user) return 0;

    const customerStatus = String(user.customer_status || "general").toLowerCase();
    const welcomeDiscountUsed = Boolean(user.welcome_discount_used);

    const eligibleTotal = cart
        .filter(item =>
            !isCartCertificateItem(item) &&
            !isFocusProductItem(item)
        )
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    if (eligibleTotal <= 0) return 0;

    let basePersonalDiscount = 0;

    const canUseWelcomeDiscount =
        customerStatus === "general" &&
        !welcomeDiscountUsed;

    if (canUseWelcomeDiscount) {
        basePersonalDiscount = Math.round(eligibleTotal * 0.10);
    } else {
        const personalPercent = Number(user.discount || 0);

        if (personalPercent > 0) {
            basePersonalDiscount = Math.round(eligibleTotal * (personalPercent / 100));
        }
    }

    const selectedPercentOfferDiscount = calcSelectedPersonalPercentOfferDiscount(cart);

    return Math.min(
        eligibleTotal,
        basePersonalDiscount + selectedPercentOfferDiscount
    );
}

function renderCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const user = JSON.parse(localStorage.getItem("monal_user") || "null");

    const list = document.getElementById("cart-list");
    const totalEl = document.getElementById("cart-total");

    if (!list || !totalEl) return;

    if (cart.length === 0) {
        list.innerHTML = "<p>Кошик порожній</p>";
        totalEl.textContent = "0 грн";
        return;
    }

    list.innerHTML = cart.map((item, index) => {
        const certificateTypeText =
            item.label === "Сертифікат" && item.certificateType
                ? ` (${item.certificateType})`
                : "";

        return `
            <div class="cart-item">
                <span>${item.label ? item.label + " " : ""}${item.name}${certificateTypeText}</span>
                <span>${item.price} грн</span>
                <button onclick="removeFromCart(${index})">X</button>
            </div>
        `;
    }).join("");

    const total = cart.reduce((s, i) => s + Number(i.price), 0);

    
    /* ===================== АРОМАТ ДНЯ ===================== */

    const focusProductDiscount = calcFocusProductDiscount(cart);

    const afterFocusProduct = total - focusProductDiscount;

    /* ===================== ПЕРСОНАЛЬНА ЗНИЖКА ===================== */

    const personalDiscount = calcUserCartDiscount(cart, user);

    const afterPersonal = afterFocusProduct - personalDiscount;

    /* ===================== ПРОМОКОД ===================== */

    const promoDiscount = typeof calcPromoDiscount === "function"
        ? calcPromoDiscount(cart)
        : 0;

    const afterPromo = Math.max(0, afterPersonal - promoDiscount);

    /* ===================== СЕРТИФІКАТ ===================== */

    const certificateAmount = typeof CERT_APPLIED_AMOUNT === "number"
        ? CERT_APPLIED_AMOUNT
        : 0;

    const orderNote = getOrderNoteFromSelectedOffer();

    const finalTotal = Math.max(0, afterPromo - certificateAmount);

    /* ===================== ВИВІД ===================== */

    let html = `Загальна сума: ${total} грн<br>`;

    if (focusProductDiscount > 0) {
        html += `Аромат дня: −${focusProductDiscount} грн<br>`;
    }    

    if (personalDiscount > 0) {
        const isWelcomeDiscount =
            user &&
            String(user.customer_status || "general").toLowerCase() === "general" &&
            !Boolean(user.welcome_discount_used);

        html += `${
            isWelcomeDiscount
                ? "Welcome-знижка 10%"
                : "Персональна знижка"
        }: −${personalDiscount} грн<br>`;
    }

    if (promoDiscount > 0) {
        html += `Промокод: −${promoDiscount} грн<br>`;
    } else if (orderNote) {
        html += `Персональна пропозиція: ${orderNote}<br>`;
    }

    if (certificateAmount > 0) {
        html += `Сертифікат: −${certificateAmount} грн<br>`;
    }

    html += `<strong>${finalTotal} грн</strong>`;

    totalEl.innerHTML = html;
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    clearStoredPersonalPromoCodeData();
    localStorage.removeItem("promo_code");
    PROMO_CODE = "";

    const promoInput = document.getElementById("promo-input");
    const promoMessage = document.getElementById("promo-message");

    if (promoInput) promoInput.value = "";
    if (promoMessage) promoMessage.textContent = "";

    renderCart();
    updateCartCount();
}

function clearCart() {
    // очищаємо кошик
    localStorage.removeItem("cart");
    const user = JSON.parse(localStorage.getItem("monal_user") || "null");
    if (user && user.id) {
        localStorage.removeItem("monal_selected_offer_" + user.id);
    }
    
    // очищаємо промокод
    localStorage.removeItem("promo_code");
    clearStoredPersonalPromoCodeData();
    PROMO_CODE = "";
    
    // очищаємо поле вводу і повідомлення
    const promoInput = document.getElementById("promo-input");
    const promoMessage = document.getElementById("promo-message");

    if (promoInput) promoInput.value = "";
    if (promoMessage) promoMessage.textContent = "";

    renderCart();
    updateCartCount();
}

async function refreshStoredUserAfterOrder() {
    const user = JSON.parse(localStorage.getItem("monal_user") || "null");

    if (!user || !user.id) return;

    try {
        const res = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/user/" + user.id,
            { cache: "no-store" }
        );

        const data = await res.json();

        if (!data || !data.id) return;

        localStorage.setItem("monal_user", JSON.stringify(data));
    } catch (err) {
        console.error("REFRESH USER AFTER ORDER ERROR:", err);
    }
}

function syncCertificatePaymentRules() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const hasCertificate = cart.some(i => i.label === "Сертифікат");

    const onlineRadio = document.querySelector('input[name="pay"][value="Картка онлайн"]');
    const prepayRadio = document.querySelector('input[name="pay"][value="Передплата 150 грн"]');

    if (!onlineRadio || !prepayRadio) return;

    if (hasCertificate) {
        prepayRadio.checked = false;
        prepayRadio.disabled = true;

        if (!onlineRadio.checked) {
            onlineRadio.checked = true;
        }
    } else {
        prepayRadio.disabled = false;
    }
}

function showCheckout() {
    document.getElementById("checkout").style.display = "block";
    syncCertificatePaymentRules();
    window.scrollTo(0, document.body.scrollHeight);
}

/* ===================== МАСКА ТЕЛЕФОНУ ===================== */

function formatPhone(e) {
    let v = e.target.value.replace(/\D/g, "");
    if (!v.startsWith("38")) v = "38" + v;
    if (v.length > 12) v = v.slice(0, 12);

    let r = "38";
    if (v.length > 2) r += "(" + v.slice(2, 5);
    if (v.length >= 5) r += ")";
    if (v.length > 5) r += " " + v.slice(5, 8);
    if (v.length > 8) r += "-" + v.slice(8, 10);
    if (v.length > 10) r += "-" + v.slice(10, 12);

    e.target.value = r;
}

/* ===================== НОВА ПОШТА (np.json) ===================== */

let NP_DATA = null;

function loadNPFromJSON() {
    fetch("/np.json")
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            if (!data || !Object.keys(data).length) return;
            NP_DATA = data;
            initCityAutocomplete();
        })
        .catch(err => {
            console.warn("Не вдалося завантажити np.json", err);
        });
}

function initCityAutocomplete() {
    const input = document.getElementById("np-city-input");
    const list = document.getElementById("np-city-list");

    if (!input || !list || !NP_DATA) return;

    const cities = Object.keys(NP_DATA).sort((a, b) => {
        if (a === "Київ") return -1;
        if (b === "Київ") return 1;
        return a.localeCompare(b, "uk");
    });

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase().trim();
        list.innerHTML = "";

        if (!value) {
            list.style.display = "none";
            return;
        }

        const matches = cities.filter(c =>
            c.toLowerCase().startsWith(value)
        ).slice(0, 15);

        if (!matches.length) {
            list.style.display = "none";
            return;
        }

        matches.forEach(city => {
            const div = document.createElement("div");
            div.className = "autocomplete-item";
            div.textContent = city;
            div.onclick = () => {
                input.value = city;
                list.style.display = "none";
                fillWarehouses(city);
            };
            list.appendChild(div);
        });

        list.style.display = "block";
    });

    document.addEventListener("click", e => {
        if (!list.contains(e.target) && e.target !== input) {
            list.style.display = "none";
        }
    });
}

function fillWarehouses(city) {
    const select = document.getElementById("np-warehouse");
    select.innerHTML = `<option value="">Оберіть відділення / поштомат</option>`;
    select.disabled = true;

    if (!NP_DATA || !NP_DATA[city]) return;

    const filtered = NP_DATA[city].filter(w => {
        const s = w.toLowerCase();
        return (
            (s.includes("відділення") || s.includes("поштомат")) &&
            !s.includes("вантаж") &&
            !s.includes("склад") &&
            !s.includes("термінал") &&
            !s.includes("служб")
        );
    });

    if (filtered.length === 0) return;

    filtered.forEach(w => {
        const opt = document.createElement("option");
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });

    select.disabled = false;
}

function toggleManualNP() {
    const manual = document.getElementById("np-manual");
    const select = document.getElementById("np-warehouse");
    const hint   = document.getElementById("np-manual-hint");

    if (!manual || !select || !hint) return;

    const manualVisible = manual.style.display === "block";

    if (!manualVisible) {
        // показуємо ручне поле
        manual.style.display = "block";
        hint.style.display = "block";
        manual.focus();

        select.style.display = "none";
        select.value = "";
        select.disabled = true;
    } else {
        // повертаємо select
        manual.style.display = "none";
        hint.style.display = "none";
        manual.value = "";

        select.style.display = "block";
        select.disabled = false;
    }
}

function applyCertificate() {
    const codeInput = document.getElementById("cert-code");
    const infoEl = document.getElementById("cert-info");

    if (!codeInput || !infoEl) return;

    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
        infoEl.textContent = "Введіть код сертифіката";
        return;
    }

    infoEl.textContent = "Перевірка сертифіката…";

    fetch("https://monal-mono-pay-production.up.railway.app/check-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.valid) {
            infoEl.textContent = "Сертифікат недійсний або вже використаний";
            return;
        }

        CERT_CODE_USED = code;
        CERT_APPLIED_AMOUNT = data.nominal;

        infoEl.innerHTML = `
            Сертифікат <strong>${code}</strong> застосовано.<br>
            Покриває: <strong>${data.nominal} грн</strong>
        `;

        recalcAfterCertificate();
    })
    .catch(() => {
        infoEl.textContent = "Помилка перевірки сертифіката";
    });
}

function recalcAfterCertificate() {

    renderCart(); // тут вже рахується ВСЕ: персональна, промокод, сертифікат

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const user = JSON.parse(localStorage.getItem("monal_user") || "null");

    const total = cart.reduce((s, i) => s + Number(i.price), 0);

    const focusProductDiscount = calcFocusProductDiscount(cart);

    const personalDiscount = calcUserCartDiscount(cart, user);

    const promoDiscount =
        typeof calcPromoDiscount === "function"
            ? calcPromoDiscount(cart)
            : 0;

    const afterDiscounts = Math.max(
        0,
        total - focusProductDiscount - personalDiscount - promoDiscount
    );

    const remaining = Math.max(0, afterDiscounts - CERT_APPLIED_AMOUNT);

    // 🔒 UX: якщо 0 грн — блокуємо вибір оплати
    const payInputs = document.querySelectorAll('input[name="pay"]');

    if (remaining === 0) {
        payInputs.forEach(input => {
            input.checked = false;
            input.disabled = true;
        });
    } else {
        payInputs.forEach(input => {
            input.disabled = false;
        });
    }
}
/* ===================== ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===================== */
async function submitOrder() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.length) return;

    await refreshStoredUserAfterOrder();

    const savedUser = JSON.parse(localStorage.getItem("monal_user") || "null");

    syncCertificatePaymentRules();

    const last  = document.getElementById("inp-last")?.value.trim() || "";
    const first = document.getElementById("inp-first")?.value.trim() || "";
    const phone = document.getElementById("inp-phone")?.value.trim() || "";
    const city  = document.getElementById("np-city-input")?.value.trim() || "";

    const npSelectEl = document.getElementById("np-warehouse");
    const npManualEl = document.getElementById("np-manual");

    const npSelect = npSelectEl ? npSelectEl.value : "";
    const npManual = npManualEl ? npManualEl.value.trim() : "";

    const np = npManual
        ? `✍️ ВРУЧНУ: ${npManual}`
        : npSelect;

    const certificateItems = cart.filter(i => i.label === "Сертифікат");
    const hasCertificate = certificateItems.length > 0;

    let certificateType = null;

    if (hasCertificate) {
        const uniqueCertificateTypes = [
            ...new Set(
                certificateItems
                    .map(i => String(i.certificateType || "").trim().toLowerCase())
                    .filter(Boolean)
            )
        ];

        if (!uniqueCertificateTypes.length) {
            alert("Для сертифіката не вибрано тип. Видаліть його з кошика і додайте заново зі сторінки сертифікатів.");
            return;
        }

        if (uniqueCertificateTypes.length > 1) {
            alert("У одному замовленні сертифікати мають бути лише одного типу. Розділіть електронні та фізичні сертифікати на різні замовлення.");
            return;
        }

        certificateType = uniqueCertificateTypes[0];
    }

    if (hasCertificate) {
        const infoEl = document.getElementById("cert-info");
        if (infoEl) {
            infoEl.innerHTML += `
                <div style="margin-top:10px; color:#b00; font-size:14px;">
                    🎁 У кошику є подарунковий сертифікат.<br>
                    Оплата можлива лише 100%.
                </div>
            `;
        }
    }

    /* ===================== РОЗРАХУНОК СУМ ===================== */

    const total = cart.reduce((s, i) => s + Number(i.price), 0);

    const focusProductDiscount = calcFocusProductDiscount(cart);

    const personalDiscount = calcUserCartDiscount(cart, savedUser);

    const promoDiscount = typeof calcPromoDiscount === "function"
        ? calcPromoDiscount(cart)
        : 0;

    const afterDiscounts = Math.max(
        0,
        total - focusProductDiscount - personalDiscount - promoDiscount
    );

    const remainingToPay = Math.max(0, afterDiscounts - CERT_APPLIED_AMOUNT);
    
    const pay = document.querySelector("input[name='pay']:checked");

    
    if (!last || !first || !phone || !city || !np || (remainingToPay > 0 && !pay)) {
        alert("Заповніть всі поля");
        return;
    }

    if (!/^38\(0\d{2}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone)) {
        alert("Телефон у форматі 38(0XX)XXX-XX-XX");
        return;
    }

    const orderId = Date.now().toString().slice(-6);

    const discoveryItemsRaw = localStorage.getItem("discoverySetItems");
    let discoveryItems = [];

    if (discoveryItemsRaw) {
        try {
            discoveryItems = JSON.parse(discoveryItemsRaw);
        } catch (e) {
            discoveryItems = [];
        }
    }

    let payNow = remainingToPay;

    let paymentLabel =
        remainingToPay === 0
            ? "Оплачено сертифікатом"
            : "100% оплата";

    if (pay && pay.value === "Передплата 150 грн") {
        payNow = 150;
        paymentLabel = "Передплата 150 грн";
    }

    const dueAmount = Math.max(0, remainingToPay - payNow);
    const orderNote = getOrderNoteFromSelectedOffer();
    const itemsText = cart
        .map(i => {

            if (i.name.startsWith("Discovery set") && discoveryItems.length) {
                return (
                    `• ${i.name} — ${i.price} грн\n` +
                    discoveryItems.map(a => `   ↳ ${a}`).join("\n")
                );
            }

            if (i.label === "Сертифікат") {
                const certTypeText = i.certificateType
                    ? ` (${i.certificateType})`
                    : "";
                return `• ${i.name}${certTypeText} — ${i.price} грн`;
            }

            return `• ${i.name} — ${i.price} грн`;
        })
        .join("\n");

    const text =
`🧾 *Нове замовлення №${orderId}*
👤 ${last} ${first}
📞 ${phone}
🏙 ${city}
📦 НП: ${np}

💰 Загальна сума: ${total} грн
${focusProductDiscount > 0 ? `🌿 Аромат дня: −${focusProductDiscount} грн\n` : ""}
${personalDiscount > 0
  ? `👤 ${
      savedUser &&
      String(savedUser.customer_status || "general").toLowerCase() === "general" &&
      !Boolean(savedUser.welcome_discount_used)
          ? "Welcome-знижка 10%"
          : "Персональна знижка"
    }: −${personalDiscount} грн\n`
  : ""}
${promoDiscount > 0 ? `🏷 Промокод: −${promoDiscount} грн\n` : ""}
${(typeof CERT_CODE_USED === "string" && CERT_CODE_USED)
  ? `🎟 Сертифікат: ${CERT_CODE_USED} (−${CERT_APPLIED_AMOUNT} грн)\n`
  : ""}
💳 Сплачено: ${paymentLabel}
💸 До оплати: ${dueAmount} грн

🛒 Товари:
${itemsText}
`;

    const certificatesData = cart
      .filter(i => i.label === "Сертифікат")
      .map(i => ({
        nominal: i.price
      }));

    PAYMENT_CONTEXT = {
      orderId,
      userId: savedUser ? savedUser.id : null,
      userEmail: savedUser ? savedUser.email : null,
      customerStatus: savedUser ? savedUser.customer_status : null,
      welcomeDiscountUsed: savedUser ? Boolean(savedUser.welcome_discount_used) : false,  
      text,
      payNow,
      certificates: certificatesData.length ? certificatesData : null,
      usedCertificates: CERT_CODE_USED ? [CERT_CODE_USED] : [],
      certificateType,

      buyerName: last + " " + first,
      buyerPhone: phone,
      delivery: np,
      itemsText: itemsText,
      totalAmount: total,
      paidAmount: payNow,
      dueAmount: dueAmount,
      paymentLabel: paymentLabel,
      orderNote: orderNote,
      focusProductDiscount,  
      personalDiscount,
      promoDiscount,
      certificateAmount: CERT_APPLIED_AMOUNT
    };

    PAY_NOW_AMOUNT = payNow;

    openPaymentModal(orderId, payNow);
}
/* ===================== МОДАЛКА ПЕРЕВІРКИ ЗАМОВЛЕННЯ ===================== */
function openPaymentModal(orderId, payNow) {
    const modal   = document.getElementById("payment-modal");
    const orderEl = document.getElementById("pay-order-id");
    const amountEl = document.getElementById("pay-amount");

    if (!modal || !orderEl || !amountEl) {
        alert("Помилка: вікно перевірки не знайдено");
        return;
    }

    // номер замовлення і сума
    orderEl.textContent = orderId;
    amountEl.textContent = payNow;

    // ПІБ
    document.getElementById("check-name").textContent =
        document.getElementById("inp-last").value + " " +
        document.getElementById("inp-first").value;

    // телефон
    document.getElementById("check-phone").textContent =
        document.getElementById("inp-phone").value;

    // місто
    document.getElementById("check-city").textContent =
        document.getElementById("np-city-input").value;

    // Нова пошта
    const npManual = document.getElementById("np-manual").value;
    const npSelect = document.getElementById("np-warehouse").value;

    document.getElementById("check-np").textContent =
        npManual ? npManual : npSelect;
    
    const orderNote = getOrderNoteFromSelectedOffer();
    const orderNoteRow = document.getElementById("check-order-note-row");
    const orderNoteEl = document.getElementById("check-order-note");

    if (orderNoteRow && orderNoteEl) {
        if (orderNote) {
            orderNoteEl.textContent = orderNote;
            orderNoteRow.style.display = "block";
        } else {
            orderNoteEl.textContent = "";
            orderNoteRow.style.display = "none";
        }
    }

    // тип оплати
    const payChecked = document.querySelector("input[name='pay']:checked");

    document.getElementById("check-pay-type").textContent =
        payChecked
            ? payChecked.value
            : "Оплачено сертифікатом";

    modal.style.display = "flex";
}

function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (modal) modal.style.display = "none";
}

function goToPayment() {
  if (!PAYMENT_CONTEXT) return;
  
  const userId = localStorage.getItem("user_id");

// 1) реєструємо замовлення
fetch("https://monal-mono-pay-production.up.railway.app/register-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderId: PAYMENT_CONTEXT.orderId,
    text: PAYMENT_CONTEXT.text,
    certificates: PAYMENT_CONTEXT.certificates || null,
    usedCertificates: PAYMENT_CONTEXT.usedCertificates || [],
    certificateType: PAYMENT_CONTEXT.certificateType || "електронний",

    buyerName: PAYMENT_CONTEXT.buyerName || "",
    buyerPhone: PAYMENT_CONTEXT.buyerPhone || "",
    delivery: PAYMENT_CONTEXT.delivery || "",
    itemsText: PAYMENT_CONTEXT.itemsText || "",
    totalAmount: PAYMENT_CONTEXT.totalAmount || "",
    paidAmount: PAYMENT_CONTEXT.paidAmount || "",
    dueAmount: PAYMENT_CONTEXT.dueAmount || "",
    paymentLabel: PAYMENT_CONTEXT.paymentLabel || "",
    orderNote: PAYMENT_CONTEXT.orderNote || "",
    focusProductDiscount: PAYMENT_CONTEXT.focusProductDiscount || 0,  
    personalDiscount: PAYMENT_CONTEXT.personalDiscount || 0,
    promoDiscount: PAYMENT_CONTEXT.promoDiscount || 0,
    certificateAmount: PAYMENT_CONTEXT.certificateAmount || 0,
    
    userId: PAYMENT_CONTEXT.userId || null,
    userEmail: PAYMENT_CONTEXT.userEmail || null,
    customerStatus: PAYMENT_CONTEXT.customerStatus || null,
    welcomeDiscountUsed: Boolean(PAYMENT_CONTEXT.welcomeDiscountUsed)  
  })
})

  .then(res => {
    if (!res.ok) throw new Error("register-order failed");

    // 2) є що платити → mono
    if (PAY_NOW_AMOUNT > 0) {
      startOnlinePayment(PAYMENT_CONTEXT.orderId, PAY_NOW_AMOUNT);
      return;
    }

    // 3) 0 грн → free order
    return fetch("https://monal-mono-pay-production.up.railway.app/send-free-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: PAYMENT_CONTEXT.orderId })
    })
    .then(res2 => {
      if (!res2.ok) throw new Error("send-free-order failed");
    })
    .then(async () => {
      await refreshStoredUserAfterOrder();  
      clearCart();
      closePaymentModal();

      const checkout = document.getElementById("checkout");
      if (checkout) {
        checkout.innerHTML = `
          <h2>Ваше замовлення №${PAYMENT_CONTEXT.orderId} оформлено.</h2>
          <p>Оплачено сертифікатом ✅</p>
        `;
      }
    });
  })
  .catch(err => {
    console.error(err);
    alert("Помилка оплати/відправки. Перевір консоль.");
  });
}

/* ===================== MONO ONLINE PAYMENT ===================== */
function startOnlinePayment(orderId, amount) {
    fetch("https://monal-mono-pay-production.up.railway.app/create-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            orderId,
            amount,
            text: PAYMENT_CONTEXT.text
        })

    })
    .then(res => res.json())
.then(data => {
    const url = data?.pageUrl || data?.paymentUrl; // на всяк випадок
    if (url) {
        window.location.href = url;
        return;
    }
    console.error("Mono create-payment failed:", data);
    alert("Помилка створення оплати");
})

    .catch(err => {
        console.error("Payment request failed:", err);
    });
}

/* ===================== ОПЛАТА ЗАМОВЛЕННЯ ===================== */
function sendOrderToTelegram(ctx) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: ctx.text,
            parse_mode: "Markdown"
        })
    }).then(() => {
        clearCart();
        document.getElementById("checkout").innerHTML =
            `<h2>Ваше замовлення №${ctx.orderId} оформлено.</h2>
             <p>Очікуйте дзвінок оператора.</p>`;
    });
}

/* ===================== INIT ===================== */

async function validateSelectedOfferInCart() {
    const cartList = document.getElementById("cart-list");
    if (!cartList) return;

    const user = JSON.parse(localStorage.getItem("monal_user") || "null");
    const selectedOffer = getSelectedOffer();

    if (!(user && user.id && selectedOffer && selectedOffer.id)) return;

    try {
        const res = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/personal-offers?userId=" + encodeURIComponent(user.id),
            { cache: "no-store" }
        );

        const data = await res.json();

        if (data.ok && Array.isArray(data.offers)) {
            const stillActive = data.offers.some(
                offer => Number(offer.id) === Number(selectedOffer.id)
            );

            if (!stillActive) {
                localStorage.removeItem("monal_selected_offer_" + user.id);

                if (selectedOffer.offer_type === "promo" || selectedOffer.promo_code) {
                    PROMO_CODE = "";
                    localStorage.removeItem("promo_code");
                }

                updateCartCount();
                renderCart();
            }
        }
    } catch (err) {
        console.error("VALIDATE SELECTED OFFER ERROR:", err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const isCartPage = Boolean(document.getElementById("cart-list"));

    if (isCartPage) {
        await loadPublicPromoCampaigns();
        await validateSelectedOfferInCart();
    }

    updateCartCount();
    renderCart();

    if (typeof loadNPFromJSON === "function") {
        loadNPFromJSON();
    }

    const phoneInput = document.getElementById("inp-phone");
    if (phoneInput && typeof formatPhone === "function") {
        phoneInput.addEventListener("input", formatPhone);
    }

    if (isCartPage) {
        setInterval(() => {
            if (document.visibilityState === "visible") {
                validateSelectedOfferInCart();
            }
        }, 10000);
    }
});

/* ===== CLEAR CART AFTER MONO PAYMENT ===== */

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");    

    if (status === "success") {
        await refreshStoredUserAfterOrder();

        localStorage.removeItem("cart");

        const user = JSON.parse(localStorage.getItem("monal_user") || "null");
        if (user && user.id) {
            localStorage.removeItem("monal_selected_offer_" + user.id);
        }    

        if (typeof updateCartCount === "function") {
            updateCartCount();
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

/* ===================== PROMO APPLY BUTTON ===================== */

document.addEventListener("DOMContentLoaded", () => {
    const promoInput = document.getElementById("promo-input");
    const promoBtn = document.getElementById("promo-apply-btn");
    const promoMessage = document.getElementById("promo-message");

    if (!promoInput || !promoBtn || !promoMessage) return;

    if (PROMO_CODE) {
        promoInput.value = PROMO_CODE;
    }

    promoBtn.addEventListener("click", async () => {
        const entered = promoInput.value.trim().toUpperCase();

        if (!entered) {
            promoMessage.textContent = "Введіть промокод";
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!cart.length) {
            promoMessage.textContent = "Спочатку додайте товари в кошик";
            return;
        }

        clearStoredPersonalPromoCodeData();

        const isOldPromo =
            PROMO &&
            Array.isArray(PROMO.codes) &&
            PROMO.codes.includes(entered);

        if (isOldPromo) {
            if (!isPromoActive(entered)) {
                promoMessage.textContent = "Промокод наразі не активний";
                return;
            }

            const promoDetailsItem = typeof getPromoByCode === "function"
                ? getPromoByCode(entered)
                : null;

            let hasEligible = false;
            let eligibleSum = 0;

            cart.forEach(item => {
                const excluded = typeof isExcludedItem === "function"
                    ? isExcludedItem(item, promoDetailsItem?.exclusions || null)
                    : false;

                if (!excluded) {
                    hasEligible = true;
                    eligibleSum += Number(item.price) || 0;
                }
            });

            if (!hasEligible) {
                promoMessage.textContent = "Знижка не поширюється на товари з кошика";
                return;
            }

            const minOrderAmount = Number(promoDetailsItem?.minOrderAmount || 0);

            if (minOrderAmount > 0 && eligibleSum < minOrderAmount) {
                PROMO_CODE = "";
                localStorage.removeItem("promo_code");

                promoMessage.textContent =
                    `Для цього промокоду потрібна сума від ${minOrderAmount} грн без врахування сертифікатів`;

                renderCart();
                return;
            }

            const user = JSON.parse(localStorage.getItem("monal_user") || "null");
            if (user && user.id) {
                localStorage.removeItem("monal_selected_offer_" + user.id);
            }

            PROMO_CODE = entered;
            localStorage.setItem("promo_code", PROMO_CODE);

            promoMessage.textContent = "Знижка застосована";
            renderCart();
            return;
        }

        const user = JSON.parse(localStorage.getItem("monal_user") || "null");

        if (!user || !user.id) {
            PROMO_CODE = "";
            localStorage.removeItem("promo_code");
            clearStoredPersonalPromoCodeData();

            promoMessage.textContent =
                "Персональний промокод доступний тільки після входу в акаунт";

            renderCart();
            return;
        }

        promoMessage.textContent = "Перевіряю промокод…";

        try {
            const response = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/promo-code/check",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        promoCode: entered,
                        items: cart
                    })
                }
            );

            const data = await response.json();

            if (!data.ok || !data.valid) {
                PROMO_CODE = "";
                localStorage.removeItem("promo_code");
                clearStoredPersonalPromoCodeData();

                promoMessage.textContent =
                    data.message || data.error || "Невірний або неактивний промокод";

                renderCart();
                return;
            }

            localStorage.removeItem("monal_selected_offer_" + user.id);

            PROMO_CODE = entered;
            localStorage.setItem("promo_code", PROMO_CODE);

            setStoredPersonalPromoCodeData({
                userId: user.id,
                offerId: data.offerId || null,
                title: data.title || "",
                promoCode: entered,
                discountAmount: Number(data.discountAmount || 0),
                minOrderAmount: Number(data.minOrderAmount || 0),
                eligibleSum: Number(data.eligibleSum || 0)
            });

            promoMessage.textContent = data.message || "Знижка застосована";
            renderCart();

        } catch (err) {
            console.error("PERSONAL PROMO CHECK ERROR:", err);

            PROMO_CODE = "";
            localStorage.removeItem("promo_code");
            clearStoredPersonalPromoCodeData();

            promoMessage.textContent = "Помилка перевірки промокоду";
            renderCart();
        }
    });
});

/* ===== MAKE CART FUNCTIONS GLOBAL (for onclick="...") ===== */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.showCheckout = showCheckout;
window.submitOrder = submitOrder;

window.openPaymentModal = typeof openPaymentModal === "function" ? openPaymentModal : undefined;
window.closePaymentModal = typeof closePaymentModal === "function" ? closePaymentModal : undefined;
window.goToPayment = typeof goToPayment === "function" ? goToPayment : undefined;

window.applyCertificate = typeof applyCertificate === "function" ? applyCertificate : undefined;
