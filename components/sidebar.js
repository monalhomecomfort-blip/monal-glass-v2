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
                <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
                    <defs>
                    <radialGradient id="starCore" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#fffef7"/>
                      <stop offset="32%" stop-color="#fff2b8"/>
                      <stop offset="62%" stop-color="#f3c95f"/>
                      <stop offset="100%" stop-color="#b8841e"/>
                    </radialGradient>

                    <linearGradient id="starRay" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fffdf2"/>
                      <stop offset="45%" stop-color="#f8de86"/>
                      <stop offset="100%" stop-color="#c7922b"/>
                    </linearGradient>

                    <filter id="starSoftGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="2.2" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>

                    <filter id="starTinyGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.1" result="blur2"/>
                      <feMerge>
                        <feMergeNode in="blur2"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- м'яке зовнішнє сяйво -->
                  <circle cx="32" cy="32" r="11.5" fill="#f4d36c" opacity="0.28" filter="url(#starSoftGlow)"/>

                  <!-- тонкі промені -->
                  <g stroke="url(#starRay)" stroke-linecap="round" filter="url(#starTinyGlow)" opacity="0.95">
                    <line x1="32" y1="8"  x2="32" y2="56" stroke-width="1.8"/>
                    <line x1="8"  y1="32" x2="56" y2="32" stroke-width="1.8"/>
                    <line x1="15.5" y1="15.5" x2="48.5" y2="48.5" stroke-width="1.25"/>
                    <line x1="48.5" y1="15.5" x2="15.5" y2="48.5" stroke-width="1.25"/>
                  </g>

                  <!-- центральна зірка -->
                  <g filter="url(#starTinyGlow)">
                    <path
                      d="M32 21.8
                         L34.9 28.3
                         L42.1 29
                         L36.7 33.7
                         L38.2 40.7
                         L32 37.1
                         L25.8 40.7
                         L27.3 33.7
                         L21.9 29
                         L29.1 28.3
                         Z"
                      fill="url(#starCore)"
                      stroke="#fff7d0"
                      stroke-width="0.9"
                      stroke-linejoin="round"
                    />
                  </g>

                  <!-- яскраве ядро -->
                  <circle cx="32" cy="32" r="2.5" fill="#fffdf6" opacity="0.95"/>
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
