import { describe, expect, it } from 'vitest';
import { formatMoney, round2 } from './money';

describe('round2', () => {
  it('rounds to two decimals', () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(2.345)).toBe(2.35);
  });

  it('guards against float drift', () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
  });
});

describe('formatMoney', () => {
  it('formats with a $ and two decimals', () => {
    expect(formatMoney(27.98)).toBe('$27.98');
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(5)).toBe('$5.00');
  });
});
