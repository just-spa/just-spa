// globalDependent 存放一些小程序环境的一些依赖，防止导入一些库出现问题，所以需要在最上面引入
import './common/globalDependent';
import { initStore, useDispatch } from './initStore';
import { Provider } from './libs/redux-connect/index';
import _ from './libs/lodash';

const store = initStore({
    IndexTab: {
        name: '初始名称',
    }
});
const dispatch = useDispatch();

App(Provider(store)({
    globalData: {
        name: 'globalData',
    },

    onLaunch (options) {
        // launch（打开小程序）时操作.
    },

    onShow (options) {
        // show（页面打开或页面返回再次可见时）时操作.
    },

    onHide () {
        // hide（小程序切到后台）时操作
    },

    onError (msg) {
        console.log(msg)
    },
}));