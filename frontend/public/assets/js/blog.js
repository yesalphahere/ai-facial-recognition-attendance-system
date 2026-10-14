// Image to background js
(function ($) {
    "use strict";

    const bgImages = $(".bg-img");

    bgImages.each(function () {
        const el = $(this);
        const src = el.attr('src');
        const parent = el.parent();

        if (parent && src) {
            try {
                parent.css({
                    'background-image': 'url(' + src + ')',
                    'background-size': 'cover',
                    'background-position': 'center top',
                    'display': 'block'
                });
                el.hide();
            } catch (error) {
                console.error('Error applying background:', error);
            }
        }
    });

    bgImages.parent().addClass('bg-size');

})(jQuery);


// Delete button functionality
document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const blogCard = this.closest('.col-md-6');
            if (blogCard) {
                blogCard.remove();
            }
        });
    });
});

// Glightbox js
GLightbox({
    touchNavigation: true,
    loop: true,
    width: "90vw",
    height: "90vh",
});
