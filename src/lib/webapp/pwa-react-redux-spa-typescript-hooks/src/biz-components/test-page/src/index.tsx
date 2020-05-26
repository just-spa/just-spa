
import React, { useEffect, useMemo, useCallback } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';
import { TestPageProps } from './typings';

import TestComponent from '../../../components/test-component/index';
import View from './views/index';

const TestPage = (props: TestPageProps) => {
    const className = 'test-page';
    const { dispatch, TestPage } = props;
    const { name, text } = TestPage;

    // 当name变化时，formatName才调用
    const formatNameData: string = useMemo(() => formatName(name), [name]);

    useEffect(() => {
        dispatch(dispatchChange('TestPage'));
    }, []);

    const dispatchFn = useCallback((event) => {
        dispatch(dispatchChange('TestPage'));
    }, [event]);

    const dispatchAsyncFn = useCallback((event) => {
        dispatch(dispatchAsyncChange('TestPage'));
    }, [event]);

    return <div className={className}>
        <h2>react-redux模板组件：TestPage</h2>
        {TestPage['text'] || text} {formatNameData}!
        <button onClick={dispatchFn}>同步dispatch</button>
        <button onClick={dispatchAsyncFn}>异步dispatch</button>
        <TestComponent text="TestPage"/>
        <View name={name}
            text={text}
            title="TestPage"
            dispatchChange={dispatchFn}
            dispatchAsyncChange={dispatchAsyncFn}/>
    </div>
}

export default TestPage;
