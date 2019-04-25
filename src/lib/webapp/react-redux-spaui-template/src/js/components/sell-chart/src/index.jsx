
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Chart from '@tencent/spaui-chart';
import Select from '@tencent/spaui-select';
import DatePicker from '@tencent/spaui-datepicker';

// import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from './action';
// import { formatName } from './data-adapter';

const productData = ['产品1', '产品2', '产品3'];

const lineChartProps = {
    type: 'line',
    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        name: 'Sales & Distribution',
        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
    }]
};

const pieChartProps = {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: '2014年某网站不同浏览器访问量占比'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    series: [{
        type: 'pie',
        name: '浏览器占比',
        data: [
            ['Firefox',   45.0],
            ['IE',       26.8],
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Safari',    8.5],
            ['Opera',     6.2],
            ['Others',   0.7]
        ]
    }]
};

class SellChart extends PureComponent {

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
            selectedProductValue: '',
            date: ''
        };
    }

    componentWillMount() {

    }

    render() {
        const { selectedProductValue, date } = this.state;

        return (
            <div className="sell-chart">
                <h1 className="sell-chart__menu-title">监控</h1>
                <div className="sell-chart__content">
                    <div className="sell-chart__filter">
                        <div className="sell-chart__product-selector">
                            <Select html data={productData} value={selectedProductValue} onChange={(event, value) => {
                                this.setState({
                                    selectedProductValue: value
                                });
                            }} />
                        </div>
                        <div className="sell-chart__date-picker">
                            <DatePicker type='single' date={date} onChange={(event, date) => {
                                this.setState({
                                    date
                                });
                            }} />
                        </div>
                    </div>
                    <div className="sell-chart__chart">
                        <Chart {...lineChartProps} />
                    </div>
                    <div className="sell-chart__chart">
                        <Chart {...pieChartProps} />
                    </div>
                </div>
            </div>
        );
    }
}

export default SellChart;
