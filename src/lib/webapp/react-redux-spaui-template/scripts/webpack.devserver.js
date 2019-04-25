/**
 * @fileOverview 开发配置
 */
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
var outputConfig = CommonConfig.output;

outputConfig.publicPath = '/';

module.exports = Merge(CommonConfig, {
    devServer: {
        hot: true, // Tell the dev-server we're using HMR
        inline: true,
        contentBase: './dist'
    },
    output: outputConfig,
    devtool: 'cheap-eval-source-map',
    plugins: CommonConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin() // Enable HMR
    ])
});

