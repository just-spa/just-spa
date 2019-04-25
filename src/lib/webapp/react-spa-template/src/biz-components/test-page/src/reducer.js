

const TestPage = (state = {}, action) => {
    switch (action.type) {
        case 'TestPage':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    TestPage
};
