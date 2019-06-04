import { Currency } from '../../constants/currencies';
import { RateActionType } from '../actions/rateActions';
import reducer from './ratesReducer';

describe('Rates reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({});
  });

  it('handles the FETCH_RATES_REQUEST action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: false,
        },
      },
      {
        data: {
          currency: Currency.USD,
        },
        type: RateActionType.FETCH_RATES_REQUEST,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: true,
      },
    });

    expect(reducer({}, {
      data: {
        currency: Currency.USD,
      },
      type: RateActionType.FETCH_RATES_REQUEST,
    })).toEqual({
      [Currency.USD]: {
        isFetching: true,
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_SUCCESS action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: true,
        },
      },
      {
        data: {
          currency: Currency.USD,
          response: {
            base: Currency.USD,
            date: '2019-05-31',
            rates: {
              [Currency.EUR]: 0.8,
            },
          },
        },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.EUR]: 0.8,
        },
      },
    });

    expect(reducer(
      {},
      {
        data: {
          currency: Currency.USD,
          response: {
            base: Currency.USD,
            date: '2019-05-31',
            rates: {
              [Currency.EUR]: 0.8,
            },
          },
        },
        type: RateActionType.FETCH_RATES_RESPONSE_SUCCESS,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
        isLoaded: true,
        rates: {
          [Currency.EUR]: 0.8,
        },
      },
    });
  });

  it('handles the FETCH_RATES_RESPONSE_ERROR action', () => {
    expect(reducer(
      {
        [Currency.USD]: {
          isFetching: true,
        },
      },
      {
        data: { currency: Currency.USD },
        type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
      },
    });

    expect(reducer(
      {},
      {
        data: { currency: Currency.USD },
        type: RateActionType.FETCH_RATES_RESPONSE_ERROR,
      },
    )).toEqual({
      [Currency.USD]: {
        isFetching: false,
      },
    });
  });
});
