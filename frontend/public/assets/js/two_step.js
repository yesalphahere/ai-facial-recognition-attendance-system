const digitValidate = (ele) => {
    ele.value = ele.value.replace(/[^0-9]/g, '');
};

const tabChange = (val) => {
    const inputs = document.querySelectorAll('input');

    if (inputs.length === 0) return;

    const prev = val - 1;
    const next = val;
    const beforePrev = val - 2;

    if (inputs[prev] && inputs[prev].value !== '') {
        inputs[next]?.focus();
    } else if (inputs[beforePrev]) {
        inputs[beforePrev].focus();
    }
};
