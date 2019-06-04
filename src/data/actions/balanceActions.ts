import { Dispatch } from 'redux';
import { Currency, getCurrencyPair } from '../../constants/currencies';
import { getBalanceForCurrency } from '../reducers/balanceHelpers';
import { IAppState } from '../reducers/rootState';

export enum BalanceActionType {
  EXCHANGE_CURRENCY = 'EXCHANGE_CURRENCY',
}

interface IExchangeCurrencyActionData {
  amountFrom: number;
  amountTo: number;
  currencyFrom: Currency;
  currencyTo: Currency;
}
interface IExchangeCurrencyAction {
  data: IExchangeCurrencyActionData;
  type: BalanceActionType.EXCHANGE_CURRENCY,
}

export const exchangeCurrency = (
  currencyFrom: Currency,
  amountFrom: number,
  currencyTo: Currency,
) => (dispatch: Dispatch, getState: () => IAppState) => {
  const state = getState();

  const rates = state.rates[getCurrencyPair(currencyFrom, currencyTo)];
  if (!rates || !rates.isLoaded) {
    return;
  }

  const rate = rates.data[currencyFrom];
  if (rate === undefined) {
    return;
  }

  const balanceFrom = getBalanceForCurrency(state.balances, currencyFrom);
  if (amountFrom > balanceFrom) {
    return;
  }

  return dispatch({
    data: {
      amountFrom,
      amountTo: amountFrom * rate,
      currencyFrom,
      currencyTo,
    },
    type: BalanceActionType.EXCHANGE_CURRENCY,
  });
};

export type IBalanceAction =
  IExchangeCurrencyAction;
