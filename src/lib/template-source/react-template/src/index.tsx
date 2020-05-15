
import React, { useEffect, useState } from 'react';
import { addValue } from './events';
import { formatName, formatText } from './data-adapter'; 

const ${_Component} = (props: any) => {
    const className = '${_component}';

    const [text, useText]: [string, Function] = useState('');
    const [value, useValue]: [number, Function] = useState(0);

    // 该表一次值值
    useEffect(() => {
        useText(formatText('init text'));
        useValue(1);
    }, []);

    return <div className={className}>
        <h2>react-redux模板组件：${_Component}</h2>
        <div>
            值: {value}
            <button onClick={() => {
                useValue(addValue(value));
            }}>增加</button>
        </div>
        <div>
            {formatName(text)}
            <button onClick={() => {
                useText(formatText(text));
            }}>改变文本</button>
        </div>
    </div>
}

export default ${_Component};
