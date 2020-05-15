
import axios from 'axios';

/**
 * 异步dispatch实例
 *
 * @param {string} actionType
 */
const _dispatchAsyncChange = () => {
    return new Promise((resolve, reject) => {
        return axios({
            url: '/.build/main-page/data/asyncData.json',
            method: 'get',
            params: {}
        }).then(resolve, (err) => {
            resolve({
                code: -1,
                err,
            });
        });
    })
};

/**
 * 同步dispatch实例
 *
 * @param {string} actionType
 */
export const dispatchChange = (actionType: string, actionData?: object) => (dispatch: Function) => {
    dispatch({
        type: actionType || 'change',
        data: actionData || {
            text: 'change',
            name: 'ouven',
        }
    });
};

/**
 * 异步请求数据
 *
 * @param {string} actionType
 */
export const dispatchAsyncChange = (actionType: string) => async (dispatch: Function) => {
    const resData: any = await _dispatchAsyncChange();
    let actionData: object = {};

    if (resData.code == 0) {
        actionData = {
            text: resData.data.text,
            name: 'ouven',
        };
    } else {
        actionData = {
            text: 'error text',
            name: 'god',
        }
    }
    dispatch({
        type: actionType,
        data: actionData,
    });
};