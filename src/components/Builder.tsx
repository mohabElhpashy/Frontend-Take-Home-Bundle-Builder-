import { useCart } from '../state/CartContext';
import { catalog, selectedCountForStep } from '../state/cart';
import { AccordionStep } from './AccordionStep';
import { ProductCard } from './ProductCard';
import styles from './Builder.module.css';

export function Builder() {
  const { state, dispatch } = useCart();
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
            selectedCount={selectedCountForStep(state, step.id)}
            onToggle={() => dispatch({ type: 'TOGGLE_STEP', stepId: step.id })}
          >
            <div className={styles.grid}>
              {products.map((product, idx) => {
                const wide = oddCount && idx === products.length - 1;
                return (
                  <div
                    key={product.id}
                    className={wide ? styles.wide : undefined}
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
                    const nextStep = steps[i + 1];
                    if (nextStep) dispatch({ type: 'OPEN_STEP', stepId: nextStep.id });
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
