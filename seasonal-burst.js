(() => {

  const CONFIG = {
    theme: "spring",     // змінюється при потребі
    count: 120,
    duration: 4200
  };

  const THEMES = {

    spring: {
      colors: ["#f4efe6","#f2a1b3","#d62839","#7b1e3a"],
      type: "petal"
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

    const isDust = Math.random() < 0.25;
    const size = isDust
      ? 4 + Math.random() * 4
      : 14 + Math.random() * 16;

    const angle = Math.random() * Math.PI * 2;
    const distance = 260 + Math.random() * 260;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    const el = document.createElement("div");
    el.className = "burst-item";

    el.style.position = "absolute";
    el.style.left = originX + "px";
    el.style.top = originY + "px";

    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--y", y + "px");
    el.style.setProperty("--r", (Math.random()*360) + "deg");
    el.style.setProperty("--s", 1 + Math.random()*0.4);

    if (isDust) {
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.borderRadius = "50%";
      el.style.background = "rgba(255,255,255,0.85)";
      el.style.boxShadow = "0 0 10px rgba(255,255,255,0.6)";
    } else {
      el.style.width = size + "px";
      el.style.height = size * 1.6 + "px";
      el.style.background = theme.colors[Math.floor(Math.random()*theme.colors.length)];

      /* Справжня форма пелюстки */
      el.style.clipPath = "ellipse(38% 55% at 50% 50%)";
      el.style.transform = "translate(-50%, -50%) rotate(" + (Math.random()*360) + "deg)";
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
