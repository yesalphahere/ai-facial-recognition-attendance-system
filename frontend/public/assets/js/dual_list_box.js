// Dual Listbox Initializations
const dlb1 = new DualListbox(".select1");

const dlb2 = new DualListbox(".select2", {
    availableTitle: "Available numbers",
    selectedTitle: "Selected numbers",
    addButtonText: ">",
    removeButtonText: "<",
    addAllButtonText: ">>",
    removeAllButtonText: "<<",
    searchPlaceholder: "search numbers",
    enableDoubleClick: false,
});

dlb2.addEventListener("added", (event) => {
    document.querySelector(".changed-element").innerHTML = event.addedElement.outerHTML;
});

dlb2.addEventListener("removed", (event) => {
    document.querySelector(".changed-element").innerHTML = event.removedElement.outerHTML;
});

const dlb3 = new DualListbox(".select3", {
    showAddButton: false,
    showAddAllButton: false,
    showRemoveButton: false,
    showRemoveAllButton: false,
});

const dlb4 = new DualListbox(".select4", {
    showSortButtons: true,
});

// Toggle Source Code Blocks
const sources = document.querySelectorAll(".source");
sources.forEach((sourceEl) => {
    sourceEl.addEventListener("click", (event) => {
        const code = document.querySelector("." + event.currentTarget.dataset.source);
        if (code) {
            code.classList.toggle("open");
        }
    });
});
