import { Currency } from '../../constants/currencies';

export interface IAppState {
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
  isLoaded?: boolean;
  rates?: ICurrencyRatesData;
}
type ICurrencyRatesData = {
  [key in Currency]?: number;
};

interface ICurrencyDataLoaded extends ICurrencyDataBase {
  isLoaded: true;
  rates: ICurrencyRatesData;
}
interface ICurrencyDataNotLoaded extends ICurrencyDataBase {
  isLoaded?: false;
}
export type ICurrencyData = ICurrencyDataLoaded | ICurrencyDataNotLoaded;
