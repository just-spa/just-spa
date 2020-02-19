const reducers = {
    AccountTab: (state = {}, action) => {
        switch (action.type) {
            case 'AccountTab':
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
};

export default reducers;