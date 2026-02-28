// ===================== PROMO CONFIG =====================

window.PROMO_CONFIG = {
    active: true,                 // головний перемикач
    discount: 150,                // знижка в грн
    start: null,                  // можна задати дату "2026-03-01"
    end: null,                    // можна задати дату "2026-03-31"

    codes: [
        "MONALBLOOM",
        "MONALFLOWER",
        "MONALPETAL",
        "FLORALNOTE",
        "INBLOOM",
        "PETALMOOD",
        "FIRSTBLOOM",
        "GARDENMOOD",
        "FORHER",
        "FORHOME",
        "WITHFLOWERS",
        "BLOOMATHOME"
    ],

    // ❗ товари, які самі по собі не дають знижку
    exclusions: {
        certificates: true,
        discovery: true,
        tenMini: true
    }
};
