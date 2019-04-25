import dashboardReducers from '../components/dashboard/src/reducer';
import searchProductReducers from '../components/search-product/src/reducer';
import sellChartReducers from '../components/sell-chart/src/reducer';

export default {
    ...dashboardReducers,
    ...sellChartReducers,
    ...searchProductReducers
}