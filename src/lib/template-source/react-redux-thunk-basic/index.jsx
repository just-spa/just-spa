import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ${_Component} from './src/index';

import _reducer from './src/reducer';

import './src/index.less';

// ******外部使用示例，仅供展示用法示例，请修改*******
class _${_Component} extends PureComponent {
    // 必须要定义contextType，获取dispatch
    static contextTypes = {
        store: PropTypes.object
    }
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
export default _${_Component};

export const reducer = _reducer;

