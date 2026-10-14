$(function () {
    // **------ Load customizer ------**
    $.get("../assets/customizer.txt", function (html_string) {
        const customizer = $("#customizer");
        if (customizer.length > 0) {
            customizer.html(html_string);
        }
    }, 'html');

    setTimeout(() => {
        loadConfiguration();
    }, 1000);
});

$(document).on("click", ".sidebar-option > li", function () {
    const sidebarClassName = $(this).attr('class');
    try {
        $("nav").removeClass("horizontal-sidebar vertical-sidebar dark-sidebar").addClass(sidebarClassName);
        setLocalStorageItem("sidebar-option", sidebarClassName);

        if (sidebarClassName === "vertical-sidebar") {
            $(".main-nav").css('marginLeft', "0px").css('marginRight', "0px");
        }

        setUpHorizontalHeader();
    }catch (e) {
        console.log("Fail to change sidebar option");
    }
});

$(document).on("click", ".layout-option > li", function () {
    const layoutClassName = $(this).attr('class');

    try {
        $("body").attr("class", layoutClassName);
        $("html").attr("dir", layoutClassName);

        if (layoutClassName === "box-layout") {
            $("html").removeAttr("dir");
        }

        setLocalStorageItem("layout-option", layoutClassName);
    } catch (e) {
        console.log("Fail to change layout option");
    }

});

$(document).on("click", ".color-hint > li", function () {
    const colorClassName = $(this).attr('class');
    try {
        const colorOption = getLocalStorageItem("color-option", "default");

        $(".app-wrapper").removeClass(colorOption).addClass(colorClassName);

        const primaryColorValues = $(`.${colorClassName}`).css('--primary').split(',');
        if (primaryColorValues.length === 3) {
            const primaryColorHex = rgbToHex(
                parseInt(primaryColorValues[0]),
                parseInt(primaryColorValues[1]),
                parseInt(primaryColorValues[2])
            );
            setLocalStorageItem("color-primary", primaryColorHex);
        }

        const secondaryColorValues = $(`.${colorClassName}`).css('--secondary').split(',');
        if (secondaryColorValues.length === 3) {
            const secondaryColorHex = rgbToHex(
                parseInt(secondaryColorValues[0]),
                parseInt(secondaryColorValues[1]),
                parseInt(secondaryColorValues[2])
            );
            setLocalStorageItem("color-secondary", secondaryColorHex);
        }

        setLocalStorageItem("color-option", colorClassName);
    } catch (e) {
        console.log("Fail to change color option");
    }
    window.location.reload();
});

$(document).on("click", ".text-size > li", function () {
    const fontClassName = $(this).attr('class');
    $("body").attr("text", fontClassName);
    setLocalStorageItem("text-option", fontClassName);
});

/* Handle click for Sidebar option, layout option and Text size */
$(document).on("click", ".offcanvas-body > ul > li", function () {
    $(this).parent().find("li").removeClass('selected');
    $(this).addClass('selected');
});

/* Theme name prepend to localStorage key */
const themeName = "ki-admin";

/* Get item from localStorage */
function getLocalStorageItem(key, defaultValue = null) {
    return localStorage.getItem(`${themeName}-${key}`) ?? defaultValue;
}

/* Set item in localStorage */
function setLocalStorageItem(key, value) {
    localStorage.setItem(`${themeName}-${key}`, value);
}

function hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return alpha
        ? `rgba(${r}, ${g}, ${b}, ${alpha})`
        : `rgb(${r}, ${g}, ${b})`;
}

function loadConfiguration() {
    $(".offcanvas-body > ul > li").removeClass("selected");

    const selectedSidebarOption = getLocalStorageItem("sidebar-option", "vertical-sidebar");
    $("nav").addClass(selectedSidebarOption);
    $(".offcanvas-body > ul").find(`.${selectedSidebarOption}`).addClass("selected");

    const textOption = getLocalStorageItem("text-option", "medium-text");
    $("body").attr("text", textOption);
    $(".offcanvas-body > ul").find(`.${textOption}`).addClass("selected");

    const layoutOption = getLocalStorageItem("layout-option", "ltr");
    $("body").attr("class", layoutOption);
    $("html").attr("dir", layoutOption);
    $(".offcanvas-body > ul").find(`.${layoutOption}`).addClass("selected");

    const colorOption = getLocalStorageItem("color-option", "default");
    $(".offcanvas-body > ul").find(`.${colorOption}`).addClass("selected");
    $(".app-wrapper").addClass(colorOption);

    setUpHorizontalHeader();
}

function setColor() {
    const primaryColor = $("#primary_color").val();
    const secondaryColor = $("#secondary_color").val();
    const root = document.querySelector(':root');

    root.style.setProperty('--primary', hexToRGB(primaryColor));
    root.style.setProperty('--secondary', hexToRGB(secondaryColor));
}

// **------ Reset Functionality ------**
function resetCustomizer() {
    const colorOption = getLocalStorageItem("color-option", "default");
    $(".app-wrapper").removeClass(colorOption);
    localStorage.clear();
    window.location.reload();
}

// **------ Convert RGB to HEX ------**
function rgbToHex(r, g, b) {
    return (
        '#' +
        componentToHex(r) +
        componentToHex(g) +
        componentToHex(b)
    );
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
