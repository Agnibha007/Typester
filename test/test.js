const display = document.getElementById("text-display");
const input = document.getElementById("text-input");
const timeSelect = document.getElementById("time-select");
const restartBtn = document.getElementById("restart-btn");

const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");

const modal = document.getElementById("result-modal");
const closeModal = document.getElementById("close-modal");
const modalWpm = document.getElementById("modal-wpm");
const modalAccuracy = document.getElementById("modal-accuracy");
const modalTotal = document.getElementById("modal-total");
const modalCorrect = document.getElementById("modal-correct");
const modalTime = document.getElementById("modal-time");

const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast is a skill worth mastering.",
  "JavaScript makes the web dynamic and powerful.",
  "Practice daily to improve your typing accuracy.",
  "Patience and persistence are keys to success.",
  "Consistency beats intensity when learning new skills.",
  "Small steps each day lead to big achievements.",
  "Knowledge increases when it is shared.",
  "Clean code is better than clever code.",
  "Every expert was once a beginner."
];

let currentText = "";
let timer;
let timeLeft = parseInt(timeSelect.value);
let totalTyped = 0;
let correctTyped = 0;
let timerStarted = false;
let elapsedTime = 0;

function getRandomQuotes(count) {
  let selected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    selected.push(quotes[randomIndex]);
  }
  return selected.join(" ");
}

function loadText() {
  clearInterval(timer);
  timerStarted = false;
  elapsedTime = 0;

  totalTyped = 0;
  correctTyped = 0;
  timeLeft = parseInt(timeSelect.value);
  timeDisplay.textContent = timeLeft;
  wpmDisplay.textContent = 0;
  accuracyDisplay.textContent = 0;

  input.value = "";
  input.disabled = false;

  const count = timeLeft === 15 ? 2 : timeLeft === 30 ? 4 : timeLeft === 60 ? 6 : 12;
  currentText = getRandomQuotes(count);

  display.innerHTML = currentText
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("");

  input.focus();
}

function startTimer() {
  timerStarted = true;
  elapsedTime = 0;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      elapsedTime++;
      timeDisplay.textContent = timeLeft;
      const wordsTyped = input.value.trim().split(/\s+/).length;
      const wpm = elapsedTime > 0 ? Math.round((wordsTyped / elapsedTime) * 60) : 0;
      wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
      if (input.value === currentText) endGame();

    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  input.disabled = true;

  modalWpm.textContent = wpmDisplay.textContent;
  modalAccuracy.textContent = accuracyDisplay.textContent;
  modalTotal.textContent = totalTyped;
  modalCorrect.textContent = correctTyped;
  modalTime.textContent = parseInt(timeSelect.value);
  modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

input.addEventListener("input", () => {
  if (!timerStarted) startTimer();

  const typed = input.value.split("");
  const spans = display.querySelectorAll("span");

  totalTyped = typed.length;
  correctTyped = 0;

  spans.forEach((span, i) => {
    span.classList.remove("correct", "incorrect", "current-char");

    if (!typed[i]) {
      if (i === typed.length) {
        span.classList.add("current-char");
      }
    } else if (typed[i] === span.textContent) {
      span.classList.add("correct");
      correctTyped++;
    } else {
      span.classList.add("incorrect");
    }
  });

  const accuracy = totalTyped ? Math.round((correctTyped / totalTyped) * 100) : 0;
  accuracyDisplay.textContent = accuracy;
  if (input.value === currentText) endGame();
});


display.addEventListener("contextmenu", e => e.preventDefault());
display.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "c") e.preventDefault();
});

timeSelect.addEventListener("change", loadText);
restartBtn.addEventListener("click", () => {
  modal.style.display = "none";
  loadText();
});
document.addEventListener("DOMContentLoaded", loadText);