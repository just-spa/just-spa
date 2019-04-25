import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Header from '../src/index.jsx';
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
describe('<Header {...initProps}/> 组件测试', () => {
    it('should render Header success', () => {
        const wrapper = shallow(<Provider store={store}>
            <Header store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<Header> Action测试', () => {

    it('Header Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('Header');

        let changeStatus = (store.getState())['Header'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('Header Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('Header');

        return promise.then(() => {
            let change = (store.getState())['Header'];

            expect(change).to.have.property('text');
        });
    });

    it('Header Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('Header');

        return promise.then(() => {
            let change = (store.getState())['Header'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<Header> reducer测试', () => {
    it('Header reducer success', () => {

        let changeState = reducer['Header']({}, {
            type: 'Header',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
