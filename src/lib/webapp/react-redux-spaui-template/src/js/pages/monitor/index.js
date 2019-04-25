import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Layout from '../../layouts/index';
import SellChart from '../../components/sell-chart/index.jsx';

class MonitorPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <SellChart {...this.props} />
            </Layout>
        );
    }
}

export default connect((state) => {
    return state;
})(MonitorPage);