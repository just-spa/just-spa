import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SellChart from '../src/index.jsx';
import initProps from '../data/index';

import reducer from '../src/reducer';
import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from '../src/action';

import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(combineReducers(reducer), {}, applyMiddleware());

Enzyme.configure({ adapter: new Adapter() });

const context = {
    context: {
        store: store
    }
};

// component 测试
describe('<SellChart {...initProps}/> 组件测试', () => {
    it('should render SellChart success', () => {
        const wrapper = shallow(<Provider store={store}>
            <SellChart store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<SellChart> Action测试', () => {

    it('SellChart Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('SellChart');

        let changeStatus = (store.getState())['SellChart'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('SellChart Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SellChart');

        return promise.then(() => {
            let change = (store.getState())['SellChart'];

            expect(change).to.have.property('text');
        });
    });

    it('SellChart Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SellChart');

        return promise.then(() => {
            let change = (store.getState())['SellChart'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<SellChart> reducer测试', () => {
    it('SellChart reducer success', () => {

        let changeState = reducer['SellChart']({}, {
            type: 'SellChart',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
