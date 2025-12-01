let gameSeq = [];
let userSeq = [];
const btns = ["green", "red", "yellow", "blue"];
let started = false;
let level = 0;
let isPlaying = false;
let bestScore = 0;

const levNo = document.querySelector("#levelno");
const inputbtn = document.querySelectorAll(".box");
const levelDisplay = document.querySelector("#level-display");
const bestDisplay = document.querySelector("#best-display");
const startBtn = document.querySelector("#start");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + duration);
}

function playClickSound() {
    playTone(800, 0.05);
}

function playSequenceSound(color) {
    const frequencies = {
        green: 329.63,
        yellow: 392.00,
        red: 493.88,
        blue: 523.25
    };
    playTone(frequencies[color], 0.15);
}

function playSuccessSound() {
    playTone(659.25, 0.1);
    setTimeout(() => playTone(783.99, 0.1), 100);
}

function playGameOverSound() {
    playTone(196, 0.15);
    setTimeout(() => playTone(164.81, 0.15), 150);
    setTimeout(() => playTone(130.81, 0.3), 300);
}

document.addEventListener("keydown", function () {
    if (!started) {
        startGame();
    }
});

startBtn.addEventListener("click", function () {
    if (!started) {
        startGame();
    }
});

function startGame() {
    started = true;
    level = 0;
    gameSeq = [];
    startBtn.classList.add("hidden");
    playClickSound();
    nextRound();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playSequence() {
    isPlaying = true;
    await sleep(300);

    for (let i = 0; i < gameSeq.length; i++) {
        const sel = `.${gameSeq[i]}`;
        const btn = document.querySelector(sel);
        if (!btn) continue;
        flashButton(btn);
        playSequenceSound(gameSeq[i]);
        await sleep(450);
    }

    isPlaying = false;
}

function nextRound() {
    userSeq = [];
    level++;
    levelDisplay.textContent = level;
    levelDisplay.parentElement.classList.add("level-up");
    setTimeout(() => levelDisplay.parentElement.classList.remove("level-up"), 500);
    
    levNo.textContent = `Level ${level}`;

    const newcolor = btns[Math.floor(Math.random() * btns.length)];
    gameSeq.push(newcolor);

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
        if (isPlaying) return;

        const color = this.dataset.color || this.classList[1];

        userFlash(this);
        playClickSound();
        userSeq.push(color);

        const currentIndex = userSeq.length - 1;

        if (userSeq[currentIndex] !== gameSeq[currentIndex]) {
            document.body.classList.add("game-over");
            setTimeout(() => document.body.classList.remove("game-over"), 250);
            playGameOverSound();
            
            if (level > bestScore) {
                bestScore = level;
                bestDisplay.textContent = bestScore;
            }
            
            resetGame();
            return;
        }

        if (userSeq.length === gameSeq.length) {
            playSuccessSound();
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
    levelDisplay.textContent = "0";
    levNo.textContent = "Game Over! Press Start to Play Again";
    startBtn.classList.remove("hidden");
}
