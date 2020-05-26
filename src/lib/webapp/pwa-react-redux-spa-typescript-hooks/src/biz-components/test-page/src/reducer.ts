import { Action } from './typings';

const TestPage = (state: object = {}, action: Action) => {
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
