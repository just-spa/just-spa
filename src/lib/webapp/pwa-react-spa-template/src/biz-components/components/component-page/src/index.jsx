
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';

class ComponentPage extends PureComponent {

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
        const className = 'component-page';

        const formatNameData = formatName(this.props.name);

        return <div className={className}>
            <h2>react-redux模板组件：ComponentPage</h2>
            {this.props.text} {formatNameData}!
            <button onClick={() => {
                dispatchChange.bind(this)('ComponentPage');
            }}>同步dispatch</button>
            <button onClick={() => {
                dispatchAsyncChange.bind(this)('ComponentPage');
            }}>异步dispatch</button>
            <button onClick={() => {
                dispatchPromiseChange.bind(this)('ComponentPage');
            }}>Promise dispatch</button>
        </div>
    }
}

export default ComponentPage;
