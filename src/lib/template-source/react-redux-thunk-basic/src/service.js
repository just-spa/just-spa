

import {
    dispatchChange as _dispatchChange,
    dispatchAsyncChange as _dispatchAsyncChange,
    dispatchPromiseChange as _dispatchPromiseChange,
} from './action';

/**
 * 对外提供的service, 仅供外部使用
 *
 * @param {*} namespace actionsType,对应reducer
 * @param {*} getState params，和调actions传的参数
 * @returns
 */
export const dispatchChange = (namespace, ...params) =>  (dispatch, getState) => {
    return dispatch(_dispatchChange(...params));
}

/**
 * 对外提供的service, 仅供外部使用
 *
 * @param {*} namespace actionsType,对应reducer
 * @param {*} getState params，和调actions传的参数
 * @returns
 */
export const dispatchAsyncChange = (namespace, ...params) =>  (dispatch, getState) => {
    return dispatch(_dispatchAsyncChange(...params));
}

/**
 * 对外提供的service, 仅供外部使用
 *
 * @param {*} namespace actionsType,对应reducer
 * @param {*} getState params，和调actions传的参数
 * @returns
 */
export const dispatchPromiseChange = (namespace, ...params) =>  (dispatch, getState) => {
    return dispatch(_dispatchPromiseChange(...params));
}
