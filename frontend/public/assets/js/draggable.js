const draggableCard = document.querySelector('#draggableCard');
const shareMenuLeft = document.querySelector('#shareMenuLeft');
const shareMenuRight = document.querySelector('#shareMenuRight');
const clonicMenuLeft = document.querySelector('#clonicMenuLeft');
const clonicMenuRight = document.querySelector('#clonicMenuRight');
const handleList = document.querySelector('#handleList');
const gridList = document.querySelector('#gridList');
const nestedSortables = $(".nested-sortable");

try {
    if (draggableCard) {
        new Sortable(draggableCard, {
            animation: 150,
            ghostClass: 'blue-background-class'
        });
    } else {
        console.warn("draggableCard element not found.");
    }
} catch (e) {
    console.error("Error initializing draggable card sortable:", e);
}

try {
    if (shareMenuLeft && shareMenuRight) {
        new Sortable(shareMenuLeft, {
            group: 'shared',
            animation: 150
        });
        new Sortable(shareMenuRight, {
            group: 'shared',
            animation: 150
        });
    } else {
        console.warn("Share menu elements not found.");
    }
} catch (e) {
    console.error("Error initializing share menu list sortable:", e);
}


try {
    if (clonicMenuLeft && clonicMenuRight) {
        new Sortable(clonicMenuLeft, {
            group: {
                name: 'shared1',
                pull: 'clone',
                put: false
            },
            animation: 150,
            sort: false
        });
        new Sortable(clonicMenuRight, {
            group: {
                name: 'shared1',
                pull: 'clone'
            },
            animation: 150
        });
    } else {
        console.warn("Clonic menu elements not found.");
    }
} catch (e) {
    console.error("Error initializing clonic menu list sortable:", e);
}

// Handle list sortable initialization
try {
    if (handleList) {
        new Sortable(handleList, {
            handle: '.list-handle',
            animation: 150
        });
    } else {
        console.warn("Handle list element not found.");
    }
} catch (e) {
    console.error("Error initializing handle list sortable:", e);
}

// Grid box sortable initialization
try {
    if (gridList) {
        new Sortable(gridList, {
            swap: true,
            swapClass: 'highlight',
            animation: 150
        });
    } else {
        console.warn("Grid list element not found.");
    }
} catch (e) {
    console.error("Error initializing grid box sortable:", e);
}

// Nestable list sortable initialization
$(document).ready(function () {
    try {
        if (nestedSortables.length) {
            nestedSortables.each(function (index, element) {
                new Sortable(element, {
                    group: 'nested',
                    animation: 150,
                    fallbackOnBody: true,
                    swapThreshold: 0.65,

                });
            });
        } else {
            console.warn("No nested sortable elements found.");
        }
    } catch (e) {
        console.error("Error initializing nested list sortable:", e);
    }
});

const someElement = document.querySelector('#someElement');
const eventHandler = function () {
    console.log('Event triggered!');
};

try {
    if (someElement) {
        someElement.addEventListener('click', eventHandler);
    } else {
        console.warn("someElement not found.");
    }
} catch (e) {
    console.error("Error attaching event listener:", e);
}

try {
    if (someElement) {
        someElement.removeEventListener('click', eventHandler);
    }
} catch (e) {
    console.error("Error detaching event listener:", e);
}
