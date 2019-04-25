/**
 * @fileOverview 生成html文件配置
 */
const path = require('path');

module.exports = [{
    title: '前端项目模板',
    template: './src/tpl/index.ejs',
    filename: path.resolve(__dirname, '../dist', 'index.html'),
    css: [
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/reset/0.1.1/spaui-base.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-topnav/0.1.13/index.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-card/0.1.2/index.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-table-title/0.1.2/index.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-table/0.1.99/spaui-table.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-datepicker/0.1.40/spaui-datepicker.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-menu/0.1.34/spaui-menu.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-checkbox/0.1.17/spaui-checkbox.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-input/0.1.34/spaui-input.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-autocomplete/0.1.42/spaui-autocomplete.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-radio/0.1.33/spaui-radio.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-select/0.2.90/spaui-select.css?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui-button/0.1.25/spaui-button.css?max_age=31536000'
    ],
    js: [
        '//i.gtimg.cn/qzone/biz/gdt/lib/react-16.5.2/react.react-dom.production.min.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui/2.0.0-beta.40/spaui.min.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/axios/0.18.0/axios.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-topnav/0.1.8/index.min.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-card/0.1.2/index.min.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-table-title/0.1.2/index.min.js?max_age=31536000',
        '//i.gtimg.cn/qzone/biz/gdt/lib/highcharts-5.0.10/highcharts.js?max_age=31536000'
    ]
}];
