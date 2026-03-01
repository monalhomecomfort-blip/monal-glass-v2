(() => {

  const COUNT = 90;
  const DURATION = 4200;

  const COLORS = [
    "#f4efe6",
    "#f2a1b3",
    "#d62839",
    "#7b1e3a"
  ];

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

    const angle = Math.random() * Math.PI * 2;
    const distance = 240 + Math.random() * 260;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance * -1;

    if (isDust) {
      // ✨ Світлий пил
      const dust = document.createElement("div");
      dust.className = "burst-item";

      const size = 3 + Math.random() * 4;

      dust.style.width = size + "px";
      dust.style.height = size + "px";
      dust.style.borderRadius = "50%";
      dust.style.background = "rgba(255,255,255,0.85)";
      dust.style.boxShadow = "0 0 8px rgba(255,255,255,0.6)";

      dust.style.left = originX + "px";
      dust.style.top = originY + "px";

      dust.style.setProperty("--x", x + "px");
      dust.style.setProperty("--y", y + "px");
      dust.style.setProperty("--r", Math.random()*360 + "deg");
      dust.style.setProperty("--s", 1);

      container.appendChild(dust);
      requestAnimationFrame(() => dust.classList.add("explode"));

    } else {
      // 🌸 Пелюстка SVG
      const size = 16 + Math.random() * 18;

      const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("viewBox","0 0 30 50");
      svg.classList.add("burst-item");

      svg.style.width = size + "px";
      svg.style.height = size * 1.6 + "px";

      svg.style.left = originX + "px";
      svg.style.top = originY + "px";

      svg.style.setProperty("--x", x + "px");
      svg.style.setProperty("--y", y + "px");
      svg.style.setProperty("--r", (Math.random()*360) + "deg");
      svg.style.setProperty("--s", 1);

      const path = document.createElementNS("http://www.w3.org/2000/svg","path");

      path.setAttribute(
        "d",
        "M15 0 C25 10 28 25 15 50 C2 25 5 10 15 0 Z"
      );

      path.setAttribute(
        "fill",
        COLORS[Math.floor(Math.random()*COLORS.length)]
      );

      svg.appendChild(path);
      container.appendChild(svg);

      requestAnimationFrame(() => svg.classList.add("explode"));
    }
  }

  setTimeout(() => {
    container.remove();
  }, DURATION);

})();
