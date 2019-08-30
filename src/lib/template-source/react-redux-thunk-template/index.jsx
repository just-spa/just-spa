// import { combineReducers } from 'redux';

import ${_Component} from './src/index';
import { generateReducers } from './src/reducer';
import './src/index.less';

// default导出View，引入即可使用
export default ${_Component};

// 导出reducer，外层依然从入口导出引用，嵌套复杂场景可使用combineReducers
export const reducer = generateReducers('${_Component}', 1);
