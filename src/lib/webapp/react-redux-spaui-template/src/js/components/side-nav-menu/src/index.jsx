
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Menu from '@tencent/spaui-menu';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const menuData = [{
	label: '首页',
	href: '#/index',
	key: 'index',
	iconClassName: 'icon-home'
}, {
	label: '监控',
	href: '#/monitor',
	key: 'monitor',
	iconClassName: 'icon-monitor'
}, {
	label: '查询',
	href: '#/search',
	key: 'search',
	iconClassName: 'icon-search'
}];

class SideNavMenu extends PureComponent {
    static propTypes = {
        text: PropTypes.string,
        name: PropTypes.string
    }

    // 必须要定义contextType，否则无法获取Provider的context
    static contextTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            menuKey: '' || window.location.hash
        };
    }

    componentWillMount() {

    }

    render() {
        const { menuKey } = this.state;

        return (
            <Menu className="side-nav-menu" data={menuData} fixed={false} value={menuKey} onChange={(event, data) => {
                this.setState({
                    menuKey: data.href || data.key || ''
                });
            }}/>
        );
    }
}

export default SideNavMenu;
