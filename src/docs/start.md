## Getting Started


&emsp;&emsp;Just-spa是一套前端组件工程化工具，可以帮助开发者对物料库进行调用处理，快速进行组件和应用的创建、开发、调试、打包构建，可管理的组件支持React、Vue、Angular或jquer等主流技术栈。从而提高组件管理和开发效率、统一组件规范并分离组件功能、减少人员变动给项目维护带来的额外成本。

&emsp;&emsp;相对于vue-cli，react-create-app等常用脚手架，Just-spa不仅根据业务实践提取了最佳实践的组件和项目物料模板，帮您快速生成各类组件和项目工程，而且对于组件和项目提供了便捷清晰的界面化预览、hot调试、管理、测试、打包、Mock等功能。当然，你也可以根据提供的规范快速地扩展自己需要使用的物料模板。


#### 1、安装just-spa

```
npm i just-spa -g
```

&emsp;&emsp;如果您设置了tnpm等代理命令，请使用 `tnpm i just-spa -g` 来安装。

#### 2、快速创建和调试一个组件

&emsp;&emsp;选择一个本地工作目录，打开终端执行：

```
just init
```

&emsp;&emsp;输入生成组件的相关信息，填写名称、物料库等，即可快速生成组件。创建组件完成后执行：

```
just watch
```

&emsp;&emsp;just watch会开启组件实时watch同步调试, 然后在相同目录中开启另一个终端执行：

```
just start
```

&emsp;&emsp;just start会启动调试服务器，此时just会自动拉起浏览器打开 http://localhost:8000 ，即可看到调试组件的列表并查看just工具的详细文档。如下：

&emsp;&emsp;![](/src/docs/img/preview.png)

&emsp;&emsp;点击一个组件进入就可以界面化调试、管理、测试、打包、Mock联调你的组件了。另外组件对应的文档也会使用jsdoc2md自动帮你生成。开发者只需要关注开发组件的代码就可以了。

&emsp;&emsp;![](/src/docs/img/preview1.png)

&emsp;&emsp;![](/src/docs/img/preview2.png)

&emsp;&emsp;![](/src/docs/img/preview3.png)


#### 3、快速创建项目


&emsp;&emsp;和创建组件类似的简单：

```
just webapp
```

&emsp;&emsp;生成后进入目录，执行 `npm i` 和 `npm run dev`即可启动项目调试。目前集成了PC端SPA和移动端SPA的项目模板（可支持PWA），创建完成即可使用。

#### 4、just帮助命令

&emsp;&emsp;此外你可以执行`just help`来查看just的其它命令和功能。

```
just init: 创建一个组件或项目。根据组件物料库快速生成一个组件或项目。

just template: 根据自定义组件物料库目录创建一个新的组件物料库。

just rmtemplate: 删除一个自定义组件物料库。

just list: 查看存在的所有组件物料库列表。

just webapp: 调用项目物料库快速生成一个项目工程。

just i/install: 安装组件的第三方依赖，同 npm/tnpm install。

just update: 更新组件的第三方依赖，同 npm/tnpm update。

just start/run -port: 启动调试服务器。一般只需要运行一次。-p或-port表示指定端口开启服务。

just clear/clean: 清除缓存。清除build构建的缓存目录。

just dev/watch: 在当前目录下创建组件调试环境。

just build: 编译打包组件为单个输出的ES5文件并编译CSS文件。例如：just build ComponentName

just help: 查看帮助。查看just所有命令。

just -v/version: 显示当前安装的just版本。

just set: 设置npm、tnpm或tnpm，例如：just set tnpm。
```

&emsp;&emsp;具体功能用法可以查看 [详细文档](/#docs)。