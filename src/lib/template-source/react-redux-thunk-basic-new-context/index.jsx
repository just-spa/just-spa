import React, { PureComponent } from 'react';
import { ReactReduxContext } from 'react-redux';
import PropTypes from 'prop-types';

import ${_Component} from './src/index';

import _reducer from './src/reducer';

import './src/index.less';

// ******外部使用示例，仅供展示用法示例，请修改*******
class _${_Component} extends PureComponent {
    // 必须要定义contextType，获取dispatch
    static contextType = ReactReduxContext

    constructor(props, context) {
        super(props, context)
        this.state = {}
        this.dispatch = this.context.store.dispatch
    }

    render() {
        return <div>
            <${_Component} {...this.props} dispatch={this.dispatch}/>
        </div>
    }
}

// default导出View，引入即可使用
export default _${_Component};

export const reducer = _reducer;

