

const Header = (state = {}, action) => {
    switch (action.type) {
        case 'Header':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    Header
};
