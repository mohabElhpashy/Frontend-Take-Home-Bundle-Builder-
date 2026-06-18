import type { Product } from '../types';
import { useCart } from '../state/CartContext';
import { firstVariantId, productTotalQty } from '../state/cart';
import { ProductThumb } from './ProductThumb';
import { VariantSelector } from './VariantSelector';
import { QuantityStepper } from './QuantityStepper';
import { Price } from './Price';
import { Check } from './icons';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  selectionMode: 'single' | 'multi';
}

export function ProductCard({ product, selectionMode }: Props) {
  const { state, dispatch } = useCart();

  const activeVariant = state.activeVariant[product.id] ?? firstVariantId(product);
  const variantQty = state.quantities[product.id]?.[activeVariant] ?? 0;
  const totalQty = productTotalQty(state, product.id);
  const selected = totalQty > 0;

  return (
    <article className={`${styles.card} ${selected ? styles.selected : ''}`}>
      {product.badge && <span className={styles.badge}>{product.badge}</span>}

      <div className={styles.media}>
        <ProductThumb icon={product.icon} size="lg" />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>
        {product.description && (
          <p className={styles.desc}>
            {product.description}{' '}
            {product.learnMoreUrl && (
              <a
                className={styles.learn}
                href={product.learnMoreUrl}
                onClick={(e) => e.preventDefault()}
              >
                Learn More
              </a>
            )}
          </p>
        )}

        {product.variants && product.variants.length > 0 && (
          <VariantSelector
            variants={product.variants}
            activeId={activeVariant}
            onSelect={(variantId) =>
              dispatch({ type: 'SELECT_VARIANT', productId: product.id, variantId })
            }
          />
        )}

        <div className={styles.footer}>
          {selectionMode === 'single' ? (
            <button
              type="button"
              className={`${styles.select} ${selected ? styles.selectedBtn : ''}`}
              onClick={() => dispatch({ type: 'SELECT_SINGLE', productId: product.id })}
              aria-pressed={selected}
            >
              {selected && <Check className={styles.checkGlyph} />}
              {selected ? 'Selected' : 'Select'}
            </button>
          ) : (
            <QuantityStepper
              value={variantQty}
              min={product.required ? 1 : 0}
              label={`${product.name} quantity`}
              onDecrement={() =>
                dispatch({
                  type: 'STEP_QTY',
                  productId: product.id,
                  variantId: activeVariant,
                  delta: -1,
                })
              }
              onIncrement={() =>
                dispatch({
                  type: 'STEP_QTY',
                  productId: product.id,
                  variantId: activeVariant,
                  delta: 1,
                })
              }
            />
          )}

          <Price
            price={product.price}
            compareAt={product.compareAt}
            suffix={product.priceSuffix}
            freeWhenZero={product.freeWhenZero}
            variant="card"
          />
        </div>
      </div>
    </article>
  );
}
