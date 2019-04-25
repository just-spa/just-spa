import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ${_Component} from '../src/index.jsx';
import initProps from '../data/index';

import reducer from '../src/reducer';
import { dispatchChange, dispatchAsyncChange } from '../src/action';

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
describe('<${_Component} {...initProps}/> 组件测试', () => {
    it('should render ${_Component} success', () => {
        const wrapper = shallow(<Provider store={store}>
            <${_Component} store={store} />
        </Provider>, initProps);
    });
});

// Action测试
describe('<${_Component}> Action测试', () => {

    it('${_Component} Action dispatch success', () => {

        let promise = dispatchChange.bind(context)('${_Component}');

        let changeStatus = (store.getState())['${_Component}'];

        expect(changeStatus).to.have.property('text').equal('change');
    });

    it('${_Component} Action asyncDispatch success', () => {

        let promise = dispatchAsyncChange.bind(context)('${_Component}');

        return promise.then(() => {
            let change = (store.getState())['${_Component}'];

            expect(change).to.have.property('text');
        });
    });
});

// reducer测试
describe('<${_Component}> reducer测试', () => {
    it('${_Component} reducer success', () => {

        let changeState = reducer['${_Component}']({}, {
            type: '${_Component}',
            data: {
                text: 'hello world'
            }
        });

        expect(changeState).to.have.property('text').equal('hello world');
    });
});
