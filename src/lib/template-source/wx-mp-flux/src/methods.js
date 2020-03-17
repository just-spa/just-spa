
/**
 * methods.js包含所有的所有的业务触发逻辑与实践，对应小程序中的methods字段内容，并建议包含initData、bindEvents两个方法作为范式
 *
 **/

import { useDispatch, } from '../../../initStore';
import { changeName, asyncChangeName, } from './action';

const dispatch = useDispatch();
const app = getApp();

// 不要export导出匿名函数，需要使用调用方法的this(业务组件实例)

const changeName = function() {
    dispatch(changeName());
};

const asyncChangeName = function () {
    dispatch(asyncChangeName());
};

// 动态设置初始数据，例如请求初始数据
const initData = function () {
    dispatch(changeName());
};

const bindEvents = function () {
    // EventStore作为全局事件监听方案，用户组件和页面间自由通信。
    // 对应触方式发为 app.EventStore.trigger('listenerName', { a: 1});
    if (app.EventStore) {
        app.EventStore.on('listenerName', (data) => {
            console.log(data);
        });
    }
};

export default {
    changeName,
    asyncChangeName,
    initData,
    bindEvents
}
