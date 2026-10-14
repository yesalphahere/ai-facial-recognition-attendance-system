// cheatsheet js

$(document).on('click', '.btn-click', function () {
    $(".code-container").toggleClass("d-block").toggleClass("d-none");
});

$(document).on('click', '.box-close', function () {
    $(".code-container").addClass("d-none").removeClass("d-block");
});

function notifyMessage(text) {
    Toastify({
        text: text,
        duration: 1000,
        position: "right",
        style: {
            background: "rgb(var(--success),1)",
        }
    }).showToast();
}

function copyClassClipboard(id) {
    const srcObj = document.getElementById(id);
    const range = document.createRange();
    range.selectNode(srcObj);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    notifyMessage('Copied Successfully!!');
    window.getSelection().removeAllRanges();
}

function copyToClipboard(element) {
    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    notifyMessage('Copied Successfully!!');
    $temp.remove();
}

$('.list-preview').on('click', function (e) {
    $('.code-preview-popup').removeClass('d-none');
    $('.list-item-preview').removeClass('active-preview');
    const ele = $(this).parent();
    ele.addClass('active-preview');
    const header = ele.attr('data-header');
    const codeText = ele.find('code').html();
    const codeTextPreview = ele.find('code').text();
    $('.header-preview-text').text(header);
    $('#previewCodeText').html(codeText);
    $('.code-preview-div').html(codeTextPreview);
});

$(document).on('keyup', '.cheatsheet-filter', function (e) {
    const search = $(this).val().toLowerCase();
    $('.box-template-list').each(function () {
        if ($(this).filter(function () {
            return $(this).find('.box-template-name').text().toLowerCase().indexOf(search) > -1;
        }).length > 0 || search.length < 1) {
            $(this).removeClass('d-none');
        } else {
            $(this).addClass('d-none');
        }
    });
});
