
module.exports = function reactReduxTemplate(componentName) {
    return `import React from 'react';
import ReactDOM from 'react-dom';

import {applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';

// 支持redux调试
import { composeWithDevTools } from 'redux-devtools-extension';

import { Route, Switch, Link } from 'react-router-dom';

import {AppContainer} from 'react-hot-loader';

// 引入组件
import Component from './${componentName}/entry';
import {
    reducer,
} from './${componentName}/index';

import './${componentName}/style';

let initStore = require('./${componentName}/data').default || {};

let middlewares = [reduxThunk, reduxPromise];
let initReducers = reducer;

// 如果有多个则使用combineReducers
if (typeof(reducer) === 'object') {
    initReducers = combineReducers(reducer);
}

const store = createStore(initReducers, initStore, composeWithDevTools(applyMiddleware(...middlewares)));

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render((
        <AppContainer>
            <Provider store={store}>
                {Component}
            </Provider>
        </AppContainer>
    ), document.getElementById('root'));
};

/**
 * 用于从调试页面中注入store数据
 * 
 * @param {any} actionType 
 * @param {any} data 
 * @param {any} storeKey 
 */
window.dispatchData = function(actionType, data, storeKey) {

    // 将调试的data dispatch到组件关联的store
    const actionCreator = (actionType) => {
        return (dispatch, getState) => {
            dispatch({
                type: actionType,
                data: storeKey ? {
                    [storeKey] : data
                } : data
            });
        };
    }

    store.dispatch(actionCreator(actionType));

    // 将最终的store结果反馈给父页面
    parent.window.reflectStore(store);
}

/**
 * 用于从调试页面中注入mock规则
 * 
 * @param {any} mockDataSet 
 */
window.setMockData = function(mockDataSet, callback) {
    if (Mock) {
        for (let mockRule in mockDataSet) {
            Mock.mock(new RegExp(mockRule, 'ig'), mockDataSet[mockRule].mockType, mockDataSet[mockRule].mockData);
        }
        callback && callback();
    }
}

/**
 * 用于从调试页面中移除所有规则
 * 
 * @param {any} key 
 * @param {any} callback 
 */
window.removeMockData = function(callback, key) {

    if (Mock && key) {
        delete Mock._mocked[key];
    } else if(Mock) {
        Mock._mocked = {};
    }
    callback && callback();
}

render(Component);

// 进行热替换调试组件内容
if (module.hot && process.env.NODE_ENV !== 'production') {

    module.hot.accept([
        './${componentName}/index',
        './${componentName}/entry'
    ], (err) => {
        if (err) {
            console.log(err);
        }
        const NextComponent = require('./${componentName}/entry').default;

        render(NextComponent);
    });
};`

}