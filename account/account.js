/* ===================== SESSION CONTROL ===================== */

const loginTime = localStorage.getItem("monal_login_time");

if (loginTime) {

    const hours = (Date.now() - loginTime) / (1000 * 60 * 60);

    if (hours > 24) {

        localStorage.removeItem("monal_user");
        localStorage.removeItem("monal_login_time");

        alert("Сесія завершилась. Увійдіть знову.");

        window.location.href = "/account/login.html";

    }

}

const user = JSON.parse(localStorage.getItem("monal_user"));

if (!user) {

    alert("Спочатку увійдіть у акаунт");
    window.location.href = "/account/login.html";

} else {

    const nameEl = document.getElementById("acc-fullname");
    if (nameEl) nameEl.textContent = user.name;
    const emailEl = document.getElementById("acc-email");
    if (emailEl) emailEl.textContent = user.email;
    const phoneEl = document.getElementById("acc-phone");
    if (phoneEl && user.phone) phoneEl.textContent = user.phone;
    document.getElementById("acc-discount").textContent = user.discount;
    document.getElementById("acc-total").textContent = user.total_spent;

    const spent = Number(user.total_spent);

    const levels = [
        { limit: 0, discount: 3 },
        { limit: 5000, discount: 5 },
        { limit: 8000, discount: 7 },
        { limit: 10000, discount: 10 },
        { limit: 15000, discount: 15 }
    ];

    let nextLevel = null;

    for (let i = 0; i < levels.length; i++) {
        if (spent < levels[i].limit) {
            nextLevel = levels[i];
            break;
        }
    }

    const bar = document.getElementById("progress-bar");
    const text = document.getElementById("progress-text");
    const nextLevelEl = document.getElementById("acc-next-level");

    if (!nextLevel) {

        bar.style.width = "100%";
        if (nextLevelEl) {
            nextLevelEl.textContent = "0";
        }
        text.textContent = "Максимальний рівень знижки досягнуто";
    }
    else {
        const prevLimit = levels.find(l => l.limit < nextLevel.limit)?.limit || 0;
        const progress = (spent - prevLimit) / (nextLevel.limit - prevLimit) * 100;
        bar.style.width = Math.max(0, Math.min(progress, 100)) + "%";

        const remain = nextLevel.limit - spent;
        if (nextLevelEl) {
        nextLevelEl.textContent = remain;
        }
        text.textContent = "До " + nextLevel.discount + "% залишилось: " + remain + " грн";
    }
}

function refreshUserData() {

    const user = JSON.parse(localStorage.getItem("monal_user") || "null");
    if (!user || !user.id) return;

    fetch("https://monal-mono-pay-production.up.railway.app/api/user/" + user.id)
        .then(res => res.json())
        .then(data => {

            if (!data || !data.id) return;

            localStorage.setItem("monal_user", JSON.stringify(data));

            const totalEl = document.getElementById("acc-total");
            if (totalEl) {
                totalEl.textContent = data.total_spent;
            }

            const discountEl = document.getElementById("acc-discount");
            if (discountEl) {
                discountEl.textContent = data.discount;
            }

        })
        .catch(err => console.error("refreshUserData error:", err));

}

/* ===================== ПЕРЕЗАВАНТАЖЕННЯ ДАНИХ ПРИ ВІДКРИТТІ ===================== */

document.addEventListener("DOMContentLoaded", () => {

    refreshUserData();

    setInterval(refreshUserData, 60000);

});

// оновлення коли користувач повернувся у вкладку
document.addEventListener("visibilitychange", () => {

    if (!document.hidden) {
        refreshUserData();
    }

});

/* ===================== LOGOUT ===================== */

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("monal_user");
        localStorage.removeItem("monal_login_time");
        localStorage.removeItem("user_id");

        window.location.href = "/account/login.html";

    });

}
