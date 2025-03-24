const generateDisk = document.querySelector("#generateDisk");
const manualMode = document.querySelector("#manualMode");
const autoMode = document.querySelector("#autoMode");
const showStep = document.querySelector("#showStep");
const moveCounter = document.getElementById("moveCounter");

const source = document.getElementById("source");
const helper = document.getElementById("helper");
const destination = document.getElementById("destination");

const tawers = document.querySelector("#manualControls");
const moveManual = document.querySelector("#moveManual");

const messageLog = document.querySelector(".messageLog");

let moves = 0;
let moveQueue = [];

function deleteParagraphs() {
    document.querySelectorAll("#myPara").forEach(p => p.remove());
}

showStep.addEventListener('click', () => {
    messageLog.style.display = 'block';
});

showStep.addEventListener('dblclick', () => {
    messageLog.style.display = 'none';
});

manualMode.addEventListener('click', () => {
    moveManual.style.display = 'block';
    tawers.style.display = 'block';
});

autoMode.addEventListener('click', () => {
    moveManual.style.display = 'none';
    tawers.style.display = 'none';
});

// Generate Disks
generateDisk.addEventListener("click", () => {
    deleteParagraphs();
    let n = parseInt(document.getElementById("numInput").value);
    let solveStep = document.querySelector(".messageLog p strong");
    solveStep.innerText = "Solution Steps:";
    
    source.innerHTML = "";
    helper.innerHTML = "";
    destination.innerHTML = "";
    
    moves = 0;
    moveQueue = [];  
    moveCounter.innerText = moves;

    for (let i = 1; i <= n; i++) {
        let div = document.createElement("div");
        div.classList.add("disk");
        div.innerText = i;
        div.style.width = `${80 + i * 10}px`;
        div.setAttribute("data-size", i);
        source.prepend(div);
    }
});

// Move Disk
function moveDisk(from, to) {
    let disk = from.lastElementChild;
    if (!disk) return;
    
    let selectedSize = parseInt(disk.getAttribute("data-size"));
    let topDisk = to.lastElementChild;
    let topSize = topDisk ? parseInt(topDisk.getAttribute("data-size")) : Infinity;

    if (selectedSize < topSize) {
        to.append(disk);
        moves++;
        moveCounter.innerText = moves;
        checkWin();
        logMove(from, to);
    } else {
        alert("You tried to choose the wrong move which is against the rules. Please make the correct move");
    }
}

// Check Win Condition
function checkWin() {
    let totalDisks = document.getElementById("numInput").value;
    if (destination.childElementCount == totalDisks) {
        setTimeout(() => {
            alert(`🎉 Congratulations! You solved it in ${moves} moves!`);
        }, 100);
    }
}

// Solve Hanoi Algorithm
function solveHanoi(n, from, to, via) {
    if (n === 1) {
        moveQueue.push([from, to]);
        return;
    }
    solveHanoi(n - 1, from, via, to);
    moveQueue.push([from, to]);
    solveHanoi(n - 1, via, to, from);
}

// Auto Solve Execution
autoMode.addEventListener("click", () => {
    let n = parseInt(document.getElementById("numInput").value);
    solveHanoi(n, source, destination, helper);
    executeMoves();
});

function executeMoves() {
    if (moveQueue.length === 0) return;
    
    let [from, to] = moveQueue.shift();
    
    // Move the disk
    moveDisk(from, to);
    
    // Scroll to the bottom of the log
    const messageLog = document.querySelector(".messageLog");
    messageLog.scrollTop = messageLog.scrollHeight;

    setTimeout(executeMoves, 1000);
}

function logMove(from, to) {
    let message = document.createElement("p");
    message.setAttribute("id", "myPara"); 
    message.textContent = `Move disk from ${getTowerName(from)} to ${getTowerName(to)}`;
    const messageLog = document.querySelector(".messageLog");
    messageLog.appendChild(message);
}

function getTowerName(tower) {
    switch (tower.id) {
        case "source":
            return "Source";
        case "helper":
            return "Helper";
        case "destination":
            return "Destination";
        default:
            return "Unknown";
    }
}
