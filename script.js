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

/* NO button still dodges */
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
  const redLightDataUri = `data:image/webp;base64,UklGRngqAABXRUJQVlA4IGwqAABwlQCdASq/AB8BPmEoj0UkIqOWq04wQAYEtBfft/3slcCX/+X0tvy77YeJyF/k/ve+nfdvOv0Y9h+Tl0L57P+h6vP7B6g37EdNnzH+aZ/0P1o91n9L/1/7E/AB/K/8J///aQ9U7+9f87//+4L+wn/49d393vg5/sH/W9hX9v////7fcA///qAf/XiovNd42/j/Efye+l/bv+/+4Bon68dSz5D97/1f9w9JP+B4y/Lj/C9QX8d/nn+V/Nr+5cgZbP0Bfar7H/uP8B+5/nff8Hod9dPYA/oP9e/XX23/6nhXfZ/93+2fwA/0H/Cfsr7s39f/7f9B5yv0j/Pf+r/R/AP/Of7T/2f8d7Zv/t9uv7Z//v3Rv2a//bhD1kt4Ybgl775M5/TUr/BKT0Se8jhjpiUBk7LoO8dQ61h1spEFFD9077nbd/6Bm6YartM72RKgbvDXa6JEcaJi4XoaLjqGSeGdNP9aQfIF+IkeNTuvPO5EeZl1QTVIfAPIxvTd/C2870wpeVyYUbGe+N4zjH5S6Lp10hUnUPzSUFM4i97HK0hTG9bTvBTOZrF90Clc+lIXwWpnuxQL1lvnzv/k+y1oh4Sz9p9o4DpXD/jtRN151OwnFtKkmwFpzqqba1gf0JgBeJzUZblVMQwespQyIZG96ME/hBa5WEBgyDvDhD7RnR62RxuwCTbqokRTOkHorJ/ll6blic5Ep1WXrqD+lCx7JoUzIURTuyQ3Mpkdtm7tNrStpN0hU+snsU169W6Vawme5XOo7h/OfHn4SX9+Qq1xam68cP2kE+DhgZFXJ4L+4GL4D43iNMtnjbKtdGRYFWzx/bYaMxUpCu/z9A/fSYodOOh9e89gS6/9cw9C00wNvIA6zUx0lAnHBTc6KjpfVdp9maOhzvbhyXF+hnXafbV4i+IIoh1t+p7iyuGQ4Oi67KYYXRwHrDOTh47/k1tGI0DRcszKhCg3zMERQfOB7PL78QX9seBOqAR1GURjQaiM/dQ5aNrIGOB2iFx5eT4LjWrsQtH4SIpkwCWTcngrcfH7KUL+ldfjrfupA0CihiAaeTHf3+Nuj/tDo6iumBw4TDHtvzM4QfV/rxl0gVS9WM4jqx8eeGj67j0FzfLmtY83qSLCjER5/Al7q+IrmLd2xTJtdHK4CaPrjYSYA7N5XXLcH2R+sycFXb1GjLTUoix6QRmrpZ7aukgigmI28nEKfERkTQAZdlIp7LRJ5BXdcntVDusCeu/1wPZF2Tmd1WN3CVkW5k2qpkMxZrN0UyVZ8YYQbhIaLn6Z90NlIqh/kd3W6lGHg2MQYtq1vHdjBgCDl7Foljhk2GhgTGdCiqgCV
