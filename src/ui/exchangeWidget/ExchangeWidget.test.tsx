import { Button } from '@material-ui/core';
import toJson from 'enzyme-to-json';
import React, { MouseEvent, MouseEventHandler } from 'react';
import { shallow } from 'enzyme';
import { Currency } from '../../constants/currencies';
import CurrencyRow from './currencyRow/CurrencyRow';
import ExchangeWidget from './ExchangeWidget';

const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
const nop = () => {};
const testProps = {
  backgroundColor: '#fff',
  amountFromStr: '111',
  balanceFrom: 222,
  amountToStr: '333',
  balanceTo: 444,
  currencies: currencies,
  currencyFrom: Currency.GBP,
  currencyTo: Currency.USD,
  isExchangeDisabled: false,
  isRateFetching: false,
  isSourceBalanceError: false,
  rateTo: 0.75,
  onAmountFromChange: nop,
  onAmountToChange: nop,
  onCurrencyFromChange: nop,
  onCurrencyToChange: nop,
  onExchange: nop,
};

it('renders correctly', () => {
  const wrapper = shallow(<ExchangeWidget {...testProps}/>);
  expect(toJson(wrapper)).toMatchSnapshot();
});

it('calls onAmountFromChange when the amount in the first row changes', () => {
  const amountStr = '55';
  const onAmountFromChange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} onAmountFromChange={onAmountFromChange}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  rows.at(0).props().onAmountChange(amountStr);

  expect(onAmountFromChange).toBeCalledTimes(1);
  expect(onAmountFromChange).toHaveBeenLastCalledWith(amountStr);
});

it('calls onAmountToChange when the amount in the second row changes', () => {
  const amountStr = '66';
  const onAmountToChange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} onAmountToChange={onAmountToChange}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  rows.at(1).props().onAmountChange(amountStr);

  expect(onAmountToChange).toBeCalledTimes(1);
  expect(onAmountToChange).toHaveBeenLastCalledWith(amountStr);
});

it('calls onCurrencyFromChange when the currency in the first row changes', () => {
  const currency = Currency.EUR;
  const onCurrencyFromChange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} onCurrencyFromChange={onCurrencyFromChange}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  rows.at(0).props().onCurrencyChange(currency);

  expect(onCurrencyFromChange).toBeCalledTimes(1);
  expect(onCurrencyFromChange).toHaveBeenLastCalledWith(currency);
});

it('calls onCurrencyToChange when the currency in the second row changes', () => {
  const currency = Currency.GBP;
  const onCurrencyToChange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} onCurrencyToChange={onCurrencyToChange}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  rows.at(1).props().onCurrencyChange(currency);

  expect(onCurrencyToChange).toBeCalledTimes(1);
  expect(onCurrencyToChange).toHaveBeenLastCalledWith(currency);
});

it('calls onExchange when the button is clicked', () => {
  const onExchange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} isExchangeDisabled={false} onExchange={onExchange}/>);

  const button = wrapper.find(Button);
  expect(button).toHaveLength(1);

  expect(button.props().onClick).toBeTruthy();
  button.props().onClick!({} as MouseEvent<HTMLButtonElement>);

  expect(onExchange).toBeCalledTimes(1);
});

it('calls onExchange when Enter is pressed in one of the inputs', () => {
  const onExchange = jest.fn();
  const wrapper = shallow(<ExchangeWidget {...testProps} isExchangeDisabled={false} onExchange={onExchange}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  expect(rows.at(0).props().onInputEnterPress).toBeTruthy();
  rows.at(0).props().onInputEnterPress!();
  expect(onExchange).toBeCalledTimes(1);

  onExchange.mockClear();

  expect(rows.at(1).props().onInputEnterPress).toBeTruthy();
  rows.at(1).props().onInputEnterPress!();
  expect(onExchange).toBeCalledTimes(1);
});

it('disables the button according to isExchangeDisabled prop', () => {
  const isExchangeButtonDisabled1 = true;
  const wrapper1 = shallow(<ExchangeWidget {...testProps} isExchangeDisabled={isExchangeButtonDisabled1}/>);

  const button1 = wrapper1.find(Button);
  expect(button1).toHaveLength(1);
  expect(button1.props().disabled).toEqual(isExchangeButtonDisabled1);

  const isExchangeButtonDisabled2 = false;
  const wrapper2 = shallow(<ExchangeWidget {...testProps} isExchangeDisabled={isExchangeButtonDisabled2}/>);

  const button2 = wrapper2.find(Button);
  expect(button2).toHaveLength(1);
  expect(button2.props().disabled).toEqual(isExchangeButtonDisabled2);
});

it('doesn\'t forward onInputEnterPress when isExchangeDisabled === true', () => {
  const wrapper = shallow(<ExchangeWidget {...testProps} isExchangeDisabled={true}/>);

  const rows = wrapper.find(CurrencyRow);
  expect(rows).toHaveLength(2);

  expect(rows.at(0).props().onInputEnterPress).toBeFalsy();
  expect(rows.at(1).props().onInputEnterPress).toBeFalsy();
});

it('forwards the isRateFetching prop', () => {
  const isRateFetching1 = true;
  const wrapper1 = shallow(<ExchangeWidget {...testProps} isRateFetching={isRateFetching1}/>);

  const rows1 = wrapper1.find(CurrencyRow);
  expect(rows1).toHaveLength(2);
  expect(rows1.at(1).props().isRateFetching).toEqual(isRateFetching1);

  const isRateFetching2 = false;
  const wrapper2 = shallow(<ExchangeWidget {...testProps} isRateFetching={isRateFetching2}/>);

  const rows2 = wrapper2.find(CurrencyRow);
  expect(rows2).toHaveLength(2);
  expect(rows2.at(1).props().isRateFetching).toEqual(isRateFetching2);
});

it('forwards the isSourceBalanceError prop', () => {
  const isSourceBalanceError1 = true;
  const wrapper1 = shallow(<ExchangeWidget {...testProps} isSourceBalanceError={isSourceBalanceError1}/>);

  const rows1 = wrapper1.find(CurrencyRow);
  expect(rows1).toHaveLength(2);
  expect(rows1.at(0).props().isBalanceError).toEqual(isSourceBalanceError1);

  const isSourceBalanceError2 = false;
  const wrapper2 = shallow(<ExchangeWidget {...testProps} isSourceBalanceError={isSourceBalanceError2}/>);

  const rows2 = wrapper2.find(CurrencyRow);
  expect(rows2).toHaveLength(2);
  expect(rows2.at(0).props().isBalanceError).toEqual(isSourceBalanceError2);
});
