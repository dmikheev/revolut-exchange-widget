import { Currency } from '../../constants/currencies';
import { BalanceActionType } from '../actions/balanceActions';
import reducer from './balancesReducer';

describe('Balances reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({});
  });

  it('handles the EXCHANGE_CURRENCY action', () => {
    expect(reducer(
      {
        [Currency.USD]: 100,
      },
      {
        data: {
          amountFrom: 10,
          amountTo: 10,
          currencyFrom: Currency.USD,
          currencyTo: Currency.EUR,
        },
        type: BalanceActionType.EXCHANGE_CURRENCY,
      },
    )).toEqual({
      [Currency.USD]: 90,
      [Currency.EUR]: 10,
    });

    expect(reducer(
      {
        [Currency.USD]: 90,
        [Currency.EUR]: 10,
      },
      {
        data: {
          amountFrom: 5,
          amountTo: 20,
          currencyFrom: Currency.EUR,
          currencyTo: Currency.USD,
        },
        type: BalanceActionType.EXCHANGE_CURRENCY,
      },
    )).toEqual({
      [Currency.USD]: 110,
      [Currency.EUR]: 5,
    });
  });
});
