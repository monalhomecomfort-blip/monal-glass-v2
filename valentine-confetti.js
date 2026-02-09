(() => {
  const COLORS = [
    "#f4efe6", // слонова кость
    "#7b1e3a", // гнила вишня
    "#a4163a", // пурпур
    "#d62839", // червоний
    "#f2a1b3"  // рожевий
  ];

  const COUNT = 44;
  const DURATION = 4200;

  // контейнер
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  // центр хлопавки
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.55;

  // стилі + анімація
  const style = document.createElement("style");
  style.innerHTML = `
    .valentine-heart {
      position: absolute;
      transform: translate(-50%, -50%) rotate(45deg) scale(0.6);
      opacity: 1;
      animation: heart-pop 3.8s cubic-bezier(.22,.61,.36,1) forwards;
      box-shadow: 0 8px 18px rgba(0,0,0,0.28);
    }

    .valentine-heart::before,
    .valentine-heart::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: inherit;
      border-radius: 50%;
    }

    .valentine-heart::before {
      top: -50%;
      left: 0;
    }

    .valentine-heart::after {
      left: -50%;
      top: 0;
    }

    @keyframes heart-pop {
      0% {
        transform: translate(-50%, -50%) scale(0.4) rotate(45deg);
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        transform:
          translate(
            calc(-50% + var(--x)),
            calc(-50% + var(--y))
          )
          scale(1)
          rotate(45deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // створення сердечок
  for (let i = 0; i < COUNT; i++) {
    const heart = document.createElement("div");
    heart.className = "valentine-heart";

    const size = 12 + Math.random() * 20;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 300;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.background = color;

    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;

    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);

    container.appendChild(heart);
  }

  // прибрати все після анімації
  setTimeout(() => {
    container.remove();
  }, DURATION);
})();
