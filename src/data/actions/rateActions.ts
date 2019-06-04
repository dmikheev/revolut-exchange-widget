import { Dispatch } from 'redux';
import ccApi, { IPairRatesData } from '../../api/currencyConverterApi';
import { Currency, CurrencyPair, getCurrencyPair } from '../../constants/currencies';
import { IAppState } from '../reducers/rootState';

export enum RateActionType {
  FETCH_RATES_REQUEST = 'FETCH_RATES_REQUEST',
  FETCH_RATES_RESPONSE_SUCCESS = 'FETCH_RATES_RESPONSE_SUCCESS',
  FETCH_RATES_RESPONSE_ERROR = 'FETCH_RATES_RESPONSE_ERROR',
}

interface IFetchRatesRequestAction {
  data: {
    pair: CurrencyPair;
  };
  type: RateActionType.FETCH_RATES_REQUEST;
}
const fetchRatesRequest = (pair: CurrencyPair) => ({
  data: { pair },
  type: RateActionType.FETCH_RATES_REQUEST,
});

interface IFetchRatesResponseSuccessAction {
  data: {
    pair: CurrencyPair;
    response: IPairRatesData;
  };
  type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS;
}
const fetchRatesResponseSuccess = (pair: CurrencyPair, response: IPairRatesData) => ({
  data: { pair, response },
  type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
});

interface IFetchRatesResponseErrorAction {
  data: {
    pair: CurrencyPair;
  };
  type: RateActionType.FETCH_RATES_RESPONSE_ERROR;
}
const fetchRatesResponseError = (pair: CurrencyPair) => ({
  data: { pair },
  type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
});

export const fetchRates = (cur1: Currency, cur2: Currency) =>
  (dispatch: Dispatch, getState: () => IAppState) => {
    const pair = getCurrencyPair(cur1, cur2);
    const currencyState = getState().rates[pair];
    if (currencyState && currencyState.isFetching) {
      return;
    }

    dispatch(fetchRatesRequest(pair));
    return ccApi.get(cur1, cur2)
      .then((response) => dispatch(fetchRatesResponseSuccess(pair, response)))
      .catch(() => dispatch(fetchRatesResponseError(pair)));
  };

export type IRateAction =
  IFetchRatesRequestAction
  | IFetchRatesResponseSuccessAction
  | IFetchRatesResponseErrorAction;
