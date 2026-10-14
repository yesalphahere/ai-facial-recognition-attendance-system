// ---------------- Tab JS ----------------
$(document).on('click', '.tab-link', function () {
    const $this = $(this);
    const tabID = $this.attr('data-tab');

    $this.addClass('active').siblings().removeClass('active');
    $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
});

// ---------------- Toggle JS ----------------
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle-btn');
    const closeToggleBtn = document.querySelector('.close-toggle');
    const chatContainer = document.querySelector('.chat-div');

    if (toggleBtn && chatContainer) {
        toggleBtn.addEventListener('click', () => {
            chatContainer.classList.toggle('chattoggle');
        });
    }

    if (closeToggleBtn && chatContainer) {
        closeToggleBtn.addEventListener('click', () => {
            chatContainer.classList.remove('chattoggle');
        });
    }

    // ---------------- Tooltip Init ----------------
    $('a').tooltip();
});
