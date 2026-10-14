

// File upload js
const fileInput = document.querySelector('.ticket-file-upload');

if (fileInput) {
    try {
        FilePond.create(fileInput, {
            labelIdle: `
                <i class="fa-solid fa-cloud-arrow-up me-2 f-s-30 mb-3 text-primary"></i>
                <p class="f-s-18">Choose a file</p>
                <p class="f-s-14 text-secondary text-center pe-3 ps-3">JPEG, PNG & PDF formats, up to 50MB</p>
                <p class="btn btn-lg file-btn btn-primary mt-3 f-s-14">Choose Files</p>
            `,
            acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
            maxFileSize: '50MB',
        });
    } catch (error) {
        console.error('FilePond initialization failed:', error);
    }
}


// Editor js
$('#editor-1').trumbowyg({
    btns: [
        ['viewHTML'],
        ['undo', 'redo'], // Only supported in Blink browsers
        ['formatting'],
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
    ],
});
