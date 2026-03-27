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
    const birthdayEl = document.getElementById("acc-birthday");
    if (birthdayEl && user.birthday) {
        const date = new Date(user.birthday);
        const formatted =
            String(date.getDate()).padStart(2, "0") + "." +
            String(date.getMonth() + 1).padStart(2, "0") + "." +
            date.getFullYear();
        birthdayEl.textContent = formatted;
    }    
    const genderEl = document.getElementById("acc-gender");
    if (genderEl && user.gender) genderEl.textContent = user.gender;
    const addressEl = document.getElementById("acc-address");
    if (addressEl && user.address) addressEl.textContent = user.address;
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
    const text = document.getElementById("acc-next-level");
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
            const phoneEl = document.getElementById("acc-phone");
            if (phoneEl && data.phone) {
                phoneEl.textContent = data.phone;
            }
            const birthdayEl = document.getElementById("acc-birthday");
            if (birthdayEl && data.birthday) {
                const date = new Date(data.birthday);
                const formatted =
                    String(date.getDate()).padStart(2, "0") + "." +
                    String(date.getMonth() + 1).padStart(2, "0") + "." +
                    date.getFullYear();
                birthdayEl.textContent = formatted;
            }
            const genderEl = document.getElementById("acc-gender");
            if (genderEl && data.gender) {
                genderEl.textContent = data.gender;
            }
            const addressEl = document.getElementById("acc-address");
            if (addressEl && data.address) {
                addressEl.textContent = data.address;
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

/* ===================== EDIT BIRTHDAY ===================== */
const editBirthdayBtn = document.getElementById("edit-birthday-btn");
const saveBirthdayBtn = document.getElementById("save-birthday-btn");
const birthdaySpan = document.getElementById("acc-birthday");

if (editBirthdayBtn && saveBirthdayBtn && birthdaySpan) {
    editBirthdayBtn.onclick = function () {
        let currentValue = birthdaySpan.textContent.trim();
        if (currentValue === "не вказано") {
            currentValue = "";
        } else if (currentValue.includes(".")) {
            const parts = currentValue.split(".");
            if (parts.length === 3) {
                currentValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        birthdaySpan.innerHTML = `<input type="date" id="birthday-input" value="${currentValue}">`;
        editBirthdayBtn.style.display = "none";
        saveBirthdayBtn.style.display = "inline";
    };
}

/* ===================== SAVE BIRTHDAY ===================== */
if (saveBirthdayBtn && birthdaySpan) {
    saveBirthdayBtn.onclick = async function () {
        const input = document.getElementById("birthday-input");
        if (!input) return;
        const value = input.value;
        const user = JSON.parse(localStorage.getItem("monal_user"));
        if (!user || !user.id) {
            alert("Помилка користувача");
            return;
        }
        try {
            const response = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        birthday: value
                    })
                }
            );
            const data = await response.json();
            if (!data.ok) {
                alert("Не вдалося зберегти дату");
                return;
            }
            if (!value) {
                birthdaySpan.textContent = "не вказано";
            } else {
                const parts = value.split("-");
                birthdaySpan.textContent =
                    `${parts[2]}.${parts[1]}.${parts[0]}`;
            }
            editBirthdayBtn.style.display = "inline";
            saveBirthdayBtn.style.display = "none";
        } catch (err) {
            console.error(err);
            alert("Помилка збереження");
        }
    };
}

/* ===================== EDIT PHONE ===================== */

const editPhoneBtn = document.getElementById("edit-phone-btn");
const savePhoneBtn = document.getElementById("save-phone-btn");
const phoneSpan = document.getElementById("acc-phone");

if (editPhoneBtn && savePhoneBtn && phoneSpan) {
    editPhoneBtn.onclick = function () {
        let currentValue = phoneSpan.textContent.trim();
        if (currentValue === "не вказано") {
            currentValue = "";
        }
        phoneSpan.innerHTML =
            `<input type="text" id="phone-input" value="${currentValue}">`;
        editPhoneBtn.style.display = "none";
        savePhoneBtn.style.display = "inline";
    };
}

/* ===================== SAVE PHONE ===================== */

if (savePhoneBtn && phoneSpan) {
    savePhoneBtn.onclick = async function () {
        const input = document.getElementById("phone-input");
        if (!input) return;
        const value = input.value;
        const user = JSON.parse(localStorage.getItem("monal_user"));
        if (!user || !user.id) {
            alert("Помилка користувача");
            return;
        }
        try {
            const response = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        phone: value
                    })
                }
            );
            const data = await response.json();
            if (!data.ok) {
                alert("Не вдалося зберегти телефон");
                return;
            }
            phoneSpan.textContent =
                value || "не вказано";
            editPhoneBtn.style.display = "inline";
            savePhoneBtn.style.display = "none";
        } catch (err) {
            console.error(err);
            alert("Помилка збереження");
        }
    };
}

/* ===================== EDIT GENDER ===================== */
const editGenderBtn = document.getElementById("edit-gender-btn");
const saveGenderBtn = document.getElementById("save-gender-btn");
const genderSpan = document.getElementById("acc-gender");
if (editGenderBtn && saveGenderBtn && genderSpan) {
    editGenderBtn.onclick = function () {
        let currentValue = genderSpan.textContent.trim();
        genderSpan.innerHTML = `
<select id="gender-input">
<option value="">не вказано</option>
<option value="female">жіноча</option>
<option value="male">чоловіча</option>
</select>
`;
        const select = document.getElementById("gender-input");
        if (currentValue === "жіноча") {
            select.value = "female";
        }
        if (currentValue === "чоловіча") {
            select.value = "male";
        }
        editGenderBtn.style.display = "none";
        saveGenderBtn.style.display = "inline";
    };
}

/* ===================== SAVE GENDER ===================== */
if (saveGenderBtn && genderSpan) {
    saveGenderBtn.onclick = async function () {
        const input = document.getElementById("gender-input");
        if (!input) return;
        const value = input.value;
        const user = JSON.parse(localStorage.getItem("monal_user"));
        if (!user || !user.id) {
            alert("Помилка користувача");
            return;
        }
        try {
            const response = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        gender: value
                    })
                }
            );
            const data = await response.json();
            if (!data.ok) {
                alert("Не вдалося зберегти стать");
                return;
            }
            genderSpan.textContent =
                value === "female"
                    ? "жіноча"
                    : value === "male"
                    ? "чоловіча"
                    : "не вказано";
            editGenderBtn.style.display = "inline";
            saveGenderBtn.style.display = "none";
        } catch (err) {
            console.error(err);
            alert("Помилка збереження");
        }
    };
}
