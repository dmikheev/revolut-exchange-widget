import { mount, shallow } from 'enzyme';
import React from 'react';
import CashInput from './CashInput';

it('shallow renders without crashing', () => {
  shallow(<CashInput/>);
});

it('calls onChange only with correct values', () => {
  const onChange = jest.fn();
  const cashInput = mount(<CashInput onChange={onChange}/>);

  const inputFind = cashInput.find('input');
  expect(inputFind).toHaveLength(1);

  inputFind.simulate('change', { target: { value: 'abc' } });
  expect(onChange).not.toBeCalled();

  inputFind.simulate('change', { target: { value: '12.34' } });
  expect(onChange).toBeCalledTimes(1);
});
