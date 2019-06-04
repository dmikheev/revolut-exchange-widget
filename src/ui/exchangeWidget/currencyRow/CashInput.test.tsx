import { TextField } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import CashInput from './CashInput';

it('shallow renders without crashing', () => {
  shallow(<CashInput/>);
});

it('calls onChange only with correct values', () => {
  const onChange = jest.fn();
  const cashInput = shallow(<CashInput onChange={onChange}/>);

  const muiTextField = cashInput.find(TextField);
  expect(muiTextField).toHaveLength(1);

  expect(muiTextField.props().onChange).toBeTruthy();
  muiTextField.props().onChange!({ target: { value: 'abc' } } as React.ChangeEvent<HTMLInputElement>);
  expect(onChange).not.toBeCalled();

  muiTextField.props().onChange!({ target: { value: '12.34' } } as React.ChangeEvent<HTMLInputElement>);
  expect(onChange).toBeCalledTimes(1);
});
