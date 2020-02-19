import shallowEqual from './shallowEqual.js'
import warning from './warning.js'
import wrapActionCreators from './wrapActionCreators.js'
import {
    assign,
    diff,
} from './utils/Object.js'

const defaultMapStateToProps = state => ({}); // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({dispatch});

// 获取当前位于前台的页面
const getActivePage = () => {
    let pages = getCurrentPages();
    return pages[pages.length - 1] || {};
};

/**
 * 
 * @param {*} mapStateToProps 
 * @param {*} mapDispatchToProps 
 * @param {bool} is_page 是否是页面
 * @param {bool} onlyActiveChange 是否只有当前的页面位于前台的时候才进行 setData (注意：暂不支持在 component 中使用这个参数，只能在 page 中)
 */
function connect(mapStateToProps, mapDispatchToProps, is_page = true, onlyActiveChange = false) {
    const shouldSubscribe = Boolean(mapStateToProps);
    const mapState = mapStateToProps || defaultMapStateToProps;
    const app = getApp();

    let mapDispatch;
    if (typeof mapDispatchToProps === 'function') {
        mapDispatch = mapDispatchToProps
    } else if (!mapDispatchToProps) {
        mapDispatch = defaultMapDispatchToProps
    } else {
        mapDispatch = wrapActionCreators(mapDispatchToProps)
    }

    return function wrapWithConnect(pageConfig) {
        function handleChange(options) {
            if (!this.unsubscribe) {
                return
            }

            // 因为在后台的页面setData会抢占前台资源，所以在后台的页面不要执行setData操作
            if (onlyActiveChange && (this.route !== getActivePage().route)) {
                return;
            }

            const state = this.store.getState();
            const mappedState = mapState(state, options);


            // 存在上一次的值，并且该值与当前新值相同（浅比较），则不进行 setData
            if (this.prevState && shallowEqual(mappedState, this.prevState)) {
                return;
            }

            // 浅比较下，只 setData 变化的数据，优化性能
            this.setData(diff(mappedState, this.prevState))

            // 缓存上一次的结果，便于下次更新 data 时做 diff
            this.prevState = mappedState
        }

        const {
            onLoad: _onLoad,
            onUnload: _onUnload,
            onShow: _onShow,
        } = pageConfig;

        function onLoad(options) {
            this.store = app.store;
            if (!this.store) {
                warning("Store对象不存在!")
            }
            if (shouldSubscribe) {
                this.unsubscribe = this.store.subscribe(handleChange.bind(this, options));
                handleChange.call(this, options)
            }
            if (typeof _onLoad === 'function') {
                _onLoad.call(this, options)
            }
        }

        function onUnload() {
            if (typeof _onUnload === 'function') {
                _onUnload.call(this)
            }
            typeof this.unsubscribe === 'function' && this.unsubscribe()
        }

        function onShow(options) {
            if(shouldSubscribe && onlyActiveChange){
              handleChange.call(this, options);
            }
            if (typeof _onShow === 'function') {
              _onShow.call(this, options);
            }
        }

        if (is_page) {
            return assign({}, pageConfig, mapDispatch(app.store.dispatch), { onLoad, onUnload, onShow })
        } else {
            pageConfig.methods = assign(pageConfig.methods, mapDispatch(app.store.dispatch));
            return assign({}, pageConfig, {attached: onLoad, detached: onUnload})
        }
    }
}

module.exports = connect;