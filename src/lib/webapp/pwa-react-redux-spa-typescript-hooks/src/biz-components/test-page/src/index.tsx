
import React, { useEffect, useState } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';

import ComponentPage from '../../components/component-page/index';
import View from './views/index';

const TestPage = (props: {
    TestPage: any,
    dispatch: Function,
}) => {
    const className = 'test-page';
    const { dispatch, TestPage } = props;
    const { name, text } = TestPage;

    const formatNameData: string = formatName(name);

    useEffect(() => {
        dispatch(dispatchChange('TestPage'));
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：TestPage</h2>
        {TestPage['text'] || text} {formatNameData}!
        <button onClick={() => {
            dispatch(dispatchChange('TestPage'));
        }}>同步dispatch</button>
        <button onClick={() => {
            dispatch(dispatchAsyncChange('TestPage'));
        }}>异步dispatch</button>
        <ComponentPage dispatch={dispatch} name={name} text={text}/>
        <View name={name}
            text={text}
            title="TestPage"
            dispatchChange={() => {
                dispatch(dispatchChange('TestPage'));
            }}
            dispatchAsyncChange={() => {
                dispatch(dispatchAsyncChange('TestPage'));
            }}/>
    </div>
}

export default TestPage;
