// ---- code copy js ---- //
const shadowBoxes = document.querySelectorAll(".box-shadow-box"); // Cache DOM node access

shadowBoxes.forEach(box => {
    box.addEventListener("click", () => {
        try {
            const classNameToCopy = box.classList[1];
            copyTextToClipboard(classNameToCopy);

            Toastify({
                text: "Class name copied to the clipboard successfully",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: { background: "rgba(var(--success),1)" },
                onClick: function () {}
            }).showToast();
        } catch (error) {
            console.error("Error copying class name:", error);
            Toastify({
                text: "An error occurred while copying the class name",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: { background: "rgba(var(--danger),1)" },
                onClick: function () {}
            }).showToast();
        }
    });
});
