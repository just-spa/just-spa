import IndexTabReducer from '../biz-components/index-tab/src/reducer';
import ManageTabReducer from '../biz-components/manage-tab/src/reducer';
import MessageTabReducer from '../biz-components/message-tab/src/reducer';
import AccountTabReducer from '../biz-components/account-tab/src/reducer';

export default {
    ...IndexTabReducer,
    ...ManageTabReducer,
    ...MessageTabReducer,
    ...AccountTabReducer,
};
