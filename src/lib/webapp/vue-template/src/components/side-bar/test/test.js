
import React from 'react';
import { assert, expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import SideBar from '../src/index.js';
import initProps from '../data/index';

const { shallow } = Enzyme;
Enzyme.configure({ adapter: new Adapter() });

describe('<SideBar {...initProps}/>', () => {
    it('should render SideBar', () => {
        const wrapper = shallow(<SideBar {...initProps}/>);
        expect([1, 2, 3]).to.have.length(3);
    });
});

