import axios from 'axios';

// 同步change实例
export const change = function () {
    this.text = 'change world';
};

// 异步change实例
export const asyncChange = function (actionType) {
    const self = this;
    axios({
        url: '/.build/${_component}/data/asyncData.json',
        method: 'get',
        params: {}
    }).then((res) => {
        self.text = res.data.text;
    }, (err) => {
        console.log(err);
    });
};

// 异步change实例
export const promiseChange = function (actionType) {
    const self = this;
    new Promise(function (resolve, reject) {
        return axios({
            url: '/.build/${_component}/data/asyncData.json',
            method: 'get',
            params: {}
        }).then((res) => {
            self.text = res.data.text;
        }, (err) => {
            console.log(err);
        });
    });
};
