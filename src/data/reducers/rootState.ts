import { IPairRatesData } from '../../api/currencyConverterApi';
import { Currency, CurrencyPair } from '../../constants/currencies';

export interface IAppState {
  balances: IBalancesState;
  rates: IRatesState;
}

export type IBalancesState = {
  [key in Currency]?: number;
};

export type IRatesState = {
  [key in CurrencyPair]?: IPairRates;
};

interface IPairRatesBase {
  data?: IPairRatesData;
  isFetching: boolean;
  isLoaded?: boolean;
}

interface IPairRatesLoaded extends IPairRatesBase {
  data: IPairRatesData;
  isLoaded: true;
}
interface IPairRatesNotLoaded extends IPairRatesBase {
  isLoaded?: false;
}
export type IPairRates = IPairRatesLoaded | IPairRatesNotLoaded;
