
```html
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-table/0.1.99/spaui-table.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-card/0.1.2/index.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-table-title/0.1.2/index.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-datepicker/0.1.40/spaui-datepicker.css?max_age=31536000"/>
<div id="test"></div>
```

```css
body {
    background: #f1f3f4 !important;
    padding: 10px !important;
}
```

```javascript

import { connect } from 'react-redux';
import Dashboard from './index.jsx';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/dashboard/data/asyncData.json'), {
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
)(Dashboard)

export default <Component {...props}/>;

```

#### 详细文档
---



