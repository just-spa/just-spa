import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import ComponentPage from '../src/index.jsx';
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
describe('<ComponentPage {...initProps}/> 组件测试', () => {
    it('should render ComponentPage success', () => {
        const wrapper = shallow(<Provider store={store}>
            <ComponentPage store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<ComponentPage> Action测试', () => {

    it('ComponentPage Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('change');

        let changeStatus = store.getState();

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('ComponentPage Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('change');

        return promise.then(() => {
            let change = store.getState();

            expect(change).to.have.property('text');
        });
    });

    it('ComponentPage Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('change');

        return promise.then(() => {
            let change = store.getState();

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<ComponentPage> reducer测试', () => {
    it('ComponentPage reducer success', () => {

        let changeState = reducer({}, {
            type: 'change',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
