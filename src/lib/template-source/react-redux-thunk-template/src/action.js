import axios from 'axios';

// 同步dispatch实例
export const dispatchChange = function (actionType) {
    const { store } = this.context;
    const actionCreator = (actionType) => {
        return (dispatch, getState) => {
            dispatch({
                type: actionType || 'change',
                data: {
                    text: 'change'
                }
            });
        };
    }
    return store.dispatch(actionCreator(actionType));
};

// 异步dispatch实例
export const dispatchAsyncChange = function (actionType) {

    const { store } = this.context;

    const actionCreator = function (actionType) {
        return (dispatch, getState) => {
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
                store.dispatch({
                    type: actionType || 'change',
                    data: {
                        text: 'error text'
                    }
                });
                // console.log(err);
            });
        };
    }

    return store.dispatch(actionCreator(actionType));
};

// 异步promise实例
export const dispatchPromiseChange = function (actionType) {
    const { store } = this.context;
    const actionCreator = function (actionType) {

        return (dispatch, getState) => new Promise(function (resolve, reject) {
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
                store.dispatch({
                    type: actionType || 'change',
                    data: {
                        text: 'error text'
                    }
                });
                // console.log(err);
            });
        });
    }

    return store.dispatch(actionCreator(actionType));
};

