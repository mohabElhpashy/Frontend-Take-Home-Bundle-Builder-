import {
  DEFAULT_VARIANT,
  type Catalog,
  type Product,
  type ReviewGroup,
  type StepId,
} from '@/types';
import { round2 } from '@/lib/money';

/**
 * All cart logic is pure: every function takes the `catalog` it needs as an
 * argument (or closes over it via createCartReducer). Nothing reads a global,
 * so reducers and selectors are trivially unit-testable.
 */

/** Order review groups render in, top to bottom. */
export const REVIEW_GROUP_ORDER: ReviewGroup[] = [
  'Cameras',
  'Sensors',
  'Accessories',
  'Plan',
];

/** Index products by id for O(1) lookups. */
export function indexProducts(catalog: Catalog): Record<string, Product> {
  return Object.fromEntries(catalog.products.map((p) => [p.id, p]));
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface CartState {
  /** quantities[productId][variantId] = qty */
  quantities: Record<string, Record<string, number>>;
  /** The variant currently shown on each product card. */
  activeVariant: Record<string, string>;
  /** Which accordion step is expanded (null = all collapsed). */
  openStep: StepId | null;
}

/** First variant id for a product, or the sentinel for variant-less products. */
export function firstVariantId(product: Product): string {
  return product.variants?.[0]?.id ?? DEFAULT_VARIANT;
}

/** Build the seeded initial state straight from the catalog. */
export function createInitialState(catalog: Catalog): CartState {
  const quantities: CartState['quantities'] = {};
  const activeVariant: CartState['activeVariant'] = {};

  for (const product of catalog.products) {
    const variantIds = product.variants?.map((v) => v.id) ?? [DEFAULT_VARIANT];
    quantities[product.id] = {};
    for (const vid of variantIds) {
      quantities[product.id][vid] = product.seed?.[vid] ?? 0;
    }
    activeVariant[product.id] = firstVariantId(product);
  }

  return {
    quantities,
    activeVariant,
    openStep: catalog.steps[0]?.id ?? null,
  };
}

// ---------------------------------------------------------------------------
// Actions + reducer
// ---------------------------------------------------------------------------

export type CartAction =
  | { type: 'SET_QTY'; productId: string; variantId: string; qty: number }
  | { type: 'STEP_QTY'; productId: string; variantId: string; delta: number }
  | { type: 'SELECT_VARIANT'; productId: string; variantId: string }
  | { type: 'SELECT_SINGLE'; productId: string }
  | { type: 'TOGGLE_STEP'; stepId: StepId }
  | { type: 'OPEN_STEP'; stepId: StepId }
  | { type: 'RESTORE'; state: CartState };

/** Clamp a quantity to the product's allowed range. */
function clampQty(product: Product | undefined, qty: number): number {
  const min = product?.required ? 1 : 0;
  return Math.max(min, Math.min(99, Math.round(qty)));
}

function withQty(
  state: CartState,
  productId: string,
  variantId: string,
  qty: number,
): CartState {
  return {
    ...state,
    quantities: {
      ...state.quantities,
      [productId]: { ...state.quantities[productId], [variantId]: qty },
    },
  };
}

export type CartReducer = (state: CartState, action: CartAction) => CartState;

/** Build a reducer bound to a catalog (for product lookups + single-select). */
export function createCartReducer(catalog: Catalog): CartReducer {
  const productsById = indexProducts(catalog);

  return function cartReducer(state, action) {
    switch (action.type) {
      case 'SET_QTY': {
        const qty = clampQty(productsById[action.productId], action.qty);
        return withQty(state, action.productId, action.variantId, qty);
      }
      case 'STEP_QTY': {
        const current =
          state.quantities[action.productId]?.[action.variantId] ?? 0;
        const qty = clampQty(
          productsById[action.productId],
          current + action.delta,
        );
        return withQty(state, action.productId, action.variantId, qty);
      }
      case 'SELECT_VARIANT': {
        return {
          ...state,
          activeVariant: {
            ...state.activeVariant,
            [action.productId]: action.variantId,
          },
        };
      }
      case 'SELECT_SINGLE': {
        // Single-select step (the plan): chosen product -> 1, siblings -> 0.
        const product = productsById[action.productId];
        if (!product) return state;
        const quantities = { ...state.quantities };
        for (const sibling of catalog.products) {
          if (sibling.step !== product.step) continue;
          const vid = firstVariantId(sibling);
          quantities[sibling.id] = {
            ...state.quantities[sibling.id],
            [vid]: sibling.id === action.productId ? 1 : 0,
          };
        }
        return { ...state, quantities };
      }
      case 'TOGGLE_STEP':
        return {
          ...state,
          openStep: state.openStep === action.stepId ? null : action.stepId,
        };
      case 'OPEN_STEP':
        return { ...state, openStep: action.stepId };
      case 'RESTORE':
        return action.state;
      default:
        return state;
    }
  };
}

// ---------------------------------------------------------------------------
// Selectors / derived data
// ---------------------------------------------------------------------------

export function productTotalQty(state: CartState, productId: string): number {
  const byVariant = state.quantities[productId];
  if (!byVariant) return 0;
  return Object.values(byVariant).reduce((sum, q) => sum + q, 0);
}

/** Distinct products with qty > 0 in a given step (the "N selected" count). */
export function selectedCountForStep(
  catalog: Catalog,
  state: CartState,
  stepId: StepId,
): number {
  return catalog.products.filter(
    (p) => p.step === stepId && productTotalQty(state, p.id) > 0,
  ).length;
}

export interface ReviewLine {
  key: string;
  product: Product;
  variantId: string;
  variantLabel?: string;
  qty: number;
  /** Active line total (unit * qty). */
  lineTotal: number;
  /** Compare-at line total, or null when there's no discount. */
  lineCompareTotal: number | null;
}

/** Every variant with qty > 0 becomes its own line, in catalog + group order. */
export function reviewLines(catalog: Catalog, state: CartState): ReviewLine[] {
  const lines: ReviewLine[] = [];

  for (const group of REVIEW_GROUP_ORDER) {
    for (const product of catalog.products) {
      if (product.reviewGroup !== group) continue;
      const variants = product.variants ?? [
        { id: DEFAULT_VARIANT, label: '', swatch: '' },
      ];
      for (const variant of variants) {
        const qty = state.quantities[product.id]?.[variant.id] ?? 0;
        if (qty <= 0) continue;
        const hasCompare =
          product.compareAt != null && product.compareAt > product.price;
        lines.push({
          key: `${product.id}__${variant.id}`,
          product,
          variantId: variant.id,
          variantLabel: product.variants ? variant.label : undefined,
          qty,
          lineTotal: round2(product.price * qty),
          lineCompareTotal: hasCompare
            ? round2((product.compareAt as number) * qty)
            : null,
        });
      }
    }
  }

  return lines;
}

export interface Totals {
  total: number;
  compareTotal: number;
  savings: number;
  financingMonthly: number;
}

export function computeTotals(catalog: Catalog, lines: ReviewLine[]): Totals {
  let total = 0;
  let compareTotal = 0;
  for (const line of lines) {
    total += line.lineTotal;
    compareTotal += line.lineCompareTotal ?? line.lineTotal;
  }
  total = round2(total);
  compareTotal = round2(compareTotal);
  return {
    total,
    compareTotal,
    savings: round2(compareTotal - total),
    financingMonthly: round2(total / catalog.financingDivisor),
  };
}
