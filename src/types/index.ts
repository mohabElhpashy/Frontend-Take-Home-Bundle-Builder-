import { z } from 'zod';

/**
 * Domain schemas for the bundle builder. These zod schemas are the single
 * source of truth: the API response is parsed against `CatalogSchema` at the
 * boundary (see api/useCatalog.ts) and all TS types are inferred from them.
 */

export const StepIdSchema = z.enum(['cameras', 'plan', 'sensors', 'protection']);
export type StepId = z.infer<typeof StepIdSchema>;

export const ReviewGroupSchema = z.enum([
  'Cameras',
  'Sensors',
  'Accessories',
  'Plan',
]);
export type ReviewGroup = z.infer<typeof ReviewGroupSchema>;

export const IconNameSchema = z.enum([
  'camera',
  'pan-camera',
  'floodlight',
  'doorbell',
  'battery-cam',
  'motion',
  'hub',
  'entry',
  'sdcard',
  'solar',
  'plan',
  'shield',
  'sensor',
  'grid',
  'truck',
]);
export type IconName = z.infer<typeof IconNameSchema>;

export const VariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** CSS color used to render the swatch dot. */
  swatch: z.string(),
  /** Optional per-variant photo; overrides the product's `image` when active. */
  image: z.string().optional(),
});
export type Variant = z.infer<typeof VariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  step: StepIdSchema,
  reviewGroup: ReviewGroupSchema,
  name: z.string(),
  description: z.string().optional(),
  learnMoreUrl: z.string().optional(),
  icon: IconNameSchema,
  /** Optional product photo (e.g. "/images/cam-v4.png"). Falls back to `icon`. */
  image: z.string().optional(),
  badge: z.string().optional(),
  /** Active unit price. */
  price: z.number(),
  /** Optional struck-through compare-at unit price. */
  compareAt: z.number().optional(),
  /** e.g. "/mo" for subscription plans. */
  priceSuffix: z.string().optional(),
  /** Renders the active price as "FREE" instead of "$0.00". */
  freeWhenZero: z.boolean().optional(),
  /** Required items can't be removed (stepper min is 1). */
  required: z.boolean().optional(),
  variants: z.array(VariantSchema).optional(),
  /** Initial quantities, keyed by variant id (or DEFAULT_VARIANT). */
  seed: z.record(z.string(), z.number()).optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const StepDefSchema = z.object({
  id: StepIdSchema,
  /** "STEP 1 OF 4" is derived from order; this is the headline title. */
  title: z.string(),
  icon: IconNameSchema,
  /** Label on the "Next: ..." button. Null on the final step. */
  nextLabel: z.string().nullable(),
  /** Step the "Next" button opens. Defaults to the next step in order. */
  nextStep: StepIdSchema.optional(),
  /** When true, the "Next" button scrolls to the checkout/review instead. */
  checkout: z.boolean().optional(),
  /** "single" = picking one option deselects the others (e.g. the plan). */
  selectionMode: z.enum(['single', 'multi']),
});
export type StepDef = z.infer<typeof StepDefSchema>;

export const ShippingLineSchema = z.object({
  label: z.string(),
  icon: IconNameSchema,
  compareAt: z.number(),
  price: z.number(),
});
export type ShippingLine = z.infer<typeof ShippingLineSchema>;

export const CatalogSchema = z.object({
  steps: z.array(StepDefSchema),
  products: z.array(ProductSchema),
  shipping: ShippingLineSchema,
  /** Divisor for the "as low as $X/mo" financing line (X = total / divisor). */
  financingDivisor: z.number(),
});
export type Catalog = z.infer<typeof CatalogSchema>;

/** Variant key used for products that have no color options. */
export const DEFAULT_VARIANT = 'default';
