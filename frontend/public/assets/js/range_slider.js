// 1. Basic round slider
// const slider = document.getElementById('slider');
// noUiSlider.create(slider, {
//     start: 40,
//     connect: 'lower',
//     range: { 'min': 0, 'max': 100 }
// });

// 2. Values slider
const valuesSlider = document.getElementById('values-slider');
const valuesForSlider = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32];

const format = {
    to: function (value) {
        return valuesForSlider[Math.round(value)];
    },
    from: function (value) {
        return valuesForSlider.indexOf(Number(value));
    }
};

noUiSlider.create(valuesSlider, {
    start: 0,
    connect: 'lower',
    range: { min: 0, max: valuesForSlider.length - 1 },
    step: 2,
    tooltips: true,
    format: format,
    pips: { mode: 'steps', format: format },
});
valuesSlider.noUiSlider.set(5);

// 3. Multi-values slider
const arbitraryValuesSlider = document.getElementById('multi-values-slider');
const arbitraryValuesForSlider = ['MB', '256MB', '1GB', '8GB', '16GB', '32GB', 'GB'];

const arbitraryFormat = {
    to: function (value) {
        return arbitraryValuesForSlider[Math.round(value)];
    },
    from: function (value) {
        return arbitraryValuesForSlider.indexOf(value);
    }
};

noUiSlider.create(arbitraryValuesSlider, {
    start: ['1GB', '16GB'],
    connect: true,
    range: { min: 0, max: arbitraryValuesForSlider.length - 1 },
    step: 1,
    tooltips: false,
    format: arbitraryFormat,
    pips: { mode: 'steps', format: arbitraryFormat, density: 50 },
});

// 4. Tooltips slider
const sliderTooltip = document.getElementById('hide-tooltips');
noUiSlider.create(sliderTooltip, {
    start: 20,
    tooltips: true,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 5. HTML5 input
const select = document.getElementById('select-input');
for (let i = -20; i <= 40; i++) {
    const option = document.createElement("option");
    option.text = i;
    option.value = i;
    select.appendChild(option);
}

const html5Slider = document.getElementById('html-input');
noUiSlider.create(html5Slider, {
    start: [10, 30],
    connect: true,
    range: { 'min': -20, 'max': 40 }
});

const inputNumber = document.getElementById('number-input');
html5Slider.noUiSlider.on('update', function (values, handle) {
    const value = values[handle];
    if (handle) {
        inputNumber.value = value;
    } else {
        select.value = Math.round(value);
    }
});

select.addEventListener('change', function () {
    html5Slider.noUiSlider.set([this.value, null]);
});

inputNumber.addEventListener('change', function () {
    html5Slider.noUiSlider.set([null, this.value]);
});

// 7. Colored Connect Slider
const coloredSlider = document.getElementById('slider-colored');
noUiSlider.create(coloredSlider, {
    start: [20, 32, 50, 70, 80, 90],
    connect: true,
    tooltips: [false, true, true, true, true, true],
    range: { 'min': 0, 'max': 100 }
});

const sliderConnects = coloredSlider.querySelectorAll('.noUi-connect');
const classes = ['c1-color', 'c2-color', 'c3-color', 'c4-color', 'c5-color'];

sliderConnects.forEach((slider, i) => {
    slider.classList.add(classes[i]);
});

// 10. Primary slider
const primarySlider = document.getElementById('primary-slider');
noUiSlider.create(primarySlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 11. Secondary slider
const secondarySlider = document.getElementById('secondary-slider');
noUiSlider.create(secondarySlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 12. Success slider
const successSlider = document.getElementById('success-slider');
noUiSlider.create(successSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 13. Danger slider
const dangerSlider = document.getElementById('danger-slider');
noUiSlider.create(dangerSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 14. Warning slider
const warningSlider = document.getElementById('warning-slider');
noUiSlider.create(warningSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 15. Info slider
const infoSlider = document.getElementById('info-slider');
noUiSlider.create(infoSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 16. Light slider
const lightSlider = document.getElementById('light-slider');
noUiSlider.create(lightSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 17. Dark slider
const darkSlider = document.getElementById('dark-slider');
noUiSlider.create(darkSlider, {
    start: 40,
    connect: 'lower',
    range: { 'min': 0, 'max': 100 }
});

// 18. Vertical slider
const verticalSlider = document.getElementById('vertical-slider');
noUiSlider.create(verticalSlider, {
    start: 20,
    connect: 'lower',
    orientation: "vertical",
    range: { 'min': 0, 'max': 100 }
});

// 19. Colorpicker slider
const resultElement = document.getElementById('result');
const sliders = document.querySelectorAll('.verticalsliders');
const colors = [0, 0, 0];

sliders.forEach((slider, index) => {
    noUiSlider.create(slider, {
        start: 127,
        connect: [true, false],
        orientation: "vertical",
        range: { 'min': 0, 'max': 255 },
    });
    slider.noUiSlider.on('update', function () {
        colors[index] = slider.noUiSlider.get();
        const color = `rgb(${colors.join(',')})`;
        resultElement.style.background = color;
        resultElement.style.color = color;
    });
});

// 20. Toggle slider
const toggleSlider = document.getElementById('toggle-slider');
noUiSlider.create(toggleSlider, {
    orientation: "vertical",
    start: 0,
    range: { 'min': [0, 1], 'max': 1 },
    format: wNumb({ decimals: 0 })
});

toggleSlider.noUiSlider.on('update', function (values, handle) {
    if (values[handle] === '1') {
        toggleSlider.classList.add('off');
    } else {
        toggleSlider.classList.remove('off');
    }
});

// 6. Locking sliders together
let lockedState = false;
let lockedSlider = false;
let lockedValues = [60, 80];

const slider1 = document.getElementById('slider-1');
const slider2 = document.getElementById('slider-2');

const lockButton = document.getElementById('lockbtn');
const slider1Value = document.getElementById('val1');
const slider2Value = document.getElementById('val2');

lockButton.addEventListener('click', function () {
    lockedState = !lockedState;
    this.textContent = lockedState ? 'unlock' : 'lock';
});

function crossUpdate(value, slider) {
    if (!lockedState) return;
    const a = slider1 === slider ? 0 : 1;
    const b = a ? 0 : 1;
    value -= lockedValues[b] - lockedValues[a];
    slider.noUiSlider.set(value);
}

noUiSlider.create(slider1, {
    start: 20,
    connect: 'lower',
    range: { min: 10, max: 100 }
});

noUiSlider.create(slider2, {
    start: 60,
    connect: 'lower',
    animate: false,
    range: { min: 50, max: 100 }
});

slider1.noUiSlider.on('update', function (values, handle) {
    slider1Value.innerHTML = values[handle];
});

slider2.noUiSlider.on('update', function (values, handle) {
    slider2Value.innerHTML = values[handle];
});

function setLocked(value, slider) {
    if (!lockedSlider) {
        lockedSlider = slider;
        lockedValues[lockedSlider === slider1 ? 0 : 1] = value;
    } else {
        if (lockedSlider === slider1) {
            lockedValues[0] = value;
        } else {
            lockedValues[1] = value;
        }
        if (lockedSlider === slider2 && lockedState) {
            crossUpdate(value, slider);
        }
    }
}

slider1.noUiSlider.on('change', function () {
    setLocked(slider1.noUiSlider.get(), slider1);
});

slider2.noUiSlider.on('change', function () {
    setLocked(slider2.noUiSlider.get(), slider2);
});
