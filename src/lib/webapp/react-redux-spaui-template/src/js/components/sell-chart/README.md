```html
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-select/0.2.90/spaui-select.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-datepicker/0.1.41/spaui-datepicker.css?max_age=31536000"/>
<script src="//i.gtimg.cn/qzone/biz/gdt/lib/highcharts-5.0.10/highcharts.js?max_age=31536000"></script>
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
import SellChart from './index.jsx';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/sell-chart/data/asyncData.json'), {
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
)(SellChart)

export default <Component {...props}/>;

```

```webpack-config
{}
```

#### 详细文档
---