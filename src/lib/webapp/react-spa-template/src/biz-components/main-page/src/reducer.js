

const MainPage = (state = {}, action) => {
    switch (action.type) {
        case 'MainPage':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    MainPage
};
