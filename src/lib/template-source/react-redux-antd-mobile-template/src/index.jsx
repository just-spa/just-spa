
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, WhiteSpace, WingBlank, Flex, InputItem, Toast, Modal } from 'antd-mobile';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';

class ${_Component} extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
    }

    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    render() {
        const className = '${_component}';

        const formatNameData = formatName(this.props.name);

        return <div className={className}>
            <h2>react-redux模板组件：${_Component}</h2>
            <WhiteSpace />
            模板
            {this.props.text} {formatNameData}!
            <button onClick={() => {
                dispatchChange.bind(this)('${_Component}');
            }}>同步dispatch</button>
            <button onClick={() => {
                dispatchAsyncChange.bind(this)('${_Component}');
            }}>异步dispatch</button>
            <button onClick={() => {
                dispatchPromiseChange.bind(this)('${_Component}');
            }}>Promise dispatch</button>
        </div>
    }
}

export default ${_Component};
