
import React from 'react';
import { assert, expect } from 'chai';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ${_Component} from '../src/index.js';
import initProps from '../data/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<${_Component} {...initProps}/>', () => {
    it('should render ${_Component}', () => {
        const wrapper = shallow(<${_Component} {...initProps}/>);
        expect([1, 2, 3]).to.have.length(3);
    });
});

