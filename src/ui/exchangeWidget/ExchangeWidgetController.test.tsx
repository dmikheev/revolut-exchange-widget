import { shallow } from 'enzyme';
import React from 'react';
import { Currency } from '../../constants/currencies';
import ExchangeWidgetController, { IExchangeWidgetControllerProps } from './ExchangeWidgetController';

const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
const testProps: IExchangeWidgetControllerProps = {
  backgroundColor: '#fff',
  balances: {},
  currencies: currencies,
  rates: {},
  onExchange: () => {},
  fetchRatesForCurrency: () => {},
};

it('shallow renders without crashing', () => {
  shallow(
    <ExchangeWidgetController {...testProps}/>
  );
});

it('shallow renders without crashing with only 1 currency in the currency list', () => {
  shallow(
    <ExchangeWidgetController {...testProps} currencies={[Currency.USD]}/>
  );
});

it('throws an error if the currency list is empty', () => {
  expect.assertions(1);

  try {
    shallow(
      <ExchangeWidgetController {...testProps} currencies={[]}/>
    );
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
