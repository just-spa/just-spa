const reducers = {
    IndexTab: (state = {}, action) => {
        switch (action.type) {
            case 'IndexTab':
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
};

export default reducers;