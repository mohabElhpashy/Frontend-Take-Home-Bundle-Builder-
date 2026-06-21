import type { CSSProperties } from 'react';
import { useCart } from '@/state/CartContext';
import { selectedCountForStep } from '@/state/cart';
import { AccordionStep } from './AccordionStep';
import { ProductCard } from './ProductCard';
import styles from './Builder.module.css';

export function Builder() {
  const { catalog, state, dispatch } = useCart();
  const steps = catalog.steps;

  return (
    <div className={styles.builder}>
      {steps.map((step, i) => {
        const products = catalog.products.filter((p) => p.step === step.id);
        const open = state.openStep === step.id;
        const oddCount = products.length % 2 === 1;

        return (
          <AccordionStep
            key={step.id}
            step={step}
            index={i + 1}
            total={steps.length}
            open={open}
            selectedCount={selectedCountForStep(catalog, state, step.id)}
            onToggle={() => dispatch({ type: 'TOGGLE_STEP', stepId: step.id })}
          >
            {/* 2-up by default, 1-up on phones, one row at xl (>=1280). */}
            <div
              className="grid gap-[13px] grid-cols-2 max-[599px]:grid-cols-1 xl:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
              style={{ '--cols': products.length } as CSSProperties}
            >
              {products.map((product, idx) => {
                const centered = oddCount && idx === products.length - 1;
                return (
                  <div
                    key={product.id}
                    className={`${styles.cell} ${centered ? styles.wide : ''}`}
                  >
                    <ProductCard
                      product={product}
                      selectionMode={step.selectionMode}
                    />
                  </div>
                );
              })}
            </div>

            {step.nextLabel && (
              <div className={styles.nextRow}>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => {
                    if (step.checkout) {
                      document
                        .getElementById('review')
                        ?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }
                    const nextId = step.nextStep ?? steps[i + 1]?.id;
                    if (nextId) dispatch({ type: 'OPEN_STEP', stepId: nextId });
                  }}
                >
                  {step.nextLabel}
                </button>
              </div>
            )}
          </AccordionStep>
        );
      })}
    </div>
  );
}
