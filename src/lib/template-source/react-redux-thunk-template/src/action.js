import axios from 'axios';

// 同步dispatch操作
export const dispatchChange = () => (dispatch, getState, actionType) => {
    dispatch({
        type: actionType || 'change',
        data: {
            text: 'change'
        }
    });
};

// 异步dispatch操作
export const dispatchAsyncChange = () => (dispatch, getState, actionType) => {
    return axios({
        url: '/.build/${_component}/data/asyncData.json',
        method: 'get',
        params: {}
    }).then((res) => {
        dispatch({
            type: actionType || 'change',
            data: {
                text: res.data.text
            }
        });
    }, (err) => {
        dispatch({
            type: actionType || 'change',
            data: {
                text: 'error text'
            }
        });
    });
};

// 异步返回promise操作
export const dispatchPromiseChange = () => (dispatch, getState, actionType) => {
    return axios({
        url: '/.build/${_component}/data/asyncData.json',
        method: 'get',
        params: {}
    }).then((res) => {
        dispatch({
            type: actionType || 'change',
            data: {
                text: res.data.text
            }
        });
    }, (err) => {
        dispatch({
            type: actionType || 'change',
            data: {
                text: 'error text'
            }
        });
    });
};

