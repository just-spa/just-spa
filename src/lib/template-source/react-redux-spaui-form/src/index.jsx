
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@tencent/spaui-checkbox';
import Input from '@tencent/spaui-input';
import AutoComplete from '@tencent/spaui-autocomplete';
import Radio from '@tencent/spaui-radio';
import Select from '@tencent/spaui-select';
import DatePicker from '@tencent/spaui-datepicker';
import Button from '@tencent/spaui-button';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const autoCompleteData = [{
    label: '广东工业大学',
    value: 1
}, {
    label: '中山大学',
    value: 2
}];
const selectData = ['QQ', '微信'];

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
            ignoreTestAccount: true,
            channel: '',
            school: '',
            gender: '1',
            product: '',
            date: ''
        };
    }

    componentWillMount() {

    }

    render() {
        const { ignoreTestAccount, channel, school, gender, product, date } = this.state;

        return (
            <div className='${_component}'>
                <div className="${_component}__item">
                    <div className='${_component}__label'>渠道：</div>
                    <Input value={channel} placeholder='输入框' onChange={(event, value) => {
                        this.setState({
                            channel: value
                        });
                    }} />
                </div>
                <div className="${_component}__item">
                    <div className='${_component}__label'>学校：</div>
                    <AutoComplete value={school} data={autoCompleteData} placeholder="自动完成输入框" filter={false}
                        onChange={(event, value, valueData) => {
                            this.setState({
                                school: value
                            });
                        }} onSelect={(event, value, label, valueData) => {
                            this.setState({
                                school: label
                            });
                        }} />
                </div>
                <div className="${_component}__item">
                    <div className='${_component}__label'>产品：</div>
                    <Select html data={selectData} value={product} onChange={(event, value) => {
                        this.setState({
                            product: value
                        });
                    }}/>
                </div>
                <div className="${_component}__item">
                    <div className='${_component}__label'>性别：</div>
                    <Radio value="1" checked={gender === '1'} onChange={(event, value) => {
                        this.setState({
                            gender: value
                        });
                    }}>男</Radio>
                    <Radio value="2" checked={gender === '2'} onChange={(event, value) => {
                        this.setState({
                            gender: value
                        });
                    }}>女</Radio>
                </div>
                <div className="${_component}__item">
                    <div className='${_component}__label'>测试账号：</div>
                    <Checkbox value='checkbox' checked={ignoreTestAccount} onChange={(event, value) => {
                        this.setState({
                            ignoreTestAccount: value
                        });
                    }}>忽略测试账号信息</Checkbox>
                </div>
                <div className="${_component}__item">
                    <div className='${_component}__label'>生日：</div>
                    <DatePicker type='single' date={date} onChange={(event, date) => {
                        this.setState({
                            date
                        });
                    }}/>
                </div>
                <div className="${_component}__item">
                    <Button displayType="primary" onClick={() => {
                        console.log(this.state);
                    }}>查询</Button>
                </div>
            </div>
        );
    }
}

export default ${_Component};
