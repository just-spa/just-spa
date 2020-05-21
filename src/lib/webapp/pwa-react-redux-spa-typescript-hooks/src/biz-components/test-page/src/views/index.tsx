
import React, { useCallback } from 'react';
import { IndexViewProps } from '../index.d';

const Index = (props: IndexViewProps) => {
    const { text, name, dispatchChange, dispatchAsyncChange, title } = props;

    const changeFn = useCallback(() => {
        dispatchChange();
    }, [event]);

    const changeAsyncFn = useCallback(() => {
        dispatchAsyncChange();
    }, [event]);

    return <div>
        <h2>react-redux模板组件：{title}</h2>
        {text} {name}!
        <button onClick={changeFn}>同步dispatch</button>
        <button onClick={changeAsyncFn}>异步dispatch</button>
    </div>
}

export default Index;
