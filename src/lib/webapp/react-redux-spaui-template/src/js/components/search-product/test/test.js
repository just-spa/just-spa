import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SearchProduct from '../src/index.jsx';
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
describe('<SearchProduct {...initProps}/> 组件测试', () => {
    it('should render SearchProduct success', () => {
        const wrapper = shallow(<Provider store={store}>
            <SearchProduct store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<SearchProduct> Action测试', () => {

    it('SearchProduct Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('SearchProduct');

        let changeStatus = (store.getState())['SearchProduct'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('SearchProduct Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SearchProduct');

        return promise.then(() => {
            let change = (store.getState())['SearchProduct'];

            expect(change).to.have.property('text');
        });
    });

    it('SearchProduct Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SearchProduct');

        return promise.then(() => {
            let change = (store.getState())['SearchProduct'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<SearchProduct> reducer测试', () => {
    it('SearchProduct reducer success', () => {

        let changeState = reducer['SearchProduct']({}, {
            type: 'SearchProduct',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
