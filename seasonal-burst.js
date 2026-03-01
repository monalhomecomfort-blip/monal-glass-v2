(() => {

  const COUNT = 110;
  const DURATION = 4800;

  const COLORS = [
    "#f4efe6",
    "#f2a1b3",
    "#ff6b81",
    "#e63946",
    "#f1c27d"
  ];

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.overflow = "hidden";
  document.body.appendChild(container);

  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 2;

  for (let i = 0; i < COUNT; i++) {

    const isDust = Math.random() < 0.25;

    const angle = Math.random() * Math.PI * 2;
    const force = 180 + Math.random() * 420;

    const x = Math.cos(angle) * force;
    const y = Math.sin(angle) * force;

    const gravity = 180 + Math.random() * 180;

    if (isDust) {

      const dust = document.createElement("div");
      dust.className = "burst-item";

      const size = 2 + Math.random() * 5;

      dust.style.width = size + "px";
      dust.style.height = size + "px";
      dust.style.borderRadius = "50%";
      dust.style.background = "rgba(255,255,255,0.9)";
      dust.style.boxShadow = "0 0 10px rgba(255,255,255,0.8)";

      dust.style.left = originX + "px";
      dust.style.top = originY + "px";

      dust.style.setProperty("--x", x + "px");
      dust.style.setProperty("--y", y + gravity + "px");
      dust.style.setProperty("--r", (Math.random()*360) + "deg");
      dust.style.setProperty("--s", 0.6 + Math.random()*0.8);

      container.appendChild(dust);
      requestAnimationFrame(() => dust.classList.add("explode"));

    } else {

      const size = 18 + Math.random() * 22;

      const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("viewBox","0 0 30 50");
      svg.classList.add("burst-item");

      svg.style.width = size + "px";
      svg.style.height = size * 1.6 + "px";

      svg.style.left = originX + "px";
      svg.style.top = originY + "px";

      svg.style.setProperty("--x", x + "px");
      svg.style.setProperty("--y", y + gravity + "px");
      svg.style.setProperty("--r", (Math.random()*720 - 360) + "deg");
      svg.style.setProperty("--s", 0.8 + Math.random()*0.6);

      const path = document.createElementNS("http://www.w3.org/2000/svg","path");

      path.setAttribute(
        "d",
        "M15 0 C25 12 28 30 15 50 C2 30 5 12 15 0 Z"
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
