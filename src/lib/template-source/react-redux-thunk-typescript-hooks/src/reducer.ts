
import { Action } from './index.d';

const ${_Component} = (state: object = {}, action: Action) => {
    switch (action.type) {
        case '${_Component}':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    ${_Component},
};
