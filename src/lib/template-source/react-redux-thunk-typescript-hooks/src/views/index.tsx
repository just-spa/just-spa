
import React from 'react';

const Index = (props: {
    title: string,
    name: string,
    text: string,
    dispatchChange: any,
    dispatchAsyncChange: any,
}) => {
    const { text, name, dispatchChange, dispatchAsyncChange, title } = props;

    return <div>
        <h2>react-redux模板组件：{title}</h2>
        {text} {name}!
        <button onClick={dispatchChange}>同步dispatch</button>
        <button onClick={dispatchAsyncChange}>异步dispatch</button>
    </div>
}

export default Index;
