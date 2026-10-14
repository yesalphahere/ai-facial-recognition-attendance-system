const editor = document.querySelector('#editor');

if (editor) {
    try {
        $(editor).trumbowyg({
            btns: [
                ['viewHTML'],
                ['undo', 'redo'],
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

        console.log('Trumbowyg editor initialized successfully');
    } catch (error) {
        console.error('Error initializing Trumbowyg editor:', error);
    }
} else {
    console.warn('Editor element #editor not found');
}

//  File Upload Js
const fileInput = document.querySelector('#file-input');
const uploadedImageContainer = document.querySelector('#uploaded_image');


if (fileInput && uploadedImageContainer) {
    try {
        fileInput.addEventListener("change", (evt) => {
            const rawFile = evt.target.files;
            const file = rawFile[0] ? URL.createObjectURL(rawFile[0]) : null;

            if (file) {
                uploadedImageContainer.innerHTML = `
                        <div>
                            <img src="${file}" class="uploaded-image" alt="Uploaded Image">
                            <p>${rawFile[0].name}</p>
                        </div>
                    `;
            } else {
                console.warn('No file selected or file is invalid');
            }
        });
    } catch (error) {
        console.error('Error handling file input change:', error);
    }
} else {
    console.warn('File input or uploaded image container element not found');
}
