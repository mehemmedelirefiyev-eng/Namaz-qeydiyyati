const todayElement = document.getElementById("today");
const now = new Date();
const today = now.toISOString().split("T")[0];
const buttons = document.querySelectorAll(".check-btn");
const statsBtn = document.getElementById("statsBtn");
const editBtn = document.getElementById("editBtn");
let editMode = false;
const stats = document.getElementById("stats");
const statsContent = document.getElementById("statsContent");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const monthTitle = document.getElementById("monthTitle");

let selectedMonth = today.substring(0, 7);

const confirmBox = document.getElementById("confirmBox");
const confirmText = document.getElementById("confirmText");
const okBtn = document.getElementById("okBtn");
const cancelBtn = document.getElementById("cancelBtn");

let selectedPrayer = "";
let selectedButton = null;

todayElement.textContent = "Tarix: " + today;

let data = JSON.parse(localStorage.getItem("namazData")) || {};
const monthKey = today.substring(0, 7);

if (!data?.history) {
    data.history = {};
}

if (!data.history[monthKey]) {
    data.history[monthKey] = {
        subh: 0,
        zohr: 0,
        esr: 0,
        megrib: 0,
        isa: 0,
        completedDays: 0,
        streak: 0,
        bestStreak: 0
    };
}

if (!data.prayers) {
    data = {
        date: today,
        prayers: {
            subh: false,
            zohr: false,
            esr: false,
            megrib: false,
            isa: false
        },
        history: {}
    };
}

if (data.date !== today) {
    data.date = today;

    data.prayers = {
        subh: false,
        zohr: false,
        esr: false,
        megrib: false,
        isa: false
    };
}

buttons.forEach(btn => {

    const prayer = btn.dataset.prayer;

    if (data.prayers[prayer]) {
        btn.textContent = "✅";
        btn.classList.add("done");
    }
    btn.addEventListener("dblclick", () => {

    if (!editMode) return;

    if (!data.prayers[prayer]) return;

    data.prayers[prayer] = false;
    if (data.history[monthKey][prayer] > 0) {
    data.history[monthKey][prayer]--;
}

btn.textContent = "⬜";
btn.classList.remove("done");

localStorage.setItem("namazData", JSON.stringify(data));
if (stats.style.display === "block") {
    updateStats();
}

});

    btn.addEventListener("click", () => {

        if (data.prayers[prayer]) return;

        selectedPrayer = prayer;
        selectedButton = btn;

        confirmText.textContent =
        btn.parentElement.dataset.name + " namazını qıldığına əminsən?";

        confirmBox.style.display = "flex";

    });

});
okBtn.addEventListener("click", () => {

    if (!selectedPrayer) return;

    data.prayers[selectedPrayer] = true;
    data.history[monthKey][selectedPrayer]++;

    selectedButton.textContent = "✅";
    selectedButton.classList.add("done");

    localStorage.setItem("namazData", JSON.stringify(data));
    
    if (stats.style.display === "block") {
    updateStats();
}

    confirmBox.style.display = "none";

    selectedPrayer = "";
    selectedButton = null;

});

cancelBtn.addEventListener("click", () => {

    confirmBox.style.display = "none";

    selectedPrayer = "";
    selectedButton = null;

});

function updateStats() {

    monthTitle.textContent = selectedMonth;

    if (!data.history[selectedMonth]) {
        data.history[selectedMonth] = {
            subh: 0,
            zohr: 0,
            esr: 0,
            megrib: 0,
            isa: 0,
            completedDays: 0,
            streak: 0,
            bestStreak: 0
        };
    }

    const m = data.history[selectedMonth];

    const daysInMonth = new Date(
        Number(selectedMonth.substring(0, 4)),
        Number(selectedMonth.substring(5, 7)),
        0
    ).getDate();

    const total =
        m.subh +
        m.zohr +
        m.esr +
        m.megrib +
        m.isa;

    const maxTotal = daysInMonth * 5;
    const percent = Math.round((total / maxTotal) * 100);

    statsContent.innerHTML = `
        <h3>${selectedMonth}</h3>

        🕌 Sübh: ${m.subh}/${daysInMonth}<br>
        🕌 Zöhr: ${m.zohr}/${daysInMonth}<br>
        🕌 Əsr: ${m.esr}/${daysInMonth}<br>
        🕌 Məğrib: ${m.megrib}/${daysInMonth}<br>
        🕌 İşa: ${m.isa}/${daysInMonth}<br><br>

        ✅ Ümumi: ${total}/${maxTotal}<br>
        📈 ${percent}%
    `;
}

statsBtn.addEventListener("click", () => {

    stats.style.display =
        stats.style.display === "none" ? "block" : "none";

updateStats();

});

localStorage.setItem("namazData", JSON.stringify(data));

editBtn.addEventListener("click", () => {

    editMode = !editMode;

    if (editMode) {
        editBtn.textContent = "✅ Düzəliş rejimi aktivdir";
    } else {
        editBtn.textContent = "✏️ Düzəliş et";
    }

});
prevMonth.addEventListener("click", () => {
    let date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() - 1);

    selectedMonth =
        date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0");

    updateStats();
});

nextMonth.addEventListener("click", () => {
    let date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() + 1);

    selectedMonth =
        date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0");

    updateStats();
});