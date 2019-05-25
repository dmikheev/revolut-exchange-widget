export function isCashStringValid(value: string): boolean {
  return /^\d*(?:\.\d{0,2})?$/g.test(value);
}
