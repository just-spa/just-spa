/**
 * Model对外入口
 * @author ${_author}
 *
 * import方法：
 * import ${_Component} from 'xxx/${_Component}'
 * 
 * 创建实例：
 * const IntanceOf${_Component} = new ${_Component}()
 * 
 * 引用方式：
 * render () {
 *      return <IntanceOf${_Component}.View />
 * }
 */

import BaseModel from '../BaseModel'
import {
    mapStateToProps,
    mapDispatchToProps,
} from './src/mapToProps'
import {
    initialState,
    actionMap,
} from './src/state'
import View from './src/view'
import {
    services,
} from './src/service'

class ${_Component} extends BaseModel {
    constructor(props) {
        super(props)
        this.setup({
            actionMap,
            initialState,
            mapDispatchToProps,
            mapStateToProps,
            View,
        }, props)
    }

    services = services
}
export default ${_Component}
