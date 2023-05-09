import { SCROLLING_SPEED } from '../constants';
export default class List {
    element;
    scrollPos;
    height;
    constructor({ element }) {
        this.element = element;
        this.scrollPos = this.element.scrollTop;
        this.height = this.element.offsetHeight;
    }
    clear() {
        this.element.innerHTML = '';
    }
    append(node) {
        this.element.appendChild(node);
    }
    getChild(selector) {
        return this.element.querySelector(selector);
    }
    hasChildren() {
        return this.element.hasChildNodes();
    }
    scrollToTop() {
        this.element.scrollTop = 0;
    }
    scrollToChildElement(element, direction) {
        if (!element) {
            return;
        }
        const listHeight = this.element.offsetHeight;
        // Scroll position of dropdown
        const listScrollPosition = this.element.scrollTop + listHeight;
        const elementHeight = element.offsetHeight;
        // Distance from bottom of element to top of parent
        const elementPos = element.offsetTop + elementHeight;
        // Difference between the element and scroll position
        const destination = direction > 0
            ? this.element.scrollTop + elementPos - listScrollPosition
            : element.offsetTop;
        requestAnimationFrame(() => {
            this._animateScroll(destination, direction);
        });
    }
    _scrollDown(scrollPos, strength, destination) {
        const easing = (destination - scrollPos) / strength;
        const distance = easing > 1 ? easing : 1;
        this.element.scrollTop = scrollPos + distance;
    }
    _scrollUp(scrollPos, strength, destination) {
        const easing = (scrollPos - destination) / strength;
        const distance = easing > 1 ? easing : 1;
        this.element.scrollTop = scrollPos - distance;
    }
    _animateScroll(destination, direction) {
        const strength = SCROLLING_SPEED;
        const choiceListScrollTop = this.element.scrollTop;
        let continueAnimation = false;
        if (direction > 0) {
            this._scrollDown(choiceListScrollTop, strength, destination);
            if (choiceListScrollTop < destination) {
                continueAnimation = true;
            }
        }
        else {
            this._scrollUp(choiceListScrollTop, strength, destination);
            if (choiceListScrollTop > destination) {
                continueAnimation = true;
            }
        }
        if (continueAnimation) {
            requestAnimationFrame(() => {
                this._animateScroll(destination, direction);
            });
        }
    }
}
