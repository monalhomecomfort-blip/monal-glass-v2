(() => {

  const CONFIG = {
    theme: "spring", // "valentine" | "spring" | "gold" | "minimal"
    count: 110,
    duration: 4200
  };

  const THEMES = {

    valentine: {
      colors: ["#7b1e3a","#d62839","#f2a1b3","#f4efe6"],
      shape: "heart"
    },

    spring: {
      colors: ["#f4efe6","#f2a1b3","#d62839","#7b1e3a"],
      shape: "petal"
    },

    gold: {
      colors: ["#d4af37","#f6e27a","#fff3c4"],
      shape: "dust"
    },

    minimal: {
      colors: ["#ffffff","#e8e8e8"],
      shape: "dot"
    }

  };

  const theme = THEMES[CONFIG.theme];

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.55;

  for (let i = 0; i < CONFIG.count; i++) {

    const size = 10 + Math.random() * 18;

    const angle = Math.random() * Math.PI * 2;
    const distance = 240 + Math.random() * 260;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    const el = document.createElement("div");
    el.className = "burst-item";

    el.style.left = originX + "px";
    el.style.top = originY + "px";
    el.style.width = size + "px";
    el.style.height = size + "px";

    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
    el.style.setProperty("--r", Math.random()*360 + "deg");
    el.style.setProperty("--s", 1 + Math.random()*0.4);

    const color = theme.colors[Math.floor(Math.random()*theme.colors.length)];

    if (theme.shape === "petal") {
      el.style.background = color;
      el.style.borderRadius = "65% 35% 70% 30%";
      el.style.height = size * 1.6 + "px";
    }

    if (theme.shape === "dot") {
      el.style.background = color;
      el.style.borderRadius = "50%";
    }

    if (theme.shape === "dust") {
      el.style.background = color;
      el.style.borderRadius = "50%";
      el.style.boxShadow = "0 0 12px rgba(255,215,0,0.6)";
    }

    if (theme.shape === "heart") {
      el.style.background = color;
      el.style.transform = "rotate(45deg)";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.borderRadius = "20%";
    }

    container.appendChild(el);

    requestAnimationFrame(() => {
      el.classList.add("explode");
    });
  }

  setTimeout(() => {
    container.remove();
  }, CONFIG.duration);

})();
