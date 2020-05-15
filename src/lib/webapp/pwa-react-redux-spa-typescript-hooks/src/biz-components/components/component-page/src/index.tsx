
import React from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';

const ComponentPage = (props: {
    name: string,
    text: string,
    dispatch: Function,
}) => {
    const className = 'component-page';
    const { name, text, dispatch } = props;

    const formatNameData: string = formatName(name);

    return <div className={className}>
        <h2>react-redux模板组件：ComponentPage</h2>
        {text} {formatNameData}!
        <button onClick={() => {
            dispatch(dispatchChange('MainPage'));
        }}>同步dispatch</button>
        <button onClick={() => {
            dispatch(dispatchAsyncChange('MainPage'));
        }}>异步dispatch</button>
    </div>
}

export default ComponentPage;
