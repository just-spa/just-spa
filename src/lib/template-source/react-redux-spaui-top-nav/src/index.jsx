
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TopNav from '@tencent/spaui-topnav';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const topNavData = {
    title: '管理系统',
    rootUrl: '/',
    logoUrl: 'http://i.gtimg.cn/qzone/biz/gdt/image/ams.svg',
    list: [{
        placement: 'left',
        value: 'more1',
        className: 'left-classname',
        data: [{
            url: '',
            key: 'home',
            label: '主页',
            className: 'home',
            onClick: function() {
                alert('主页')
            }
        }, {
            url: '',
            key: 'doc',
            label: '文档'
        }, {
            url: '',
            key: 'help',
            label: '帮助'
        }]
    }, {
        placement: 'right',
        value: '',
        data: [{
            type: 'search',
            value: '',
            placeholder: '搜索',
            onChange: (event) => {
                console.log(event.target)
            }
        }, {
            type: 'userinfo',
            txUrl: 'http://qzonestyle.gtimg.cn/gdt_ui_proj/dist/gdt/ad-process/images/logo/logo-pure.png?max_age=86400',
            nickname: 'admin',
            data: [{
                label: '设置',
                url: '',
                onClick: (event) => {
                    console.log('设置')
                }
            }, {
                label: '退出',
                url: '',
                onClick: (event) => {
                    console.log('退出')
                }
            }]
        }]
    }]
};

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
            searchValue: '搜索',
        };
    }

    componentWillMount() {

    }

    render() {
        const { searchValue } = this.state;

        return (
            <TopNav className="${_component}" {...topNavData} searchValue={searchValue} onSearchChange={(event, value) => {
                this.setState({
                    searchValue: event.target.value
                })
            }} />
        );
    }
}

export default ${_Component};
