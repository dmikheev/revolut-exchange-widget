import { Currency } from '../constants/currencies';
import ccApi from './currencyConverterApi';

it('fetches data from the right url', async () => {
  // definition for 'global' does not have the 'fetch' method but we mock it anyway
  const globalAny = global as any;

  const mockFetchPromise1 = Promise.resolve({
    ok: true,
    json: () => ({ USD_EUR: 1, EUR_USD: 2 }),
  });
  jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise1);

  await ccApi.get(Currency.USD, Currency.EUR);
  expect(globalAny.fetch).toHaveBeenCalledTimes(1);
  expect(globalAny.fetch)
    .toHaveBeenLastCalledWith('https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=0704c7f86d7dcba2bbcd&q=USD_EUR,EUR_USD');

  globalAny.fetch.mockRestore();


  const mockFetchPromise2 = Promise.resolve({
    ok: true,
    json: () => ({ EUR_GBP: 1, GBP_EUR: 2 }),
  });
  jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise2);

  await ccApi.get(Currency.EUR, Currency.GBP);
  expect(globalAny.fetch).toHaveBeenCalledTimes(1);
  expect(globalAny.fetch)
    .toHaveBeenLastCalledWith('https://free.currconv.com/api/v7/convert?compact=ultra&apiKey=0704c7f86d7dcba2bbcd&q=EUR_GBP,GBP_EUR');

  globalAny.fetch.mockRestore();
});

it('resolves with response json', async () => {
  // definition for 'global' does not have the 'fetch' method but we mock it anyway
  const globalAny = global as any;

  const mockSuccessResponse = { USD_EUR: 1, EUR_USD: 2 };
  const mockFetchPromise = Promise.resolve({
    ok: true,
    json: () => mockSuccessResponse,
  });
  jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise);

  const apiPromise = ccApi.get(Currency.USD, Currency.EUR);
  await expect(apiPromise).resolves.toEqual({ [Currency.USD]: 1, [Currency.EUR]: 2 });
  expect(globalAny.fetch).toHaveBeenCalledTimes(1);

  globalAny.fetch.mockRestore();
});

it('resolves with { [currency]: 1 } object if requested currencies are equal', async () => {
  // definition for 'global' does not have the 'fetch' method but we mock it anyway
  const globalAny = global as any;

  const mockSuccessResponse = { USD_EUR: 1, EUR_USD: 2 };
  const mockFetchPromise = Promise.resolve({
    ok: true,
    json: () => mockSuccessResponse,
  });
  jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise);

  const apiPromise = ccApi.get(Currency.USD, Currency.USD);
  await expect(apiPromise).resolves.toEqual({ [Currency.USD]: 1 });
  expect(globalAny.fetch).not.toHaveBeenCalled();

  globalAny.fetch.mockRestore();
});

it('rejects on response error', async () => {
  // definition for 'global' does not have the 'fetch' method but we mock it anyway
  const globalAny = global as any;

  const error = { ok: false, error: 'test' };
  const mockFetchPromise = Promise.resolve(error);
  jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise);

  expect.assertions(1);

  const apiPromise = ccApi.get(Currency.USD, Currency.EUR);
  await expect(apiPromise).rejects.toEqual(error);

  globalAny.fetch.mockRestore();
});
