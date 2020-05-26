
import { Action } from './typings';

const MainPage = (state: object = {}, action: Action) => {
    switch (action.type) {
        case 'MainPage':
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

export default {
    MainPage,
};
