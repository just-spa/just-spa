
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@tencent/spaui-checkbox';
import Input from '@tencent/spaui-input';
import Select from '@tencent/spaui-select';
import DatePicker from '@tencent/spaui-datepicker';
import Button from '@tencent/spaui-button';
import TableTitle from '@tencent/spaui-table-title';
import { Column, Table } from '@tencent/spaui-table';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const selectData = ['QQ', '微信'];
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
    download: 150
}, {
    id: 5,
    viewcount: 131,
    click: 1,
    download: 1400
}, {
    id: 6,
    viewcount: 210,
    click: 1,
    download: 1020
}, {
    id: 7,
    viewcount: 130,
    click: 41,
    download: 1050
}];

class SearchProduct extends PureComponent {

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
            ignoreTestAccount: true,
            channel: '',
            product: '',
            date: ''
        };
    }

    componentWillMount() {

    }

    render() {
        const { ignoreTestAccount, channel, product, date } = this.state;

        return (
            <div className='search-product'>
                <h1 className="search-product__menu-title">查询</h1>
                <div className="search-product__form-content">
                    <div className="search-product__query-form">
                        <div className="search-product__item">
                            <div className='search-product__label'>渠道：</div>
                            <Input value={channel} placeholder='输入框' onChange={(event, value) => {
                                this.setState({
                                    channel: value
                                });
                            }} />
                        </div>
                        <div className="search-product__item">
                            <div className='search-product__label'>产品：</div>
                            <Select html data={selectData} value={product} onChange={(event, value) => {
                                this.setState({
                                    product: value
                                });
                            }}/>
                        </div>
                        <div className="search-product__item">
                            <div className='search-product__label'>测试账号：</div>
                            <Checkbox value='checkbox' checked={ignoreTestAccount} onChange={(event, value) => {
                                this.setState({
                                    ignoreTestAccount: value
                                });
                            }}>忽略测试账号信息</Checkbox>
                        </div>
                        <div className="search-product__item">
                            <div className='search-product__label'>生日：</div>
                            <DatePicker type='single' date={date} onChange={(event, date) => {
                                this.setState({
                                    date
                                });
                            }}/>
                        </div>
                        <div className="search-product__item">
                            <Button displayType="primary" onClick={() => {
                                console.log(this.state);
                            }}>查询</Button>
                        </div>
                    </div>
                </div>
                <div className="search-product__result">
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
}

export default SearchProduct;
