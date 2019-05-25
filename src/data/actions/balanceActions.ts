import { Dispatch } from 'redux';
import { Currency } from '../../constants/currencies';
import { IRootState } from '../reducers/rootState';

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
) => (dispatch: Dispatch, getState: () => IRootState) => {
  const state = getState();

  const currencyToData = state.rates[currencyTo];
  if (!currencyToData || !currencyToData.isLoaded) {
    return;
  }

  const rate = currencyToData.rates[currencyFrom];
  if (rate === undefined) {
    return;
  }

  const balanceFrom = state.balances[currencyFrom] || 0;
  if (amountFrom > balanceFrom) {
    return;
  }

  return dispatch({
    data: {
      amountFrom,
      amountTo: amountFrom / rate,
      currencyFrom,
      currencyTo,
    },
    type: BalanceActionType.EXCHANGE_CURRENCY,
  });
};

export type IBalanceAction =
  IExchangeCurrencyAction;
