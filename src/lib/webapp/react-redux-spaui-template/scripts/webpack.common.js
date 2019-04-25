const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = require('./HtmlWebpackPluginConfig');
const path = require('path');
let HtmlWebpackPluginList = [];

HtmlWebpackPluginConfig.map((item) => {
    if (item) {
        HtmlWebpackPluginList.push(new HtmlWebpackPlugin(item));
    }

    return item;
});


module.exports = {
    entry: {
        'dist': './src/js/app.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    plugins: HtmlWebpackPluginList,
    module: {
        rules: [{
            test: /\.ejs$/,
            use: {
                loader: 'ejs-loader'
            }
        }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        }, {
            test: /\.(less|css)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'less-loader'
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: {
                loader: 'url-loader'
            }
        }, {
            test: /\.svg$/,
            loader: 'svg-url-loader'
        }, {
            test: /-example\.js/,
            use: ['string-loader']
        }]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'axios': 'axios',
        '@tencent/spaui': 'SPAUI',
        '@tencent/spaui-topnav': 'SPAUI_TOPNAV',
        '@tencent/spaui-card': 'SPAUI_CARD',
        '@tencent/spaui-table-title': 'SPAUI_TABLE_TITLE'
    }
};
