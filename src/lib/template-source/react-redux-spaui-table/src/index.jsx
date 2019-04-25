
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Column, Table } from '@tencent/spaui-table';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const tableData = [{
    id: 0,
    viewcount: 10,
    click: 1,
    download: 100
}, {
    id: 2,
    viewcount: 101,
    click: 1,
    download: 1400
}, {
    id: 3,
    viewcount: 110,
    click: 1,
    download: 1020
}, {
    id: 4,
    viewcount: 130,
    click: 41,
    download: 1050
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
        this.state = {};
    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="${_component}">
                <Table
                    total
                    data={tableData}
                >
                    <Column name='id' headClassName='id' dataClassName='data' totalClassName='data'>ID</Column>
                    <Column name='viewcount'>曝光量</Column>
                    <Column name='click'>点击量</Column>
                    <Column name='download' minWidth='200'>下载量</Column>
                </Table>
            </div>
        )
    }
}

export default ${_Component};
