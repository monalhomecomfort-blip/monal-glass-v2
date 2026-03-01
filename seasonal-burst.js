(() => {

  const COUNT = 160;
  const DURATION = 4800;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";

  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 + 40;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  const particles = [];

  for (let i = 0; i < COUNT; i++) {

    const angle = random(-Math.PI * 0.9, -Math.PI * 0.1);

    const typeRand = Math.random();
    let type;

    if (typeRand < 0.4) type = "petal";
    else if (typeRand < 0.65) type = "leaf";
    else if (typeRand < 0.85) type = "pollen";
    else type = "flower";

    const size =
      type === "pollen"
        ? random(2, 5)
        : type === "flower"
        ? random(26, 42)
        : random(14, 28);

    const speed =
      type === "pollen"
        ? random(3, 6)
        : random(2, 4);

    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.03, 0.03),
      type,
      alpha: 1
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const reds = ["#ff4d6d", "#e63946", "#ff758f", "#d62839"];
    const color = reds[Math.floor(Math.random() * reds.length)];

    const g = ctx.createRadialGradient(
      0, -p.size * 0.4, p.size * 0.2,
      0, 0, p.size
    );
    g.addColorStop(0, "#ffe5ec");
    g.addColorStop(1, color);

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(
      p.size * 1.2, -p.size * 0.2,
      p.size * 0.6, p.size,
      0, p.size
    );
    ctx.bezierCurveTo(
      -p.size * 0.7, p.size * 0.7,
      -p.size * 1.3, -p.size * 0.3,
      0, -p.size
    );
    ctx.fill();

    ctx.restore();
  }

  function drawLeaf(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const g = ctx.createLinearGradient(0, -p.size, 0, p.size);
    g.addColorStop(0, "#a8e6a3");
    g.addColorStop(1, "#1b5e20");

    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(
      p.size * 1.3, -p.size * 0.3,
      p.size * 0.7, p.size,
      0, p.size
    );
    ctx.bezierCurveTo(
      -p.size * 0.6, p.size * 0.6,
      -p.size * 1.4, -p.size * 0.4,
      0, -p.size
    );
    ctx.fill();

    ctx.restore();
  }

  // НОВИЙ ПИЛОК — зерна, а не пляма
  function drawPollen(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    for (let i = 0; i < 4; i++) {
      const offsetX = random(-p.size, p.size);
      const offsetY = random(-p.size, p.size);
      const r = random(0.5, 1.5);

      const g = ctx.createRadialGradient(
        offsetX, offsetY, 0,
        offsetX, offsetY, r
      );
      g.addColorStop(0, "rgba(255,220,80,1)");
      g.addColorStop(1, "rgba(255,220,80,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawFlower(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI * 2) / 5);

      const g = ctx.createRadialGradient(
        0, -p.size * 0.4, p.size * 0.2,
        0, 0, p.size
      );
      g.addColorStop(0, "#fff0f6");
      g.addColorStop(1, "#ff8fab");

      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(
        p.size * 0.6, 0,
        0, p.size * 0.6
      );
      ctx.quadraticCurveTo(
        -p.size * 0.6, 0,
        0, -p.size
      );
      ctx.fill();
    }

    // серцевина
    ctx.fillStyle = "#ffd60a";
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  let start = performance.now();

  function animate(now) {

    const progress = (now - start) / DURATION;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.vx += 0.01;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.006;

      ctx.globalAlpha = p.alpha;

      if (p.type === "petal") drawPetal(p);
      else if (p.type === "leaf") drawLeaf(p);
      else if (p.type === "pollen") drawPollen(p);
      else drawFlower(p);
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);

})();
