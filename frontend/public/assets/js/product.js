$(document).ready(function () {
    const $productWrapperGrid = $(".product-wrapper-grid");
    const $productItems = $productWrapperGrid.children().children();

    const updateProductView = (classes) => {
        $productItems.removeClass().addClass(classes);
    };

    $('.grid-layout-view').on('click', () => {
        updateProductView("list-view col-sm-6");
    });

    $('.product-view4').on('click', () => {
        if (!$productWrapperGrid.hasClass("list-view")) {
            updateProductView("col-xxl-3");
        }
    });

    $('.product-view3').on('click', () => {
        if (!$productWrapperGrid.hasClass("list-view")) {
            updateProductView("col-md-4");
        }
    });

    $('.product-view2').on('click', () => {
        if (!$productWrapperGrid.hasClass("list-view")) {
            updateProductView("col-sm-6 product-view-box");
        }
    });

    $('.product-view').on('click', () => {
        if (!$productWrapperGrid.hasClass("list-view")) {
            updateProductView("col-12");
        }
    });

    // Range and price filter
    const rangeInputs = document.querySelectorAll(".range-input input");
    const priceInputs = document.querySelectorAll(".price-input input");
    const range = document.querySelector(".slider .progress");
    const priceGap = 1000;

    if (priceInputs.length === 2 && rangeInputs.length === 2 && range) {
        priceInputs.forEach(input => {
            input.addEventListener("input", (e) => {
                const minPrice = parseInt(priceInputs[0].value, 10);
                const maxPrice = parseInt(priceInputs[1].value, 10);

                if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInputs[1].max) {
                    if (e.target.classList.contains("input-min")) {
                        rangeInputs[0].value = minPrice;
                        range.style.left = (minPrice / rangeInputs[0].max) * 100 + "%";
                    } else {
                        rangeInputs[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInputs[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInputs.forEach(input => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInputs[0].value, 10);
                let maxVal = parseInt(rangeInputs[1].value, 10);

                if (maxVal - minVal < priceGap) {
                    if (e.target.classList.contains("range-min")) {
                        rangeInputs[0].value = maxVal - priceGap;
                    } else {
                        rangeInputs[1].value = minVal + priceGap;
                    }
                } else {
                    priceInputs[0].value = minVal;
                    priceInputs[1].value = maxVal;
                    range.style.left = (minVal / rangeInputs[0].max) * 100 + "%";
                    range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";
                }
            });
        });
    }

    // Select and range slider
    const select = document.getElementById('select-input');
    const html5Slider = document.getElementById('html-input');
    const inputNumber = document.getElementById('number-input');

    if (select) {
        for (let i = -20; i <= 1000; i++) {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            select.appendChild(option);
        }
    }

    if (html5Slider) {
        noUiSlider.create(html5Slider, {
            start: [10, 30],
            connect: true,
            range: {
                min: 20,
                max: 40
            }
        });

        html5Slider.noUiSlider.on('update', (values, handle) => {
            const value = values[handle];
            if (handle) {
                inputNumber.value = value;
            } else {
                select.value = Math.round(value);
            }
        });

        select?.addEventListener('change', () => {
            html5Slider.noUiSlider.set([select.value, null]);
        });

        inputNumber?.addEventListener('change', () => {
            html5Slider.noUiSlider.set([null, inputNumber.value]);
        });
    }

    // Toggle product box
    const toggleBtn = document.querySelector('.toggle-btn');
    const productBox = document.querySelector('.productbox');

    if (toggleBtn && productBox) {
        toggleBtn.addEventListener('click', () => {
            productBox.classList.toggle("producttoggle");
        });
    }
});
