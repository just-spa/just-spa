import _ from '../../lodash';

const assign = function (target) {
    'use strict';
    // We must check against these specific cases.
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
};

// 计算 objA对象 相比较 objB对象的 变化部分（直接使用全等（===）比较进行判断）
const diff = (objA = {}, objB = {}) => {
    const diff = {};
    const keys = _.uniq(Object.keys(objA).concat(Object.keys(objB)));

    keys.forEach((key) => {
        // 不同的数据才需要更新
        if(!(objA[key] === objB[key])) {
            diff[key] = objA[key];
        }
    });

    return diff;
}

module.exports = {
    assign: assign,
    diff: diff,
}