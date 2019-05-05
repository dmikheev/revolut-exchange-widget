export function isCashStringValid(value: string): boolean {
  return /^\d+(?:\.\d{1,2})?$/g.test(value);
}
