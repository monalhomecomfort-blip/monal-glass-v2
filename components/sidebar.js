function initSidebarUserState() {
    const userData = localStorage.getItem("monal_user");
    const userBlock = document.getElementById("sidebar-user");
    const logoutBlock = document.getElementById("sidebar-logout");
    const userName = document.getElementById("sidebar-user-name");
    const userDiscount = document.getElementById("sidebar-user-discount");
    const statusBadge = document.getElementById("sidebar-status-badge");
    if (!userBlock) return;
    if (userData) {
        const user = JSON.parse(userData);        
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
        const avatarPreview = document.getElementById("sidebar-avatar-preview");
        if (avatarPreview && user.avatar_data) {
            avatarPreview.src = user.avatar_data;
        }
        if (statusBadge) {
            const customerStatus = String(user.customer_status || "general").toLowerCase();

            statusBadge.style.display = "none";
            statusBadge.textContent = "";
            statusBadge.classList.remove("is-friends", "is-partners");

            if (customerStatus === "friends") {
                statusBadge.innerHTML = `
                    <svg viewBox="0 0 80 80" width="58" height="58" aria-hidden="true">
                        <defs>
                            <radialGradient id="friendStarCore" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#ffffff"/>
                                <stop offset="18%" stop-color="#fffdf2"/>
                                <stop offset="38%" stop-color="#f9e8b2"/>
                                <stop offset="62%" stop-color="#e8c86e"/>
                                <stop offset="100%" stop-color="#c9972e" stop-opacity="0"/>
                            </radialGradient>

                            <radialGradient id="friendStarGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#fffef8" stop-opacity="0.95"/>
                                <stop offset="35%" stop-color="#f6df95" stop-opacity="0.75"/>
                                <stop offset="70%" stop-color="#d5a63d" stop-opacity="0.28"/>
                                <stop offset="100%" stop-color="#c08b24" stop-opacity="0"/>
                            </radialGradient>

                            <filter id="friendStarBlur" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="2.4"/>
                            </filter>

                            <filter id="friendStarSoft" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="1.6"/>
                            </filter>
                        </defs>

                        <circle cx="40" cy="40" r="22" fill="url(#friendStarGlow)" filter="url(#friendStarBlur)"/>

                        <ellipse cx="40" cy="40" rx="1.15" ry="24" fill="#fff6cf" filter="url(#friendStarSoft)"/>
                        <ellipse cx="40" cy="40" rx="0.34" ry="28" fill="#fffdf6" opacity="0.72"/>

                        <ellipse cx="40" cy="40" rx="24" ry="1.15" fill="#fff6cf" filter="url(#friendStarSoft)"/>
                        <ellipse cx="40" cy="40" rx="28" ry="0.34" fill="#fffdf6" opacity="0.72"/>
                        
                        <g transform="rotate(45 40 40)">
                            <ellipse cx="40" cy="40" rx="17" ry="0.72" fill="#f7df9d" filter="url(#friendStarSoft)"/>
                            <ellipse cx="40" cy="40" rx="20" ry="0.28" fill="#fffdf6" opacity="0.68"/>
                        </g>

                        <g transform="rotate(-45 40 40)">
                            <ellipse cx="40" cy="40" rx="17" ry="0.72" fill="#f7df9d" filter="url(#friendStarSoft)"/>
                            <ellipse cx="40" cy="40" rx="20" ry="0.28" fill="#fffdf6" opacity="0.68"/>
                        </g>

                        <circle cx="40" cy="40" r="7.2" fill="url(#friendStarCore)" filter="url(#friendStarSoft)" opacity="0.92"/>
                        <circle cx="40" cy="40" r="2.1" fill="#ffffff" opacity="0.78"/>
                        <circle cx="36.8" cy="36.8" r="0.9" fill="#fffdf4" opacity="0.58"/>
                    </svg>
                `;
                statusBadge.classList.add("is-friends");
                statusBadge.style.display = "inline-flex";
            } else if (customerStatus === "partners") {
                statusBadge.textContent = "VIP";
                statusBadge.classList.add("is-partners");
                statusBadge.style.display = "inline-flex";
            }
        }
    }
}

