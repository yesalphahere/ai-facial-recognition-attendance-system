// countup js
try {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(function(element) {
        const countTo = parseInt(element.getAttribute('data-count'));
        let currentCount = parseInt(element.textContent);
        const duration = 8000;
        const interval = 16;

        let iterations = duration / interval;
        const stepValue = (countTo - currentCount) / iterations;

        const intervalId = setInterval(function() {
            currentCount += stepValue;
            element.textContent = + Math.floor(currentCount);
            iterations--;
            if (iterations <= 0) {
                clearInterval(intervalId);
                element.textContent = '' + countTo;
            }
        }, interval);
    });
} catch (error) {
    console.error("Error occurred while interacting with counter elements:", error);
}

