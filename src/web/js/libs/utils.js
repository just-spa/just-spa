const Utils = {
    /**
     * 从包名中获取组件名称
     * 
     * @param {any} packageName 
     * @returns 
     */
    getComponentName(packageName) {
        var componentName = packageName;
        var packageNameSpaces = packageName.split('/');

        if(packageNameSpaces.length > 1 && packageName.indexOf('@') > -1) {
            componentName = packageNameSpaces[packageNameSpaces.length - 1];
        }
        return componentName;
    },

    /**
     * 从Url中获取参数
     * 
     * @param {any} componentInfo
     * @returns 
     */
    getUrlParams(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null || ''; 
    }
}


/**
 * @file: biz-axios
 * 网络请求库，已封装请求失败上报、get请求接口缓存、请求过程loading图等
 * 使用时loading样式如下:
 */

let apiMap = {};

let loadingHtml = `<div class="loading-mask">
    <div class="loading"></div>
</div>`,
    loadingEl = null;

/**
 * @param {any} params 同axios的params
 * @returns promise
 */
const bizAxios = (params) => {

    let paramsString = (Object.keys(params.params || {}).map((key) => {
            return `${key}=${params.params[key]}`
        })).join('&'),                              // 拼接参数
        wholeUrl = `${params.url}?${paramsString}`, // 完整的请求地址
        promise;

    // 如果有接口缓存且为post请求，则直接返回缓存的内容
    if (apiMap[wholeUrl] && params.cache && (params.method === 'get' || !params.method)) {
        promise = new Promise(function (resolve) {
            resolve(apiMap[wholeUrl]);
        });
    } else {
        promise = new Promise(function (resolve, reject) {
            _showLoading();
            axios(params).then(function (res) {
                _hideLoading();
                // 如果请求成功，则缓存请求结果
                apiMap[wholeUrl] = res;
                resolve(res);
            }, function (err) {
                _hideLoading();
                reject(err);
            }).catch(function (err) {
                _hideLoading();
                reject(err);
            });
        });
    }

    return promise;
};

/**
 * 显示请求中loading
 */
function _showLoading() {
    if(!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.innerHTML = loadingHtml;
        document.body.appendChild(loadingEl);
    }
}

/**
 *因擦请求中loading
 */
function _hideLoading() {
    if (loadingEl) {
        document.body.removeChild(loadingEl);
        loadingEl = null;
    }
}