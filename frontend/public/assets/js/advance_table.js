let shadow;
const selectAllCheckbox = document.getElementById('select-all');
const confirmDeleteButton = document.querySelector("#confirmDelete");
const deleteButtons = document.querySelectorAll(".delete-btn");

function dragit(e) {
    shadow = e.target;
}

function dragover(e) {
    const parentNode = e.target.parentNode.parentNode;
    const children = Array.from(parentNode.children);

    const targetIndex = children.indexOf(e.target.parentNode);
    const shadowIndex = children.indexOf(shadow);

    if (targetIndex > shadowIndex) {
        e.target.parentNode.after(shadow);
    } else {
        e.target.parentNode.before(shadow);
    }
}

// Checkbox select/deselect all
selectAllCheckbox.onclick = function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (const checkbox of checkboxes) {
        checkbox.checked = this.checked;
    }
}

// Initialize DataTable
$(function () {
    $('#projectTable').DataTable();
});

// Delete Action
function deleteAction() {
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            $("#apiDeleteModal").modal("show");

            confirmDeleteButton.addEventListener("click", function () {
                button.closest("tr").remove();
                $("#apiDeleteModal").modal("hide");
            });
        });
    });
}

deleteAction();
