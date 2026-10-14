// **------clipboard**
const clipboard = (textId, event) => {
    const textElement = document.getElementById(textId);
    textElement.select();
    document.execCommand(event);
};

const copy = (textId) => {
    const text = document.getElementById(textId).innerText;
    const elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
};
