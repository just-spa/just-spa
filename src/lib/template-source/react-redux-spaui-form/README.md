```html
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-checkbox/0.1.17/spaui-checkbox.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-input/0.1.34/spaui-input.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-autocomplete/0.1.42/spaui-autocomplete.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-radio/0.1.33/spaui-radio.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-select/0.2.90/spaui-select.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-datepicker/0.1.40/spaui-datepicker.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-button/0.1.25/spaui-button.css?max_age=31536000" />
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