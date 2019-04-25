
/**
 * @file: biz-axios
 * 网络请求库，已封装请求失败上报、get请求接口缓存、请求过程loading图等
 * 使用时loading样式如下:
 * .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.2);
}

.loading-mask .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -15px auto -15px;
    width: 30px;
    height: 30px;
    border: 5px #1ba3f4 solid;
    border-left-color: transparent;
    border-radius: 100%;
    animation: loadingAnimate 1s infinite linear;
}

@keyframes loadingAnimate {
    from {
        transform: rotate(0deg)
    }
    to {
        transform: rotate(360deg)
    }
}
 */

import axios from 'axios';
import { setItemToLocalStorage, getItemFromLocalStorage } from './utils';

let apiMap = {};

let loadingHtml = `<div class="loading-mask">
    <div class="loading-container">
        <div class="loading"></div>
        <div class="text">加载中</div>
    </div>
</div>`,
    loadingEl = null;
const canUseClientRequest = (typeof cordova !== 'undefined') && cordova.plugin && cordova.plugin.http;

/**
 * @param {any} params 同axios的params
 * {
 *  method: 'get',  // 请求方法
 *  cache: false,   // 是否使用缓存
 *  params: { }     // 请求参数
 * }
 *  @param {any} withNoLoading 是否隐藏loading效果
 * @returns promise
 */
const bizAxios = (params, withNoLoading) => {
    let paramsString = (Object.keys(params.params || {}).map((key) => {
        return `${key}=${params.params[key]}`
    })).join('&'),                              // 拼接参数
        wholeUrl = `${params.method}_${params.url}?${paramsString}`, // 完整的请求地址
        promise;

    axios.defaults.headers.common['Authorization'] = getItemFromLocalStorage('access_token') || '';
    params = Object.assign({}, params, {
        // xsrfCookieName: 'XSRF-TOKEN',
        // withCredentials: true,
        timeout: 8000
    });

    // 开发环境和线上环境
    params.url = (location.hostname && location.hostname === 'localhost' ? '' : 'https://*.qq.com') + params.url;

    promise = new Promise(function (resolve, reject) {
        if (!withNoLoading) {
            showLoading();
        }
        // 使用web axios发送请求
        let requestPromise = axios(params);

        requestPromise.then(function (res) {
            if (!withNoLoading) {
                hideLoading();
            }
            // 如果请求成功，且需要缓存，则缓存请求结果，内存和localstorage中都保存
            if (params.cache) {
                apiMap[wholeUrl] = { data: res.data };
                setItemToLocalStorage(wholeUrl, { data: res.data });
            }
            resolve({ data: res.data });
        }, function (err) {
            if (!withNoLoading) {
                hideLoading();
            }

            let localApiMap = getItemFromLocalStorage(wholeUrl);
            // 如果请求失败，则读取本地缓存
            if ((apiMap[wholeUrl] || localApiMap) && (params.method === 'get' || !params.method) && params.cache) {
                resolve(apiMap[wholeUrl] || localApiMap);
            }

            // 接口失败上报
            apiErrorReport({
                name: 'cgi request error',
                msg: `返回结构失败 @ ${wholeUrl}`
            });

            reject(err);
        });
    });
    // }

    return promise;
};

/**
 * 利用客户端发起请求
 * 
 * @param {any} params 
 * @returns 
 */
function clientRequest(params, wholeUrl) {
    return new Promise((resolve, reject) => {
        let url = params.url;
        delete params.url;

        try {
            cordova.plugin.http.sendRequest(url, JSON.stringify(params), function (response) {
                resolve({
                    data: typeof response.data === 'string' ? JSON.parse(response.data) : response.data,
                    code: response.status
                });
            }, function (err) {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    })
}

/**
 * 上报对象
 *
 * @param {any} errorObj 错误对象
 */
function apiErrorReport(errorObj) {
    const Tryjs = window.Tryjs;
    // if (Tryjs) {
    //     Tryjs.report(errorObj);
    // }
}

/**
 * 显示请求中loading
 */
function showLoading() {
    if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.innerHTML = loadingHtml;
        document.body.appendChild(loadingEl);
    }
}

/**
 *因擦请求中loading
 */
function hideLoading() {
    if (loadingEl) {
        document.body.removeChild(loadingEl);
        loadingEl = null;
    }
}

export default bizAxios;

