
import {
    changeName as _changeName,
    asyncChangeName as _asyncChangeName,
} from './action';

// service仅用于对其它组件提供内部功能接口
export const changeName = _changeName;
export const asyncChangeName = _asyncChangeName;
