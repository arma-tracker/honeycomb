import WrappedElement from './wrapped-element';
export default class WrappedInput extends WrappedElement {
    element;
    delimiter;
    constructor({ element, classNames, delimiter, }) {
        super({ element, classNames });
        this.delimiter = delimiter;
    }
    get value() {
        return this.element.value;
    }
    set value(value) {
        this.element.setAttribute('value', value);
        this.element.value = value;
    }
}
