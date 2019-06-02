import { shallow } from 'enzyme';
import React from 'react';
import { Currency } from '../../../constants/currencies';
import CurrencyRow from './CurrencyRow';

it('shallow renders without crashing', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const nop = () => {};
  shallow(
    <CurrencyRow
      amountStr="10"
      balance={100}
      currencies={currencies}
      currency={Currency.EUR}
      rate={2}
      sourceCurrency={Currency.USD}
      onAmountChange={nop}
      onCurrencyChange={nop}
    />
  );
});
