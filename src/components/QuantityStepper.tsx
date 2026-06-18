import { Minus, Plus } from './icons';
import styles from './QuantityStepper.module.css';

interface Props {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
  size?: 'md' | 'sm';
  label?: string;
}

export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  min = 0,
  max = 99,
  size = 'md',
  label = 'quantity',
}: Props) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className={`${styles.stepper} ${size === 'sm' ? styles.sm : ''}`}>
      <button
        type="button"
        className={styles.btn}
        onClick={onDecrement}
        disabled={atMin}
        aria-label={`Decrease ${label}`}
      >
        <Minus className={styles.glyph} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={onIncrement}
        disabled={atMax}
        aria-label={`Increase ${label}`}
      >
        <Plus className={styles.glyph} />
      </button>
    </div>
  );
}
