const yearElement = document.querySelector(".currentYear");
const leftYear = document.querySelector(".lastYear");
const rightYear = document.querySelector(".nextYear");

const monthElement = document.querySelector(".currentMonth");
const leftMonth = document.querySelector(".lastMonth");
const rightMonth = document.querySelector(".nextMonth");

const calendarElement = document.querySelector(".calendar");

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentYear = 2025;
let currentMonth = 0;

function generateMonthCalendar(year, month) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    let lastDayIndex = new Date(year, month, daysInMonth).getDay();
    let totalDays = firstDayIndex + daysInMonth;

    document.querySelectorAll(".day").forEach(day => day.remove());

    for (let i = 0; i < firstDayIndex; i++) {
        let emptyDay = document.createElement("div");
        emptyDay.classList.add("day", "empty");
        calendarElement.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = day;
        calendarElement.appendChild(dayElement);
    }

    let remainingSlots = 7 - (totalDays % 7);
    if (remainingSlots < 7) {
        for (let i = 0; i < remainingSlots; i++) {
            let emptyDay = document.createElement("div");
            emptyDay.classList.add("day", "empty");
            calendarElement.appendChild(emptyDay);
        }
    }
}
function updateYear(change) {
    currentYear += change;
    yearElement.textContent = currentYear;
    generateMonthCalendar(currentYear, currentMonth);
}

function updateMonth(change) {
    currentMonth += change;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }

    yearElement.textContent = currentYear;
    monthElement.textContent = months[currentMonth];
    generateMonthCalendar(currentYear, currentMonth);
}

leftYear.addEventListener("click", () => updateYear(-1));
rightYear.addEventListener("click", () => updateYear(1));

leftMonth.addEventListener("click", () => updateMonth(-1));
rightMonth.addEventListener("click", () => updateMonth(1));

yearElement.textContent = currentYear;
monthElement.textContent = months[currentMonth];
generateMonthCalendar(currentYear, currentMonth);