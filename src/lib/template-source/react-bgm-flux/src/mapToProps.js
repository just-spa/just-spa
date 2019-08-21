/**
 * View与state之间的数据转换和用户界面操作交互响应方法的定义
 * @author ${_author}
 */

import _ from 'lodash'
import {
    reportClick,
} from 'modules/common'

/**
 * 同redux mapStateToProps
 *
 * @param {*} [state={}] state
 * @param {*} [instance={}] 当前实例
 * @returns
 */
export const mapStateToProps = (state = {}, instance = {}) => {

    const {
        setting = {},
    } = instance
    const reducerValue = _.get(state, setting.reducerPath || '', {})
    return {
        ...reducerValue,
        options: setting.options || [],
    }
}

/**
 * 同redux mapDispatchToProps
 *
 * @param {*} [state={}] dispatch
 * @param {*} [instance={}] 当前实例
 * @returns
 */
export const mapDispatchToProps = (dispatch, instance) => {
    const {
        setting,
        services,
    } = instance
    return {
        onChange: (value) => {
            reportClick({
                clickid: `${setting.hotTag}.Click`,
            })
            dispatch(services.onChange(value))
        },
        onSubmit: () => {
            reportClick({
                clickid: `${setting.hotTag}.Submit`,
            })
            dispatch(services.submit())
        },
    }
}
