/**
 * model内部state声明
 * @author ${author}
 */
import _ from 'lodash'

// 初始化数据
export const initialState = {
    value: [],
    options: [],
    errorMsg: '',
    showErrorMsg: false,
    frozenChangeItems: false,
}

// 初始化数据对应的action设置字段
let _actionMap = {},
    key = ''
for (key in initialState) {
    _actionMap[`set${_.upperFirst(key)}`] = key
}
export const actionMap = _actionMap
