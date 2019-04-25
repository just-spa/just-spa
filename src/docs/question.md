## Q&A

#### 常见问题及解决方案（待补充）

- Mac下面提示找不到命令或权限不足：

&emsp;&emsp;执行cd，到user的目录下，修改.bash_profile, 添加一行  alias just="node /usr/local/lib/node_modules/just-spa/bin/just"，修改完执行 source .bash_profile 生效

- 调试时找不到依赖的包

&emsp;&emsp;如果调试时第三方依赖包找不到，进入组件工作目录下执行`just install`后重试调试。

- 更新版本后，提示各种找不到依赖包

&emsp;&emsp;更新了版本原有的依赖包会被情况，重新执行下 `just i` 就可以了
