const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const BESTQOOL_LINK =
  "https://www.bestqool.com/products/red-light-therapy-bq60?variant=45591408017638&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gad_campaignid=23477883501&gbraid=0AAAAAqQrcN6aOCiGoOOPhdcv9cUXdV5yW&gclid=Cj0KCQiAyvHLBhDlARIsAHxl6xrQpm8AJlBOQj0hnmLioJjhJhPEnWH3Y5ZV81y-97QLo07XUzNEL-0aAtvpEALw_wcB";

// Keep movement confined inside the card + near the button row
const card = document.querySelector(".card");
const buttonsRow = document.querySelector(".buttons");

// store original position & allowed Y band once
let origin = null;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function setOriginIfNeeded(btn) {
  if (origin) return;

  const cardRect = card.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  const rowRect = buttonsRow.getBoundingClientRect();

  origin = {
    // original button pos relative to card
    x: btnRect.left - cardRect.left,
    y: btnRect.top - cardRect.top,
    // keep movement near the row (slightly lower)
    bandTop: rowRect.top - cardRect.top - 6,
    bandHeight: 90, // tweak 70–120
  };
}

function ensureAbsolute(btn) {
  if (getComputedStyle(btn).position === "absolute") return;

  setOriginIfNeeded(btn);

  btn.style.position = "absolute";
  btn.style.zIndex = "50";
  // position relative to the card
  btn.style.left = `${origin.x}px`;
  btn.style.top = `${origin.y}px`;
}

function moveButton(btn) {
  ensureAbsolute(btn);

  const cardRect = card.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const padX = 14;
  const padY = 10;

  const minX = padX;
  const maxX = cardRect.width - btnRect.width - padX;

  const minY = Math.max(padY, origin.bandTop);
  const maxY = Math.min(
    cardRect.height - btnRect.height - padY,
    origin.bandTop + origin.bandHeight
  );

  const x = rand(minX, Math.max(minX, maxX));
  const y = rand(minY, Math.max(minY, maxY));

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
}

/* NO button: optional dodge (kept playful) */
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

/* YES button: dodges exactly twice, then accepts */
let yesClicks = 0;

yesBtn.addEventListener("click", () => {
  yesClicks += 1;

  if (yesClicks <= 2) {
    moveButton(yesBtn);
    message.textContent =
      yesClicks === 1 ? "Hehe 😄 try again" : "Okay okay… one more time 😉";
    return;
  }

  message.innerHTML = `
    <div style="margin-top:10px; display:grid; gap:10px; text-align:left;">
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

// If the page layout shifts after load (fonts, resize), reset the origin on resize
window.addEventListener("resize", () => {
  origin = null;
  // If buttons were already absolute, snap them back near original after resize
  if (getComputedStyle(yesBtn).position === "absolute") {
    yesBtn.style.position = "";
    noBtn.style.position = "";
  }
});
