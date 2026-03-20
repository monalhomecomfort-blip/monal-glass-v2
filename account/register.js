document.getElementById("registerForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(
            "https://monal-mono-pay-production.up.railway.app/api/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.ok) {

            alert("Реєстрація успішна");

            window.location.href = "/account/login.html";

        } else {

            alert(data.error || "Помилка реєстрації");

        }

    } catch (err) {

        console.error(err);
        alert("Помилка з'єднання");

    }

});
