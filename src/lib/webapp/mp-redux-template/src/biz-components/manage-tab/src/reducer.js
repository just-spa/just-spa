const reducers = {
    ManageTab: (state = {}, action) => {
        switch (action.type) {
            case 'ManageTab':
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
};

export default reducers;