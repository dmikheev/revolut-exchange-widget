import { IAppAction } from '../actions/IAppAction';
import { IRatesState } from './rootState';

export default function ratesReducer(state: IRatesState = {}, action: IAppAction): IRatesState {
  return state;
}
