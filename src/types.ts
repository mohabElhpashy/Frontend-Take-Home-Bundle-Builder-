// Domain types for the bundle builder. The catalog is loaded from
// src/data/catalog.json and validated against these shapes at the boundary.

export type StepId = 'cameras' | 'plan' | 'sensors' | 'protection';

export type ReviewGroup = 'Cameras' | 'Sensors' | 'Accessories' | 'Plan';

export type IconName =
  | 'camera'
  | 'pan-camera'
  | 'floodlight'
  | 'doorbell'
  | 'battery-cam'
  | 'motion'
  | 'hub'
  | 'entry'
  | 'sdcard'
  | 'solar'
  | 'plan'
  | 'shield'
  | 'sensor'
  | 'grid'
  | 'truck';

export interface StepDef {
  id: StepId;
  /** "STEP 1 OF 4" is derived from order; this is the headline title. */
  title: string;
  icon: IconName;
  /** Label on the "Next: ..." button. Null on the final step. */
  nextLabel: string | null;
  /** "single" = picking one option deselects the others (e.g. the plan). */
  selectionMode: 'single' | 'multi';
}

export interface Variant {
  id: string;
  label: string;
  /** CSS color used to render the swatch dot. */
  swatch: string;
}

export interface Product {
  id: string;
  step: StepId;
  reviewGroup: ReviewGroup;
  name: string;
  description?: string;
  learnMoreUrl?: string;
  icon: IconName;
  badge?: string;
  /** Active unit price. */
  price: number;
  /** Optional struck-through compare-at unit price. */
  compareAt?: number;
  /** e.g. "/mo" for subscription plans. Empty for one-time products. */
  priceSuffix?: string;
  /** Renders the active price as "FREE" instead of "$0.00". */
  freeWhenZero?: boolean;
  /** Required items can't be removed (stepper min is 1, minus disabled). */
  required?: boolean;
  variants?: Variant[];
  /** Initial quantities, keyed by variant id (or DEFAULT_VARIANT for none). */
  seed?: Record<string, number>;
}

export interface ShippingLine {
  label: string;
  icon: IconName;
  compareAt: number;
  price: number;
}

export interface Catalog {
  steps: StepDef[];
  products: Product[];
  shipping: ShippingLine;
  /**
   * Divisor for the "as low as $X/mo" financing line (X = total / divisor).
   * Tuned to ~9.79 so the seeded total renders as the design's $19.19/mo.
   */
  financingDivisor: number;
}

/** Variant key used for products that have no color options. */
export const DEFAULT_VARIANT = 'default';
