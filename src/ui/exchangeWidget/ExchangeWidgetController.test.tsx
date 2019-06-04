import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Currency, CurrencyPair } from '../../constants/currencies';
import { IBalancesState, IRatesState } from '../../data/reducers/rootState';
import ExchangeWidget from './ExchangeWidget';
import ExchangeWidgetController, { IExchangeWidgetControllerProps } from './ExchangeWidgetController';

const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
const testProps: IExchangeWidgetControllerProps = {
  backgroundColor: '#fff',
  balances: {
    [Currency.USD]: 111,
    [Currency.EUR]: 222,
  },
  currencies: currencies,
  rates: {
    [CurrencyPair.USD_EUR]: {
      data: {
        [Currency.USD]: 0.5,
      },
      isFetching: false,
      isLoaded: true,
    },
  },
  fetchRates: () => {},
  onExchange: () => {},
};

it('renders correctly', () => {
  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      className="test"
    />
  );

  expect(toJson(wrapper)).toMatchSnapshot();
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
    <ExchangeWidgetController {...testProps} fetchTimeout={timeout} fetchRates={fetchFunc}/>
  );
  await sleep(timeout * 1.5);

  expect(fetchFunc).toHaveBeenCalledTimes(2);
});

it('sets the first currency from the list as currencyFrom and the second as currencyTo', () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const wrapper = shallow(
    <ExchangeWidgetController {...testProps} currencies={currencies}/>
  );

  const widgetView = wrapper.find(ExchangeWidget);
  expect(widgetView).toHaveLength(1);

  expect(widgetView.props().currencyFrom).toEqual(currencies[0]);
  expect(widgetView.props().currencyTo).toEqual(currencies[1]);
});

