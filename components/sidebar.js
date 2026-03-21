function initSidebarUserState() {

    const userData = localStorage.getItem("monal_user");

    const guestBlock = document.getElementById("sidebar-guest");
    const userBlock = document.getElementById("sidebar-user");
    const logoutBlock = document.getElementById("sidebar-logout");

    const userName = document.getElementById("sidebar-user-name");
    const userDiscount = document.getElementById("sidebar-user-discount");

    if (!guestBlock || !userBlock) return;

    if (userData) {

        const user = JSON.parse(userData);

        guestBlock.style.display = "none";
        userBlock.style.display = "block";

        if (logoutBlock) {
            logoutBlock.style.display = "block";
        }

        if (userName) {
            userName.textContent = user.name || "Користувач";
        }

        if (userDiscount) {
            userDiscount.textContent = "Знижка: " + (user.discount || 0) + "%";
        }

    }

}
