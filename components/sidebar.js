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
        const avatarPreview = document.getElementById("sidebar-avatar-preview");
        if (avatarPreview && user.avatar_data) {
            avatarPreview.src = user.avatar_data;
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
