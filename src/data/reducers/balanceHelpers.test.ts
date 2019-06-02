import { Currency } from '../../constants/currencies';
import { getBalanceForCurrency } from './balanceHelpers';

describe('Balance helpers', () => {
  it('returns the right balance', () => {
    const balances = {
      [Currency.USD]: 10,
      [Currency.EUR]: 5,
    };

    expect(getBalanceForCurrency(balances, Currency.USD)).toEqual(10);
    expect(getBalanceForCurrency(balances, Currency.EUR)).toEqual(5);
  });

  it('returns 0 if the balance for the requested currency is not defined', () => {
    const balances = {
      [Currency.USD]: 10,
      [Currency.EUR]: 5,
    };

    expect(getBalanceForCurrency(balances, Currency.GBP)).toEqual(0);
  });
});
