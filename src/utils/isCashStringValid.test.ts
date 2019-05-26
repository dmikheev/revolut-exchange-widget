import { isCashStringValid } from './isCashStringValid';

describe('isCashStringValid', () => {
  it('works correctly', () => {
    expect(isCashStringValid('10')).toEqual(true);
    expect(isCashStringValid('1.2')).toEqual(true);
    expect(isCashStringValid('.1')).toEqual(true);
    expect(isCashStringValid('1.')).toEqual(true);

    expect(isCashStringValid('1.123')).toEqual(false);
    expect(isCashStringValid('1,12')).toEqual(false);

    expect(isCashStringValid('a')).toEqual(false);
    expect(isCashStringValid('+')).toEqual(false);
    expect(isCashStringValid('=')).toEqual(false);
  });
});
