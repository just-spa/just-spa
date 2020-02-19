## 开发指南

#### 一、安装使用调试

&emsp;&emsp;进入项目根目录，执行

```
$ npm i  # 使用npm（不要使用tnpm）安装所需要的npm包， 如果部分包安装失败，则单独安装

$ npm run dev # 使用微信开发者工具打开项目下的 dist 目录 (源码修改将自动同步到/dist目录中，并在开发者工具自动刷新。)

$ npm run build

```

#### 二、项目结构

- 目录介绍

```
项目关键目录和文件说明
|--project/                     # 根目录
    |--src/                     # 源码目录
        |--biz-components/      # 业务组件。遵循业务逻辑组件flux规范
            |--bizcomponent1/
            |--bizcomponent2/
        |--components/          # UI组件。遵循业务UI组件规范
            |--component1/
            |--component2/
        |--common/              # 底层封装目录，例如request、utils等
        |--image/               # 图片资源等
        |--libs/                # 公共库、例如redux、lodash等
        |--miniprogram_npm      # 小程序npm目录
        |--pages/               # page层目录
            |--index-page/
        |--reducers/            # 页面reducers管理
        |--app.js               # 应用入口
        |--app.json             # 应用配置
        |--app.less             # 应用样式
        |--initStore.js         # 初始化redux store
        |--project.config.json
    |--dist/                    # 编译生成目录
    |--docs/                    # 文档
    |--gulpfile.js              # 构建文件
    |--tsconfig.json            # ts配置
    |--readme.md

```

#### 三、项目架构分层

&emsp;&emsp;小程序应用结构自顶向下分为 Page -> biz-component -> components -> atom components。
