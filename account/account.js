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
    if (genderEl && user.gender) {
    genderEl.textContent =
        user.gender === "female"
            ? "жіноча"
            : user.gender === "male"
            ? "чоловіча"
            : "не вказано";
}
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
                    genderEl.textContent =
                    data.gender === "female"
                        ? "жіноча"
                        : data.gender === "male"
                        ? "чоловіча"
                        : "не вказано";
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

/* ===================== EDIT PERSONAL DATA BLOCK ===================== */

const editPersonalBtn = document.getElementById("edit-personal-btn");
const savePersonalBtn = document.getElementById("save-personal-btn");

const birthdaySpan = document.getElementById("acc-birthday");
const genderSpan = document.getElementById("acc-gender");
const phoneSpan = document.getElementById("acc-phone");

if (editPersonalBtn && savePersonalBtn && birthdaySpan && genderSpan && phoneSpan) {
    editPersonalBtn.addEventListener("click", () => {
        let birthdayValue = birthdaySpan.textContent.trim();
        let genderValue = genderSpan.textContent.trim();
        let phoneValue = phoneSpan.textContent.trim();

        if (birthdayValue === "не вказано") {
            birthdayValue = "";
        } else if (birthdayValue.includes(".")) {
            const parts = birthdayValue.split(".");
            if (parts.length === 3) {
                birthdayValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        if (genderValue === "жіноча") {
            genderValue = "female";
        } else if (genderValue === "чоловіча") {
            genderValue = "male";
        } else {
            genderValue = "";
        }

        if (phoneValue === "не вказано") {
            phoneValue = "";
        }

        birthdaySpan.innerHTML = `
            <input type="date" id="birthday-input" value="${birthdayValue}">
        `;

        genderSpan.innerHTML = `
            <select id="gender-input">
                <option value="">не вказано</option>
                <option value="female">жіноча</option>
                <option value="male">чоловіча</option>
            </select>
        `;

        phoneSpan.innerHTML = `
            <input type="text" id="phone-input" value="${phoneValue}">
        `;

        const genderInput = document.getElementById("gender-input");
        if (genderInput) {
            genderInput.value = genderValue;
        }

        editPersonalBtn.style.display = "none";
        savePersonalBtn.style.display = "inline-flex";
    });

    savePersonalBtn.addEventListener("click", async () => {
        const birthdayInput = document.getElementById("birthday-input");
        const genderInput = document.getElementById("gender-input");
        const phoneInput = document.getElementById("phone-input");

        if (!birthdayInput || !genderInput || !phoneInput) return;

        const birthday = birthdayInput.value.trim();
        const gender = genderInput.value.trim();
        const phone = phoneInput.value.trim();

        const user = JSON.parse(localStorage.getItem("monal_user") || "null");
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
                        birthday,
                        gender,
                        phone
                    })
                }
            );

            const data = await response.json();

            if (!data.ok) {
                alert("Не вдалося зберегти дані");
                return;
            }

            if (!birthday) {
                birthdaySpan.textContent = "не вказано";
            } else {
                const parts = birthday.split("-");
                birthdaySpan.textContent = `${parts[2]}.${parts[1]}.${parts[0]}`;
            }

            genderSpan.textContent =
                gender === "female"
                    ? "жіноча"
                    : gender === "male"
                    ? "чоловіча"
                    : "не вказано";

            phoneSpan.textContent = phone || "не вказано";

            const updatedUser = {
                ...user,
                birthday: birthday || null,
                gender: gender || null,
                phone: phone || null
            };

            localStorage.setItem("monal_user", JSON.stringify(updatedUser));

            editPersonalBtn.style.display = "inline-flex";
            savePersonalBtn.style.display = "none";
        } catch (err) {
            console.error(err);
            alert("Помилка збереження");
        }
    });
}

