import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import TestPage from '../src/index.jsx';
import initProps from '../data/index';

import reducer from '../src/reducer';
import { dispatchChange, dispatchAsyncChange, dispatchPromiseChange } from '../src/action';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(reducer, {}, applyMiddleware());

Enzyme.configure({ adapter: new Adapter() });

const context = {
    context: {
        store: store
    }
};

// component 测试
describe('<TestPage {...initProps}/> 组件测试', () => {
    it('should render TestPage success', () => {
        const wrapper = shallow(<Provider store={store}>
            <TestPage store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<TestPage> Action测试', () => {

    it('TestPage Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('change');

        let changeStatus = store.getState();

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('TestPage Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('change');

        return promise.then(() => {
            let change = store.getState();

            expect(change).to.have.property('text');
        });
    });

    it('TestPage Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('change');

        return promise.then(() => {
            let change = store.getState();

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<TestPage> reducer测试', () => {
    it('TestPage reducer success', () => {

        let changeState = reducer({}, {
            type: 'change',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
