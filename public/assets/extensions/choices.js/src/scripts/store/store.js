/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from 'redux';
import rootReducer from '../reducers/index';
export default class Store {
    _store;
    constructor() {
        this._store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__());
    }
    /**
     * Subscribe store to function call (wrapped Redux method)
     */
    subscribe(onChange) {
        this._store.subscribe(onChange);
    }
    /**
     * Dispatch event to store (wrapped Redux method)
     */
    dispatch(action) {
        this._store.dispatch(action);
    }
    /**
     * Get store object (wrapping Redux method)
     */
    get state() {
        return this._store.getState();
    }
    /**
     * Get items from store
     */
    get items() {
        return this.state.items;
    }
    /**
     * Get active items from store
     */
    get activeItems() {
        return this.items.filter((item) => item.active === true);
    }
    /**
     * Get highlighted items from store
     */
    get highlightedActiveItems() {
        return this.items.filter((item) => item.active && item.highlighted);
    }
    /**
     * Get choices from store
     */
    get choices() {
        return this.state.choices;
    }
    /**
     * Get active choices from store
     */
    get activeChoices() {
        return this.choices.filter((choice) => choice.active === true);
    }
    /**
     * Get selectable choices from store
     */
    get selectableChoices() {
        return this.choices.filter((choice) => choice.disabled !== true);
    }
    /**
     * Get choices that can be searched (excluding placeholders)
     */
    get searchableChoices() {
        return this.selectableChoices.filter((choice) => choice.placeholder !== true);
    }
    /**
     * Get placeholder choice from store
     */
    get placeholderChoice() {
        return [...this.choices]
            .reverse()
            .find((choice) => choice.placeholder === true);
    }
    /**
     * Get groups from store
     */
    get groups() {
        return this.state.groups;
    }
    /**
     * Get active groups from store
     */
    get activeGroups() {
        const { groups, choices } = this;
        return groups.filter((group) => {
            const isActive = group.active === true && group.disabled === false;
            const hasActiveOptions = choices.some((choice) => choice.active === true && choice.disabled === false);
            return isActive && hasActiveOptions;
        }, []);
    }
    /**
     * Get loading state from store
     */
    isLoading() {
        return this.state.loading;
    }
    /**
     * Get single choice by it's ID
     */
    getChoiceById(id) {
        return this.activeChoices.find((choice) => choice.id === parseInt(id, 10));
    }
    /**
     * Get group by group id
     */
    getGroupById(id) {
        return this.groups.find((group) => group.id === id);
    }
}
