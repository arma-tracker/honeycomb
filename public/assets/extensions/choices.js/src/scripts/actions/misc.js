import { ACTION_TYPES } from '../constants';
export const clearAll = () => ({
    type: ACTION_TYPES.CLEAR_ALL,
});
export const resetTo = (state) => ({
    type: ACTION_TYPES.RESET_TO,
    state,
});
export const setIsLoading = (isLoading) => ({
    type: ACTION_TYPES.SET_IS_LOADING,
    isLoading,
});
