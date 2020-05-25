
import React from 'react';
import { IndexViewProps } from '../typings';

const Index = (props: IndexViewProps) => {
    const { text, name, dispatchChange, dispatchAsyncChange, title } = props;

    return <div>
        <h2>react-redux模板组件：{title}</h2>
        {text} {name}!
        <button onClick={() => {
            dispatchChange();
        }}>同步dispatch</button>
        <button onClick={() => {
            dispatchAsyncChange();
        }}>异步dispatch</button>
    </div>
}

export default Index;
