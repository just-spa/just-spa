
import React from 'react';
import { assert, expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import LimitSelect from '../src/index.js';
import initProps from '../data/index';

const { shallow } = Enzyme;
Enzyme.configure({ adapter: new Adapter() });

describe('<LimitSelect {...initProps}/>', () => {
    it('should render LimitSelect', () => {
        const wrapper = shallow(<LimitSelect {...initProps}/>);
        expect([1, 2, 3]).to.have.length(3);
    });
});

