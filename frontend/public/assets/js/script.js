//  -----------------------------------------------------------------------------------

//     Template Name: ki-admin Admin
//     Template URI: http://admin.la-themes.com/ki-admin/theme
//     Description: This is Admin theme
//     Author: la-themes
//     Author URI: https://themeforest.net/user/la-themes

// -----------------------------------------------------------------------------------

// 01. Horizontal Nav js
// 02. Flag  Icon Js
// 03. copy js
// 04. sidebar toggle js
// 05. List page js
// 06. Sidebar scroll js
// 07. Loader JS
// 08. tap on top
// 09. flag dropdown
// 10. hide-show
// 11. dark mode js
// 12. close on click js
// 13. searchbar js
// 14. closeCollapse js
// 15. Modal js


// >>-- 01 Horizontal Nav Js --<<
let navBar = $(".main-nav");
let size = "150px";
let leftsideLimit = -100;
let navbarSize;
let containerWidth;
let maxNavbarLimit;

function setUpHorizontalHeader() {
  navbarSize = navBar.width();
  containerWidth = ($(".simplebar-content").width())
  maxNavbarLimit = -(navbarSize - containerWidth);
  if ($("nav").hasClass("horizontal-sidebar")) {
    $(".menu-next").removeClass("d-none");
    $(".menu-previous").removeClass("d-none");
  } else {
    navBar.css("marginLeft",0)
    $(".menu-next").addClass("d-none");
    $(".menu-previous").addClass("d-none");
  }
  $(".horizontal-sidebar .show").removeClass("show");
}

$(document).on('click', '.menu-previous', function (e) {
  let layoutOption = getLocalStorageItem("layout-option","ltr");
  let attribute = (layoutOption == 'ltr' || layoutOption == 'box-layout') ? 'marginLeft' : 'marginRight';
  let currentPosition = parseInt(navBar.css(attribute));
  if (currentPosition < 0) {
    navBar.css(`${attribute}`, "+=" + size)
    $(".menu-next").removeClass("d-none");
    $(".menu-previous").removeClass("d-none");
    if (currentPosition >= leftsideLimit) {
      $(this).addClass("d-none");
    }
  }
})

$(document).on('click', '.menu-next', function (e) {
  let layoutOption = getLocalStorageItem("layout-option","ltr");
  let attribute = (layoutOption == 'ltr' || layoutOption == 'box-layout') ? 'marginLeft' : 'marginRight';
  let currentPosition = parseInt(navBar.css(attribute));
  if (currentPosition >= maxNavbarLimit) {
    $(".menu-next").removeClass("d-none");
    $(".menu-previous").removeClass("d-none");
    navBar.css(`${attribute}`, "-=" + size)
    if (currentPosition - parseInt(size) <= maxNavbarLimit) {
      $(this).addClass("d-none");
    }
  }
})

$(function () {
    setUpHorizontalHeader();
  let themeMode = getLocalStorageItem('theme-mode', 'light')
    setTimeout(() => {
    $('body').addClass(`${themeMode}`)
  }, 1500);
});


// >>-- 02 Flag  Icon Js --<<
$(function () {
  let text = $(".selected i").attr('class')
  $(".flag i").prop('class', text);
  $(document).on('click', '.lang', function () {
    $(".lang").removeClass("selected");
    $(this).addClass("selected");
    text = $(".selected i").attr('class')
    $(".flag i").prop('class', text);
  });
})



// >>-- 03 Copy js --<<
function copyvalue() {
  let temp = document.createElement('input');
  let texttoCopy = document.getElementById('copyText2').innerHTML;
  temp.type = 'input';
  temp.setAttribute('value', texttoCopy);
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.remove();
  console.timeEnd('time2');
}



// >>-- 04 Sidebar toggle js --<<
$(document).on('click', '.header-toggle', function () {
  $("nav").toggleClass("semi-nav");
});
$(".toggle-semi-nav").on("click", function () {
  $("nav").removeClass("semi-nav");
});


// >>-- 05 List page js --<<
const $window = $(window);
const $nav = $('nav');
const $contactListbox = $(".contact-listbox");

// Event listener for click
$contactListbox.on("click", function () {
    $(this).toggleClass("stared");
});

function resize() {
    $nav.removeClass('semi-nav');
    if ($window.width() < 768) {
    } else if ($window.width() < 1199) {
        $nav.addClass('semi-nav');
    }
}
$(function () {
    resize();
});

window.addEventListener("resize", () => {
    resize();
});

// >>-- 06 Sidebar scroll js --<<
const myElement = document.getElementById('app-simple-bar');
if (myElement) {
    new SimpleBar(myElement, { autoHide: true });
}

// Sidebar active class js
$(function () {
    const current = location.pathname.split('/').pop();
    const $mainNavLinks = $('.main-nav li a');

    $mainNavLinks.each(function () {
        const $this = $(this);
        const linkHref = $this.attr("href").split('/').pop();

        if (current === linkHref) {
            const $parentLi = $this.parent('li');
            const $parentUl = $this.parent().parent().parent();
            const $grandParentUl = $parentUl.parent().parent().parent();

            if ($grandParentUl.hasClass("another-level")) {
                $grandParentUl.closest('li').children().addClass('show').attr("aria-expanded", "true");
            }

            $parentUl.children().addClass('show').attr("aria-expanded", "true");
            $parentLi.addClass('active');
        }
    });
});
// >>-- 07 Loader JS --<<
$('.loader-wrapper').fadeOut('slow', function () {
  $(this).remove();
});


