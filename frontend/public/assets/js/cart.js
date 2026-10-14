// jQuery DataTables init
$(function () {
    $('#example').DataTable();
    $('#example1').DataTable();
});

// Delegated event for increment/decrement
$(document).on('click', '.decrement, .increment', function () {
    const $input = $(this).siblings('.count');
    let count = parseInt($input.val(), 10) || 0;
    const min = 1;
    const max = 7;

    count += $(this).hasClass('increment') ? 1 : -1;
    if (count >= min && count <= max) {
        $input.val(count);
    }
});

// Vanilla JS DOMContentLoaded logic
document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.scratch-card');
    if (card) {
        const scratchOverlay = card.querySelector('.scratch-overlay');
        const copyBtn = document.getElementById('copyBtn');
        const codeEl = card.querySelector('h6');

        card.addEventListener('mousemove', function (e) {
            if (e.buttons === 1) {
                scratchOverlay?.style.setProperty('display', 'none');
            }
        });

        copyBtn?.addEventListener('click', function () {
            if (codeEl) {
                navigator.clipboard.writeText(codeEl.innerText)
                    .then(() => alert('Code copied to clipboard'))
                    .catch(err => console.error('Failed to copy: ', err));
            }
        });
    }

    // Delete button functionality (static buttons only)
    const deleteButtons = document.querySelectorAll('.delete-btn');

    if (deleteButtons.length) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                if (row) row.remove();
            });
        });
    }
});
