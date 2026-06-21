import styles from './SatisfactionBadge.module.css';

/** "100% Wyze satisfaction guarantee" seal. */
export function SatisfactionBadge() {
  return (
    <img
      className={styles.badge}
      src="/images/satisfaction-guarantee.png"
      alt="100% Wyze satisfaction guarantee"
    />
  );
}
