

const SearchProduct = (state = {}, action) => {
    switch (action.type) {
        case 'SearchProduct':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    SearchProduct
};
