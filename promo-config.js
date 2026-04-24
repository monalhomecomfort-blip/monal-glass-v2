// ===================== PROMO CONFIG =====================

window.PROMO_CONFIG = {
    active: true,
    discount: 150,

    // 📅 період дії
    start: "2026-02-28",
    end: "2026-05-31",

    // 🔐 діючі коди для старої логіки
    codes: [
        "MONALBLOOM"
    ],

    // ❗ товари, які самі по собі не дають знижку
    exclusions: {
        certificates: true,
        discovery: true,
        tenMini: true
    },

    // ===================== НОВА ЛОГІКА =====================
    promoDetails: [
        {
            code: "MONALBLOOM",
            type: "fixed",
            value: 150,
            minOrderAmount: 0,
            start: "2026-02-28",
            end: "2026-05-31",
            exclusions: {
                certificates: true,
                discovery: true,
                tenMini: true
            }
        },
        {
            code: "MONAL200",
            type: "fixed",
            value: 200,
            minOrderAmount: 2000,
            start: "2026-04-01",
            end: "2027-04-23",
            exclusions: {
                certificates: true
            }
        },
        {
            code: "MONAL500",
            type: "fixed",
            value: 500,
            minOrderAmount: 3000,
            start: "2025-01-01",
            end: "2027-01-02",
            exclusions: {
                certificates: true
            }
        },
        {
            code: "MONALPERCENT",
            type: "percent",
            value: 10,
            minOrderAmount: 0,
            start: "2026-04-01",
            end: "2027-04-23",
            exclusions: {
                certificates: true
            }
        }
    ]
};
