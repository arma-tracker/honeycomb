export const defaultState = false;
const general = (state = defaultState, action = {}) => {
    switch (action.type) {
        case 'SET_IS_LOADING': {
            return action.isLoading;
        }
        default: {
            return state;
        }
    }
};
export default general;
