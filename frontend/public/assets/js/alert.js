const alertPlaceholder = document.getElementById('liveAlert');
const alertTrigger = document.getElementById('liveAlertBtn');

// Ensure that the elements exist before proceeding
if (alertPlaceholder && alertTrigger) {

    const appendAlert = (message) => {
        try {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = [
                `<div class="alert alert-light-primary alert-dismissible alert-dismissible fade show" role="alert">`,
                `  <div>${message}</div>`,
                '  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');

            alertPlaceholder.append(wrapper);

            const alertElement = wrapper.querySelector('.alert');
            new bootstrap.Alert(alertElement); // Initialize the Bootstrap alert
        } catch (error) {
            console.error('Error while adding alert:', error);
        }
    };


    const handleAlertClick = () => {
        appendAlert('Hi!, Welcome To ki-admin', 'light');
    };

    alertTrigger.addEventListener('click', handleAlertClick);

} else {
    console.warn('Required elements for alerts not found!');
}
