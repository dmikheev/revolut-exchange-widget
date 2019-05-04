import { Currency } from '../../constants/currencies';

export interface IRootState {
  balances: IBalancesState;
  rates: IRatesState;
}

export type IBalancesState = {
  [key in Currency]?: number;
};

export type IRatesState = {
  [key in Currency]?: ICurrencyData;
};

interface ICurrencyDataBase {
  isFetching: boolean;
  isLoaded: boolean;
  rates?: ICurrencyRatesData;
}
type ICurrencyRatesData = {
  [key in Currency]: number;
};

interface ICurrencyDataLoaded extends ICurrencyDataBase {
  isLoaded: true;
  rates: ICurrencyRatesData;
}
interface ICurrencyDataNotLoaded extends ICurrencyDataBase {
  isLoaded: false;
  rates: undefined;
}
type ICurrencyData = ICurrencyDataLoaded | ICurrencyDataNotLoaded;
