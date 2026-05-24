document.getElementById("loginForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const login = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login,
                    email: login,
                    password
                })
            }
        );

        const data = await response.json();

        if (!data.ok) {
            alert(data.error || "Помилка входу");
            return;
        }

        if (data.loginType === "customer_only") {
            loginAsCustomer(data.user);
            return;
        }

        if (data.loginType === "staff_only") {
            loginAsStaff(data.staff);
            return;
        }

        if (data.loginType === "both") {
            showCabinetChoiceModal(data.user, data.staff);
            return;
        }

        alert("Невідомий тип входу");

    } catch (err) {

        console.error(err);
        alert("Помилка з'єднання");

    }

});

function loginAsCustomer(user) {
    localStorage.removeItem("monal_staff_user");
    localStorage.removeItem("monal_staff_login_time");

    localStorage.setItem("user_id", user.id);
    localStorage.setItem("monal_user", JSON.stringify(user));
    localStorage.setItem("monal_login_time", Date.now());

    window.location.href = "/account/account.html";
}

function loginAsStaff(staff) {
    localStorage.removeItem("monal_user");
    localStorage.removeItem("monal_login_time");
    localStorage.removeItem("user_id");

    localStorage.setItem("monal_staff_user", JSON.stringify(staff));
    localStorage.setItem("monal_staff_login_time", Date.now());

    window.location.href = "/account/staff-cabinet.html";
}

function showCabinetChoiceModal(user, staff) {
    const oldModal = document.getElementById("cabinet-choice-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.id = "cabinet-choice-modal";

    modal.innerHTML = `
        <div class="cabinet-choice-overlay">
            <div class="cabinet-choice-box">
                <h2>Оберіть кабінет</h2>
                <p>Ці дані знайдено і як клієнта, і як staff-користувача.</p>

                <button type="button" id="choose-customer-cabinet" class="buy-btn">
                    Особистий кабінет
                </button>

                <button type="button" id="choose-staff-cabinet" class="buy-btn">
                    Адмін кабінет
                </button>
            </div>
        </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
        #cabinet-choice-modal {
            position: fixed;
            inset: 0;
            z-index: 99999;
        }

        .cabinet-choice-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.72);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            box-sizing: border-box;
        }

        .cabinet-choice-box {
            width: min(420px, 100%);
            background: #f4f1ea;
            color: #171717;
            border-radius: 22px;
            padding: 30px 26px;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
            text-align: center;
        }

        .cabinet-choice-box h2 {
            margin-top: 0;
            margin-bottom: 12px;
        }

        .cabinet-choice-box p {
            margin-bottom: 22px;
            opacity: 0.78;
            line-height: 1.45;
        }

        .cabinet-choice-box .buy-btn {
            width: 100%;
            margin-top: 12px;
            text-align: center;
            justify-content: center;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    document.getElementById("choose-customer-cabinet").addEventListener("click", () => {
        loginAsCustomer(user);
    });

    document.getElementById("choose-staff-cabinet").addEventListener("click", () => {
        loginAsStaff(staff);
    });
}
