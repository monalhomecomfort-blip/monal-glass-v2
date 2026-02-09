(() => {
  const DURATION = 4000; // 4 секунди
  const COUNT_DESKTOP = 28;
  const COUNT_MOBILE = 16;

  const colors = [
    "#f4efe6", // слонова кость
    "#f2b6c6", // рожевий
    "#c91f4a", // червоний
    "#7b1e3a", // гнила вишня
    "#6d1b3b"  // пурпур
  ];

  const isMobile = window.innerWidth < 600;
  const COUNT = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "99999";
  document.body.appendChild(container);

  for (let i = 0; i < COUNT; i++) {
    const heart = document.createElement("div");

    const size = Math.random() * 18 + 12;
    const left = Math.random() * 100;
    const delay = Math.random() * 600;
    const duration = Math.random() * 1200 + 2400;

    heart.style.position = "absolute";
    heart.style.left = `${left}%`;
    heart.style.bottom = "-40px";
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.background = colors[Math.floor(Math.random() * colors.length)];
    heart.style.transform = "rotate(45deg)";
    heart.style.opacity = "0.95";
    heart.style.borderRadius = "4px";
    heart.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.25))";

    heart.style.animation = `
      floatUp ${duration}ms ease-out ${delay}ms forwards
    `;

    heart.innerHTML = `
      <span style="
        position:absolute;
        width:100%;
        height:100%;
        background:inherit;
        border-radius:50%;
        top:-50%;
        left:0;
      "></span>
      <span style="
        position:absolute;
        width:100%;
        height:100%;
        background:inherit;
        border-radius:50%;
        left:-50%;
        top:0;
      "></span>
    `;

    container.appendChild(heart);
  }

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) rotate(45deg) scale(0.8);
        opacity: 0;
      }
      15% {
        opacity: 1;
      }
      100% {
        transform: translateY(-110vh) rotate(45deg) scale(1.1);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    container.remove();
    style.remove();
  }, DURATION + 1000);
})();
