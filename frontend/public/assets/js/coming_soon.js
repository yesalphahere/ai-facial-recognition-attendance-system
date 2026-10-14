// Cache DOM elements once
const countdownDays = document.getElementById("days");
const countdownHours = document.getElementById("hours");
const countdownMinutes = document.getElementById("minutes");
const countdownSeconds = document.getElementById("seconds");

const deadlineDate = new Date('December 31, 2025 23:59:59').getTime();

const intervalId = setInterval(() => {
    const currentDate = new Date().getTime();
    const distance = deadlineDate - currentDate;

    if (distance <= 0) {
        clearInterval(intervalId);
        countdownDays.innerHTML = "0";
        countdownHours.innerHTML = "0";
        countdownMinutes.innerHTML = "0";
        countdownSeconds.innerHTML = "0";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Only update if values change (optional, for performance)
    countdownDays.textContent = days;
    countdownHours.textContent = hours;
    countdownMinutes.textContent = minutes;
    countdownSeconds.textContent = seconds;
}, 1000);
