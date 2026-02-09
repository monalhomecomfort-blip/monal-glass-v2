(() => {
  const COLORS = [
    "#f4efe6", // слонова кость
    "#7b1e3a", // гнила вишня
    "#a4163a", // пурпур
    "#d62839", // червоний
    "#f2a1b3"  // рожевий
  ];

  const COUNT = 90;
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
    const size = 34 + Math.random() * 28;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 220 + Math.random() * 260;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    const heart = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    heart.setAttribute("viewBox", "0 0 32 29");
    heart.setAttribute("class", "valentine-heart");
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;
    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);

    heart.innerHTML = `
      <defs>
        <radialGradient id="shine-${i}" cx="28%" cy="22%" r="70%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.95)" />
          <stop offset="22%" stop-color="rgba(255,255,255,0.45)" />
          <stop offset="55%" stop-color="${color}" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>
      <path
        d="M16 29
           C7 22, 0 16, 0 9
           C0 4, 4 0, 9 0
           C12 0, 14 2, 16 4
           C18 2, 20 0, 23 0
           C28 0, 32 4, 32 9
           C32 16, 25 22, 16 29 Z"
        fill="url(#shine-${i})"
      />
    `;

    container.appendChild(heart);

    requestAnimationFrame(() => {
      heart.classList.add("explode");
    });
  }

  setTimeout(() => {
    container.remove();
  }, DURATION);
})();
