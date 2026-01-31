const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const BESTQOOL_LINK =
  "https://www.bestqool.com/products/red-light-therapy-bq60?variant=45591408017638&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gad_campaignid=23477883501&gbraid=0AAAAAqQrcN6aOCiGoOOPhdcv9cUXdV5yW&gclid=Cj0KCQiAyvHLBhDlARIsAHxl6xrQpm8AJlBOQj0hnmLioJjhJhPEnWH3Y5ZV81y-97QLo07XUzNEL-0aAtvpEALw_wcB";

const PRADA_LINK =
  "https://www.sunglasshut.com/us/prada/pr-15ws-8056262345986";

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
    x: btnRect.left - cardRect.left,
    y: btnRect.top - cardRect.top,
    bandTop: rowRect.top - cardRect.top - 6,
    bandHeight: 90, // tweak 70–120
  };
}

function ensureAbsolute(btn) {
  if (getComputedStyle(btn).position === "absolute") return;

  setOriginIfNeeded(btn);

  btn.style.position = "absolute";
  btn.style.zIndex = "50";
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

/* NO button: playful dodge (kept) */
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

/* ---------- Main YES flow: dodges exactly twice, then accepts ---------- */
let yesClicks = 0;

yesBtn.addEventListener("click", () => {
  yesClicks += 1;

  if (yesClicks <= 2) {
    moveButton(yesBtn);
    message.textContent =
      yesClicks === 1 ? "Hehe 😄 try again" : "Okay okay… one more time 😉";
    return;
  }

  showMainSuccess();
});

/* ---------- UI helpers for message-area buttons ---------- */
function primaryLinkButton(href, label) {
  return `
    <a href="${href}" target="_blank" rel="noopener noreferrer"
       style="
         display:inline-block;
         padding:12px 14px;
         border-radius:14px;
         text-decoration:none;
         font-weight:800;
         color: rgba(255,255,255,0.95);
         background: linear-gradient(135deg, #ff4f9a, #b075ff);
         width: fit-content;
       ">
      ${label}
    </a>
  `;
}

function ghostButton(id, label) {
  return `
    <button id="${id}" type="button"
      style="
        appearance:none;
        border-radius:14px;
        padding:12px 14px;
        font-weight:800;
        cursor:pointer;
        background: rgba(255,255,255,0.10);
        border: 1px solid rgba(255,255,255,0.18);
        color: rgba(255,255,255,0.92);
        width: fit-content;
      ">
      ${label}
    </button>
  `;
}

function smallYesNo(idYes, idNo) {
  return `
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button id="${idYes}" type="button"
        style="
          appearance:none;
          border:0;
          border-radius:14px;
          padding:12px 14px;
          font-weight:850;
          cursor:pointer;
          color: rgba(255,255,255,0.96);
          background: linear-gradient(135deg, #ff4f9a, #b075ff);
        ">
        Yes 💖
      </button>

      <button id="${idNo}" type="button"
        style="
          appearance:none;
          border-radius:14px;
          padding:12px 14px;
          font-weight:850;
          cursor:pointer;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.92);
        ">
        No 🙈
      </button>
    </div>
  `;
}

/* ---------- Screens / states ---------- */
function showMainSuccess() {
  // lock the original big buttons
  yesBtn.disabled = true;
  noBtn.disabled = true;

  message.innerHTML = `
    <div style="display:grid; gap:10px; text-align:left;">
      <div>
        AAAAA YES!!! 💖<br/>
        Okay—officially the cutest Valentine ever.
      </div>

      ${primaryLinkButton(BESTQOOL_LINK, "Claim your 🔴✨ surprise")}

      <div style="opacity:0.8;">(PS: Red light 🔴✨)</div>

      <div style="margin-top:6px;">
        ${ghostButton("bonusBtn", "PS: click for bonus gift 🎁")}
      </div>

      <div id="bonusArea"></div>
    </div>
  `;

  const bonusBtn = document.getElementById("bonusBtn");
  bonusBtn.addEventListener("click", showBonusPrompt);
}

function showBonusPrompt() {
  const bonusArea = document.getElementById("bonusArea");
  if (!bonusArea) return;

  bonusArea.innerHTML = `
    <div style="display:grid; gap:10px;">
      <div style="font-weight:800;">
        double double… do you want double gift? 😈🎁
      </div>
      ${smallYesNo("bonusYes", "bonusNo")}
      <div id="bonusMsg"></div>
    </div>
  `;

  const bonusYes = document.getElementById("bonusYes");
  const bonusNo = document.getElementById("bonusNo");

  bonusYes.addEventListener("click", onBonusYesClick);
  bonusNo.addEventListener("click", () => {
    document.getElementById("bonusMsg").innerHTML =
      `<div style="opacity:0.85;">Okay fine 😭 (but you’re missing out)</div>`;
  });
}

/* Bonus YES requires 2 clicks */
let bonusYesClicks = 0;

function onBonusYesClick() {
  bonusYesClicks += 1;

  const bonusMsg = document.getElementById("bonusMsg");
  if (!bonusMsg) return;

  if (bonusYesClicks === 1) {
    bonusMsg.innerHTML = `
      <div style="display:grid; gap:10px;">
        <div style="font-weight:850;">
          sorry u not get cuz u a pika 😤⚡<br/>
          try to click again
        </div>
      </div>
    `;
    return;
  }

  // second click: give the link
  bonusMsg.innerHTML = `
    <div style="display:grid; gap:10px;">
      <div style="font-weight:850;">Okayyy you earned it 😌✨</div>
      ${primaryLinkButton(PRADA_LINK, "Get link 😎🖤")}
    </div>
  `;

  // optional: disable bonus buttons after success
  const bonusYes = document.getElementById("bonusYes");
  const bonusNo = document.getElementById("bonusNo");
  if (bonusYes) bonusYes.disabled = true;
  if (bonusNo) bonusNo.disabled = true;
}

/* If layout shifts, reset origin */
window.addEventListener("resize", () => {
  origin = null;
});
