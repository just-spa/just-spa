
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Index extends PureComponent {

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
        const { text, name, dispatchChange, dispatchAsyncChange, dispatchPromiseChange } = this.props;

        return <div>
            <h2>react-redux模板组件：${_Component}</h2>
            {text} {name}!
            <button onClick={dispatchChange}>同步dispatch</button>
            <button onClick={dispatchAsyncChange}>异步dispatch</button>
            <button onClick={dispatchPromiseChange}>Promise dispatch</button>
        </div>
    }
}

export default Index;
