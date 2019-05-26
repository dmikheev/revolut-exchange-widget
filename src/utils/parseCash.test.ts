import { parseCash } from './parseCash';

describe('parseCash', () => {
  it('parses "." as 0', () => {
    expect(parseCash('.')).toEqual(0);
  });

  it('works as parseFloat for other values', () => {
    const valuesToCheck = ['12.34', '1.234', 'a', '10'];

    valuesToCheck.forEach((value) => {
      expect(parseCash(value)).toEqual(parseFloat(value));
    });
  });
});
