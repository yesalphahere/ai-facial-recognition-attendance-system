window.addEventListener('load', () => {
    const countDownDate = new Date('December 31, 2025 23:59:59').getTime();

    const timerElements = Array.from(document.querySelectorAll('.timer')).map(timer => ({
        timer,
        daysEl: timer.querySelector('.days'),
        hoursEl: timer.querySelector('.hours'),
        minutesEl: timer.querySelector('.minutes'),
        secondsEl: timer.querySelector('.seconds'),
    }));

    const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(intervalId);
            const demo = document.getElementById('demo');
            if (demo) demo.innerHTML = 'EXPIRED';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update cached DOM references
        timerElements.forEach(({ daysEl, hoursEl, minutesEl, secondsEl }) => {
            if (daysEl) daysEl.innerHTML = days;
            if (hoursEl) hoursEl.innerHTML = hours;
            if (minutesEl) minutesEl.innerHTML = minutes;
            if (secondsEl) secondsEl.innerHTML = seconds;
        });
    }, 1000);
});
