# Wyze Bundle Builder

A multi-step bundle builder with a live review panel, built as a React
prototype. A shopper assembles a home-security system through a 4-step
accordion on the left while a summary on the right recalculates in real time.

![Desktop](docs/desktop.png)

## Run it

Requires Node 18+ (developed on Node 20).

```bash
npm install
npm run dev      # start the dev server (Vite prints the local URL)
```

Other scripts:

```bash
npm run build    # type-check (tsc) + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
```

Builds and runs from a clean clone — `npm install && npm run dev`.

## What's implemented

- **4-step accordion builder** — Cameras / Plan / Sensors / Add extra protection.
  Step 1 is open on load; headers show `STEP X OF 4`, an icon, the title, and a
  state indicator (`N selected` + up-chevron when open, down-chevron when
  collapsed). Each open step ends with a **Next: …** button that advances.
- **Product cards** — optional discount badge, image, title, description,
  "Learn More", variant selector, quantity stepper, and compare-at + active
  pricing. Cards with quantity > 0 render in their **selected** (highlighted)
  state. Only the elements a product actually has are rendered.
- **Variant selector with per-variant quantities** — each color tracks its own
  count. The card's stepper is bound to the **active** variant: add 2 Black,
  switch to White, and the stepper reads White's count (0) while the 2 Black are
  untouched. Every variant with a count > 0 shows as its own line in the review.
- **Live review panel** — items grouped under Cameras / Sensors / Accessories /
  Plan, each with a thumbnail, name, its own stepper, and pricing. Below: a
  shipping row, satisfaction seal, financing line, total (pre-discount struck
  through), savings callout, Checkout, and Save link.
- **Synced steppers** — the card stepper and the review-panel stepper for the
  same product/variant always agree; changing either updates everything.
- **Persistence** — "Save my system for later" writes the configuration to
  `localStorage`; it's restored on the next visit / reload.
- **Responsive** — two columns on desktop (sticky review), collapsing to a
  single stacked column with the review below the builder on tablet/phone.
- **Checkout** — placeholder; shows an inline confirmation.

## Architecture

```
src/
  data/catalog.json        # single source of truth: steps, products, variants,
                           # prices, seed quantities, shipping
  types.ts                 # domain types the catalog is validated against
  state/
    cart.ts                # reducer + pricing/selectors (the core logic)
    CartContext.tsx        # context provider; restores saved state on init
  lib/
    money.ts               # cents-safe rounding + formatting
    persistence.ts         # localStorage load/save (defensive merge)
  components/              # ProductCard, VariantSelector, QuantityStepper,
                          # AccordionStep, Builder, ReviewPanel, Price, …
  styles/tokens.css        # design tokens (color/spacing/radius)
```

**Data-driven.** Everything renders from `catalog.json` — there is no
per-product markup. Add a product or a whole step by editing the JSON; the
builder, the review groups, the "N selected" counts, and the totals all follow.

**State.** A `useReducer` store keyed as `quantities[productId][variantId]`,
plus the active variant per product and the open step. The reducer is pure; all
derived values (review lines, totals, savings, financing) are computed by
selectors in `cart.ts`, so the UI is a projection of one state tree.

**Pricing.** Card prices are unit prices; review line prices are `unit × qty`.
The total = sum of one-time product line totals + the selected plan's monthly
price; savings = compare-at total − active total.

## Decisions & tradeoffs

- **Pricing made internally consistent.** The Figma's seeded numbers are
  self-inconsistent in one spot: the Wyze Cam Pan v3 *card* shows `$39.98 →
  $34.98`, but its *review line* (`$57.98 → $47.98` at qty 2) and the headline
  total (`$187.89`, save `$50.92`) only reconcile with a unit price of
  `$28.99 → $23.99`. I made the **review panel + grand total + savings match the
  design exactly** (the brief asks the app to "load looking exactly like the
  design," and those are the prominent numbers), which means the Pan v3 card
  shows `$28.99 → $23.99` rather than the Figma card's `$34.98`. Every other card
  matches the Figma, and all numbers in the app are now arithmetically coherent
  and recompute correctly as quantities change.
- **Save semantics.** Persistence is triggered by the **Save my system for
  later** link (not autosaved on every change) so the link has real meaning,
  matching the brief's "configure → save → leave → return" flow. Restoring on
  load defensively merges the save onto a fresh seed, so a changed catalog never
  breaks an old save. Switching to autosave-on-change would be a one-line change.
- **Plan step is single-select.** Picking a plan deselects the others
  (`selectionMode: "single"` in the catalog); the plan renders a Select/Selected
  toggle instead of a stepper, and the review plan line has no stepper — matching
  the design.
- **Product imagery is placeholder line icons** (`components/icons.tsx`) rather
  than the photography in the Figma, since the source images weren't available.
  `ProductThumb` is the single swap point for real `<img>` assets.
- **Variant labels in the review** only appear when a product has 2+ active
  variant lines (to disambiguate, e.g. "Wyze Cam v4 · Black"); a single variant
  shows just the product name, as in the design.
- **Selected-chip styling** is intentionally subtle per the brief, which asked
  to prioritize the selection/quantity behavior over chip highlighting.

## Not done / would do next

- A small backend serving `catalog.json` (the noted bonus) — it's a local file.
- Unit tests for the pricing selectors (the logic is isolated in `cart.ts` and
  easy to test); behavior was verified with a Puppeteer interaction script
  during development.
- Real product photography and the exact brand typeface (uses Poppins).

## Screenshots

| Desktop | Phone |
| --- | --- |
| ![desktop](docs/desktop.png) | ![mobile](docs/mobile.png) |
