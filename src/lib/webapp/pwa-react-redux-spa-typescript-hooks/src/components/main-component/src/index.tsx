
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { addValue } from './events';
import { formatName, formatText } from './data-adapter';
import { MainComponentProps } from './index.d';

const MainComponent = (props: MainComponentProps) => {
    const className = 'main-component';

    const { text: initText } = props;

    const [text, useText]: [string, Function] = useState(initText || '');
    const [value, useValue]: [number, Function] = useState(0);

    const formatedText: string = useMemo(() => formatText(text), [text]);

    const addValueFn = useCallback((event) => {
        useValue(addValue(value));
    }, [event]);

    const changeTextFn = useCallback((event) => {
        useText(formatText(text));
    }, [event]);

    // 该表一次值值
    useEffect(() => {
        useText(formatedText);
        useValue(1);
    }, []);

    return <div className={className}>
        <h2>react-hooks模板组件：MainComponent</h2>
        <div>
            值: {value}
            <button onClick={addValueFn}>增加</button>
        </div>
        <div>
            {formatName(text)}
            <button onClick={changeTextFn}>改变文本</button>
        </div>
    </div>
}

export default MainComponent;
