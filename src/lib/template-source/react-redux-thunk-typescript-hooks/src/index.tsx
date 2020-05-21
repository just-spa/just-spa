
import React, { useEffect, useMemo, useCallback, } from 'react';

import { dispatchChange, dispatchAsyncChange } from './action';
import { formatName } from './data-adapter';
import { ${_Component}Props } from './index.d';

import MainComponent from '../../../components/main-component/index';
import View from './views/index';

const ${_Component} = (props: ${_Component}Props) => {
    const className = '${_component}';
    const { dispatch, ${_Component} } = props;
    const { name, text } = ${_Component};

    // 当name变化时，formatName才调用
    const formatNameData: string = useMemo(() => formatName(name), [name]);

    const dispatchFn = useCallback(() => {
        dispatch(dispatchChange('${_Component}'));
    }, [event]);

    const dispatchAsyncFn = useCallback(() => {
        dispatch(dispatchAsyncChange('${_Component}'));
    }, [event]);

    useEffect(() => {
        dispatch(dispatchChange('${_Component}'));
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：${_Component}</h2>
        {${_Component}['text'] || text} {formatNameData}!
        <button onClick={dispatchFn}>同步dispatch</button>
        <button onClick={dispatchAsyncFn}>异步dispatch</button>
        <MainComponent text="${_Component}"/>
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
