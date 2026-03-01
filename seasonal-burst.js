(() => {

  const COUNT = 120;
  const DURATION = 5200;

  const PETAL_COLORS = [
    ["#f8d7e3","#f2a1b3"],
    ["#ffe5ec","#ffb3c6"],
    ["#ffd6e0","#ff8fab"]
  ];

  const LEAF_COLORS = [
    ["#9fd8a3","#4f9d69"],
    ["#b7e4c7","#2d6a4f"]
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

  function random(min,max){ return min + Math.random()*(max-min); }

  function createGradient(id, colors){
    return `
      <defs>
        <radialGradient id="${id}" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="${colors[0]}"/>
          <stop offset="100%" stop-color="${colors[1]}"/>
        </radialGradient>
      </defs>
    `;
  }

  for (let i = 0; i < COUNT; i++) {

    const type = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const force = random(180, 420);

    const x = Math.cos(angle) * force;
    const y = Math.sin(angle) * force + random(120,260);

    const size = random(16,38);
    const depth = Math.random();

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.classList.add("burst-item");
    svg.setAttribute("viewBox","0 0 60 60");

    svg.style.width = size + "px";
    svg.style.height = size + "px";
    svg.style.left = originX + "px";
    svg.style.top = originY + "px";

    svg.style.opacity = 0.8 + Math.random()*0.2;
    if(depth < 0.3){
      svg.style.filter = "blur(2px)";
    }

    svg.style.setProperty("--x", x + "px");
    svg.style.setProperty("--y", y + "px");
    svg.style.setProperty("--r", (random(-360,360)) + "deg");
    svg.style.setProperty("--s", random(0.7,1.4));

    let shape = "";
    let gradientId = "g" + i;

    if(type < 0.5){
      // 🌸 пелюстка форма 1
      const colors = PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
      shape = `
        ${createGradient(gradientId, colors)}
        <path d="M30 5 C50 15 50 45 30 55 C10 45 10 15 30 5 Z"
        fill="url(#${gradientId})"/>
      `;
    }
    else if(type < 0.75){
      // 🌺 пелюстка форма 2
      const colors = PETAL_COLORS[Math.floor(Math.random()*PETAL_COLORS.length)];
      shape = `
        ${createGradient(gradientId, colors)}
        <path d="M30 10 C45 20 40 50 30 55 C20 50 15 20 30 10 Z"
        fill="url(#${gradientId})"/>
      `;
    }
    else{
      // 🍃 листок
      const colors = LEAF_COLORS[Math.floor(Math.random()*LEAF_COLORS.length)];
      shape = `
        ${createGradient(gradientId, colors)}
        <path d="M10 30 Q30 5 50 30 Q30 55 10 30 Z"
        fill="url(#${gradientId})"/>
      `;
    }

    svg.innerHTML = shape;
    container.appendChild(svg);

    requestAnimationFrame(() => svg.classList.add("explode"));
  }

  setTimeout(() => container.remove(), DURATION);

})();
