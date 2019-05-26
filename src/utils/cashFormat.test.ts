import { cashFormat } from './cashFormat';

describe('cashFormat', () => {
  it ('works correctly', () => {
    expect(cashFormat(100)).toEqual('100');
    expect(cashFormat(1.2)).toEqual('1.2');
    expect(cashFormat(1.02)).toEqual('1.02');
    expect(cashFormat(1.002)).toEqual('1');
    expect(cashFormat(1.009)).toEqual('1.01');
  });
});