/* ===================== EDIT ADDRESS ===================== */
const editAddressBtn = document.getElementById("edit-address-btn");
if (editAddressBtn) {
    editAddressBtn.addEventListener("click", () => {
        const addressEl = document.getElementById("acc-address");
        let city = "";
        let street = "";
        if (
            addressEl.textContent &&
            addressEl.textContent !== "не вказано" &&
            addressEl.textContent !== "Адреса не вказана"
        ) {
            const parts = addressEl.textContent.split(",");
            city = parts[0]?.trim() || "";
            street = parts[1]?.trim() || "";
        }
        addressEl.innerHTML = `
            <input
                type="text"
                id="np-city-input"
                placeholder="Місто"
                value="${city}"
                autocomplete="off"
            >
            <div id="np-city-list" class="np-city-list"></div>
            <br>
            <input
                type="text"
                id="street-input"
                placeholder="Вулиця, будинок"
                value="${street}"
            >
        `;
        editAddressBtn.style.display = "none";
        document.getElementById("save-address-btn").style.display = "inline-flex";

        /* запускаємо автокомпліт NP */
        if (typeof loadNPFromJSON === "function") {
            loadNPFromJSON();
        }
    });
}

/* ===================== SAVE ADDRESS ===================== */
const saveAddressBtn = document.getElementById("save-address-btn");
if (saveAddressBtn) {
    saveAddressBtn.addEventListener("click", async () => {
        const cityInput = document.getElementById("np-city-input");
        const streetInput = document.getElementById("street-input");
        if (!cityInput || !streetInput) return;
        const city = cityInput.value.trim();
        const street = streetInput.value.trim();
        const address =
            city || street
                ? `${city}${city && street ? ", " : ""}${street}`
                : "";
        const user = JSON.parse(localStorage.getItem("monal_user"));
        if (!user?.id) return;
        try {
            const res = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        address
                    })
                }
            );
            const data = await res.json();
            if (!data.ok) {
                alert("Помилка збереження");
                return;
            }
            document.getElementById("acc-address").textContent =
                address || "не вказано";
            saveAddressBtn.style.display = "none";
            document.getElementById("edit-address-btn").style.display = "inline-flex";
        } catch (err) {
            console.error(err);
            alert("Помилка сервера");
        }
    });
}

/* ===================== EDIT ADDITIONAL INFO ===================== */
const editExtraBtn = document.getElementById("edit-extra-btn");
if (editExtraBtn) {
    editExtraBtn.addEventListener("click", () => {
        const checkboxes = document.querySelectorAll(".extra-info-checkbox");
        checkboxes.forEach(cb => {
            cb.disabled = false;
            cb.classList.remove("readonly-checkbox");
        });
        editExtraBtn.style.display = "none";
        document.getElementById("save-extra-btn").style.display = "inline-flex";
    });
}

/* ===================== SAVE ADDITIONAL INFO ===================== */
const saveExtraBtn = document.getElementById("save-extra-btn");
if (saveExtraBtn) {
    saveExtraBtn.addEventListener("click", async () => {
        const has_pet = document.getElementById("has-pet-checkbox")?.checked ? 1 : 0;
        const has_car = document.getElementById("has-car-checkbox")?.checked ? 1 : 0;
        const travels_often = document.getElementById("travels-often-checkbox")?.checked ? 1 : 0;
        const user = JSON.parse(localStorage.getItem("monal_user"));
        if (!user?.id) return;
        try {
            const res = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-profile",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        has_pet,
                        has_car,
                        travels_often
                    })
                }
            );
            const data = await res.json();
            if (!data.ok) {
                alert("Помилка збереження");
                return;
            }
            const checkboxes = document.querySelectorAll(".extra-info-checkbox");
            checkboxes.forEach(cb => {
                cb.disabled = true;
                cb.classList.add("readonly-checkbox");
            });
            saveExtraBtn.style.display = "none";
            document.getElementById("edit-extra-btn").style.display = "inline-flex";
        } catch (err) {
            console.error(err);
            alert("Помилка сервера");
        }
    });
}
