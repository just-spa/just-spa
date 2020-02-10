
// 数据处理层使用wxs语法，同于nodejs的ES5 + cmd规范

function formatName (name) {
    return '[' + name + ']';
}

module.exports = {
    formatName: formatName,
};
