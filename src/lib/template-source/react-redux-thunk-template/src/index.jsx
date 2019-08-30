
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index';
import { namespaces } from './reducer';

class ${_Component} extends PureComponent {

    static propTypes = {
        name: PropTypes.string
    }

    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {};

        // 模板固定内容，可用于多个复用场景，无需关注
        this.namespace = namespaces.shift();
        this.dispatch = this.getDispatch();
    }

    /**
     * 模板固定内容，抽象封装的函数，无需关注
     *
     * @returns
     */
    getDispatch = (actionType = '${_Component}') => {
        return (fn) => {
            // 获取唯一的actionType
            const namespaceActionType = `${actionType}${this.namespace || ''}`;
            // 或者通过props传入获取
            const _dispatch = this.context.store.dispatch;
            // 新的处理函数
            const newFn = function(dispatch, getState) {
                const args = [...arguments];
                args[2] = namespaceActionType;
                return fn.apply(this, args);
            }
            return _dispatch.call(this, newFn);
        }
    }

    componentWillMount() {

    }

    render() {
        const className = '${_component}';
        const componentTitle = '${_Component}';
        const namespaceKey = `${_Component}${this.namespace || ''}`;

        const {
            name,
        } = this.props

        const formatNameData = formatName(name);
        const text = this.props[namespaceKey] && this.props[namespaceKey].text;

        return <IndexView text={text}
            className={className}
            name={formatNameData}
            title={componentTitle}
            dispatchChange={() => {
                this.dispatch(dispatchChange());
            }}
            dispatchAsyncChange={() => {
                this.dispatch(dispatchAsyncChange());
            }}
            dispatchPromiseChange={() => {
                this.dispatch(dispatchPromiseChange());
            }}
        />
    }
}


// 可参考下面注释中的代码适应复用的场景，外层添加的reducer个数设置为多个即可
// class ${_Component}s extends PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     render() {

//         return <div>
//             <${_Component} {...this.props} />
//             <${_Component} {...this.props} />
//             <${_Component} {...this.props} />
//             <${_Component} {...this.props} />
//         </div>
//     }
// }

// export default ${_Component}s;

export default ${_Component};

