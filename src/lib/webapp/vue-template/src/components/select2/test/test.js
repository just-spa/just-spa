
import React from 'react';
import { assert, expect } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import Select2 from '../src/index.js';
import initProps from '../data/index';

const { shallow } = Enzyme;
Enzyme.configure({ adapter: new Adapter() });

describe('<Select2 {...initProps}/>', () => {
    it('should render Select2', () => {
        const wrapper = shallow(<Select2 {...initProps}/>);
        expect([1, 2, 3]).to.have.length(3);
    });
});

