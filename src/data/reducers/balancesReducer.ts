import { BalanceActionType } from '../actions/balanceActions';
import { IAppAction } from '../actions/IAppAction';
import { getBalanceForCurrency } from './balanceHelpers';
import { IBalancesState } from './rootState';

export default function balancesReducer(
  state: IBalancesState = {},
  action: IAppAction,
): IBalancesState {
  switch (action.type) {
    case BalanceActionType.EXCHANGE_CURRENCY:
      return {
        ...state,
        [action.data.currencyFrom]: getBalanceForCurrency(state, action.data.currencyFrom) - action.data.amountFrom,
        [action.data.currencyTo]: getBalanceForCurrency(state, action.data.currencyTo) + action.data.amountTo,
      };

    default:
      return state;
  }
}
