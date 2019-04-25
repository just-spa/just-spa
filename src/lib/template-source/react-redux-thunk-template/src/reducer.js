

const ${_Component} = (state = {}, action) => {
    switch (action.type) {
        case '${_Component}':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    ${_Component}
};


