import { Currency } from '../constants/currencies';

interface IApiResponse {
  [key: string]: number;
}

export type IPairRatesData = {
  [key in Currency]?: number;
};

export function getPairsForCurrencies(cur1: Currency, cur2: Currency): string[] {
  return [`${cur1}_${cur2}`, `${cur2}_${cur1}`];
}
export function getUrlForCurrencies(cur1: Currency, cur2: Currency): string {
  return `https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=0704c7f86d7dcba2bbcd&q=${getPairsForCurrencies(cur1, cur2).join(',')}`;
}

const ccApi = {
  get(cur1: Currency, cur2: Currency): Promise<IPairRatesData> {
    if (cur1 === cur2) {
      return Promise.resolve({ [cur1]: 1 });
    }

    return fetch(getUrlForCurrencies(cur1, cur2))
      .then((response) => {
        if (!response.ok) {
          throw response;
        }

        return response.json();
      })
      .then((data: IApiResponse) => {
        const pair1 = `${cur1}_${cur2}`;
        const pair2 = `${cur2}_${cur1}`;

        return {
          [cur1]: data[pair1],
          [cur2]: data[pair2],
        };
      });
  }
};
export default ccApi;
