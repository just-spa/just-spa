
import React, { useEffect, useState } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';

import ComponentPage from '../../components/component-page/index';
import View from './views/index';

const MainPage = (props: {
    MainPage: any,
    dispatch: Function,
}) => {
    const className = 'main-page';
    const { dispatch, MainPage } = props;
    const { name, text } = MainPage;

    const formatNameData: string = formatName(name);

    useEffect(() => {
        dispatch(dispatchChange('MainPage'));
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：MainPage</h2>
        {MainPage['text'] || text} {formatNameData}!
        <button onClick={() => {
            dispatch(dispatchChange('MainPage'));
        }}>同步dispatch</button>
        <button onClick={() => {
            dispatch(dispatchAsyncChange('MainPage'));
        }}>异步dispatch</button>
        <ComponentPage dispatch={dispatch} name={name} text={text}/>
        <View name={name}
            text={text}
            title="MainPage"
            dispatchChange={() => {
                dispatch(dispatchChange('MainPage'));
            }}
            dispatchAsyncChange={() => {
                dispatch(dispatchAsyncChange('MainPage'));
            }}/>
    </div>
}

export default MainPage;
