'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const logger = require('../logger');

/**
 * __dirname: nodejs脚本所在的目录
 * path.resolve('./'): 终端打开的当前目录
 * process.execPath: node的安装路径
 * process.cwd()：当前程序执行的路径,和path.resolve('./')一样
 * @param  {[type]} componentInfo [description]
 * @param  {[type]} componentPath [description]
 * @return {[type]}               [description]
 */
function _writeComponent(componentInfo, componentPath) {
    const currentPath = process.cwd();

    let realTemplate = componentInfo['component-template'] || componentInfo.template;

    let generatorJsonPath = __dirname + `/${realTemplate}/generator.json`;

    let generatorJson, generatorJsonFileList;
    let promises = [], promise, filePromises = [];
    
    if(fse.pathExistsSync(generatorJsonPath)) {
        generatorJson = fse.readJsonSync(generatorJsonPath);
    } else {
        logger(`未找到组件物料配置文件：generator.json`, 'red');
        return;
    }

    generatorJsonFileList = (generatorJson.statics || []).concat(generatorJson.templates)

    // 将generator中的静态路径和模板路径放在一起
    const fileList = generatorJsonFileList.map((filePath) => {
        return __dirname + `/${realTemplate}/${filePath}`;
    });

    for (let filePath of fileList){
        let fileName = filePath.replace(__dirname + `/${realTemplate}/`, '');
        
        // 不再写package.json，单独_writePackageJson写入
        if (filePath.indexOf('package.json') > - 1) {
            continue ;
        }

        // 创建文件的promise
        filePromises.push((new Promise((resolve, reject) => {
                // 如果文件不存在，则输出提示
                if(fse.pathExistsSync(filePath)) {
                    fs.readFile(filePath, {
                        encoding: 'utf8'
                    }, function(err, data) {
                        if (err) throw err;
                        
                        // 替换模板内容
                        if(_fileIsInTemplate(filePath, generatorJson.templates)) {
                            // 模板文件内容替换
                            for(let key in generatorJson.templateData) {
                                let reg = new RegExp('\\$\{\\'+ key +'\\}', 'g');
                                data = data.replace(reg, componentInfo[generatorJson.templateData[key]]);
                            }
                        }

                        resolve(data);
                    });
                } else {
                    reject(filePath);
                }
            })).then((data) => {
                return new Promise((resolve, reject) => {
                    logger(`creating ${componentPath}/${fileName}`, 'cyan');
                    fse.outputFile(`${componentPath}/${fileName}`, data, {
                        encoding: 'utf8'
                    }, function(err, data) {
                        if (err) throw err;
                        resolve();
                    });
                });
            }, (filePath) => {
                logger(`${filePath}组件物料文件不存在，请确认是否被系统ignore配置忽略`, 'magenta');
            })
        );
    }

    _writePackageJson(componentPath + '/package.json', componentInfo);

    // 结束promise
    return Promise.all(filePromises).then(() => {
        return new Promise((resolve, reject) => {
            logger('Component created complete!', 'green');
            resolve();
        }, () => {
            reject();
            process.exit(1);
        });
    });
}

/**
 * 判断文件是否是模板
 * 
 * @param {any} filePath 
 * @param {any} template 
 * @returns 
 */
