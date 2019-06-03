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

it('calls fetchRatesForCurrency 2 times in fetchTimeout*1.5 time (on mount and after fetchTimeout)', async () => {
  const timeout = 1000;
  const fetchFunc = jest.fn();
  shallow(
    <ExchangeWidgetController {...testProps} fetchTimeout={timeout} fetchRatesForCurrency={fetchFunc}/>
  );
  await sleep(timeout * 1.5);

  expect(fetchFunc).toHaveBeenCalledTimes(2);
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
