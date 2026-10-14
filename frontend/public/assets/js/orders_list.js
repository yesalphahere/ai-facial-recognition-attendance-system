// ---- Checkbox: Select All ----
document.addEventListener('DOMContentLoaded', () => {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#select-all)');

    if (selectAll) {
        selectAll.addEventListener('change', () => {
            const isChecked = selectAll.checked;
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        });
    }

    // ---- Delete Button Handling ----
    const table = document.querySelector('table'); // Adjust if targeting a specific table

    if (table) {
        table.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('delete-btn')) {
                const row = target.closest('tr');
                if (row) row.remove();
            }
        });
    }
});
