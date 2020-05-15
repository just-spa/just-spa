```html
<div id="test"></div>
```

```css
body {
    background: #ccc;
}
```

```javascript

import { connect } from 'react-redux';
import MainPage from './index.jsx';

//注入 mock请求返回数据
Mock.mock(new RegExp('/.build/main-page/data/asyncData.json'), {
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
)(MainPage)

export default <Component {...props}/>;

```

#### 详细文档
---