// >>-- 08 tap on top --<<
let calcScrollValue = () => {
    const $scrollProgress = document.getElementsByClassName("go-top")[0];
    const $progressValue = document.getElementsByClassName("progress-value")[0];
    const docElement = document.documentElement;

    const pos = docElement.scrollTop;
    const calcHeight = docElement.scrollHeight - docElement.clientHeight;
    const scrollValue = Math.round((pos * 100) / calcHeight);

    if (pos > 100) {
        $scrollProgress.style.display = 'grid';
    } else {
        $scrollProgress.style.display = 'none';
    }

    $scrollProgress.addEventListener("click", () => {
        docElement.scrollTop = 0;
    });

    $scrollProgress.style.background = `conic-gradient(rgba(var(--primary), 1) ${scrollValue}%, rgba(var(--primary), 1) ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;


// >>-- 09 Flag dropdown --<<
$(function () {
    const $flagImg = $(".flag img");
    const $flagIcon = $(".flag i");
    const $langs = $(".lang");

    // Initialize image and icon from the selected language
    const initialSelected = $(".lang.selected");
    const initialImgSrc = initialSelected.find("img").attr("src");
    const initialIconClass = initialSelected.find("i").attr("class");

    $flagImg.prop("src", initialImgSrc);
    $flagIcon.prop("class", initialIconClass);

    $(document).on("click", ".lang", function () {
        $langs.removeClass("selected");

        const $this = $(this);
        $this.addClass("selected");

        const newImgSrc = $this.find("img").attr("src");
        const newIconClass = $this.find("i").attr("class");

        $flagImg.prop("src", newImgSrc);
        $flagIcon.prop("class", newIconClass);
    });
});



// >>-- 10 Hide-show --<<

const appElement = document.getElementById("myapp");
const $buttonContent = $("#button-content");
const $buttonCode = $("#button-code");

function myFunction() {
    if (appElement.style.display === "none") {
        appElement.style.display = "block";
        const buttoncontent = $buttonContent.html().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $buttonCode.html(buttoncontent);
    } else {
        appElement.style.display = "none";
        $buttonCode.html("");
    }
}


// >>-- 11 Dark mode js --<<

const themeToggle = document.querySelector(".header-dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.querySelector(".sun-logo")?.classList.toggle("sun");
        document.querySelector(".moon-logo")?.classList.toggle("moon");

        const isDark = document.body.classList.contains("dark");
        document.body.classList.toggle("dark", !isDark);
        document.body.classList.toggle("light", isDark);
        setLocalStorageItem('theme-mode', isDark ? 'light' : 'dark');
    });
}
function appendHtml() {
  let div = document.getElementsByClassName('app-wrapper');
  div.innerHTML += '<p>This is some HTML code</p>';
}
window.onload = function () {
  appendHtml();
}

// >>-- 12 Close on click js --<<

$(document).on('click', '.close-btn', function () {
  let targetItem = $(this).closest(".head-box");
  let targetParent = targetItem.parent();
  $(this).parent().parent().remove();
  if (targetParent.find(".head-box").length <= 0) {
    targetParent.parent().parent().find('.head-box-footer').addClass('d-none');
    targetParent.parent().parent().find('.offcanvas-body').addClass('h-auto');
  }
});

 // >>-- 13 Searchbar js --<<
$(document).on('keyup', '.search-filter', function () {
    const search = $(this).val().toLowerCase();
    $('.search-list-item').each(function () {
        const item = $(this);
        const contentElement = item.find('.search-list-content h6');
        const contentText = contentElement.text().toLowerCase();

        if (contentText.includes(search)) {
            item.show();
            const highlightedText = contentText.replace(new RegExp(search, 'gi'), function (match) {
                return `<span class="highlight-searchtext">${match}</span>`;
            });
            contentElement.html(highlightedText);
        } else {
            item.hide();
        }
    });
});

// >>-- 14 CloseCollapse js --<<
const closeCollaps = document.querySelectorAll('.main-nav li a[data-bs-toggle="collapse"]');

closeCollaps.forEach((element) => {
    element.addEventListener('click', () => {
        const parent = element.closest('.collapse');
        const all = document.querySelectorAll('.main-nav ul.collapse');

        all.forEach((e) => {
            if (e !== parent) {
                e.classList.remove('show');
                const ariaExpand = e.previousElementSibling;
                if (ariaExpand) ariaExpand.setAttribute('aria-expanded', 'false');
            }
        });

        parent?.classList.add('show');
        const ariaExpand = element;
        if (ariaExpand) ariaExpand.setAttribute('aria-expanded', 'true');
    });
});
// >>-- 15  Modal js --<<

$(function () {
  $('#welcomeCard').modal('show');
});

function copyTextToClipboard(text) {
    let textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
