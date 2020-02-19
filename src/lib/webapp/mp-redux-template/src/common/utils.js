import moment from '../libs/moment';

// 业务类 Storage 自动增加 accountId 区分不同的用户
const genUniqCacheKey = (key, accountId = '') => {
    // 不需要加accountId的key, 其它的需要使用accountId作为前缀区分
    const uniqGlobalKeys = [];

    // 部分接口缓存不需要加uid作为key
    const uniqApiKeys = [];

    const isUniqApi = uniqApiKeys.some((uniqApiKey) => {
        return key.indexOf(uniqApiKey) > -1;
    })

    if (uniqGlobalKeys.indexOf(key) > -1 || isUniqApi) {
        return key;
    }

    if (accountId) {
        return `${accountId}_${key}`;
    } else {
        return key;
    }
}

/**
 * 从 Storage 中获取数据
 *
 * @param {string} key 存储的键
 * @param {string} defaultValue 返回的默认值
 * @returns 获取的值
 */
export const getItemFromLocalStorage = (key, defaultValue = '') => {
    key = genUniqCacheKey(key);
    try {
        const result = wx.getStorageSync(key);
        if (result || (result == '0' || result === false)) {
            return result;
        } else {
            return defaultValue;
        }
    } catch (e) {
        return defaultValue;
    }
};

/**
 * 向 Storage 中保存对象
 *
 * @param {string} key 存储的键
 * @param {any} value 存储的值
 * @memberof Preview
 */
export const setItemToLocalStorage = (key, value) => {
    key = genUniqCacheKey(key);
    try {
        wx.setStorageSync(key, value);
    } catch (e) {}
};

/**
 * 从 Storage 中移除数据
 *
 * @param {string} key 存储的键
 * @memberof Preview
 */
export const removeItemFromLocalStorage = (key) => {
    key = genUniqCacheKey(key);
    try {
        wx.removeStorageSync(key);
    } catch (e) {
        wx.setStorageSync(key, '');
    }
};

/**
 * 从 Storage 中移除账户信息
 *
 * @param {string} key 存储的键
 * @param {string} accountId 账号ID
 * @memberof Preview
 */
export const removeAccountFromLocalStorage = (key, accountId) => {
    key = genUniqCacheKey(key, accountId);
    try {
        wx.removeStorageSync(key);
    } catch (e) {
        wx.setStorageSync(key, '');
    }
}

/**
 * 从Localforage中获取对象 (小程序的存储只有 Storage, 实际上还是存储在 Storage 中)
 *
 * @param {string} key 存储的键
 * @param {any} value 默认值
 * @returns 获取的值
 */
export const getItemFromLocalForage = (key, defaultValue = '') => {
    key = genUniqCacheKey(key);
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key,
            success (res) {
                const result = res.data;
                if (result || (result == '0' || result === false)) {
                    resolve(result);
                } else {
                    resolve(defaultValue);
                }
            },
            fail () {
                reject();
            }
        });
    });
};

/**
 * 向 Localforage 中保存对象 (存储在 Storage 中)
 *
 * @param {string} key 键
 * @param {any} object 存储的值
 * @memberof Preview
 */
export const setItemToLocalForage = (key, value) => {
    key = genUniqCacheKey(key);
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key,
            data: value,
            success () {
                resolve();
            },
            fail () {
                reject();
            }
        });
    });
};

/**
 * 从 localforage 中移除对象
 *
 * @param {string} key 键
 * @memberof Preview
 */
export const removeItemFromLocalForage = (key) => {
    key = genUniqCacheKey(key);
    return new Promise((resolve, reject) => {
        wx.removeStorage({
            key,
            success () {
                resolve();
            },
            fail () {
                reject();
            }
        });
    });
};

/**
 * 根据天数清空 Storage 缓存，用于清理过期的数据
 * @param {*} days 时间
 * @param {string} key key的前缀
 */
