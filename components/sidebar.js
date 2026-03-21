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

function openSidebar() {

    const sidebar = document.getElementById("user-sidebar");

    if (sidebar) {
        sidebar.style.display = "block";
    }

}

function closeSidebar() {

    const sidebar = document.getElementById("user-sidebar");

    if (sidebar) {
        sidebar.style.display = "none";
    }

}

document.addEventListener("click", function(e) {

    if (e.target.id === "sidebar-close" || e.target.id === "sidebar-overlay") {
        closeSidebar();
    }

});
