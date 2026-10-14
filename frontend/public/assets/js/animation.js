const notes = document.querySelectorAll('.animation-blocks > .animation-card a');

if (notes.length) {
    notes.forEach(note => {
        note.addEventListener('mouseenter', function (e) {
            const ani = e.target.dataset.ani;
            e.target.classList.add('animate__animated', 'animate__1', 'animate__' + ani);
            void e.target.offsetWidth;
            setTimeout(() => {
                e.target.classList.remove('animate__animated', 'animate__1', 'animate__' + ani);
            }, 1000);
        });
    });
}
