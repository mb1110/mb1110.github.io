const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const BESTQOOL_LINK =
  "https://www.bestqool.com/products/red-light-therapy-bq60?variant=45591408017638&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gad_campaignid=23477883501&gbraid=0AAAAAqQrcN6aOCiGoOOPhdcv9cUXdV5yW&gclid=Cj0KCQiAyvHLBhDlARIsAHxl6xrQpm8AJlBOQj0hnmLioJjhJhPEnWH3Y5ZV81y-97QLo07XUzNEL-0aAtvpEALw_wcB";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function ensureAbsolute(btn) {
  if (getComputedStyle(btn).position === "absolute") return;
  const rect = btn.getBoundingClientRect();
  btn.style.position = "absolute";
  btn.style.left = `${rect.left}px`;
  btn.style.top = `${rect.top}px`;
  btn.style.zIndex = "50";
}

function moveButton(btn) {
  ensureAbsolute(btn);

  const padding = 14;
  const rect = btn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - padding;
  const maxY = window.innerHeight - rect.height - padding;

  btn.style.left = `${rand(padding, Math.max(padding, maxX))}px`;
  btn.style.top = `${rand(padding, Math.max(padding, maxY))}px`;
}

/* Keep NO playful (optional) */
function moveNoButton() {
  moveButton(noBtn);
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

/* YES dodges exactly twice, then accepts */
let yesClicks = 0;

yesBtn.addEventListener("click", () => {
  yesClicks += 1;

  if (yesClicks <= 2) {
    moveButton(yesBtn);
    message.textContent =
      yesClicks === 1
        ? "Hehe 😄 try again"
        : "Okay okay… one more time 😉";
    return;
  }

  // Success
  message.innerHTML = `
    <div style="
      margin-top: 10px;
      display: grid;
      gap: 10px;
      text-align: left;
    ">
      <div>AAAAA YES!!! 💖<br/>Okay—officially the cutest Valentine ever.</div>

      <a href="${BESTQOOL_LINK}" target="_blank" rel="noopener noreferrer"
         style="
           display:inline-block;
           padding:12px 14px;
           border-radius:14px;
           text-decoration:none;
           font-weight:700;
           color: rgba(255,255,255,0.95);
           background: linear-gradient(135deg, #ff4f9a, #b075ff);
           width: fit-content;
         ">
         Claim your 🔴✨ surprise
      </a>

      <div style="opacity:0.8;">(PS: Red light 🔴✨)</div>
    </div>
  `;

  yesBtn.disabled = true;
  noBtn.disabled = true;
});
