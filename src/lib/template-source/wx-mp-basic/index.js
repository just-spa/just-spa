import data from './data/data.js';

Component({
    lifetimes: {
        attached() {
        }
    },
    data: {
        name: '${_Component}',
        type: '原始组件',
        description: '小程序原生UI组件',
    },
    methods: {
        click: function () {
            console.log('click');
        },
    },

    ready() {
        console.log('${_Component} ready');
    }
});