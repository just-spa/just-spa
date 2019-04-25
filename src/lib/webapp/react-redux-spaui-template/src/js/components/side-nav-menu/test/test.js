import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SideNavMenu from '../src/index.jsx';
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
describe('<SideNavMenu {...initProps}/> 组件测试', () => {
    it('should render SideNavMenu success', () => {
        const wrapper = shallow(<Provider store={store}>
            <SideNavMenu store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<SideNavMenu> Action测试', () => {

    it('SideNavMenu Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('SideNavMenu');

        let changeStatus = (store.getState())['SideNavMenu'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('SideNavMenu Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SideNavMenu');

        return promise.then(() => {
            let change = (store.getState())['SideNavMenu'];

            expect(change).to.have.property('text');
        });
    });

    it('SideNavMenu Action PromiseDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('SideNavMenu');

        return promise.then(() => {
            let change = (store.getState())['SideNavMenu'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<SideNavMenu> reducer测试', () => {
    it('SideNavMenu reducer success', () => {

        let changeState = reducer['SideNavMenu']({}, {
            type: 'SideNavMenu',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
