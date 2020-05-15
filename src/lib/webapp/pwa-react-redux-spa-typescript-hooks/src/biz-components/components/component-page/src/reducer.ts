

const ComponentPage = (state = {}, action) => {
    switch (action.type) {
        case 'ComponentPage':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    ComponentPage
};
