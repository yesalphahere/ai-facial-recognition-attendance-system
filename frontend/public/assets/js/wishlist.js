
const heartIcons = document.querySelectorAll('.heart-icon');

heartIcons.forEach(function(icon) {
    icon.addEventListener('click', function() {
        const currentIcon = this;

        currentIcon.classList.toggle('ti-heart');        // Toggle outline
        currentIcon.classList.toggle('ti-heart-filled'); // Toggle filled
    });
});
