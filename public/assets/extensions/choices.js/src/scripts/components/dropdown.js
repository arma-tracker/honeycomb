export default class Dropdown {
    element;
    type;
    classNames;
    isActive;
    constructor({ element, type, classNames, }) {
        this.element = element;
        this.classNames = classNames;
        this.type = type;
        this.isActive = false;
    }
    /**
     * Bottom position of dropdown in viewport coordinates
     */
    get distanceFromTopWindow() {
        return this.element.getBoundingClientRect().bottom;
    }
    getChild(selector) {
        return this.element.querySelector(selector);
    }
    /**
     * Show dropdown to user by adding active state class
     */
    show() {
        this.element.classList.add(this.classNames.activeState);
        this.element.setAttribute('aria-expanded', 'true');
        this.isActive = true;
        return this;
    }
    /**
     * Hide dropdown from user
     */
    hide() {
        this.element.classList.remove(this.classNames.activeState);
        this.element.setAttribute('aria-expanded', 'false');
        this.isActive = false;
        return this;
    }
}
