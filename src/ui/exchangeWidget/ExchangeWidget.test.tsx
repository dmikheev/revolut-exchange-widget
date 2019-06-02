import React from 'react';
import { shallow } from 'enzyme';
import { Currency } from '../../constants/currencies';
import ExchangeWidget from './ExchangeWidget';

it('shallow renders without crashing', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const nop = () => {};
  shallow(
    <ExchangeWidget
      backgroundColor="#fff"
      amountFromStr="10"
      amountToStr="5"
      balanceFrom={100}
      balanceTo={50}
      currencies={currencies}
      currencyFrom={Currency.USD}
      currencyTo={Currency.EUR}
      isExchangeButtonDisabled={false}
      isRateFetching={false}
      isSourceBalanceError={false}
      onAmountFromChange={nop}
      onAmountToChange={nop}
      onCurrencyFromChange={nop}
      onCurrencyToChange={nop}
      onExchange={nop}
    />
  );
});
