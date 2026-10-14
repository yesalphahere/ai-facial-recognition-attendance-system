function addClassElementEvent(element, className, event) {
    const elements = document.querySelectorAll(element);
    elements.forEach((el) => {
        el.addEventListener(event, function () {
            // Remove class from all elements
            elements.forEach((el) => el.classList.remove(className));
            // Add class to the clicked element
            this.classList.add(className);
        });
    });
}

addClassElementEvent('.list-active', 'active', 'click');

const contactListBox = document.querySelector('.contact-listbox');
if (contactListBox) {
    contactListBox.addEventListener('click', () => {
        // Cache the element once for better performance
        const contactStared = document.querySelector('.bookmark-edit');
        if (contactStared) {
            contactStared.classList.toggle('star-stared');
        }
    });
}
