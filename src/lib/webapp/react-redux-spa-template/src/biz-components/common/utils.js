
/**
 * 从localStorage中获取对象
 *
 * @param {any} key 存储的键
 * @returns 获取的值
 */
export const getItemFromLocalStorage = (key) => {
    let string = localStorage.getItem(key);
    try {
        return JSON.parse(string);
    } catch (e) {
        return string;
    }
}

/**
 * 向localStorage中保存对象
 *
 * @param {any} key
 * @param {any} object 存储的值
 * @memberof Preview
 */
export const setItemToLocalStorage = (key, object) => {
    if (typeof object === 'object') {
        try {
            let string = JSON.stringify(object);
            localStorage.setItem(key, string);
        } catch (e) {
            localStorage.setItem(key, object);
        }
    } else {
        localStorage.setItem(key, object);
    }
};

/**
 * 从localStorage中移除对象
 *
 * @param {any} key
 * @memberof Preview
 */
export const removeItemFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        localStorage.setItem(key, null);
    }
};

/**
 * 从Url中获取参数
 *
 * @param {any} componentInfo
 * @returns
 */
export const getUrlParams = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null || '';
};

// toFixed兼容方法
Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    const number = this;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    let result = number.toString();
    const arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (let i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    const integer = arr[0];
    const decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }

    return result;
};

// 格式化大数字格式为千位逗号的展示方式
export const formatBigNumber = (number) => {
    if ((number / 100000000) > 1) {
        return (number / 100000000).toFixed(1) + '亿';
    }
    if ((number / 10000) > 1) {
        return (number / 10000).toFixed(1) + '万';
    }
    return number;
}

/**
* 获取距离当前时间的时间长度
* @param {Number} timestamp 要转换的时间参数（单位为秒）
* @returns {String}
*/
export const getRelativeTime = (timestamp) => {
    let currentUnixTime = Math.round((new Date()).getTime() / 1000);       // 当前时间的秒数
    let deltaSecond = currentUnixTime - parseInt(timestamp, 10);            // 当前时间与要转换的时间差（ s ）
    let result;

    if (deltaSecond < 60) {
        result = deltaSecond + '秒前';
    } else if (deltaSecond < 3600) {
        result = Math.floor(deltaSecond / 60) + '分钟前';
    } else if (deltaSecond < 86400) {
        result = Math.floor(deltaSecond / 3600) + '小时前';
    } else {
        result = Math.floor(deltaSecond / 86400) + '天前';
    }
    return result;
}

/**
 * 滚动加载
 * 
 * @param {any} callback 
 */
export const onScrollLoading = function(callback) {
    let canLoading = true;

    // 滚动加载
    window.onscroll = () => {
        if (canLoading) {
            let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
            if (document.body.scrollHeight - scrollTop < 750) {
                // 获取分类
                canLoading = false;
                this.offset += this.limit;
                callback();
                setTimeout(() => {
                    canLoading = true;
                }, 400);
            }
        }
    }
}