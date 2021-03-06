
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getDispatch, dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index';

class ${_Component} extends PureComponent {

    static propTypes = {
        name: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {};

        // 模板固定内容，可用于多个复用场景，无需关注
        this.dispatch = getDispatch(props.namespace || '${_Component}', props.dispatch);
    }

    componentWillMount() {

    }

    render() {
        const className = '${_component}';
        const componentTitle = '${_Component}';
        const {
            namespace = '${_Component}',
            [namespace]: props = {},
            name,
        } = this.props;

        const formatNameData = formatName(name);
        const text = props.text;

        return <IndexView text={text}
            className={className}
            name={formatNameData}
            title={componentTitle}
            dispatchChange={() => {
                this.dispatch(dispatchChange());
            }}
            dispatchAsyncChange={() => {
                this.dispatch(dispatchAsyncChange());
            }}
            dispatchPromiseChange={() => {
                this.dispatch(dispatchPromiseChange());
            }}
        />
    }
}

export default ${_Component};

