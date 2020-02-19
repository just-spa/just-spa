import { applyMiddleware, createStore, combineReducers } from './libs/redux';
import reduxThunk from './libs/redux-thunk';

import reducers from './reducers/index';

let store = null;

export const initStore = (initData = {}) => {
    store = createStore(combineReducers(reducers), initData, applyMiddleware(...[reduxThunk]));
    return store;
}

export const useDispatch = () => {
    return store.dispatch;
}
