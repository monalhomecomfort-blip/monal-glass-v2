(() => {
  const COLORS = [
    "#f4efe6",
    "#7b1e3a",
    "#a4163a",
    "#d62839",
    "#f2a1b3"
  ];

  const COUNT = 120;        // більше частинок
  const DURATION = 4500;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.55;

  for (let i = 0; i < COUNT; i++) {

    const isDust = Math.random() < 0.25;   // 25% світлий пил
    const size = isDust
      ? 6 + Math.random() * 6
      : 26 + Math.random() * 24;

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 240 + Math.random() * 300;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    const el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    el.setAttribute("viewBox", "0 0 40 40");
    el.setAttribute("class", "valentine-heart");
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);

    if (isDust) {
      el.innerHTML = `
        <circle cx="20" cy="20" r="10"
          fill="rgba(255,255,255,0.9)"
        />
      `;
    } else {

      // 50% пелюстка / 50% міні квітка
      if (Math.random() < 0.5) {
        el.innerHTML = `
          <defs>
            <radialGradient id="petal-${i}" cx="35%" cy="25%" r="75%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.85)" />
              <stop offset="45%" stop-color="${color}" />
              <stop offset="100%" stop-color="rgba(0,0,0,0.35)" />
            </radialGradient>
          </defs>
          <ellipse
            cx="20"
            cy="20"
            rx="14"
            ry="18"
            fill="url(#petal-${i})"
            transform="rotate(${Math.random()*360} 20 20)"
          />
        `;
      } else {
        el.innerHTML = `
          <defs>
            <radialGradient id="flower-${i}" cx="30%" cy="30%" r="75%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
              <stop offset="40%" stop-color="${color}" />
              <stop offset="100%" stop-color="rgba(0,0,0,0.4)" />
            </radialGradient>
          </defs>
          <g fill="url(#flower-${i})">
            <ellipse cx="20" cy="8" rx="6" ry="12"/>
            <ellipse cx="20" cy="32" rx="6" ry="12"/>
            <ellipse cx="8" cy="20" rx="12" ry="6"/>
            <ellipse cx="32" cy="20" rx="12" ry="6"/>
          </g>
          <circle cx="20" cy="20" r="6" fill="rgba(255,255,255,0.9)"/>
        `;
      }
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
