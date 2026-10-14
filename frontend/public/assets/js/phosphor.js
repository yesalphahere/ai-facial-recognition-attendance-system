// ---- Notify JS ----

function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function phosphor_icon(element) {
    const iconClass = element.children[0].className;
    copyTextToClipboard(`<i class="${iconClass}"></i>`);

    Toastify({
        text: "Copied to the clipboard successfully",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "rgba(var(--success),1)",
        },
        onClick: function () {}
    }).showToast();
}

// ---- Search Icon JS ----

const input = document.querySelector('div.search-bar input');
const iconContainer = document.querySelector('ul.icon-list');

const icons = Array.from(document.querySelectorAll('li.icon-box')).map(icon => ({
    el: icon,
    name: icon.querySelector('strong').innerText.toLowerCase()
}));

function search(evt) {
    const searchValue = evt.target.value.toLowerCase();
    const iconsToShow = searchValue.length
        ? icons.filter(icon => icon.name.includes(searchValue))
        : icons;

    iconContainer.innerHTML = '';
    iconsToShow.forEach(icon => iconContainer.appendChild(icon.el));
}

input.addEventListener('input', search);
