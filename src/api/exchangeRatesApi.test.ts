import { Currency } from '../constants/currencies';
import erApi from './exchangeRatesApi';

describe('exchangeRatesApi', () => {
  it('fetches data from the right url', async () => {
    // definition for 'global' does not have the 'fetch' method but we mock it anyway
    const globalAny = global as any;

    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => undefined,
    });
    jest.spyOn(globalAny, 'fetch').mockImplementation(() => mockFetchPromise);

    await erApi.get(Currency.USD);
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
    expect(globalAny.fetch)
      .toHaveBeenLastCalledWith('https://api.exchangeratesapi.io/latest?base=USD');

    await erApi.get(Currency.EUR);
    expect(globalAny.fetch).toHaveBeenCalledTimes(2);
    expect(globalAny.fetch)
      .toHaveBeenLastCalledWith('https://api.exchangeratesapi.io/latest?base=EUR');

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

    const apiPromise = erApi.get(Currency.USD);
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

    const apiPromise = erApi.get(Currency.USD);
    await expect(apiPromise).rejects.toHaveProperty('ok', false);

    globalAny.fetch.mockRestore();
  });
});
