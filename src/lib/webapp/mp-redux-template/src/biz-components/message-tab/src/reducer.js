const reducers = {
    MessageTab: (state = {}, action) => {
        switch (action.type) {
            case 'MessageTab':
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
};

export default reducers;