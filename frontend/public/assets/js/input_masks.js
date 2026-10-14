// **------ 1 Date Input**
const dateInputs = [
    '.cleave-input-date',
    '.month-input',
    '.formatting-input',
    '.formatting-delimter'
];

dateInputs.forEach(selector => {
    try {
        new Cleave(selector, {
            date: true,
            delimiter: selector === '.formatting-delimter' ? '.' : '/',
            datePattern: selector === '.month-input' ? ['d', 'm'] : ['d', 'm', 'Y']
        });
    } catch (err) {
        console.error(`Error initializing Cleave for ${selector}:`, err);
    }
});


// **------ 2 Time Input**

const timeInputs = [
    '.time-input',
    '.min-sec-input',
    '.hours-min-input'
];

timeInputs.forEach(selector => {
    try {
        new Cleave(selector, {
            time: true,
            timePattern: selector === '.min-sec-input' || selector === '.hours-min-input' ? ['h', 'm'] : ['h', 'm', 's']
        });
    } catch (err) {
        console.error(`Error initializing Cleave for ${selector}:`, err);
    }
});


//  **------ 3 Custom Input**

const customInputs = [
    { selector: '.contact-input', options: { numeral: true, delimiter: '-', blocks: [3, 3, 4] } },
    { selector: '.formatting-contact', options: { delimiters: ['(', ')', '(', ')', '(', ')'], blocks: [0, 3, 0, 3, 0, 4, 0], uppercase: true } },
    { selector: '.credit-input', options: { creditCard: true } },
    { selector: '.numeral-input', options: { numeral: true, numeralThousandsGroupStyle: 'thousand' } },
    { selector: '.price-input', options: { numeral: true, prefix: '$', signBeforePrefix: true } },
    { selector: '.price-formatting', options: { numeral: true, prefix: '€', tailPrefix: true } },
    { selector: '.prefix-input', options: { blocks: [6, 3, 3, 3], prefix: '253874' } },
    { selector: '.prefix-del-input', options: { prefix: 'PREFIX', delimiters: ['-', '-', '.'], blocks: [6, 3, 3, 3, 2], uppercase: true } }
];

customInputs.forEach(({ selector, options }) => {
    try {
        new Cleave(selector, options);
    } catch (err) {
        console.error(`Error initializing Cleave for ${selector}:`, err);
    }
});

