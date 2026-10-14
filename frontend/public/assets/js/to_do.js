// todo js
document.addEventListener('DOMContentLoaded', () => {
    const pushBtn = document.querySelector('#push');
    const taskInput = document.querySelector('#newtask input');
    const tasksContainer = document.querySelector('.todo-container');

    if (!pushBtn || !taskInput || !tasksContainer) return;

    pushBtn.addEventListener('click', () => {
        try {
            const taskValue = taskInput.value.trim();

            if (taskValue.length === 0) {
                alert("Enter Task Name!!!!");
                return;
            }

            const taskHTML = `
                <div class="task">
                    <span id="taskname">${taskValue}</span>
                    <button class="btn btn-sm p-1 border-0 delete">
                        <i class="ti ti-trash text-danger f-s-18"></i>
                    </button>
                </div>
            `;

            tasksContainer.insertAdjacentHTML('afterbegin', taskHTML);

            taskInput.value = '';

        } catch (error) {
            console.error("Error adding task:", error);
        }
    });

    tasksContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete')) {
            try {
                const taskElement = e.target.closest('.task');
                if (taskElement) taskElement.remove();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    });
});


// todo table
const options = {
    valueNames: ['id', 'task', 'assign', 'notes', 'date', 'status'],
};

// Cache DOM nodes for better performance
const idField = $('#id-field'),
    taskField = $('#task-field'),
    assignField = $('#assign-field'),
    notesField = $('#notes-field'),
    dateField = $('#date-field'),
    statusField = $('#status-field'),
    addBtn = $('#add-btn'),
    editBtn = $('#edit-btn').hide(),
    removeBtns = $('.remove-item-btn'),
    editBtns = $('.edit-item-btn');

// Init list
const contactList = new List('myTodo', options);

// Sets callbacks to the buttons in the list
refreshCallbacks();

$(document).on("submit", "#add_employee_todo", function (e) {
    e.preventDefault();
    $(this).parent().modal("hide");

    try {
        const newItem = {
            id: Math.floor(Math.random() * 110000),
            task: taskField.val(),
            assign: assignField.val(),
            notes: `<span class="text-dark f-s-14"><i class="ti ti-circle-filled me-2 f-s-6"></i>${notesField.val()}</span>`,
            date: dateField.val(),
            status: `<span class="badge text-uppercase f-s-10 bg-${statusField.val()}-subtle bg-${statusField.val()}">${$("#status-field option:selected").text()}</span>`,
        };

        contactList.add(newItem);
        clearFields();
        refreshCallbacks();
    } catch (error) {
        console.error("Error adding item:", error);
    }
});

$(document).on('click', '#edit-btn', function () {
    try {
        const item = contactList.get('id', idField.val())[0];
        item.values({
            id: idField.val(),
            task: taskField.val(),
            assign: assignField.val(),
            notes: notesField.val(),
            date: dateField.val(),
            status: `<span class="badge text-uppercase bg-${statusField.val()}-subtle bg-${statusField.val()}">${$("#status-field option:selected").text()}</span>`,
        });
        clearFields();
        editBtn.hide();
        addBtn.show();
    } catch (error) {
        console.error("Error editing item:", error);
    }
});

function refreshCallbacks() {
    // Re-bind the event listeners for dynamically created buttons
    const newRemoveBtns = $(removeBtns.selector);
    const newEditBtns = $(editBtns.selector);

    // Remove previous listeners to avoid memory leaks
    removeBtns.off('click');
    editBtns.off('click');

    newRemoveBtns.on('click', function () {
        try {
            const itemId = $(this).closest('tr').find('.id').text();
            contactList.remove('id', itemId);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    });

    newEditBtns.on('click', function () {
        try {
            const itemId = $(this).closest('tr').find('.id').text();
            const itemValues = contactList.get('id', itemId)[0].values();
            idField.val(itemValues.id);
            taskField.val(itemValues.task);
            assignField.val(itemValues.assign);
            notesField.val(itemValues.notes);
            dateField.val(itemValues.date);
            statusField.val(itemValues.status);

            editBtn.show();
            addBtn.hide();
        } catch (error) {
            console.error("Error editing item:", error);
        }
    });
}

function clearFields() {
    taskField.val('');
    assignField.val('');
    notesField.val('');
    dateField.val('');
    statusField.val('');
}


// Checkbox JS

const checkboxes = document.querySelectorAll('.todo-checkbox');

checkboxes.forEach(checkbox => {
    const changeHandler = function () {
        try {
            const row = this.closest('tr');
            if (!row) return;

            this.checked
                ? row.classList.add('text-d-line-through')
                : row.classList.remove('text-d-line-through');
        } catch (error) {
            console.error('Error handling checkbox change:', error);
        }
    };

    checkbox.addEventListener('change', changeHandler);

    checkbox._changeHandler = changeHandler;
});

