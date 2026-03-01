(() => {

  const COUNT = 90;
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

  function noise(val, amount) {
    return val + random(-amount, amount);
  }

  const reds = ["#ff4d6d", "#e63946", "#d62839", "#ff758f"];
  const greens = ["#9ad1a3", "#1b5e20"];

  const particles = [];

  for (let i = 0; i < COUNT; i++) {

    const angle = random(-Math.PI * 0.9, -Math.PI * 0.1);
    const typeRand = Math.random();

    let type;
    if (typeRand < 0.5) type = "petal";
    else if (typeRand < 0.75) type = "leaf";
    else type = "flower";

    const size =
      type === "flower"
        ? random(28, 45)
        : random(16, 26);

    const speed = random(2, 4);

    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.02, 0.02),
      type,
      alpha: 1,
      color: reds[Math.floor(Math.random() * reds.length)],
      leafColor: greens[Math.floor(Math.random() * greens.length)]
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const g = ctx.createRadialGradient(
      0, -p.size * 0.3, p.size * 0.2,
      0, 0, p.size
    );

    g.addColorStop(0, "#ffe5ec");
    g.addColorStop(1, p.color);

    ctx.fillStyle = g;

    ctx.beginPath();

    const topX = noise(0, p.size * 0.15);
    const topY = -p.size;

    ctx.moveTo(topX, topY);

    ctx.bezierCurveTo(
      noise(p.size * 1.1, p.size * 0.2),
      noise(-p.size * 0.3, p.size * 0.2),
      noise(p.size * 0.5, p.size * 0.2),
      noise(p.size, p.size * 0.2),
      0,
      p.size
    );

    ctx.bezierCurveTo(
      noise(-p.size * 0.6, p.size * 0.2),
      noise(p.size * 0.6, p.size * 0.2),
      noise(-p.size * 1.1, p.size * 0.2),
      noise(-p.size * 0.3, p.size * 0.2),
      topX,
      topY
    );

    ctx.fill();
    ctx.restore();
  }

  function drawLeaf(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const g = ctx.createLinearGradient(0, -p.size, 0, p.size);
    g.addColorStop(0, p.leafColor);
    g.addColorStop(1, "#0f3e13");

    ctx.fillStyle = g;

    ctx.beginPath();

    ctx.moveTo(0, -p.size);

    ctx.bezierCurveTo(
      noise(p.size * 1.2, p.size * 0.2),
      noise(-p.size * 0.3, p.size * 0.2),
      noise(p.size * 0.6, p.size * 0.2),
      noise(p.size, p.size * 0.2),
      0,
      p.size
    );

    ctx.bezierCurveTo(
      noise(-p.size * 0.6, p.size * 0.2),
      noise(p.size * 0.6, p.size * 0.2),
      noise(-p.size * 1.2, p.size * 0.2),
      noise(-p.size * 0.3, p.size * 0.2),
      0,
      -p.size
    );

    ctx.fill();
    ctx.restore();
  }

  function drawFlower(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const petals = Math.floor(random(5, 8));
    const step = (Math.PI * 2) / petals;

    for (let i = 0; i < petals; i++) {
      ctx.rotate(step);
      drawPetal({
        x: 0,
        y: 0,
        size: p.size * random(0.8, 1),
        rotation: 0,
        color: p.color
      });
    }

    // центр зернистий
    ctx.fillStyle = "#d4a017";

    for (let i = 0; i < 25; i++) {
      const r = random(0, p.size * 0.25);
      const a = random(0, Math.PI * 2);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(x, y, random(0.5, 1.5), 0, Math.PI * 2);
      ctx.fill();
    }

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
      p.alpha -= 0.005;

      ctx.globalAlpha = p.alpha;

      if (p.type === "petal") drawPetal(p);
      else if (p.type === "leaf") drawLeaf(p);
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
