
module.exports = function reactTemplate(componentName) {
    return `import React from 'react';
import ReactDOM from 'react-dom';

import {AppContainer} from 'react-hot-loader';

// 引入组件
import Component from './${componentName}/entry';
import './${componentName}/style';

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render((
        <AppContainer>
            {Component}
        </AppContainer>
    ), document.getElementById('root'));
};

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