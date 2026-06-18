/** Round to cents, guarding against floating-point drift (e.g. 0.1 + 0.2). */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(n: number): string {
  return `$${round2(n).toFixed(2)}`;
}
