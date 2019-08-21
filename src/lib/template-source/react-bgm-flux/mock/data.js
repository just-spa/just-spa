export default {
    itemName: '标题',                 // 标题文案
    options: [
        {
            label: '定向测试',
            value: 1,
            type: 'TARGETS',
        },
        {
            label: '创意测试',
            value: 2,
            type: 'CREATIVES',
        },
    ],                                 // 选项
    hotTag: 'BatchAd.ChangeItem',      // 按钮点击hottag
    reducerPath: 'changeItems',        // 在整个state中的节点数据位置
}