// Department Images filepond js
FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation
);

const inputElement = document.querySelector('#departmentImages');
if (inputElement) {
    try {
        FilePond.create(inputElement, {
            labelIdle: `
              <i class="ti ti-cloud-upload fs-4"></i>
              <div class="filepond--label-action text-decoration-none">
                Upload Your Department Images
              </div>`,
            allowMultiple: true,
            allowReorder: true,
            acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
            maxFileSize: '50MB'
        });
    } catch (error) {
        console.error("Error initializing FilePond:", error);
    }
}

// image uploader
function readURL(input) {
    try {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imgPreview = $('#imgPreview');
                imgPreview.css('background-image', `url(${e.target.result})`);
                imgPreview.hide().fadeIn(650);
            };

            reader.readAsDataURL(input.files[0]);
        }
    } catch (error) {
        console.error("Error reading the file:", error);
    }
}

$('#imageUpload').on('change', function () {
    try {
        readURL(this);
    } catch (error) {
        console.error("Error during file change event:", error);
    }
});
