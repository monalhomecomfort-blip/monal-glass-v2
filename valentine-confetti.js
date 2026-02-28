(() => {
  const COLORS = [
    "#f4efe6",
    "#f2a1b3",
    "#d62839",
    "#7b1e3a"
  ];

  const COUNT = 130;
  const DURATION = 4200;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.55;

  for (let i = 0; i < COUNT; i++) {

    const isDust = Math.random() < 0.3;

    const size = isDust
      ? 4 + Math.random() * 4
      : 18 + Math.random() * 18;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 240 + Math.random() * 280;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    const el = document.createElement("div");
    el.className = "valentine-heart";
    el.style.width = `${size}px`;
    el.style.height = `${size * 1.4}px`;
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);

    if (isDust) {
      el.style.borderRadius = "50%";
      el.style.background = "rgba(255,255,255,0.85)";
      el.style.boxShadow = "0 0 6px rgba(255,255,255,0.6)";
    } else {
      el.style.borderRadius = "60% 40% 70% 30%";
      el.style.background = color;
      el.style.boxShadow = "0 10px 20px rgba(0,0,0,0.25)";
      el.style.transform = `rotate(${Math.random()*360}deg)`;
    }

    container.appendChild(el);

    requestAnimationFrame(() => {
      el.classList.add("explode");
    });
  }

  setTimeout(() => {
    container.remove();
  }, DURATION);
})();
