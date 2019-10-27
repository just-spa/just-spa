
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index';

class ${_Component} extends PureComponent {

    static propTypes = {
        name: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {};
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
            dispatch,
        } = this.props;

        const formatNameData = formatName(name);
        const text = props.text;

        return <IndexView text={text}
            className={className}
            name={formatNameData}
            title={componentTitle}
            dispatchChange={() => {
                dispatch(dispatchChange());
            }}
            dispatchAsyncChange={() => {
                dispatch(dispatchAsyncChange());
            }}
            dispatchPromiseChange={() => {
                dispatch(dispatchPromiseChange());
            }}
        />
    }
}

export default ${_Component};

