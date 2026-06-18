import type { IconName } from '../types';
import { ProductIcon } from './icons';
import styles from './ProductThumb.module.css';

/**
 * Placeholder product imagery: a line icon in a neutral rounded tile.
 * Swap for real photography by rendering an <img> here.
 */
export function ProductThumb({
  icon,
  size = 'md',
}: {
  icon: IconName;
  size?: 'lg' | 'md' | 'sm';
}) {
  return (
    <div className={`${styles.thumb} ${styles[size]}`}>
      <ProductIcon name={icon} className={styles.icon} />
    </div>
  );
}
