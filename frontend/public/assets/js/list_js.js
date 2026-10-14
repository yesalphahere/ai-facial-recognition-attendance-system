// **------ Example 1 (Updated with let & const)**
const options = {
    valueNames: ['id', 'employee', 'email', 'contact', 'date', 'status'],
    page: 4,
    pagination: true
};

const contactList = new List('myTable', options);

const idField = $('#id-field');
const employeeField = $('#employee-field');
const emailField = $('#email-field');
const contactField = $('#contact-field');
const dateField = $('#date-field');
const statusField = $('#status-field');
const addBtn = $('#add-btn');
const editBtn = $('#edit-btn').hide();

// let removeBtns = $('.remove-item-btn');
// let editBtns = $('.edit-item-btn');

refreshCallbacks();

$(document).on("submit", "#add_employee_form", function (e) {
    e.preventDefault();
    $(this).parent().modal("hide");

    const newItem = {
        id: Math.floor(Math.random() * 110000),
        employee: employeeField.val(),
        email: emailField.val(),
        contact: contactField.val(),
        date: dateField.val(),
        status: `<span class="badge text-uppercase bg-${statusField.val()}-subtle text-${statusField.val()}">${$("#status-field option:selected").text()}</span>`,
    };

    contactList.add(newItem);
    clearFields();
    refreshCallbacks();
});

$(document).on('click', '#edit-btn', function () {
    const item = contactList.get('id', idField.val())[0];

    item.values({
        id: idField.val(),
        employee: employeeField.val(),
        email: emailField.val(),
        contact: contactField.val(),
        date: dateField.val(),
        status: `<span class="badge text-uppercase bg-${statusField.val()}-subtle text-${statusField.val()}">${$("#status-field option:selected").text()}</span>`,
    });

    editBtn.hide();
    addBtn.show();
    $('#exampleModal').modal().toggle();
});

function refreshCallbacks() {
    // Rebind the remove and edit buttons only once
    $(document).off('click', '.remove-item-btn').on('click', '.remove-item-btn', function () {
        const itemId = $(this).closest('tr').find('.id').text();
        contactList.remove('id', itemId);
    });

    $(document).off('click', '.edit-item-btn').on('click', '.edit-item-btn', function () {
        const itemId = $(this).closest('tr').find('.id').text();
        const itemValues = contactList.get('id', itemId)[0].values();

        idField.val(itemValues.id);
        employeeField.val(itemValues.employee);
        emailField.val(itemValues.email);
        contactField.val(itemValues.contact);
        dateField.val(itemValues.date);
        statusField.val(itemValues.status);

        editBtn.show();
        addBtn.hide();
    });
}

function clearFields() {
    employeeField.val('');
    emailField.val('');
    contactField.val('');
    dateField.val('');
    statusField.val('');
}

$(function () {
    $(".checkAll").on("click", function () {
        $(this)
            .closest("table")
            .find("tbody :checkbox")
            .prop("checked", this.checked)
            .closest("tr")
            .toggleClass("selected", this.checked);
    });

    $("tbody :checkbox").on("click", function () {
        $(this)
            .closest("tr")
            .toggleClass("selected", this.checked);

        $(this).closest("table")
            .find(".checkAll")
            .prop("checked",
                $(this).closest("table").find("tbody :checkbox:checked").length ===
                $(this).closest("table").find("tbody :checkbox").length
            );
    });
});

// **------ Example 2**
const options3 = {
    valueNames: [
        'name',
        'born',
        { data: ['id'] }
    ]
};
new List('users', options3);

// **------ Example 3**
const options2 = {
    valueNames: ['side']
};

new List('sideList', options2);

// **------ Example 4**
const monkeyList = new List('test-list', {
    valueNames: ['name'],
});

// **------ Example 5**
const options1 = {
    valueNames: ['name'],
    page: 3,
    pagination: true
};

new List('user', options1);