export const clearLocalForageByDay = (days = 7, prefix = '') => {
    const clearDate = getItemFromLocalStorage('clear_date', '');
    const todayDate = moment(new Date()).format('YYYY-MM-DD');

    // 如果当天已经清理过，则不再清理
    if (!clearDate || todayDate != clearDate) {
        setItemToLocalStorage('clear_date', todayDate);
    } else {
        return;
    }

    // 一段时间后开始清理localforage
    setTimeout(() => {
        wx.getStorageInfo({
            success (res) {
                const timestamp = + new Date();

                // 包含所有 key 的数组
                res.keys.filter((item) => {
                    return item.startsWith(prefix);
                }).forEach((key) => {
                    wx.getStorage({
                        key,
                        success (itemRes) {
                            const data = itemRes.data;
                            // 如果接口缓存时间超过时间，则清理
                            if (typeof data === 'object' && data.timestamp && timestamp - data.timestamp > days * 3600 * 1000) {
                                wx.removeStorage({
                                    key,
                                });
                            }
                        },
                        fail () {
                            // key值读取失败, 清理
                            wx.removeStorage({
                                key,
                            });
                        }
                    });
                });
            }
        });
    }, 6000);
}

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

// 格式化大数字为万或亿
export const formatBigNumber = (number) => {
    if ((number / 100000000) > 1) {
        return (number / 100000000).toFixed(1) + '亿';
    }
    if ((number / 10000) > 1) {
        return (number / 10000).toFixed(1) + '万';
    }
    return number;
}


// 格式化大数字格式为千位逗号的展示方式
export const formatLocalNumber = (number) => {
    const numberString = number + '';
    const pointIndex = numberString.indexOf('.');
    // 存在小数点
    if (pointIndex > -1) {
        return parseFloat(numberString.slice(0, pointIndex)).toLocaleString() + numberString.slice(pointIndex);
    } else {
        return parseFloat(numberString).toLocaleString();
    }
}

// 对象数组根据某个字段去重
export const uniqArray = (array, key) => {
    let object = {};
    return array.reduce((cur, next) => {
        object[next[key]] ? '' : object[next[key]] = true && cur.push(next)
        return cur;
    }, [])
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
 * 合并 merge (会把第一层的属性进行合并)
 * 目前仅仅合并 object 对象，其它的类型直接覆盖
 */
export const combineMerge = (newObj = {}, sources = {}, appendSources = {}) => {
    Object.assign(newObj, sources);
    Object.keys(appendSources).forEach((item) => {
        const appendData = appendSources[item];
        if (typeof newObj[item] === 'object' && typeof appendData === 'object') {
            Object.assign(newObj[item], appendData);
        } else {
            newObj[item] = appendData;
        }
    })
    return newObj;
}

/**
 * 计算字符长度，可以选择是否使用等宽规则
 * 
 * @param {string} character 输入的字符串
 * @param {bool} [isFullWidthChar=false] 是否使用等宽计算规则（1个中文一个字符，两个英文算一个字符）,默认使用字符串的 length 来计算
 */
export const getStringLength = (character = '', isFullWidthChar = false) => {
    if (isFullWidthChar) {
        let len = 0;
        for (let i = 0, length = character.length; i < length; i++) {
            if (character.charCodeAt(i) <= 127) {
                len++;
            } else {
                len += 2;
            }
        }
        len = Math.ceil(len / 2);
        return len;
    } else {
        return character.length;
    }
}

// 判断字符串是否是 json 化的字符串
export const isJsonString = (str) => {
    let value = {};
    try {
        value = JSON.parse(str);
    } catch (e) {
        return false;
    }

    return value;
};

// 判断数组中有多少个指定的值
export const arrayElementCount = (array = [], value) => {
    let count = 0;
    array.forEach((item) => {
        if ((Object.prototype.toString.call(value) === '[object Array]' && value.includes(item)) || item === value) {
            count++;
        }
    });
    return count;
};


/**
 * 查询参数字符串化
 * @param {object} params 查询参数
 * @param {string} prefix 前缀
 */
export const paramsStringify = (params, prefix) => {
    let str = [];
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        const k = prefix ? prefix + "[" + key + "]" : key;
        const v = params[key];
        str.push((v !== null && typeof v === "object") ?
            paramsStringify(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
}

// 查看 Storage 使用的空间
wx.getStorageInfo({
    success (res) {
        const {
            currentSize,
            limitSize
        } = res;
        console.log(`Storage 已使用: ${(currentSize / 1024).toFixed(2)}M(共${(limitSize / 1024).toFixed(2)}M)`);
    },
    fail () {
        console.log('查询 Storage 使用空间失败');
    }
});