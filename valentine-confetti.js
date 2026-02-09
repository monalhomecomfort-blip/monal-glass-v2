(() => {
  const COLORS = [
    "#f4efe6", // слонова кость
    "#7b1e3a", // гнила вишня
    "#a4163a", // пурпур
    "#d62839", // червоний
    "#f2a1b3"  // рожевий
  ];

  const COUNT = 42;
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
    const heart = document.createElement("div");
    heart.className = "valentine-heart";

    const size = 10 + Math.random() * 18;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 180 + Math.random() * 260;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.background = color;
    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;
    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);

    container.appendChild(heart);

    requestAnimationFrame(() => {
      heart.classList.add("explode");
    });
  }

  setTimeout(() => {
    container.remove();
  }, DURATION);
})();
