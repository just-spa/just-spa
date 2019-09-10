// import { combineReducers } from 'redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ${_Component} from './src/index';
import { generateReducers } from './src/reducer';
import './src/index.less';

// ******外部使用示例，仅供展示用法示例，请修改*******
class ${_Component}s extends PureComponent {
    // 必须要定义contextType，获取dispatch
    static contextTypes = {
        store: PropTypes.object
    }
    // 必须要定义contextType，否则无法获取Provider的context
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const dispatch = this.context.store.dispatch
        return <div>
            <${_Component} {...this.props} dispatch={dispatch}/>
        </div>
    }
}

// default导出View，引入即可使用
export default ${_Component}s;



// 导出reducer，外层依然从入口导出引用，嵌套复杂场景可使用combineReducers
export const reducer = generateReducers(['${_Component}', 'reducerName1', 'reducerName2', 'reducerName3']);

