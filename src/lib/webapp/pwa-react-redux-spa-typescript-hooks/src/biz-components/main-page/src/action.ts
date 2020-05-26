
import axios from 'axios';
import { APIRespData } from './typings';

/**
 * 异步dispatch实例
 *
 * @param {string} actionType
 */
const _dispatchAsyncChange = (): Promise<APIRespData> => {
    return new Promise((resolve: Function, reject: Function) => {
        return axios({
            url: '/.build/main-page/data/asyncData.json',
            method: 'get',
            params: {}
        }).then((res: object) => {
            resolve(res);
        }, (err: object) => {
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
            name: 'how are you',
        }
    });
};

/**
 * 异步请求数据
 *
 * @param {string} actionType
 */
export const dispatchAsyncChange = (actionType: string) => async (dispatch: Function) => {
    const resData: APIRespData = await _dispatchAsyncChange();
    let actionData: object = {};

    if (resData.code == 0) {
        actionData = {
            text: resData.data.text,
            name: 'how are you',
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