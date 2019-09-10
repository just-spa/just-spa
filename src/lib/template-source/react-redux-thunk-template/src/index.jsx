
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getDispatch, dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
import { formatName } from './data-adapter';
import IndexView from './views/index';

class ${_Component} extends PureComponent {

    static propTypes = {
        name: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {};

        // 模板固定内容，可用于多个复用场景，无需关注
        this.dispatch = getDispatch(props.namespace || '${_Component}', props.dispatch);
    }

    componentWillMount() {

    }

    render() {
        const className = '${_component}';
        const componentTitle = '${_Component}';
        const {
            namespace = '${_Component}',
            [namespace]: props = {},
            name,
        } = this.props;

        const formatNameData = formatName(name);
        const text = props.text;

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
//     // 必须要定义contextType，否则无法获取Provider的context
//     static contextTypes = {
//         store: PropTypes.object
//     }
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     render() {
//         const dispatch = this.context.store.dispatch
//         return <div>
//             <${_Component} {...this.props} dispatch={dispatch}/>
//             <${_Component} {...this.props} dispatch={dispatch}/>
//             <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName1"/>
//             <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName2"/>
//             <${_Component} {...this.props} dispatch={dispatch} namespace="reducerName3"/>
//         </div>
//     }
// }

// export default ${_Component}s;

export default ${_Component};

