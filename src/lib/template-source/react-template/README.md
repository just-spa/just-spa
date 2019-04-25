```html
<div id="test"></div>
```

```css
body {
    background: #ccc;
}
```

```javascript

import ${_Component} from './index.jsx';
import initProps from './data/index';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/${_component}/data/asyncData.json'), {
    "text": "hello first and hi Mock Data "
});

export default <${_Component} {...initProps}/>

```

```webpack-config
{}
```

#### 详细文档
---