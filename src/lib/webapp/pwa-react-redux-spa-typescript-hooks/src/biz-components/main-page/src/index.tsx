
import React, { useEffect, useMemo, useCallback, } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';
import { MainPageProps } from './typings';

import MainComponent from '../../../components/main-component/index';
import View from './views/index';

const MainPage = (props: MainPageProps) => {
    const className = 'main-page';
    const { dispatch, MainPage } = props;
    const { name, text } = MainPage;

    // 当name变化时，formatName才调用
    const formatNameData: string = useMemo(() => formatName(name), [name]);

    const dispatchFn = useCallback(() => {
        dispatch(dispatchChange('MainPage'));
    }, [event]);

    const dispatchAsyncFn = useCallback(() => {
        dispatch(dispatchAsyncChange('MainPage'));
    }, [event]);

    useEffect(() => {
        dispatch(dispatchChange('MainPage'));
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：MainPage</h2>
        {MainPage['text'] || text} {formatNameData}!
        <button onClick={dispatchFn}>同步dispatch</button>
        <button onClick={dispatchAsyncFn}>异步dispatch</button>
        <MainComponent text="MainPage"/>
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
