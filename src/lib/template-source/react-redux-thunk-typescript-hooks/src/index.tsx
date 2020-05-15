
import React, { useEffect } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';

import View from './views/index';

const ${_Component} = (props: {
    ${_Component}: any,
    dispatch: Function,
}) => {
    const className = '${_component}';
    const { dispatch, ${_Component} } = props;
    const { name, text } = ${_Component};

    const formatNameData: string = formatName(name);

    useEffect(() => {
        dispatch(dispatchChange('${_Component}'));
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：${_Component}</h2>
        {${_Component}['text'] || text} {formatNameData}!
        <button onClick={() => {
            dispatch(dispatchChange('${_Component}'));
        }}>同步dispatch</button>
        <button onClick={() => {
            dispatch(dispatchAsyncChange('${_Component}'));
        }}>异步dispatch</button>
        <View name={name}
            text={text}
            title="${_Component}"
            dispatchChange={() => {
                dispatch(dispatchChange('${_Component}'));
            }}
            dispatchAsyncChange={() => {
                dispatch(dispatchAsyncChange('${_Component}'));
            }}/>
    </div>
}

export default ${_Component};
