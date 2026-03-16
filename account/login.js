document.getElementById("loginForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(
            "https://monal-mono-pay-production-a7ae.up.railway.app/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.ok) {

            localStorage.setItem("user_id", data.user.id);
            localStorage.setItem("monal_user", JSON.stringify(data.user));
            
            // час входу для контролю сесії
            localStorage.setItem("monal_login_time", Date.now());

            window.location.href = "/account/account.html";

        } else {

            alert(data.error || "Помилка входу");

        }

    } catch (err) {

        console.error(err);
        alert("Помилка з'єднання");

    }

});
