
import React from 'react';
import { assert, expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import Pagination from '../src/index.js';
import initProps from '../data/index';

const { shallow } = Enzyme;
Enzyme.configure({ adapter: new Adapter() });

describe('<Pagination {...initProps}/>', () => {
    it('should render Pagination', () => {
        const wrapper = shallow(<Pagination {...initProps}/>);
        expect([1, 2, 3]).to.have.length(3);
    });
});

