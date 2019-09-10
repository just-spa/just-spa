/**
 * 生产reducer
 *
 * @param {*} reducerName reducerName
 * @returns
 */
const generateReducer = (reducerName) => {
    return (state = {}, action) => {
        switch (action.type) {
            case reducerName:
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
}

/**
 * 批量生成reducer，模板内容，无需关注
 *
 * @param {string} reducerPath 原始reducer名称路径
 * @param {number} number 需要的reducer个数, 如果不填则根据原始reducer名称创建
 * @returns
 */
export const generateReducers = (reducerNames) => {
    const reducers = {};
    for(let reducerName of reducerNames) {
        reducers[reducerName] = generateReducer(reducerName);
    }
    return reducers;
}

export default generateReducers;
