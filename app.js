let gameSeq = [];
let userSeq = [];

const btns = ["green", "red", "yellow", "blue"];

let started = false;
let level = 0;
let isPlaying = false; // true while sequence is being shown

const levNo = document.querySelector("#levelno");
const inputbtn = document.querySelectorAll(".box");

levNo.textContent = "Press any key to start";

document.addEventListener("keydown", function () {
  if (!started) {
    started = true;
    level = 0;
    gameSeq = [];
    nextRound();
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playSequence() {
  isPlaying = true;
  // small pause before sequence starts
  await sleep(300);

  for (let i = 0; i < gameSeq.length; i++) {
    const sel = `.${gameSeq[i]}`;
    const btn = document.querySelector(sel);
    if (!btn) continue; // defensive
    flashButton(btn);
    // wait long enough for flash + a tiny gap so user can see order
    await sleep(450);
  }

  isPlaying = false;
}

function nextRound() {
  userSeq = [];
  level++;
  levNo.textContent = `Level ${level}`;

  const newcolor = btns[Math.floor(Math.random() * btns.length)];
  gameSeq.push(newcolor);

  // play the whole sequence (including the newly added color)
  playSequence();
}

function flashButton(btn) {
  if (!btn) return;
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 250);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 250);
}

for (const btn of inputbtn) {
  btn.addEventListener("click", function () {
    // ignore clicks while sequence is playing
    if (isPlaying) return;

    const color = this.dataset.color || this.classList[1];

    userFlash(this);
    userSeq.push(color);

    const currentIndex = userSeq.length - 1;

    if (userSeq[currentIndex] !== gameSeq[currentIndex]) {
      // wrong choice -> game over
      document.body.style.backgroundColor = "red";
      setTimeout(() => (document.body.style.backgroundColor = ""), 250);
      resetGame();
      return;
    }

    // if user finished the sequence correctly -> next round
    if (userSeq.length === gameSeq.length) {
      // small delay so user sees last press
      setTimeout(nextRound, 500);
    }
  });
}

function resetGame() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  isPlaying = false;
  levNo.textContent = "Press any key to start";
}
