
/* 开启文件同步并设置源代码目录文件监听
 */

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');
const logger = require('./lib/logger');
const chokidar = require('chokidar');
const jsdoc2md = require('jsdoc-to-markdown');

const configs = require('./configs');

/**
 * 读取组件下的文件。同步到服务调试目录，并进行监听
 * 
 * @param {any} componentDir 组件所在的路径
 */
function fileAsync(serverPath, componentDir, currentPath) {
    let componentName;
    let cdDisk = '';
    
    // 如果匹配到windows环境的盘符，则需要转盘符
    if (/(\w:)/ig.test(serverPath)) {
        cdDisk = serverPath.match(/(\w:)/gi)[0] + ' && ';
    }
    // 处理mac和windows系统差异性
    // if (componentDir.indexOf('/') > -1) {
    //     componentName = componentDir.split('/');
    // } else {
    //     componentName = componentDir.split('\\');
    // }

    componentName = componentDir.replace(currentPath, '').slice(1).replace(/\\/ig, '/').toLowerCase();


    fse.ensureDirSync(path.join(serverPath, configs.BUILD_PATH));

    fse.ensureDirSync(path.join(serverPath, configs.BUILD_PATH, componentName));

    fse.copy(componentDir, path.join(serverPath, configs.BUILD_PATH, componentName), {
        // 过滤node_modules不拷贝
        filter: function (src, dest) {
            if (src.indexOf('node_modules') >= 0) {
                return false;
            }
            return true;
        }
    }, () => {
        _createTemlateFile(serverPath, componentDir, componentName);
    });

    // https://www.npmjs.com/package/chokidar
    chokidar.watch(componentDir, {
        persistent: true,
        ignored: /(node_modules)|(lib)/ig,
        ignoreInitial: false,
        followSymlinks: true,
        cwd: '.',
        disableGlobbing: false,
        usePolling: true,
        interval: 400,
        binaryInterval: 400,
        alwaysStat: false,
        depth: 99,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        },
        ignorePermissionErrors: false,
        atomic: true    // or a custom 'atomicity delay', in milliseconds (default 100)
    }).on('change', (function (filePath, stats) {
        logger(filePath + ' saved.', 'cyan');

        // 目前使用全部拷贝的方式，重新拷贝组件。理想情况是只拷贝修改的文件，待优化
        fse.copy(this.componentDir, path.join(serverPath, configs.BUILD_PATH, this.componentName), {
            // 过滤node_modules不拷贝
            filter: function (src, dest) {
                if (src.indexOf('node_modules') >= 0) {
                    return false;
                }
                return true;
            }
        }, () => {
            
            // 如果修改的是入口文件或者src内的文件，支持组件入口文件
            if (filePath.indexOf('index.js') > -1 || filePath.indexOf('src') > -1) {
                jsdoc2md.render({ files: filePath }).then((output) => {
                    _UpdateReadmeContent(this.componentDir, this.componentName, output);
                });

                // 如果修改了组件js，则需要重新build组件
                // logger(`running: 开始build ${this.componentName} 组件...`, 'cyan');
                // childProcess.exec(`cd "${serverPath}" && ${cdDisk} node "./command/build-es5" --src "${serverPath}" --dist "${this.componentDir}" --name "${this.componentName}"`, (error, stdout, stderr) => {
                //     if (error) {
                //         logger(`childProcess.exec error: ${error}`, 'magenta');
                //         return;
                //     }
                //     if (stderr) {
                //         logger(`warning: ${stderr}`, 'magenta');
                //     }
                //     logger(`stdout: ${stdout}`, 'cyan');
                //     logger(`Es5组件构建任务完成.`, 'green');
                // });
            }

            // 获取readme中的内容并处理写入到服务器端文件
            _processReadmeContent(_parseReadmeContent(this.componentDir, this.componentName), this.serverPath, this.componentName);
        });

    }).bind({ componentName, componentDir, serverPath }));
}

/**
 * 写入组件的调试应用模板文件
 * 
 * @param {any} serverPath 调试服务器目录
 * @param {any} componentDir 组件目录
 * @param {any} componentName 组件名称
 */
function _createTemlateFile(serverPath, componentDir, componentName) {

    // 如果存在package.json，则创建组件信息文件
    let existPackageJson = fse.pathExistsSync(path.join(componentDir + '/', 'package.json'));
    
    if (existPackageJson) {

        // 根据package中输入的template名称来选取模板生成文件
        const packageInfo = fse.readJsonSync(path.join(componentDir + '/', 'package.json'));
        
        // 如果是应用或没有模板，则跳过模板生成
        if (packageInfo.template === 'webapp' || !packageInfo.template) {
            return ;
        }
        
        // 生成文件
        const componentNameArray = componentName.split('/');

        let codeTemplate = (require(`./lib/template/${packageInfo.template}`))(componentNameArray[componentNameArray.length - 1]);
        if (packageInfo['component-template']) {
            codeTemplate = (require(`./lib/template/${packageInfo['component-template']}`))(componentNameArray[componentNameArray.length - 1]);
        }
    
        // 获取readme中的内容并处理写入到服务器端文件
        _processReadmeContent(_parseReadmeContent(componentDir, componentName), serverPath, componentName, componentDir);
    
        // 如果获取到的文件名不为空则复制文件到服务器目录下
        fse.outputFile(path.join(serverPath + '/.build', componentName) + '.js', codeTemplate, (err) => {
            if (err) throw err;
            logger(`${componentName} component files has been created successfully.`, 'cyan');
        });
    }
}

