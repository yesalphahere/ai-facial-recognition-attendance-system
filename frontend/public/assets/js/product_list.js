// **------product_list**
$(document).ready(function () {
    $('#product-Listtable').DataTable({
        responsive: true
    });

    // Cache delete buttons once DOM is ready
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // Function to handle delete action
    const handleDelete = (event) => {
        const deleteButton = event.target;
        if (deleteButton.classList.contains('delete-btn')) {
            const row = deleteButton.closest('tr');
            if (row) {
                row.remove();
            }
        }
    };

    if (deleteButtons.length) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }
});
