(() => {

  const COUNT = 90;
  const DURATION = 4500;

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
  const centerY = canvas.height / 2;

  const particles = [];

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  for (let i = 0; i < COUNT; i++) {

    const angle = Math.random() * Math.PI * 2;
    const speed = random(2, 6);

    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: random(8, 22),
      rotation: random(0, Math.PI * 2),
      rotationSpeed: random(-0.05, 0.05),
      type: Math.random(),
      life: 1
    });
  }

  function drawPetal(p) {

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const gradient = ctx.createRadialGradient(0, -p.size/3, p.size/6, 0, 0, p.size);
    gradient.addColorStop(0, "#ffe5ec");
    gradient.addColorStop(1, "#ff8fab");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
    ctx.fill();

    ctx.restore();
  }

  function drawLeaf(p) {

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const gradient = ctx.createLinearGradient(0, -p.size, 0, p.size);
    gradient.addColorStop(0, "#b7e4c7");
    gradient.addColorStop(1, "#2d6a4f");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
    ctx.fill();

    ctx.restore();
  }

  function drawPollen(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    const gradient = ctx.createRadialGradient(0,0,0,0,0,p.size);
    gradient.addColorStop(0, "rgba(255,215,0,1)");
    gradient.addColorStop(1, "rgba(255,215,0,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  let start = performance.now();

  function animate(now) {

    const progress = (now - start) / DURATION;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // гравітація
      p.rotation += p.rotationSpeed;

      p.life -= 0.01;

      ctx.globalAlpha = p.life;

      if(p.type < 0.5) drawPetal(p);
      else if(p.type < 0.8) drawLeaf(p);
      else drawPollen(p);
    });

    if(progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);

})();
