import { IBalanceAction } from './balanceActions';
import { IRateAction } from './rateActions';

export type IAppAction =
  IBalanceAction
  | IRateAction
;
