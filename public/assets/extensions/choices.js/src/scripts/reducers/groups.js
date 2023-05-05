export const defaultState = [];
export default function groups(state = defaultState, action = {}) {
    switch (action.type) {
        case 'ADD_GROUP': {
            const addGroupAction = action;
            return [
                ...state,
                {
                    id: addGroupAction.id,
                    value: addGroupAction.value,
                    active: addGroupAction.active,
                    disabled: addGroupAction.disabled,
                },
            ];
        }
        case 'CLEAR_CHOICES': {
            return [];
        }
        default: {
            return state;
        }
    }
}
