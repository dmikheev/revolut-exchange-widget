import createMockStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import rApi, { IApiResponse } from '../../api/ratesApi';
import { Currency } from '../../constants/currencies';
import { IAppState } from '../reducers/rootState';
import { IAppAction } from './IAppAction';
import { fetchRatesForCurrency, RateActionType } from './rateActions';

jest.mock('../../api/ratesApi');
const mockedApi = rApi as jest.Mocked<typeof rApi>;

const middlewares = [thunk];
const mockStore = createMockStore<IAppState, ThunkDispatch<IAppState, void, IAppAction>>(middlewares);

describe('Rate actions', () => {
  it('creates FETCH_RATES_RESPONSE_SUCCESS on request success', async () => {
    const testCurrency = Currency.USD;
    const testResponseData = {} as IApiResponse;
    mockedApi.get.mockImplementationOnce(async () => testResponseData);

    const expectedActions = [
      { data: { currency: testCurrency }, type: RateActionType.FETCH_RATES_REQUEST },
      {
        data: { currency: testCurrency, response: testResponseData },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRatesForCurrency(testCurrency));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates FETCH_RATES_RESPONSE_ERROR on request error', async () => {
    const testCurrency = Currency.USD;
    mockedApi.get.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      { data: { currency: testCurrency }, type: RateActionType.FETCH_RATES_REQUEST },
      { data: { currency: testCurrency }, type: RateActionType.FETCH_RATES_RESPONSE_ERROR },
    ];
    const store = mockStore({ balances: {}, rates: {} });

    await store.dispatch(fetchRatesForCurrency(testCurrency));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('doesn\'t call api if rates for currency is already fetching', async () => {
    const testResponseData = {} as IApiResponse;
    mockedApi.get.mockImplementationOnce(async () => testResponseData);

    const store = mockStore({ balances: {}, rates: { [Currency.USD]: { isFetching: true, isLoaded: false } } });

    await store.dispatch(fetchRatesForCurrency(Currency.USD));
    expect(store.getActions().length).toEqual(0);
  });
});
