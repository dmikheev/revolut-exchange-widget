import { mount, shallow } from 'enzyme';
import React from 'react';
import CashInput from './CashInput';

it('shallow renders without crashing', () => {
  shallow(<CashInput/>);
});

it('calls onChange only with correct values', () => {
  const onChange = jest.fn();
  const cashInput = mount(<CashInput onChange={onChange}/>);

  const textFieldFind = cashInput.find('input');
  expect(textFieldFind).toHaveLength(1);

  textFieldFind.simulate('change', { target: { value: 'abc' } });
  expect(onChange).not.toHaveBeenCalled();

  textFieldFind.simulate('change', { target: { value: '12.34' } });
  expect(onChange).toHaveBeenCalledTimes(1);
});
