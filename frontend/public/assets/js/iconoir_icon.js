// Notify function for iconoir-font icon copying
function iconoir_font(element) {
    copyTextToClipboard(`<i class="${element.children[0].className}"></i>`);
    showToast("Copied to the clipboard successfully", "success");
}

// Toastify wrapper for notifications
function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: `rgba(var(--${type}), 1)`
        },
        onClick: function () {}
    }).showToast();
}

// Handling input search for icons
const input = document.querySelector('div.search-bar input');
const iconContainer = document.querySelector('ul.icon-list');
const icons = Array.from(document.querySelectorAll('li.icon-box')).map(icon => ({
    el: icon,
    name: icon.querySelector('strong').innerText.trim()
}));

input.addEventListener('input', search);

function search(evt) {
    const searchValue = evt.target.value.toLowerCase();
    const iconsToShow = searchValue
        ? icons.filter(icon => icon.name.toLowerCase().includes(searchValue))
        : icons;

    iconContainer.innerHTML = '';
    iconsToShow.forEach(icon => iconContainer.appendChild(icon.el));
}


