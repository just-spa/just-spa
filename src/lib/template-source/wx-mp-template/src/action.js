
// 同步dispatch数据
export const changeName = function (data = {}) {
    this.setData({
        name: '同步数据'
    });
}

// 同步dispatch数据
export const asyncChangeName = function() {
    const self = this;
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
            self.setData({
                name: res.data || '',
            });
        },
        fail (err) {
            self.setData({
                name: err.code || 'request error',
            });
        }
    })
}