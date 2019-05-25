export function parseCash(string: string): number {
  if (string.trim() === '.') {
    return 0;
  }

  return parseFloat(string);
}
