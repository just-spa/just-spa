import axios from 'axios';


// dispatch封装，模板固定内容，无需修改
export const getDispatch = (actionType, dispatch) => {
    return (fn) => {
        // 新的处理函数
        const newFn = function(dispatch, getState) {
            const args = [...arguments];
            args[2] = actionType;
            return fn.apply(this, args);
        }
        return dispatch.call(this, newFn);
    }
}

// 同步dispatch操作
export const dispatchChange = () => (dispatch, getState, actionType) => {
    dispatch({
        type: actionType || 'change',
        data: {
            text: 'change'
        }
    });
}

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
}

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
}

