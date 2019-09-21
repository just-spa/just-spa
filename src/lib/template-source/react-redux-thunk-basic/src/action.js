import axios from 'axios';

// 同步dispatch操作
export const dispatchChange = () => (dispatch, getState) => {
    dispatch({
        type: '${_Component}',
        data: {
            text: 'change'
        }
    });
}

// 异步dispatch操作
export const dispatchAsyncChange = () => (dispatch, getState) => {
    return axios({
        url: '/.build/${_component}/data/asyncData.json',
        method: 'get',
        params: {}
    }).then((res) => {
        dispatch({
            type: '${_Component}',
            data: {
                text: res.data.text
            }
        });
    }, (err) => {
        dispatch({
            type: '${_Component}',
            data: {
                text: 'error text'
            }
        });
    });
}

// 异步返回promise操作
export const dispatchPromiseChange = () => (dispatch, getState) => {
    return axios({
        url: '/.build/${_component}/data/asyncData.json',
        method: 'get',
        params: {}
    }).then((res) => {
        dispatch({
            type: '${_Component}',
            data: {
                text: res.data.text
            }
        });
    }, (err) => {
        dispatch({
            type: '${_Component}',
            data: {
                text: 'error text'
            }
        });
    });
}

