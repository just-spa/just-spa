import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dashboard from '../src/index.jsx';
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
describe('<Dashboard {...initProps}/> 组件测试', () => {
    it('should render Dashboard success', () => {
        const wrapper = shallow(<Provider store={store}>
            <Dashboard store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<Dashboard> Action测试', () => {

    it('Dashboard Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('Dashboard');

        let changeStatus = (store.getState())['Dashboard'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('Dashboard Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('Dashboard');

        return promise.then(() => {
            let change = (store.getState())['Dashboard'];

            expect(change).to.have.property('text');
        });
    });

    it('Dashboard Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('Dashboard');

        return promise.then(() => {
            let change = (store.getState())['Dashboard'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<Dashboard> reducer测试', () => {
    it('Dashboard reducer success', () => {

        let changeState = reducer['Dashboard']({}, {
            type: 'Dashboard',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
