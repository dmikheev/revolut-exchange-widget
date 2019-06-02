import React from 'react';
import { shallow } from 'enzyme';
import { Currency } from '../../constants/currencies';
import ExchangeWidgetController from './ExchangeWidgetController';

it('shallow renders without crashing', () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  shallow(
    <ExchangeWidgetController
      backgroundColor="#fff"
      balances={{}}
      currencies={currencies}
      rates={{}}
      onExchange={() => {}}
      fetchRatesForCurrency={() => {}}
    />
  );
});