it('sets amountTo according to the rate if the amountFrom changes', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr = '10';
  const amountToStr = '5';
  const rates: IRatesState = {
    [CurrencyPair.USD_EUR]: {
      data: {
        [Currency.USD]: 0.5,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const wrapper = shallow(
    <ExchangeWidgetController {...testProps} currencies={currencies} rates={rates}/>
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2.props().amountToStr).toEqual(amountToStr);
});

it('sets amountFrom according to rate if the amountTo changes', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr = '8';
  const amountToStr = '2';
  const rates: IRatesState = {
    [CurrencyPair.USD_EUR]: {
      data: {
        [Currency.USD]: 0.25,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const wrapper = shallow(
    <ExchangeWidgetController {...testProps} currencies={currencies} rates={rates}/>
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountToChange(amountToStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2.props().amountFromStr).toEqual(amountFromStr);
});

it('updates amountTo if currencyFrom changes', () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const currencyFrom2 = Currency.GBP;
  const amountFromStr = '10';
  const amountToStr = '30';
  const rates: IRatesState = {
    [CurrencyPair.EUR_GBP]: {
      data: {
        [Currency.GBP]: 3,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const wrapper = shallow(
    <ExchangeWidgetController {...testProps} currencies={currencies} rates={rates}/>
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  view2.props().onCurrencyFromChange(currencyFrom2);

  const view3 = wrapper.find(ExchangeWidget);
  expect(view3).toHaveLength(1);
  expect(view3.props().amountToStr).toEqual(amountToStr);
});

it('updates amountTo if currencyTo changes', () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const currencyTo2 = Currency.GBP;
  const amountFromStr = '10';
  const amountToStr = '5';
  const rates: IRatesState = {
    [CurrencyPair.USD_GBP]: {
      data: {
        [Currency.USD]: 0.5,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const wrapper = shallow(
    <ExchangeWidgetController {...testProps} currencies={currencies} rates={rates}/>
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  view2.props().onCurrencyToChange(currencyTo2);

  const view3 = wrapper.find(ExchangeWidget);
  expect(view3).toHaveLength(1);
  expect(view3.props().amountToStr).toEqual(amountToStr);
});

it('fetches rates if any currency changes', async () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const currencyFrom = Currency.EUR;
  const currencyTo = Currency.GBP;
  const fetchFunc = jest.fn();
  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      currencies={currencies}
      fetchRates={fetchFunc}
    />
  );

  fetchFunc.mockClear();

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onCurrencyToChange(currencyTo);

  expect(fetchFunc).toBeCalledTimes(1);

  fetchFunc.mockClear();

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  view2.props().onCurrencyFromChange(currencyFrom);

  expect(fetchFunc).toBeCalledTimes(1);
});

it('calls onExchange with the right values', () => {
  const currencies = [Currency.USD, Currency.EUR, Currency.GBP];
  const amountFrom = 10;
  const amountFromStr = '10';
  const currencyFrom = Currency.EUR;
  const currencyTo = Currency.GBP;
  const balances: IBalancesState = {
    [Currency.EUR]: 100,
  };
  const rates: IRatesState = {
    [CurrencyPair.EUR_GBP]: {
      data: {
        [Currency.EUR]: 0.5,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const onExchange = jest.fn();
  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      balances={balances}
      currencies={currencies}
      rates={rates}
      onExchange={onExchange}
    />
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onCurrencyFromChange(currencyFrom);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  view2.props().onCurrencyToChange(currencyTo);

  const view3 = wrapper.find(ExchangeWidget);
  expect(view3).toHaveLength(1);
  view3.props().onAmountFromChange(amountFromStr);

  const view4 = wrapper.find(ExchangeWidget);
  expect(view4).toHaveLength(1);
  view4.props().onExchange();

  expect(onExchange).toBeCalledTimes(1);
  expect(onExchange).toHaveBeenLastCalledWith(currencyFrom, amountFrom, currencyTo);
});

it('updates amountTo if rates change', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr = '100';
  const rate1 = 2;
  const amountToStr1 = '200';
  const rate2 = 5;
  const amountToStr2 = '500';
  const rates1: IRatesState = {
    [CurrencyPair.USD_EUR]: {
      data: {
        [Currency.USD]: rate1,
      },
      isFetching: false,
      isLoaded: true,
    },
  };
  const rates2: IRatesState = {
    [CurrencyPair.USD_EUR]: {
      data: {
        [Currency.USD]: rate2,
      },
      isFetching: false,
      isLoaded: true,
    },
  };

  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      currencies={currencies}
      rates={rates1}
    />
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2.props().amountToStr).toEqual(amountToStr1);

  wrapper.setProps({ rates: rates2 });
  const view3 = wrapper.find(ExchangeWidget);
  expect(view3.props().amountToStr).toEqual(amountToStr2);
});

it('forwards isRateFetching if rates are being fetched', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const rates: IRatesState = {
    [CurrencyPair.USD_EUR]: {
      isFetching: true,
    },
  };

  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      currencies={currencies}
      rates={rates}
    />
  );

  const view = wrapper.find(ExchangeWidget);
  expect(view).toHaveLength(1);
  expect(view.props().isRateFetching).toEqual(true);
});

it('forwards isSourceBalanceError if amountFrom is greater than balance', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const balances: IBalancesState = {
    [Currency.USD]: 10,
  };

  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      balances={balances}
      currencies={currencies}
    />
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);

  view1.props().onAmountFromChange('20');
  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  expect(view2.props().isSourceBalanceError).toBeTruthy();

  view2.props().onAmountFromChange('10');
  const view3 = wrapper.find(ExchangeWidget);
  expect(view3).toHaveLength(1);
  expect(view3.props().isSourceBalanceError).toBeFalsy();

  view3.props().onAmountFromChange('5');
  const view4 = wrapper.find(ExchangeWidget);
  expect(view4).toHaveLength(1);
  expect(view4.props().isSourceBalanceError).toBeFalsy();

  view4.props().onAmountFromChange('');
  const view5 = wrapper.find(ExchangeWidget);
  expect(view5).toHaveLength(1);
  expect(view5.props().isSourceBalanceError).toBeFalsy();
});

it('disables exchange if amountFrom value is invalid', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr1 = '';
  const amountFromStr2 = 'abc';
  const onExchange = jest.fn();
  const wrapper = shallow(<ExchangeWidgetController {...testProps} currencies={currencies} onExchange={onExchange}/>);

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);

  view1.props().onAmountFromChange(amountFromStr1);
  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  expect(view2.props().isExchangeDisabled).toBeTruthy();
  view2.props().onExchange();
  expect(onExchange).not.toBeCalled();

  view2.props().onAmountFromChange(amountFromStr2);
  const view3 = wrapper.find(ExchangeWidget);
  expect(view3).toHaveLength(1);
  expect(view3.props().isExchangeDisabled).toBeTruthy();
  view3.props().onExchange();
  expect(onExchange).not.toBeCalled();
});

it('disables exchange if amountFrom is greater than balance', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr = '20';
  const balances: IBalancesState = {
    [Currency.USD]: 10,
  };
  const onExchange = jest.fn();

  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      balances={balances}
      currencies={currencies}
      onExchange={onExchange}
    />
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  expect(view2.props().isExchangeDisabled).toBeTruthy();
  view2.props().onExchange();
  expect(onExchange).not.toBeCalled();
});

it('disables exchange if there is no rate for requested currencies', () => {
  const currencies = [Currency.USD, Currency.EUR];
  const amountFromStr = '2';
  const balances: IBalancesState = {
    [Currency.USD]: 10,
  };
  const rates = {};
  const onExchange = jest.fn();

  const wrapper = shallow(
    <ExchangeWidgetController
      {...testProps}
      balances={balances}
      currencies={currencies}
      rates={rates}
      onExchange={onExchange}
    />
  );

  const view1 = wrapper.find(ExchangeWidget);
  expect(view1).toHaveLength(1);
  view1.props().onAmountFromChange(amountFromStr);

  const view2 = wrapper.find(ExchangeWidget);
  expect(view2).toHaveLength(1);
  expect(view2.props().isExchangeDisabled).toBeTruthy();
  view2.props().onExchange();
  expect(onExchange).not.toBeCalled();
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
