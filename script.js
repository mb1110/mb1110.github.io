const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];
let animId = null;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function makeConfetti(count = 180) {
  const colors = ["#ff4f9a", "#b075ff", "#4dffdf", "#ffd166", "#ffffff"];
  confettiPieces = Array.from({ length: count }, () => ({
    x: rand(0, window.innerWidth),
    y: rand(-window.innerHeight, 0),
    w: rand(6, 12),
    h: rand(8, 16),
    vx: rand(-2.2, 2.2),
    vy: rand(2.2, 5.2),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.12, 0.12),
    color: colors[Math.floor(rand(0, colors.length))],
    alpha: rand(0.75, 1),
  }));
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of confettiPieces) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.y > window.innerHeight + 30) {
      p.y = rand(-120, -20);
      p.x = rand(0, window.innerWidth);
    }
    if (p.x < -30) p.x = window.innerWidth + 30;
    if (p.x > window.innerWidth + 30) p.x = -30;
  }
  animId = requestAnimationFrame(drawConfetti);
}

function startConfetti() {
  makeConfetti(220);
  if (animId) cancelAnimationFrame(animId);
  drawConfetti();

  setTimeout(() => {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }, 4500);
}

/** Turns a flex button into an absolute-positioned button once, then moves it around */
function ensureAbsolute(btn) {
  if (getComputedStyle(btn).position === "absolute") return;

  const rect = btn.getBoundingClientRect();
  btn.style.position = "absolute";
  btn.style.left = `${rect.left}px`;
  btn.style.top = `${rect.top}px`;
  btn.style.zIndex = "50";
}

function moveButton(btn, avoidRects = []) {
  ensureAbsolute(btn);

  const padding = 14;
  const rect = btn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  let x, y, tries = 0;

  do {
    x = rand(padding, Math.max(padding, maxX));
    y = rand(padding, Math.max(padding, maxY));
    tries++;
    if (tries > 25) break;
  } while (
    avoidRects.some(r => Math.abs(x - r.left) < 180 && Math.abs(y - r.top) < 120)
  );

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

/* NO button still dodges (as before) */
function moveNoButton() {
  moveButton(noBtn, [yesBtn.getBoundingClientRect()]);
  message.textContent = "Nice try 😄 (the 'No' button is feeling shy)";
}
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

/* YES button: dodges the first TWO tries, then accepts */
let yesTries = 0;

function teaseYesMove() {
  moveButton(yesBtn, [noBtn.getBoundingClientRect()]);

  if (yesTries === 1) {
    message.textContent = "Hehe catch me 😄 (try again)";
  } else if (yesTries === 2) {
    message.textContent = "Okay okay… one more time 😉";
  }
}

function acceptYes() {
  message.innerHTML = `
    <div class="reward-wrap">
      <div>AAAAA YES!!! 💖<br/>Okay—officially the cutest Valentine ever.</div>
      <img class="reward-img" src="redlight.jpg" alt="Red light surprise 🔴✨" />
      <div>🔴✨ Surprise unlocked.</div>
    </div>
  `;
  startConfetti();
  yesBtn.disabled = true;
  noBtn.disabled = true;
}

yesBtn.addEventListener("click", () => {
  yesTries += 1;

  if (yesTries <= 2) {
    teaseYesMove();
    return;
  }

  acceptYes();
});

/* Mobile friendliness: also tease on touchstart so it feels responsive */
yesBtn.addEventListener(
  "touchstart",
  (e) => {
    // let click still fire; just make it feel immediate on mobile
    if (yesTries < 2) teaseYesMove();
  },
  { passive: true }
);
