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
const resetBtn = document.getElementById("reset-btn");

const popup = document.getElementById("winner-popup");
const popupText = document.getElementById("popup-text");
const popupRestart = document.getElementById("popup-restart");

const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
};

const showPopup = (text) => {
  popupText.innerText = text;
  popup.classList.add("show");
};

const checkFinalWinner = () => {
  if (userScore === winningScore) {
    gameOver = true;
    showPopup(`🎉 Congratulations! You Won in ${totalMoves} Moves!`);
  } 
  else if (compScore === winningScore) {
    gameOver = true;
    showPopup(`💻 Computer Won in ${totalMoves} Moves!`);
  }
};

const playGame = (userChoice) => {

  if (gameOver) return;

  const compChoice = genCompChoice();
  totalMoves++;
  totalMovesPara.innerText = totalMoves;

  if (userChoice === compChoice) {
    msg.innerText = "It's a Draw 🤝";
    msg.className = "draw";
  } else {
    const userWin =
      (userChoice === "rock" && compChoice === "scissors") ||
      (userChoice === "paper" && compChoice === "rock") ||
      (userChoice === "scissors" && compChoice === "paper");

    if (userWin) {
      userScore++;
      userScorePara.innerText = userScore;
      msg.innerText = `You Win! ${userChoice} beats ${compChoice}`;
      msg.className = "win";
    } else {
      compScore++;
      compScorePara.innerText = compScore;
      msg.innerText = `You Lost! ${compChoice} beats ${userChoice}`;
      msg.className = "lose";
    }
  }

  checkFinalWinner();
};

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    playGame(choice.id);
  });
});

popupRestart.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  totalMoves = 0;
  gameOver = false;

  userScorePara.innerText = 0;
  compScorePara.innerText = 0;
  totalMovesPara.innerText = 0;

  msg.innerText = "Play your move";
  msg.className = "";

  popup.classList.remove("show");
});