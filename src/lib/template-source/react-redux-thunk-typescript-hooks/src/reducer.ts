
import { Action } from './typings';

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
