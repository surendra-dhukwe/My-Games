const modeBtn = document.getElementById("mod");

// Page load par saved mode check karo
window.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("theme");

    if (savedMode === "dark") {
        document.body.classList.add("dark-mode");
        modeBtn.innerHTML = "🌙";
    }
});

// Click Event
modeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        modeBtn.innerHTML = "🌙";
        localStorage.setItem("theme", "dark");
    } else {
        modeBtn.innerHTML = "👁️";
        localStorage.setItem("theme", "light");
    }
});