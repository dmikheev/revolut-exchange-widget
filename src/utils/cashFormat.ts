export function cashFormat(num: number): string {
  return (Math.floor(num * 100) / 100).toString();
}
