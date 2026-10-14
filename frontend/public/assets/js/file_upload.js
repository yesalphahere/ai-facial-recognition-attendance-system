// ------------------- File Upload DOM Trigger -------------------

try {
    const realFileBtn = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    const customTxt = document.getElementById("custom-text");

    if (customBtn && realFileBtn && customTxt) {
        const handleCustomClick = () => realFileBtn.click();
        const handleFileChange = () => {
            customTxt.innerHTML = realFileBtn.value
                ? realFileBtn.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)?.[1] || "No file chosen"
                : "No file chosen, yet.";
        };

        customBtn.addEventListener("click", handleCustomClick);

        realFileBtn.addEventListener("change", handleFileChange);
    }
} catch (err) {
    console.error("Custom file input setup failed:", err);
}

// ------------------- FilePond Setup -------------------

FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation
);

// Setup Function for Reuse
function setupPond(selector, options = {}) {
    try {
        const el = document.querySelector(selector);
        if (el) {
            FilePond.create(el, {
                labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw f-s-60 text-secondary"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`,
                ...options
            });
        }
    } catch (err) {
        console.error(`FilePond setup failed for ${selector}:`, err);
    }
}

// Basic Uploaders
setupPond('.filepond-file');
setupPond('#id');
setupPond('#fileupload-2', {
    imagePreviewHeight: 170,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 100,
    stylePanelLayout: 'compact circle',
    styleLoadIndicatorPosition: 'center bottom',
    styleProgressIndicatorPosition: 'right bottom',
    styleButtonRemoveItemPosition: 'left bottom',
    styleButtonProcessItemPosition: 'right bottom'
});

// Solid Uploaders
['solid1', 'filepondsolid1', 'solid2', 'filepondsolid2', 'solid3', 'filepondsolid3', 'solid4', 'filepondsolid4'].forEach(id => {
    const options = id.startsWith('filepond')
        ? {
            labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw f-s-10 text-secondary"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`,
            imagePreviewHeight: 170,
            imageCropAspectRatio: '1:1',
            imageResizeTargetWidth: 100,
            imageResizeTargetHeight: 100,
            stylePanelLayout: 'compact circle',
            styleLoadIndicatorPosition: 'center bottom',
            styleProgressIndicatorPosition: 'right bottom',
            styleButtonRemoveItemPosition: 'left bottom',
            styleButtonProcessItemPosition: 'right bottom'
        }
        : {
            labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw f-s-25"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`
        };
    setupPond(`#${id}`, options);
});

// Light Uploaders
['light1', 'filepondLight1', 'light2', 'filepondLight2', 'light3', 'filepondLight3', 'light4', 'filepondLight4'].forEach(id => {
    const options = id.startsWith('filepond')
        ? {
            labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw f-s-10 text-secondary"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`,
            imagePreviewHeight: 170,
            imageCropAspectRatio: '1:1',
            imageResizeTargetWidth: 100,
            imageResizeTargetHeight: 100,
            stylePanelLayout: 'compact circle',
            styleLoadIndicatorPosition: 'center bottom',
            styleProgressIndicatorPosition: 'right bottom',
            styleButtonRemoveItemPosition: 'left bottom',
            styleButtonProcessItemPosition: 'right bottom'
        }
        : {
            labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw f-s-25"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`
        };
    setupPond(`#${id}`, options);
});
