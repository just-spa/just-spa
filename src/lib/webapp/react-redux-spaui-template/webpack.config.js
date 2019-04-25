/**
 * @fileOverview 脚本
 */
module.exports = function(env = 'prod') {
    return require(`./scripts/webpack.${env}.js`);
};
