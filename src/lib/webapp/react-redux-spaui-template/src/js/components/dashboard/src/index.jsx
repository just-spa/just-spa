
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from '@tencent/spaui-card';
import TableTitle from '@tencent/spaui-table-title';
import { Table, Column } from '@tencent/spaui-table';
import DatePicker from '@tencent/spaui-datepicker';

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

class Dashboard extends PureComponent {
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
            date: ''
        };

        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillMount() {
    }

    render() {
        const { date } = this.state;

        return (
            <div className='dashboard'>
                <div className='dashboard__section dashboard__summary'>
                    <h2 className='dashboard__section-title'>
                        总览
                    </h2>
                    <div>
                        <div>
                            <DatePicker
                                className='dashboard__section-datePicker'
                                type='single'
                                date={date}
                                horizontalPosition='left'
                                onChange={this.handleDateChange}
                            />
                        </div>
                    </div>
                </div>

                <div className='dashboard__section dashboard__cards'>
                    <Card
                        title='访问次数(PV)'
                        value='764,481'
                        data={[{
                            label: '日环比',
                            value: '-1.12%',
                            type: 'success'
                        }, {
                            label: '周同比',
                            value: '+3.35%',
                            type: 'success'
                        }]}
                    />
                    <Card
                        title='访问人数(UV)'
                        value='284,327'
                        data={[{
                            label: '日环比',
                            value: '-1.12%',
                            type: 'danger'
                        }, {
                            label: '周同比',
                            value: '+3.35%',
                            type: 'success'
                        }]}
                    />
                    <Card
                        title='QQ用户访问数(QV)'
                        value='461,768'
                        data={[{
                            label: 'KPI',
                            value: '3,000,000'
                        }, {
                            label: '完成率',
                            value: '120%',
                            type: 'success'
                        }]}
                    />
                    <Card
                        title='会话数(VV)'
                        value='461,768'
                        data={[{
                            label: 'KPI',
                            value: '3,000,000'
                        }, {
                            label: '完成率',
                            value: '120%',
                            type: 'success'
                        }]}
                    />
                </div>

                <div className='dashboard__section'>
                    <TableTitle
                        title='浏览量（PV）'
                    >
                        <Table
                            total
                            data={tableData}
                        >
                            <Column name='id'>ID</Column>
                            <Column name='viewcount'>曝光量</Column>
                            <Column name='click'>点击量</Column>
                            <Column name='download'>下载量</Column>
                        </Table>
                    </TableTitle>
                </div>

                <div className='dashboard__section'>
                    <TableTitle
                        title='独立访客(UV)'
                    >
                        <Table
                            total
                            data={tableData}
                        >
                            <Column name='id'>ID</Column>
                            <Column name='viewcount'>曝光量</Column>
                            <Column name='click'>点击量</Column>
                            <Column name='download'>下载量</Column>
                        </Table>
                    </TableTitle>
                </div>
            </div>
        );
    }

    handleDateChange(event, value) {
        this.setState({
            date: value
        });
    }
}

export default Dashboard;

