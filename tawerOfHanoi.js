// ================= SELECT ELEMENTS =================

const generateDisk = document.querySelector("#generateDisk");
const manualMode = document.querySelector("#manualMode");
const autoMode = document.querySelector("#autoMode");
const showStep = document.querySelector("#showStep");
const moveCounter = document.getElementById("moveCounter");

const source = document.getElementById("source");
const helper = document.getElementById("helper");
const destination = document.getElementById("destination");

const manualControls = document.querySelector("#manualControls");
const moveManual = document.querySelector("#moveManual");

const messageLog = document.querySelector(".messageLog");

// ================= VARIABLES =================

let moves = 0;
let moveQueue = [];

// ================= UTIL FUNCTIONS =================

function resetGame() {
    source.innerHTML = "";
    helper.innerHTML = "";
    destination.innerHTML = "";
    messageLog.innerHTML = "<p><strong>Solution Steps:</strong></p>";
    moves = 0;
    moveQueue = [];
    moveCounter.innerText = moves;
}

function createDisk(size) {
    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.innerText = size;
    disk.style.width = `${80 + size * 12}px`;
    disk.setAttribute("data-size", size);
    return disk;
}

function getTowerName(tower) {
    if (tower.id === "source") return "Source";
    if (tower.id === "helper") return "Helper";
    if (tower.id === "destination") return "Destination";
    return "Unknown";
}

// ================= GENERATE DISKS =================

generateDisk.addEventListener("click", () => {
    const n = parseInt(document.getElementById("numInput").value);

    if (!n || n < 1) {
        alert("Please enter a valid number of disks");
        return;
    }

    resetGame();

    for (let i = n; i >= 1; i--) {
        source.appendChild(createDisk(i));
    }
});

// ================= MOVE DISK =================

function moveDisk(from, to) {
    const disk = from.lastElementChild;
    if (!disk) return;

    const diskSize = parseInt(disk.getAttribute("data-size"));
    const topDisk = to.lastElementChild;
    const topSize = topDisk
        ? parseInt(topDisk.getAttribute("data-size"))
        : Infinity;

    if (diskSize < topSize) {
        to.appendChild(disk);
        moves++;
        moveCounter.innerText = moves;
        logMove(from, to);
        checkWin();
    } else {
        alert("Invalid move! Bigger disk cannot be placed on smaller disk.");
    }
}

// ================= WIN CHECK =================

function checkWin() {
    const total = parseInt(document.getElementById("numInput").value);
    if (destination.childElementCount === total) {
        setTimeout(() => {
            alert(`🎉 Congratulations! You solved it in ${moves} moves!`);
        }, 200);
    }
}

// ================= LOG MOVE =================

function logMove(from, to) {
    const p = document.createElement("p");
    p.innerText = `Move disk from ${getTowerName(from)} to ${getTowerName(to)}`;
    messageLog.appendChild(p);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// ================= MANUAL MODE =================

manualMode.addEventListener("click", () => {
    moveManual.style.display = "block";
    manualControls.style.display = "grid";
});

autoMode.addEventListener("click", () => {
    moveManual.style.display = "none";
    manualControls.style.display = "none";
});

// ================= SHOW / HIDE STEPS =================

showStep.addEventListener("click", () => {
    if (messageLog.style.display === "block") {
        messageLog.style.display = "none";
    } else {
        messageLog.style.display = "block";
    }
});
// ================= HANOI ALGORITHM =================

function solveHanoi(n, from, to, via) {
    if (n === 1) {
        moveQueue.push([from, to]);
        return;
    }

    solveHanoi(n - 1, from, via, to);
    moveQueue.push([from, to]);
    solveHanoi(n - 1, via, to, from);
}

// ================= AUTO EXECUTION =================

autoMode.addEventListener("click", () => {
    const n = parseInt(document.getElementById("numInput").value);
    if (!n) return;

    moveQueue = [];
    solveHanoi(n, source, destination, helper);
    executeMoves();
});

function executeMoves() {
    if (moveQueue.length === 0) return;

    const [from, to] = moveQueue.shift();
    moveDisk(from, to);

    setTimeout(executeMoves, 700);
}