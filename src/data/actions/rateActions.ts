import { Dispatch } from 'redux';
import erApi, { IApiResponse } from '../../api/exchangeRatesApi';
import { Currency } from '../../constants/currencies';
import { IAppState } from '../reducers/rootState';

export enum RateActionType {
  FETCH_RATES_REQUEST = 'FETCH_RATES_REQUEST',
  FETCH_RATES_RESPONSE_SUCCESS = 'FETCH_RATES_RESPONSE_SUCCESS',
  FETCH_RATES_RESPONSE_ERROR = 'FETCH_RATES_RESPONSE_ERROR',
}

interface IFetchRatesRequestAction {
  data: {
    currency: Currency;
  };
  type: RateActionType.FETCH_RATES_REQUEST;
}
const fetchRatesRequest = (currency: Currency) => ({
  data: { currency },
  type: RateActionType.FETCH_RATES_REQUEST,
});

interface IFetchRatesResponseSuccessAction {
  data: {
    currency: Currency;
    response: IApiResponse;
  };
  type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS;
}
const fetchRatesResponseSuccess = (currency: Currency, response: IApiResponse) => ({
  data: { currency, response },
  type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
});

interface IFetchRatesResponseErrorAction {
  data: {
    currency: Currency;
  };
  type: RateActionType.FETCH_RATES_RESPONSE_ERROR;
}
const fetchRatesResponseError = (currency: Currency) => ({
  data: { currency },
  type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
});

export const fetchRatesForCurrency = (currency: Currency) =>
  (dispatch: Dispatch, getState: () => IAppState) => {
    const currencyState = getState().rates[currency];
    if (currencyState && currencyState.isFetching) {
      return;
    }

    dispatch(fetchRatesRequest(currency));
    return erApi.get(currency)
      .then((response) => dispatch(fetchRatesResponseSuccess(currency, response)))
      .catch(() => dispatch(fetchRatesResponseError(currency)));
  };

export type IRateAction =
  IFetchRatesRequestAction
  | IFetchRatesResponseSuccessAction
  | IFetchRatesResponseErrorAction;
