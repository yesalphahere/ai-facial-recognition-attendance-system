// touch spin js

$(document).on('click', '.decrement, .increment', function () {
    try {
        let input = $(this).parent().find('.count');
        let count = input.val();

        if (count === '') {
            count = 0;
        }
        $(this).hasClass('decrement') ? count-- : count++;
        if (count)
            input.val(count)
    } catch (e) {
        console.error(e);
    }
});
