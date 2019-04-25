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
 * @param  {[type]} webappInfo [description]
 * @param  {[type]} webappPath [description]
 * @return {[type]}               [description]
 */
function _copyWebappFromTemplate(webappInfo, webappPath) {
    return fse.copy(__dirname + `/${webappInfo.template}/`, `${webappPath}`);
}

/**
 * 创建项目
 * @param  {[type]} webappInfo [description] 项目相关信息
 * @param  {[type]} currentPath [description] 当前路径
 * @return {[type]}               [description] 
 */
function createWebapp(webappInfo, currentPath, callback) {

    let webappPath = currentPath + '/' + webappInfo.name;

    fse.pathExists(webappPath, function (exists) {
        // 如果目录存在则开始写文件， 否则提示不存在
        if (exists) {
            logger(webappPath + ' 已存在，直接创建项目', 'magenta');
        } else {
            fse.mkdirsSync(webappPath);
            logger(webappPath + '  项目目录创建成功!', 'magenta');
        }
        _copyWebappFromTemplate(webappInfo, webappPath).then(callback.bind(this, webappInfo.name));
    });
}

/**
 * 上传创建自定义物料库
 * 
 * @param {any} templateInfo 物料信息
 * @param {any} serverPath 调试服务器目录
 * @param {any} templatesJson 物料库所有物料信息
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
    if (['react', 'vue', 'angular'].indexOf(templateInfo.stack) < 0) {
        newTemplateInfo.stack = 'jquery';
    }

    let newTemplatesJson = Object.assign({}, templatesJson);
    let newTemplateKey = Object.keys(newTemplatesJson).length + 1;
    let templatesJsonPath = path.join(templatesPath, 'template-source/template.json');
    let templateSourcePath = path.join(templatesPath, `template-source/${newTemplateInfo.name}`);
    let templateEntryPath = path.join(templatesPath, `template/${newTemplateInfo.name}.js`);

    newTemplatesJson[newTemplateKey] = newTemplateInfo;

    // 监测物料库名称重复
    for (let key in templatesJson) {
        if (templatesJson[key].name === newTemplateInfo.name) {
            logger('物料库名称已存在', 'red');
            return;
        }
    }

    // 检查写入物料库配置文件
    if (!fse.pathExistsSync(templatesJsonPath)) {
        logger('物料库配置文件不存在，创建自定义物料库失败', 'red');
        return;
    }

    // 检查输入的物料目录是否为空，且含有generator.json
    if (!fse.pathExistsSync(templateInfo.directory) || !fse.pathExistsSync(path.join(templateInfo.directory, 'generator.json'))) {
        logger('物料库目录不存在或没有找到generator.json', 'red');
        return;
    }

    try {
        // 更新物料库配置文件
        fse.outputJsonSync(templatesJsonPath, newTemplatesJson, {
            spaces: 4
        });
        logger('物料库配置文件写入成功', 'green');

        // 上传物料库文件
        fse.copySync(templateInfo.directory, templateSourcePath);

        // 写入模板入口文件，默认添加技术栈，否则使用空白模板
        fse.copySync(path.join(templatesPath, `template/${newTemplateInfo.stack || 'custom'}-template.js`), templateEntryPath);

        logger('自定义物料库创建成功，使用just list查看可使用的物料库', 'green');

    } catch (e) {
        logger('物料库配置文件不存在，创建自定义物料库失败', 'red');
    }
}


/**
 * 删除自定义上传的物料库
 * 
 * @param {any} templateName 物料名称
 * @param {any} serverPath 调试服务器目录
 * @param {any} templatesJson 物料库所有物料信息
 */
function removeTemplate(templateName, serverPath, templatesJson) {

    const templatesPath = path.join(serverPath, 'src/lib');

    if (templateName.indexOf('-template') < 0) {
        templateName = `${templateName}-template`;
    }

    let newTemplatesJson = Object.assign({}, templatesJson);
    let templatesJsonPath = path.join(templatesPath, 'template-source/template.json');
    let templateSourcePath = path.join(templatesPath, `template-source/${templateName}`);
    let templateEntryPath = path.join(templatesPath, `template/${templateName}.js`);

    // 模板配置中找到对应物料名称并删除
    for (let key in newTemplatesJson) {
        if (newTemplatesJson[key].name === templateName || newTemplatesJson[key].name === `${templateName}-template`) {

            // 判断是否自定义物料库，自定义物料库的owner为all
            if (newTemplatesJson[key].owner === 'all') {
                delete newTemplatesJson[key];
                // 更新物料库配置文件
                fse.outputJsonSync(templatesJsonPath, newTemplatesJson, {
                    spaces: 4
                });
                logger('物料库配置文件删除完成', 'cyan');
            } else {
                logger(`${templateName}不是自定义物料库，没有权限删除!`, 'red');
                return;
            }
        }
    }

    // 站到物料库配置文件
    if (fse.pathExistsSync(templateSourcePath)) {
        fse.remove(templateSourcePath, () => {
            logger('找到物料库配置文件，删除完成', 'red');
        });
    } else {
        logger('未找到物料库配置文件，可能已被删除', 'cyan');
    }

    if (fse.pathExistsSync(templateEntryPath)) {
        fse.remove(templateEntryPath, () => {
            logger('找到物料库入口文件，删除完成', 'red');
        });
    } else {
        logger('未找到物料库入口文件，可能已被删除', 'cyan');
    }
}

const webappAction = {
    createWebapp,
    createTemplate,
    removeTemplate
};

module.exports = webappAction;
