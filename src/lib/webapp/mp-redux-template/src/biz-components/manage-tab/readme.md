#### 目录规范定义

```
|--manage-tab/
    |--index.js     # 业务组件入口
    |--index.wxml   # 业务组件view聚合层，只用于引入下层的子组件组装，不应该包含实际内容
    |--index.less   # 业务组件的样式
    |--index.json   # 业务组件中引用声明
    |--readme.md    # 说明文档
    |--src/         # 业务层核心代码
        |--views/   # 业务组件内部的私有ui组件
            |--view.js      # UI组件入口
            |--view.wxml    # UI组件结构
            |--view.less    # UI组件样式
            |--view.json    # UI组件引用声明
        |--action.js        # 业务组件行为层
        |--data-adapter.js  # 业务组件数据处理层
        |--reducer.js       # 业务组件reducer
        |--service.js       # 业务组件对外方法入口
    |--test/        # 测试用例目录
        |--test.js  # 测试用例代码
    |--data/        # 组件mock运行数据
        |--data.js # 组件mock数据文件
```

#### 详细文档
---

&emsp;&emsp;ManageTab业务组件。