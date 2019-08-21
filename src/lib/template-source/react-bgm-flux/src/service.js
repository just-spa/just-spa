/**
 * 业务操作与交互，包含且不限于数据校验、请求、提交、修改内外部数据等操作
 * @author ${_author}
 */

import _ from 'lodash'

/**
 * 修改新数据
 */
const onChange = (value) => (dispatch, getState, instance) => {
    dispatch(instance.actions.setValue(value))
    dispatch(instance.actions.setErrorMsg(''))
}

/**
 * 验证数据
 * @returns
 */
const validate = () => (dispatch, getState, instance = {}) => {
    const {
        setting,
        actions,
    } = instance
    const {
        value,
    } = _.get(getState(), setting.reducerPath, {})

    let result = false,
        msg = ''

    // 检验
    if (!value || value.length == 0) {
        msg = `${setting.itemName}为空`
    } else {
        result = true
    }
    // 修改提示
    dispatch(actions.setErrorMsg(msg))
    return result
}

/**
 * 提交数据
 *
 */
const submit = () => (dispatch, getState, collector) => {
    dispatch(collector.actions.setShowErrorMsg(true))
    // 基础校验
    if (dispatch(collector.services.validate())) {
        dispatch(collector.actions.setFrozenChangeItems(true))
    } else {
        dispatch(collector.actions.setFrozenChangeItems(false))
    }
    // 提交数据操作
    // ......
}

/**
 * 定义实例对外提供的services
 * @type {object}
 */
export const services = {
    onChange,
    validate,
    submit,
}
