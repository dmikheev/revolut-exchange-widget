import createMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import ccApi, { IPairRatesData } from '../../api/currencyConverterApi';
import { Currency, CurrencyPair } from '../../constants/currencies';
import { IAppState } from '../reducers/rootState';
import { IAppAction } from './IAppAction';
import { fetchRates, RateActionType } from './rateActions';

jest.mock('../../api/currencyConverterApi');
const mockedCcApi = ccApi as jest.Mocked<typeof ccApi>;

const middlewares = [thunk];
const mockStore = createMockStore<IAppState, ThunkDispatch<IAppState, void, IAppAction>>(middlewares);

describe('Rate actions', () => {
  it('creates FETCH_RATES_RESPONSE_SUCCESS on request success', async () => {
    const currency1 = Currency.USD;
    const currency2 = Currency.EUR;
    const pair = CurrencyPair.USD_EUR;
    const testResponseData = {} as IPairRatesData;
    mockedCcApi.get.mockImplementationOnce(async () => testResponseData);

    const expectedActions = [
      { data: { pair }, type: RateActionType.FETCH_RATES_REQUEST },
      {
        data: { pair, response: testResponseData },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRates(currency1, currency2));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates FETCH_RATES_RESPONSE_ERROR on request error', async () => {
    const currency1 = Currency.USD;
    const currency2 = Currency.EUR;
    const pair = CurrencyPair.USD_EUR;
    mockedCcApi.get.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      { data: { pair }, type: RateActionType.FETCH_RATES_REQUEST },
      { data: { pair }, type: RateActionType.FETCH_RATES_RESPONSE_ERROR },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRates(currency1, currency2));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('doesn\'t call api if rates for currency is already fetching', async () => {
    const currency1 = Currency.USD;
    const currency2 = Currency.EUR;
    const pair = CurrencyPair.USD_EUR;
    const testResponseData = {} as IPairRatesData;
    mockedCcApi.get.mockImplementationOnce(async () => testResponseData);

    const store = mockStore({ balances: {}, rates: { [pair]: { isFetching: true, isLoaded: false } } });

    await store.dispatch(fetchRates(currency1, currency2));
    expect(store.getActions().length).toEqual(0);
  });
});
