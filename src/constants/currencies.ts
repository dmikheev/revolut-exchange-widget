export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export const SymbolByCurrency = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
};

export enum CurrencyPair {
  USD_EUR = 'USD_EUR',
  USD_GBP = 'USD_GBP',
  EUR_GBP = 'EUR_GBP',
  USD_USD = 'USD_USD',
  EUR_EUR = 'EUR_EUR',
  GBP_GBP = 'GBP_GBP',
}

type TPairMap = {
  [key in Currency]: {
    [key in Currency]: CurrencyPair;
  };
};
const PairMap: TPairMap = {
  [Currency.USD]: {
    [Currency.USD]: CurrencyPair.USD_USD,
    [Currency.EUR]: CurrencyPair.USD_EUR,
    [Currency.GBP]: CurrencyPair.USD_GBP,
  },
  [Currency.EUR]: {
    [Currency.USD]: CurrencyPair.USD_EUR,
    [Currency.EUR]: CurrencyPair.EUR_EUR,
    [Currency.GBP]: CurrencyPair.EUR_GBP,
  },
  [Currency.GBP]: {
    [Currency.USD]: CurrencyPair.USD_GBP,
    [Currency.EUR]: CurrencyPair.EUR_GBP,
    [Currency.GBP]: CurrencyPair.GBP_GBP,
  },
};

export function getCurrencyPair(c1: Currency, c2: Currency): CurrencyPair {
  return PairMap[c1][c2];
}
