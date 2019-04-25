```html
    <link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/bootstrap-3.3.7/css/bootstrap-base64font.min.css" />
    <link rel="stylesheet" href='//i.gtimg.cn/qzone/biz/gdt/lib/bootstrap-3.3.7/css/bootstrap-theme.css?max_age=31536000' /> 
    <div id="test"></div>
    <div id="NavBar">
        <h2>这是一个Vue项目，名称：NavBar</h2>
        <div>{{text}}</div>
        <ol>
            <li v-for="todo in todos">
            {{ todo.list }}
            </li>
        </ol>
        <button v-on:click="change">同步dispatch</button>
        <Button v-on:click="asyncChange">异步dispatch</button>
        <button v-on:click="promiseChange">promise dispatch</button>
    </div>
```

```css
body {
}
```

```javascript

import NavBar from './index.js';
import initProps from './data/index';

import './src/index.less';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/nav-bar/data/asyncData.json'), {
    "text": "hello first and hi Mock Data "
});

export default () => {
    return NavBar(initProps);
}

```

```externals
{}
```

#### 详细文档
---