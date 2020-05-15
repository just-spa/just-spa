/**
 * 转换名称
 * 
 * @param {any} name 名称
 * @returns 格式化修饰的名称
 */
export const formatName = (name: string): string => {
    return `名称：${name}`;
};

/**
 * 各式化文字
 *
 * @param {string} text
 * @returns {string}
 */
export const formatText = (text: string): string => {
    return `[${text}]`;
}
