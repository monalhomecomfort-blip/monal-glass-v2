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

            font-family: 'Montserrat', sans-serif;
        }

        .cabinet-choice-overlay {
            width: 100%;
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 24px;

            background: rgba(0, 0, 0, 0.72);

            box-sizing: border-box;
        }

        .cabinet-choice-box {
            width: min(520px, 100%);
            padding: 34px 38px 38px;

            background: #050505;
            color: #f5f3ed;

            border: 0;
            border-radius: 0;

            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.34);

            text-align: left;
            text-transform: uppercase;
        }

        .cabinet-choice-box h2 {
            margin: 0 0 14px;

            color: #f5f3ed;

            font-size: clamp(14px, 1.15vw, 16px);
            font-weight: 800;
            line-height: 1.2;
        }

        .cabinet-choice-box p {
            margin: 0 0 26px;

            color: #f5f3ed;

            font-size: clamp(10px, 0.72vw, 13px);
            font-weight: 200;
            line-height: 1.4;

            opacity: 1;
        }

        .cabinet-choice-box .buy-btn {
            width: 100%;
            height: 42px;

            margin: 0 0 10px;
            padding: 0 18px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 0;
            border-radius: 7px;

            background: #f5f3ed;
            color: #050505;

            font-family: 'Montserrat', sans-serif;
            font-size: clamp(10px, 0.72vw, 13px);
            font-weight: 600;

            text-align: center;
            text-transform: uppercase;

            cursor: pointer;
        }

        .cabinet-choice-box .buy-btn:last-child {
            margin-bottom: 0;
        }

        .cabinet-choice-box .buy-btn:hover {
            background: #e8e5de;
        }

        @media (max-width: 600px) {
            .cabinet-choice-overlay {
                padding: 18px;
            }

            .cabinet-choice-box {
                width: 100%;
                padding: 28px 18px 30px;
            }

            .cabinet-choice-box h2 {
                font-size: 14px;
            }

            .cabinet-choice-box p,
            .cabinet-choice-box .buy-btn {
                font-size: 10px;
            }

            .cabinet-choice-box .buy-btn {
                height: 40px;
            }
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
