import { IAppAction } from '../actions/IAppAction';
import { IBalancesState } from './rootState';

export default function balancesReducer(
  state: IBalancesState = {},
  action: IAppAction,
): IBalancesState {
  return state;
}
