
/**
* 判断是否为windows平台
*
* @returns
*/
function _isWinPlatform() {
    return process.platform.indexOf('win32') > -1;
}

/**
 * 获取运行的端口，默认8000
 * 
 */
function _getPortFromParams(commandParams) {
    if (commandParams && ['-p', '-port'].includes(commandParams[0]) && Number(commandParams[1])) {
        return Number(commandParams[1]);
    }
    return 8000;
}

module.exports = {
    isWinPlatform: _isWinPlatform,
    getPortFromParams: _getPortFromParams
};