$(function() {
    $('#exampledatatable').DataTable();
    $('#exampledatatable1').DataTable();
    $('#exampledatatable2').DataTable();
    $('#exampledatatable3').DataTable();
    $('#exampledatatable4').DataTable();
});

// checkbox js
const selectAllCheckbox = document.getElementById('select-all');

if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const isChecked = selectAllCheckbox.checked;

        checkboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
    });
}
