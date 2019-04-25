```html
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000"/>
<link rel="stylesheet" href="//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-menu/0.1.34/spaui-menu.css?max_age=31536000"/>
<div id="test"></div>
```

```css
body {
    background: #ccc;
}

.icon-home,
.icon-monitor,
.icon-search {
    background-color: #f2f2f2;
}

```

```javascript

import { connect } from 'react-redux';
import SideNavMenu from './index.jsx';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/side-nav-menu/data/asyncData.json'), {
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
)(SideNavMenu)

export default <Component {...props}/>;

```

```webpack-config
{}
```

#### 详细文档
---