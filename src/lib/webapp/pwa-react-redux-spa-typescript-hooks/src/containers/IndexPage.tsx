
import React, { useEffect, useState, } from 'react';

import { connect } from 'react-redux';

import TestPage from '../biz-components/test-page/index';
import MainPage from '../biz-components/main-page/index';

// 声明container中的路由
const containerRoute: object = {
    'test-page': TestPage,
    'main-page': MainPage
};

const IndexPage = (props: {
    dispatch: Function,
}) => {
    const initHash: string = window.location.hash.replace('#', '');
    const [hash, setHash]: [string, Function] = useState(initHash);

    useEffect(() => {
        window.onhashchange = (event: object) => {
            setHash(window.location.hash.replace('#', ''));
        }
    }, [hash]);

    const Components = containerRoute[hash];

    return Components ? <Components {...props}/> : null;
}

const mapStateToProps = (state: object, ownProps: object) => {
    return state;
};

const mapDispatchToProps = (state: object, ownProps: object) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexPage);

