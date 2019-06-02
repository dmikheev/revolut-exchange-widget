import { Currency } from '../../constants/currencies';
import { IBalancesState } from './rootState';

export function getBalanceForCurrency(balances: IBalancesState, currency: Currency): number {
  return balances[currency] || 0;
}
