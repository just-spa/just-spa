
const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');
const minimist = require('minimist');
const fs = require('fs');
const fse = require('fs-extra');
const axon = require('axon');
const socketSub = axon.socket('pull');
const WebpackDevServer = require('webpack-dev-server');

const express = require('express');
const bodyParser = require('body-parser');

const getConfig = require('./webpack.config');
const logger = require('./src/lib/logger');
const kill = require('./src/kill/thread-kill');
const configs = require('./src/configs');

const { isWinPlatform, getPortFromParams } = require('./src/utils');

const argvs = minimist(process.argv.slice(2));
const port = argvs.p || argvs.port || 8000;

const commandParams = process.argv.splice(2);
const currentPath = process.cwd();

const app = express();
const router = express.Router();

const npm = configs.NPM;  // npm的安装命令

app.use('/api', router);
app.use('/test', router);
app.use('/saveReadme', router);

let worker = null;

const config = getConfig({
    port: port || 8000
});

// https://segmentfault.com/a/1190000006964335
const webpackDevServer = new WebpackDevServer(webpack(config), {

    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,

    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },

    compress: true,

    proxy: {
        '/api': 'http://localhost:' + port,
        '/test': 'http://localhost:' + port
    },

    staticOptions: {

    },

    quiet: true,
    noInfo: true,
    headers: { 'X-Custom-Header': 'yes' },
    stats: { colors: true },
    before: function (app) {
        app.use(bodyParser.json());

        // 对组件内容嵌入模板
        app.get('/src/web/react.html', componentStackPage);
        app.get('/src/web/react-mobile.html', componentStackPage);
        app.get('/src/web/vue.html', componentStackPage);
        app.get('/src/web/vue-mobile.html', componentStackPage);
        app.get('/src/web/jquery.html', componentStackPage);
        app.get('/src/web/jquery-mobile.html', componentStackPage);
        app.get('/src/web/angular.html', componentStackPage);
        app.get('/src/web/angular-mobile.html', componentStackPage);

        function componentStackPage(req, res) {
            var componentName = req.query && req.query.c || '';
            if (componentName) {
                fs.readFile(path.resolve(__dirname, `./${req.path}`), 'utf8', (err, html) => {
                    fs.readFile(path.resolve(__dirname, path.resolve(__dirname, '.build/', componentName), './template.html'), 'utf8', (err, template) => {
                        try {
                            res.end(html.replace('<div id="template"></div>', template));
                        } catch(err) {
                            res.end(html);
                        }
                    });
                });
            } else {
                fs.readFile(path.resolve(__dirname, `./${req.path}`), 'utf8', (err, html) => {
                    try {
                        res.end(html);
                    } catch(err) {
                        res.end(err);
                    }
                });
            }
        }

        // mock数据接口
        app.get('/api', function (req, res) {
            // 读取本地mock数据路径
            fse.readJson(req.query.mockUri).then(mockObj => {
                res.json(mockObj);
            }).catch(err => {
                console.error(err)
            });
        });

        // mock数据接口
        app.post('/saveReadme', function (req, res) {

            if(!argvs.devpath) {
                res.json(
                    { success: false, result: '组件目录不能为空' }
                );
                return ;
            }

            let readMePath = path.join(argvs.devpath || '', req.body.appName, 'readme.md');

            fse.outputFile(readMePath, req.body && req.body.readmeContent).then(() => {
                res.json(
                    { success: true, result: '保存成功' }
                );
            }).catch(err => {
                res.json(
                    { success: false, result: '保存失败' }
                );
            })
        });

        // 单元测试脚本
        app.get('/test', function (req, res) {

            let componentName = req.query.componentName;
            let testFile = req.query.testFile || 'test.js';
            let testCommand = '';

            if (isWinPlatform()) {
                testCommand = `node ./node_modules/karma/bin/karma start --singleRun=true --file="./.build/${componentName}/test/${req.query.testFile}.js"`
                // testCommand = `.\\node_modules\\.bin\\mocha --compilers js:babel-core/register --no-deprecation .\\.build\\${componentName}\\test\\${req.query.testFile}`;
            } else {
                testCommand = `node ./node_modules/karma/bin/karma start --singleRun=true --file="./.build/${componentName}/test/${req.query.testFile}.js"`
                // testCommand = `./node_modules/.bin/mocha --compilers js:babel-core/register --no-deprecation ./.build/${componentName}/test/${req.query.testFile}`;
            }

            const testShell = childProcess.spawn(testCommand, [], {shell: true});
            let outputString = '';
            

            testShell.stdout.on('data', (data) => {
                outputString += data.toString();
                fse.outputFile('coverage/test.log', outputString);
            });

            testShell.stderr.on('data', (data) => {
                outputString += data.toString();
                outputString += 'JUST_ERROR';
                fse.outputFile('coverage/test.log', outputString);
            });

            testShell.on('exit', (code) => {
                outputString += `--JUST_END-- ${code}`;
                fse.outputFile('coverage/test.log', outputString);
                testShell.kill();
            });

            // 如果不存在目录，则创建目录
            if (!fse.pathExistsSync('coverage/')) {
                fse.mkdirpSync('coverage/')
            }
            fse.outputFile('coverage/test.log', '', function() {
                res.json({
                    success: 'loading'
                })
            })
        });

        app.get('/test/log', function(req, res) {
            const result = fse.readFileSync('coverage/test.log', 'utf-8')
            let success = 'loading';
            if (/JUST_ERROR/.test(result) || /AssertionError/.test(result)){
                success = false
            } else if (/JUST_END/.test(result)) {
                success = true
            }
            res.json({
                success: success,
                result: result
            })
        });

        // ESLint某些目录
        app.get('/eslint', function (req, res) {

            let componentName = req.query.componentName;
            let lintCommand = '';
    
            let componentDir = path.join(argvs.devpath, componentName);
    
            if (isWinPlatform()) {
                lintCommand = `node .\\node_modules\\eslint\\bin\\eslint ${componentDir} --ext .jsx --ext .js --fix --quiet`;
            } else {
                lintCommand = `node ./node_modules/eslint/bin/eslint ${componentDir} --ext .jsx --ext .js --fix --quiet`;
            }

            childProcess.exec(lintCommand, (error, stdout, stderr) => {

                // eslint是否运行通过
                if (error) {
                    logger(`childProcess.exec error: ${error}`, 'magenta');
                    res.json({ success: false, result: JSON.stringify(error) });
                    return;
                }
                res.json({ success: true, result: stdout });
            });
        });

        // 运行自定义脚本
        app.get('/script', function (req, res) {

            let componentName = req.query.componentName;
            let scriptFile = req.query.scriptFile || '';
            let scriptCommand = req.query.scriptCommand || 'node';

            if (isWinPlatform()) {
                scriptCommand = `${scriptCommand} .\\.build\\${componentName}\\${req.query.scriptFile}`;
            } else {
                scriptCommand = `./node_modules/.bin/${scriptCommand} ./.build/${componentName}/${req.query.scriptFile}`;
            }

            childProcess.exec(scriptCommand, (error, stdout, stderr) => {
                // 目前根据测试结果的标识判断是否测试通过
                if (stdout.indexOf('Error') > -1) {
                    res.json({ success: false, result: stdout });
                } else if (stdout.indexOf('passing') > -1) {
                    res.json({ success: true, result: stdout });
                } else {
                    if (error) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: JSON.stringify(error) });
                        return;
                    }
                    res.json({ success: true, result: stdout });
                }
            });
        });

        // 在工作目录下运行脚本，webapp
        app.get('/webapp/script', function (req, res) {

            let webappName = req.query.webappName || '';
            let webappCommand = req.query.webappCommand || '';
        
            let cdDisk = '';

            if(argvs.devpath && webappName) {
                // 如果匹配到windows环境的盘符，则需要转盘符
                if (/(\w:)/ig.test(argvs.devpath)) {
                    cdDisk = argvs.devpath.match(/(\w:)/gi)[0] + ' && ';
                }
                let devpath = path.join(argvs.devpath, webappName)
                if (isWinPlatform()) {
                    webappCommand = `cd "${devpath}" && ${cdDisk} ${webappCommand}`;
                } else {
                    webappCommand = `cd "${devpath}" && ${cdDisk} ${webappCommand}`;
                }
            } else {
                res.json({ success: false, result: '没有找到应用名称' });
            }
            
            logger(`running ${webappCommand}`, 'cyan');
            
            if (worker) {
                // https://github.com/nuintun/command-manager/blob/master/bin/thread-kill.js
                // 结束掉正在进行的进程
                kill(worker.pid, 'SIGKILL', () => {
                    startShell();
                })
            } else {
                startShell();
            }

            function startShell() {
                worker = childProcess.exec(webappCommand, (error, stdout, stderr) => {
                    // 目前根据测试结果的标识判断是否测试通过
                    if (stdout.indexOf('Error') > -1) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: stdout });
                    } else if (stdout.indexOf('passing') > -1) {
                        logger(`childProcess.exec error: ${stdout}`, 'magenta');
                        res.json({ success: true, result: stdout });
                    } else {
                        if (error) {
                            logger(`childProcess.exec error: ${error}`, 'magenta');
                            res.json({ success: false, result: JSON.stringify(error) });
                            return;
                        }
                        res.json({ success: true, result: stdout });
                    }
                });
            }
        });

        // 在工作目录下停止脚本运行，webapp
        app.get('/webapp/stop', function (req, res) {
            
            if (worker) {
                // https://github.com/nuintun/command-manager/blob/master/bin/thread-kill.js
                // 结束掉正在进行的进程
                kill(worker.pid, 'SIGKILL', () => {
                    res.json({ success: true, result: '已停止' });
                });
            } else {
                res.json({ success: true, result: '已停止' });
            }
        });

        // 构建组件
        app.get('/component/build', function (req, res) {
            
            let componentName = req.query.componentName || '';
        
            // 使用一个子进程进入服务器目录并启动组件服务
            if (!componentName) {
                res.json({ success: false, result: '请输入要打包的组件名称，输入例如：just build ComponentName' });
                return;
            }

            let componentDir = path.join(argvs.devpath, componentName);

            if (!componentDir) {
                res.json({ success: false, result: '输入的组件名称不正确，任务即将跳过' });
                return;
            }

            childProcess.exec(`node "./command/build-es5" --src "${currentPath}" --dist "${componentDir}" --name "${componentName}"`, (error, stdout, stderr) => {

                // 目前打包结果的标识判断是否通过
                if (stdout.indexOf('Error') > -1) {
                    res.json({ success: false, result: stdout });
                } else if (stdout.indexOf('passing') > -1) {
                    res.json({ success: true, result: stdout });
                } else {
                    if (error) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: JSON.stringify(error) });
                        return;
                    }
                    res.json({ success: true, result: stdout });
                }
            });
        });

        // 添加依赖
        app.get('/component/dependencies/add', function (req, res) {
    
            let componentName = req.query.componentName || '';
            let packageName = req.query.packageName || '';
            let packageVersion = req.query.packageVersion || '';
            let packageInfo = `${packageName}@${packageVersion}`;

        
            // 使用一个子进程进入服务器目录并启动组件服务
            if (!packageName || !packageVersion) {
                res.json({ success: false, result: '包名称或版本号均不能为空' });
                return;
            }

            let componentDir = path.join(argvs.devpath, componentName);

            if (!componentDir) {
                res.json({ success: false, result: '输入的组件名称不正确，任务即将跳过' });
                return;
            }

            let packageJson = fse.readJSONSync(path.resolve(componentDir, 'package.json'));

            packageJson.dependencies = packageJson.dependencies || {};
            packageJson.dependencies[packageName] = `^${packageVersion}`;

            fse.outputJson(path.resolve(componentDir, 'package.json'), packageJson, {
                encoding: 'utf8',
                spaces: 4
            }, (err, data) => {
                if (err) {
                    res.json({ success: false, result: '写入依赖信息失败' });
                }

                childProcess.exec(`${npm} install ${packageInfo}`, (error, stdout, stderr) => {
                    // 目前打包结果的标识判断是否通过
                    if (stdout.indexOf('Error') > -1) {
                        res.json({ success: false, result: stdout });
                    } else if (stdout.indexOf('passing') > -1) {
                        res.json({ success: true, result: stdout });
                    } else {
                        if (error) {
                            logger(`childProcess.exec error: ${error}`, 'magenta');
                            res.json({ success: false, result: JSON.stringify(error) });
                            return;
                        }
                        res.json({ success: true, result: stdout });
                    }
                    logger(`组件依赖安装成功.`, 'cyan');
                });
            });
        });

        // 移除依赖
        app.get('/component/dependencies/remove', function (req, res) {

            let componentName = req.query.componentName || '';
            let packageName = req.query.packageName || '';
            let packageVersion = req.query.packageVersion || '';
            let packageInfo = `${packageName}@${packageVersion}`;

        
            // 使用一个子进程进入服务器目录并启动组件服务
            if (!packageName || !packageVersion) {
                res.json({ success: false, result: '包名称或版本号均不能为空' });
                return;
            }

            let componentDir = path.join(argvs.devpath, componentName);

            if (!componentDir) {
                res.json({ success: false, result: '输入的组件名称不正确，任务即将跳过' });
                return;
            }

            let packageJson = fse.readJSONSync(path.resolve(componentDir, 'package.json'));

            packageJson.dependencies = packageJson.dependencies || {};
            delete packageJson.dependencies[packageName];

            fse.outputJson(path.resolve(componentDir, 'package.json'), packageJson, {
                encoding: 'utf8',
                spaces: 4
            }, (err, data) => {
                if (err) {
                    res.json({ success: false, result: '写入依赖信息失败' });
                }

                childProcess.exec(`${npm} remove ${packageInfo}`, (error, stdout, stderr) => {
                    // 目前打包结果的标识判断是否通过
                    if (stdout.indexOf('Error') > -1) {
                        res.json({ success: false, result: stdout });
                    } else if (stdout.indexOf('passing') > -1) {
                        res.json({ success: true, result: stdout });
                    } else {
                        if (error) {
                            logger(`childProcess.exec error: ${error}`, 'magenta');
                            res.json({ success: false, result: JSON.stringify(error) });
                            return;
                        }
                        res.json({ success: true, result: stdout });
                    }
                    logger(`组件依赖移除成功.`, 'cyan');
                });
            });
        });

        // 查看包版本号
        app.get('/package/info', function (req, res) {

            let packageName = req.query.packageName;

            if (!packageName) {
                res.json({ success: false, result: '查询包名不能为空' });
                return;
            }

            let scriptCommand = `${configs.NPM} info ${packageName}  versions --json`;

            childProcess.exec(scriptCommand, (error, stdout, stderr) => {
                // 根据结果判断运行是否成功
                if (stdout.indexOf('Error') > -1) {
                    res.json({ success: false, result: stdout });
                } else {
                    if (error) {
                        logger(`childProcess.exec error: ${error}`, 'magenta');
                        res.json({ success: false, result: JSON.stringify(error) });
                        return;
                    }
                    res.json({
                        success: true,
                        result: JSON.parse(stdout.match(/\[(?=[^\[]+$)(\t|\n|\s|.)+(?=\])\]/)[0])  // 懒惰匹配包的所有版本号
                    });
                }
            });
        });
    }
});

/**
 * 启动dev服务器
 * 
 */
function _startWebpackDevServer() {
    webpackDevServer.listen(port, 'localhost', function (err, result) {
        // 延时启动 
        if (err) {
            return console.log(err);
        }
    });
}

function _bindZmq() {
    // 监听watch服务命令
    socketSub.bind(configs.SOCKET_URL);

    socketSub.on('message', function (action) {
        switch (action) {
            // 当调试服务运行watch时，重启webpackDevServer
            case 'watch':
                process.exit(-1);
                break;
            default:
                break;
        }
    });
}

_startWebpackDevServer();

_bindZmq();