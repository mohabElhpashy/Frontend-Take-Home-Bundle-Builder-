import {
  createInitialState,
  indexProducts,
  type CartState,
} from '@/state/cart';
import { DEFAULT_VARIANT, type Catalog } from '@/types';

const STORAGE_KEY = 'wyze-bundle-builder:v1';

/**
 * Persist the configuration. Triggered explicitly by "Save my system for
 * later" so the link has real meaning; the saved config is what gets restored
 * on the next visit.
 */
export function saveState(state: CartState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/**
 * Load a previously saved configuration, defensively merged onto a fresh seed
 * so a changed catalog (new products/variants) never breaks an old save.
 * Returns null when there's nothing valid to restore.
 */
export function loadState(catalog: Catalog): CartState | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: Partial<CartState>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed.quantities !== 'object') return null;

  const base = createInitialState(catalog);
  const productsById = indexProducts(catalog);

  for (const [productId, byVariant] of Object.entries(parsed.quantities ?? {})) {
    const product = productsById[productId];
    if (!product || !byVariant || typeof byVariant !== 'object') continue;
    const validVariants = new Set(
      product.variants?.map((v) => v.id) ?? [DEFAULT_VARIANT],
    );
    for (const [variantId, qty] of Object.entries(byVariant)) {
      if (validVariants.has(variantId) && typeof qty === 'number') {
        base.quantities[productId][variantId] = Math.max(0, Math.round(qty));
      }
    }
  }

  for (const [productId, variantId] of Object.entries(parsed.activeVariant ?? {})) {
    if (productsById[productId] && typeof variantId === 'string') {
      base.activeVariant[productId] = variantId;
    }
  }

  const validSteps = new Set(['cameras', 'plan', 'sensors', 'protection']);
  if (parsed.openStep === null || validSteps.has(parsed.openStep as string)) {
    base.openStep = parsed.openStep ?? null;
  }

  return base;
}

export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
