const getWebpackConfig = require('./webpack.config');

const minimist = require('minimist');
const argvs = minimist(process.argv.slice(2));

const webpackConfig = getWebpackConfig({
    port: 8000,
    env: 'test'
});

const testList = [];
const webpackPreprocessors = {}
if (argvs.folder) {
    testList.push({ pattern: '.build/*/test/*.js', watched: false });
    webpackPreprocessors['.build/*/test/*.js'] = ['webpack'];
}
if (argvs.file) {
    testList.push(argvs.file);
    webpackPreprocessors[argvs.file] = ['webpack'];
}
// karma测试文件的配置方式
module.exports = function (config) {
    config.set({
        basePath: '',
        browsers: ['ChromeHeadless'],

        // 下面的测试框架是用来测试js
        frameworks: ['mocha', 'chai'],

        singleRun: true,
        // 用来出报告的
        reporters: ['mocha', 'coverage'],

        files: testList,

        preprocessors: webpackPreprocessors,

        // 给webpack指定相关的配置文件
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        coverageReporter: {
            dir: 'coverage/',
            subdir: 'report',
            reporters: [
                { type: 'text' },
                { type: 'html' }
            ],
            check: {
                global: {
                    statements: 5,
                    branches: 5,
                    functions: 5,
                    lines: 5,
                    excludes: [
                    ]
                }
            }
        }
    })
}