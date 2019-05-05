export function cashFormat(num: number): string {
  return (Math.round(num * 100) / 100).toString();
}
