

const Dashboard = (state = {}, action) => {
    switch (action.type) {
        case 'Dashboard':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    Dashboard
};
