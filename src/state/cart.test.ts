import { describe, expect, it } from 'vitest';
import { testCatalog } from '@/test/fixtures';
import {
  computeTotals,
  createCartReducer,
  createInitialState,
  reviewLines,
  selectedCountForStep,
} from './cart';

const reducer = createCartReducer(testCatalog);
const initial = () => createInitialState(testCatalog);

describe('createInitialState', () => {
  it('seeds quantities from the catalog', () => {
    const s = initial();
    expect(s.quantities['cam-v4'].white).toBe(1);
    expect(s.quantities['cam-v4'].black).toBe(0);
    expect(s.quantities['plan-unlimited'].default).toBe(1);
    expect(s.openStep).toBe('cameras');
  });
});

describe('cartReducer', () => {
  it('STEP_QTY increments and clamps at 0 (not required)', () => {
    let s = initial();
    s = reducer(s, { type: 'STEP_QTY', productId: 'cam-v4', variantId: 'white', delta: 1 });
    expect(s.quantities['cam-v4'].white).toBe(2);
    s = reducer(s, { type: 'STEP_QTY', productId: 'cam-v4', variantId: 'white', delta: -5 });
    expect(s.quantities['cam-v4'].white).toBe(0);
  });

  it('SET_QTY clamps to the 0..99 range', () => {
    let s = initial();
    s = reducer(s, { type: 'SET_QTY', productId: 'cam-v4', variantId: 'white', qty: 999 });
    expect(s.quantities['cam-v4'].white).toBe(99);
  });

  it('SELECT_SINGLE sets the chosen plan to 1 and siblings to 0', () => {
    let s = initial();
    s = reducer(s, { type: 'SELECT_SINGLE', productId: 'plan-basic' });
    expect(s.quantities['plan-basic'].default).toBe(1);
    expect(s.quantities['plan-unlimited'].default).toBe(0);
  });

  it('TOGGLE_STEP opens then collapses', () => {
    let s = initial(); // cameras open
    s = reducer(s, { type: 'TOGGLE_STEP', stepId: 'cameras' });
    expect(s.openStep).toBeNull();
    s = reducer(s, { type: 'TOGGLE_STEP', stepId: 'plan' });
    expect(s.openStep).toBe('plan');
  });

  it('tracks each variant independently; switching active keeps other counts', () => {
    // Spec example: add 2 of White, then select Black.
    let s = initial();
    s = reducer(s, { type: 'SET_QTY', productId: 'cam-v4', variantId: 'white', qty: 2 });
    s = reducer(s, { type: 'SELECT_VARIANT', productId: 'cam-v4', variantId: 'black' });

    // Active variant is now Black, whose count is its own (0)...
    expect(s.activeVariant['cam-v4']).toBe('black');
    expect(s.quantities['cam-v4'].black).toBe(0);
    // ...while the 2 White are untouched...
    expect(s.quantities['cam-v4'].white).toBe(2);
    // ...and White still appears as its own review line.
    const whiteLine = reviewLines(testCatalog, s).find(
      (l) => l.product.id === 'cam-v4' && l.variantId === 'white',
    );
    expect(whiteLine?.qty).toBe(2);
  });

  it('is immutable (returns a new state object)', () => {
    const s = initial();
    const next = reducer(s, { type: 'STEP_QTY', productId: 'cam-v4', variantId: 'white', delta: 1 });
    expect(next).not.toBe(s);
    expect(s.quantities['cam-v4'].white).toBe(1); // original untouched
  });
});

describe('selectors', () => {
  it('selectedCountForStep counts distinct products with qty > 0', () => {
    const s = initial();
    expect(selectedCountForStep(testCatalog, s, 'cameras')).toBe(1);
    expect(selectedCountForStep(testCatalog, s, 'plan')).toBe(1);
  });

  it('reviewLines emits a line per selected variant with correct totals', () => {
    let s = initial();
    s = reducer(s, { type: 'SET_QTY', productId: 'cam-v4', variantId: 'white', qty: 2 });
    const lines = reviewLines(testCatalog, s);
    const cam = lines.find((l) => l.product.id === 'cam-v4');
    expect(cam?.qty).toBe(2);
    expect(cam?.lineTotal).toBe(55.96); // 27.98 * 2
    expect(cam?.lineCompareTotal).toBe(71.96); // 35.98 * 2
  });
});

describe('computeTotals', () => {
  it('sums totals, savings and financing', () => {
    const s = initial(); // 1 cam-v4 white + 1 plan-unlimited
    const totals = computeTotals(testCatalog, reviewLines(testCatalog, s));
    expect(totals.total).toBe(37.97); // 27.98 + 9.99
    expect(totals.compareTotal).toBe(45.97); // 35.98 + 9.99
    expect(totals.savings).toBe(8); // 45.97 - 37.97
    expect(totals.financingMonthly).toBe(3.8); // 37.97 / 10
  });
});
