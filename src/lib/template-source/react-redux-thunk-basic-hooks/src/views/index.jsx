
import React from 'react';
import PropTypes from 'prop-types';

const Index = (props) => {
    const { text, name, dispatchChange, dispatchAsyncChange, dispatchPromiseChange, title, label } = props;

    return <div>
        <h2>react-redux模板组件：{title}</h2>
        {label} {text} {name}!
        <button onClick={dispatchChange}>同步dispatch</button>
        <button onClick={dispatchAsyncChange}>异步dispatch</button>
        <button onClick={dispatchPromiseChange}>Promise dispatch</button>
    </div>
}

Index.propTypes = {
    text: PropTypes.string,
    name: PropTypes.string
};

export default React.memo(Index);