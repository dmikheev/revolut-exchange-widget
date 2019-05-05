import { Currency } from '../../constants/currencies';

export type IBalancesData = {
  [key in Currency]?: number;
};
