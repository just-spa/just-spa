
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Menu from '@tencent/spaui-menu';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const menuData = [{
    label: '业务审核',
    key: '#nav-home',
    iconClassName: 'icon-home',
    data: [{
        label: '开户审核',
        href: '#1-1'
    }, {
        label: '开户查询',
        href: '#1-2'
    }]
}, {
    label: '审核管理',
    href: '#3',
    miniHref: '',
    iconClassName: 'icon-manager'
}, {
    label: '系统配置',
    key: '#nav-config',
    iconClassName: 'icon-config'
}];

class ${_Component} extends PureComponent {

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
            <Menu className="${_component}" data={menuData} fixed={false} value={menuKey} onChange={(event, data) => {
                this.setState({
                    menuKey: data.href || data.key || ''
                });
            }}/>
        );
    }
}

export default ${_Component};
