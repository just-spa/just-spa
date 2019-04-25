

const SideNavMenu = (state = {}, action) => {
    switch (action.type) {
        case 'SideNavMenu':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    SideNavMenu
};
