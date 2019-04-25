import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Layout from '../../layouts/index';
import SearchProduct from '../../components/search-product/index.jsx';

class SearchPage extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Layout>
                <SearchProduct {...this.props} />
            </Layout>
        );
    }
}

export default connect((state) => {
    return state;
})(SearchPage);