import { shallow } from 'enzyme';
import React from 'react';
import { Currency } from '../../../constants/currencies';
import CurrencyRow, { ICurrencyRowProps } from './CurrencyRow';

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

it('shallow renders without crashing', () => {
  shallow(
    <CurrencyRow {...testProps}/>
  );
});

it('shallow renders without crashing with balance error', () => {
  shallow(
    <CurrencyRow {...testProps} isBalanceError={true}/>
  );
});
