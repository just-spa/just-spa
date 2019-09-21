// import { combineReducers } from 'redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ${_Component} from './src/index';
import { generateReducers } from './src/reducer';
import './src/index.less';



// 可参考下面注释中的代码适应复用的场景，外层添加的reducer个数设置为多个即可
class ${_Component}s extends PureComponent {
    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const dispatch = this.context.store.dispatch;
        return <div>
            <${_Component} {...this.props} dispatch={dispatch}/>
            <${_Component} {...this.props} dispatch={dispatch}/>
            <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName1"/>
            <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName2"/>
            <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName3"/>
        </div>
    }
}

// default导出View，引入即可使用
export default ${_Component}s;

// 导出reducer，外层依然从入口导出引用，嵌套复杂场景可使用combineReducers
export const reducer = generateReducers(['${_Component}', 'reducerName1', 'reducerName2', 'reducerName3']);

