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
                                <stop offset="14%" stop-color="#fffef7"/>
                                <stop offset="30%" stop-color="#fdf4d6"/>
                                <stop offset="52%" stop-color="#f3dd9b"/>
                                <stop offset="72%" stop-color="#ddb65a"/>
                                <stop offset="100%" stop-color="#c69125" stop-opacity="0"/>
                            </radialGradient>

                            <radialGradient id="friendStarHalo" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#fffefb" stop-opacity="0.95"/>
                                <stop offset="22%" stop-color="#faedc6" stop-opacity="0.72"/>
                                <stop offset="48%" stop-color="#e9c974" stop-opacity="0.34"/>
                                <stop offset="78%" stop-color="#c89128" stop-opacity="0.12"/>
                                <stop offset="100%" stop-color="#c89128" stop-opacity="0"/>
                            </radialGradient>

                            <filter id="friendStarBlurWide" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="4.8"/>
                            </filter>

                            <filter id="friendStarBlurSoft" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="2.2"/>
                            </filter>

                            <filter id="friendStarBlurTiny" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="1.1"/>
                            </filter>
                        </defs>

                        <!-- велике зовнішнє сяйво -->
                        <circle cx="40" cy="40" r="24" fill="url(#friendStarHalo)" filter="url(#friendStarBlurWide)"/>

                        <!-- м’який теплий ореол -->
                        <circle cx="40" cy="40" r="16" fill="#f5d98a" opacity="0.34" filter="url(#friendStarBlurSoft)"/>

                        <!-- вертикальний промінь -->
                        <ellipse cx="40" cy="40" rx="3.2" ry="21" fill="#fff4c8" opacity="0.52" filter="url(#friendStarBlurSoft)"/>
                        <ellipse cx="40" cy="40" rx="1.4" ry="16" fill="#fffdf8" opacity="0.92" filter="url(#friendStarBlurTiny)"/>

                        <!-- горизонтальний промінь -->
                        <ellipse cx="40" cy="40" rx="21" ry="3.2" fill="#fff4c8" opacity="0.50" filter="url(#friendStarBlurSoft)"/>
                        <ellipse cx="40" cy="40" rx="16" ry="1.4" fill="#fffdf8" opacity="0.88" filter="url(#friendStarBlurTiny)"/>

                        <!-- діагоналі коротші і м'якші -->
                        <g transform="rotate(45 40 40)">
                            <ellipse cx="40" cy="40" rx="13" ry="2.1" fill="#f7dea0" opacity="0.42" filter="url(#friendStarBlurSoft)"/>
                            <ellipse cx="40" cy="40" rx="9.5" ry="0.95" fill="#fffdf7" opacity="0.72" filter="url(#friendStarBlurTiny)"/>
                        </g>

                        <g transform="rotate(-45 40 40)">
                            <ellipse cx="40" cy="40" rx="13" ry="2.1" fill="#f7dea0" opacity="0.42" filter="url(#friendStarBlurSoft)"/>
                            <ellipse cx="40" cy="40" rx="9.5" ry="0.95" fill="#fffdf7" opacity="0.72" filter="url(#friendStarBlurTiny)"/>
                        </g>

                        <!-- ядро -->
                        <circle cx="40" cy="40" r="7.2" fill="url(#friendStarCore)"/>
                        <circle cx="40" cy="40" r="3.2" fill="#ffffff" opacity="0.98"/>

                        <!-- маленький блік -->
                        <circle cx="36.6" cy="36.6" r="1.4" fill="#ffffff" opacity="0.75"/>
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
