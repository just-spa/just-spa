import MainPageReducers from '../biz-components/main-page/src/reducer';
import TestPageReducers from '../biz-components/test-page/src/reducer';
import ComponentPageReducers from '../biz-components/components/component-page/src/reducer';

export default {
    ...MainPageReducers,
    ...TestPageReducers,
    ...ComponentPageReducers
};