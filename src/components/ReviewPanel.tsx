import { useState } from 'react';
import { useCart } from '../state/CartContext';
import {
  catalog,
  computeTotals,
  REVIEW_GROUP_ORDER,
  reviewLines,
  type ReviewLine,
} from '../state/cart';
import { formatMoney } from '../lib/money';
import { saveState } from '../lib/persistence';
import { ProductThumb } from './ProductThumb';
import { ProductIcon } from './icons';
import { QuantityStepper } from './QuantityStepper';
import { Price } from './Price';
import { SatisfactionBadge } from './SatisfactionBadge';
import styles from './ReviewPanel.module.css';

const GROUP_LABELS: Record<string, string> = {
  Cameras: 'CAMERAS',
  Sensors: 'SENSORS',
  Accessories: 'ACCESSORIES',
  Plan: 'PLAN',
};

export function ReviewPanel() {
  const { state, dispatch } = useCart();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);

  const lines = reviewLines(state);
  const totals = computeTotals(lines);
  const { shipping } = catalog;

  const grouped = REVIEW_GROUP_ORDER.map((group) => ({
    group,
    lines: lines.filter((l) => l.product.reviewGroup === group),
  })).filter((g) => g.lines.length > 0);

  // Only disambiguate with a variant label when a product has 2+ active lines.
  const linesPerProduct = lines.reduce<Record<string, number>>((acc, l) => {
    acc[l.product.id] = (acc[l.product.id] ?? 0) + 1;
    return acc;
  }, {});

  function handleSave() {
    if (saveState(state)) {
      setSavedAt('Saved! Your system will be here when you return.');
      window.setTimeout(() => setSavedAt(null), 3200);
    }
  }

  return (
    <aside className={styles.panel} aria-label="Order review">
      <p className={styles.eyebrow}>REVIEW</p>
      <h2 className={styles.title}>Your security system</h2>
      <p className={styles.subtitle}>
        Review your personalized protection system designed to keep what matters
        most safe.
      </p>

      <div className={styles.lines}>
        {grouped.map(({ group, lines }) => (
          <div className={styles.group} key={group}>
            <p className={styles.groupLabel}>{GROUP_LABELS[group]}</p>
            {lines.map((line) => (
              <ReviewRow
                key={line.key}
                line={line}
                showVariant={linesPerProduct[line.product.id] > 1}
                dispatch={dispatch}
              />
            ))}
          </div>
        ))}

        {/* Shipping is a fixed display row, not part of the totals. */}
        <div className={styles.row}>
          <div className={styles.rowMain}>
            <span className={styles.shipIcon}>
              <ProductIcon name={shipping.icon} />
            </span>
            <span className={styles.name}>{shipping.label}</span>
          </div>
          <Price
            price={shipping.price}
            compareAt={shipping.compareAt}
            freeWhenZero
            variant="review"
          />
        </div>
      </div>

      <div className={styles.summary}>
        <SatisfactionBadge />
        <div className={styles.summaryRight}>
          <span className={styles.financing}>
            as low as {formatMoney(totals.financingMonthly)}/mo
          </span>
          <div className={styles.totalRow}>
            {totals.savings > 0 && (
              <span className={styles.totalCompare}>
                {formatMoney(totals.compareTotal)}
              </span>
            )}
            <span className={styles.total}>{formatMoney(totals.total)}</span>
          </div>
        </div>
      </div>

      {totals.savings > 0 && (
        <p className={styles.savings}>
          Congrats! You're saving {formatMoney(totals.savings)} on your security
          bundle!
        </p>
      )}

      <button
        type="button"
        className={styles.checkout}
        onClick={() => {
          setCheckedOut(true);
          window.setTimeout(() => setCheckedOut(false), 3200);
        }}
      >
        {checkedOut ? '✓ Order placed (demo)' : 'Checkout'}
      </button>

      <button type="button" className={styles.saveLink} onClick={handleSave}>
        Save my system for later
      </button>

      <div className={styles.toast} role="status" aria-live="polite">
        {savedAt}
      </div>
    </aside>
  );
}

function ReviewRow({
  line,
  showVariant,
  dispatch,
}: {
  line: ReviewLine;
  showVariant: boolean;
  dispatch: ReturnType<typeof useCart>['dispatch'];
}) {
  const { product, variantId } = line;
  const isPlan = product.reviewGroup === 'Plan';

  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        <ProductThumb icon={product.icon} size="sm" />
        <span className={styles.name}>
          {isPlan ? <PlanName name={product.name} /> : product.name}
          {showVariant && line.variantLabel && (
            <span className={styles.variant}> · {line.variantLabel}</span>
          )}
        </span>
      </div>

      <div className={styles.rowControls}>
        {!isPlan && (
          <QuantityStepper
            size="sm"
            value={line.qty}
            min={product.required ? 1 : 0}
            label={`${product.name} quantity`}
            onDecrement={() =>
              dispatch({ type: 'STEP_QTY', productId: product.id, variantId, delta: -1 })
            }
            onIncrement={() =>
              dispatch({ type: 'STEP_QTY', productId: product.id, variantId, delta: 1 })
            }
          />
        )}
        <Price
          price={line.lineTotal}
          compareAt={line.lineCompareTotal}
          suffix={product.priceSuffix}
          freeWhenZero={product.freeWhenZero}
          variant="review"
        />
      </div>
    </div>
  );
}

/** "Cam Unlimited" -> "Cam" dark + "Unlimited" in the accent color. */
function PlanName({ name }: { name: string }) {
  const [first, ...rest] = name.split(' ');
  return (
    <>
      <strong className={styles.planFirst}>{first}</strong>
      {rest.length > 0 && <span className={styles.planRest}> {rest.join(' ')}</span>}
    </>
  );
}
