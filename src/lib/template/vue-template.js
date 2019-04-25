
module.exports = function reactTemplate(componentName) {
    return `// 引入组件
import Component from './${componentName}/entry';
import template from './${componentName}/template';
import './${componentName}/style';

if (document.getElementById('template')) {
    document.getElementById('template').outerHTML = template;
}

render(Component);

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

function render(Component) {
    Component();
}

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