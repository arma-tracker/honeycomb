/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const generateChars = (length) => Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');
export const generateId = (element, prefix) => {
    let id = element.id ||
        (element.name && `${element.name}-${generateChars(2)}`) ||
        generateChars(4);
    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = `${prefix}-${id}`;
    return id;
};
export const getType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);
export const isType = (type, obj) => obj !== undefined && obj !== null && getType(obj) === type;
export const wrap = (element, wrapper = document.createElement('div')) => {
    if (element.parentNode) {
        if (element.nextSibling) {
            element.parentNode.insertBefore(wrapper, element.nextSibling);
        }
        else {
            element.parentNode.appendChild(wrapper);
        }
    }
    return wrapper.appendChild(element);
};
export const getAdjacentEl = (startEl, selector, direction = 1) => {
    const prop = `${direction > 0 ? 'next' : 'previous'}ElementSibling`;
    let sibling = startEl[prop];
    while (sibling) {
        if (sibling.matches(selector)) {
            return sibling;
        }
        sibling = sibling[prop];
    }
    return sibling;
};
export const isScrolledIntoView = (element, parent, direction = 1) => {
    if (!element) {
        return false;
    }
    let isVisible;
    if (direction > 0) {
        // In view from bottom
        isVisible =
            parent.scrollTop + parent.offsetHeight >=
                element.offsetTop + element.offsetHeight;
    }
    else {
        // In view from top
        isVisible = element.offsetTop >= parent.scrollTop;
    }
    return isVisible;
};
export const sanitise = (value) => {
    if (typeof value !== 'string') {
        return value;
    }
    return value
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&rt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;');
};
export const strToEl = (() => {
    const tmpEl = document.createElement('div');
    return (str) => {
        const cleanedInput = str.trim();
        tmpEl.innerHTML = cleanedInput;
        const firldChild = tmpEl.children[0];
        while (tmpEl.firstChild) {
            tmpEl.removeChild(tmpEl.firstChild);
        }
        return firldChild;
    };
})();
export const sortByAlpha = ({ value, label = value }, { value: value2, label: label2 = value2 }) => label.localeCompare(label2, [], {
    sensitivity: 'base',
    ignorePunctuation: true,
    numeric: true,
});
export const sortByScore = (a, b) => {
    const { score: scoreA = 0 } = a;
    const { score: scoreB = 0 } = b;
    return scoreA - scoreB;
};
export const dispatchEvent = (element, type, customArgs = null) => {
    const event = new CustomEvent(type, {
        detail: customArgs,
        bubbles: true,
        cancelable: true,
    });
    return element.dispatchEvent(event);
};
export const existsInArray = (array, value, key = 'value') => array.some((item) => {
    if (typeof value === 'string') {
        return item[key] === value.trim();
    }
    return item[key] === value;
});
export const cloneObject = (obj) => JSON.parse(JSON.stringify(obj));
/**
 * Returns an array of keys present on the first but missing on the second object
 */
export const diff = (a, b) => {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return aKeys.filter((i) => bKeys.indexOf(i) < 0);
};
