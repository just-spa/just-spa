
// 同步dispatch数据
export const changeName = (data = {}) => (dispatch, getState) => {
    dispatch({
        type: 'AccountTab',
        data: Object.assign({
            name: '同步数据'
        }, data)
    });
    console.log(getState());
}

// 同步dispatch数据
export const asyncChangeName = () => (dispatch, getState) => {
    wx.request({
        url: '/api/test.json', //仅为示例，替换为真实接口
        data: {
            name: '',
        },
        header: {
            'content-type': 'application/json' // 默认值
        },
        method: 'GET',
        success (res) {
            dispatch(changeName({
                name: res.data || '',
            }));
        },
        fail (err) {
            dispatch(changeName({
                name: err.code || 'request error',
            }));
        }
    })
}