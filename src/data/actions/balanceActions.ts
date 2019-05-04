import { Currency } from '../../constants/currencies';

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
  amountTo: number,
) => ({
  data: {
    amountFrom,
    amountTo,
    currencyFrom,
    currencyTo,
  },
  type: BalanceActionType.EXCHANGE_CURRENCY,
});

export type IBalanceAction =
  IExchangeCurrencyAction;
