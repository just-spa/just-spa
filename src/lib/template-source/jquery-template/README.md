```html
<div id="test"></div>
```

```css
body {
}
```

```javascript

import ${_Component} from './index.js';
import initProps from './data/index';

import './src/index.less';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/${_component}/data/asyncData.json'), {
    "text": "hello first and hi Mock Data "
});

export default () => {
    return ${_Component};
}

```

```webpack-config
{}
```


#### 详细文档
---