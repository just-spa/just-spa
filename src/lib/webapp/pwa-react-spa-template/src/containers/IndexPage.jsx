import React from 'react';
import PropTypes from 'prop-types';

import TestPage from '../biz-components/test-page';
import MainPage from '../biz-components/main-page';

// 声明container中的路由
const containerRoute = {
    'test-page': TestPage,
    'main-page': MainPage
}

class IndexPage extends React.Component {

    static propTypes = {

    };

    // 接收全局的store
    static contextTypes = {
        store: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hash: window.location.hash.replace('#', '')
        }
    }

    getChildContext() {
        return {
            store: this.context.store,
        };
    }

    componentDidMount() {
        window.onhashchange = (event) => {
            this.setState({
                hash: window.location.hash.replace('#', '')
            });
        }
    }

    render() {
        const { hash } = this.state;
        return <div>
            {this._renderComponent(hash, containerRoute)}
        </div>
    }

    /**
     * 根据hash路由渲染组件
     * 
     * @param {any} hash 
     * @returns 
     * @memberof IndexPage
     */
    _renderComponent = (hash, containerRoute) => {
        let Component = containerRoute[hash] || MainPage;
        return Component ? <Component {...this.props} /> : null;
    }
};

export default IndexPage;

