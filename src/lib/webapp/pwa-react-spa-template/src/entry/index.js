import React from 'react';
import ReactDOM from 'react-dom';

import IndexPage from '../containers/IndexPage';

// 直接引用组件的用法
const render = (Component) => {
    ReactDOM.render(<Component/>, document.getElementById('pageRoot'));
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
