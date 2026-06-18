import { formatMoney } from '../lib/money';
import styles from './Price.module.css';

interface Props {
  price: number;
  compareAt?: number | null;
  suffix?: string;
  /** Render 0 as "FREE". */
  freeWhenZero?: boolean;
  /** "card" struck price is red; "review" struck price is grey. */
  variant?: 'card' | 'review';
  align?: 'left' | 'right';
}

export function Price({
  price,
  compareAt,
  suffix = '',
  freeWhenZero = false,
  variant = 'card',
  align = 'right',
}: Props) {
  const showCompare = compareAt != null && compareAt > price;
  const isFree = freeWhenZero && price === 0;

  return (
    <div className={`${styles.price} ${styles[variant]} ${styles[align]}`}>
      {showCompare && (
        <span className={styles.compare}>
          {formatMoney(compareAt)}
          {suffix}
        </span>
      )}
      <span className={`${styles.active} ${isFree ? styles.free : ''}`}>
        {isFree ? 'FREE' : `${formatMoney(price)}${suffix}`}
      </span>
    </div>
  );
}
