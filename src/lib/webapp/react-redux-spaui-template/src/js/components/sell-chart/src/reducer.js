

const SellChart = (state = {}, action) => {
    switch (action.type) {
        case 'SellChart':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    SellChart
};
