import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Layout from '../../layouts/index';
import Dashboard from '../../components/dashboard/index.jsx';

class IndexPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <Dashboard {...this.props} />
            </Layout>
        );
    }
}

export default connect((state) => {
    return state;
})(IndexPage);