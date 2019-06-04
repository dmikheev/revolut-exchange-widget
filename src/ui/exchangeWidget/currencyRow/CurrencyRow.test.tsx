import { CircularProgress, MenuItem, Select, Typography } from '@material-ui/core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import { cleanup, render } from '@testing-library/react';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Currency, SymbolByCurrency } from '../../../constants/currencies';
import { KeyCode } from '../../../constants/keyCodes';
import CashInput from './CashInput';
import CurrencyRow, { ICurrencyRowProps, StyledTextField } from './CurrencyRow';

const currencies = [Currency.USD, Currency.EUR];
const nop = () => {};
const testProps: ICurrencyRowProps = {
  amountStr: '10',
  balance: 100,
  currencies,
  currency: Currency.EUR,
  rate: 2,
  sourceCurrency: Currency.USD,
  onAmountChange: nop,
  onCurrencyChange: nop,
};

afterEach(cleanup);

it('shallow renders without crashing', () => {
  shallow(<CurrencyRow {...testProps}/>);
});

it('adds className to the container element', () => {
  const className = 'test';
  const wrapper = shallow(<CurrencyRow {...testProps} className={className}/>);

  expect(wrapper.hasClass(className)).toBeTruthy();
});

it('forwards amount to the input', () => {
  const amountStr = '10';
  const wrapper = shallow(<CurrencyRow {...testProps} amountStr={amountStr}/>);

  const input = wrapper.find(StyledTextField);
  expect(input).toHaveLength(1);
  expect(input.props().value).toEqual(amountStr);
});

it('renders select with option for each currency and the current currency as value', () => {
  const testCurrencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const currentCurrency = Currency.USD;
  const wrapper = shallow(<CurrencyRow {...testProps} currency={currentCurrency} currencies={testCurrencies}/>);

  const selectFind = wrapper.find(Select);
  expect(selectFind).toHaveLength(1);
  expect(selectFind.props().value).toEqual(currentCurrency);

  type MenuItemElement = React.ReactElement<typeof MenuItem>;
  const selectChildren = selectFind.props().children as MenuItemElement[];
  expect(selectChildren).toHaveLength(testCurrencies.length);
  expect(selectChildren.map((menuItem) => (menuItem.props as MenuItemProps).value)).toEqual(testCurrencies);
});

it('shows currency balance', () => {
  const balance = 100;
  const currency = Currency.USD;
  const balanceText = `You have ${SymbolByCurrency[currency]}${balance}`;
  const { queryByText } = render(<CurrencyRow {...testProps} balance={balance} currency={currency}/>);

  expect(queryByText(balanceText)).toBeTruthy();
});

it('shows exchange rate if required props are specified', () => {
  const currencyFrom = Currency.USD;
  const currencyTo = Currency.EUR;
  const rate = 2;
  const rateText = `${SymbolByCurrency[currencyTo]}1 = ${SymbolByCurrency[currencyFrom]}${rate}`;
  const { queryByText } = render(
    <CurrencyRow
      {...testProps}
      currency={currencyTo}
      sourceCurrency={currencyFrom}
      rate={rate}
    />
  );

  expect(queryByText(rateText)).toBeTruthy();
});

it('doesn\'t show exchange rate for source currency', () => {
  const currencyFrom = Currency.USD;
  const currencyTo = Currency.EUR;
  const rate = 2;
  const rateText = `${SymbolByCurrency[currencyTo]}1 = ${SymbolByCurrency[currencyFrom]}${rate}`;
  const { queryByText } = render(
    <CurrencyRow
      {...testProps}
      currency={currencyTo}
      sourceCurrency={currencyFrom}
      rate={rate}
      isSourceCurrency={true}
    />
  );

  expect(queryByText(rateText)).toBeFalsy();
});

it('doesn\'t show exchange rate if current currency equals source currency', () => {
  const currencyFrom = Currency.USD;
  const currencyTo = currencyFrom;
  const rate = 1;
  const rateText = `${SymbolByCurrency[currencyTo]}1 = ${SymbolByCurrency[currencyFrom]}${rate}`;
  const { queryByText } = render(
    <CurrencyRow
      {...testProps}
      currency={currencyTo}
      sourceCurrency={currencyFrom}
      rate={rate}
    />
  );

  expect(queryByText(rateText)).toBeFalsy();
});

it('shows input with error state and balance text with error color if there is a balance error', () => {
  const wrapper = mount(
    <CurrencyRow
      {...testProps}
      amountStr="10"
      balance={100}
      isBalanceError={true}
    />
  );

  const inputFind = wrapper.find(CashInput);
  expect(inputFind).toHaveLength(1);
  expect(inputFind.props().error).toBeTruthy();

  const typographyFind = wrapper.find(Typography);
  const errorColorTypography = typographyFind.filter({ color: 'error' });
  expect(errorColorTypography).toHaveLength(1);
  expect(errorColorTypography.text()).toEqual(expect.stringContaining('You have'));
});

it('shows exchange rate loader if required props are specified and rate is fetching', () => {
  const wrapper = shallow(
    <CurrencyRow
      {...testProps}
      currency={Currency.EUR}
      sourceCurrency={Currency.USD}
      rate={2}
      isRateFetching={true}
    />
  );

  expect(wrapper.find(CircularProgress)).toHaveLength(1);
});

it('calls onAmountChange with the correct value when the input changes', () => {
  const value = '12.34';
  const onAmountChange = jest.fn();
  const wrapper = shallow(<CurrencyRow {...testProps} onAmountChange={onAmountChange}/>);

  const input = wrapper.find(StyledTextField);
  expect(input).toHaveLength(1);

  expect(input.props().onChange).toBeTruthy();
  input.props().onChange!({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  expect(onAmountChange).toBeCalledTimes(1);
  expect(onAmountChange).toHaveBeenLastCalledWith(value);
});

it('calls onInputEnterPress when Enter has been pressed in the input', () => {
  const onInputEnterPress = jest.fn();
  const wrapper = shallow(<CurrencyRow {...testProps} onInputEnterPress={onInputEnterPress}/>);

  const input = wrapper.find(StyledTextField);
  expect(input).toHaveLength(1);

  expect(input.props().onKeyPress).toBeTruthy();
  input.props().onKeyPress!({ which: KeyCode.DIGIT_1 } as React.KeyboardEvent<HTMLInputElement>);
  expect(onInputEnterPress).not.toBeCalled();

  input.props().onKeyPress!({ which: KeyCode.ENTER } as React.KeyboardEvent<HTMLInputElement>);
  expect(onInputEnterPress).toBeCalledTimes(1);
});

it('calls onCurrencyChange when currency has been selected', async () => {
  const currencyToChoose = Currency.EUR;
  const onCurrencyChange = jest.fn();
  const wrapper = shallow(
    <CurrencyRow
      {...testProps}
      currencies={[Currency.USD, Currency.EUR]}
      currency={Currency.USD}
      onCurrencyChange={onCurrencyChange}
    />
  );

  const select = wrapper.find(Select);
  expect(select).toHaveLength(1);
  expect(select.props().onChange).toBeTruthy();
  select.props().onChange!({ target: { value: currencyToChoose } } as React.ChangeEvent<HTMLSelectElement>, undefined);

  expect(onCurrencyChange).toBeCalledTimes(1);
  expect(onCurrencyChange).toHaveBeenLastCalledWith(currencyToChoose);
});
