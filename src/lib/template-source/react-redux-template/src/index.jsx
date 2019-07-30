
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index'

class ${_Component} extends PureComponent {

    static propTypes = {
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

        return <IndexView text={this.props.${_Component}.text}
            name={formatNameData}
            dispatchChange={() => {
                dispatchChange.bind(this)('${_Component}');
            }}
            dispatchAsyncChange={() => {
                dispatchAsyncChange.bind(this)('${_Component}');
            }}
            dispatchPromiseChange={() => {
                dispatchPromiseChange.bind(this)('${_Component}');
            }}
        />
    }
}

export default ${_Component};
