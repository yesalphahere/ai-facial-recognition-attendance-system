// Theme name prepend to localstorage key
const themeName = "ki-admin";

/* Set item in local storage */
function setLocalStorageItem(key, value) {
    localStorage.setItem(`${themeName}-${key}`, value);
}

// Handle dark mode theme toggle
$(document).on('click', '#darkDemoBtn', function () {
    setLocalStorageItem("theme-mode", 'dark');
    window.location.href = 'index.html';
});

// Scroll event to toggle navbar classes
$(function () {
    const $navbar = $(".landing-navbar");
    const $container = $(".landing-navbar-container.container");

    const onScroll = () => {
        const isScrolled = $(window).scrollTop() > 0;
        $navbar.toggleClass("landing-navbar-active", isScrolled);
        $container.toggleClass("container-fluid", isScrolled);
    };

    $(window).on("scroll", onScroll);
});

// Dynamic cloning of features list for infinite effect
document.addEventListener("DOMContentLoaded", function () {
    try {
        document.querySelectorAll(".features-box-list").forEach((list) => {
            const items = Array.from(list.children);
            if (items.length) {
                items.forEach((item) => list.appendChild(item.cloneNode(true)));
            }
        });
    } catch (err) {
        console.error("Error cloning feature items:", err);
    }
});

// Highlight Text Animation
document.addEventListener("DOMContentLoaded", function () {
    const highlightText = document.getElementById("highlight-text");
    if (!highlightText) return console.warn("#highlight-text not found");

    const words = ["Management", "Analytics", "Performance", "Dashboard", "Insights"];
    let index = 0;

    const changeText = () => {
        try {
            highlightText.innerHTML = `${words[index]} `;
            highlightText.classList.add("animate");

            setTimeout(() => {
                highlightText.classList.remove("animate");
            }, 1500);

            index = (index + 1) % words.length;
        } catch (err) {
            console.error("Error updating highlight text:", err);
        }
    };

    const intervalId = setInterval(changeText, 2000);

    window.addEventListener("beforeunload", () => clearInterval(intervalId));
});
