import type { Variant } from '../types';
import styles from './VariantSelector.module.css';

interface Props {
  variants: Variant[];
  activeId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({ variants, activeId, onSelect }: Props) {
  return (
    <div className={styles.row} role="radiogroup" aria-label="Color">
      {variants.map((v) => {
        const active = v.id === activeId;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.chip} ${active ? styles.active : ''}`}
            onClick={() => onSelect(v.id)}
          >
            <span
              className={styles.swatch}
              style={{ background: v.swatch }}
              aria-hidden="true"
            />
            <span className={styles.label}>{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
