import { shallow } from 'enzyme';
import React from 'react';
import CashInput from './CashInput';

it('shallow renders without crashing', () => {
  shallow(<CashInput/>);
});
