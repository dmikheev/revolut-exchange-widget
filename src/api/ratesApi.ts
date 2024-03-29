import { Currency } from '../constants/currencies';

export interface IApiResponse {
  base: Currency;
  date: string;
  rates: {
    [key in Currency]?: number;
  };
}

function getUrlForCurrency(cur: Currency): string {
  return `https://api.ratesapi.io/latest?base=${cur}`;
}

const rApi = {
  get(baseCurrency: Currency): Promise<IApiResponse> {
    return fetch(getUrlForCurrency(baseCurrency))
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      });
  },
};
export default rApi;
