
## 开发指南

#### 一、安装使用调试

&emsp;&emsp;进入项目根目录，执行

```
$ npm i  # 使用npm（不要使用tnpm）安装所需要的npm包， 如果部分包安装失败，则单独安装

$ npm run dev # 启动开发调试，并访问 http://localhost:3000/www/index.html

$ npm run release # 编译项目并打包生成tar.gz包

```

#### 二、项目结构

- 目录介绍

```
root/
    |-src/
        |-mock/             # 应用mock数据目录
        |-components/       # 业务组件目录
        |-containers/       # 路由对应的container组件
        |-entry/            # 业务对应的入口编译文件，在webpack.config中自动读取，无需读取
        |-html/             # 前端html文件模板
        |-less/             # 页面引入的less
        |-reducers/         # reducers文件
        |-utils/            # 工具文件目录
    |-dev                   # 调试文件编译目录
    |-build                 # build发布前编译目录
    |-pkg                   # 生成的编译压缩包tar.gz目录
    |-GulpFile.js           # gulp 任务配置
    |-webpack.config.js     # webpack 配置文件
```

#### 三、项目架构分层

&emsp;&emsp;页面组件分层逻辑和图如下：html-> entry -> container -> components -> common(公用组件) -> atom components(react-bootstrap)

#### 四、开发完成后发布测试

&emsp;&emsp;使用run run release打包完成后，生成的包在项目 /pkg目录下，打开下面织云发布地址（如果没权限请先发布权限）

/\/www\/js\/(\S+?)\_\S+?\.js/  E:/BizRd-trunk-base/www-base-fe/root/dev/www/js/$1.js


