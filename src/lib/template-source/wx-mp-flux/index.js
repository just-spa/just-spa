
import { setData, } from '../../initStore';
import { formatName } from './src/data-adapter';

import data from './data/data.js';
import methods from './src/methods';

Component({
    properties: {
        propName: {
            type: String,
            value: '',
            observer: function (newValue, oldValue) {
                const formatedPropName = formatName(newValue);
                this.$setData({
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
        $setData: setData,
        ...methods,
    },

    ready() {
        console.log('${_Component} ready');

        this.initData();
        this.bindEvents();
    }
});