import createMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { Currency } from '../../constants/currencies';
import { IAppState } from '../reducers/rootState';
import { BalanceActionType, exchangeCurrency } from './balanceActions';
import { IAppAction } from './IAppAction';

const middlewares = [thunk];
const mockStore = createMockStore<IAppState, ThunkDispatch<IAppState, void, IAppAction>>(middlewares);

describe('Balance actions', () => {
  it('creates EXCHANGE_CURRENCY action with correct data', () => {
    const storeState: IAppState = {
      balances: {
        [Currency.USD]: 10,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.EUR]: {
          isFetching: false,
          isLoaded: true,
          rates: { [Currency.USD]: 2 },
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency(Currency.USD, 2, Currency.EUR));
    expect(store.getActions()).toEqual([
      {
        data: {
          amountFrom: 2,
          amountTo: 1,
          currencyFrom: Currency.USD,
          currencyTo: Currency.EUR,
        },
        type: BalanceActionType.EXCHANGE_CURRENCY,
      },
    ]);
  });

  it('doesn\'t dispatch any action if we haven\'t loaded rates for currency', () => {
    const storeState: IAppState = {
      balances: {
        [Currency.USD]: 10,
        [Currency.EUR]: 0,
      },
      rates: {},
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency(Currency.USD, 2, Currency.EUR));
    expect(store.getActions().length).toEqual(0);
  });

  it('doesn\'t dispatch any action if we have no rate for source currency', () => {
    const storeState: IAppState = {
      balances: {
        [Currency.USD]: 10,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.EUR]: {
          isFetching: false,
          isLoaded: true,
          rates: {},
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency(Currency.USD, 2, Currency.EUR));
    expect(store.getActions().length).toEqual(0);
  });

  it('doesn\'t dispatch any action if we have not enough source balance', () => {
    const storeState: IAppState = {
      balances: {
        [Currency.USD]: 1,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.EUR]: {
          isFetching: false,
          isLoaded: true,
          rates: { [Currency.USD]: 2 },
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency(Currency.USD, 2, Currency.EUR));
    expect(store.getActions().length).toEqual(0);
  });

  it('doesn\'t dispatch any action if we have not enough source balance', () => {
    const storeState: IAppState = {
      balances: {
        [Currency.USD]: 1,
        [Currency.EUR]: 0,
      },
      rates: {
        [Currency.EUR]: {
          isFetching: false,
          isLoaded: true,
          rates: { [Currency.USD]: 2 },
        },
      },
    };
    const store = mockStore(storeState);

    store.dispatch(exchangeCurrency(Currency.USD, 2, Currency.EUR));
    expect(store.getActions().length).toEqual(0);
  });
});
