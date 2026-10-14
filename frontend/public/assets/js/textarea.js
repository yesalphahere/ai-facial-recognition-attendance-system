// Cache DOM elements
const writeTextarea = document.getElementById('write-textarea');
const codeOutput = document.getElementById('code-output');
const customTextarea = document.getElementById('myTextarea');
const output = document.getElementById('output');
const submitBtn = document.getElementById('submitBtn');


function display(source, destination) {
    destination.textContent = source;
}


if (writeTextarea && codeOutput) {
    writeTextarea.addEventListener('keyup', function () {
        display(this.value, codeOutput);
    });
}


if (submitBtn && customTextarea && output) {
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        output.innerHTML = customTextarea.value;
    });
}
