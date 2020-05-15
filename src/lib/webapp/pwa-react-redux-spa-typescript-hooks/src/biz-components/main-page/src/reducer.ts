

const MainPage = (state: object = {}, action: any) => {
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
