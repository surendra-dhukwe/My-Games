const board = document.getElementById('board');
const message = document.getElementById('message');
const diceDisplay = document.getElementById('diceDisplay');
const infoDisplay = document.getElementById('infoDisplay');
const rollBtn = document.getElementById('rollBtn');
const optionsMenu = document.getElementById('optionsMenu');

// साँप और सीढ़ी की पोज़िशन
const snakes = { 17: 7, 54: 34, 62: 19, 98: 79 };
const ladders = { 3: 22, 5: 8, 20: 29, 27: 56, 72: 92 };

// सभी प्लेयर की डिटेल
const allPlayers = [
  { key: 'player1', name: 'Player 1', color: 'red', isComputer: false },
  { key: 'computer', name: 'Computer', color: 'purple', isComputer: true },
  { key: 'friend1', name: 'Friend 1', color: 'orange', isComputer: false },
  { key: 'friend2', name: 'Friend 2', color: 'blue', isComputer: false },
  { key: 'friend3', name: 'Friend 3', color: 'green', isComputer: false }
];

let players = [];
let positions = {};
let currentPlayer = 0;

// गेम बोर्ड बनाना
function createBoard() {
  board.innerHTML = "";
  for (let i = 100; i > 0; i--) {
    const cell = document.createElement('div');
    cell.className = "cell";
    cell.textContent = i;

    // सीढ़ी (🪜)
    if (ladders[i]) {
      cell.classList.add('ladder');
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      arrow.textContent = '⬆';
      cell.appendChild(arrow);
    }
    // साँप (🐍)
    else if (snakes[i]) {
      cell.classList.add('snake');
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      arrow.textContent = '⬇';
      cell.appendChild(arrow);
    }

    board.appendChild(cell);
  }
}

// गेम शुरू करना
function startGame(mode) {
  optionsMenu.style.display = "none"; // 👈 Option hide kar diya
  createBoard();
  players = [];
  positions = {};
  diceDisplay.innerHTML = "";
  infoDisplay.innerHTML = "";

  // हमेशा Player 1 रहेगा
  let gamePlayers = [{...allPlayers[0]}];

  if (mode === 'computer') gamePlayers.push(allPlayers[1]);
  if (mode === 'friend1') gamePlayers.push(allPlayers[2]);
  if (mode === 'friend2') gamePlayers.push(allPlayers[2], allPlayers[3]);
  if (mode === 'friend3') gamePlayers.push(allPlayers[2], allPlayers[3], allPlayers[4]);

  // सभी चुने हुए प्लेयर जोड़ना
  gamePlayers.forEach(pl => {
    const token = document.createElement('div');
    token.classList.add('player', pl.key);
    board.appendChild(token);
    players.push(pl);
    positions[pl.key] = 1;

    // पासा सर्कल
    const dice = document.createElement('div');
    dice.classList.add('dice-circle');
    dice.id = pl.key + "Dice";
    dice.textContent = "-";
    diceDisplay.appendChild(dice);

    // जानकारी सेक्शन
    const info = document.createElement('div');
    info.classList.add('playerLabel');
    info.innerHTML = `<div class="colorBox" style="background:${pl.color}"></div> ${pl.name}`;
    infoDisplay.appendChild(info);
  });

  rollBtn.style.display = "block";
  currentPlayer = 0;
  updatePositions();
  message.textContent = `👉 अब बारी: ${players[currentPlayer].name}`;
}

// पासा फेंकना
function rollDice() {
  const player = players[currentPlayer];
  const dice = document.getElementById(player.key + "Dice");
  const roll = Math.floor(Math.random() * 6) + 1;

  dice.style.backgroundColor = player.color;
  dice.style.color = "white";
  dice.textContent = roll;

  message.textContent = `🎲 ${player.name} ने ${roll} फेंका`;

  setTimeout(() => movePlayer(player.key, roll), 500);
}

// चाल चलना
function movePlayer(key, roll) {
  let newPos = positions[key] + roll;
  if (newPos > 100) newPos = 100;

  if (snakes[newPos]) {
    message.textContent = `🐍 ${key} साँप से फिसल गया!`;
    newPos = snakes[newPos];
  } else if (ladders[newPos]) {
    message.textContent = `🪜 ${key} सीढ़ी चढ़ गया!`;
    newPos = ladders[newPos];
  }

  positions[key] = newPos;
  updatePositions();

  if (newPos === 100) {
    message.textContent = `🏆 ${key} जीत गया! 🎉`;
    rollBtn.style.display = "none";
    return;
  }

  currentPlayer = (currentPlayer + 1) % players.length;
  const next = players[currentPlayer];
  message.textContent += ` → अब बारी: ${next.name}`;

  if (next.isComputer) setTimeout(rollDice, 1200);
}

// Position अपडेट करना
function updatePositions() {
  players.forEach((pl, i) => {
    const pos = positions[pl.key];
    const cell = board.children[100 - pos];
    if (cell) {
      pl.token = document.querySelector('.' + pl.key);
      pl.token.style.left = `${cell.offsetLeft + (i * 15) + 3}px`;
      pl.token.style.top = `${cell.offsetTop + 3}px`;
    }
  });
}