function _fileIsInTemplate(filePath, template) {

    for (let templateFile of template) {
        if(filePath.indexOf(templateFile) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * 创建组件的package.json信息
 * 
 * @param {any} jsonPackagePath 文件路径
 * @param {any} componentInfo 命令行交互输入的组件信息
 */
function _writePackageJson(jsonPackagePath, componentInfo) {

    let packageJsonTemplate = {};

    
    let realTemplate = componentInfo['component-template'] || componentInfo.template;

    const templatePackageJsonPath = __dirname + `/${realTemplate}/package.json`;

    if(fse.pathExistsSync(templatePackageJsonPath)) {
        // 如果组件物料库中存在package.json，需带上组件物料中默认信息
        let packageJson = fse.readJsonSync(templatePackageJsonPath);
        packageJsonTemplate = Object.assign({}, packageJson, {
            'name': componentInfo.lineThroughName,
            'version': componentInfo.version,
            'template': componentInfo.template,
            'component-template': componentInfo['componentInfo'],
            'stack': componentInfo.stack,
            'preview-image': '',
            'author': componentInfo.author,
            'description': componentInfo.description,
            'license': componentInfo.license
        });
    } else {

        // 如果不存在package.json，则使用默认的生成配置
        packageJsonTemplate = {
            'name': componentInfo.lineThroughName,
            'version': componentInfo.version,
            'template': componentInfo.template,
            'component-template': componentInfo['componentInfo'],
            'preview-image': '',
            'main': 'index',  // 默认入口文件为index.js或index.jsx
            'stack': componentInfo.stack,
            'scripts': {
                'test': '',
                'start': ''
            },
            'author': componentInfo.author,
            'description': componentInfo.description,
            'license': componentInfo.license
        };
    }

    fse.outputJson(jsonPackagePath, packageJsonTemplate, {
        encoding: 'utf8',
        spaces: 4
    }, function(err, data) {
        if (err) throw err;
        logger(`creating ${jsonPackagePath}`, 'cyan');
    });
}

/**
 * 创建组件
 * @param  {[type]} componentInfo [description] 组件相关信息
 * @param  {[type]} currentPath [description] 当前路径
 * @return {[type]}               [description] 
 */
function createComponent(componentInfo, currentPath, callback) {

    // 计算生成组件名的中划线格式
    componentInfo.lineThroughName = componentInfo.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

    let componentPath = currentPath + '/' + componentInfo.lineThroughName;

    fse.pathExists(componentPath, function(exists) {
        // 如果目录存在则开始写文件， 否则提示不存在
        if (exists) {
            logger(componentPath + ' 已存在，直接创建组件', 'magenta');
        } else {
            fse.mkdirsSync(componentPath);
            logger(componentPath + '  组件目录创建成功!', 'magenta');
        }
        _writeComponent(componentInfo, componentPath).then(callback.bind(this, componentInfo.lineThroughName));
    });
}

/**
 * 上传创建自定义组件物料库
 * 
 * @param {any} templateInfo 组件物料信息
 * @param {any} serverPath 调试服务器目录
 * @param {any} templatesJson 组件物料库所有组件物料信息
 */
function createTemplate(templateInfo, serverPath, templatesJson) {

    const templatesPath = path.join(serverPath, 'src/lib');
    
    let newTemplateInfo = {
        name: `${templateInfo.name}-template`,
        label: `${templateInfo.label}`,
        owner: `all`,
        stack: `${templateInfo.stack}`,
        description: `${templateInfo.description}`,
    };

    // 如果选择的不是react,vue,angular三大技术栈之一，则保存技术栈信息为jquery，代表jquery或原生项目
    if(['react', 'vue', 'angular'].indexOf(templateInfo.stack) < 0) {
        newTemplateInfo.stack = 'jquery';
    }

    let newTemplatesJson = Object.assign({}, templatesJson);
    let newTemplateKey = Object.keys(newTemplatesJson).length + 1;
    let templatesJsonPath = path.join(templatesPath, 'template-source/template.json');
    let templateSourcePath = path.join(templatesPath, `template-source/${newTemplateInfo.name}`);
    let templateEntryPath = path.join(templatesPath, `template/${newTemplateInfo.name}.js`);

    newTemplatesJson[newTemplateKey] =  newTemplateInfo;

    // 监测组件物料库名称重复
    for (let key in templatesJson) {
        if(templatesJson[key].name === newTemplateInfo.name) {
            logger('组件物料库名称已存在', 'red');
            return;
        }
    }

    // 检查写入组件物料库配置文件
    if (!fse.pathExistsSync(templatesJsonPath)) {
        logger('组件物料库配置文件不存在，创建自定义组件物料库失败', 'red');
        return ;
    }

    // 检查输入的组件物料目录是否为空，且含有generator.json
    if(!fse.pathExistsSync(templateInfo.directory) || !fse.pathExistsSync(path.join(templateInfo.directory, 'generator.json'))) {
        logger('组件物料库目录不存在或没有找到generator.json', 'red');
        return ;
    }

    try {
        // 更新组件物料库配置文件
        fse.outputJsonSync(templatesJsonPath, newTemplatesJson, {
            spaces: 4
        });
        logger('组件物料库配置文件写入成功', 'green');
    
        // 上传组件物料库文件
        fse.copySync(templateInfo.directory, templateSourcePath);
    
        // 写入模板入口文件，默认添加技术栈，否则使用空白模板
        fse.copySync(path.join(templatesPath, `template/${newTemplateInfo.stack || 'custom'}-template.js`), templateEntryPath);

        logger('自定义组件物料库创建成功，使用just list查看可使用的组件物料库', 'green');

    } catch(e) {
        logger('组件物料库配置文件不存在，创建自定义组件物料库失败', 'red');
    }
}


/**
 * 删除自定义上传的组件物料库
 * 
 * @param {any} templateName 组件物料名称
 * @param {any} serverPath 调试服务器目录
 * @param {any} templatesJson 组件物料库所有组件物料信息
 */
function removeTemplate(templateName, serverPath, templatesJson) {

    const templatesPath = path.join(serverPath, 'src/lib');

    if(templateName.indexOf('-template') < 0) {
        templateName = `${templateName}-template`;
    }

    let newTemplatesJson = Object.assign({}, templatesJson);
    let templatesJsonPath = path.join(templatesPath, 'template-source/template.json');
    let templateSourcePath = path.join(templatesPath, `template-source/${templateName}`);
    let templateEntryPath = path.join(templatesPath, `template/${templateName}.js`);

    // 模板配置中找到对应组件物料名称并删除
    for (let key in newTemplatesJson) {
        if(newTemplatesJson[key].name === templateName || newTemplatesJson[key].name === `${templateName}-template`) {

            // 判断是否自定义组件物料库，自定义组件物料库的owner为all
            if(newTemplatesJson[key].owner === 'all') {
                delete newTemplatesJson[key];
                // 更新组件物料库配置文件
                fse.outputJsonSync(templatesJsonPath, newTemplatesJson, {
                    spaces: 4
                });
                logger('组件物料库配置文件删除完成', 'cyan');
            } else {
                logger(`${templateName}不是自定义组件物料库，没有权限删除!`, 'red');
                return ;
            }
        }
    }

    // 站到组件物料库配置文件
    if (fse.pathExistsSync(templateSourcePath)) {
        fse.remove(templateSourcePath, () => {
            logger('找到组件物料库配置文件，删除完成', 'red');
        });
    } else {
        logger('未找到组件物料库配置文件，可能已被删除', 'cyan');
    }

    if (fse.pathExistsSync(templateEntryPath)) {
        fse.remove(templateEntryPath, () => {
            logger('找到组件物料库入口文件，删除完成', 'red');
        });
    } else {
        logger('未找到组件物料库入口文件，可能已被删除', 'cyan');
    }
}

const fileComponent = {
    createComponent,
    createTemplate,
    removeTemplate
};

module.exports = fileComponent;

