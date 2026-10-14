"use strict";

$(function () {
    const editor = $('#editor');
    const editor1 = $('#editor1');
    const buttons = $("button");


    const editorOptions = {
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
    };

    const editor1Options = {
        btns: [
            ['strong', 'em'],
            ['justifyLeft', 'justifyCenter'],
            ['insertImage', 'link'],
        ],
    };

    try {
        editor.trumbowyg(editorOptions);
    } catch (e) {
        console.error("Error initializing editor for #editor:", e);
    }

    try {
        editor1.trumbowyg(editor1Options);
    } catch (e) {
        console.error("Error initializing editor for #editor1:", e);
    }

    const tooltipInit = {
        init: function () {
            try {
                buttons.tooltip();
            } catch (e) {
                console.error("Error initializing tooltips:", e);
            }
        }
    };

    tooltipInit.init();

    const tooltipToggle = function () {
        buttons.tooltip('toggle');
    };

    try {
        buttons.off('click', tooltipToggle);
        buttons.on('click', tooltipToggle);
    } catch (e) {
        console.error("Error detaching or attaching event listener:", e);
    }
});