/**
 * 自动跟新readme的文档
 * 
 * @param {any} componentDir  组件目录
 * @param {any} componentName  组件名称
 * @param {any} jsdoc 自动生成的文档内容
 */
function _UpdateReadmeContent(componentDir, componentName, jsdoc) {

    // 如果获取到的文件名不为空则复制文件到服务器目录下，懒惰匹配
    // 如果获取到的文件名不为空则复制文件到服务器目录下，懒惰匹配
    const htmlReg = /```html((\t|\n|\s|.)+?)```/;
    const cssReg = /```css((\t|\n|\s|.)+?)```/;
    const jsReg = /```javascript((\t|\n|\s|.)+?)```/;

    let contentJson = {
        js: '',
        html: '',
        css: ''
    };

    if (componentName && fse.pathExistsSync(path.join(componentDir + '/', 'README.md'))) {

        let data = fs.readFileSync(path.join(componentDir + '/', 'README.md'), 'utf-8');
        // 分别匹配readme中的html、js、css，如果匹配到则添加到返回列表中
        let htmlContentArr = data.match(htmlReg);
        let cssContentArr = data.match(cssReg);
        let jsContentArr = data.match(jsReg);

        if (htmlContentArr && htmlContentArr.length) {
            contentJson.html = htmlContentArr[1];
        }

        if (cssContentArr && cssContentArr.length) {
            contentJson.css = cssContentArr[1];
        }

        if (jsContentArr && jsContentArr.length) {
            contentJson.js = jsContentArr[1];
        }

        let newDocs =`
\`\`\`html${contentJson.html}\`\`\`

\`\`\`css${contentJson.css}\`\`\`

\`\`\`javascript${contentJson.js}\`\`\`

#### 详细文档
---

${jsdoc}

`;
        fse.outputFileSync(path.join(componentDir + '/', 'readme.md'), newDocs, 'utf-8');
    }
}

/**
 * 分析readme的内容
 * 
 * @param {any} componentDir  组件目录
 * @param {any} componentName  组件名称 
 */
function _parseReadmeContent(componentDir, componentName) {

    // 如果获取到的文件名不为空则复制文件到服务器目录下，懒惰匹配
    const htmlReg = /```html((\t|\n|\s|.)+?)```/;
    const cssReg = /```css((\t|\n|\s|.)+?)```/;
    const jsReg = /```javascript((\t|\n|\s|.)+?)```/;

    let contentJson = {
        js: '',
        html: '',
        css: ''
    };

    if (componentName && fse.pathExistsSync(path.join(componentDir + '/', 'README.md'))) {
        
        let data = fs.readFileSync(path.join(componentDir + '/', 'README.md'), 'utf-8');

        // 分别匹配readme中的html、js、css，如果匹配到则添加到返回列表中
        let htmlContentArr = data.match(htmlReg);
        let cssContentArr = data.match(cssReg);
        let jsContentArr = data.match(jsReg);

        if (htmlContentArr && htmlContentArr.length) {
            contentJson.html = htmlContentArr[1];
        }

        if (cssContentArr && cssContentArr.length) {
            contentJson.css = cssContentArr[1];
        }

        if (jsContentArr && jsContentArr.length) {
            contentJson.js = jsContentArr[1];
        }
    }

    return contentJson;
}

/**
 * 处理readme中的内容，进行解析写入文件
 * 
 * @param {any} readMeContent readme内容
 * @param {any} serverPath 调试服务器路径
 * @param {any} componentName 组件名称
 * @param {any} componentDir 组件目录
 */
function _processReadmeContent(readMeContent, serverPath, componentName, componentDir){
    // 如果存在package.json，则创建组件信息文件
    let existPackageJson = fse.pathExistsSync(path.join(componentDir + '/', 'package.json'));
    let defaultEntry = './index';  // 默认调试的入口文件问'./index'
    
    if (existPackageJson) {
        // 根据package中输入的template名称来选取模板生成文件
        const packageInfo = fse.readJsonSync(path.join(componentDir + '/', 'package.json'));

        // 如果有main，则默认使用main的文件入口
        if (packageInfo.main) {
            existPackageJson = packageInfo.main;
        }
    }

    const defaultJs = `import _Component from '${defaultEntry}';
export default <_Component/>`;

    // 如果readme中的js部分有内容，则直接写入entry.js里面进行调试
    if(readMeContent.js && /\w+/g.test(readMeContent.js)) {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'entry') + '.js', readMeContent.js);
    } else {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'entry') + '.js', defaultJs);
    }
    // 如果readme中的js部分有内容，则直接写入style.less里面进行调试
    if(readMeContent.css && /\w+/g.test(readMeContent.css)) {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'style') + '.less', readMeContent.css);
    } else {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'style') + '.less', '');
    }

    // 如果readme中的js部分有内容，则直接写入template.js里面进行调试
    if(readMeContent.html && /\w+/g.test(readMeContent.html)) {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'template.html'), `${readMeContent.html}`);
    } else {
        fse.outputFileSync(path.join(serverPath + '/.build', componentName, 'template.html'), '');
    }
}

module.exports = fileAsync;