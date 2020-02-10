
import { changeName, asyncChangeName, } from './src/action';

import data from './data/data.js';

Component({
    properties: {
        propName: String,
    },
    lifetimes: {
        attached() {
        }
    },
    data: data,
    methods: {
        changeName: function () {
            // 需要绑定this
            changeName.bind(this)({
                name: '同步数据',
            });
        },
        asyncChangeName: function () {
            // 需要绑定this
            asyncChangeName.bind(this)();
        }
    },

    ready() {
        console.log('${_Component} ready');
    }
});