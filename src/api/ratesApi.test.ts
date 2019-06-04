import { Currency } from '../constants/currencies';
import rApi from './ratesApi';

describe('exchangeRatesApi', () => {
  it('fetches data from the right url', async () => {
    // definition for 'global' does not have the 'fetch' method but we mock it anyway
    const globalAny = global as any;

    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => undefined,
    });
    jest.spyOn(globalAny, 'fetch').mockImplementation(() => mockFetchPromise);

    await rApi.get(Currency.USD);
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
    expect(globalAny.fetch)
      .toHaveBeenLastCalledWith('https://api.ratesapi.io/latest?base=USD');

    await rApi.get(Currency.EUR);
    expect(globalAny.fetch).toHaveBeenCalledTimes(2);
    expect(globalAny.fetch)
      .toHaveBeenLastCalledWith('https://api.ratesapi.io/latest?base=EUR');

    globalAny.fetch.mockRestore();
  });

  it('resolves with response json', async () => {
    // definition for 'global' does not have the 'fetch' method but we mock it anyway
    const globalAny = global as any;

    const mockSuccessResponse = 'success';
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => mockSuccessResponse,
    });
    jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise);

    const apiPromise = rApi.get(Currency.USD);
    await expect(apiPromise).resolves.toBe(mockSuccessResponse);
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);

    globalAny.fetch.mockRestore();
  });

  it('rejects on response error', async () => {
    // definition for 'global' does not have the 'fetch' method but we mock it anyway
    const globalAny = global as any;

    const mockFetchPromise = Promise.resolve({ ok: false });
    jest.spyOn(globalAny, 'fetch').mockImplementationOnce(() => mockFetchPromise);

    expect.assertions(1);

    const apiPromise = rApi.get(Currency.USD);
    await expect(apiPromise).rejects.toHaveProperty('ok', false);

    globalAny.fetch.mockRestore();
  });
});
