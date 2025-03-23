const generateDisk = document.querySelector("#generateDisk");
const manualMode = document.querySelector("#manualMode");
const autoMode = document.querySelector("#autoMode");
const moveCounter = document.getElementById("moveCounter");

const source = document.getElementById("source");
const helper = document.getElementById("helper");
const destination = document.getElementById("destination");

let moves = 0;
let moveQueue = [];

// Generate Disks
generateDisk.addEventListener("click", () => {
    let n = parseInt(document.getElementById("numInput").value);

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
    } else {
        alert("You tried to choose the wrong move which is against the rules. Please make the correct move");
    }
}


// Check Win Condition
function checkWin() {
    let totalDisks = document.getElementById("numInput").value;
    if (destination.childElementCount == totalDisks) {
        setTimeout(() => alert(`🎉 Congratulations! You solved it in ${moves} moves!`), 100);
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
    let n = document.getElementById("numInput").value;
    solveHanoi(n, source, destination, helper);
    executeMoves();
});

function executeMoves() {
    if (moveQueue.length === 0) return;
    let [from, to] = moveQueue.shift();
    moveDisk(from, to);
    setTimeout(executeMoves, 500);
}
