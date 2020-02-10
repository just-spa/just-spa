
import { useDispatch } from '../../initStore';
import { changeName, asyncChangeName, } from './src/action';

import data from './data/data.js';

const dispatch = useDispatch();

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
        changeName() {
            dispatch(changeName());
        },
        asyncChangeName() {
            dispatch(asyncChangeName());
        }
    },

    ready() {
        console.log('${_Component} ready');
    }
});