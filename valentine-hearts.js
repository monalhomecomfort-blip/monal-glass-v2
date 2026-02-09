(function () {
  const container = document.getElementById("valentine-confetti");
  if (!container) return;

  /* 🎨 палітра: слонова кость, пурпур, рожевий, червоний, гнила вишня */
  const colors = [
    "#f6efe4", // слонова кость
    "#7b2d3a", // гнила вишня
    "#9c2c4b", // пурпур
    "#c94a6a", // рожевий
    "#b11226"  // глибокий червоний
  ];

  const heartsCount = 34; // не більше — щоб не виглядало дешево

  for (let i = 0; i < heartsCount; i++) {
    const heart = document.createElement("div");
    heart.className = "valentine-heart";
    heart.textContent = "❤";

    const size = 14 + Math.random() * 26; // різні розміри
    const color = colors[Math.floor(Math.random() * colors.length)];

    heart.style.fontSize = size + "px";
    heart.style.color = color;

    /* старт з центральної зони */
    heart.style.left = "50%";
    heart.style.top = "45%";

    /* напрямок польоту */
    heart.style.setProperty("--x", `${(Math.random() - 0.5) * 700}px`);
    heart.style.setProperty("--y", `${-Math.random() * 700}px`);

    /* тривалість */
    heart.style.animationDuration = `${3 + Math.random() * 2}s`;

    container.appendChild(heart);
  }

  /* ❌ повне прибирання через 5 сек */
  setTimeout(() => {
    container.remove();
  }, 5000);
})();
