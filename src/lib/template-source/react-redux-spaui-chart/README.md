```html
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000"/>
<script src="//i.gtimg.cn/qzone/biz/gdt/lib/highcharts-5.0.10/highcharts.js?max_age=31536000"></script>
<div id="test"></div>
```

```css
body {
    background: #ccc;
}
```

```javascript

import { connect } from 'react-redux';
import ${_Component} from './index.jsx';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/${_component}/data/asyncData.json'), {
    "text": "hello first and hi Mock Data "
});

const props = {
    name: 'world'
};

const mapStateToProps = (state, ownProps) => {
    return state;
}

const mapDispatchToProps = (state, ownProps) => {
  return {};
}

const Component = connect(
  mapStateToProps,
  mapDispatchToProps
)(${_Component})

export default <Component {...props}/>;

```

```webpack-config
{}
```

#### 详细文档
---