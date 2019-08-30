// 用于标识不同复用的reducer，使用计数极智区分，如果数量小于等于1，则自动不计数
const _namespaces = [];

/**
 * 生产reducer
 *
 * @param {*} reduceName 添加了namespace的reducer
 * @returns
 */
const generateReducer = (reduceName) => {
    return (state = {}, action) => {
        switch (action.type) {
            case reduceName:
                return Object.assign({}, state, action.data);
            default:
                return state;
        }
    }
};

/**
 * 批量生成reducer，模板内容，无需关注
 *
 * @param {string} originName 原始reducer名称
 * @param {number} number 需要的reducer个数, 如果不填则根据原始reducer名称创建
 * @returns
 */
export const generateReducers = (originName, number = 0) => {
    const reducers = {};
    if (!number || number <= 1) {
        reducers[originName] = generateReducer(originName);
        _namespaces.push('')
    } else {
        for (let i = 0; i < number; i++) {
            const reducerName = originName + (i + 1);
            reducers[reducerName] = generateReducer(reducerName);
            _namespaces.push(i + 1);
        }
    }
    return reducers;
};

// 导出namespace列表
export const namespaces = _namespaces;

// 使用时调用方法初始化：generateReducers('FluxNewOp', 4);
export default generateReducers;


