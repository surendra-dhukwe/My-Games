let userScore = 0;
let compScore = 0;
let totalMoves = 0;

const winningScore = 10;
let gameOver = false;

const choices = document.querySelectorAll(".choice");
const msg = document.getElementById("msg");
const userScorePara = document.getElementById("user-score");
const compScorePara = document.getElementById("comp-score");
const totalMovesPara = document.getElementById("total-moves");

const popup = document.getElementById("winner-popup");
const popupText = document.getElementById("popup-text");
const popupRestart = document.getElementById("popup-restart");


// ✅ Generate Computer Choice
function genCompChoice() {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * options.length)];
}


// ✅ Show Popup (Force Repaint Fix for Hosting)
function showPopup(text) {
  popupText.textContent = text;

  popup.style.display = "flex";   // Important
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);
}


// ✅ Hide Popup
function hidePopup() {
  popup.classList.remove("show");

  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
}


// ✅ Final Winner Check
function checkFinalWinner() {
  if (userScore >= winningScore) {
    gameOver = true;
    showPopup(`🎉 Congratulations! You Won in ${totalMoves} Moves!`);
  } 
  else if (compScore >= winningScore) {
    gameOver = true;
    showPopup(`💻 Computer Won in ${totalMoves} Moves!`);
  }
}


// ✅ Main Game Logic
function playGame(userChoice) {

  if (gameOver) return;

  const compChoice = genCompChoice();
  totalMoves++;
  totalMovesPara.textContent = totalMoves;

  if (userChoice === compChoice) {
    msg.textContent = "It's a Draw 🤝";
    msg.className = "draw";
  } 
  else {
    const userWin =
      (userChoice === "rock" && compChoice === "scissors") ||
      (userChoice === "paper" && compChoice === "rock") ||
      (userChoice === "scissors" && compChoice === "paper");

    if (userWin) {
      userScore++;
      userScorePara.textContent = userScore;
      msg.textContent = `You Win! ${userChoice} beats ${compChoice}`;
      msg.className = "win";
    } 
    else {
      compScore++;
      compScorePara.textContent = compScore;
      msg.textContent = `You Lost! ${compChoice} beats ${userChoice}`;
      msg.className = "lose";
    }
  }

  checkFinalWinner();
}


// ✅ Click Events
choices.forEach(choice => {
  choice.addEventListener("click", () => {
    playGame(choice.id);
  });
});


// ✅ Restart Button
popupRestart.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  totalMoves = 0;
  gameOver = false;

  userScorePara.textContent = 0;
  compScorePara.textContent = 0;
  totalMovesPara.textContent = 0;

  msg.textContent = "Play your move";
  msg.className = "";

  hidePopup();
});