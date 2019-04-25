import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// 支持redux调试
import { composeWithDevTools } from 'redux-devtools-extension';

import IndexPage from '../containers/IndexPage';
import reducers from '../reducers';

// 去掉注释开启数据联调模式
// import Mock from '../mock/index.js';

let initStore = {};

const store = createStore(combineReducers(reducers), initStore, composeWithDevTools());

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render((
        <Provider store={store}>
            <Component/>
        </Provider>
    ), document.getElementById('pageRoot'));
};

render(IndexPage);

// 进行热替换调试组件内容
if (module.hot && process.env.NODE_ENV !== 'production') {

    module.hot.accept([
        '../containers/IndexPage'
    ], (err) => {
        if (err) {
            console.log(err);
        }
        const NextComponent = require('../containers/IndexPage').default;

        render(NextComponent);
    });
}
