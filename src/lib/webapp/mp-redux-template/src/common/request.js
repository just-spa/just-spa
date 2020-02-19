import md5 from '../libs/md5.min';
import {
    getItemFromLocalForage,
    setItemToLocalForage,
} from './utils';

/**
 * @param {object} params 请求参数
 * {
 *  method: 'get',  // 请求方法
 *  cache: false,   // 是否使用缓存
 *  params: { },     // 请求参数
 *  data: { },   // 请求数据
 * }
 * @returns promise
 */
export const bizRequest = (params = {}) => {
    const loading = params.params && params.params.loading;
    const cache = params.params && params.params.cache;

    if (params.params) {
        delete params.params.loading;
        delete params.params.cache;
    }

    let paramsString = (Object.keys(params.params || {}).map((key) => {
        if (['timestamp', 'nonce'].indexOf(key) < 0) {
            return `${key}=${JSON.stringify(params.params[key])}`;
        }
    })).join('&'),                              // 拼接参数
        wholeUrl = `${params.method}_${params.url}?${paramsString}`, // 完整的请求地址
        promise;

    params = Object.assign({}, params, {
        timeout: 15000,
        data: Object.assign({}, params.params, {
            timestamp: parseInt(+new Date() / 1000),
            nonce: md5.hash(+new Date() + Math.random(0, 1) + ''),
        }),
    });

    // get 请求允许通过指定 cache 为 true 来缓存数据
    const needCacheData = params.method === 'get' && cache;

    const requestApi = () => {
        return new Promise(function (resolve, reject) {
            if (loading) {
                wx.showLoading({
                    title: '加载中',
                });
            }
            // 使用 wx.request 发送请求
            let requestPromise = new Promise((requestResolve, requestReject) => {
                wx.request({
                    ...params,
                    header: Object.assign({
                        'content-type': 'application/json'
                    }, params.header || {}),
                    success: (res) => {
                        requestResolve(res);
                    },
                    fail: (res) => {
                        requestReject(res);
                    }
                })
            });

            requestPromise.then(function (res) {
                if (loading) {
                    wx.hideLoading();
                }

                // 断网跨域请求返回特殊的错误结果
                if (res.statusCode == 200 && res.data === '') {
                    // 如果请求失败，则尝试读取上一次请求成功的数据
                    getItemFromLocalForage(wholeUrl, { data: {} }).then((data) => {
                        if (data.timestamp) {
                            resolve(data);
                        } else {
                            wx.showToast({
                                title: '网络请求失败',
                                icon: 'none',
                                duration: 1000,
                            });
                            reject();
                        }
                    }, () => {
                        wx.showToast({
                            title: '网络请求失败',
                            icon: 'none',
                            duration: 1000,
                        });
                        reject();
                    });
                } else if (typeof res.data === 'object') {
                    if (needCacheData) {
                        // 如果请求成功需要缓存，则缓存请求结果，缓存到 Storage 中
                        setItemToLocalForage(wholeUrl, { data: res.data, timestamp: +new Date(), });
                    }
                    resolve({ data: res.data });
                }
            }, (err) => {
                if (loading) {
                    wx.hideLoading();
                }

                // 如果请求失败，则尝试读取上一次请求成功的数据
                getItemFromLocalForage(wholeUrl, { data: {} }).then((data) => {
                    if (data.timestamp) {
                        resolve(data);
                    } else {
                        wx.showToast({
                            title: err.data && err.data.message || '网络请求失败',
                            icon: 'none',
                            duration: 1000,
                        });
                        reject(err);
                    }
                }, () => {
                    wx.showToast({
                        title: err.data && err.data.message || '网络请求失败',
                        icon: 'none',
                        duration: 1000,
                    });
                    reject(err);
                });
            });
        });
    };

    promise = new Promise((resolve, reject) => {
        // 是否需要读取缓存
        if (needCacheData) {
            // 先查看本地是否有缓存数据
            getItemFromLocalForage(wholeUrl, { data: {} }).then((data) => {
                // 如果30秒内相同的请求直接返回，不请求
                if ((+ new Date()) - data.timestamp < 30 * 1000) {
                    resolve(data);
                } else {
                    // 超过30秒重新发请求
                    requestApi().then(resolve, reject);
                }
            }, () => {
                // 没有缓存，发送请求
                requestApi().then(resolve, reject);
            });
        } else {
            // 不走缓存发请求
            requestApi().then(resolve, reject);
        }
    });

    return promise;
}

export default bizRequest;