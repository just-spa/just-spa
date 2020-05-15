
import {
    dispatchChange as _dispatchChange,
    dispatchAsyncChange as _dispatchAsyncChange,
} from './action';

// 需要对外复用的模块
export const dispatchChange = _dispatchChange;
export const dispatchAsyncChange = _dispatchAsyncChange;