
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Index extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        const { text, name, dispatchChange, dispatchAsyncChange, dispatchPromiseChange, title } = this.props;

        return <div>
            <h2>react-redux模板组件：{title}</h2>
            {text} {name}!
            <button onClick={dispatchChange}>同步dispatch</button>
            <button onClick={dispatchAsyncChange}>异步dispatch</button>
            <button onClick={dispatchPromiseChange}>Promise dispatch</button>
        </div>
    }
}

export default Index;
