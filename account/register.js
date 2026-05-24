document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !password) {
        alert("Введіть імʼя та пароль");
        return;
    }

    if (!email && !phone) {
        alert("Вкажіть email або телефон");
        return;
    }

    try {
        const registerResponse = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email: email || null,
                    phone: phone || null,
                    password
                })
            }
        );

        const registerData = await registerResponse.json();

        if (!registerData.ok) {
            alert(registerData.error || "Помилка реєстрації");
            return;
        }

        const loginValue = email || phone;

        const loginResponse = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: loginValue,
                    email: loginValue,
                    password
                })
            }
        );

        const loginData = await loginResponse.json();

        if (!loginData.ok || !loginData.user) {
            alert(loginData.error || "Не вдалося автоматично увійти після реєстрації");
            return;
        }

        localStorage.setItem("monal_user", JSON.stringify(loginData.user));
        localStorage.setItem("monal_login_time", Date.now());
        localStorage.setItem("user_id", loginData.user.id);

        window.location.href = "/account/account.html";

    } catch (err) {
        console.error(err);
        alert("Помилка з'єднання");
    }
});
