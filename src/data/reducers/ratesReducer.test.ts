import { Currency, CurrencyPair } from '../../constants/currencies';
import { RateActionType } from '../actions/rateActions';
import reducer from './ratesReducer';

describe('Rates reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({});
  });

  it('handles the FETCH_RATES_REQUEST action', () => {
    const pair = CurrencyPair.USD_EUR;
    expect(reducer(
      {
        [pair]: {
          isFetching: false,
        },
      },
      {
        data: { pair },
        type: RateActionType.FETCH_RATES_REQUEST,
      },
    )).toEqual({
      [pair]: {
        isFetching: true,
      },
    });

    expect(reducer({}, {
      data: { pair },
      type: RateActionType.FETCH_RATES_REQUEST,
    })).toEqual({
      [pair]: {
        isFetching: true,
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_SUCCESS action', () => {
    const pair = CurrencyPair.USD_EUR;
    const response = {
      [Currency.USD]: 0.8,
      [Currency.EUR]: 1.2,
    };
    expect(reducer(
      {
        [pair]: {
          isFetching: true,
        },
      },
      {
        data: { pair, response },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [pair]: {
        data: response,
        isFetching: false,
        isLoaded: true,
      },
    });

    expect(reducer(
      {},
      {
        data: { pair, response },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [pair]: {
        data: response,
        isFetching: false,
        isLoaded: true,
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_ERROR action', () => {
    const pair = CurrencyPair.USD_EUR;
    expect(reducer(
      {
        [pair]: {
          isFetching: true,
        },
      },
      {
        data: { pair },
        type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [pair]: {
        isFetching: false,
      },
    });

    expect(reducer(
      {},
      {
        data: { pair },
        type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [pair]: {
        isFetching: false,
      },
    });
  });
});
