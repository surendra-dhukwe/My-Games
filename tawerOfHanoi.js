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
let stepsArray = [];
let totalDisks = 0;

// ================= RESET GAME =================

function resetGame() {
    source.innerHTML = "";
    helper.innerHTML = "";
    destination.innerHTML = "";
    messageLog.innerHTML = "<p><strong>Solution Steps:</strong></p>";

    moves = 0;
    moveQueue = [];
    stepsArray = [];
    moveCounter.innerText = moves;

    const oldBtn = document.getElementById("downloadPdf");
    if (oldBtn) oldBtn.remove();
}

// ================= CREATE DISK =================

function createDisk(size) {
    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.innerText = size;
    disk.style.width = `${80 + size * 12}px`;
    disk.setAttribute("data-size", size);
    return disk;
}

function getTowerName(tower) {
    return tower.id.charAt(0).toUpperCase() + tower.id.slice(1);
}

// ================= GENERATE DISKS =================

generateDisk.addEventListener("click", () => {
    const n = parseInt(document.getElementById("numInput").value);

    if (!n || n < 1) {
        alert("Enter valid number of disks");
        return;
    }

    totalDisks = n;
    resetGame();

    for (let i = n; i >= 1; i--) {
        source.appendChild(createDisk(i));
    }
});

// ================= MANUAL MOVE =================

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

        const stepText = `Step ${moves}: Disk moved from ${getTowerName(from)} to ${getTowerName(to)}`;
        stepsArray.push(stepText);

        const p = document.createElement("p");
        p.textContent = stepText;
        messageLog.appendChild(p);
        messageLog.scrollTop = messageLog.scrollHeight;

        checkWin();
    } else {
        alert("Invalid move! Larger disk cannot be placed on smaller disk.");
    }
}

// ================= WIN CHECK =================

function checkWin() {
    if (destination.childElementCount === totalDisks) {
        setTimeout(() => {
            alert(`Puzzle solved in ${moves} moves.`);
            addDownloadButton();
        }, 300);
    }
}

// ================= AUTO SOLVER =================

function solveHanoi(n, from, to, via) {
    if (n === 1) {
        const stepText = `Step ${moveQueue.length + 1}: Disk moved from ${getTowerName(from)} to ${getTowerName(to)}`;
        moveQueue.push([from, to, stepText]);
        return;
    }

    solveHanoi(n - 1, from, via, to);

    const stepText = `Step ${moveQueue.length + 1}: Disk moved from ${getTowerName(from)} to ${getTowerName(to)}`;
    moveQueue.push([from, to, stepText]);

    solveHanoi(n - 1, via, to, from);
}

// ================= AUTO MODE =================

autoMode.addEventListener("click", () => {
    const n = parseInt(document.getElementById("numInput").value);
    if (!n) return;

    totalDisks = n;
    resetGame();

    for (let i = n; i >= 1; i--) {
        source.appendChild(createDisk(i));
    }

    solveHanoi(n, source, destination, helper);
    executeMoves();
});

function executeMoves() {
    if (moveQueue.length === 0) {
        addDownloadButton();
        return;
    }

    const [from, to, stepText] = moveQueue.shift();

    const disk = from.lastElementChild;
    if (disk) to.appendChild(disk);

    moves++;
    moveCounter.innerText = moves;

    stepsArray.push(stepText);

    const p = document.createElement("p");
    p.textContent = stepText;
    messageLog.appendChild(p);
    messageLog.scrollTop = messageLog.scrollHeight;

    setTimeout(executeMoves, 500);
}

// ================= SHOW STEP TOGGLE =================

showStep.addEventListener("click", () => {
    messageLog.style.display =
        messageLog.style.display === "none" ? "block" : "none";
});

// ================= PDF BUTTON =================

function addDownloadButton() {
    if (document.getElementById("downloadPdf")) return;

    const btn = document.createElement("button");
    btn.id = "downloadPdf";
    btn.innerText = "Download Solution Report (PDF)";
    btn.style.marginTop = "15px";
    btn.style.padding = "10px 18px";
    btn.style.cursor = "pointer";
    btn.onclick = downloadPDF;

    messageLog.appendChild(btn);
}

// ================= PROFESSIONAL PDF FIX =================

function downloadPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Tower of Hanoi - Solution Report", 105, y, { align: "center" });

    y += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Number of Disks: ${totalDisks}`, 20, y);
    y += 8;

    doc.text(`Total Moves Performed: ${moves}`, 20, y);
    y += 8;

    doc.text(`Minimum Required Moves: ${Math.pow(2, totalDisks) - 1}`, 20, y);
    y += 12;

    doc.setFont("helvetica", "bold");
    doc.text("Detailed Execution Steps:", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");

    stepsArray.forEach(step => {

        // ✅ IMPORTANT FIX (No spacing bug)
        const wrappedText = doc.splitTextToSize(step, 170);

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.text(wrappedText, 20, y);
        y += wrappedText.length * 7;
    });

    // Footer
    const date = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.text(`Generated on: ${date}`, 20, 290);

    doc.save("Tower_of_Hanoi_Solution.pdf");
}