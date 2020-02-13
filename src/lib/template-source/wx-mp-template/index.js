
import { changeName, asyncChangeName, } from './src/action';
import { formatName } from './src/data-adapter';

import data from './data/data.js';

Component({
    properties: {
        propName: {
            type: String,
            value: '',
            observer: function (newValue, oldValue) {
                const formatedPropName = formatName(newValue);
                this.setData({
                    formatedPropName,
                });
            }
        }
    },
    lifetimes: {
        attached() {
        }
    },
    data: {
        ...data,
        formatedName: formatName(data.name),
    },
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