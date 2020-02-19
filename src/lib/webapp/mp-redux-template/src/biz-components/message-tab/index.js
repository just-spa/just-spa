
import { useDispatch } from '../../initStore';
import { changeName, asyncChangeName, } from './src/action';
import { formatName } from './src/data-adapter';

import data from './data/data.js';

const dispatch = useDispatch();

Component({
    properties: {
        MessageTab: {
            type: Object,
            value: {},
            observer: function (newValue, oldValue) {
                const { name = '' } = newValue || {};
                const formatedPropName = formatName(name);
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
        changeName() {
            dispatch(changeName());
        },
        asyncChangeName() {
            dispatch(asyncChangeName());
        }
    },

    ready() {
        console.log('MessageTab ready');
    }
});