function openSidebar() {
    const sidebar = document.getElementById("user-sidebar");
    if (!sidebar) return;
    sidebar.style.display = "block";
    sidebar.classList.add("open");
}

function closeSidebar() {
    const sidebar = document.getElementById("user-sidebar");
    if (!sidebar) return;
    sidebar.classList.remove("open");
    setTimeout(() => {
        sidebar.style.display = "none";
    }, 300);
}
document.addEventListener("click", function(e) {
    if (e.target.id === "sidebar-close" || e.target.id === "sidebar-overlay") {
        closeSidebar();
    }
});

function setSidebarTopOffset() {
    const nav = document.querySelector("nav");
    const topCats = document.querySelector(".nav-top-categories");
    let top = 0;
    if (nav) {
        top += nav.offsetHeight;
    }
    if (topCats && window.getComputedStyle(topCats).display !== "none") {
        top += topCats.offsetHeight;
    }
    document.documentElement.style.setProperty("--sidebar-top", top + "px");
}

function logoutUser() {
    localStorage.removeItem("monal_user");
    localStorage.removeItem("monal_login_time");
    localStorage.removeItem("user_id");
    window.location.href = "/account/login.html";
}

function initSidebarAvatarPreview() {
    const avatarInput = document.getElementById("sidebar-avatar-input");
    const avatarPreview = document.getElementById("sidebar-avatar-preview");
    if (!avatarInput || !avatarPreview) return;
    avatarInput.addEventListener("change", async function () {
        const file = this.files && this.files[0];
        if (!file) return;
        try {
            const compressedBase64 = await compressAvatarImage(file, 300);
            avatarPreview.src = compressedBase64;
            const user = JSON.parse(localStorage.getItem("monal_user") || "null");
            if (!user || !user.id) {
                alert("Спочатку увійдіть у акаунт");
                return;
            }
            const res = await fetch(
                "https://monal-mono-pay-production.up.railway.app/api/update-avatar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        avatar_data: compressedBase64
                    })
                }
            );
            const data = await res.json();
            if (!data.ok) {
                alert("Не вдалося зберегти фото");
                return;
            }
            const updatedUser = {
                ...user,
                avatar_data: compressedBase64
            };
            localStorage.setItem("monal_user", JSON.stringify(updatedUser));
        } catch (err) {
            console.error(err);
            alert(err.message || "Не вдалося обробити або зберегти фото");
        }
    });
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function compressAvatarImage(file, maxSizeKB = 300) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("Дозволені тільки JPG, PNG або WEBP");
    }
    const dataUrl = await fileToDataURL(file);
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });
    let width = img.width;
    let height = img.height;
    const maxSide = 800;
    if (width > height && width > maxSide) {
        height = Math.round((height * maxSide) / width);
        width = maxSide;
    } else if (height >= width && height > maxSide) {
        width = Math.round((width * maxSide) / height);
        height = maxSide;
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    let quality = 0.92;
    let output = canvas.toDataURL("image/jpeg", quality);
    while (output.length / 1024 > maxSizeKB * 1.37 && quality > 0.45) {
        quality -= 0.07;
        output = canvas.toDataURL("image/jpeg", quality);
    }
    return output;
}

function setActiveSidebarLink() {
    const sidebarLinks = document.querySelectorAll("#user-sidebar .sidebar-link");
    if (!sidebarLinks.length) return;

    const currentPath = window.location.pathname.replace(/\/+$/, "");

    sidebarLinks.forEach(link => {
        link.classList.remove("is-active");

        const linkUrl = new URL(link.href, window.location.origin);
        const linkPath = linkUrl.pathname.replace(/\/+$/, "");

        if (linkPath === currentPath) {
            link.classList.add("is-active");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const sidebarContainer = document.getElementById("sidebar-container");
    if (!sidebarContainer) return;

    const observer = new MutationObserver(function () {
        if (sidebarContainer.querySelector(".sidebar-link")) {
            setActiveSidebarLink();
        }
    });

    observer.observe(sidebarContainer, {
        childList: true,
        subtree: true
    });
});
